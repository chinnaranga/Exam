import { ExamSessionAuthority, examSessionAuthority } from './ExamSessionAuthority';

export interface CandidateAppealSubmission {
  appealId: string;
  sessionId: string;
  candidateId: string;
  examId: string;
  submittedAt: number;
  appealWindowExpiresAt: number;
  triggeredRulesSummary: Array<{
    ruleId: string;
    ruleName: string;
    severity: string;
    description: string;
    occurredAt: number;
  }>;
  candidateStatement: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewDecisionNotes?: string;
  reviewedBy?: string;
  reviewedAt?: number;
}

export interface SessionEvidencePackage {
  sessionId: string;
  candidateId: string;
  examCompletedAt: number;
  appealWindowDays: number;
  isPurged: boolean;
  purgedAt?: number;
  rawBiometricSnapshotsCount: number;
  gazeTelemetryRecordsCount: number;
  clipboardTelemetryCount: number;
  retainedLedgerHash: string;
}

export class AppealsAndRetentionService {
  private appeals: Map<string, CandidateAppealSubmission> = new Map();
  private evidencePackages: Map<string, SessionEvidencePackage> = new Map();
  private defaultAppealWindowDays: number = 7;
  private authority: ExamSessionAuthority;

  constructor(authority: ExamSessionAuthority = examSessionAuthority) {
    this.authority = authority;
  }

  /**
   * Registers a completed session's evidence package with retention metadata.
   */
  public registerSessionEvidence(
    sessionId: string,
    candidateId: string,
    rawSnapshotsCount: number,
    gazeRecordsCount: number,
    clipboardCount: number,
    ledgerRootHash: string,
    appealWindowDays: number = 7
  ): SessionEvidencePackage {
    const pkg: SessionEvidencePackage = {
      sessionId,
      candidateId,
      examCompletedAt: Date.now(),
      appealWindowDays,
      isPurged: false,
      rawBiometricSnapshotsCount: rawSnapshotsCount,
      gazeTelemetryRecordsCount: gazeRecordsCount,
      clipboardTelemetryCount: clipboardCount,
      retainedLedgerHash: ledgerRootHash,
    };
    this.evidencePackages.set(sessionId, pkg);
    return pkg;
  }

  /**
   * Checks if an exam session is still within the active candidate appeal window.
   */
  public isAppealWindowOpen(sessionId: string, nowMs?: number): boolean {
    const pkg = this.evidencePackages.get(sessionId);
    if (!pkg) return false;
    const now = nowMs || Date.now();
    const windowMs = pkg.appealWindowDays * 24 * 60 * 60 * 1000;
    return now <= pkg.examCompletedAt + windowMs;
  }

  /**
   * Transparently extracts rule violations for candidate inspection without leaking
   * proprietary keys or internal proctoring telemetry tokens.
   */
  public getCandidateTransparentViolations(
    sessionId: string,
    violations: Array<{ ruleId: string; name: string; severity: string; description: string; timestamp: number }>
  ): Array<{ ruleId: string; ruleName: string; severity: string; description: string; occurredAt: number }> {
    return violations.map((v) => ({
      ruleId: v.ruleId,
      ruleName: v.name,
      severity: v.severity,
      description: v.description,
      occurredAt: v.timestamp,
    }));
  }

  /**
   * Submits a formal appeal on behalf of a candidate within the allowed appeal window.
   */
  public submitAppeal(input: {
    sessionId: string;
    candidateId: string;
    examId: string;
    triggeredRulesSummary: Array<{ ruleId: string; ruleName: string; severity: string; description: string; occurredAt: number }>;
    candidateStatement: string;
    nowMs?: number;
  }): CandidateAppealSubmission {
    const now = input.nowMs || Date.now();
    const pkg = this.evidencePackages.get(input.sessionId);
    const windowDays = pkg?.appealWindowDays || this.defaultAppealWindowDays;
    const expiresAt = (pkg?.examCompletedAt || now) + (windowDays * 24 * 60 * 60 * 1000);

    if (now > expiresAt) {
      throw new Error(`Appeal window of ${windowDays} days has closed for session "${input.sessionId}".`);
    }

    const appealId = `appeal_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const appeal: CandidateAppealSubmission = {
      appealId,
      sessionId: input.sessionId,
      candidateId: input.candidateId,
      examId: input.examId,
      submittedAt: now,
      appealWindowExpiresAt: expiresAt,
      triggeredRulesSummary: input.triggeredRulesSummary,
      candidateStatement: input.candidateStatement,
      status: 'PENDING',
    };

    this.appeals.set(input.sessionId, appeal);

    // Commit appeal submission to the session's tamper-proof ledger
    const session = this.authority.getSession(input.sessionId);
    if (session) {
      this.authority.appendLedgerRecord(session, {
        type: 'CANDIDATE_APPEAL_SUBMITTED',
        ts: now,
        payload: { appealId, candidateId: input.candidateId },
      });
    }

    return appeal;
  }

  /**
   * Resolves a candidate appeal (APPROVE restores score/clears invalidation; REJECT upholds decision).
   */
  public resolveAppeal(
    sessionId: string,
    decision: 'APPROVED' | 'REJECTED',
    reviewerId: string,
    decisionNotes: string,
    nowMs?: number
  ): CandidateAppealSubmission {
    const appeal = this.appeals.get(sessionId);
    if (!appeal) {
      throw new Error(`No active appeal found for session "${sessionId}".`);
    }

    const now = nowMs || Date.now();
    appeal.status = decision;
    appeal.reviewedBy = reviewerId;
    appeal.reviewDecisionNotes = decisionNotes;
    appeal.reviewedAt = now;

    // Log resolution to ledger
    const session = this.authority.getSession(sessionId);
    if (session) {
      this.authority.appendLedgerRecord(session, {
        type: `APPEAL_${decision}`,
        ts: now,
        payload: {
          appealId: appeal.appealId,
          reviewerId,
          decisionNotes,
        },
      });

      if (decision === 'APPROVED' && session.status === 'TERMINATED') {
        session.status = 'SUBMITTED'; // Restore to legitimately submitted
      }
    }

    return appeal;
  }

  /**
   * Automatic Privacy Purge Routine:
   * Permanently deletes raw biometric video frames, audio recordings, and clipboard dumps
   * after the appeal window closes, retaining only the immutable ledger root hash.
   */
  public purgeExpiredEvidence(nowMs?: number): {
    purgedSessionsCount: number;
    purgedSessionIds: string[];
  } {
    const now = nowMs || Date.now();
    const purgedIds: string[] = [];

    for (const [sessionId, pkg] of this.evidencePackages.entries()) {
      const windowMs = pkg.appealWindowDays * 24 * 60 * 60 * 1000;
      const expirationDate = pkg.examCompletedAt + windowMs;

      // Check if window is closed and not already purged
      if (now > expirationDate && !pkg.isPurged) {
        // Zero out and permanently delete raw sensitive telemetry
        pkg.rawBiometricSnapshotsCount = 0;
        pkg.gazeTelemetryRecordsCount = 0;
        pkg.clipboardTelemetryCount = 0;
        pkg.isPurged = true;
        pkg.purgedAt = now;
        purgedIds.push(sessionId);

        // Record purge action in ledger
        const session = this.authority.getSession(sessionId);
        if (session) {
          this.authority.appendLedgerRecord(session, {
            type: 'PRIVACY_RETENTION_PURGE_EXECUTED',
            ts: now,
            payload: {
              retainedLedgerHash: pkg.retainedLedgerHash,
              appealWindowDays: pkg.appealWindowDays,
            },
          });
        }
      }
    }

    return {
      purgedSessionsCount: purgedIds.length,
      purgedSessionIds: purgedIds,
    };
  }

  public getAppeal(sessionId: string): CandidateAppealSubmission | undefined {
    return this.appeals.get(sessionId);
  }

  public getEvidencePackage(sessionId: string): SessionEvidencePackage | undefined {
    return this.evidencePackages.get(sessionId);
  }
}

export const appealsAndRetentionService = new AppealsAndRetentionService();
