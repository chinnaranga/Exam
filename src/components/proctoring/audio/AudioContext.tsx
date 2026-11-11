import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AudioEvent,
  AudioLevelData,
  AudioPolicyConfig,
  AudioState,
  BackgroundNoiseState,
  VoiceActivityState,
} from './types/audio.types';
import { DEFAULT_AUDIO_POLICY } from './constants/audio.constants';
import { audioService } from './services/audio.service';
import { voiceActivityService } from './services/voiceActivity.service';
import { noiseAnalysisService } from './services/noiseAnalysis.service';
import { useMicrophone } from './hooks/useMicrophone';

export interface AudioContextValue extends AudioState {
  startEngine: () => void;
  stopEngine: () => void;
  selectMicrophone: (deviceId: string) => void;
  requestPermission: () => Promise<boolean>;
  updatePolicyConfig: (newConfig: Partial<AudioPolicyConfig>) => void;
  emitEvent: (
    module: AudioEvent['module'],
    type: AudioEvent['type'],
    severity: AudioEvent['severity'],
    confidence: AudioEvent['confidence'],
    explanation: string,
    limitations: string,
    duration?: number,
    details?: Record<string, any>
  ) => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export interface AudioProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
  initialPolicy?: Partial<AudioPolicyConfig>;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children, autoStart = true, initialPolicy }) => {
  const [isEngineActive, setIsEngineActive] = useState<boolean>(autoStart);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>('default');
  const [events, setEvents] = useState<AudioEvent[]>([]);
  const [policyConfig, setPolicyConfig] = useState<AudioPolicyConfig>({
    ...DEFAULT_AUDIO_POLICY,
    ...initialPolicy,
  });

  const { permission, devices, requestPermission } = useMicrophone(selectedDeviceId);

  const [audioLevel, setAudioLevel] = useState<AudioLevelData>({
    inputLevel: 0.08,
    peakLevel: 0.15,
    averageLevel: 0.06,
    silenceDurationMs: 0,
    noiseFloor: 0.04,
  });

  const [voiceActivity, setVoiceActivity] = useState<VoiceActivityState>({
    isVoiceDetected: false,
    currentVoiceDurationMs: 0,
    totalVoiceDurationMs: 0,
    voiceEventCount: 0,
    confidence: 90,
  });

  const [backgroundNoise, setBackgroundNoise] = useState<BackgroundNoiseState>({
    category: 'Quiet',
    soundType: 'General Environmental Noise',
    noiseLevelDb: -52,
    isSpike: false,
  });

  const health = audioService.evaluateAudioHealth(null);

  // Periodic sampling loop
  useEffect(() => {
    if (!isEngineActive) return;

    const interval = setInterval(() => {
      const levels = audioService.analyzeAudioLevels(null);
      setAudioLevel(levels);

      setVoiceActivity((prev) => voiceActivityService.analyzeVoiceActivity(levels.inputLevel, 1000, prev));

      const noise = noiseAnalysisService.analyzeBackgroundNoise(levels.inputLevel, levels.noiseFloor);
      setBackgroundNoise(noise);
    }, 1000);

    return () => clearInterval(interval);
  }, [isEngineActive]);

  const updatePolicyConfig = (newConfig: Partial<AudioPolicyConfig>) => {
    setPolicyConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const emitEvent = (
    module: AudioEvent['module'],
    type: AudioEvent['type'],
    severity: AudioEvent['severity'],
    confidence: AudioEvent['confidence'],
    explanation: string,
    limitations: string,
    duration?: number,
    details: Record<string, any> = {}
  ) => {
    const evt = audioService.createAudioEvent(module, type, severity, confidence, explanation, limitations, duration, details);
    setEvents((prev) => [evt, ...prev.slice(0, 49)]);
  };

  const value: AudioContextValue = {
    isEngineActive,
    permission,
    selectedDeviceId,
    availableDevices: devices,
    audioLevel,
    voiceActivity,
    backgroundNoise,
    health,
    events,
    policyConfig,
    startEngine: () => setIsEngineActive(true),
    stopEngine: () => setIsEngineActive(false),
    selectMicrophone: (id) => setSelectedDeviceId(id),
    requestPermission,
    updatePolicyConfig,
    emitEvent,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};
