import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FocusContext, FocusContextValue } from './FocusContext';
import { FocusEngine } from './FocusEngine';

export interface FocusProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
  studentId?: string;
  examId?: string;
  sessionId?: string;
}

export const FocusProvider: React.FC<FocusProviderProps> = ({
  children,
  autoStart = false,
  studentId,
  examId,
  sessionId,
}) => {
  const engineRef = useRef<FocusEngine>(new FocusEngine());
  const [isMonitoring, setIsMonitoring] = useState(false);

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

  const value: FocusContextValue = useMemo(
    () => ({
      isMonitoring,
      analytics: engineRef.current.getAnalytics(),
      start,
      stop,
    }),
    [isMonitoring]
  );

  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  );
};
