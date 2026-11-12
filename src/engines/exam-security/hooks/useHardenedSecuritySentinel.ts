import { useEffect, useRef, useCallback } from 'react';
import { Layer1ExamHardener, Layer1ViolationEvent } from '../hardening/Layer1ExamHardener';
import { Layer2IntegrityHardener, Layer2ViolationEvent } from '../../browser-integrity/hardening/Layer2IntegrityHardener';

export interface HardenedSecuritySentinelOptions {
  sessionId: string;
  sessionSecret?: string;
  requireSecureClient?: boolean;
  expectedSessionIp?: string;
  expectedWasmSha256?: string;
  sendSignedEvent?: (type: string, payload: unknown) => Promise<{ success: boolean; seq: number; error?: string }>;
  reportViolation?: (type: string, payload?: unknown) => Promise<unknown>;
  onViolationDetected?: (event: Layer1ViolationEvent | Layer2ViolationEvent) => void;
  enabled?: boolean;
}

export function useHardenedSecuritySentinel({
  sessionId,
  sessionSecret,
  requireSecureClient = false,
  expectedSessionIp,
  expectedWasmSha256,
  sendSignedEvent,
  reportViolation,
  onViolationDetected,
  enabled = true,
}: HardenedSecuritySentinelOptions) {
  const layer1Ref = useRef<Layer1ExamHardener | null>(null);
  const layer2Ref = useRef<Layer2IntegrityHardener | null>(null);

  const handleViolation = useCallback(
    async (violation: Layer1ViolationEvent | Layer2ViolationEvent) => {
      // 1. Notify local caller callback
      onViolationDetected?.(violation);

      // 2. Dispatch signed security event to the server ledger (Step 1 HMAC + seq)
      if (sendSignedEvent) {
        try {
          await sendSignedEvent(violation.type, {
            ...violation,
            sessionId,
          });
        } catch (err) {
          console.warn('[HardenedSecuritySentinel] Failed to dispatch signed event:', err);
        }
      }

      // 3. Dispatch to server-side ViolationEngine (Step 2 weighted points)
      if (reportViolation) {
        try {
          await reportViolation(violation.type, {
            ...violation,
            sessionId,
          });
        } catch (err) {
          console.warn('[HardenedSecuritySentinel] Failed to report violation:', err);
        }
      }
    },
    [sessionId, sendSignedEvent, reportViolation, onViolationDetected]
  );

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Initialize Layer 1 Hardener
    const layer1 = new Layer1ExamHardener({
      onViolation: (evt) => handleViolation(evt),
      focusPollIntervalMs: 500,
      devtoolsPollIntervalMs: 2000,
      pipPollIntervalMs: 1000,
      enabled: true,
    });
    layer1Ref.current = layer1;
    layer1.start();

    // Initialize Layer 2 Hardener
    const layer2 = new Layer2IntegrityHardener({
      onViolation: (evt) => handleViolation(evt),
      requireSecureClient,
      expectedSessionIp,
      expectedWasmSha256,
      deviceScanIntervalMs: 10000,
      timerCheckIntervalMs: 1000,
      enabled: true,
    });
    layer2Ref.current = layer2;
    layer2.start();

    return () => {
      layer1.stop();
      layer2.stop();
      layer1Ref.current = null;
      layer2Ref.current = null;
    };
  }, [enabled, requireSecureClient, expectedSessionIp, expectedWasmSha256, handleViolation]);

  return {
    layer1Hardener: layer1Ref.current,
    layer2Hardener: layer2Ref.current,
  };
}

