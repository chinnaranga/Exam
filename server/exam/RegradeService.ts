import crypto from 'crypto';
import {
  RegradeRequest,
  DisputedQuestionRequest,
} from './questionTypes';
import {
  AppealsAndRetentionService,
  appealsAndRetentionService,
} from '../integrity/AppealsAndRetentionService';
import {
  ExamSessionAuthority,
  examSessionAuthority,
} from '../integrity/ExamSessionAuthority';

export class RegradeService {
  private regrades: Map<string, RegradeRequest> = new Map();
  private appealsService: AppealsAndRetentionService;
  private authority: ExamSessionAuthority;

  constructor(
    appealsService: AppealsAndRetentionService = appealsAndRetentionService,
    authority: ExamSessionAuthority = examSessionAuthority
  ) {
    this.appealsService = appealsService;
    this.authority = authority;
  }

  /**
   * Candidate submits a regrade request for specific disputed questions.
   * Enforces that the session is within its valid post-exam appeal window.
   */
  public submitRegradeRequest(params: {
    sessionId: string;
    candidateId: string;
    examId: string;
    disputedQuestions: DisputedQuestionRequest[];
    originalTotalScore: number;
    nowMs?: number;
  }): RegradeRequest {
    const now = params.nowMs || Date.now();

    // Verify appeal window is still active
    let isOpen = this.appealsService.isAppealWindowOpen(params.sessionId, now);
    if (!isOpen) {
      const session = this.authority.getSession(params.sessionId);
      if (session && (session.status === 'SUBMITTED' || session.status === 'AUTO_SUBMITTED' || session.submittedAt)) {
        const completedAt = session.submittedAt || session.deadline;
        const windowMs = 7 * 24 * 60 * 60 * 1000;
        if (now <= completedAt + windowMs) {
          isOpen = true;
        }
      }
    }

    if (!isOpen) {
      throw new Error(`Appeal and regrade window has expired for session "${params.sessionId}".`);
    }

    if (!params.disputedQuestions || params.disputedQuestions.length === 0) {
      throw new Error('At least one disputed question must be provided.');
    }

    const regradeId = `regrade_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    const regrade: RegradeRequest = {
      regradeId,
      sessionId: params.sessionId,
      candidateId: params.candidateId,
      examId: params.examId,
      submittedAt: now,
      disputedQuestions: params.disputedQuestions,
      status: 'PENDING',
      originalTotalScore: params.originalTotalScore,
    };

    this.regrades.set(regradeId, regrade);

    // Commit to authoritative session ledger
    const session = this.authority.getSession(params.sessionId);
    if (session) {
      this.authority.appendLedgerRecord(session, {
        type: 'REGRADE_REQUESTED',
        ts: now,
        payload: {
          regradeId,
          candidateId: params.candidateId,
          disputedQuestionsCount: params.disputedQuestions.length,
          originalTotalScore: params.originalTotalScore,
        },
      });
    }

    return regrade;
  }

  /**
   * Faculty / Chief Invigilator evaluates and resolves a regrade dispute.
   */
  public resolveRegradeRequest(params: {
    regradeId: string;
    decision: 'APPROVED' | 'PARTIALLY_APPROVED' | 'REJECTED';
    reviewerId: string;
    reviewerNotes: string;
    newTotalScore?: number;
    nowMs?: number;
  }): RegradeRequest {
    const regrade = this.regrades.get(params.regradeId);
    if (!regrade) {
      throw new Error(`Regrade request "${params.regradeId}" not found.`);
    }

    const now = params.nowMs || Date.now();
    regrade.status = params.decision;
    regrade.reviewerId = params.reviewerId;
    regrade.reviewerNotes = params.reviewerNotes;
    regrade.reviewedAt = now;

    if (params.decision === 'APPROVED' || params.decision === 'PARTIALLY_APPROVED') {
      regrade.newTotalScore = params.newTotalScore ?? regrade.originalTotalScore;
      regrade.revisedTotalScore = regrade.newTotalScore;
      regrade.scoreAdjustmentDelta =
        Math.round((regrade.newTotalScore - regrade.originalTotalScore) * 100) / 100;
    } else {
      regrade.newTotalScore = regrade.originalTotalScore;
      regrade.revisedTotalScore = regrade.newTotalScore;
      regrade.scoreAdjustmentDelta = 0;
    }

    // Write resolution to ledger
    const session = this.authority.getSession(regrade.sessionId);
    if (session) {
      this.authority.appendLedgerRecord(session, {
        type: 'REGRADE_RESOLVED',
        ts: now,
        payload: {
          regradeId: regrade.regradeId,
          decision: params.decision,
          reviewerId: params.reviewerId,
          originalScore: regrade.originalTotalScore,
          newScore: regrade.newTotalScore,
          adjustmentDelta: regrade.scoreAdjustmentDelta,
        },
      });
    }

    return regrade;
  }

  /**
   * Convenience alias for resolveRegradeRequest
   */
  public resolveRegrade(params: {
    regradeId: string;
    reviewerId: string;
    status: 'APPROVED' | 'PARTIALLY_APPROVED' | 'REJECTED';
    revisedTotalScore?: number;
    newTotalScore?: number;
    reviewerNotes: string;
    nowMs?: number;
  }): RegradeRequest {
    return this.resolveRegradeRequest({
      regradeId: params.regradeId,
      decision: params.status,
      reviewerId: params.reviewerId,
      reviewerNotes: params.reviewerNotes,
      newTotalScore: params.revisedTotalScore ?? params.newTotalScore,
      nowMs: params.nowMs,
    });
  }

  public getRegrade(regradeId: string): RegradeRequest | undefined {
    return this.regrades.get(regradeId);
  }

  public getSessionRegrades(sessionId: string): RegradeRequest[] {
    return Array.from(this.regrades.values()).filter((r) => r.sessionId === sessionId);
  }

  public clear(): void {
    this.regrades.clear();
  }
}

export const regradeService = new RegradeService();
export default regradeService;
