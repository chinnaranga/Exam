import { useState, useEffect } from 'react';
import { CandidatePresenceTimelineItem, FacePresenceStatus } from '../types/face.types';

/**
 * Custom hook `useFacePresence` tracking candidate presence status, seated duration,
 * total absence duration, and timeline events.
 */
export const useFacePresence = (currentFaceCount: number) => {
  const [presenceStatus, setPresenceStatus] = useState<FacePresenceStatus>('visible');
  const [seatedDurationMs, setSeatedDurationMs] = useState<number>(0);
  const [totalAbsenceDurationMs, setTotalAbsenceDurationMs] = useState<number>(0);
  const [timeline, setTimeline] = useState<CandidatePresenceTimelineItem[]>([]);

  useEffect(() => {
    let newStatus: FacePresenceStatus = 'visible';
    if (currentFaceCount === 0) {
      newStatus = 'no_face';
    }

    setPresenceStatus(newStatus);
  }, [currentFaceCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (presenceStatus === 'visible' || presenceStatus === 'partially_visible') {
        setSeatedDurationMs((prev) => prev + 1000);
      } else {
        setTotalAbsenceDurationMs((prev) => prev + 1000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [presenceStatus]);

  return {
    presenceStatus,
    seatedDurationMs,
    totalAbsenceDurationMs,
    timeline,
  };
};
