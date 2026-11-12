import crypto from 'crypto';
import { ExamSessionAuthority, examSessionAuthority } from './ExamSessionAuthority';

export interface DailyLedgerAnchorRecord {
  date: string; // YYYY-MM-DD
  totalSessionsCount: number;
  sessionHashes: Array<{ sessionId: string; terminalHash: string }>;
  dailyRootHash: string;
  anchoredAt: number;
  anchoredBy: string;
}

export interface AnchorVerificationResult {
  valid: boolean;
  date: string;
  anchoredRootHash: string;
  recomputedRootHash: string;
  totalSessionsVerified: number;
  tamperedSessionIds?: string[];
  reason?: string;
}

export class DailyLedgerAnchorService {
  private anchors: Map<string, DailyLedgerAnchorRecord> = new Map();
  private authority: ExamSessionAuthority;

  constructor(authority: ExamSessionAuthority = examSessionAuthority) {
    this.authority = authority;
  }

  /**
   * Computes a deterministic Merkle-style root hash from a date and list of session terminal hashes.
   */
  public computeDailyRootHash(
    date: string,
    sessionHashes: Array<{ sessionId: string; terminalHash: string }>
  ): string {
    // Sort session items deterministically by sessionId
    const sorted = [...sessionHashes].sort((a, b) => a.sessionId.localeCompare(b.sessionId));
    const combinedString = `${date}:${sorted.length}:` + sorted.map((s) => `${s.sessionId}=${s.terminalHash}`).join('|');
    return crypto.createHash('sha256').update(combinedString).digest('hex');
  }

  /**
   * Creates and persists a daily anchor for a given calendar date (YYYY-MM-DD).
   */
  public generateDailyAnchor(
    date: string,
    sessionsList?: Array<{ sessionId: string; terminalHash: string }>,
    actorId: string = 'system_cron_anchorer'
  ): DailyLedgerAnchorRecord {
    let sessionHashes = sessionsList;

    // If session hashes not passed explicitly, collect from authority
    if (!sessionHashes) {
      sessionHashes = [];
      // Pull sessions from authority
      const allSessions = (this.authority as any).sessions as Map<string, any>;
      if (allSessions) {
        for (const [sId, sState] of allSessions.entries()) {
          const terminalHash = sState.ledger.length > 0
            ? sState.ledger[sState.ledger.length - 1].hash
            : 'genesis_empty';
          sessionHashes.push({ sessionId: sId, terminalHash });
        }
      }
    }

    const rootHash = this.computeDailyRootHash(date, sessionHashes);
    const record: DailyLedgerAnchorRecord = {
      date,
      totalSessionsCount: sessionHashes.length,
      sessionHashes,
      dailyRootHash: rootHash,
      anchoredAt: Date.now(),
      anchoredBy: actorId,
    };

    this.anchors.set(date, record);
    return record;
  }

  /**
   * Verifies the cryptographic integrity of a daily anchor record against current ledger states.
   */
  public verifyDailyAnchor(
    date: string,
    currentSessionHashes?: Array<{ sessionId: string; terminalHash: string }>
  ): AnchorVerificationResult {
    const anchor = this.anchors.get(date);
    if (!anchor) {
      return {
        valid: false,
        date,
        anchoredRootHash: '',
        recomputedRootHash: '',
        totalSessionsVerified: 0,
        reason: `No anchor found for date "${date}".`,
      };
    }

    const hashesToVerify = currentSessionHashes || anchor.sessionHashes;
    const recomputed = this.computeDailyRootHash(date, hashesToVerify);

    if (recomputed === anchor.dailyRootHash) {
      return {
        valid: true,
        date,
        anchoredRootHash: anchor.dailyRootHash,
        recomputedRootHash: recomputed,
        totalSessionsVerified: hashesToVerify.length,
      };
    }

    // Identify which session hashes mismatched
    const tampered: string[] = [];
    const originalMap = new Map(anchor.sessionHashes.map((s) => [s.sessionId, s.terminalHash]));
    for (const curr of hashesToVerify) {
      const orig = originalMap.get(curr.sessionId);
      if (orig !== curr.terminalHash) {
        tampered.push(curr.sessionId);
      }
    }

    return {
      valid: false,
      date,
      anchoredRootHash: anchor.dailyRootHash,
      recomputedRootHash: recomputed,
      totalSessionsVerified: hashesToVerify.length,
      tamperedSessionIds: tampered,
      reason: `Cryptographic root hash mismatch. ${tampered.length} session ledger(s) modified after daily anchoring.`,
    };
  }

  public getAnchor(date: string): DailyLedgerAnchorRecord | undefined {
    return this.anchors.get(date);
  }

  public getAllAnchors(): DailyLedgerAnchorRecord[] {
    return Array.from(this.anchors.values());
  }
}

export const dailyLedgerAnchorService = new DailyLedgerAnchorService();
