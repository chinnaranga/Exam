import { useState, useEffect, useRef, useCallback } from 'react';

export type SessionIntegrityStatus = 'ACTIVE' | 'WARNING' | 'OVERLAY_ACTIVE' | 'TERMINATED';

export type ServerEnforcementAction = 'LOG_ONLY' | 'WARNING_TOAST' | 'OVERLAY' | 'TERMINATE';

export interface RecordedViolation {
  id: string;
  ruleId: string;
  name: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
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

export interface ServerViolationSentinelOptions {
  sessionId: string;
  baseUrl?: string;
  pollIntervalMs?: number; // default: 5000 (every 5s)
  onToastWarning?: (message: string, violation: RecordedViolation) => void;
  onOverlayTriggered?: (points: number, violation: RecordedViolation) => void;
  onTerminated?: (reason: string, evidencePacket?: EvidencePacket) => void;
  enabled?: boolean;
}

export interface UseServerViolationSentinelResult {
  sessionId: string;
  points: number;
  status: SessionIntegrityStatus;
  showOverlay: boolean;
  overlayCountdown: number;
  isTerminated: boolean;
  terminationReason: string | null;
  activeToast: { message: string; violation: RecordedViolation } | null;
  evidencePacket: EvidencePacket | null;
  recentViolations: RecordedViolation[];
  reportViolation: (type: string, payload?: unknown) => Promise<ViolationDecision | null>;
  acknowledgeOverlay: () => void;
  dismissToast: () => void;
  refreshStatus: () => Promise<void>;
}

export function useServerViolationSentinel({
  sessionId,
  baseUrl = '',
  pollIntervalMs = 5000,
  onToastWarning,
  onOverlayTriggered,
  onTerminated,
  enabled = true,
}: ServerViolationSentinelOptions): UseServerViolationSentinelResult {
  const [points, setPoints] = useState<number>(0);
  const [status, setStatus] = useState<SessionIntegrityStatus>('ACTIVE');
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [overlayCountdown, setOverlayCountdown] = useState<number>(30);
  const [isTerminated, setIsTerminated] = useState<boolean>(false);
  const [terminationReason, setTerminationReason] = useState<string | null>(null);
  const [activeToast, setActiveToast] = useState<{ message: string; violation: RecordedViolation } | null>(null);
  const [evidencePacket, setEvidencePacket] = useState<EvidencePacket | null>(null);
  const [recentViolations, setRecentViolations] = useState<RecordedViolation[]>([]);

  const onToastWarningRef = useRef(onToastWarning);
  onToastWarningRef.current = onToastWarning;
  const onOverlayTriggeredRef = useRef(onOverlayTriggered);
  onOverlayTriggeredRef.current = onOverlayTriggered;
  const onTerminatedRef = useRef(onTerminated);
  onTerminatedRef.current = onTerminated;

  // Process server decision and update client state
  const handleServerDecision = useCallback((decision: ViolationDecision) => {
    setPoints(decision.currentPoints);
    setStatus(decision.status);

    if (decision.isTerminated || decision.status === 'TERMINATED') {
      setIsTerminated(true);
      setShowOverlay(false);
      setTerminationReason(decision.toastMessage || 'Examination Terminated by Proctor Server');
      if (decision.evidencePacket) {
        setEvidencePacket(decision.evidencePacket);
      }
      onTerminatedRef.current?.(decision.toastMessage || 'Terminated', decision.evidencePacket);
      return;
    }

    if (decision.showOverlay || decision.action === 'OVERLAY') {
      setShowOverlay(true);
      setOverlayCountdown(decision.overlayCountdownSeconds || 30);
      onOverlayTriggeredRef.current?.(decision.currentPoints, decision.violation);
    }

    if (decision.displayToast && decision.toastMessage && decision.action !== 'LOG_ONLY') {
      const toastData = { message: decision.toastMessage, violation: decision.violation };
      setActiveToast(toastData);
      onToastWarningRef.current?.(decision.toastMessage, decision.violation);
    }
  }, []);

  // 1. Report violation to server authority
  const reportViolation = useCallback(
    async (type: string, payload?: unknown): Promise<ViolationDecision | null> => {
      if (!sessionId || !enabled) return null;

      try {
        const res = await fetch(`${baseUrl}/api/session/${sessionId}/violation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            payload,
            timestamp: Date.now(),
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to report violation: ${res.statusText}`);
        }

        const decision: ViolationDecision = await res.json();
        handleServerDecision(decision);
        return decision;
      } catch (err: unknown) {
        console.warn('[useServerViolationSentinel] Failed to report violation to server:', err);
        return null;
      }
    },
    [sessionId, baseUrl, enabled, handleServerDecision]
  );

  // 2. Poll server violation status (fetches points, decay updates, status)
  const refreshStatus = useCallback(async () => {
    if (!sessionId || !enabled) return;

    try {
      const res = await fetch(`${baseUrl}/api/session/${sessionId}/violation-status`);
      if (!res.ok) return;

      const data = await res.json();
      setPoints(data.currentPoints);
      setStatus(data.status);
      setRecentViolations(data.recentViolations || []);

      if (data.isTerminated) {
        setIsTerminated(true);
        setShowOverlay(false);
        if (data.evidencePacket) {
          setEvidencePacket(data.evidencePacket);
        }
      } else if (data.showOverlay) {
        setShowOverlay(true);
      } else if (data.currentPoints < 4 && showOverlay) {
        // Points decayed below 4
        setShowOverlay(false);
      }
    } catch {
      // Ignore network polling glitches
    }
  }, [sessionId, baseUrl, enabled, showOverlay]);

  // Periodic polling interval for point decay & status sync
  useEffect(() => {
    if (!enabled || !sessionId) return;

    refreshStatus();
    const interval = setInterval(refreshStatus, pollIntervalMs);
    return () => clearInterval(interval);
  }, [enabled, sessionId, pollIntervalMs, refreshStatus]);

  // Countdown timer when overlay is active
  useEffect(() => {
    if (!showOverlay || isTerminated) return;

    const timer = setInterval(() => {
      setOverlayCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showOverlay, isTerminated]);

  const acknowledgeOverlay = useCallback(() => {
    setShowOverlay(false);
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  return {
    sessionId,
    points,
    status,
    showOverlay,
    overlayCountdown,
    isTerminated,
    terminationReason,
    activeToast,
    evidencePacket,
    recentViolations,
    reportViolation,
    acknowledgeOverlay,
    dismissToast,
    refreshStatus,
  };
}

export default useServerViolationSentinel;

