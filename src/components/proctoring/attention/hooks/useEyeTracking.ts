import { useState, useEffect, useRef } from 'react';
import { eyeTrackingService } from '../services/eyeTracking.service';
import { ATTENTION_CONFIG } from '../constants/attention.constants';
import { EyeStateData, GazeData } from '../types/attention.types';

export const useEyeTracking = (isEngineActive: boolean = true) => {
  const [eyeState, setEyeState] = useState<EyeStateData>({
    leftEyeOpenness: 0.92,
    rightEyeOpenness: 0.90,
    leftEyeState: 'open',
    rightEyeState: 'open',
    isBlinking: false,
    blinkRatePerMin: 18,
  });

  const [gaze, setGaze] = useState<GazeData>({
    zone: 'center',
    angleHorizontalDeg: 0,
    angleVerticalDeg: 0,
    confidence: 0.95,
  });

  const lastInferenceRef = useRef<number>(0);

  useEffect(() => {
    if (!isEngineActive) return;

    let animId: number;

    const loop = (time: number) => {
      if (time - lastInferenceRef.current >= ATTENTION_CONFIG.INFERENCE_INTERVAL_MS) {
        lastInferenceRef.current = time;
        const res = eyeTrackingService.analyzeEyes(null);
        setEyeState(res.eyeState);
        setGaze(res.gaze);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isEngineActive]);

  return { eyeState, gaze };
};
