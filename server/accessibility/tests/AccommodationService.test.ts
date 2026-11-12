import { describe, it, expect, beforeEach } from 'vitest';
import { AccommodationService } from '../AccommodationService';
import { ExamSessionAuthority } from '../../integrity/ExamSessionAuthority';

describe('Accommodation & Accessibility Platform Test Suite', () => {
  let service: AccommodationService;
  let authority: ExamSessionAuthority;

  beforeEach(() => {
    service = new AccommodationService();
    authority = new ExamSessionAuthority();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DEADLINE CALCULATION WITH EXTRA TIME
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Authoritative Deadline Calculation with Extra Time', () => {
    it('calculates standard deadline when no extra time is granted (1.0x)', () => {
      const now = 1700000000000;
      const baseMinutes = 60;

      const result = service.calculateAccommodatedDeadline(baseMinutes, now, {
        extraTimeMultiplier: 1.0,
        extraTimePercentage: 0,
        restBreaksAllowed: false,
        maxRestBreaksCount: 0,
        restBreakDurationMinutes: 0,
        screenReaderMode: false,
        highContrastMode: false,
        largeTextMode: false,
        dyslexiaFontMode: false,
        keyboardOnlyNavigation: false,
        textToSpeechEnabled: false,
        approvedAssistiveSoftware: [],
        alternativeIdentityVerification: false,
        relaxedGazeTolerance: false,
        allowMultipleMonitorForAssistiveDisplay: false,
      });

      expect(result.effectiveDurationSeconds).toBe(3600); // 60 mins
      expect(result.extraSeconds).toBe(0);
      expect(result.deadline).toBe(now + 3600 * 1000);
    });

    it('calculates +25% extra time deadline (1.25x)', () => {
      const now = 1700000000000;
      const baseMinutes = 60; // 60 min -> 75 min

      const result = service.calculateAccommodatedDeadline(baseMinutes, now, {
        extraTimeMultiplier: 1.25,
        extraTimePercentage: 25,
        restBreaksAllowed: false,
        maxRestBreaksCount: 0,
        restBreakDurationMinutes: 0,
        screenReaderMode: false,
        highContrastMode: false,
        largeTextMode: false,
        dyslexiaFontMode: false,
        keyboardOnlyNavigation: false,
        textToSpeechEnabled: false,
        approvedAssistiveSoftware: [],
        alternativeIdentityVerification: false,
        relaxedGazeTolerance: false,
        allowMultipleMonitorForAssistiveDisplay: false,
      });

      expect(result.effectiveDurationSeconds).toBe(4500); // 75 mins = 4500s
      expect(result.extraSeconds).toBe(900); // 15 mins extra
      expect(result.deadline).toBe(now + 4500 * 1000);
    });

    it('calculates +50% extra time deadline (1.50x)', () => {
      const now = 1700000000000;
      const baseMinutes = 60; // 60 min -> 90 min

      const result = service.calculateAccommodatedDeadline(baseMinutes, now, {
        extraTimeMultiplier: 1.5,
        extraTimePercentage: 50,
        restBreaksAllowed: true,
        maxRestBreaksCount: 2,
        restBreakDurationMinutes: 10,
        screenReaderMode: false,
        highContrastMode: false,
        largeTextMode: false,
        dyslexiaFontMode: false,
        keyboardOnlyNavigation: false,
        textToSpeechEnabled: false,
        approvedAssistiveSoftware: [],
        alternativeIdentityVerification: false,
        relaxedGazeTolerance: false,
        allowMultipleMonitorForAssistiveDisplay: false,
      });

      expect(result.effectiveDurationSeconds).toBe(5400); // 90 mins = 5400s
      expect(result.extraSeconds).toBe(1800); // 30 mins extra
      expect(result.deadline).toBe(now + 5400 * 1000);
    });

    it('calculates +100% (double time) deadline (2.0x)', () => {
      const now = 1700000000000;
      const baseMinutes = 120; // 2 hours -> 4 hours

      const result = service.calculateAccommodatedDeadline(baseMinutes, now, {
        extraTimeMultiplier: 2.0,
        extraTimePercentage: 100,
        restBreaksAllowed: true,
        maxRestBreaksCount: 3,
        restBreakDurationMinutes: 15,
        screenReaderMode: true,
        highContrastMode: true,
        largeTextMode: true,
        dyslexiaFontMode: false,
        keyboardOnlyNavigation: true,
        textToSpeechEnabled: true,
        approvedAssistiveSoftware: ['JAWS'],
        alternativeIdentityVerification: false,
        relaxedGazeTolerance: false,
        allowMultipleMonitorForAssistiveDisplay: false,
      });

      expect(result.effectiveDurationSeconds).toBe(14400); // 240 mins
      expect(result.extraSeconds).toBe(7200); // 120 mins extra
      expect(result.deadline).toBe(now + 14400 * 1000);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. TIMED REST BREAKS (PAUSE, COUNTDOWN & RESUME)
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Timed Rest Breaks (Pause, Countdown & Clock Extension)', () => {
    it('manages rest breaks, pauses the exam, and extends deadline upon resumption', () => {
      const candidateId = 'cand_break_test';
      const sessionId = 'sess_break_test';
      const now = 1700000000000;

      // 1. Create and approve candidate accommodation with 2x10m breaks
      service.createAccommodationRequest({
        candidateId,
        candidateName: 'Alex Mercer',
        accommodations: {
          extraTimeMultiplier: 1.25,
          extraTimePercentage: 25,
          restBreaksAllowed: true,
          maxRestBreaksCount: 2,
          restBreakDurationMinutes: 10,
        },
        medicalReason: 'Chronic lower back pain requiring periodic movement breaks',
      });
      service.approveAccommodation(candidateId, 'admin_doc');

      // 2. Bind accommodation to active session (60 base mins + 25% = 75 mins)
      const sessionState = service.bindAccommodationToSession(sessionId, candidateId, 60, now);
      expect(sessionState).toBeDefined();
      expect(sessionState?.effectiveDurationSeconds).toBe(4500);

      // 3. Request 1st Rest Break (10 mins = 600s)
      const break1 = service.requestRestBreak(sessionId, now + 1000 * 1000); // 1000s into exam
      expect(break1.success).toBe(true);
      expect(break1.breaksUsed).toBe(1);
      expect(break1.maxBreaks).toBe(2);
      expect(break1.breakRemainingSeconds).toBe(600); // 10 mins

      // 4. While on break, violation events must be suppressed
      const suppression1 = service.shouldSuppressViolation(sessionId, 'FULLSCREEN_EXIT');
      const suppression2 = service.shouldSuppressViolation(sessionId, 'FOCUS_LOSS');
      const suppression3 = service.shouldSuppressViolation(sessionId, 'GAZE_AWAY');
      expect(suppression1.suppress).toBe(true);
      expect(suppression2.suppress).toBe(true);
      expect(suppression3.suppress).toBe(true);

      // 5. Resume from Break after 8 minutes (480s)
      const resume1 = service.resumeRestBreak(sessionId, now + 1000 * 1000 + 480 * 1000);
      expect(resume1.success).toBe(true);
      expect(resume1.actualBreakDurationSeconds).toBe(480);

      // After resuming, candidate is no longer on break
      expect(service.shouldSuppressViolation(sessionId, 'FULLSCREEN_EXIT').suppress).toBe(false);

      // 6. Request 2nd Rest Break
      const break2 = service.requestRestBreak(sessionId, now + 2000 * 1000);
      expect(break2.success).toBe(true);
      expect(break2.breaksUsed).toBe(2);

      // Resume 2nd Break
      service.resumeRestBreak(sessionId, now + 2000 * 1000 + 300 * 1000);

      // 7. Request 3rd Break (Exceeding max count of 2) -> REJECTED
      const break3 = service.requestRestBreak(sessionId, now + 3000 * 1000);
      expect(break3.success).toBe(false);
      expect(break3.error).toContain('All approved rest breaks (2) have been used');
    });

    it('rejects break requests for candidates without rest break authorization', () => {
      const candidateId = 'cand_no_break';
      const sessionId = 'sess_no_break';

      service.createAccommodationRequest({
        candidateId,
        candidateName: 'Taylor Swift',
        accommodations: {
          extraTimeMultiplier: 1.5,
          extraTimePercentage: 50,
          restBreaksAllowed: false, // NOT ALLOWED
        },
      });
      service.approveAccommodation(candidateId, 'admin_doc');
      service.bindAccommodationToSession(sessionId, candidateId, 60);

      const result = service.requestRestBreak(sessionId);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Rest breaks are not approved');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. VIOLATION SUPPRESSION & RELAXED GAZE TOLERANCE
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Violation Engine Accommodation Policy Filters', () => {
    it('suppresses gaze violations when relaxed gaze tolerance accommodation is approved', () => {
      const candidateId = 'cand_relaxed_gaze';
      const sessionId = 'sess_relaxed_gaze';

      service.createAccommodationRequest({
        candidateId,
        candidateName: 'Jordan Lee',
        accommodations: {
          relaxedGazeTolerance: true, // Motor/Ocular condition
        },
        medicalReason: 'Nystagmus (involuntary eye movement)',
      });
      service.approveAccommodation(candidateId, 'disability_admin');
      service.bindAccommodationToSession(sessionId, candidateId, 60);

      // Gaze wandering is suppressed
      const gazeCheck = service.shouldSuppressViolation(sessionId, 'GAZE_AWAY');
      expect(gazeCheck.suppress).toBe(true);
      expect(gazeCheck.reason).toContain('RELAXED_GAZE_TOLERANCE');

      // However, unrelated security breaches (e.g. VIRTUAL_CAMERA) are NOT suppressed!
      const camCheck = service.shouldSuppressViolation(sessionId, 'VIRTUAL_CAMERA');
      expect(camCheck.suppress).toBe(false);
    });

    it('suppresses biometric identity mismatch for alternative verification path', () => {
      const candidateId = 'cand_alt_id';
      const sessionId = 'sess_alt_id';

      service.createAccommodationRequest({
        candidateId,
        candidateName: 'Morgan Bailey',
        accommodations: {
          alternativeIdentityVerification: true,
        },
        medicalReason: 'Facial trauma / burns preventing automated contour detection',
      });
      service.approveAccommodation(candidateId, 'disability_admin');
      service.bindAccommodationToSession(sessionId, candidateId, 60);

      const idCheck = service.shouldSuppressViolation(sessionId, 'IDENTITY_MISMATCH');
      expect(idCheck.suppress).toBe(true);
      expect(idCheck.reason).toContain('ALTERNATIVE_IDENTITY_VERIFICATION');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. CONFIDENTIALITY IN INVIGILATOR VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Confidentiality: Medical Reason Segregation for Invigilators', () => {
    it('displays accommodation status and active accommodations without exposing medical diagnosis', () => {
      const candidateId = 'cand_confidential';
      const sessionId = 'sess_confidential';

      service.createAccommodationRequest({
        candidateId,
        candidateName: 'Confidential Candidate',
        accommodations: {
          extraTimeMultiplier: 1.5,
          extraTimePercentage: 50,
          restBreaksAllowed: true,
          maxRestBreaksCount: 2,
          restBreakDurationMinutes: 10,
          screenReaderMode: true,
          relaxedGazeTolerance: true,
        },
        medicalReason: 'CONFIDENTIAL: Severe Post-Concussive Syndrome and Clinical Photophobia',
        confidentialNotes: 'Doctor note signed by Neurologist Dr. Smith on 2026-10-15',
      });
      service.approveAccommodation(candidateId, 'chief_medical_officer');
      service.bindAccommodationToSession(sessionId, candidateId, 60);

      const invigilatorView = service.getInvigilatorAccommodationView(sessionId);

      expect(invigilatorView.hasActiveAccommodation).toBe(true);
      expect(invigilatorView.accommodationBadge).toBe('ACCOMMODATION ACTIVE');
      expect(invigilatorView.extraTimeGranted).toBe('+50% Extra Time');
      expect(invigilatorView.restBreaksAuthorized).toBe(true);
      expect(invigilatorView.activeFeatures).toContain('Extra Time (+50%)');
      expect(invigilatorView.activeFeatures).toContain('Screen Reader Optimization');
      expect(invigilatorView.activeFeatures).toContain('Relaxed Gaze Tracking');

      // CRITICAL SECURITY ASSERTION: Medical reason & confidential notes are NEVER exposed!
      const json = JSON.stringify(invigilatorView);
      expect(json).not.toContain('Concussive');
      expect(json).not.toContain('Photophobia');
      expect(json).not.toContain('Neurologist');
      expect((invigilatorView as any).medicalReason).toBeUndefined();
      expect((invigilatorView as any).confidentialNotes).toBeUndefined();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. AUDIT TRAIL LIFECYCLE
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Accommodation Audit Trail Lifecycle', () => {
    it('records immutable audit log entries when accommodations are created, approved, revoked, and used', () => {
      const candidateId = 'cand_audit_test';
      const sessionId = 'sess_audit_test';

      // 1. Create
      service.createAccommodationRequest({
        candidateId,
        candidateName: 'Audit Candidate',
        accommodations: { extraTimeMultiplier: 1.25, extraTimePercentage: 25 },
        actorId: 'advisor_clara',
      });

      // 2. Approve
      service.approveAccommodation(candidateId, 'dean_morrison');

      // 3. Apply to Session
      service.bindAccommodationToSession(sessionId, candidateId, 60);

      // 4. Revoke
      service.revokeAccommodation(candidateId, 'dean_morrison', 'Student requested standard time');

      const logs = service.getAuditLogs(candidateId);
      expect(logs.length).toBeGreaterThanOrEqual(4);

      const actions = logs.map((l) => l.action);
      expect(actions).toContain('CREATED');
      expect(actions).toContain('APPROVED');
      expect(actions).toContain('APPLIED_TO_SESSION');
      expect(actions).toContain('REVOKED');
      expect(logs.every((l) => l.auditId && l.timestamp > 0)).toBe(true);
    });
  });
});

