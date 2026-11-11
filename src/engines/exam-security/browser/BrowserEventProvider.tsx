import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BrowserEventContext, BrowserEventContextValue } from './BrowserEventContext';
import { BrowserEventManager } from './BrowserEventManager';
import { NormalizedBrowserEvent } from './types/BrowserEvent';

export interface BrowserEventProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
  examId?: string;
  studentId?: string;
  sessionId?: string;
}

export const BrowserEventProvider: React.FC<BrowserEventProviderProps> = ({
  children,
  autoStart = false,
  examId,
  studentId,
  sessionId,
}) => {
  const managerRef = useRef<BrowserEventManager>(new BrowserEventManager({ examId, studentId, sessionId }));
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastEvent, setLastEvent] = useState<NormalizedBrowserEvent | undefined>(undefined);
  const [eventCount, setEventCount] = useState(0);

  const startMonitoring = () => {
    if (isMonitoring) return;
    setIsMonitoring(true);
    managerRef.current.startMonitoring((evt) => {
      setLastEvent(evt);
      setEventCount((prev) => prev + 1);
    });
  };

  const stopMonitoring = () => {
    if (!isMonitoring) return;
    managerRef.current.stopMonitoring();
    setIsMonitoring(false);
  };

  useEffect(() => {
    managerRef.current.setContextData({ examId, studentId, sessionId });
  }, [examId, studentId, sessionId]);

  useEffect(() => {
    if (autoStart) {
      startMonitoring();
    }
    return () => {
      managerRef.current.stopMonitoring();
    };
  }, [autoStart]);

  const value: BrowserEventContextValue = useMemo(
    () => ({
      isMonitoring,
      lastEvent,
      eventCount,
      startMonitoring,
      stopMonitoring,
    }),
    [isMonitoring, lastEvent, eventCount]
  );

  return (
    <BrowserEventContext.Provider value={value}>
      {children}
    </BrowserEventContext.Provider>
  );
};
