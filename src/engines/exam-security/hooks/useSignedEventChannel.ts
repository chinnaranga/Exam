import { useState, useEffect, useRef, useCallback } from 'react';

export interface SignedSecurityEventPayload {
  type: string;
  ts: number;
  seq: number;
  payload: unknown;
  hmac: string;
}

export interface SignedEventChannelOptions {
  sessionId: string;
  sessionSecret: string;
  baseUrl?: string;
  heartbeatIntervalMs?: number; // default: 5000 (every 5s)
  clockSyncIntervalMs?: number; // default: 30000 (every 30s)
  onClockSync?: (clock: { serverNow: number; deadline: number; timeRemainingMs: number }) => void;
  onDeadlineReached?: () => void;
  onTamperDetected?: (tamperInfo: unknown) => void;
  onAutoSubmit?: () => void;
  enabled?: boolean;
}

export interface UseSignedEventChannelResult {
  sessionId: string;
  timeRemainingMs: number;
  serverNow: number | null;
  deadline: number | null;
  isDeadlineReached: boolean;
  seq: number;
  isSyncing: boolean;
  isOnline: boolean;
  lastHeartbeatSentAt: number | null;
  sendSignedEvent: (type: string, payload: unknown) => Promise<{ success: boolean; seq: number; error?: string }>;
  submitAnswers: (answers: unknown) => Promise<{ success: boolean; status?: string; error?: string }>;
  syncClockNow: () => Promise<void>;
  sendHeartbeatNow: () => Promise<void>;
}

/**
 * Universal HMAC-SHA256 signature generator.
 * Works seamlessly in both browser (Web Crypto API) and Node.js testing environments.
 */
export async function computeClientHmac(
  secret: string,
  event: { type: string; ts: number; seq: number; payload: unknown }
): Promise<string> {
  const payloadStr = typeof event.payload === 'string' ? event.payload : JSON.stringify(event.payload);
  const canonical = `${event.type}:${event.ts}:${event.seq}:${payloadStr}`;

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(canonical);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for Node.js test runners
  try {
    const nodeCrypto = await import('crypto');
    return nodeCrypto.createHmac('sha256', secret).update(canonical).digest('hex');
  } catch {
    throw new Error('HMAC SHA-256 is not supported in this runtime environment');
  }
}

/**
 * Hook to manage authoritative server clock synchronization, signed client events,
 * sequence numbering, periodic heartbeats, and tamper response.
 */
export function useSignedEventChannel({
  sessionId,
  sessionSecret,
  baseUrl = '',
  heartbeatIntervalMs = 5000,
  clockSyncIntervalMs = 30000,
  onClockSync,
  onDeadlineReached,
  onTamperDetected,
  onAutoSubmit,
  enabled = true,
}: SignedEventChannelOptions): UseSignedEventChannelResult {
  const [serverNow, setServerNow] = useState<number | null>(null);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(0);
  const [isDeadlineReached, setIsDeadlineReached] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastHeartbeatSentAt, setLastHeartbeatSentAt] = useState<number | null>(null);

  // Sequence number ref (monotonically increasing starting at 0)
  const seqRef = useRef<number>(0);
  const serverOffsetRef = useRef<number>(0);
  const deadlineRef = useRef<number | null>(null);
  const hasTriggeredDeadlineRef = useRef<boolean>(false);

  // Keep references to callbacks
  const onClockSyncRef = useRef(onClockSync);
  onClockSyncRef.current = onClockSync;
  const onDeadlineReachedRef = useRef(onDeadlineReached);
  onDeadlineReachedRef.current = onDeadlineReached;
  const onTamperDetectedRef = useRef(onTamperDetected);
  onTamperDetectedRef.current = onTamperDetected;
  const onAutoSubmitRef = useRef(onAutoSubmit);
  onAutoSubmitRef.current = onAutoSubmit;

  // 1. Authoritative Clock Sync Function
  const syncClockNow = useCallback(async () => {
    if (!sessionId || !enabled) return;

    try {
      setIsSyncing(true);
      const reqStart = Date.now();
      const response = await fetch(`${baseUrl}/api/session/${sessionId}/clock`);
      const reqEnd = Date.now();
      const roundTripMs = reqEnd - reqStart;

      if (!response.ok) {
        throw new Error(`Failed to fetch server clock: ${response.statusText}`);
      }

      const data = await response.json();
      // Adjust serverNow for half of network round trip latency
      const adjustedServerNow = data.serverNow + Math.round(roundTripMs / 2);
      const offset = adjustedServerNow - Date.now();
      serverOffsetRef.current = offset;

      setServerNow(adjustedServerNow);
      setDeadline(data.deadline);
      deadlineRef.current = data.deadline;

      const remaining = Math.max(0, data.deadline - adjustedServerNow);
      setTimeRemainingMs(remaining);

      if (data.status === 'AUTO_SUBMITTED' || data.status === 'SUBMITTED') {
        if (!hasTriggeredDeadlineRef.current) {
          hasTriggeredDeadlineRef.current = true;
          setIsDeadlineReached(true);
          onAutoSubmitRef.current?.();
        }
      } else if (remaining === 0) {
        if (!hasTriggeredDeadlineRef.current) {
          hasTriggeredDeadlineRef.current = true;
          setIsDeadlineReached(true);
          onDeadlineReachedRef.current?.();
        }
      }

      onClockSyncRef.current?.({
        serverNow: adjustedServerNow,
        deadline: data.deadline,
        timeRemainingMs: remaining,
      });
    } catch (err: unknown) {
      console.warn('[useSignedEventChannel] Clock sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [sessionId, baseUrl, enabled]);

  // 2. High-precision local 1s countdown tick derived strictly from server clock offset
  useEffect(() => {
    if (!enabled || !deadlineRef.current) return;

    const timer = setInterval(() => {
      const estimatedServerNow = Date.now() + serverOffsetRef.current;
      const targetDeadline = deadlineRef.current;

      if (!targetDeadline) return;

      const remaining = Math.max(0, targetDeadline - estimatedServerNow);
      setTimeRemainingMs(remaining);

      if (remaining === 0 && !hasTriggeredDeadlineRef.current) {
        hasTriggeredDeadlineRef.current = true;
        setIsDeadlineReached(true);
        onDeadlineReachedRef.current?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [enabled]);

  // 3. Periodic 30s Server Clock Re-sync
  useEffect(() => {
    if (!enabled || !sessionId) return;

    // Initial clock sync
    syncClockNow();

    const interval = setInterval(() => {
      syncClockNow();
    }, clockSyncIntervalMs);

    return () => clearInterval(interval);
  }, [enabled, sessionId, clockSyncIntervalMs, syncClockNow]);

  // 4. Send Signed Event with HMAC & Monotonic Sequence Number
  const sendSignedEvent = useCallback(
    async (type: string, payload: unknown): Promise<{ success: boolean; seq: number; error?: string }> => {
      if (!sessionId || !sessionSecret) {
        return { success: false, seq: seqRef.current, error: 'Session credentials missing' };
      }

      // Increment sequence number
      seqRef.current += 1;
      const currentSeq = seqRef.current;
      const ts = Date.now() + serverOffsetRef.current;

      try {
        const hmac = await computeClientHmac(sessionSecret, {
          type,
          ts,
          seq: currentSeq,
          payload,
        });

        const body: SignedSecurityEventPayload = {
          type,
          ts,
          seq: currentSeq,
          payload,
          hmac,
        };

        const res = await fetch(`${baseUrl}/api/session/${sessionId}/event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const result = await res.json();

        if (!res.ok || !result.valid) {
          const errorMsg = result.error || 'Event signature or sequence verification failed';
          onTamperDetectedRef.current?.(result);
          return { success: false, seq: currentSeq, error: errorMsg };
        }

        return { success: true, seq: currentSeq };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Network error';
        return { success: false, seq: currentSeq, error: msg };
      }
    },
    [sessionId, sessionSecret, baseUrl]
  );

  // 5. Send Heartbeat with performance.now() and sequence number every 5s
  const sendHeartbeatNow = useCallback(async () => {
    if (!sessionId || !enabled) return;

    const perfNow = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const ts = Date.now() + serverOffsetRef.current;

    try {
      const res = await fetch(`${baseUrl}/api/session/${sessionId}/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfNow,
          seq: seqRef.current,
          ts,
        }),
      });

      if (res.ok) {
        setLastHeartbeatSentAt(Date.now());
      }
    } catch (err: unknown) {
      console.warn('[useSignedEventChannel] Heartbeat send error:', err);
    }
  }, [sessionId, baseUrl, enabled]);

  useEffect(() => {
    if (!enabled || !sessionId) return;

    const interval = setInterval(() => {
      sendHeartbeatNow();
    }, heartbeatIntervalMs);

    return () => clearInterval(interval);
  }, [enabled, sessionId, heartbeatIntervalMs, sendHeartbeatNow]);

  // 6. Submit Examination Answers
  const submitAnswers = useCallback(
    async (answers: unknown): Promise<{ success: boolean; status?: string; error?: string }> => {
      if (!sessionId) {
        return { success: false, error: 'Session ID required' };
      }

      try {
        const res = await fetch(`${baseUrl}/api/session/${sessionId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          return {
            success: false,
            status: data.status,
            error: data.error || 'Submission failed or deadline grace exceeded',
          };
        }

        return { success: true, status: data.status };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Network submission error';
        return { success: false, error: msg };
      }
    },
    [sessionId, baseUrl]
  );

  // 7. Online/Offline Network Status Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncClockNow();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncClockNow]);

  return {
    sessionId,
    timeRemainingMs,
    serverNow,
    deadline,
    isDeadlineReached,
    seq: seqRef.current,
    isSyncing,
    isOnline,
    lastHeartbeatSentAt,
    sendSignedEvent,
    submitAnswers,
    syncClockNow,
    sendHeartbeatNow,
  };
}

export default useSignedEventChannel;
