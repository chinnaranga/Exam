import React, { createContext, useContext, useState } from 'react';
import {
  DetectedObject,
  ObjectDetectionEvent,
  ObjectDetectionState,
  ObjectPolicyConfig,
  ObjectType,
} from './types/object.types';
import { DEFAULT_OBJECT_POLICY } from './constants/object.constants';
import { objectDetectionService } from './services/objectDetection.service';
import { useObjectDetection } from './hooks/useObjectDetection';
import { useObjectTracker } from './hooks/useObjectTracker';

export interface ObjectDetectionContextValue extends ObjectDetectionState {
  startEngine: () => void;
  stopEngine: () => void;
  updatePolicyConfig: (newConfig: Partial<ObjectPolicyConfig>) => void;
  emitEvent: (
    module: ObjectDetectionEvent['module'],
    objectType: ObjectType,
    event: ObjectDetectionEvent['event'],
    severity: ObjectDetectionEvent['severity'],
    confidence: ObjectDetectionEvent['confidence'],
    explanation: string,
    limitations: string,
    duration: number,
    trackingId: string,
    boundingBox: DetectedObject['boundingBox'],
    details?: Record<string, any>
  ) => void;
}

const ObjectDetectionContext = createContext<ObjectDetectionContextValue | null>(null);

export interface ObjectDetectionProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
  initialPolicy?: Partial<ObjectPolicyConfig>;
}

export const ObjectDetectionProvider: React.FC<ObjectDetectionProviderProps> = ({
  children,
  autoStart = true,
  initialPolicy,
}) => {
  const [isEngineActive, setIsEngineActive] = useState<boolean>(autoStart);
  const [events, setEvents] = useState<ObjectDetectionEvent[]>([]);
  const [policyConfig, setPolicyConfig] = useState<ObjectPolicyConfig>({
    ...DEFAULT_OBJECT_POLICY,
    ...initialPolicy,
  });

  const { detectedObjects: rawDetections, fps } = useObjectDetection(isEngineActive, policyConfig);
  const { trackedObjects } = useObjectTracker(rawDetections);

  const updatePolicyConfig = (newConfig: Partial<ObjectPolicyConfig>) => {
    setPolicyConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const emitEvent = (
    module: ObjectDetectionEvent['module'],
    objectType: ObjectType,
    event: ObjectDetectionEvent['event'],
    severity: ObjectDetectionEvent['severity'],
    confidence: ObjectDetectionEvent['confidence'],
    explanation: string,
    limitations: string,
    duration: number,
    trackingId: string,
    boundingBox: DetectedObject['boundingBox'],
    details: Record<string, any> = {}
  ) => {
    const evt = objectDetectionService.createObjectEvent(
      module,
      objectType,
      event,
      severity,
      confidence,
      explanation,
      limitations,
      duration,
      trackingId,
      boundingBox,
      details
    );
    setEvents((prev) => [evt, ...prev.slice(0, 49)]);
  };

  const value: ObjectDetectionContextValue = {
    isEngineActive,
    detectedObjects: trackedObjects,
    events,
    policyConfig,
    fps,
    isGpuAccelerated: true,
    startEngine: () => setIsEngineActive(true),
    stopEngine: () => setIsEngineActive(false),
    updatePolicyConfig,
    emitEvent,
  };

  return <ObjectDetectionContext.Provider value={value}>{children}</ObjectDetectionContext.Provider>;
};

export const useObjectDetectionContext = () => {
  const context = useContext(ObjectDetectionContext);
  if (!context) {
    throw new Error('useObjectDetectionContext must be used within an ObjectDetectionProvider');
  }
  return context;
};
