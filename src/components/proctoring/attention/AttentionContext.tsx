import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AttentionEvent,
  AttentionState,
  AttentionStatus,
  AttentionTimelineItem,
  LookingAwayState,
} from './types/attention.types';
import { attentionService } from './services/attention.service';
import { useEyeTracking } from './hooks/useEyeTracking';
import { useHeadPose } from './hooks/useHeadPose';
import { ATTENTION_LIMITATIONS_EXPLANATIONS } from './constants/attention.constants';

export interface AttentionContextValue extends AttentionState {
  startEngine: () => void;
  stopEngine: () => void;
  emitEvent: (
    module: AttentionEvent['module'],
    type: AttentionEvent['type'],
    severity: AttentionEvent['severity'],
    confidence: AttentionEvent['confidence'],
    explanation: string,
    limitations: string,
    duration?: number,
    details?: Record<string, any>
  ) => void;
}

const AttentionContext = createContext<AttentionContextValue | null>(null);

export interface AttentionProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
}

export const AttentionProvider: React.FC<AttentionProviderProps> = ({ children, autoStart = true }) => {
  const [isEngineActive, setIsEngineActive] = useState<boolean>(autoStart);
  const [events, setEvents] = useState<AttentionEvent[]>([]);
  const [timeline, setTimeline] = useState<AttentionTimelineItem[]>([]);
  const [lookingAway, setLookingAway] = useState<LookingAwayState>({
    isLookingAway: false,
    currentAwayDurationMs: 0,
    totalAwayDurationMs: 0,
    awayFrequencyCount: 0,
    explanation: 'Candidate gaze is centered on examination screen.',
  });

  const { eyeState, gaze } = useEyeTracking(isEngineActive);
  const { headPose } = useHeadPose(isEngineActive);

  // Compute status
  let status: AttentionStatus = 'focused';
  if (headPose.orientation !== 'centered') status = 'head_turned';
  else if (gaze.zone !== 'center') status = 'looking_away';
  else if (eyeState.leftEyeState === 'closed' && eyeState.rightEyeState === 'closed') status = 'long_eye_closure';

  const emitEvent = (
    module: AttentionEvent['module'],
    type: AttentionEvent['type'],
    severity: AttentionEvent['severity'],
    confidence: AttentionEvent['confidence'],
    explanation: string,
    limitations: string,
    duration?: number,
    details: Record<string, any> = {}
  ) => {
    const evt = attentionService.createAttentionEvent(module, type, severity, confidence, explanation, limitations, duration, details);
    setEvents((prev) => [evt, ...prev.slice(0, 49)]);

    // Log to timeline
    const item: AttentionTimelineItem = {
      id: evt.id,
      timestamp: new Date().toLocaleTimeString(),
      type: evt.type,
      zone: gaze.zone,
      headOrientation: headPose.orientation,
      durationMs: duration || 1000,
      explanation,
    };
    setTimeline((prev) => [item, ...prev.slice(0, 49)]);
  };

  // Monitor looking away timers
  useEffect(() => {
    if (!isEngineActive) return;

    const interval = setInterval(() => {
      setLookingAway((prev) => {
        const isOffCenter = gaze.zone !== 'center';
        const isHeadRotated = headPose.orientation !== 'centered';
        return attentionService.evaluateLookingAway(isOffCenter, isHeadRotated, 1000, prev);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gaze.zone, headPose.orientation, isEngineActive]);

  const value: AttentionContextValue = {
    isEngineActive,
    status,
    eyeState,
    gaze,
    headPose,
    lookingAway,
    timeline,
    events,
    trackingConfidence: 'High',
    startEngine: () => setIsEngineActive(true),
    stopEngine: () => setIsEngineActive(false),
    emitEvent,
  };

  return <AttentionContext.Provider value={value}>{children}</AttentionContext.Provider>;
};

export const useAttentionContext = () => {
  const context = useContext(AttentionContext);
  if (!context) {
    throw new Error('useAttentionContext must be used within an AttentionProvider');
  }
  return context;
};
