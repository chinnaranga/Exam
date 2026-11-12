import crypto from 'crypto';
import express, { Request, Response, Router } from 'express';

export type SessionStatus = 'ACTIVE' | 'SUBMITTED' | 'AUTO_SUBMITTED' | 'TERMINATED';

export interface SignedSecurityEvent {
  type: string;
  ts: number;
  seq: number;
  payload: unknown;
  hmac: string;
}

export interface LedgerRecord {
  index: number;
  sessionId: string;
  prevHash: string;
  eventData: unknown;
  hash: string;
  timestamp: number;
}

export interface LedgerVerificationResult {
  valid: boolean;
  brokenIndex?: number;
  expectedHash?: string;
  actualHash?: string;
  reason?: string;
  verifiedRecordsCount: number;
}

export interface HeartbeatReport {
  sessionId: string;
  serverNow: number;
  perfNow: number;
  seq: number;
  driftDetected: boolean;
  timeoutDetected: boolean;
  driftMs?: number;
  elapsedSinceLastHeartbeatMs?: number;
}

export interface ClockResponse {
  sessionId: string;
  serverNow: number;
  deadline: number;
  startedAt: number;
  status: SessionStatus;
  timeRemainingMs: number;
  isExpired: boolean;
}

export interface RejoinResponse {
  success: boolean;
  sessionId: string;
  rejoinsCount: number;
  maxAllowedRejoins: number;
  isFlagged: boolean;
  flagReason?: string;
  serverNow: number;
  deadline: number;
  remainingTimeMs: number;
  status: SessionStatus;
  cachedAnswers?: unknown;
}

export interface ExamSessionState {
  id: string;
  candidateId?: string;
  examId?: string;
  startedAt: number;
  durationSeconds: number;
  deadline: number;
  sessionSecret: string;
  status: SessionStatus;
  lastSeq: number;
  lastHeartbeatAt: number;
  lastClientPerfNow: number | null;
  ledger: LedgerRecord[];
  submittedAnswers?: unknown;
  submittedAt?: number;
  autoSubmitTimer?: NodeJS.Timeout;
  rejoinsCount: number;
  maxAllowedRejoins: number;
  cachedAnswers?: unknown;
  supportTickets?: Array<{ id: string; category: string; description: string; diagnostics: unknown; timestamp: number }>;
}

/**
 * Helper to produce a deterministic canonical event string for HMAC generation.
 */
export function canonicalizeEventData(event: { type: string; ts: number; seq: number; payload: unknown }): string {
  const payloadStr = typeof event.payload === 'string' ? event.payload : JSON.stringify(event.payload);
  return `${event.type}:${event.ts}:${event.seq}:${payloadStr}`;
}

/**
 * Computes HMAC-SHA256 signature for a security event given the session secret.
 */
export function computeEventHmac(secret: string, event: Omit<SignedSecurityEvent, 'hmac'>): string {
  const canonical = canonicalizeEventData(event);
  return crypto.createHmac('sha256', secret).update(canonical).digest('hex');
}

/**
 * Computes SHA-256 hash for a ledger record: SHA256(prevHash + eventDataStr)
 */
export function computeLedgerHash(prevHash: string, eventData: unknown): string {
  const eventDataStr = typeof eventData === 'string' ? eventData : JSON.stringify(eventData);
  return crypto.createHash('sha256').update(prevHash + eventDataStr).digest('hex');
}

/**
 * Sanitizes technical diagnostic payload to guarantee that NO candidate answers,
 * question text, options, or sensitive assessment keys are ever transmitted over support channels.
 */
export function sanitizeDiagnostics(diagnostics: unknown): Record<string, unknown> {
  if (!diagnostics || typeof diagnostics !== 'object' || Array.isArray(diagnostics)) {
    return {};
  }
  const forbiddenPatterns = [
    /answer/i,
    /option/i,
    /question/i,
    /stem/i,
    /correct/i,
    /key/i,
    /secret/i,
    /solution/i,
    /choice/i,
  ];
  const cleaned: Record<string, unknown> = {};

  for (const [k, v] of Object.entries(diagnostics as Record<string, unknown>)) {
    const isForbidden = forbiddenPatterns.some((pattern) => pattern.test(k));
    if (isForbidden) continue;

    if (v && typeof v === 'object' && !Array.isArray(v)) {
      cleaned[k] = sanitizeDiagnostics(v);
    } else if (Array.isArray(v)) {
      cleaned[k] = v.length;
    } else {
      cleaned[k] = v;
    }
  }

  return cleaned;
}

/**
 * @class ExamSessionAuthority
 * @description Central authority for exam session clocks, signed client events,
 * hash-chained audit ledgers, heartbeat health checks, and server-enforced auto-submit.
 */
export class ExamSessionAuthority {
  private sessions: Map<string, ExamSessionState> = new Map();
  public readonly router: Router;

  // Grace period after deadline for network latency (10 seconds)
  public static readonly SUBMISSION_GRACE_PERIOD_MS = 10_000;
  // Maximum allowed gap between heartbeats before flagging paused JS / debugger (20 seconds)
  public static readonly HEARTBEAT_TIMEOUT_THRESHOLD_MS = 20_000;
  // Maximum allowed drift between client performance.now() and server clock over heartbeat interval (3 seconds)
  public static readonly HEARTBEAT_DRIFT_THRESHOLD_MS = 3_000;

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Initialize a new authoritative exam session with server-calculated deadline and secret key.
   */
  public startSession(params: {
    sessionId?: string;
    durationSeconds: number;
    candidateId?: string;
    examId?: string;
    sessionSecret?: string;
    nowMs?: number;
  }): ExamSessionState {
    const sessionId = params.sessionId || `sess_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const startedAt = params.nowMs || Date.now();
    const deadline = startedAt + params.durationSeconds * 1000;
    const sessionSecret = params.sessionSecret || crypto.randomBytes(32).toString('hex');

    // Clean up existing timer if session re-initialized
    const existing = this.sessions.get(sessionId);
    if (existing?.autoSubmitTimer) {
      clearTimeout(existing.autoSubmitTimer);
    }

    const session: ExamSessionState = {
      id: sessionId,
      candidateId: params.candidateId,
      examId: params.examId,
      startedAt,
      durationSeconds: params.durationSeconds,
      deadline,
      sessionSecret,
      status: 'ACTIVE',
      lastSeq: 0,
      lastHeartbeatAt: startedAt,
      lastClientPerfNow: null,
      ledger: [],
      rejoinsCount: 0,
      maxAllowedRejoins: 3,
      cachedAnswers: undefined,
      supportTickets: [],
    };

    // Genesis ledger entry
    this.appendLedgerRecord(session, {
      type: 'SESSION_INITIALIZED',
      sessionId,
      startedAt,
      deadline,
      durationSeconds: params.durationSeconds,
    });

    // Schedule authoritative server auto-submit at exact deadline
    const delayMs = Math.max(0, deadline - Date.now());
    session.autoSubmitTimer = setTimeout(() => {
      this.triggerServerAutoSubmit(sessionId);
    }, delayMs);

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Retrieves active session state by ID.
   */
  public getSession(sessionId: string): ExamSessionState | null {
    return this.sessions.get(sessionId) || null;
  }

  public getLedger(sessionId: string): LedgerRecord[] {
    const session = this.sessions.get(sessionId);
    return session ? session.ledger : [];
  }

  /**
   * Authoritative clock endpoint response: { serverNow, deadline }
   */
  public getClock(sessionId: string, nowMs?: number): ClockResponse {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const serverNow = nowMs || Date.now();
    const timeRemainingMs = Math.max(0, session.deadline - serverNow);
    const isExpired = serverNow >= session.deadline;

    return {
      sessionId: session.id,
      serverNow,
      deadline: session.deadline,
      startedAt: session.startedAt,
      status: session.status,
      timeRemainingMs,
      isExpired,
    };
  }

  /**
   * Rejoin an active session after browser crash, refresh, or disconnect.
   * Restores authoritative deadline and cached answers.
   * Increments rejoin count and logs to ledger. If rejoins exceed maxAllowedRejoins (3),
   * flags the session for invigilator audit without terminating the candidate.
   */
  public rejoinSession(params: {
    sessionId: string;
    candidateId?: string;
    clientLocalAnswersHash?: string;
    nowMs?: number;
  }): RejoinResponse {
    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Session ${params.sessionId} not found`);
    }

    const serverNow = params.nowMs || Date.now();
    const remainingTimeMs = Math.max(0, session.deadline - serverNow);

    // If session is already finalized/terminated, return with current status
    if (session.status === 'TERMINATED' || session.status === 'SUBMITTED' || session.status === 'AUTO_SUBMITTED') {
      return {
        success: false,
        sessionId: session.id,
        rejoinsCount: session.rejoinsCount,
        maxAllowedRejoins: session.maxAllowedRejoins,
        isFlagged: true,
        flagReason: `Session is already finalized with status: ${session.status}`,
        serverNow,
        deadline: session.deadline,
        remainingTimeMs,
        status: session.status,
        cachedAnswers: session.cachedAnswers,
      };
    }

    // Increment rejoin count
    session.rejoinsCount += 1;
    const isLimitExceeded = session.rejoinsCount > session.maxAllowedRejoins;

    if (isLimitExceeded) {
      this.appendLedgerRecord(session, {
        type: 'SESSION_REJOIN_LIMIT_EXCEEDED',
        severity: 'HIGH',
        payload: {
          rejoinsCount: session.rejoinsCount,
          maxAllowed: session.maxAllowedRejoins,
          candidateId: params.candidateId || session.candidateId,
          clientLocalAnswersHash: params.clientLocalAnswersHash,
          timestamp: serverNow,
          warning: 'Excessive session rejoins detected. Flagged for invigilator review.',
        },
      });
    } else {
      this.appendLedgerRecord(session, {
        type: 'SESSION_REJOINED',
        severity: 'INFO',
        payload: {
          rejoinsCount: session.rejoinsCount,
          maxAllowed: session.maxAllowedRejoins,
          candidateId: params.candidateId || session.candidateId,
          clientLocalAnswersHash: params.clientLocalAnswersHash,
          timestamp: serverNow,
        },
      });
    }

    return {
      success: true,
      sessionId: session.id,
      rejoinsCount: session.rejoinsCount,
      maxAllowedRejoins: session.maxAllowedRejoins,
      isFlagged: isLimitExceeded,
      flagReason: isLimitExceeded
        ? `Session rejoined ${session.rejoinsCount} times (exceeds limit of ${session.maxAllowedRejoins}). Flagged for invigilator review.`
        : undefined,
      serverNow,
      deadline: session.deadline,
      remainingTimeMs,
      status: session.status,
      cachedAnswers: session.cachedAnswers,
    };
  }

  /**
   * Cache candidate in-progress answers on the server for crash recovery.
   */
  public updateCachedAnswers(
    sessionId: string,
    answers: unknown,
    nowMs?: number
  ): { success: boolean; cachedAt: number } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const serverNow = nowMs || Date.now();
    session.cachedAnswers = answers;

    return {
      success: true,
      cachedAt: serverNow,
    };
  }

  /**
   * Submit an in-exam technical support ticket with sanitized diagnostics.
   * Strips any candidate answers or question content before recording.
   */
  public submitSupportTicket(
    sessionId: string,
    ticket: { category: string; description: string; diagnostics?: unknown },
    nowMs?: number
  ): { success: boolean; ticketId: string; timestamp: number } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const serverNow = nowMs || Date.now();
    const ticketId = `tkt_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const sanitizedDiagnostics = sanitizeDiagnostics(ticket.diagnostics);

    const ticketRecord = {
      id: ticketId,
      category: ticket.category || 'TECHNICAL_ISSUE',
      description: ticket.description || '',
      diagnostics: sanitizedDiagnostics,
      timestamp: serverNow,
    };

    if (!session.supportTickets) {
      session.supportTickets = [];
    }
    session.supportTickets.push(ticketRecord);

    this.appendLedgerRecord(session, {
      type: 'SUPPORT_TICKET_SUBMITTED',
      severity: 'INFO',
      payload: {
        ticketId,
        category: ticketRecord.category,
        description: ticketRecord.description,
        diagnostics: sanitizedDiagnostics,
        timestamp: serverNow,
      },
    });

    return {
      success: true,
      ticketId,
      timestamp: serverNow,
    };
  }

  /**
   * Ingest and cryptographically verify a signed client security event.
   * Verifies HMAC signature and sequence monotonicity (seq === lastSeq + 1).
   * Generates CRITICAL "EVENT_TAMPERING" if signature is invalid or sequence gap exists.
   */
  public verifyAndIngestEvent(
    sessionId: string,
    event: SignedSecurityEvent,
    nowMs?: number
  ): { valid: boolean; record?: LedgerRecord; error?: string; tamperingEvent?: LedgerRecord } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const currentTime = nowMs || Date.now();

    // 1. Verify Sequence Monotonicity: seq === lastSeq + 1
    const expectedSeq = session.lastSeq + 1;
    if (event.seq !== expectedSeq) {
      const tamperingRecord = this.appendLedgerRecord(session, {
        type: 'EVENT_TAMPERING',
        severity: 'CRITICAL',
        timestamp: currentTime,
        payload: {
          reason: 'SEQUENCE_GAP_DETECTED',
          expectedSeq,
          receivedSeq: event.seq,
          eventType: event.type,
          originalPayload: event.payload,
        },
      });

      return {
        valid: false,
        error: `EVENT_TAMPERING: Sequence gap detected. Expected seq ${expectedSeq}, received ${event.seq}.`,
        tamperingEvent: tamperingRecord,
      };
    }

    // 2. Verify HMAC Signature
    const expectedHmac = computeEventHmac(session.sessionSecret, {
      type: event.type,
      ts: event.ts,
      seq: event.seq,
      payload: event.payload,
    });

    const isMatch = this.safeCompareHmac(event.hmac, expectedHmac);
    if (!isMatch) {
      const tamperingRecord = this.appendLedgerRecord(session, {
        type: 'EVENT_TAMPERING',
        severity: 'CRITICAL',
        timestamp: currentTime,
        payload: {
          reason: 'INVALID_HMAC_SIGNATURE',
          expectedSeq,
          receivedSeq: event.seq,
          receivedHmac: event.hmac,
          eventType: event.type,
        },
      });

      return {
        valid: false,
        error: 'EVENT_TAMPERING: Invalid HMAC signature.',
        tamperingEvent: tamperingRecord,
      };
    }

    // 3. Update Sequence & Append to Hash-Chained Ledger
    session.lastSeq = event.seq;
    const record = this.appendLedgerRecord(session, {
      type: event.type,
      ts: event.ts,
      seq: event.seq,
      payload: event.payload,
      hmac: event.hmac,
    });

    return {
      valid: true,
      record,
    };
  }

  /**
   * Appends an event to the session's hash-chained ledger:
   * hash = SHA256(prevHash + eventData)
   */
  public appendLedgerRecord(session: ExamSessionState, eventData: unknown): LedgerRecord {
    const prevRecord = session.ledger[session.ledger.length - 1];
    const prevHash = prevRecord ? prevRecord.hash : '0'.repeat(64);
    const hash = computeLedgerHash(prevHash, eventData);

    const record: LedgerRecord = {
      index: session.ledger.length,
      sessionId: session.id,
      prevHash,
      eventData,
      hash,
      timestamp: Date.now(),
    };

    session.ledger.push(record);
    return record;
  }

  /**
   * Re-computes the entire ledger hash-chain from genesis and reports the first broken record.
   */
  public verifyLedger(sessionId: string): LedgerVerificationResult {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const { ledger } = session;
    if (ledger.length === 0) {
      return { valid: true, verifiedRecordsCount: 0 };
    }

    for (let i = 0; i < ledger.length; i++) {
      const record = ledger[i];
      const expectedPrevHash = i === 0 ? '0'.repeat(64) : ledger[i - 1].hash;

      // Check linkage with previous record
      if (record.prevHash !== expectedPrevHash) {
        return {
          valid: false,
          brokenIndex: i,
          actualHash: record.prevHash,
          expectedHash: expectedPrevHash,
          reason: `Broken chain link at index ${i}: prevHash does not match hash of preceding record.`,
          verifiedRecordsCount: i,
        };
      }

      // Check record's own integrity hash
      const recalculatedHash = computeLedgerHash(record.prevHash, record.eventData);
      if (record.hash !== recalculatedHash) {
        return {
          valid: false,
          brokenIndex: i,
          actualHash: record.hash,
          expectedHash: recalculatedHash,
          reason: `Data tampering detected at index ${i}: hash mismatch. Record content has been modified.`,
          verifiedRecordsCount: i,
        };
      }
    }

    return {
      valid: true,
      verifiedRecordsCount: ledger.length,
    };
  }

  /**
   * Ingest client heartbeat (sent every 5s with performance.now() and seq).
   * Detects missing heartbeats (> 20s) and performance drift (paused JS / debugger).
   */
  public recordHeartbeat(
    sessionId: string,
    heartbeat: { perfNow: number; seq: number; ts?: number },
    nowMs?: number
  ): HeartbeatReport {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const serverNow = nowMs || Date.now();
    const elapsedSinceLast = serverNow - session.lastHeartbeatAt;
    let timeoutDetected = false;
    let driftDetected = false;
    let driftMs = 0;

    // Check 1: Missing Heartbeats (> 20 seconds)
    if (elapsedSinceLast > ExamSessionAuthority.HEARTBEAT_TIMEOUT_THRESHOLD_MS) {
      timeoutDetected = true;
      this.appendLedgerRecord(session, {
        type: 'HEARTBEAT_TIMEOUT_EXCEEDED',
        severity: 'HIGH',
        payload: {
          reason: 'MISSING_HEARTBEAT_EXCEEDED_20S',
          elapsedSinceLastHeartbeatMs: elapsedSinceLast,
          seq: heartbeat.seq,
        },
      });
    }

    // Check 2: Clock Drift (performance.now() delta vs server wall clock delta)
    if (session.lastClientPerfNow !== null) {
      const clientDelta = heartbeat.perfNow - session.lastClientPerfNow;
      const serverDelta = elapsedSinceLast;
      driftMs = Math.abs(clientDelta - serverDelta);

      if (driftMs > ExamSessionAuthority.HEARTBEAT_DRIFT_THRESHOLD_MS) {
        driftDetected = true;
        this.appendLedgerRecord(session, {
          type: 'HEARTBEAT_DRIFT_DETECTED',
          severity: 'HIGH',
          payload: {
            reason: 'EXECUTION_PAUSED_OR_DEBUGGER_DETECTED',
            driftMs,
            clientDeltaMs: clientDelta,
            serverDeltaMs: serverDelta,
            seq: heartbeat.seq,
          },
        });
      }
    }

    session.lastHeartbeatAt = serverNow;
    session.lastClientPerfNow = heartbeat.perfNow;

    return {
      sessionId,
      serverNow,
      perfNow: heartbeat.perfNow,
      seq: heartbeat.seq,
      driftDetected,
      timeoutDetected,
      driftMs,
      elapsedSinceLastHeartbeatMs: elapsedSinceLast,
    };
  }

  /**
   * Submit examination answers.
   * Rejects any submission after deadline + 10s grace period.
   */
  public submitAnswers(
    sessionId: string,
    answers: unknown,
    nowMs?: number
  ): { success: boolean; status: SessionStatus; error?: string } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const serverNow = nowMs || Date.now();
    const graceCutoff = session.deadline + ExamSessionAuthority.SUBMISSION_GRACE_PERIOD_MS;

    if (serverNow > graceCutoff) {
      this.appendLedgerRecord(session, {
        type: 'SUBMISSION_REJECTED',
        severity: 'HIGH',
        payload: {
          reason: 'DEADLINE_EXCEEDED_WITH_GRACE',
          serverNow,
          deadline: session.deadline,
          graceCutoff,
          exceededByMs: serverNow - session.deadline,
        },
      });

      return {
        success: false,
        status: session.status,
        error: `Submission rejected: deadline exceeded by ${((serverNow - session.deadline) / 1000).toFixed(1)}s (10s grace limit exceeded).`,
      };
    }

    // Cancel auto-submit timer if submitted beforehand
    if (session.autoSubmitTimer) {
      clearTimeout(session.autoSubmitTimer);
      session.autoSubmitTimer = undefined;
    }

    session.status = 'SUBMITTED';
    session.submittedAnswers = answers;
    session.submittedAt = serverNow;

    this.appendLedgerRecord(session, {
      type: 'ANSWERS_SUBMITTED',
      severity: 'INFO',
      payload: {
        serverNow,
        submittedWithinDeadline: serverNow <= session.deadline,
      },
    });

    return {
      success: true,
      status: 'SUBMITTED',
    };
  }

  /**
   * Finalizes student session upon explicit student exit / submission.
   */
  public recordStudentExit(session: ExamSessionState): void {
    this.submitAnswers(session.id, session.cachedAnswers || {});
  }

  /**
   * Triggered by the server when the deadline strikes, even if the client is offline.
   */
  public triggerServerAutoSubmit(sessionId: string, nowMs?: number): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    if (session.status === 'ACTIVE') {
      session.status = 'AUTO_SUBMITTED';
      session.submittedAt = nowMs || Date.now();

      this.appendLedgerRecord(session, {
        type: 'AUTO_SUBMIT_TRIGGERED',
        severity: 'INFO',
        payload: {
          reason: 'DEADLINE_REACHED',
          deadline: session.deadline,
          timestamp: session.submittedAt,
        },
      });
    }
  }

  /**
   * Health check to detect silent sessions with missing heartbeats > 20s.
   */
  public checkSessionHealth(sessionId: string, nowMs?: number): { status: SessionStatus; warnings: string[] } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const serverNow = nowMs || Date.now();
    const warnings: string[] = [];

    if (session.status === 'ACTIVE' && serverNow - session.lastHeartbeatAt > ExamSessionAuthority.HEARTBEAT_TIMEOUT_THRESHOLD_MS) {
      warnings.push(`No heartbeat received for ${Math.round((serverNow - session.lastHeartbeatAt) / 1000)}s.`);
    }

    return {
      status: session.status,
      warnings,
    };
  }

  /**
   * Reset all sessions (used primarily in test suites).
   */
  public clear(): void {
    for (const session of this.sessions.values()) {
      if (session.autoSubmitTimer) {
        clearTimeout(session.autoSubmitTimer);
      }
    }
    this.sessions.clear();
  }

  private safeCompareHmac(a: string, b: string): boolean {
    try {
      const bufA = Buffer.from(a, 'hex');
      const bufB = Buffer.from(b, 'hex');
      if (bufA.length !== bufB.length) return false;
      return crypto.timingSafeEqual(bufA, bufB);
    } catch {
      return false;
    }
  }

  /**
   * Mount Express API routes for the authority.
   */
  private setupRoutes(): void {
    // 1. Session start
    this.router.post('/start', (req: Request, res: Response) => {
      try {
        const { sessionId, durationSeconds, candidateId, examId } = req.body;
        if (!sessionId || !durationSeconds) {
          res.status(400).json({ error: 'sessionId and durationSeconds are required.' });
          return;
        }

        const session = this.startSession({
          sessionId,
          durationSeconds: Number(durationSeconds),
          candidateId,
          examId,
        });

        res.json({
          sessionId: session.id,
          startedAt: session.startedAt,
          deadline: session.deadline,
          durationSeconds: session.durationSeconds,
          sessionSecret: session.sessionSecret,
          status: session.status,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 2. Authoritative clock: GET /api/session/:id/clock
    this.router.get('/:id/clock', (req: Request, res: Response) => {
      try {
        const clock = this.getClock(req.params.id);
        res.json(clock);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(404).json({ error: msg });
      }
    });

    // 3. Signed Security Event Ingestion: POST /api/session/:id/event
    this.router.post('/:id/event', (req: Request, res: Response) => {
      try {
        const { type, ts, seq, payload, hmac } = req.body;
        if (!type || ts === undefined || seq === undefined || !hmac) {
          res.status(400).json({ error: 'type, ts, seq, and hmac are required.' });
          return;
        }

        const result = this.verifyAndIngestEvent(req.params.id, {
          type,
          ts,
          seq,
          payload,
          hmac,
        });

        if (!result.valid) {
          res.status(400).json(result);
          return;
        }

        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(404).json({ error: msg });
      }
    });

    // 4. Heartbeat Ingestion: POST /api/session/:id/heartbeat
    this.router.post('/:id/heartbeat', (req: Request, res: Response) => {
      try {
        const { perfNow, seq, ts } = req.body;
        if (perfNow === undefined || seq === undefined) {
          res.status(400).json({ error: 'perfNow and seq are required.' });
          return;
        }

        const report = this.recordHeartbeat(req.params.id, { perfNow, seq, ts });
        res.json(report);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(404).json({ error: msg });
      }
    });

    // 5. Submit Answers: POST /api/session/:id/submit
    this.router.post('/:id/submit', (req: Request, res: Response) => {
      try {
        const { answers } = req.body;
        const result = this.submitAnswers(req.params.id, answers);
        if (!result.success) {
          res.status(403).json(result);
          return;
        }
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(404).json({ error: msg });
      }
    });

    // 6. Verify Ledger: GET /api/session/:id/verify-ledger
    this.router.get('/:id/verify-ledger', (req: Request, res: Response) => {
      try {
        const result = this.verifyLedger(req.params.id);
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(404).json({ error: msg });
      }
    });

    // 7. Get Ledger records: GET /api/session/:id/ledger
    this.router.get('/:id/ledger', (req: Request, res: Response) => {
      try {
        const session = this.getSession(req.params.id);
        if (!session) {
          res.status(404).json({ error: `Session ${req.params.id} not found` });
          return;
        }
        res.json({
          sessionId: session.id,
          count: session.ledger.length,
          ledger: session.ledger,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(404).json({ error: msg });
      }
    });

    // 8. Rejoin Exam Session: POST /api/session/:id/rejoin
    this.router.post('/:id/rejoin', (req: Request, res: Response) => {
      try {
        const { candidateId, clientLocalAnswersHash } = req.body;
        const result = this.rejoinSession({
          sessionId: req.params.id,
          candidateId,
          clientLocalAnswersHash,
        });
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(404).json({ error: msg });
      }
    });

    // 9. Cache in-progress answers: POST /api/session/:id/answers/cache
    this.router.post('/:id/answers/cache', (req: Request, res: Response) => {
      try {
        const { answers } = req.body;
        const result = this.updateCachedAnswers(req.params.id, answers);
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(404).json({ error: msg });
      }
    });

    // 10. In-exam technical support ticket: POST /api/session/:id/support
    this.router.post('/:id/support', (req: Request, res: Response) => {
      try {
        const { category, description, diagnostics } = req.body;
        const result = this.submitSupportTicket(req.params.id, {
          category,
          description,
          diagnostics,
        });
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(404).json({ error: msg });
      }
    });
  }
}

export const examSessionAuthority = new ExamSessionAuthority();
export default examSessionAuthority;
