import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ClipboardContext, ClipboardContextValue } from './ClipboardContext';
import { ClipboardProtectionEngine } from './ClipboardProtectionEngine';
import { NormalizedClipboardEvent } from './types/ClipboardEvent';
import { ClipboardPolicyAction } from './types/ClipboardAction';

export interface ClipboardProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
  studentId?: string;
  examId?: string;
  sessionId?: string;
}

export const ClipboardProvider: React.FC<ClipboardProviderProps> = ({
  children,
  autoStart = false,
  studentId,
  examId,
  sessionId,
}) => {
  const engineRef = useRef<ClipboardProtectionEngine>(new ClipboardProtectionEngine());
  const [isClipboardMonitoring, setIsClipboardMonitoring] = useState(false);
  const [lastClipboardEvent, setLastClipboardEvent] = useState<NormalizedClipboardEvent | undefined>(undefined);
  const [clipboardEventCount, setClipboardEventCount] = useState(0);
  const [rules, setRules] = useState(engineRef.current.policyService.getRules());

  const startClipboardMonitoring = () => {
    if (isClipboardMonitoring) return;
    setIsClipboardMonitoring(true);
    engineRef.current.start();
  };

  const stopClipboardMonitoring = () => {
    if (!isClipboardMonitoring) return;
    engineRef.current.stop();
    setIsClipboardMonitoring(false);
  };

  const updatePolicy = (id: string, action: ClipboardPolicyAction) => {
    engineRef.current.policyService.updatePolicy(id, action);
    setRules([...engineRef.current.policyService.getRules()]);
  };

  useEffect(() => {
    engineRef.current.setContextData({ studentId, examId, sessionId });
  }, [studentId, examId, sessionId]);

  useEffect(() => {
    if (autoStart) {
      startClipboardMonitoring();
    }
    return () => {
      engineRef.current.stop();
    };
  }, [autoStart]);

  const value: ClipboardContextValue = useMemo(
    () => ({
      isClipboardMonitoring,
      lastClipboardEvent,
      clipboardEventCount,
      rules,
      analytics: engineRef.current.getAnalytics(),
      startClipboardMonitoring,
      stopClipboardMonitoring,
      updatePolicy,
    }),
    [isClipboardMonitoring, lastClipboardEvent, clipboardEventCount, rules]
  );

  return (
    <ClipboardContext.Provider value={value}>
      {children}
    </ClipboardContext.Provider>
  );
};
