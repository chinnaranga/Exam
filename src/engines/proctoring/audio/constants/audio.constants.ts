import { AudioPolicyConfig } from '../types/audio.types';

export const DEFAULT_AUDIO_POLICY: AudioPolicyConfig = {
  microphoneRequired: true,
  backgroundMonitoringEnabled: true,
  voiceActivityMonitoringEnabled: true,
  noiseThreshold: 0.35,
  maxVoiceDurationAlertMs: 10000,
};

export const AUDIO_LIMITATIONS_EXPLANATIONS = {
  VAD_NO_CONTENT: 'Voice Activity Detection (VAD) monitors acoustic energy thresholds; it does not transcribe speech or identify individual speakers.',
  MICROPHONE_HARDWARE: 'Microphone frequency response and hardware gain AGC vary significantly across built-in, USB, and Bluetooth headsets.',
  ENVIRONMENTAL_ACOUSTICS: 'Room reverberation and background HVAC noise affect acoustic noise floor measurements.',
};

export const PRIVACY_GUARANTEE_NOTICE =
  'Privacy Assurance: AssessIQ processes audio spectral energy in real-time in memory. No continuous raw audio recordings or transcriptions are stored or uploaded.';
