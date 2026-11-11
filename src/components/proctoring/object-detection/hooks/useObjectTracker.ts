import { useEffect, useState } from 'react';
import { objectTrackingService } from '../services/objectTracking.service';
import { DetectedObject } from '../types/object.types';

export const useObjectTracker = (rawDetections: DetectedObject[]) => {
  const [trackedObjects, setTrackedObjects] = useState<DetectedObject[]>([]);

  useEffect(() => {
    const updated = objectTrackingService.updateTracks(rawDetections, 125);
    setTrackedObjects(updated);
  }, [rawDetections]);

  return { trackedObjects };
};
