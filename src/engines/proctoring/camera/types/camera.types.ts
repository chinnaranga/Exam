export type CameraPermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export type CameraConnectionState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting' | 'error';

export type CameraVerificationStatus = 'passed' | 'warning' | 'failed' | 'pending';

export type FacingMode = 'user' | 'environment' | 'unknown';

export interface CameraDevice {
  deviceId: string;
  label: string;
  groupId: string;
  kind: MediaDeviceKind;
  facingMode: FacingMode;
  isVirtual?: boolean;
}

export interface CameraResolution {
  width: number;
  height: number;
  aspectRatio: number;
  fps: number;
}

export interface CameraHealth {
  isActive: boolean;
  isTrackEnabled: boolean;
  isTrackMuted: boolean;
  hasTrackEnded: boolean;
  fpsEstimate: number;
  droppedFramesCount: number;
  reconnectAttempts: number;
  brightnessScore: number; // 0..100
  lastChecked: string;
}

export interface CameraVerificationResult {
  status: CameraVerificationStatus;
  isAvailable: boolean;
  isStreamActive: boolean;
  isResolutionAcceptable: boolean;
  isFrameRateAcceptable: boolean;
  isBrightnessAcceptable: boolean;
  isConnectionStable: boolean;
  score: number; // 0..100
  issues: string[];
  verifiedAt: string;
}

export interface CameraEvent {
  id: string;
  timestamp: string;
  module: 'CameraManager';
  type: 'CameraConnected' | 'CameraDisconnected' | 'CameraError' | 'PermissionRevoked' | 'StreamStarted' | 'StreamStopped' | 'CameraSwitched' | 'HealthDegraded';
  severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: 'Low' | 'Medium' | 'High';
  details: {
    deviceId?: string;
    label?: string;
    reason?: string;
    resolution?: string;
    fps?: number;
    errorName?: string;
    [key: string]: any;
  };
}

export interface CameraState {
  permission: CameraPermissionState;
  connection: CameraConnectionState;
  selectedDeviceId: string | null;
  availableDevices: CameraDevice[];
  currentResolution: CameraResolution | null;
  health: CameraHealth;
  verification: CameraVerificationResult | null;
  isMirrored: boolean;
  isFullscreen: boolean;
  isStreaming: boolean;
  error: string | null;
}
