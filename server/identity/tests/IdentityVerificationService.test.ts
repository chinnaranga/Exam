import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { IdentityVerificationService } from '../IdentityVerificationService';
import { ExamSessionAuthority } from '../../integrity/ExamSessionAuthority';
import { ViolationEngine } from '../../integrity/ViolationEngine';

describe('IdentityVerificationService & Pre-Exam Biometric Clearance', () => {
  let authority: ExamSessionAuthority;
  let violations: ViolationEngine;
  let service: IdentityVerificationService;

  beforeEach(() => {
    authority = new ExamSessionAuthority();
    violations = new ViolationEngine(authority);
    service = new IdentityVerificationService(authority, violations);
  });

  afterEach(() => {
    service.clear();
    violations.clear();
    authority.clear();
  });

  describe('1. ID Check & Zero Raw Video Storage', () => {
    it('stores ONLY the match score and an encrypted snapshot, never raw video or raw image', () => {
      const session = authority.startSession({
        candidateId: 'cand_101',
        examId: 'exam_cs402',
        durationSeconds: 3600,
      });

      service.bindSession({
        sessionId: session.id,
        candidateId: 'cand_101',
        deviceFingerprint: 'mac-chrome-v120',
        ipAddress: '192.168.1.10',
      });

      const mockIdCard = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
      const mockLiveCapture = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

      const result = service.verifyIdDocument({
        sessionId: session.id,
        idDocumentDataUrl: mockIdCard,
        liveCaptureDataUrl: mockLiveCapture,
      });

      expect(result.success).toBe(true);
      expect(result.verified).toBe(true);
      expect(result.matchScore).toBeGreaterThanOrEqual(70);

      // Verify that the record stored in memory has ONLY an encrypted snapshot reference, not raw video/dataURL
      const record = service.getSessionRecord(session.id);
      expect(record).toBeDefined();
      expect(record?.idCheckCompleted).toBe(true);
      expect(record?.encryptedSnapshotRef).toContain('enc_snap_');
      expect(record?.encryptedSnapshotRef).not.toContain(mockIdCard);
      expect(record?.encryptedSnapshotRef).not.toContain(mockLiveCapture);

      // Verify recorded in the hash-chained ledger
      const verifiedSession = authority.getSession(session.id);
      const ledgerEntry = verifiedSession?.ledger.find((l) => l.eventData.type === 'ID_DOCUMENT_VERIFIED');
      expect(ledgerEntry).toBeDefined();
      expect((ledgerEntry?.eventData.payload as Record<string, unknown>).matchScore).toBe(result.matchScore);
      expect((ledgerEntry?.eventData.payload as Record<string, unknown>).encryptedSnapshotRef).toBe(record?.encryptedSnapshotRef);
    });
  });

  describe('2. Non-Replayable Server-Issued Liveness Challenges', () => {
    it('issues randomized server challenges with cryptographic nonces that cannot be replayed', () => {
      const session = authority.startSession({
        candidateId: 'cand_102',
        examId: 'exam_cs402',
        durationSeconds: 3600,
      });

      service.bindSession({
        sessionId: session.id,
        candidateId: 'cand_102',
        deviceFingerprint: 'win-chrome-v121',
        ipAddress: '10.0.0.5',
      });

      const challenge1 = service.generateLivenessChallenge(session.id);
      expect(challenge1.challengeId).toBeDefined();
      expect(challenge1.nonce).toBeDefined();
      expect(['TURN_HEAD_LEFT', 'TURN_HEAD_RIGHT', 'BLINK_TWICE', 'SMILE']).toContain(challenge1.challengeType);

      // Verify challenge with matching nonce succeeds
      const verifyResult = service.verifyLivenessChallenge({
        sessionId: session.id,
        challengeId: challenge1.challengeId,
        nonce: challenge1.nonce,
        gestureConfidence: 92,
      });

      expect(verifyResult.verified).toBe(true);

      // Second attempt with the same challenge MUST be rejected (replay attack prevention)
      const replayAttempt = service.verifyLivenessChallenge({
        sessionId: session.id,
        challengeId: challenge1.challengeId,
        nonce: challenge1.nonce,
        gestureConfidence: 92,
      });

      expect(replayAttempt.verified).toBe(false);
      expect(replayAttempt.error).toContain('already completed');
    });

    it('rejects an invalid or tampered nonce', () => {
      const session = authority.startSession({
        candidateId: 'cand_103',
        examId: 'exam_cs402',
        durationSeconds: 3600,
      });

      service.bindSession({
        sessionId: session.id,
        candidateId: 'cand_103',
        deviceFingerprint: 'win-chrome-v121',
        ipAddress: '10.0.0.5',
      });

      const challenge = service.generateLivenessChallenge(session.id);
      const invalidVerify = service.verifyLivenessChallenge({
        sessionId: session.id,
        challengeId: challenge.challengeId,
        nonce: 'invalid_forged_nonce',
        gestureConfidence: 95,
      });

      expect(invalidVerify.verified).toBe(false);
      expect(invalidVerify.error).toContain('Invalid or expired');
    });
  });

  describe('3. Mid-Exam Random Re-Verification & Timeouts', () => {
    it('applies a HIGH violation (3 points) when 10-second prompt is missed or times out', () => {
      const session = authority.startSession({
        candidateId: 'cand_104',
        examId: 'exam_cs402',
        durationSeconds: 3600,
      });

      service.bindSession({
        sessionId: session.id,
        candidateId: 'cand_104',
        deviceFingerprint: 'mac-safari-v17',
        ipAddress: '172.16.0.4',
      });

      // Trigger re-verification prompt
      const prompt = service.triggerReverifyPrompt(session.id, { challengeType: 'BLINK_TWICE' });
      expect(prompt).toBeDefined();

      const sessionStateBefore = violations.getSessionState(session.id);
      expect(sessionStateBefore?.points).toBe(0);

      // Simulate 10-second timeout
      service.handleReverifyTimeout(session.id, prompt.challengeId);

      const sessionStateAfter = violations.getSessionState(session.id);
      // REVERIFY_CHALLENGE_TIMEOUT is HIGH = 3 points
      expect(sessionStateAfter?.points).toBe(3);
      expect(sessionStateAfter?.violations.some((v) => v.type === 'REVERIFY_CHALLENGE_TIMEOUT')).toBe(true);
    });

    it('triggers CRITICAL instant termination on mid-exam face mismatch', () => {
      const session = authority.startSession({
        candidateId: 'cand_105',
        examId: 'exam_cs402',
        durationSeconds: 3600,
      });

      service.bindSession({
        sessionId: session.id,
        candidateId: 'cand_105',
        deviceFingerprint: 'mac-chrome-v120',
        ipAddress: '192.168.1.15',
      });

      const prompt = service.triggerReverifyPrompt(session.id, { challengeType: 'SMILE' });

      // Mid-exam face score is 35% (< 70 threshold) => Face Mismatch
      const result = service.completeReverify({
        sessionId: session.id,
        challengeId: prompt.challengeId,
        faceMatchScore: 35,
        gestureCompleted: true,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe('IDENTITY_MISMATCH_TERMINATED');

      const sessionState = violations.getSessionState(session.id);
      // IDENTITY_MISMATCH is CRITICAL = 8 points and instant termination
      expect(sessionState?.points).toBe(8);
      expect(sessionState?.isTerminated).toBe(true);
      expect(authority.getSession(session.id)?.status).toBe('TERMINATED');
    });
  });

  describe('4. Session Binding & Concurrent Session Defense', () => {
    it('blocks and logs a second concurrent login attempt for the same candidate', () => {
      const session1 = authority.startSession({
        candidateId: 'cand_106',
        examId: 'exam_cs402',
        durationSeconds: 3600,
      });

      const bind1 = service.bindSession({
        sessionId: session1.id,
        candidateId: 'cand_106',
        deviceFingerprint: 'mac-chrome-original',
        ipAddress: '192.168.1.50',
      });
      expect(bind1.success).toBe(true);

      // Attempt 2nd login for candidate 106 under a new session
      const session2 = authority.startSession({
        candidateId: 'cand_106',
        examId: 'exam_cs402',
        durationSeconds: 3600,
      });

      const bind2 = service.bindSession({
        sessionId: session2.id,
        candidateId: 'cand_106',
        deviceFingerprint: 'attacker-firefox-different',
        ipAddress: '203.0.113.88',
      });

      // 2nd login must be blocked
      expect(bind2.success).toBe(false);
      expect(bind2.error).toContain('Concurrent examination login blocked');

      // CONCURRENT_SESSION_BLOCKED violation must be recorded on the original active session
      const sessionState1 = violations.getSessionState(session1.id);
      expect(sessionState1?.violations.some((v) => v.type === 'CONCURRENT_SESSION_BLOCKED')).toBe(true);
      expect(sessionState1?.isTerminated).toBe(true); // CRITICAL instant kill
    });

    it('triggers a re-verify challenge and logs violation when device fingerprint or IP changes mid-exam', () => {
      const session = authority.startSession({
        candidateId: 'cand_107',
        examId: 'exam_cs402',
        durationSeconds: 3600,
      });

      service.bindSession({
        sessionId: session.id,
        candidateId: 'cand_107',
        deviceFingerprint: 'mac-chrome-original',
        ipAddress: '192.168.1.50',
      });

      // Mid-exam device change detected
      const result = service.checkSessionBinding({
        sessionId: session.id,
        deviceFingerprint: 'new-unauthorized-device-fingerprint',
        ipAddress: '192.168.1.50',
      });

      expect(result.valid).toBe(false);
      expect(result.reverifyRequired).toBe(true);
      expect(result.reverifyChallenge).toBeDefined();

      const sessionState = violations.getSessionState(session.id);
      // DEVICE_FINGERPRINT_CHANGED is HIGH = 3 points
      expect(sessionState?.points).toBe(3);
      expect(sessionState?.violations.some((v) => v.type === 'DEVICE_FINGERPRINT_CHANGED')).toBe(true);
    });
  });

  describe('5. Typing Baseline & Keystroke Rhythm Cadence', () => {
    it('captures baseline and flags large cadence deviation (>65%) as MEDIUM for human review only', () => {
      const session = authority.startSession({
        candidateId: 'cand_108',
        examId: 'exam_cs402',
        durationSeconds: 3600,
      });

      service.bindSession({
        sessionId: session.id,
        candidateId: 'cand_108',
        deviceFingerprint: 'mac-chrome-v120',
        ipAddress: '192.168.1.60',
      });

      // Calibrate baseline: steady 120ms keydown intervals
      const normalBaselineIntervals = [120, 118, 122, 119, 121, 125, 117, 120];
      const baseline = service.captureTypingBaseline({
        sessionId: session.id,
        keyIntervalsMs: normalBaselineIntervals,
        sampleLength: 80,
      });

      expect(baseline.meanIntervalMs).toBeCloseTo(120, 0);

      // During exam: normal cadence (~128ms, <65% shift)
      const normalVerification = service.verifyTypingCadence({
        sessionId: session.id,
        keyIntervalsMs: [125, 130, 128, 124, 132],
      });
      expect(normalVerification.deviationPercent).toBeLessThan(65);
      expect(normalVerification.flaggedForHumanReview).toBe(false);

      // Later: huge cadence shift (e.g. 350ms per key, >65% deviation, indicating possible ghostwriter)
      const ghostwriterVerification = service.verifyTypingCadence({
        sessionId: session.id,
        keyIntervalsMs: [350, 360, 340, 370, 355],
      });

      expect(ghostwriterVerification.deviationPercent).toBeGreaterThan(65);
      expect(ghostwriterVerification.flaggedForHumanReview).toBe(true);

      const sessionState = violations.getSessionState(session.id);
      // TYPING_RHYTHM_DEVIATION is MEDIUM = 2 points
      expect(sessionState?.points).toBe(2);
      expect(sessionState?.isTerminated).toBe(false); // NEVER auto-terminates
      expect(sessionState?.violations.some((v) => v.type === 'TYPING_RHYTHM_DEVIATION')).toBe(true);
    });
  });

  describe('6. Accessibility Accommodations', () => {
    it('allows candidates with approved accommodations to use alternative verification paths and bypass typing baseline', () => {
      const session = authority.startSession({
        candidateId: 'cand_109_accommodated',
        examId: 'exam_cs402',
        durationSeconds: 3600,
      });

      service.bindSession({
        sessionId: session.id,
        candidateId: 'cand_109_accommodated',
        deviceFingerprint: 'mac-chrome-v120',
        ipAddress: '192.168.1.70',
      });

      // Admin approves motor impairment accommodation
      service.registerAccommodation({
        sessionId: session.id,
        accommodation: {
          candidateId: 'cand_109_accommodated',
          accommodationType: 'MOTOR_IMPAIRMENT',
          approvedBy: 'dean_academic_affairs',
          approvedAt: Date.now(),
          notes: 'Motor impairment accommodation: bypass typing rhythm sentinel and rapid head turns.',
          bypassTypingBaseline: true,
          bypassMovementLiveness: true,
          alternativeLivenessChallenge: 'STATIC_GAZE',
        },
      });

      // 1. Typing verification must be bypassed with 0 violation points
      const typingVerification = service.verifyTypingCadence({
        sessionId: session.id,
        keyIntervalsMs: [900, 950, 850], // Huge deviation, but bypassed!
      });

      expect(typingVerification.bypassed).toBe(true);
      expect(typingVerification.flaggedForHumanReview).toBe(false);

      const sessionState = violations.getSessionState(session.id);
      expect(sessionState?.points).toBe(0);

      // 2. Liveness challenge issues alternative STATIC_GAZE challenge instead of rapid head turns
      const challenge = service.generateLivenessChallenge(session.id);
      expect(challenge.challengeType).toBe('STATIC_GAZE');
      expect(challenge.instructions).toContain('gaze');
    });
  });
});
