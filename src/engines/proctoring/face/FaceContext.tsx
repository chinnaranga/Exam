import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FaceEvent,
  FaceState,
  FaceVerificationRecord,
  VerificationReason,
  VerificationStatus,
} from './types/face.types';
import { faceService } from './services/face.service';
import { useFaceDetection } from './hooks/useFaceDetection';
import { useFaceVerification } from './hooks/useFaceVerification';
import { useFacePresence } from './hooks/useFacePresence';
import { FACE_LIMITATIONS_EXPLANATIONS } from './constants/face.constants';

export interface FaceContextValue extends FaceState {
  startEngine: () => void;
  stopEngine: () => void;
  captureReferenceSnapshot: (candidateId: string) => Promise<void>;
  runVerification: (reason?: VerificationReason) => FaceVerificationRecord;
  emitEvent: (
    module: FaceEvent['module'],
    type: FaceEvent['type'],
    severity: FaceEvent['severity'],
    confidence: FaceEvent['confidence'],
    explanation: string,
    limitations: string,
    details?: Record<string, any>
  ) => void;
}

const FaceContext = createContext<FaceContextValue | null>(null);

export interface FaceProviderProps {
  children: React.ReactNode;
  candidateId?: string;
  autoStart?: boolean;
}

export const FaceProvider: React.FC<FaceProviderProps> = ({
  children,
  candidateId = 'cand_student_2026',
  autoStart = true,
}) => {
  const [isEngineActive, setIsEngineActive] = useState<boolean>(autoStart);
  const [events, setEvents] = useState<FaceEvent[]>([]);

  const { detection, quality } = useFaceDetection(isEngineActive);
  const { verificationStatus, history, captureReferenceSnapshot, runVerification } = useFaceVerification();
  const { presenceStatus, seatedDurationMs, totalAbsenceDurationMs, timeline } = useFacePresence(detection.faceCount);

  const emitEvent = (
    module: FaceEvent['module'],
    type: FaceEvent['type'],
    severity: FaceEvent['severity'],
    confidence: FaceEvent['confidence'],
    explanation: string,
    limitations: string,
    details: Record<string, any> = {}
  ) => {
    const evt = faceService.createFaceEvent(module, type, severity, confidence, explanation, limitations, details);
    setEvents((prev) => [evt, ...prev.slice(0, 49)]);
  };

  // Monitor face count changes and emit audit events
  useEffect(() => {
    if (!isEngineActive) return;

    if (detection.faceCount === 0) {
      emitEvent('FacePresence', 'FaceMissing', 'High', 'High', 'No face detected in candidate frame.', FACE_LIMITATIONS_EXPLANATIONS.LIGHTING, { faceCount: 0 });
    } else if (detection.faceCount > 1) {
      emitEvent('MultipleFace', 'MultipleFacesDetected', 'High', 'High', `Detected ${detection.faceCount} faces in candidate frame.`, FACE_LIMITATIONS_EXPLANATIONS.MULTIPLE_FACES, { faceCount: detection.faceCount });
    }
  }, [detection.faceCount, isEngineActive]);

  const value: FaceContextValue = {
    isEngineActive,
    presenceStatus,
    faceCount: detection.faceCount,
    primaryFace: detection.primaryFace,
    quality,
    verificationStatus,
    verificationHistory: history,
    presenceTimeline: timeline,
    seatedDurationMs,
    totalAbsenceDurationMs,
    fps: detection.fps,
    events,
    startEngine: () => setIsEngineActive(true),
    stopEngine: () => setIsEngineActive(false),
    captureReferenceSnapshot,
    runVerification,
    emitEvent,
  };

  return <FaceContext.Provider value={value}>{children}</FaceContext.Provider>;
};

export const useFaceContext = () => {
  const context = useContext(FaceContext);
  if (!context) {
    throw new Error('useFaceContext must be used within a FaceProvider');
  }
  return context;
};
