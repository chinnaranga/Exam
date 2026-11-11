import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseOfflineLimitSentinelOptions {
  maxOfflineSeconds?: number; // 3 minutes = 180 seconds
  onOfflineLimitExceeded?: (offlineDurationSeconds: number) => void;
  onConnectivityRestored?: (offlineDurationSeconds: number) => void;
}

export function useOfflineLimitSentinel({
  maxOfflineSeconds = 180, // 3 minutes
  onOfflineLimitExceeded,
  onConnectivityRestored,
}: UseOfflineLimitSentinelOptions = {}) {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [offlineSecondsElapsed, setOfflineSecondsElapsed] = useState<number>(0);
  const [isExamPaused, setIsExamPaused] = useState<boolean>(false);

  const offlineStartRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const limitReportedRef = useRef<boolean>(false);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    const start = Date.now();
    offlineStartRef.current = start;
    limitReportedRef.current = false;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (!offlineStartRef.current) return;
      const elapsed = Math.floor((Date.now() - offlineStartRef.current) / 1000);
      setOfflineSecondsElapsed(elapsed);

      // If disconnected for longer than 3 minutes (180s)
      if (elapsed >= maxOfflineSeconds) {
        setIsExamPaused(true);
        if (!limitReportedRef.current) {
          limitReportedRef.current = true;
          if (onOfflineLimitExceeded) {
            onOfflineLimitExceeded(elapsed);
          }
        }
      }
    }, 1000);
  }, [maxOfflineSeconds, onOfflineLimitExceeded]);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const start = offlineStartRef.current;
    offlineStartRef.current = null;
    const duration = start ? Math.floor((Date.now() - start) / 1000) : 0;

    // Clear paused state when reconnected
    setIsExamPaused(false);
    setOfflineSecondsElapsed(0);

    if (onConnectivityRestored) {
      onConnectivityRestored(duration);
    }
  }, [onConnectivityRestored]);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleOffline, handleOnline]);

  const secondsRemaining = Math.max(0, maxOfflineSeconds - offlineSecondsElapsed);

  return {
    isOnline,
    isExamPaused,
    offlineSecondsElapsed,
    secondsRemaining,
    maxOfflineSeconds,
  };
}

export default useOfflineLimitSentinel;
