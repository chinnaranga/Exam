import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  ExamSessionAuthority,
  computeEventHmac,
  computeLedgerHash,
  SignedSecurityEvent,
} from '../ExamSessionAuthority';

describe('ExamSessionAuthority — Authoritative Time, Signed Events & Ledger Test Suite', () => {
  let authority: ExamSessionAuthority;
  const mockSessionId = 'session_auth_test_999';
  const mockSecret = 'super_secret_exam_session_key_32bytes_long!';

  beforeEach(() => {
    authority = new ExamSessionAuthority();
  });

  afterEach(() => {
    authority.clear();
    vi.restoreAllMocks();
  });

  describe('1. Server Timer & Authoritative Deadline Enforcement', () => {
    it('should initialize session with server-calculated startedAt and deadline', () => {
      const now = 1700000000000;
      const durationSeconds = 3600; // 1 hour

      const session = authority.startSession({
        sessionId: mockSessionId,
        durationSeconds,
        sessionSecret: mockSecret,
        nowMs: now,
      });

      expect(session.id).toBe(mockSessionId);
      expect(session.startedAt).toBe(now);
      expect(session.deadline).toBe(now + 3600 * 1000);
      expect(session.status).toBe('ACTIVE');
      expect(session.sessionSecret).toBe(mockSecret);
      expect(session.ledger.length).toBe(1); // Genesis record
      expect(session.ledger[0].eventData.type).toBe('SESSION_INITIALIZED');
    });

    it('should return serverNow and deadline from getClock endpoint', () => {
      const now = 1700000000000;
      authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 1800,
        nowMs: now,
      });

      const clock = authority.getClock(mockSessionId, now + 300000); // 5 mins later

      expect(clock.sessionId).toBe(mockSessionId);
      expect(clock.serverNow).toBe(now + 300000);
      expect(clock.deadline).toBe(now + 1800 * 1000);
      expect(clock.timeRemainingMs).toBe(1500 * 1000);
      expect(clock.isExpired).toBe(false);
    });

    it('should accept answer submissions within deadline + 10s grace period', () => {
      const now = 1700000000000;
      const durationSeconds = 600; // 10 mins -> deadline at now + 600_000
      authority.startSession({
        sessionId: mockSessionId,
        durationSeconds,
        nowMs: now,
      });

      // Submit at deadline + 8 seconds (within 10s grace)
      const submitTime = now + 600_000 + 8_000;
      const result = authority.submitAnswers(mockSessionId, { q1: 2, q2: 3 }, submitTime);

      expect(result.success).toBe(true);
      expect(result.status).toBe('SUBMITTED');

      const session = authority.getSession(mockSessionId)!;
      expect(session.status).toBe('SUBMITTED');
      expect(session.submittedAt).toBe(submitTime);
    });

    it('should reject answer submissions after deadline + 10s grace period', () => {
      const now = 1700000000000;
      const durationSeconds = 600; // deadline at now + 600_000
      authority.startSession({
        sessionId: mockSessionId,
        durationSeconds,
        nowMs: now,
      });

      // Submit at deadline + 12 seconds (exceeding 10s grace)
      const submitTime = now + 600_000 + 12_000;
      const result = authority.submitAnswers(mockSessionId, { q1: 1 }, submitTime);

      expect(result.success).toBe(false);
      expect(result.error).toContain('deadline exceeded');

      const session = authority.getSession(mockSessionId)!;
      expect(session.status).toBe('ACTIVE'); // not submitted
      const rejectionRecord = session.ledger.find((r) => r.eventData.type === 'SUBMISSION_REJECTED');
      expect(rejectionRecord).toBeDefined();
      expect(rejectionRecord?.eventData.payload.reason).toBe('DEADLINE_EXCEEDED_WITH_GRACE');
    });

    it('should trigger server-side auto-submit at deadline even if client is offline', () => {
      const now = 1700000000000;
      authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 10,
        nowMs: now,
      });

      // Simulate server deadline trigger
      authority.triggerServerAutoSubmit(mockSessionId, now + 10_000);

      const session = authority.getSession(mockSessionId)!;
      expect(session.status).toBe('AUTO_SUBMITTED');
      const autoSubmitRecord = session.ledger.find((r) => r.eventData.type === 'AUTO_SUBMIT_TRIGGERED');
      expect(autoSubmitRecord).toBeDefined();
      expect(autoSubmitRecord?.eventData.payload.reason).toBe('DEADLINE_REACHED');
    });
  });

  describe('2. Signed Events & HMAC Validation', () => {
    it('should successfully verify and ingest a properly signed client event with valid sequence', () => {
      const session = authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 3600,
        sessionSecret: mockSecret,
      });

      const eventPayload = {
        type: 'FocusLost',
        ts: Date.now(),
        seq: 1,
        payload: { target: 'DesktopWindow', durationMs: 400 },
      };

      const hmac = computeEventHmac(mockSecret, eventPayload);
      const signedEvent: SignedSecurityEvent = {
        ...eventPayload,
        hmac,
      };

      const result = authority.verifyAndIngestEvent(mockSessionId, signedEvent);

      expect(result.valid).toBe(true);
      expect(result.record).toBeDefined();
      expect(result.record?.eventData.type).toBe('FocusLost');
      expect(session.lastSeq).toBe(1);
    });

    it('should detect invalid HMAC signature and record CRITICAL EVENT_TAMPERING', () => {
      const session = authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 3600,
        sessionSecret: mockSecret,
      });

      const signedEvent: SignedSecurityEvent = {
        type: 'FullscreenExit',
        ts: Date.now(),
        seq: 1,
        payload: { reason: 'UserPressedEscape' },
        hmac: 'deadbeef_invalid_hmac_signature_0000000000000000000000000000000000',
      };

      const result = authority.verifyAndIngestEvent(mockSessionId, signedEvent);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('EVENT_TAMPERING');
      expect(result.tamperingEvent).toBeDefined();
      expect(result.tamperingEvent?.eventData.type).toBe('EVENT_TAMPERING');
      expect(result.tamperingEvent?.eventData.severity).toBe('CRITICAL');
      expect(result.tamperingEvent?.eventData.payload.reason).toBe('INVALID_HMAC_SIGNATURE');

      // Sequence should NOT advance on tampered event
      expect(session.lastSeq).toBe(0);
    });

    it('should detect payload tampering even when HMAC was signed for different data', () => {
      authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 3600,
        sessionSecret: mockSecret,
      });

      // Genuine event was "WindowBlurred"
      const genuineHmac = computeEventHmac(mockSecret, {
        type: 'WindowBlurred',
        ts: 1000,
        seq: 1,
        payload: { app: 'calc' },
      });

      // Attacker altered payload to "TamperedData" but reused HMAC
      const tamperedEvent: SignedSecurityEvent = {
        type: 'WindowBlurred',
        ts: 1000,
        seq: 1,
        payload: { app: 'browser_cheatsheet' },
        hmac: genuineHmac,
      };

      const result = authority.verifyAndIngestEvent(mockSessionId, tamperedEvent);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('EVENT_TAMPERING');
    });
  });

  describe('3. Sequence Gap Detection', () => {
    it('should detect sequence gap when an event is skipped and trigger CRITICAL EVENT_TAMPERING', () => {
      authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 3600,
        sessionSecret: mockSecret,
      });

      // Event 1 arrives successfully
      const evt1 = {
        type: 'DevToolsCheck',
        ts: Date.now(),
        seq: 1,
        payload: { open: false },
      };
      const res1 = authority.verifyAndIngestEvent(mockSessionId, {
        ...evt1,
        hmac: computeEventHmac(mockSecret, evt1),
      });
      expect(res1.valid).toBe(true);

      // Event 3 arrives (Event 2 was dropped or suppressed by attacker)
      const evt3 = {
        type: 'ClipboardPaste',
        ts: Date.now(),
        seq: 3, // GAP! Expected 2
        payload: { length: 50 },
      };
      const res3 = authority.verifyAndIngestEvent(mockSessionId, {
        ...evt3,
        hmac: computeEventHmac(mockSecret, evt3),
      });

      expect(res3.valid).toBe(false);
      expect(res3.error).toContain('Sequence gap detected');
      expect(res3.tamperingEvent?.eventData.type).toBe('EVENT_TAMPERING');
      expect(res3.tamperingEvent?.eventData.payload.reason).toBe('SEQUENCE_GAP_DETECTED');
      expect(res3.tamperingEvent?.eventData.payload.expectedSeq).toBe(2);
      expect(res3.tamperingEvent?.eventData.payload.receivedSeq).toBe(3);
    });

    it('should detect replay attack (duplicate sequence number)', () => {
      authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 3600,
        sessionSecret: mockSecret,
      });

      const evt1 = {
        type: 'FocusGained',
        ts: 1000,
        seq: 1,
        payload: { window: 'exam' },
      };
      authority.verifyAndIngestEvent(mockSessionId, {
        ...evt1,
        hmac: computeEventHmac(mockSecret, evt1),
      });

      // Replay Event 1
      const replayResult = authority.verifyAndIngestEvent(mockSessionId, {
        ...evt1,
        hmac: computeEventHmac(mockSecret, evt1),
      });

      expect(replayResult.valid).toBe(false);
      expect(replayResult.tamperingEvent?.eventData.payload.reason).toBe('SEQUENCE_GAP_DETECTED');
      expect(replayResult.tamperingEvent?.eventData.payload.expectedSeq).toBe(2);
      expect(replayResult.tamperingEvent?.eventData.payload.receivedSeq).toBe(1);
    });
  });

  describe('4. Hash-Chained Audit Ledger & Tamper Detection', () => {
    it('should verify an authentic hash-chained ledger successfully', () => {
      authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 3600,
        sessionSecret: mockSecret,
      });

      // Add 3 consecutive valid events
      for (let seq = 1; seq <= 3; seq++) {
        const evt = {
          type: `Event_${seq}`,
          ts: Date.now() + seq * 1000,
          seq,
          payload: { step: seq },
        };
        authority.verifyAndIngestEvent(mockSessionId, {
          ...evt,
          hmac: computeEventHmac(mockSecret, evt),
        });
      }

      const verification = authority.verifyLedger(mockSessionId);
      expect(verification.valid).toBe(true);
      expect(verification.verifiedRecordsCount).toBe(4); // 1 genesis + 3 events
    });

    it('should detect when record eventData has been modified retroactively in the ledger', () => {
      const session = authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 3600,
        sessionSecret: mockSecret,
      });

      // Add 2 events
      for (let seq = 1; seq <= 2; seq++) {
        const evt = {
          type: `NormalEvent_${seq}`,
          ts: Date.now(),
          seq,
          payload: { val: seq },
        };
        authority.verifyAndIngestEvent(mockSessionId, {
          ...evt,
          hmac: computeEventHmac(mockSecret, evt),
        });
      }

      // Tamper with record at index 1 directly in memory
      session.ledger[1].eventData = {
        ...session.ledger[1].eventData,
        tamperedField: 'malicious_modification',
      };

      const verification = authority.verifyLedger(mockSessionId);

      expect(verification.valid).toBe(false);
      expect(verification.brokenIndex).toBe(1);
      expect(verification.reason).toContain('Data tampering detected at index 1');
      expect(verification.verifiedRecordsCount).toBe(1); // Only index 0 verified
    });

    it('should detect when prevHash linkage has been broken', () => {
      const session = authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 3600,
        sessionSecret: mockSecret,
      });

      for (let seq = 1; seq <= 3; seq++) {
        const evt = {
          type: `Evt_${seq}`,
          ts: Date.now(),
          seq,
          payload: { seq },
        };
        authority.verifyAndIngestEvent(mockSessionId, {
          ...evt,
          hmac: computeEventHmac(mockSecret, evt),
        });
      }

      // Break chain link at index 2
      session.ledger[2].prevHash = 'corrupted_prev_hash_1234567890abcdef';

      const verification = authority.verifyLedger(mockSessionId);

      expect(verification.valid).toBe(false);
      expect(verification.brokenIndex).toBe(2);
      expect(verification.reason).toContain('Broken chain link at index 2');
    });
  });

  describe('5. Heartbeat & Drift Monitoring', () => {
    it('should accept regular 5s heartbeats without flags', () => {
      const startMs = 1700000000000;
      authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 3600,
        nowMs: startMs,
      });

      // Heartbeat 1 (5s later)
      const hb1 = authority.recordHeartbeat(
        mockSessionId,
        { perfNow: 5000, seq: 1 },
        startMs + 5000
      );
      expect(hb1.driftDetected).toBe(false);
      expect(hb1.timeoutDetected).toBe(false);

      // Heartbeat 2 (10s later)
      const hb2 = authority.recordHeartbeat(
        mockSessionId,
        { perfNow: 10000, seq: 2 },
        startMs + 10000
      );
      expect(hb2.driftDetected).toBe(false);
      expect(hb2.timeoutDetected).toBe(false);
    });

    it('should detect missing heartbeats exceeding 20 seconds (paused JS / debugger)', () => {
      const startMs = 1700000000000;
      const session = authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 3600,
        nowMs: startMs,
      });

      // Heartbeat arrives 25 seconds after previous
      const hb = authority.recordHeartbeat(
        mockSessionId,
        { perfNow: 25000, seq: 1 },
        startMs + 25000
      );

      expect(hb.timeoutDetected).toBe(true);
      expect(hb.elapsedSinceLastHeartbeatMs).toBe(25000);

      const timeoutRecord = session.ledger.find((r) => r.eventData.type === 'HEARTBEAT_TIMEOUT_EXCEEDED');
      expect(timeoutRecord).toBeDefined();
      expect(timeoutRecord?.eventData.payload.reason).toBe('MISSING_HEARTBEAT_EXCEEDED_20S');
    });

    it('should detect performance drift between client and server', () => {
      const startMs = 1700000000000;
      const session = authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 3600,
        nowMs: startMs,
      });

      // Baseline heartbeat
      authority.recordHeartbeat(mockSessionId, { perfNow: 1000, seq: 0 }, startMs + 1000);

      // Client performance.now() advanced by only 1,000ms while server advanced by 8,000ms (7s drift)
      const hbDrift = authority.recordHeartbeat(
        mockSessionId,
        { perfNow: 2000, seq: 1 }, // client advanced 1s
        startMs + 9000 // server advanced 8s
      );

      expect(hbDrift.driftDetected).toBe(true);
      expect(hbDrift.driftMs).toBe(7000);

      const driftRecord = session.ledger.find((r) => r.eventData.type === 'HEARTBEAT_DRIFT_DETECTED');
      expect(driftRecord).toBeDefined();
      expect(driftRecord?.eventData.payload.reason).toBe('EXECUTION_PAUSED_OR_DEBUGGER_DETECTED');
    });
  });
});
