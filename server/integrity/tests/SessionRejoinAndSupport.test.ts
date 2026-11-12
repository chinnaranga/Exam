import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  ExamSessionAuthority,
  sanitizeDiagnostics,
} from '../ExamSessionAuthority';
import {
  getViolationExplainer,
  VIOLATION_EXPLAINERS,
} from '../violationSeverityConfig';

describe('Step 10: Crash Recovery, Rejoin Limits, Technical Support & Violation Explainers', () => {
  let authority: ExamSessionAuthority;
  const mockSessionId = 'sess_recovery_test_101';
  const mockCandidateId = 'cand_stress_free_student';

  beforeEach(() => {
    authority = new ExamSessionAuthority();
  });

  afterEach(() => {
    authority.clear();
    vi.restoreAllMocks();
  });

  describe('1. Crash / Refresh Recovery & Rejoin Limits', () => {
    it('should initialize session with rejoinsCount 0 and maxAllowedRejoins 3', () => {
      const session = authority.startSession({
        sessionId: mockSessionId,
        candidateId: mockCandidateId,
        durationSeconds: 3600,
      });

      expect(session.rejoinsCount).toBe(0);
      expect(session.maxAllowedRejoins).toBe(3);
      expect(session.cachedAnswers).toBeUndefined();
    });

    it('should allow candidate to rejoin active session and restore authoritative timer and cached answers', () => {
      const now = 1700000000000;
      authority.startSession({
        sessionId: mockSessionId,
        candidateId: mockCandidateId,
        durationSeconds: 3600,
        nowMs: now,
      });

      // Cache answers mid-exam
      const mockAnswers = { 0: 1, 1: 3, 2: 0 };
      authority.updateCachedAnswers(mockSessionId, mockAnswers, now + 60000);

      // Rejoin 5 minutes later (simulating page reload after crash)
      const rejoinResult = authority.rejoinSession({
        sessionId: mockSessionId,
        candidateId: mockCandidateId,
        clientLocalAnswersHash: '0xabc123',
        nowMs: now + 300000,
      });

      expect(rejoinResult.success).toBe(true);
      expect(rejoinResult.rejoinsCount).toBe(1);
      expect(rejoinResult.maxAllowedRejoins).toBe(3);
      expect(rejoinResult.isFlagged).toBe(false);
      expect(rejoinResult.remainingTimeMs).toBe(3300000); // 3600s - 300s = 3300s
      expect(rejoinResult.cachedAnswers).toEqual(mockAnswers);

      // Verify SESSION_REJOINED ledger record
      const session = authority.getSession(mockSessionId)!;
      const rejoinRecord = session.ledger.find(
        (r) => (r.eventData as { type?: string }).type === 'SESSION_REJOINED'
      );
      expect(rejoinRecord).toBeDefined();
      expect((rejoinRecord!.eventData as { payload: { rejoinsCount: number } }).payload.rejoinsCount).toBe(1);
    });

    it('should increment rejoin counter on repeated rejoins (up to 3 without flag)', () => {
      const now = 1700000000000;
      authority.startSession({
        sessionId: mockSessionId,
        candidateId: mockCandidateId,
        durationSeconds: 3600,
        nowMs: now,
      });

      // Rejoin 1
      const r1 = authority.rejoinSession({ sessionId: mockSessionId, nowMs: now + 1000 });
      expect(r1.rejoinsCount).toBe(1);
      expect(r1.isFlagged).toBe(false);

      // Rejoin 2
      const r2 = authority.rejoinSession({ sessionId: mockSessionId, nowMs: now + 2000 });
      expect(r2.rejoinsCount).toBe(2);
      expect(r2.isFlagged).toBe(false);

      // Rejoin 3
      const r3 = authority.rejoinSession({ sessionId: mockSessionId, nowMs: now + 3000 });
      expect(r3.rejoinsCount).toBe(3);
      expect(r3.isFlagged).toBe(false);
    });

    it('should flag excessive rejoins (>3) in the hash-chained ledger without destroying the session', () => {
      const now = 1700000000000;
      authority.startSession({
        sessionId: mockSessionId,
        candidateId: mockCandidateId,
        durationSeconds: 3600,
        nowMs: now,
      });

      // Rejoin 1, 2, 3
      authority.rejoinSession({ sessionId: mockSessionId, nowMs: now + 1000 });
      authority.rejoinSession({ sessionId: mockSessionId, nowMs: now + 2000 });
      authority.rejoinSession({ sessionId: mockSessionId, nowMs: now + 3000 });

      // 4th Rejoin (Exceeds max of 3)
      const r4 = authority.rejoinSession({
        sessionId: mockSessionId,
        candidateId: mockCandidateId,
        clientLocalAnswersHash: '0xfeedbeef',
        nowMs: now + 4000,
      });

      expect(r4.success).toBe(true);
      expect(r4.rejoinsCount).toBe(4);
      expect(r4.isFlagged).toBe(true);
      expect(r4.flagReason).toContain('exceeds limit of 3');

      // Verify that SESSION_REJOIN_LIMIT_EXCEEDED was recorded in the ledger
      const session = authority.getSession(mockSessionId)!;
      const excessRecord = session.ledger.find(
        (r) => (r.eventData as { type?: string }).type === 'SESSION_REJOIN_LIMIT_EXCEEDED'
      );
      expect(excessRecord).toBeDefined();
      expect((excessRecord!.eventData as { severity?: string }).severity).toBe('HIGH');
      expect(session.status).toBe('ACTIVE'); // Student is allowed to finish test; invigilators audit later
    });

    it('should reject rejoin if session was already finalized or terminated', () => {
      const session = authority.startSession({
        sessionId: mockSessionId,
        durationSeconds: 60,
      });
      session.status = 'TERMINATED';

      const rejoin = authority.rejoinSession({ sessionId: mockSessionId });
      expect(rejoin.success).toBe(false);
      expect(rejoin.status).toBe('TERMINATED');
      expect(rejoin.isFlagged).toBe(true);
      expect(rejoin.flagReason).toContain('Session is already finalized');
    });
  });

  describe('2. In-Exam Technical Support & Diagnostic Sanitization', () => {
    it('should strictly sanitize diagnostics and strip any question text, options, or answers', () => {
      const sensitiveDiagnostics = {
        browser: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        os: 'macOS 14.5',
        screen: '1920x1080',
        fps: 30,
        latencyMs: 42,
        // Sensitive exam data that must be scrubbed:
        questionText: 'What is vector clock causality?',
        questionId: 104,
        candidateAnswer: 'Option B is correct',
        answers: [1, 2, 0, 3],
        correctOption: 2,
        selectedOptions: ['A', 'C'],
        nestedPayload: {
          platform: 'darwin',
          innerAnswerKey: 'TOP_SECRET_ANSWER',
          safeParam: 'active',
        },
      };

      const cleaned = sanitizeDiagnostics(sensitiveDiagnostics);

      // Verify safe technical diagnostics are retained
      expect(cleaned.browser).toBe('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');
      expect(cleaned.os).toBe('macOS 14.5');
      expect(cleaned.screen).toBe('1920x1080');
      expect(cleaned.fps).toBe(30);
      expect(cleaned.latencyMs).toBe(42);

      // Verify sensitive assessment content is stripped
      expect(cleaned.questionText).toBeUndefined();
      expect(cleaned.questionId).toBeUndefined();
      expect(cleaned.candidateAnswer).toBeUndefined();
      expect(cleaned.answers).toBeUndefined();
      expect(cleaned.correctOption).toBeUndefined();
      expect(cleaned.selectedOptions).toBeUndefined();

      // Nested validation
      const nested = cleaned.nestedPayload as Record<string, unknown>;
      expect(nested).toBeDefined();
      expect(nested.platform).toBe('darwin');
      expect(nested.safeParam).toBe('active');
      expect(nested.innerAnswerKey).toBeUndefined();
    });

    it('should record technical support ticket in the ledger and session support tickets array', () => {
      authority.startSession({
        sessionId: mockSessionId,
        candidateId: mockCandidateId,
        durationSeconds: 3600,
      });

      const res = authority.submitSupportTicket(mockSessionId, {
        category: 'WEBCAM_FROZEN',
        description: 'Webcam video stream froze after 15 minutes of testing.',
        diagnostics: {
          browser: 'Chrome 122',
          fps: 0,
          userAnswer: 'Hidden answer text',
        },
      });

      expect(res.success).toBe(true);
      expect(res.ticketId).toMatch(/^tkt_/);

      const session = authority.getSession(mockSessionId)!;
      expect(session.supportTickets?.length).toBe(1);
      const ticket = session.supportTickets![0];
      expect(ticket.category).toBe('WEBCAM_FROZEN');
      expect(ticket.description).toContain('Webcam video stream froze');
      expect((ticket.diagnostics as Record<string, unknown>).userAnswer).toBeUndefined();
      expect((ticket.diagnostics as Record<string, unknown>).browser).toBe('Chrome 122');

      // Check ledger event
      const ledgerEntry = session.ledger.find(
        (r) => (r.eventData as { type?: string }).type === 'SUPPORT_TICKET_SUBMITTED'
      );
      expect(ledgerEntry).toBeDefined();
    });
  });

  describe('3. 3-Part Violation Explainer System', () => {
    it('should provide structured 3-part explainers for core security rules', () => {
      const coreRules = [
        'FULLSCREEN_EXIT_EXTENDED',
        'TAB_SWITCH',
        'MULTIPLE_MONITORS',
        'PHONE_DETECTED',
        'DEVTOOLS_OPEN',
        'SECOND_PERSON_CONFIRMED',
        'IDENTITY_MISMATCH',
        'VIRTUAL_CAMERA',
        'VOICE_DETECTED',
        'GAZE_AWAY_REPEATEDLY',
        'EVENT_TAMPERING',
        'REVERIFY_CHALLENGE_TIMEOUT',
        'TIMER_THROTTLING_DETECTED',
      ];

      for (const ruleId of coreRules) {
        const explainer = getViolationExplainer(ruleId);
        expect(explainer).toBeDefined();
        expect(typeof explainer.whatHappened).toBe('string');
        expect(explainer.whatHappened.length).toBeGreaterThan(10);
        expect(typeof explainer.whyItMatters).toBe('string');
        expect(explainer.whyItMatters.length).toBeGreaterThan(10);
        expect(typeof explainer.howToFix).toBe('string');
        expect(explainer.howToFix.length).toBeGreaterThan(10);
      }
    });

    it('should resolve aliases and unknown rules with helpful fallback explainer', () => {
      // Test alias resolution
      const aliasExplainer = getViolationExplainer('fullscreen_exit');
      expect(aliasExplainer.whatHappened).toContain('fullscreen');
      expect(aliasExplainer.howToFix).toContain('Fullscreen');

      // Test unknown fallback
      const fallback = getViolationExplainer('UNKNOWN_TELEMETRY_CODE_XYZ');
      expect(fallback.whatHappened).toContain('UNKNOWN_TELEMETRY_CODE_XYZ');
      expect(fallback.whyItMatters).toContain('AssessIQ');
      expect(fallback.howToFix).toContain('exam screen');
    });
  });
});

