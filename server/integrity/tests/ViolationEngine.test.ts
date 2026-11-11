import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ViolationEngine } from '../ViolationEngine';
import { ExamSessionAuthority } from '../ExamSessionAuthority';
import { VIOLATION_THRESHOLDS } from '../violationSeverityConfig';

describe('ViolationEngine — Server-Side Weighted Points & Enforcement Test Suite', () => {
  let authority: ExamSessionAuthority;
  let engine: ViolationEngine;
  const mockSessionId = 'session_pts_test_888';

  beforeEach(() => {
    authority = new ExamSessionAuthority();
    engine = new ViolationEngine(authority);

    // Initialize session in authority
    authority.startSession({
      sessionId: mockSessionId,
      durationSeconds: 3600,
    });
  });

  afterEach(() => {
    authority.clear();
    engine.clear();
    vi.restoreAllMocks();
  });

  describe('1. Weighted Severity Points & Log-Only Rules', () => {
    it('LOW severity (1 point) should be logged without alerting the user', () => {
      const decision = engine.processViolation(mockSessionId, {
        type: 'FOCUS_LOSS_BRIEF',
        payload: { durationMs: 1400 },
      });

      expect(decision.action).toBe('LOG_ONLY');
      expect(decision.pointsAdded).toBe(1);
      expect(decision.currentPoints).toBe(1);
      expect(decision.displayToast).toBe(false);
      expect(decision.showOverlay).toBe(false);
      expect(decision.isTerminated).toBe(false);
      expect(decision.violation.severity).toBe('LOW');
      expect(decision.violation.alertUser).toBe(false);
    });

    it('MEDIUM severity (2 points) should alert user with warning toast', () => {
      const decision = engine.processViolation(mockSessionId, {
        type: 'TAB_SWITCH',
        payload: { target: 'ChromeTab2' },
      });

      expect(decision.action).toBe('WARNING_TOAST');
      expect(decision.pointsAdded).toBe(2);
      expect(decision.currentPoints).toBe(2);
      expect(decision.displayToast).toBe(true);
      expect(decision.toastMessage).toContain('Browser Tab Switch');
      expect(decision.violation.severity).toBe('MEDIUM');
    });

    it('HIGH severity (3 points) should alert user and accumulate 3 points', () => {
      const decision = engine.processViolation(mockSessionId, {
        type: 'PHONE_DETECTED',
        payload: { confidence: 0.94 },
      });

      expect(decision.action).toBe('WARNING_TOAST');
      expect(decision.pointsAdded).toBe(3);
      expect(decision.currentPoints).toBe(3);
      expect(decision.displayToast).toBe(true);
      expect(decision.violation.severity).toBe('HIGH');
    });
  });

  describe('2. Thresholds: Overlay (4 pts) & Termination (8 pts)', () => {
    it('reaching 4 points should trigger full-screen critical alert overlay with countdown', () => {
      // Step 1: Medium (2 pts)
      engine.processViolation(mockSessionId, { type: 'TAB_SWITCH' });

      // Step 2: Medium (2 pts) -> Total = 4 pts
      const decision = engine.processViolation(mockSessionId, { type: 'VOICE_DETECTED' });

      expect(decision.action).toBe('OVERLAY');
      expect(decision.currentPoints).toBe(4);
      expect(decision.showOverlay).toBe(true);
      expect(decision.isTerminated).toBe(false);
      expect(decision.status).toBe('OVERLAY_ACTIVE');
      expect(decision.overlayCountdownSeconds).toBe(30);
    });

    it('reaching 8 points should trigger termination and generate evidence packet', () => {
      // Accumulate: High (3 pts) + High (3 pts) + Medium (2 pts) = 8 pts
      engine.processViolation(mockSessionId, { type: 'MULTIPLE_MONITORS' }); // 3
      engine.processViolation(mockSessionId, { type: 'DEVTOOLS_OPEN' }); // 6

      const termDecision = engine.processViolation(mockSessionId, { type: 'TAB_SWITCH' }); // 8

      expect(termDecision.action).toBe('TERMINATE');
      expect(termDecision.currentPoints).toBe(8);
      expect(termDecision.isTerminated).toBe(true);
      expect(termDecision.status).toBe('TERMINATED');
      expect(termDecision.evidencePacket).toBeDefined();
      expect(termDecision.evidencePacket?.terminationReason).toContain('ACCUMULATED_POINTS_EXCEEDED');
      expect(termDecision.evidencePacket?.finalPoints).toBe(8);
      expect(termDecision.evidencePacket?.totalViolationsCount).toBe(3);
      expect(termDecision.evidencePacket?.invigilatorNotified).toBe(true);

      // Session in authority should also be marked TERMINATED
      const examSession = authority.getSession(mockSessionId)!;
      expect(examSession.status).toBe('TERMINATED');
    });
  });

  describe('3. Critical Instant-Kill', () => {
    it('CRITICAL violation should instantly terminate regardless of current points (0 pts)', () => {
      const decision = engine.processViolation(mockSessionId, {
        type: 'VM_DETECTED',
        payload: { hypervisor: 'VirtualBox' },
      });

      expect(decision.action).toBe('TERMINATE');
      expect(decision.isTerminated).toBe(true);
      expect(decision.status).toBe('TERMINATED');
      expect(decision.currentPoints).toBe(8);
      expect(decision.evidencePacket).toBeDefined();
      expect(decision.evidencePacket?.terminationReason).toContain('CRITICAL_VIOLATION: Virtual Machine Environment');
      expect(decision.evidencePacket?.invigilatorNotified).toBe(true);
    });

    it('all configured critical rules should trigger instant termination', () => {
      const criticalRules = [
        'PROCTORING_MODULE_TAMPERING',
        'VIRTUAL_CAMERA',
        'REMOTE_DESKTOP',
        'SECOND_PERSON_CONFIRMED',
        'IDENTITY_MISMATCH',
        'EVENT_TAMPERING',
      ];

      for (const rule of criticalRules) {
        const testSessionId = `test_crit_${rule}`;
        authority.startSession({ sessionId: testSessionId, durationSeconds: 3600 });

        const decision = engine.processViolation(testSessionId, { type: rule });
        expect(decision.action).toBe('TERMINATE');
        expect(decision.isTerminated).toBe(true);
        expect(decision.status).toBe('TERMINATED');
      }
    });
  });

  describe('4. Points Decay (1 point per 5 minutes of clean behavior)', () => {
    it('should decay points by 1 for every 5 minutes elapsed without violations', () => {
      const startMs = 1700000000000;

      // Add High violation (3 pts)
      engine.processViolation(mockSessionId, { type: 'PHONE_DETECTED' }, startMs);
      const s1 = engine.getSessionViolationStatus(mockSessionId, startMs);
      expect(s1.currentPoints).toBe(3);

      // 4 minutes elapsed -> no decay yet (threshold is 5 mins)
      const s2 = engine.getSessionViolationStatus(mockSessionId, startMs + 4 * 60 * 1000);
      expect(s2.currentPoints).toBe(3);

      // 5 minutes elapsed -> 1 point decays (3 -> 2)
      const s3 = engine.getSessionViolationStatus(mockSessionId, startMs + 5 * 60 * 1000);
      expect(s3.currentPoints).toBe(2);

      // 10 minutes elapsed -> 2 points decay (3 -> 1)
      const s4 = engine.getSessionViolationStatus(mockSessionId, startMs + 10 * 60 * 1000);
      expect(s4.currentPoints).toBe(1);

      // 15 minutes elapsed -> all 3 points decay to 0 (floor at 0)
      const s5 = engine.getSessionViolationStatus(mockSessionId, startMs + 15 * 60 * 1000);
      expect(s5.currentPoints).toBe(0);

      // Further time does not drop below 0
      const s6 = engine.getSessionViolationStatus(mockSessionId, startMs + 60 * 60 * 1000);
      expect(s6.currentPoints).toBe(0);
    });

    it('points decay should recover session from OVERLAY_ACTIVE back to WARNING/ACTIVE', () => {
      const startMs = 1700000000000;

      // Accumulate 4 points at startMs -> triggers OVERLAY
      engine.processViolation(mockSessionId, { type: 'TAB_SWITCH' }, startMs); // 2
      const dec1 = engine.processViolation(mockSessionId, { type: 'TAB_SWITCH' }, startMs); // 4
      expect(dec1.status).toBe('OVERLAY_ACTIVE');
      expect(dec1.showOverlay).toBe(true);

      // After 5 minutes clean behavior, points decay to 3
      const statusAfter5Min = engine.getSessionViolationStatus(mockSessionId, startMs + 5 * 60 * 1000);
      expect(statusAfter5Min.currentPoints).toBe(3);
      expect(statusAfter5Min.showOverlay).toBe(false);
      expect(statusAfter5Min.status).toBe('WARNING');
    });

    it('terminated sessions should not decay points', () => {
      const startMs = 1700000000000;
      engine.processViolation(mockSessionId, { type: 'EVENT_TAMPERING' }, startMs);

      // Check after 30 minutes
      const status = engine.getSessionViolationStatus(mockSessionId, startMs + 30 * 60 * 1000);
      expect(status.status).toBe('TERMINATED');
      expect(status.currentPoints).toBe(8);
    });
  });

  describe('5. Hash-Chained Ledger Commit & Audit Verification', () => {
    it('every violation, termination, and decay event should be recorded in the hash-chained ledger and verify cleanly', () => {
      const startMs = 1700000000000;

      // Event 1: Low
      engine.processViolation(mockSessionId, { type: 'LIGHTING_ISSUES' }, startMs);
      // Event 2: Medium
      engine.processViolation(mockSessionId, { type: 'GAZE_AWAY_REPEATEDLY' }, startMs + 1000);
      // Decay after 5 mins
      engine.applyDecay(mockSessionId, startMs + 5 * 60 * 1000);
      // Event 3: High
      engine.processViolation(mockSessionId, { type: 'DEVTOOLS_OPEN' }, startMs + 5 * 60 * 1000 + 1000);

      const examSession = authority.getSession(mockSessionId)!;
      // Genesis + 3 violations + 1 decay = 5 records
      expect(examSession.ledger.length).toBe(5);

      const verification = authority.verifyLedger(mockSessionId);
      expect(verification.valid).toBe(true);
      expect(verification.verifiedRecordsCount).toBe(5);
    });
  });
});

