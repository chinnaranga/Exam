import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MouseContext, MouseContextValue } from './MouseContext';
import { MouseRestrictionEngine } from './MouseRestrictionEngine';
import { MousePolicyAction } from './types/MouseAction';

export interface MouseProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
  studentId?: string;
  examId?: string;
  sessionId?: string;
}

export const MouseProvider: React.FC<MouseProviderProps> = ({
  children,
  autoStart = false,
  studentId,
  examId,
  sessionId,
}) => {
  const engineRef = useRef<MouseRestrictionEngine>(new MouseRestrictionEngine());
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

  const updatePolicy = (id: string, action: MousePolicyAction) => {
    engineRef.current.policyService.updatePolicy(id, action);
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

  const value: MouseContextValue = useMemo(
    () => ({
      isMonitoring,
      rules,
      analytics: engineRef.current.getAnalytics(),
      start,
      stop,
      updatePolicy,
    }),
    [isMonitoring, rules]
  );

  return (
    <MouseContext.Provider value={value}>
      {children}
    </MouseContext.Provider>
  );
};
