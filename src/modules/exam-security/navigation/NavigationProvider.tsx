import React, { useState, useRef, useEffect, useMemo } from 'react';
import { NavigationContext, NavigationContextValue } from './NavigationContext';
import { NavigationEngine } from './NavigationEngine';
import { NormalizedNavigationEvent } from './types/NavigationEvent';

export interface NavigationProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
  studentId?: string;
  examId?: string;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  autoStart = false,
  studentId,
  examId,
}) => {
  const engineRef = useRef<NavigationEngine>(new NavigationEngine());
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [logs, setLogs] = useState<NormalizedNavigationEvent[]>([]);
  const [lastEvent, setLastEvent] = useState<NormalizedNavigationEvent | null>(null);

  const start = () => {
    if (isMonitoring) return;
    setIsMonitoring(true);
    engineRef.current.start((evt) => {
      setLastEvent(evt);
      setLogs((prev) => [evt, ...prev.slice(0, 49)]);
    });
  };

  const stop = () => {
    if (!isMonitoring) return;
    engineRef.current.stop();
    setIsMonitoring(false);
  };

  useEffect(() => {
    engineRef.current.setContextData({ studentId, examId });
  }, [studentId, examId]);

  useEffect(() => {
    if (autoStart) {
      start();
    }
    return () => {
      engineRef.current.stop();
    };
  }, [autoStart]);

  const value: NavigationContextValue = useMemo(
    () => ({
      isMonitoring,
      logs,
      lastEvent,
      start,
      stop,
    }),
    [isMonitoring, logs, lastEvent]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
