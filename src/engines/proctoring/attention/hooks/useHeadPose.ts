import { useState, useEffect, useRef } from 'react';
import { headPoseService } from '../services/headPose.service';
import { ATTENTION_CONFIG } from '../constants/attention.constants';
import { HeadPoseData } from '../types/attention.types';

export const useHeadPose = (isEngineActive: boolean = true) => {
  const [headPose, setHeadPose] = useState<HeadPoseData>({
    orientation: 'centered',
    yawDeg: 0,
    pitchDeg: 0,
    rollDeg: 0,
    movementSpeed: 0,
    isRapidTurn: false,
    stabilityScore: 100,
  });

  const lastInferenceRef = useRef<number>(0);

  useEffect(() => {
    if (!isEngineActive) return;

    let animId: number;

    const loop = (time: number) => {
      if (time - lastInferenceRef.current >= ATTENTION_CONFIG.INFERENCE_INTERVAL_MS) {
        lastInferenceRef.current = time;
        const res = headPoseService.estimateHeadPose(null);
        setHeadPose(res);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isEngineActive]);

  return { headPose };
};
