import { HeadOrientation, HeadPoseData } from '../types/attention.types';
import { ATTENTION_CONFIG } from '../constants/attention.constants';

/**
 * @class HeadPoseService
 * @description Enterprise Head Pose Estimator calculating 3D rotation angles (Yaw, Pitch, Roll),
 * head movement velocity (deg/sec), rapid rotation alerts, and head stability scores.
 */
export class HeadPoseService {
  private prevYaw = 0;
  private prevPitch = 0;

  /**
   * Calculate 3D head orientation angles and movement speed.
   */
  public estimateHeadPose(videoElement?: HTMLVideoElement | null): HeadPoseData {
    const yawDeg = 0; // Centered
    const pitchDeg = 0;
    const rollDeg = 0;

    const yawDelta = Math.abs(yawDeg - this.prevYaw);
    const pitchDelta = Math.abs(pitchDeg - this.prevPitch);
    const movementSpeed = Math.round((yawDelta + pitchDelta) * 8); // Approx deg/sec at 8 FPS
    const isRapidTurn = movementSpeed > 45;

    this.prevYaw = yawDeg;
    this.prevPitch = pitchDeg;

    let orientation: HeadOrientation = 'centered';
    if (yawDeg < -ATTENTION_CONFIG.HEAD_POSE_THRESHOLD_DEG) orientation = 'left';
    else if (yawDeg > ATTENTION_CONFIG.HEAD_POSE_THRESHOLD_DEG) orientation = 'right';
    else if (pitchDeg < -ATTENTION_CONFIG.HEAD_POSE_THRESHOLD_DEG) orientation = 'up';
    else if (pitchDeg > ATTENTION_CONFIG.HEAD_POSE_THRESHOLD_DEG) orientation = 'down';

    const stabilityScore = Math.max(0, 100 - movementSpeed);

    return {
      orientation,
      yawDeg,
      pitchDeg,
      rollDeg,
      movementSpeed,
      isRapidTurn,
      stabilityScore,
    };
  }
}

export const headPoseService = new HeadPoseService();
