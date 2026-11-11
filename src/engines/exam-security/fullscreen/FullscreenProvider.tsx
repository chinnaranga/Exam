import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FullscreenContext, FullscreenContextValue } from './FullscreenContext';
import { FullscreenEngine } from './FullscreenEngine';
import { FullscreenState } from './types/FullscreenState';
import { NormalizedFullscreenEvent } from './types/FullscreenEvent';
import { BrowserCompatibility } from './utils/BrowserCompatibility';

export interface FullscreenProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
  studentId?: string;
  examId?: string;
  sessionId?: string;
  currentQuestion?: number;
  timeLeftSeconds?: number;
}

export const FullscreenProvider: React.FC<FullscreenProviderProps> = ({
  children,
  autoStart = false,
  studentId,
  examId,
  sessionId,
  currentQuestion,
  timeLeftSeconds,
}) => {
  const engineRef = useRef<FullscreenEngine>(new FullscreenEngine());
  const [fullscreenState, setFullscreenState] = useState<FullscreenState>(
    engineRef.current.service.stateService.getState()
  );
  const [lastFullscreenEvent, setLastFullscreenEvent] = useState<NormalizedFullscreenEvent | undefined>(undefined);

  const requestFullscreen = async () => {
    await engineRef.current.service.requestFullscreen();
    setFullscreenState(engineRef.current.service.stateService.getState());
  };

  const exitFullscreen = async () => {
    await engineRef.current.service.exitFullscreen();
    setFullscreenState(engineRef.current.service.stateService.getState());
  };

  const retryRecovery = async () => {
    const res = await engineRef.current.service.recoveryService.attemptRecovery();
    setFullscreenState(engineRef.current.service.stateService.getState());
    return res;
  };

  useEffect(() => {
    engineRef.current.setContextData({ studentId, examId, sessionId, currentQuestion, timeLeftSeconds });
  }, [studentId, examId, sessionId, currentQuestion, timeLeftSeconds]);

  useEffect(() => {
    if (autoStart) {
      engineRef.current.start();
    }
    return () => {
      engineRef.current.stop();
    };
  }, [autoStart]);

  const value: FullscreenContextValue = useMemo(
    () => ({
      fullscreenState,
      isFullscreen: fullscreenState === 'ACTIVE',
      isSupported: BrowserCompatibility.isFullscreenSupported(),
      lastFullscreenEvent,
      recoveryAttempts: engineRef.current.service.recoveryService.getRecoveryAttempts(),
      isPaused: engineRef.current.service.recoveryService.getIsPaused(),
      analytics: engineRef.current.getAnalytics(),
      requestFullscreen,
      exitFullscreen,
      retryRecovery,
    }),
    [fullscreenState, lastFullscreenEvent]
  );

  return (
    <FullscreenContext.Provider value={value}>
      {children}
    </FullscreenContext.Provider>
  );
};
