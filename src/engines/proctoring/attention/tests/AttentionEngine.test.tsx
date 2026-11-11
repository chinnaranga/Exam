import { describe, it, expect } from 'vitest';
import { eyeTrackingService } from '../services/eyeTracking.service';
import { headPoseService } from '../services/headPose.service';
import { attentionService } from '../services/attention.service';

describe('Module 4: Eye Tracking, Gaze Estimation & Head Pose Engine Test Suite', () => {
  it('1. should analyze eye openness and classify gaze zones', () => {
    const res = eyeTrackingService.analyzeEyes(null);
    expect(res.eyeState).toBeDefined();
    expect(res.eyeState.leftEyeOpenness).toBeGreaterThan(0);
    expect(res.gaze.zone).toBe('center');
  });

  it('2. should estimate 3D head pose orientation and angles', () => {
    const head = headPoseService.estimateHeadPose(null);
    expect(head.orientation).toBeDefined();
    expect(head.yawDeg).toBe(0);
    expect(head.stabilityScore).toBeGreaterThan(0);
  });

  it('3. should track looking away timers and select non-prejudicial explanations', () => {
    const initialState = {
      isLookingAway: false,
      currentAwayDurationMs: 0,
      totalAwayDurationMs: 0,
      awayFrequencyCount: 0,
      explanation: 'Centered',
    };

    const res = attentionService.evaluateLookingAway(true, false, 1000, initialState);
    expect(res.isLookingAway).toBe(true);
    expect(res.currentAwayDurationMs).toBe(1000);
    expect(res.awayFrequencyCount).toBe(1);
    expect(res.explanation).toBeDefined();
  });

  it('4. should generate structured audit events with explicit explanations & limitations', () => {
    const evt = attentionService.createAttentionEvent(
      'GazeEstimator',
      'LookingRight',
      'Low',
      'High',
      'Candidate gaze was estimated to the right for approximately 3.4 seconds.',
      'Gaze estimation may be affected by camera angle or lighting conditions.',
      3400,
      { yaw: 18, pitch: -2 }
    );

    expect(evt.module).toBe('GazeEstimator');
    expect(evt.type).toBe('LookingRight');
    expect(evt.duration).toBe(3400);
    expect(evt.explanation).toContain('Candidate gaze was estimated');
  });
});
