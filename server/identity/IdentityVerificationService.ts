import crypto from 'crypto';
import express, { Request, Response, Router } from 'express';
import { ExamSessionAuthority, examSessionAuthority } from '../integrity/ExamSessionAuthority';
import { ViolationEngine, violationEngine } from '../integrity/ViolationEngine';

export type LivenessChallengeType = 'TURN_HEAD_LEFT' | 'TURN_HEAD_RIGHT' | 'BLINK_TWICE' | 'SMILE';

export type AccommodationType =
  | 'MOTOR_IMPAIRMENT'
  | 'VISUAL_IMPAIRMENT'
  | 'FACIAL_MOBILITY_IMPAIRMENT'
  | 'MANUAL_PROCTOR_VERIFIED';

export interface CandidateAccommodation {
  candidateId: string;
  accommodationType: AccommodationType;
  approvedBy: string;
  approvedAt: number;
  notes: string;
  bypassTypingBaseline: boolean;
  bypassMovementLiveness: boolean;
  alternativeLivenessChallenge?: 'AUDIO_PHRASE' | 'STATIC_GAZE' | 'PROCTOR_SIGN_OFF';
}

export interface TypingBaseline {
  meanIntervalMs: number;
  varianceMs: number;
  typingSpeedWpm: number;
  sampleLength: number;
  capturedAt: number;
}

export interface SessionBinding {
  candidateId: string;
  sessionId: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent?: string;
  boundAt: number;
}

export interface LivenessChallenge {
  challengeId: string;
  challengeType: LivenessChallengeType | 'AUDIO_PHRASE' | 'STATIC_GAZE';
  instructions: string;
  nonce: string;
  issuedAt: number;
  expiresAt: number;
  isCompleted: boolean;
}

export interface ReverifySchedule {
  scheduledAtMs: number;
  executed: boolean;
  challenge?: LivenessChallenge;
  promptIssuedAt?: number;
  timeoutTimer?: NodeJS.Timeout;
}

export interface SessionIdentityRecord {
  sessionId: string;
  candidateId: string;
  idCheckCompleted: boolean;
  idMatchScore: number;
  encryptedSnapshotRef: string;
  livenessVerified: boolean;
  binding: SessionBinding;
  typingBaseline: TypingBaseline | null;
  accommodation: CandidateAccommodation | null;
  reverifySchedules: ReverifySchedule[];
  activeReverifyPrompt: {
    active: boolean;
    challenge: LivenessChallenge | null;
    expiresAt: number;
  } | null;
}

export class IdentityVerificationService {
  private sessions: Map<string, SessionIdentityRecord> = new Map();
  // One active session per candidate mapping
  private activeCandidateSessions: Map<string, string> = new Map();
  private issuedChallenges: Map<string, LivenessChallenge> = new Map();
  private authority: ExamSessionAuthority;
  private violations: ViolationEngine;
  public readonly router: Router;

  // Encryption key for ID snapshots (never storing raw image/video)
  private readonly snapshotEncryptionKey: Buffer;

  constructor(
    authority: ExamSessionAuthority = examSessionAuthority,
    violations: ViolationEngine = violationEngine
  ) {
    this.authority = authority;
    this.violations = violations;
    this.snapshotEncryptionKey = crypto.randomBytes(32);
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Initializes identity binding for a new session.
   * Enforces: One active session per candidate. If a 2nd login is attempted, blocks and logs it.
   */
  public bindSession(params: {
    sessionId: string;
    candidateId: string;
    deviceFingerprint: string;
    ipAddress: string;
    userAgent?: string;
    durationSeconds?: number;
    nowMs?: number;
  }): { success: boolean; error?: string; sessionRecord?: SessionIdentityRecord } {
    const now = params.nowMs || Date.now();

    // Enforce Single Active Session Constraint
    const existingActiveSessionId = this.activeCandidateSessions.get(params.candidateId);
    if (existingActiveSessionId && existingActiveSessionId !== params.sessionId) {
      const existingExam = this.authority.getSession(existingActiveSessionId);
      if (existingExam && existingExam.status === 'ACTIVE') {
        // Block 2nd login & log violation on the existing session
        this.violations.processViolation(existingActiveSessionId, {
          type: 'CONCURRENT_SESSION_BLOCKED',
          payload: {
            attemptedSessionId: params.sessionId,
            candidateId: params.candidateId,
            attemptedIp: params.ipAddress,
            attemptedFingerprint: params.deviceFingerprint,
          },
          timestamp: now,
        });

        return {
          success: false,
          error: `Concurrent examination login blocked. Candidate ${params.candidateId} already has an active examination session (${existingActiveSessionId}).`,
        };
      }
    }

    // Schedule 2-3 random mid-exam re-verifications
    const duration = params.durationSeconds || 3600;
    const reverifySchedules: ReverifySchedule[] = [
      { scheduledAtMs: now + Math.round(duration * 1000 * 0.25), executed: false },
      { scheduledAtMs: now + Math.round(duration * 1000 * 0.55), executed: false },
      { scheduledAtMs: now + Math.round(duration * 1000 * 0.85), executed: false },
    ];

    const record: SessionIdentityRecord = {
      sessionId: params.sessionId,
      candidateId: params.candidateId,
      idCheckCompleted: false,
      idMatchScore: 0,
      encryptedSnapshotRef: '',
      livenessVerified: false,
      binding: {
        candidateId: params.candidateId,
        sessionId: params.sessionId,
        deviceFingerprint: params.deviceFingerprint,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        boundAt: now,
      },
      typingBaseline: null,
      accommodation: null,
      reverifySchedules,
      activeReverifyPrompt: null,
    };

    this.sessions.set(params.sessionId, record);
    this.activeCandidateSessions.set(params.candidateId, params.sessionId);

    // Commit binding to ledger
    const examSession = this.authority.getSession(params.sessionId);
    if (examSession) {
      this.authority.appendLedgerRecord(examSession, {
        type: 'SESSION_IDENTITY_BOUND',
        ts: now,
        payload: {
          candidateId: params.candidateId,
          deviceFingerprintHash: crypto.createHash('sha256').update(params.deviceFingerprint).digest('hex'),
          ipAddress: params.ipAddress,
        },
      });
    }

    return { success: true, sessionRecord: record };
  }

  /**
   * Verify ID document photo against live camera capture.
   * Stores ONLY the match score and encrypted snapshot reference, NEVER raw video.
   */
  public verifyIdDocument(params: {
    sessionId: string;
    idDocumentDataUrl: string;
    liveCaptureDataUrl: string;
    nowMs?: number;
  }): { success: boolean; matchScore: number; verified: boolean; error?: string } {
    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Identity session ${params.sessionId} not found`);
    }

    const now = params.nowMs || Date.now();

    // Check for admin accommodation bypass
    if (session.accommodation && session.accommodation.accommodationType === 'MANUAL_PROCTOR_VERIFIED') {
      session.idCheckCompleted = true;
      session.idMatchScore = 100;
      session.encryptedSnapshotRef = 'PROCTOR_MANUAL_VERIFIED_OVERRIDE';

      return {
        success: true,
        matchScore: 100,
        verified: true,
      };
    }

    // Biometric match score computation
    // Simulates Wasm feature vector cosine similarity (90-98% match)
    const baseScore = params.idDocumentDataUrl && params.liveCaptureDataUrl ? 92 : 0;
    const matchScore = Math.min(100, Math.max(0, baseScore + (Math.random() * 6 - 3)));
    const verified = matchScore >= 80;

    // Encrypt snapshot with AES-256-GCM (never saving raw video or plain image files)
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.snapshotEncryptionKey, iv);
    const sampleBytes = Buffer.from(params.liveCaptureDataUrl.slice(0, 128), 'utf-8');
    const encrypted = Buffer.concat([cipher.update(sampleBytes), cipher.final()]);
    const tag = cipher.getAuthTag();
    const encryptedSnapshotRef = `enc_snap_aes_${iv.toString('hex')}_${encrypted.toString('hex')}_${tag.toString('hex')}`;

    session.idCheckCompleted = verified;
    session.idMatchScore = Math.round(matchScore);
    session.encryptedSnapshotRef = encryptedSnapshotRef;

    // Log to hash-chained ledger
    const examSession = this.authority.getSession(params.sessionId);
    if (examSession) {
      this.authority.appendLedgerRecord(examSession, {
        type: 'ID_DOCUMENT_VERIFIED',
        ts: now,
        payload: {
          verified,
          matchScore: Math.round(matchScore),
          encryptedSnapshotRef,
          accommodationApplied: !!session.accommodation,
        },
      });
    }

    if (!verified) {
      this.violations.processViolation(params.sessionId, {
        type: 'IDENTITY_MISMATCH',
        payload: { matchScore: Math.round(matchScore), reason: 'ID face contour does not match live capture' },
        timestamp: now,
      });
    }

    return {
      success: verified,
      matchScore: Math.round(matchScore),
      verified,
    };
  }

  /**
   * Generates a non-replayable server-chosen liveness challenge.
   */
  public generateLivenessChallenge(sessionId: string, nowMs?: number): LivenessChallenge {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Identity session ${sessionId} not found`);
    }

    const now = nowMs || Date.now();
    const challenges: LivenessChallengeType[] = ['TURN_HEAD_LEFT', 'TURN_HEAD_RIGHT', 'BLINK_TWICE', 'SMILE'];

    // Handle accessibility accommodation
    let challengeType: LivenessChallenge['challengeType'] = challenges[Math.floor(Math.random() * challenges.length)];
    let instructions = '';

    if (session.accommodation?.bypassMovementLiveness) {
      challengeType = session.accommodation.alternativeLivenessChallenge || 'STATIC_GAZE';
      instructions = 'Accessibility Accommodation: Please hold a steady forward gaze for 3 seconds.';
    } else {
      switch (challengeType) {
        case 'TURN_HEAD_LEFT':
          instructions = 'Slowly turn your head to the left and look back at the screen.';
          break;
        case 'TURN_HEAD_RIGHT':
          instructions = 'Slowly turn your head to the right and look back at the screen.';
          break;
        case 'BLINK_TWICE':
          instructions = 'Blink your eyes twice deliberately.';
          break;
        case 'SMILE':
          instructions = 'Smile naturally at the camera.';
          break;
      }
    }

    const challenge: LivenessChallenge = {
      challengeId: `live_${now}_${Math.random().toString(36).substring(2, 7)}`,
      challengeType,
      instructions,
      nonce: crypto.randomBytes(16).toString('hex'),
      issuedAt: now,
      expiresAt: now + 30_000, // 30s validity
      isCompleted: false,
    };

    this.issuedChallenges.set(challenge.challengeId, challenge);
    return challenge;
  }

  /**
   * Verifies proof of liveness challenge completion.
   */
  public verifyLivenessChallenge(params: {
    sessionId: string;
    challengeId: string;
    nonce: string;
    gestureConfidence?: number;
    nowMs?: number;
  }): { verified: boolean; message?: string; error?: string } {
    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Identity session ${params.sessionId} not found`);
    }

    const now = params.nowMs || Date.now();
    const challenge = this.issuedChallenges.get(params.challengeId);

    if (!challenge) {
      return { verified: false, error: 'Invalid or expired challenge' };
    }
    if (challenge.isCompleted) {
      return { verified: false, error: 'Challenge was already completed (replay rejected)' };
    }
    if (challenge.nonce !== params.nonce) {
      return { verified: false, error: 'Invalid or expired nonce (tampered)' };
    }
    if (now > challenge.expiresAt) {
      return { verified: false, error: 'Challenge has expired' };
    }

    const confidence = params.gestureConfidence !== undefined ? params.gestureConfidence : 0.95;
    const verified = confidence >= 0.75;

    challenge.isCompleted = true;
    session.livenessVerified = verified;

    const examSession = this.authority.getSession(params.sessionId);
    if (examSession) {
      this.authority.appendLedgerRecord(examSession, {
        type: 'LIVENESS_CHALLENGE_VERIFIED',
        ts: now,
        payload: {
          challengeId: params.challengeId,
          verified,
          confidence,
        },
      });
    }

    return {
      verified,
      message: verified ? 'Liveness verified successfully.' : 'Liveness verification failed. Gesture was not recognized.',
    };
  }

  /**
   * Checks mid-exam scheduled re-verifications and environmental shifts (fingerprint / IP).
   * 10-second prompt: failing or missing it = HIGH violation. Face mismatch = CRITICAL.
   */
  public checkMidExamIdentity(
    sessionId: string,
    currentEnvironment: { deviceFingerprint?: string; ipAddress?: string },
    nowMs?: number
  ): { reverifyRequired: boolean; activeChallenge?: LivenessChallenge; warning?: string } {
    const session = this.sessions.get(sessionId);
    if (!session) return { reverifyRequired: false };

    const now = nowMs || Date.now();

    // 1. Check Session Binding: Device Fingerprint & IP Shifts
    if (currentEnvironment.deviceFingerprint && currentEnvironment.deviceFingerprint !== session.binding.deviceFingerprint) {
      this.violations.processViolation(sessionId, {
        type: 'DEVICE_FINGERPRINT_CHANGED',
        payload: {
          originalFingerprintHash: crypto.createHash('sha256').update(session.binding.deviceFingerprint).digest('hex'),
          newFingerprintHash: crypto.createHash('sha256').update(currentEnvironment.deviceFingerprint).digest('hex'),
        },
        timestamp: now,
      });

      // Update binding and trigger immediate re-verify
      session.binding.deviceFingerprint = currentEnvironment.deviceFingerprint;
      const challenge = this.triggerReverifyPrompt(sessionId, now);
      return { reverifyRequired: true, activeChallenge: challenge, warning: 'Hardware environment change detected.' };
    }

    if (currentEnvironment.ipAddress && currentEnvironment.ipAddress !== session.binding.ipAddress) {
      this.violations.processViolation(sessionId, {
        type: 'IP_ADDRESS_CHANGED',
        payload: {
          originalIp: session.binding.ipAddress,
          newIp: currentEnvironment.ipAddress,
        },
        timestamp: now,
      });

      session.binding.ipAddress = currentEnvironment.ipAddress;
      const challenge = this.triggerReverifyPrompt(sessionId, now);
      return { reverifyRequired: true, activeChallenge: challenge, warning: 'Network IP change detected.' };
    }

    // 2. Check scheduled 2-3 random mid-exam re-verifications
    for (const schedule of session.reverifySchedules) {
      if (!schedule.executed && now >= schedule.scheduledAtMs) {
        schedule.executed = true;
        const challenge = this.triggerReverifyPrompt(sessionId, now);
        schedule.challenge = challenge;
        return { reverifyRequired: true, activeChallenge: challenge };
      }
    }

    if (session.activeReverifyPrompt?.active) {
      return { reverifyRequired: true, activeChallenge: session.activeReverifyPrompt.challenge || undefined };
    }

    return { reverifyRequired: false };
  }

  /**
   * Triggers a 10-second mid-exam liveness challenge prompt.
   * If missing or failed after 10s, logs HIGH violation (3 pts).
   */
  public triggerReverifyPrompt(sessionId: string, nowMs?: number): LivenessChallenge {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Identity session ${sessionId} not found`);
    }

    const now = nowMs || Date.now();
    const challenge = this.generateLivenessChallenge(sessionId, now);

    session.activeReverifyPrompt = {
      active: true,
      challenge,
      expiresAt: now + 10_000, // 10-second prompt
    };

    // Set 10-second server timeout timer
    setTimeout(() => {
      this.handleReverifyTimeout(sessionId, challenge.challengeId);
    }, 10_000);

    const examSession = this.authority.getSession(sessionId);
    if (examSession) {
      this.authority.appendLedgerRecord(examSession, {
        type: 'MID_EXAM_REVERIFY_PROMPT_ISSUED',
        ts: now,
        payload: {
          challengeId: challenge.challengeId,
          expiresAt: session.activeReverifyPrompt.expiresAt,
        },
      });
    }

    return challenge;
  }

  /**
   * Handles timeout of the 10-second re-verification prompt (HIGH = 3 pts).
   */
  public handleReverifyTimeout(sessionId: string, challengeId: string, nowMs?: number): void {
    const session = this.sessions.get(sessionId);
    if (!session || !session.activeReverifyPrompt?.active) return;

    if (session.activeReverifyPrompt.challenge?.challengeId === challengeId) {
      session.activeReverifyPrompt.active = false;

      // Log HIGH violation (3 pts)
      this.violations.processViolation(sessionId, {
        type: 'REVERIFY_CHALLENGE_TIMEOUT',
        payload: {
          challengeId,
          reason: 'Candidate failed to complete the 10-second mid-exam liveness prompt',
        },
        timestamp: nowMs || Date.now(),
      });
    }
  }

  /**
   * Complete mid-exam re-verification prompt.
   * Face mismatch = CRITICAL (identity mismatch).
   */
  public completeReverify(params: {
    sessionId: string;
    challengeId: string;
    faceMatchScore: number;
    gestureCompleted: boolean;
    nowMs?: number;
  }): { success: boolean; status: string } {
    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Identity session ${params.sessionId} not found`);
    }

    const now = params.nowMs || Date.now();

    // Check Face Mismatch -> CRITICAL (8 pts instant kill)
    if (params.faceMatchScore < 70) {
      if (session.activeReverifyPrompt) {
        session.activeReverifyPrompt.active = false;
      }

      this.violations.processViolation(params.sessionId, {
        type: 'IDENTITY_MISMATCH',
        payload: {
          faceMatchScore: params.faceMatchScore,
          reason: 'Mid-exam facial recognition mismatch against check-in profile',
        },
        timestamp: now,
      });

      return { success: false, status: 'IDENTITY_MISMATCH_TERMINATED' };
    }

    // Check Gesture Completed -> Failed = HIGH (3 pts)
    if (!params.gestureCompleted) {
      if (session.activeReverifyPrompt) {
        session.activeReverifyPrompt.active = false;
      }

      this.violations.processViolation(params.sessionId, {
        type: 'REVERIFY_CHALLENGE_FAILED',
        payload: {
          challengeId: params.challengeId,
          reason: 'Liveness challenge was not satisfied within window',
        },
        timestamp: now,
      });

      return { success: false, status: 'LIVENESS_FAILED' };
    }

    // Success -> Clear active prompt
    if (session.activeReverifyPrompt) {
      session.activeReverifyPrompt.active = false;
      session.activeReverifyPrompt.challenge = null;
    }

    const examSession = this.authority.getSession(params.sessionId);
    if (examSession) {
      this.authority.appendLedgerRecord(examSession, {
        type: 'MID_EXAM_REVERIFY_PASSED',
        ts: now,
        payload: {
          challengeId: params.challengeId,
          faceMatchScore: params.faceMatchScore,
        },
      });
    }

    return { success: true, status: 'CLEARED' };
  }

  /**
   * Capture pre-exam short typing baseline.
   */
  public recordTypingBaseline(sessionId: string, baseline: Omit<TypingBaseline, 'capturedAt'>, nowMs?: number): TypingBaseline {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Identity session ${sessionId} not found`);
    }

    const now = nowMs || Date.now();
    const record: TypingBaseline = {
      ...baseline,
      capturedAt: now,
    };

    session.typingBaseline = record;

    const examSession = this.authority.getSession(sessionId);
    if (examSession) {
      this.authority.appendLedgerRecord(examSession, {
        type: 'TYPING_BASELINE_RECORDED',
        ts: now,
        payload: {
          meanIntervalMs: baseline.meanIntervalMs,
          varianceMs: baseline.varianceMs,
          typingSpeedWpm: baseline.typingSpeedWpm,
        },
      });
    }

    return record;
  }

  /**
   * Compare live keystroke rhythm against baseline.
   * Large deviation (>65%) = MEDIUM (2 points) - Human review only, never auto-terminate.
   */
  public verifyTypingRhythm(
    sessionId: string,
    sample: { meanIntervalMs: number; varianceMs: number; sampleLength: number },
    nowMs?: number
  ): { deviationPercent: number; flagged: boolean } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Identity session ${sessionId} not found`);
    }

    const now = nowMs || Date.now();

    // Check for approved motor impairment accommodation
    if (session.accommodation?.bypassTypingBaseline) {
      return { deviationPercent: 0, flagged: false };
    }

    if (!session.typingBaseline) {
      return { deviationPercent: 0, flagged: false };
    }

    const delta = Math.abs(sample.meanIntervalMs - session.typingBaseline.meanIntervalMs);
    const deviationPercent = Math.min(100, Math.round((delta / session.typingBaseline.meanIntervalMs) * 100));

    // Flag large deviation (>65%) as MEDIUM (2 pts)
    const flagged = deviationPercent > 65 && sample.sampleLength >= 5;

    if (flagged) {
      this.violations.processViolation(sessionId, {
        type: 'TYPING_RHYTHM_DEVIATION',
        payload: {
          deviationPercent,
          sampleMeanMs: sample.meanIntervalMs,
          baselineMeanMs: session.typingBaseline.meanIntervalMs,
          humanReviewRequired: true,
        },
        timestamp: now,
      });
    }

    return { deviationPercent, flagged };
  }

  /**
   * Set admin-approved candidate accommodation for alternative verification path.
   */
  public setAccommodation(sessionId: string, accommodation: CandidateAccommodation, nowMs?: number): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Identity session ${sessionId} not found`);
    }

    const now = nowMs || Date.now();
    session.accommodation = accommodation;

    const examSession = this.authority.getSession(sessionId);
    if (examSession) {
      this.authority.appendLedgerRecord(examSession, {
        type: 'ACCOMMODATION_APPROVED',
        ts: now,
        payload: {
          accommodationType: accommodation.accommodationType,
          approvedBy: accommodation.approvedBy,
          notes: accommodation.notes,
        },
      });
    }
  }

  public checkSessionBinding(params: {
    sessionId: string;
    deviceFingerprint?: string;
    ipAddress?: string;
    nowMs?: number;
  }): { valid: boolean; reverifyRequired: boolean; reverifyChallenge?: LivenessChallenge; warning?: string } {
    const res = this.checkMidExamIdentity(
      params.sessionId,
      { deviceFingerprint: params.deviceFingerprint, ipAddress: params.ipAddress },
      params.nowMs
    );
    return {
      valid: !res.reverifyRequired,
      reverifyRequired: res.reverifyRequired,
      reverifyChallenge: res.activeChallenge,
      warning: res.warning,
    };
  }

  public captureTypingBaseline(params: {
    sessionId: string;
    keyIntervalsMs: number[];
    sampleLength?: number;
    nowMs?: number;
  }): TypingBaseline {
    const intervals = params.keyIntervalsMs;
    const mean = intervals.reduce((a, b) => a + b, 0) / (intervals.length || 1);
    const variance = intervals.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (intervals.length || 1);
    const speedWpm = Math.round(60000 / (mean * 5 || 1));
    return this.recordTypingBaseline(
      params.sessionId,
      {
        meanIntervalMs: mean,
        varianceMs: variance,
        typingSpeedWpm: speedWpm,
        sampleLength: params.sampleLength || intervals.length,
      },
      params.nowMs
    );
  }

  public verifyTypingCadence(params: {
    sessionId: string;
    keyIntervalsMs: number[];
    nowMs?: number;
  }): { deviationPercent: number; flaggedForHumanReview: boolean; bypassed?: boolean } {
    const session = this.sessions.get(params.sessionId);
    if (session?.accommodation?.bypassTypingBaseline) {
      return { deviationPercent: 0, flaggedForHumanReview: false, bypassed: true };
    }
    const intervals = params.keyIntervalsMs;
    const mean = intervals.reduce((a, b) => a + b, 0) / (intervals.length || 1);
    const variance = intervals.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (intervals.length || 1);
    const res = this.verifyTypingRhythm(
      params.sessionId,
      { meanIntervalMs: mean, varianceMs: variance, sampleLength: intervals.length },
      params.nowMs
    );
    return {
      deviationPercent: res.deviationPercent,
      flaggedForHumanReview: res.flagged,
      bypassed: false,
    };
  }

  public registerAccommodation(params: {
    sessionId: string;
    accommodation: CandidateAccommodation;
    nowMs?: number;
  }): void {
    this.setAccommodation(params.sessionId, params.accommodation, params.nowMs);
  }

  public getSessionRecord(sessionId: string): SessionIdentityRecord | null {
    return this.sessions.get(sessionId) || null;
  }

  public clear(): void {
    this.sessions.clear();
    this.activeCandidateSessions.clear();
    this.issuedChallenges.clear();
  }

  /**
   * Mount Express routes for Identity Verification API.
   */
  private setupRoutes(): void {
    // 1. Session Binding
    this.router.post('/:id/identity/bind', (req: Request, res: Response) => {
      try {
        const { candidateId, deviceFingerprint, userAgent, durationSeconds } = req.body;
        const ipAddress = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';

        const result = this.bindSession({
          sessionId: req.params.id,
          candidateId,
          deviceFingerprint: deviceFingerprint || 'default_fingerprint',
          ipAddress,
          userAgent,
          durationSeconds,
        });

        if (!result.success) {
          res.status(409).json(result);
          return;
        }

        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 2. ID Document Check
    this.router.post('/:id/identity/id-check', (req: Request, res: Response) => {
      try {
        const { idDocumentDataUrl, liveCaptureDataUrl } = req.body;
        const result = this.verifyIdDocument({
          sessionId: req.params.id,
          idDocumentDataUrl,
          liveCaptureDataUrl,
        });
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 3. Issue Liveness Challenge
    this.router.post('/:id/identity/liveness/challenge', (req: Request, res: Response) => {
      try {
        const challenge = this.generateLivenessChallenge(req.params.id);
        res.json(challenge);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 4. Verify Liveness Challenge
    this.router.post('/:id/identity/liveness/verify', (req: Request, res: Response) => {
      try {
        const { challengeId, nonce, gestureConfidence } = req.body;
        const result = this.verifyLivenessChallenge({
          sessionId: req.params.id,
          challengeId,
          nonce,
          gestureConfidence,
        });
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 5. Complete Mid-Exam Re-Verify Prompt
    this.router.post('/:id/identity/reverify/complete', (req: Request, res: Response) => {
      try {
        const { challengeId, faceMatchScore, gestureCompleted } = req.body;
        const result = this.completeReverify({
          sessionId: req.params.id,
          challengeId,
          faceMatchScore,
          gestureCompleted,
        });
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 6. Record Typing Baseline
    this.router.post('/:id/identity/typing-baseline', (req: Request, res: Response) => {
      try {
        const { meanIntervalMs, varianceMs, typingSpeedWpm, sampleLength } = req.body;
        const result = this.recordTypingBaseline(req.params.id, {
          meanIntervalMs,
          varianceMs,
          typingSpeedWpm,
          sampleLength,
        });
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 7. Verify Keystroke Rhythm
    this.router.post('/:id/identity/typing-verify', (req: Request, res: Response) => {
      try {
        const { meanIntervalMs, varianceMs, sampleLength } = req.body;
        const result = this.verifyTypingRhythm(req.params.id, {
          meanIntervalMs,
          varianceMs,
          sampleLength,
        });
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 8. Admin Accommodation Override
    this.router.post('/:id/identity/accommodation', (req: Request, res: Response) => {
      try {
        const accommodation = req.body as CandidateAccommodation;
        this.setAccommodation(req.params.id, accommodation);
        res.json({ success: true, accommodation });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });
  }
}

export const identityVerificationService = new IdentityVerificationService();
export default identityVerificationService;
