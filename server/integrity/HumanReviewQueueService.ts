import { ExamSessionAuthority, examSessionAuthority } from './ExamSessionAuthority';

export type ReviewDecision = 'CLEAR' | 'WARN' | 'INVALIDATE';
export type QueueItemStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED';

export interface FlaggedSessionItem {
  sessionId: string;
  candidateId: string;
  candidateName?: string;
  examId: string;
  flagReasons: string[];
  integrityConfidenceScore: number;
  violationPoints: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: QueueItemStatus;
  assignedReviewerId: string | null;
  assignedAt: number | null;
  decision: ReviewDecision | null;
  decisionNotes: string | null;
  resolvedAt: number | null;
  enqueuedAt: number;
}

export interface ReviewAuditLogEntry {
  auditId: string;
  sessionId: string;
  action: 'ENQUEUED' | 'ASSIGNED' | 'DECISION_MADE' | 'NOTES_UPDATED' | 'ESCALATED';
  actorId: string;
  timestamp: number;
  previousStatus?: string;
  newStatus: string;
  decision?: ReviewDecision;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export class HumanReviewQueueService {
  private queue: Map<string, FlaggedSessionItem> = new Map();
  private auditLogs: ReviewAuditLogEntry[] = [];
  private authority: ExamSessionAuthority;

  constructor(authority: ExamSessionAuthority = examSessionAuthority) {
    this.authority = authority;
  }

  /**
   * Enqueues an examination session into the Human Review Queue.
   */
  public enqueueSession(item: {
    sessionId: string;
    candidateId: string;
    candidateName?: string;
    examId: string;
    flagReasons: string[];
    integrityConfidenceScore: number;
    violationPoints: number;
  }): FlaggedSessionItem {
    // Determine priority
    let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM';
    if (item.violationPoints >= 8 || item.integrityConfidenceScore < 40) {
      priority = 'URGENT';
    } else if (item.violationPoints >= 4 || item.integrityConfidenceScore < 60) {
      priority = 'HIGH';
    } else if (item.violationPoints >= 2) {
      priority = 'MEDIUM';
    } else {
      priority = 'LOW';
    }

    const enqueuedItem: FlaggedSessionItem = {
      sessionId: item.sessionId,
      candidateId: item.candidateId,
      candidateName: item.candidateName || `Candidate ${item.candidateId}`,
      examId: item.examId,
      flagReasons: item.flagReasons,
      integrityConfidenceScore: item.integrityConfidenceScore,
      violationPoints: item.violationPoints,
      priority,
      status: 'PENDING',
      assignedReviewerId: null,
      assignedAt: null,
      decision: null,
      decisionNotes: null,
      resolvedAt: null,
      enqueuedAt: Date.now(),
    };

    this.queue.set(item.sessionId, enqueuedItem);

    this.recordAudit({
      sessionId: item.sessionId,
      action: 'ENQUEUED',
      actorId: 'INTEGRITY_ENGINE',
      newStatus: 'PENDING',
      metadata: { priority, flagReasons: item.flagReasons },
    });

    // Write to hash-chained ledger
    const session = this.authority.getSession(item.sessionId);
    if (session) {
      this.authority.appendLedgerRecord(session, {
        type: 'HUMAN_REVIEW_ENQUEUED',
        ts: Date.now(),
        payload: { priority, flagReasons: item.flagReasons },
      });
    }

    return enqueuedItem;
  }

  /**
   * Assigns a reviewer to a flagged session in the queue.
   */
  public assignReviewer(sessionId: string, reviewerId: string): FlaggedSessionItem {
    const item = this.queue.get(sessionId);
    if (!item) {
      throw new Error(`Session "${sessionId}" not found in review queue.`);
    }

    const prevStatus = item.status;
    item.assignedReviewerId = reviewerId;
    item.assignedAt = Date.now();
    item.status = 'IN_REVIEW';

    this.recordAudit({
      sessionId,
      action: 'ASSIGNED',
      actorId: reviewerId,
      previousStatus: prevStatus,
      newStatus: 'IN_REVIEW',
    });

    const session = this.authority.getSession(sessionId);
    if (session) {
      this.authority.appendLedgerRecord(session, {
        type: 'HUMAN_REVIEWER_ASSIGNED',
        ts: Date.now(),
        payload: { reviewerId },
      });
    }

    return item;
  }

  /**
   * Records a formal review decision (CLEAR, WARN, or INVALIDATE) with reviewer notes.
   */
  public recordDecision(
    sessionId: string,
    decision: ReviewDecision,
    reviewerId: string,
    notes: string
  ): FlaggedSessionItem {
    const item = this.queue.get(sessionId);
    if (!item) {
      throw new Error(`Session "${sessionId}" not found in review queue.`);
    }

    const prevStatus = item.status;
    item.decision = decision;
    item.decisionNotes = notes;
    item.assignedReviewerId = reviewerId;
    item.status = 'RESOLVED';
    item.resolvedAt = Date.now();

    this.recordAudit({
      sessionId,
      action: 'DECISION_MADE',
      actorId: reviewerId,
      previousStatus: prevStatus,
      newStatus: 'RESOLVED',
      decision,
      notes,
    });

    // Write to session ledger for legal auditability
    const session = this.authority.getSession(sessionId);
    if (session) {
      this.authority.appendLedgerRecord(session, {
        type: `HUMAN_REVIEW_DECISION_${decision}`,
        ts: Date.now(),
        payload: {
          decision,
          reviewerId,
          notes,
          timestamp: item.resolvedAt,
        },
      });

      if (decision === 'INVALIDATE') {
        session.status = 'TERMINATED';
      }
    }

    return item;
  }

  public getQueue(filterStatus?: QueueItemStatus): FlaggedSessionItem[] {
    const list = Array.from(this.queue.values());
    if (filterStatus) {
      return list.filter((item) => item.status === filterStatus);
    }
    return list.sort((a, b) => {
      // Prioritize urgent then newest
      const pOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const diff = pOrder[b.priority] - pOrder[a.priority];
      return diff !== 0 ? diff : b.enqueuedAt - a.enqueuedAt;
    });
  }

  public getSessionItem(sessionId: string): FlaggedSessionItem | undefined {
    return this.queue.get(sessionId);
  }

  public getAuditTrail(sessionId?: string): ReviewAuditLogEntry[] {
    if (sessionId) {
      return this.auditLogs.filter((log) => log.sessionId === sessionId);
    }
    return [...this.auditLogs];
  }

  private recordAudit(entry: Omit<ReviewAuditLogEntry, 'auditId' | 'timestamp'>): void {
    this.auditLogs.push({
      ...entry,
      auditId: `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: Date.now(),
    });
  }
}

export const humanReviewQueueService = new HumanReviewQueueService();

