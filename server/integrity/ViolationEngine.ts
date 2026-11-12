import express, { Request, Response, Router } from 'express';
import {
  VIOLATION_SEVERITY_TABLE,
  VIOLATION_THRESHOLDS,
  ViolationRuleDefinition,
  ViolationSeverityTier,
  resolveViolationRule,
} from './violationSeverityConfig';
import { ExamSessionAuthority, examSessionAuthority } from './ExamSessionAuthority';
import { accommodationService } from '../accessibility/AccommodationService';

export type SessionIntegrityStatus = 'ACTIVE' | 'WARNING' | 'OVERLAY_ACTIVE' | 'TERMINATED';

export type ServerEnforcementAction = 'NONE' | 'LOG_ONLY' | 'WARNING_TOAST' | 'OVERLAY' | 'TERMINATE';

export interface RecordedViolation {
  id: string;
  ruleId: string;
  type: string;
  name: string;
  severity: ViolationSeverityTier;
  pointsAdded: number;
  totalPointsAfter: number;
  timestamp: number;
  payload?: unknown;
  alertUser: boolean;
  invigilatorAlert: boolean;
}

export interface EvidencePacket {
  sessionId: string;
  candidateId?: string;
  examId?: string;
  terminatedAt: number;
  terminationReason: string;
  peakPoints: number;
  finalPoints: number;
  totalViolationsCount: number;
  violationTimeline: RecordedViolation[];
  ledgerRootHash: string;
  invigilatorNotified: boolean;
  tamperProofVerified: boolean;
}

export interface ViolationDecision {
  action: ServerEnforcementAction;
  sessionId: string;
  currentPoints: number;
  previousPoints: number;
  pointsAdded: number;
  status: SessionIntegrityStatus;
  violation: RecordedViolation;
  showOverlay: boolean;
  isTerminated: boolean;
  displayToast: boolean;
  toastMessage?: string;
  overlayCountdownSeconds?: number;
  evidencePacket?: EvidencePacket;
}

export interface ViolationSessionState {
  sessionId: string;
  currentPoints: number;
  peakPoints: number;
  status: SessionIntegrityStatus;
  lastViolationAt: number;
  lastDecayAppliedAt: number;
  violations: RecordedViolation[];
  evidencePacket: EvidencePacket | null;
}

export class ViolationEngine {
  private sessions: Map<string, ViolationSessionState> = new Map();
  private authority: ExamSessionAuthority;
  public readonly router: Router;

  constructor(authority: ExamSessionAuthority = examSessionAuthority) {
    this.authority = authority;
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Retrieves or initializes violation tracking state for a given exam session.
   */
  public getOrCreateSession(sessionId: string, nowMs?: number): ViolationSessionState {
    let state = this.sessions.get(sessionId);
    if (!state) {
      const now = nowMs || Date.now();
      state = {
        sessionId,
        currentPoints: 0,
        peakPoints: 0,
        status: 'ACTIVE',
        lastViolationAt: now,
        lastDecayAppliedAt: now,
        violations: [],
        evidencePacket: null,
      };
      this.sessions.set(sessionId, state);
    }
    return state;
  }

  public getSessionState(sessionId: string): { points: number; isTerminated: boolean; violations: RecordedViolation[] } {
    const session = this.getOrCreateSession(sessionId);
    return {
      points: session.currentPoints,
      isTerminated: session.status === 'TERMINATED',
      violations: session.violations,
    };
  }

  /**
   * Applies point decay: 1 point decayed for every 5 minutes of clean behavior.
   */
  public applyDecay(sessionId: string, nowMs?: number): { decayedPoints: number; currentPoints: number; status: SessionIntegrityStatus } {
    const session = this.getOrCreateSession(sessionId, nowMs);
    const now = nowMs || Date.now();

    // Terminated sessions do not decay points
    if (session.status === 'TERMINATED') {
      return { decayedPoints: 0, currentPoints: session.currentPoints, status: session.status };
    }

    const elapsedMs = now - session.lastDecayAppliedAt;
    const intervals = Math.floor(elapsedMs / VIOLATION_THRESHOLDS.decayIntervalMs);

    if (intervals <= 0 || session.currentPoints <= 0) {
      return { decayedPoints: 0, currentPoints: session.currentPoints, status: session.status };
    }

    const pointsToDecay = Math.min(session.currentPoints, intervals * VIOLATION_THRESHOLDS.decayPointsPerInterval);
    const previousPoints = session.currentPoints;
    session.currentPoints = Math.max(0, session.currentPoints - pointsToDecay);
    session.lastDecayAppliedAt += intervals * VIOLATION_THRESHOLDS.decayIntervalMs;

    // If points dropped below overlay threshold (4), restore status to ACTIVE
    if (session.currentPoints < VIOLATION_THRESHOLDS.overlayThreshold && session.status === 'OVERLAY_ACTIVE') {
      session.status = session.currentPoints > 0 ? 'WARNING' : 'ACTIVE';
    } else if (session.currentPoints === 0) {
      session.status = 'ACTIVE';
    }

    // Write decay event to hash-chained ledger
    const examSession = this.authority.getSession(sessionId);
    if (examSession) {
      this.authority.appendLedgerRecord(examSession, {
        type: 'POINTS_DECAY_APPLIED',
        ts: now,
        payload: {
          previousPoints,
          decayedPoints: pointsToDecay,
          currentPoints: session.currentPoints,
          cleanIntervalsElapsed: intervals,
        },
      });
    }

    return {
      decayedPoints: pointsToDecay,
      currentPoints: session.currentPoints,
      status: session.status,
    };
  }

  /**
   * Master server-side violation processing function.
   * Resolves severity, applies decay, checks thresholds, generates evidence packet,
   * and commits all events to the hash-chained ledger.
   */
  public processViolation(
    sessionId: string,
    violationInput: { type: string; payload?: unknown; timestamp?: number },
    nowMs?: number
  ): ViolationDecision {
    const now = nowMs || violationInput.timestamp || Date.now();
    const session = this.getOrCreateSession(sessionId, now);

    // 1. If already terminated, return terminated decision
    if (session.status === 'TERMINATED') {
      return {
        action: 'TERMINATE',
        sessionId,
        currentPoints: session.currentPoints,
        previousPoints: session.currentPoints,
        pointsAdded: 0,
        status: 'TERMINATED',
        violation: session.violations[session.violations.length - 1] || {
          id: `violation_${now}_term`,
          ruleId: 'SESSION_TERMINATED',
          type: 'SESSION_TERMINATED',
          name: 'Session Terminated',
          severity: 'CRITICAL',
          pointsAdded: 0,
          totalPointsAfter: session.currentPoints,
          timestamp: now,
          alertUser: true,
          invigilatorAlert: true,
        },
        showOverlay: false,
        isTerminated: true,
        displayToast: true,
        toastMessage: 'Examination has been terminated.',
        evidencePacket: session.evidencePacket || undefined,
      };
    }

    // 2. Resolve violation rule definition from master config
    const rule: ViolationRuleDefinition = resolveViolationRule(violationInput.type);

    // 2b. Check if violation is suppressed by approved accommodation (e.g. rest breaks, relaxed gaze)
    const suppression = accommodationService.shouldSuppressViolation(sessionId, violationInput.type, now);
    if (suppression.suppress) {
      return {
        action: 'NONE',
        sessionId,
        currentPoints: session.currentPoints,
        previousPoints: session.currentPoints,
        pointsAdded: 0,
        status: session.status,
        violation: {
          id: `suppressed_${now}`,
          ruleId: rule.ruleId,
          type: rule.ruleId,
          name: `${rule.name} (Suppressed: ${suppression.reason})`,
          severity: 'LOW',
          pointsAdded: 0,
          totalPointsAfter: session.currentPoints,
          timestamp: now,
          payload: violationInput.payload,
          alertUser: false,
          invigilatorAlert: false,
        },
        showOverlay: false,
        isTerminated: false,
        displayToast: false,
      };
    }

    // 3. Apply points decay before adding new violation points
    this.applyDecay(sessionId, now);

    const previousPoints = session.currentPoints;

    // 4. Handle CRITICAL Instant-Kill Violations
    if (rule.isInstantKill || rule.severity === 'CRITICAL') {
      session.currentPoints = Math.max(session.currentPoints, VIOLATION_THRESHOLDS.terminateThreshold);
      session.peakPoints = Math.max(session.peakPoints, session.currentPoints);
      session.status = 'TERMINATED';
      session.lastViolationAt = now;
      session.lastDecayAppliedAt = now;

      const recorded: RecordedViolation = {
        id: `v_${now}_${Math.random().toString(36).substring(2, 7)}`,
        ruleId: rule.ruleId,
        type: rule.ruleId,
        name: rule.name,
        severity: 'CRITICAL',
        pointsAdded: rule.points,
        totalPointsAfter: session.currentPoints,
        timestamp: now,
        payload: violationInput.payload,
        alertUser: true,
        invigilatorAlert: true,
      };
      session.violations.push(recorded);

      // Generate Evidence Packet & write to hash-chained ledger
      const evidence = this.generateEvidencePacket(session, `CRITICAL_VIOLATION: ${rule.name}`, now);
      session.evidencePacket = evidence;

      const examSession = this.authority.getSession(sessionId);
      if (examSession) {
        examSession.status = 'TERMINATED';
        this.authority.appendLedgerRecord(examSession, {
          type: 'CRITICAL_VIOLATION_TRIGGERED',
          ts: now,
          severity: 'CRITICAL',
          payload: {
            ruleId: rule.ruleId,
            name: rule.name,
            pointsAdded: rule.points,
            currentPoints: session.currentPoints,
            evidencePacket: evidence,
          },
        });
      }

      return {
        action: 'TERMINATE',
        sessionId,
        currentPoints: session.currentPoints,
        previousPoints,
        pointsAdded: rule.points,
        status: 'TERMINATED',
        violation: recorded,
        showOverlay: false,
        isTerminated: true,
        displayToast: true,
        toastMessage: `CRITICAL ALERT: ${rule.name}. Examination terminated immediately.`,
        evidencePacket: evidence,
      };
    }

    // 5. Accumulate Weighted Points (HIGH = 3, MEDIUM = 2, LOW = 1)
    session.currentPoints += rule.points;
    session.peakPoints = Math.max(session.peakPoints, session.currentPoints);
    session.lastViolationAt = now;
    session.lastDecayAppliedAt = now;

    const recorded: RecordedViolation = {
      id: `v_${now}_${Math.random().toString(36).substring(2, 7)}`,
      ruleId: rule.ruleId,
      type: rule.ruleId,
      name: rule.name,
      severity: rule.severity,
      pointsAdded: rule.points,
      totalPointsAfter: session.currentPoints,
      timestamp: now,
      payload: violationInput.payload,
      alertUser: rule.alertUser,
      invigilatorAlert: rule.invigilatorAlert,
    };
    session.violations.push(recorded);

    // Commit violation to authoritative hash-chained ledger
    const examSession = this.authority.getSession(sessionId);
    if (examSession) {
      this.authority.appendLedgerRecord(examSession, {
        type: 'WEIGHTED_VIOLATION_RECORDED',
        ts: now,
        severity: rule.severity,
        payload: {
          ruleId: rule.ruleId,
          name: rule.name,
          pointsAdded: rule.points,
          currentPoints: session.currentPoints,
          payload: violationInput.payload,
        },
      });
    }

    // 6. Check Point Thresholds (8 = Terminate, 4 = Critical Overlay, Else = Warning/Log)
    if (session.currentPoints >= VIOLATION_THRESHOLDS.terminateThreshold) {
      session.status = 'TERMINATED';
      const evidence = this.generateEvidencePacket(
        session,
        `ACCUMULATED_POINTS_EXCEEDED (${session.currentPoints}/${VIOLATION_THRESHOLDS.terminateThreshold} pts)`,
        now
      );
      session.evidencePacket = evidence;

      if (examSession) {
        examSession.status = 'TERMINATED';
        this.authority.appendLedgerRecord(examSession, {
          type: 'EXAM_TERMINATED_THRESHOLD_REACHED',
          ts: now,
          severity: 'CRITICAL',
          payload: {
            currentPoints: session.currentPoints,
            threshold: VIOLATION_THRESHOLDS.terminateThreshold,
            evidencePacket: evidence,
          },
        });
      }

      return {
        action: 'TERMINATE',
        sessionId,
        currentPoints: session.currentPoints,
        previousPoints,
        pointsAdded: rule.points,
        status: 'TERMINATED',
        violation: recorded,
        showOverlay: false,
        isTerminated: true,
        displayToast: true,
        toastMessage: `Maximum violation threshold reached (${session.currentPoints}/${VIOLATION_THRESHOLDS.terminateThreshold} pts). Session terminated.`,
        evidencePacket: evidence,
      };
    }

    if (session.currentPoints >= VIOLATION_THRESHOLDS.overlayThreshold) {
      session.status = 'OVERLAY_ACTIVE';

      return {
        action: 'OVERLAY',
        sessionId,
        currentPoints: session.currentPoints,
        previousPoints,
        pointsAdded: rule.points,
        status: 'OVERLAY_ACTIVE',
        violation: recorded,
        showOverlay: true,
        isTerminated: false,
        displayToast: true,
        toastMessage: `Critical Alert (${session.currentPoints}/${VIOLATION_THRESHOLDS.terminateThreshold} pts): ${rule.name}. Attention required.`,
        overlayCountdownSeconds: VIOLATION_THRESHOLDS.overlayCountdownSeconds,
      };
    }

    // Under 4 points:
    session.status = 'WARNING';
    const isLogOnly = !rule.alertUser;

    return {
      action: isLogOnly ? 'LOG_ONLY' : 'WARNING_TOAST',
      sessionId,
      currentPoints: session.currentPoints,
      previousPoints,
      pointsAdded: rule.points,
      status: 'WARNING',
      violation: recorded,
      showOverlay: false,
      isTerminated: false,
      displayToast: !isLogOnly,
      toastMessage: isLogOnly
        ? undefined
        : `Security Warning (+${rule.points} pts, Total: ${session.currentPoints}/${VIOLATION_THRESHOLDS.terminateThreshold}): ${rule.name}`,
    };
  }

  /**
   * Generates a forensic evidence packet including timeline, points history,
   * and the current cryptographic hash-chain root.
   */
  public generateEvidencePacket(
    session: ViolationSessionState,
    reason: string,
    nowMs?: number
  ): EvidencePacket {
    const now = nowMs || Date.now();
    const examSession = this.authority.getSession(session.sessionId);
    const ledger = examSession?.ledger || [];
    const rootHash = ledger.length > 0 ? ledger[ledger.length - 1].hash : 'GENESIS';

    const ledgerVerification = this.authority.verifyLedger(session.sessionId);

    return {
      sessionId: session.sessionId,
      candidateId: examSession?.candidateId,
      examId: examSession?.examId,
      terminatedAt: now,
      terminationReason: reason,
      peakPoints: session.peakPoints,
      finalPoints: session.currentPoints,
      totalViolationsCount: session.violations.length,
      violationTimeline: [...session.violations],
      ledgerRootHash: rootHash,
      invigilatorNotified: true,
      tamperProofVerified: ledgerVerification.valid,
    };
  }

  /**
   * Returns current session violation status, decay info, and recent violations.
   */
  public getSessionViolationStatus(sessionId: string, nowMs?: number): {
    sessionId: string;
    currentPoints: number;
    peakPoints: number;
    status: SessionIntegrityStatus;
    showOverlay: boolean;
    isTerminated: boolean;
    lastViolationAt: number;
    lastDecayAppliedAt: number;
    nextDecayInSeconds: number;
    violationsCount: number;
    recentViolations: RecordedViolation[];
    evidencePacket: EvidencePacket | null;
  } {
    const session = this.getOrCreateSession(sessionId, nowMs);
    this.applyDecay(sessionId, nowMs);

    const now = nowMs || Date.now();
    const msSinceDecay = now - session.lastDecayAppliedAt;
    const nextDecayInSeconds = Math.max(0, Math.round((VIOLATION_THRESHOLDS.decayIntervalMs - msSinceDecay) / 1000));

    return {
      sessionId: session.sessionId,
      currentPoints: session.currentPoints,
      peakPoints: session.peakPoints,
      status: session.status,
      showOverlay: session.currentPoints >= VIOLATION_THRESHOLDS.overlayThreshold && session.status !== 'TERMINATED',
      isTerminated: session.status === 'TERMINATED',
      lastViolationAt: session.lastViolationAt,
      lastDecayAppliedAt: session.lastDecayAppliedAt,
      nextDecayInSeconds,
      violationsCount: session.violations.length,
      recentViolations: session.violations.slice(-5),
      evidencePacket: session.evidencePacket,
    };
  }

  public clear(): void {
    this.sessions.clear();
  }

  /**
   * Express API endpoints for server-authoritative violation processing.
   */
  private setupRoutes(): void {
    // 1. Process a violation: POST /api/session/:id/violation
    this.router.post('/:id/violation', (req: Request, res: Response) => {
      try {
        const { type, payload, timestamp } = req.body;
        if (!type) {
          res.status(400).json({ error: 'type is required.' });
          return;
        }

        const decision = this.processViolation(req.params.id, {
          type,
          payload,
          timestamp,
        });

        res.json(decision);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 2. Query status: GET /api/session/:id/violation-status
    this.router.get('/:id/violation-status', (req: Request, res: Response) => {
      try {
        const status = this.getSessionViolationStatus(req.params.id);
        res.json(status);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 3. Trigger decay check: POST /api/session/:id/decay
    this.router.post('/:id/decay', (req: Request, res: Response) => {
      try {
        const result = this.applyDecay(req.params.id);
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });
  }
}

export const violationEngine = new ViolationEngine();
export default violationEngine;

