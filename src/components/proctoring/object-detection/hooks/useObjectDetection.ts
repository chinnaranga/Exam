import { useState, useEffect, useRef } from 'react';
import { objectDetectionService } from '../services/objectDetection.service';
import { DetectedObject, ObjectPolicyConfig } from '../types/object.types';

export const useObjectDetection = (isEngineActive: boolean = true, policyConfig?: ObjectPolicyConfig) => {
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [fps, setFps] = useState<number>(8);
  const lastInferenceRef = useRef<number>(0);

  useEffect(() => {
    if (!isEngineActive) return;

    let animId: number;

    const loop = (time: number) => {
      if (time - lastInferenceRef.current >= 125) {
        // ~8 FPS
        lastInferenceRef.current = time;
        const res = objectDetectionService.analyzeFrame(null, policyConfig);
        setDetectedObjects(res);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isEngineActive, policyConfig]);

  return { detectedObjects, fps };
};
