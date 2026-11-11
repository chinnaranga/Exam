import React, { useState, useRef, useEffect, useMemo } from 'react';
import { KeyboardContext, KeyboardContextValue } from './KeyboardContext';
import { KeyboardRestrictionEngine } from './KeyboardRestrictionEngine';
import { KeyboardPolicyAction } from './types/KeyboardShortcut';

export interface KeyboardProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
  studentId?: string;
  examId?: string;
  sessionId?: string;
}

export const KeyboardProvider: React.FC<KeyboardProviderProps> = ({
  children,
  autoStart = false,
  studentId,
  examId,
  sessionId,
}) => {
  const engineRef = useRef<KeyboardRestrictionEngine>(new KeyboardRestrictionEngine());
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [rules, setRules] = useState(engineRef.current.policyService.getRules());

  const start = () => {
    if (isMonitoring) return;
    setIsMonitoring(true);
    engineRef.current.start();
  };

  const stop = () => {
    if (!isMonitoring) return;
    engineRef.current.stop();
    setIsMonitoring(false);
  };

  const updateRuleAction = (id: string, action: KeyboardPolicyAction) => {
    engineRef.current.policyService.updateRuleAction(id, action);
    setRules([...engineRef.current.policyService.getRules()]);
  };

  useEffect(() => {
    engineRef.current.setContextData({ studentId, examId, sessionId });
  }, [studentId, examId, sessionId]);

  useEffect(() => {
    if (autoStart) {
      start();
    }
    return () => {
      engineRef.current.stop();
    };
  }, [autoStart]);

  const value: KeyboardContextValue = useMemo(
    () => ({
      isMonitoring,
      rules,
      start,
      stop,
      updateRuleAction,
    }),
    [isMonitoring, rules]
  );

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
};
