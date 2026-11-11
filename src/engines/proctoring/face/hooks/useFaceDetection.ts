import { useState, useEffect, useRef } from 'react';
import { faceService } from '../services/face.service';
import { FACE_DETECTION_CONFIG } from '../constants/face.constants';
import { FaceDetectionResult, FaceQualityResult } from '../types/face.types';

/**
 * Custom hook `useFaceDetection` running face analysis at 5–10 FPS using
 * requestAnimationFrame throttle to prevent main UI thread blocking.
 */
export const useFaceDetection = (isEngineActive: boolean = true) => {
  const [detection, setDetection] = useState<FaceDetectionResult>({
    faceCount: 0,
    faces: [],
    primaryFace: null,
    inferenceTimeMs: 0,
    fps: 0,
    timestamp: new Date().toISOString(),
  });

  const [quality, setQuality] = useState<FaceQualityResult>({
    rating: 'good',
    brightness: 80,
    contrast: 75,
    sharpness: 80,
    blurScore: 10,
    occlusionScore: 0,
    reasons: [],
  });

  const lastInferenceTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isEngineActive) return;

    let animFrameId: number;

    const runInferenceCycle = (time: number) => {
      if (time - lastInferenceTimeRef.current >= FACE_DETECTION_CONFIG.INFERENCE_INTERVAL_MS) {
        lastInferenceTimeRef.current = time;
        const res = faceService.analyzeFrame(null);
        setDetection(res.detection);
        setQuality(res.quality);
      }
      animFrameId = requestAnimationFrame(runInferenceCycle);
    };

    animFrameId = requestAnimationFrame(runInferenceCycle);
    return () => cancelAnimationFrame(animFrameId);
  }, [isEngineActive]);

  return {
    detection,
    quality,
  };
};
