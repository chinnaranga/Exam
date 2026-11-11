export type AudioPermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export type NoiseEnvironmentCategory = 'Quiet' | 'Moderate' | 'High' | 'Intermittent' | 'Continuous';

export type EnvironmentalSoundType =
  | 'General Environmental Noise'
  | 'Speech-like Activity'
  | 'Television-like Audio'
  | 'Music-like Audio'
  | 'Keyboard Typing'
  | 'Door Sounds';

export type AudioQualityRating = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface AudioDevice {
  deviceId: string;
  label: string;
  groupId: string;
  kind: MediaDeviceKind;
  isDefault?: boolean;
}

export interface AudioLevelData {
  inputLevel: number; // 0..1 (RMS)
  peakLevel: number; // 0..1
  averageLevel: number; // 0..1
  silenceDurationMs: number;
  noiseFloor: number; // 0..1
}

export interface VoiceActivityState {
  isVoiceDetected: boolean;
  currentVoiceDurationMs: number;
  totalVoiceDurationMs: number;
  voiceEventCount: number;
  confidence: number; // 0..100
}

export interface BackgroundNoiseState {
  category: NoiseEnvironmentCategory;
  soundType: EnvironmentalSoundType;
  noiseLevelDb: number; // e.g. -45 dB
  isSpike: boolean;
}

export interface AudioHealthData {
  isMicrophoneActive: boolean;
  isTrackMuted: boolean;
  hasTrackEnded: boolean;
  isClipping: boolean;
  qualityRating: AudioQualityRating;
  reconnectAttempts: number;
  healthScore: number; // 0..100
}

export interface AudioPolicyConfig {
  microphoneRequired: boolean;
  backgroundMonitoringEnabled: boolean;
  voiceActivityMonitoringEnabled: boolean;
  noiseThreshold: number; // 0..1
  maxVoiceDurationAlertMs: number; // e.g. 10000ms
}

export interface AudioEvent {
  id: string;
  timestamp: string;
  module: 'MicrophoneManager' | 'VoiceActivity' | 'NoiseAnalyzer' | 'AudioHealth';
  type:
    | 'MicrophoneConnected'
    | 'MicrophoneDisconnected'
    | 'PermissionRevoked'
    | 'VoiceActivityStarted'
    | 'VoiceActivityStopped'
    | 'LongVoiceActivity'
    | 'BackgroundNoiseIncreased'
    | 'AudioClippingDetected';
  severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: 'Low' | 'Medium' | 'High';
  explanation: string;
  limitations: string;
  duration?: number;
  details: Record<string, any>;
}

export interface AudioState {
  isEngineActive: boolean;
  permission: AudioPermissionState;
  selectedDeviceId: string | null;
  availableDevices: AudioDevice[];
  audioLevel: AudioLevelData;
  voiceActivity: VoiceActivityState;
  backgroundNoise: BackgroundNoiseState;
  health: AudioHealthData;
  events: AudioEvent[];
  policyConfig: AudioPolicyConfig;
}
