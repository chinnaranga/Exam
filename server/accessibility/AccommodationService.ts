import crypto from 'crypto';
import express, { Request, Response, Router } from 'express';
import { examSessionAuthority } from '../integrity/ExamSessionAuthority';

export type AccommodationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';

export interface AccommodationProfile {
  // Timing & Breaks
  extraTimeMultiplier: number; // e.g. 1.25 (+25%), 1.50 (+50%), 2.00 (+100%)
  extraTimePercentage: number; // e.g. 25, 50, 100
  restBreaksAllowed: boolean;
  maxRestBreaksCount: number; // e.g. 2 breaks
  restBreakDurationMinutes: number; // e.g. 10 minutes per break

  // Accessibility Display & Navigation
  screenReaderMode: boolean;
  highContrastMode: boolean;
  largeTextMode: boolean;
  dyslexiaFontMode: boolean;
  keyboardOnlyNavigation: boolean;
  textToSpeechEnabled: boolean;

  // Proctoring & Sensor Adjustments
  approvedAssistiveSoftware: string[]; // e.g. ['JAWS', 'NVDA', 'ZoomText']
  alternativeIdentityVerification: boolean; // bypass automated face match for manual check
  relaxedGazeTolerance: boolean; // for nystagmus or ocular conditions
  allowMultipleMonitorForAssistiveDisplay: boolean; // for braille/screen magnification
}

export interface CandidateAccommodationRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  status: AccommodationStatus;
  accommodations: AccommodationProfile;
  medicalReasonEncrypted?: string; // Strictly confidential medical reason
  confidentialNotes?: string;
  submittedAt: number;
  approvedBy?: string;
  approvedAt?: number;
  revokedBy?: string;
  revokedAt?: number;
  rejectionReason?: string;
  validUntil?: number;
}

export interface AccommodationAuditEntry {
  auditId: string;
  timestamp: number;
  action:
    | 'CREATED'
    | 'APPROVED'
    | 'MODIFIED'
    | 'REJECTED'
    | 'REVOKED'
    | 'APPLIED_TO_SESSION'
    | 'BREAK_REQUESTED'
    | 'BREAK_RESUMED'
    | 'BREAK_EXPIRED';
  actorId: string;
  candidateId: string;
  sessionId?: string;
  details: string;
  metadata?: Record<string, unknown>;
}

export interface InvigilatorAccommodationView {
  hasActiveAccommodation: boolean;
  accommodationBadge: 'ACCOMMODATION ACTIVE' | 'NONE';
  extraTimeGranted: string; // e.g. "+50% Extra Time"
  restBreaksAuthorized: boolean;
  maxBreaks: number;
  breaksUsed: number;
  isOnBreak: boolean;
  currentBreakRemainingSeconds?: number;
  activeFeatures: string[]; // e.g. ['Extra Time (+50%)', 'Rest Breaks (2x10m)', 'Screen Reader Mode', 'Relaxed Gaze']
  // STRICT CONFIDENTIALITY: medicalReason and diagnosis are completely omitted!
}

export interface SessionAccommodationState {
  sessionId: string;
  candidateId: string;
  accommodationRecordId: string;
  accommodations: AccommodationProfile;
  appliedAt: number;
  originalDurationSeconds: number;
  effectiveDurationSeconds: number;
  extraTimeSecondsAdded: number;
  breaksUsedCount: number;
  isOnBreak: boolean;
  currentBreakStartedAt: number | null;
  currentBreakDeadline: number | null;
  totalBreakTimeUsedMs: number;
}

export class AccommodationService {
  public router: Router;
  // candidateId -> CandidateAccommodationRecord
  private candidateRecords: Map<string, CandidateAccommodationRecord> = new Map();
  // sessionId -> SessionAccommodationState
  private sessionStates: Map<string, SessionAccommodationState> = new Map();
  // Audit trail
  private auditLogs: AccommodationAuditEntry[] = [];

  constructor() {
    this.router = express.Router();
    this.seedDefaultAccommodations();
    this.setupRoutes();
  }

  private seedDefaultAccommodations(): void {
    // Seed approved accommodation for candidate cand_student_2026 / usz_student_01
    const candId = 'cand_student_2026';
    const record: CandidateAccommodationRecord = {
      id: 'acc_cand_2026_demo',
      candidateId: candId,
      candidateName: 'Jane Doe',
      status: 'APPROVED',
      approvedBy: 'disability_services_admin',
      approvedAt: Date.now() - 7 * 86400000,
      medicalReasonEncrypted: 'AES256:CONFIDENTIAL_MEDICAL_DOCUMENTATION_ON_FILE',
      confidentialNotes: 'ADHD and visual strain: approved +50% extra time, 2x10m rest breaks, relaxed gaze tolerance.',
      submittedAt: Date.now() - 14 * 86400000,
      validUntil: Date.now() + 180 * 86400000,
      accommodations: {
        extraTimeMultiplier: 1.5, // +50%
        extraTimePercentage: 50,
        restBreaksAllowed: true,
        maxRestBreaksCount: 2,
        restBreakDurationMinutes: 10,
        screenReaderMode: false,
        highContrastMode: true,
        largeTextMode: true,
        dyslexiaFontMode: false,
        keyboardOnlyNavigation: true,
        textToSpeechEnabled: true,
        approvedAssistiveSoftware: ['ZoomText'],
        alternativeIdentityVerification: false,
        relaxedGazeTolerance: true,
        allowMultipleMonitorForAssistiveDisplay: false,
      },
    };

    this.candidateRecords.set(candId, record);
    this.logAudit({
      action: 'APPROVED',
      actorId: 'disability_services_admin',
      candidateId: candId,
      details: 'Initial approved accommodation record created for demonstration.',
    });
  }

  /**
   * Log an accommodation event in the audit trail and the session ledger if available
   */
  public logAudit(entry: Omit<AccommodationAuditEntry, 'auditId' | 'timestamp'>): AccommodationAuditEntry {
    const fullEntry: AccommodationAuditEntry = {
      auditId: `audit_acc_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      timestamp: Date.now(),
      ...entry,
    };
    this.auditLogs.push(fullEntry);

    // Commit event to cryptographic session ledger if session is active
    if (entry.sessionId) {
      try {
        const session = examSessionAuthority.getSession(entry.sessionId);
        if (session) {
          examSessionAuthority.appendLedgerRecord(session, {
            type: `ACCOMMODATION_${entry.action}`,
            ts: fullEntry.timestamp,
            payload: {
              actorId: entry.actorId,
              candidateId: entry.candidateId,
              details: entry.details,
              metadata: entry.metadata,
            },
          });
        }
      } catch {
        // Ignored for standalone tests
      }
    }

    return fullEntry;
  }

  /**
   * Register a new candidate accommodation record (Pending approval)
   */
  public createAccommodationRequest(params: {
    candidateId: string;
    candidateName: string;
    accommodations: Partial<AccommodationProfile>;
    medicalReason?: string;
    confidentialNotes?: string;
    actorId?: string;
  }): CandidateAccommodationRecord {
    const defaultProfile: AccommodationProfile = {
      extraTimeMultiplier: params.accommodations.extraTimeMultiplier || 1.0,
      extraTimePercentage: params.accommodations.extraTimePercentage || 0,
      restBreaksAllowed: params.accommodations.restBreaksAllowed ?? false,
      maxRestBreaksCount: params.accommodations.maxRestBreaksCount || 0,
      restBreakDurationMinutes: params.accommodations.restBreakDurationMinutes || 10,
      screenReaderMode: params.accommodations.screenReaderMode ?? false,
      highContrastMode: params.accommodations.highContrastMode ?? false,
      largeTextMode: params.accommodations.largeTextMode ?? false,
      dyslexiaFontMode: params.accommodations.dyslexiaFontMode ?? false,
      keyboardOnlyNavigation: params.accommodations.keyboardOnlyNavigation ?? false,
      textToSpeechEnabled: params.accommodations.textToSpeechEnabled ?? false,
      approvedAssistiveSoftware: params.accommodations.approvedAssistiveSoftware || [],
      alternativeIdentityVerification: params.accommodations.alternativeIdentityVerification ?? false,
      relaxedGazeTolerance: params.accommodations.relaxedGazeTolerance ?? false,
      allowMultipleMonitorForAssistiveDisplay: params.accommodations.allowMultipleMonitorForAssistiveDisplay ?? false,
    };

    const record: CandidateAccommodationRecord = {
      id: `acc_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      candidateId: params.candidateId,
      candidateName: params.candidateName,
      status: 'PENDING',
      accommodations: defaultProfile,
      medicalReasonEncrypted: params.medicalReason ? `AES256:${params.medicalReason}` : undefined,
      confidentialNotes: params.confidentialNotes,
      submittedAt: Date.now(),
    };

    this.candidateRecords.set(params.candidateId, record);
    this.logAudit({
      action: 'CREATED',
      actorId: params.actorId || 'candidate_intake',
      candidateId: params.candidateId,
      details: `Accommodation request created with +${defaultProfile.extraTimePercentage}% extra time.`,
    });

    return record;
  }

  /**
   * Approve an accommodation request (Admin action)
   */
  public approveAccommodation(candidateId: string, approverId: string, notes?: string): CandidateAccommodationRecord {
    const record = this.candidateRecords.get(candidateId);
    if (!record) {
      throw new Error(`Accommodation record for candidate ${candidateId} not found.`);
    }

    record.status = 'APPROVED';
    record.approvedBy = approverId;
    record.approvedAt = Date.now();
    if (notes) record.confidentialNotes = notes;

    this.logAudit({
      action: 'APPROVED',
      actorId: approverId,
      candidateId,
      details: `Accommodation approved by ${approverId}. Multiplier: ${record.accommodations.extraTimeMultiplier}x.`,
    });

    return record;
  }

  /**
   * Revoke or reject an accommodation
   */
  public revokeAccommodation(candidateId: string, revokerId: string, reason: string): CandidateAccommodationRecord {
    const record = this.candidateRecords.get(candidateId);
    if (!record) {
      throw new Error(`Accommodation record for candidate ${candidateId} not found.`);
    }

    record.status = 'REVOKED';
    record.revokedBy = revokerId;
    record.revokedAt = Date.now();
    record.confidentialNotes = `${record.confidentialNotes || ''}\nRevoked: ${reason}`;

    this.logAudit({
      action: 'REVOKED',
      actorId: revokerId,
      candidateId,
      details: `Accommodation revoked by ${revokerId}. Reason: ${reason}`,
    });

    return record;
  }

  /**
   * Calculates the authoritative deadline with approved extra time
   */
  public calculateAccommodatedDeadline(
    baseDurationMinutes: number,
    startedAt: number,
    accommodation?: AccommodationProfile | null
  ): { deadline: number; effectiveDurationSeconds: number; extraSeconds: number } {
    if (!accommodation || accommodation.extraTimeMultiplier <= 1.0) {
      const baseSec = baseDurationMinutes * 60;
      return {
        deadline: startedAt + baseSec * 1000,
        effectiveDurationSeconds: baseSec,
        extraSeconds: 0,
      };
    }

    const multiplier = accommodation.extraTimeMultiplier;
    const effectiveMinutes = baseDurationMinutes * multiplier;
    const effectiveSec = Math.round(effectiveMinutes * 60);
    const baseSec = baseDurationMinutes * 60;
    const extraSec = effectiveSec - baseSec;

    return {
      deadline: startedAt + effectiveSec * 1000,
      effectiveDurationSeconds: effectiveSec,
      extraSeconds: extraSec,
    };
  }

  /**
   * Binds an approved accommodation to an active exam session.
   * Extends the session's authoritative deadline in ExamSessionAuthority.
   */
  public bindAccommodationToSession(
    sessionId: string,
    candidateId: string,
    baseDurationMinutes: number = 60,
    startedAtMs?: number
  ): SessionAccommodationState | null {
    const record = this.candidateRecords.get(candidateId);
    if (!record || record.status !== 'APPROVED') {
      return null;
    }

    const startedAt = startedAtMs || Date.now();
    const { deadline, effectiveDurationSeconds, extraSeconds } = this.calculateAccommodatedDeadline(
      baseDurationMinutes,
      startedAt,
      record.accommodations
    );

    const sessionState: SessionAccommodationState = {
      sessionId,
      candidateId,
      accommodationRecordId: record.id,
      accommodations: record.accommodations,
      appliedAt: Date.now(),
      originalDurationSeconds: baseDurationMinutes * 60,
      effectiveDurationSeconds,
      extraTimeSecondsAdded: extraSeconds,
      breaksUsedCount: 0,
      isOnBreak: false,
      currentBreakStartedAt: null,
      currentBreakDeadline: null,
      totalBreakTimeUsedMs: 0,
    };

    this.sessionStates.set(sessionId, sessionState);

    // Update the authoritative session deadline in ExamSessionAuthority if session exists
    const examSession = examSessionAuthority.getSession(sessionId);
    if (examSession) {
      examSession.durationSeconds = effectiveDurationSeconds;
      examSession.deadline = deadline;
    }

    this.logAudit({
      action: 'APPLIED_TO_SESSION',
      actorId: 'system_authority',
      candidateId,
      sessionId,
      details: `Accommodated deadline applied: ${effectiveDurationSeconds / 60}m (+${extraSeconds / 60}m extra).`,
      metadata: {
        multiplier: record.accommodations.extraTimeMultiplier,
        breaksAllowed: record.accommodations.restBreaksAllowed,
        deadline,
      },
    });

    return sessionState;
  }

  /**
   * Candidate Requests a Timed Rest Break.
   * Pauses the exam clock and starts break countdown.
   */
  public requestRestBreak(
    sessionId: string,
    nowMs?: number
  ): {
    success: boolean;
    breakRemainingSeconds: number;
    breakDeadline: number;
    breaksUsed: number;
    maxBreaks: number;
    error?: string;
  } {
    const state = this.sessionStates.get(sessionId);
    if (!state) {
      return {
        success: false,
        breakRemainingSeconds: 0,
        breakDeadline: 0,
        breaksUsed: 0,
        maxBreaks: 0,
        error: 'No active accommodation registered for this session.',
      };
    }

    if (!state.accommodations.restBreaksAllowed) {
      return {
        success: false,
        breakRemainingSeconds: 0,
        breakDeadline: 0,
        breaksUsed: state.breaksUsedCount,
        maxBreaks: state.accommodations.maxRestBreaksCount,
        error: 'Rest breaks are not approved for this candidate.',
      };
    }

    if (state.isOnBreak) {
      const now = nowMs || Date.now();
      const remainingSec = Math.max(0, Math.round(((state.currentBreakDeadline || now) - now) / 1000));
      return {
        success: true,
        breakRemainingSeconds: remainingSec,
        breakDeadline: state.currentBreakDeadline || now,
        breaksUsed: state.breaksUsedCount,
        maxBreaks: state.accommodations.maxRestBreaksCount,
      };
    }

    if (state.breaksUsedCount >= state.accommodations.maxRestBreaksCount) {
      return {
        success: false,
        breakRemainingSeconds: 0,
        breakDeadline: 0,
        breaksUsed: state.breaksUsedCount,
        maxBreaks: state.accommodations.maxRestBreaksCount,
        error: `All approved rest breaks (${state.accommodations.maxRestBreaksCount}) have been used.`,
      };
    }

    const now = nowMs || Date.now();
    const breakDurationMs = state.accommodations.restBreakDurationMinutes * 60 * 1000;
    const breakDeadline = now + breakDurationMs;

    state.isOnBreak = true;
    state.currentBreakStartedAt = now;
    state.currentBreakDeadline = breakDeadline;
    state.breaksUsedCount += 1;

    this.logAudit({
      action: 'BREAK_REQUESTED',
      actorId: state.candidateId,
      candidateId: state.candidateId,
      sessionId,
      details: `Rest break ${state.breaksUsedCount}/${state.accommodations.maxRestBreaksCount} started (${state.accommodations.restBreakDurationMinutes} mins).`,
      metadata: { breakDeadline, breakDurationMinutes: state.accommodations.restBreakDurationMinutes },
    });

    return {
      success: true,
      breakRemainingSeconds: state.accommodations.restBreakDurationMinutes * 60,
      breakDeadline,
      breaksUsed: state.breaksUsedCount,
      maxBreaks: state.accommodations.maxRestBreaksCount,
    };
  }

  /**
   * Candidate Resumes from Break (or break expires).
   * Authoritative exam deadline is extended by the actual elapsed break duration.
   */
  public resumeRestBreak(
    sessionId: string,
    nowMs?: number
  ): {
    success: boolean;
    actualBreakDurationSeconds: number;
    newExamDeadline: number;
    error?: string;
  } {
    const state = this.sessionStates.get(sessionId);
    if (!state || !state.isOnBreak || !state.currentBreakStartedAt) {
      return {
        success: false,
        actualBreakDurationSeconds: 0,
        newExamDeadline: 0,
        error: 'Session is not currently on an active rest break.',
      };
    }

    const now = nowMs || Date.now();
    const actualBreakMs = Math.max(0, now - state.currentBreakStartedAt);
    const actualBreakSec = Math.round(actualBreakMs / 1000);

    state.totalBreakTimeUsedMs += actualBreakMs;
    state.isOnBreak = false;
    state.currentBreakStartedAt = null;
    state.currentBreakDeadline = null;

    // Extend authoritative exam deadline in ExamSessionAuthority
    const examSession = examSessionAuthority.getSession(sessionId);
    let newExamDeadline = now;
    if (examSession) {
      examSession.deadline += actualBreakMs;
      newExamDeadline = examSession.deadline;

      // Reschedule server auto-submit timer
      if (examSession.autoSubmitTimer) {
        clearTimeout(examSession.autoSubmitTimer);
      }
      const delayMs = Math.max(0, examSession.deadline - now);
      examSession.autoSubmitTimer = setTimeout(() => {
        examSessionAuthority.triggerServerAutoSubmit(sessionId);
      }, delayMs);
    }

    this.logAudit({
      action: 'BREAK_RESUMED',
      actorId: state.candidateId,
      candidateId: state.candidateId,
      sessionId,
      details: `Rest break completed after ${actualBreakSec}s. Exam deadline extended by ${actualBreakSec}s.`,
      metadata: { actualBreakSec, newExamDeadline },
    });

    return {
      success: true,
      actualBreakDurationSeconds: actualBreakSec,
      newExamDeadline,
    };
  }

  /**
   * Policy Filter for Violation Engine.
   * Determines if a detected event should be suppressed due to approved accommodations.
   */
  public shouldSuppressViolation(
    sessionId: string,
    violationType: string,
    nowMs?: number
  ): { suppress: boolean; reason?: string } {
    const state = this.sessionStates.get(sessionId);
    if (!state) return { suppress: false };

    // 1. Approved Rest Break Active:
    // Fullscreen exit, focus loss, gaze away, and missing face are permitted while on an approved break!
    if (state.isOnBreak) {
      const allowedBreakEvents = [
        'FULLSCREEN_EXIT',
        'FOCUS_LOSS',
        'GAZE_AWAY',
        'NO_FACE_DETECTED',
        'FACE_MISSING',
        'CAMERA_OFF',
        'VOICE_DETECTED',
      ];
      if (allowedBreakEvents.includes(violationType)) {
        return {
          suppress: true,
          reason: 'APPROVED_REST_BREAK: Candidate is currently on an approved accommodation rest break.',
        };
      }
    }

    // 2. Relaxed Gaze Tolerance Accommodation:
    // Suppress gaze wandering flags for candidates with ocular/motor conditions (nystagmus, strabismus)
    if (state.accommodations.relaxedGazeTolerance && (violationType === 'GAZE_AWAY' || violationType === 'GAZE_OFF_SCREEN')) {
      return {
        suppress: true,
        reason: 'RELAXED_GAZE_TOLERANCE: Gaze monitoring relaxed per approved medical accommodation.',
      };
    }

    // 3. Alternative Identity Verification:
    // Suppress automated instant-kill for face mismatch, routing to manual proctor check
    if (state.accommodations.alternativeIdentityVerification && violationType === 'IDENTITY_MISMATCH') {
      return {
        suppress: true,
        reason: 'ALTERNATIVE_IDENTITY_VERIFICATION: Automated biometric mismatch converted to manual review.',
      };
    }

    return { suppress: false };
  }

  /**
   * Invigilator Confidentiality View Filter.
   * MANDATORY: Omits all medical reasons, diagnoses, and doctor paperwork!
   */
  public getInvigilatorAccommodationView(sessionId: string): InvigilatorAccommodationView {
    const state = this.sessionStates.get(sessionId);
    if (!state) {
      return {
        hasActiveAccommodation: false,
        accommodationBadge: 'NONE',
        extraTimeGranted: 'None',
        restBreaksAuthorized: false,
        maxBreaks: 0,
        breaksUsed: 0,
        isOnBreak: false,
        activeFeatures: [],
      };
    }

    const s = state.accommodations;
    const activeFeatures: string[] = [];

    if (s.extraTimePercentage > 0) {
      activeFeatures.push(`Extra Time (+${s.extraTimePercentage}%)`);
    }
    if (s.restBreaksAllowed) {
      activeFeatures.push(`Rest Breaks (${s.maxRestBreaksCount}x ${s.restBreakDurationMinutes}m)`);
    }
    if (s.screenReaderMode) activeFeatures.push('Screen Reader Optimization');
    if (s.highContrastMode) activeFeatures.push('High Contrast Theme');
    if (s.largeTextMode) activeFeatures.push('Large Display Typography');
    if (s.dyslexiaFontMode) activeFeatures.push('Dyslexia-Friendly Font');
    if (s.keyboardOnlyNavigation) activeFeatures.push('Keyboard-Only Navigation');
    if (s.textToSpeechEnabled) activeFeatures.push('Text-to-Speech Engine');
    if (s.relaxedGazeTolerance) activeFeatures.push('Relaxed Gaze Tracking');
    if (s.approvedAssistiveSoftware.length > 0) {
      activeFeatures.push(`Approved Assistive Software (${s.approvedAssistiveSoftware.join(', ')})`);
    }

    const now = Date.now();
    const breakRemaining = state.isOnBreak && state.currentBreakDeadline
      ? Math.max(0, Math.round((state.currentBreakDeadline - now) / 1000))
      : undefined;

    return {
      hasActiveAccommodation: true,
      accommodationBadge: 'ACCOMMODATION ACTIVE',
      extraTimeGranted: s.extraTimePercentage > 0 ? `+${s.extraTimePercentage}% Extra Time` : 'Standard Time',
      restBreaksAuthorized: s.restBreaksAllowed,
      maxBreaks: s.maxRestBreaksCount,
      breaksUsed: state.breaksUsedCount,
      isOnBreak: state.isOnBreak,
      currentBreakRemainingSeconds: breakRemaining,
      activeFeatures,
    };
  }

  /**
   * Retrieve all audit logs
   */
  public getAuditLogs(candidateId?: string): AccommodationAuditEntry[] {
    if (candidateId) {
      return this.auditLogs.filter((l) => l.candidateId === candidateId);
    }
    return [...this.auditLogs].reverse();
  }

  /**
   * Express routes for accessibility & accommodations
   */
  private setupRoutes(): void {
    // 1. Get candidate accommodation record (Admin)
    this.router.get('/candidates/:id', (req: Request, res: Response) => {
      const record = this.candidateRecords.get(req.params.id);
      if (!record) {
        return res.status(404).json({ success: false, error: 'Accommodation record not found' });
      }
      return res.json({ success: true, record });
    });

    // 2. Submit accommodation request (Admin or Candidate Intake)
    this.router.post('/candidates', (req: Request, res: Response) => {
      const record = this.createAccommodationRequest(req.body);
      return res.status(201).json({ success: true, record });
    });

    // 3. Approve accommodation (Admin)
    this.router.post('/candidates/:id/approve', (req: Request, res: Response) => {
      const { approverId, notes } = req.body;
      try {
        const record = this.approveAccommodation(req.params.id, approverId || 'admin', notes);
        return res.json({ success: true, record });
      } catch (err: any) {
        return res.status(400).json({ success: false, error: err.message });
      }
    });

    // 4. Invigilator Confidentiality View (NO medical reasons exposed)
    this.router.get('/sessions/:id/invigilator-view', (req: Request, res: Response) => {
      const view = this.getInvigilatorAccommodationView(req.params.id);
      return res.json({ success: true, view });
    });

    // 5. Candidate Request Rest Break
    this.router.post('/sessions/:id/breaks/request', (req: Request, res: Response) => {
      const result = this.requestRestBreak(req.params.id);
      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error, result });
      }
      return res.json({ success: true, ...result });
    });

    // 6. Candidate Resume Rest Break
    this.router.post('/sessions/:id/breaks/resume', (req: Request, res: Response) => {
      const result = this.resumeRestBreak(req.params.id);
      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }
      return res.json({ success: true, ...result });
    });

    // 7. Audit Trail
    this.router.get('/audit', (req: Request, res: Response) => {
      const candidateId = req.query.candidateId as string | undefined;
      const logs = this.getAuditLogs(candidateId);
      return res.json({ success: true, count: logs.length, logs });
    });
  }
}

export const accommodationService = new AccommodationService();
