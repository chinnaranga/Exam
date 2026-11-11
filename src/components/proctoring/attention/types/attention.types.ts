export type EyeOpenState = 'open' | 'closed' | 'partially_visible' | 'lost';

export type BlinkState = 'normal' | 'frequent' | 'long_closure';

export type GazeZone = 'center' | 'left' | 'right' | 'up' | 'down';

export type HeadOrientation = 'centered' | 'left' | 'right' | 'up' | 'down';

export type AttentionStatus = 'focused' | 'looking_away' | 'head_turned' | 'long_eye_closure' | 'unstable';

export interface EyeStateData {
  leftEyeOpenness: number; // 0..1
  rightEyeOpenness: number; // 0..1
  leftEyeState: EyeOpenState;
  rightEyeState: EyeOpenState;
  isBlinking: boolean;
  blinkRatePerMin: number;
}

export interface GazeData {
  zone: GazeZone;
  angleHorizontalDeg: number; // -90..+90
  angleVerticalDeg: number; // -90..+90
  confidence: number; // 0..1
}

export interface HeadPoseData {
  orientation: HeadOrientation;
  yawDeg: number; // -90..+90
  pitchDeg: number; // -90..+90
  rollDeg: number; // -90..+90
  movementSpeed: number; // deg/sec
  isRapidTurn: boolean;
  stabilityScore: number; // 0..100
}

export interface LookingAwayState {
  isLookingAway: boolean;
  currentAwayDurationMs: number;
  totalAwayDurationMs: number;
  awayFrequencyCount: number;
  explanation: string; // e.g. "Reading question prompt", "Thinking", "Checking surroundings"
}

export interface AttentionTimelineItem {
  id: string;
  timestamp: string;
  type: string;
  zone: GazeZone;
  headOrientation: HeadOrientation;
  durationMs: number;
  explanation: string;
}

export interface AttentionEvent {
  id: string;
  timestamp: string;
  module: 'EyeTracker' | 'BlinkDetector' | 'GazeEstimator' | 'HeadPoseEstimator' | 'LookingAwayMonitor' | 'HeadMovementAnalyzer';
  type:
    | 'BlinkDetected'
    | 'LongEyeClosure'
    | 'LookingLeft'
    | 'LookingRight'
    | 'LookingUp'
    | 'LookingDown'
    | 'LookingCenter'
    | 'LookingAwayStarted'
    | 'LookingAwayEnded'
    | 'LongLookingAway'
    | 'HeadTurnLeft'
    | 'HeadTurnRight'
    | 'HeadUp'
    | 'HeadDown'
    | 'RapidHeadMovement';
  severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: 'Low' | 'Medium' | 'High';
  explanation: string;
  limitations: string;
  duration?: number;
  details: Record<string, any>;
}

export interface AttentionState {
  isEngineActive: boolean;
  status: AttentionStatus;
  eyeState: EyeStateData;
  gaze: GazeData;
  headPose: HeadPoseData;
  lookingAway: LookingAwayState;
  timeline: AttentionTimelineItem[];
  events: AttentionEvent[];
  trackingConfidence: 'Low' | 'Medium' | 'High';
}
