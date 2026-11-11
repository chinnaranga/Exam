import { describe, it, expect } from 'vitest';
import { audioService } from '../services/audio.service';
import { voiceActivityService } from '../services/voiceActivity.service';
import { noiseAnalysisService } from '../services/noiseAnalysis.service';

describe('Module 6: Enterprise Audio Monitoring Engine Test Suite', () => {
  it('1. should analyze audio levels and return RMS input level and noise floor', () => {
    const levels = audioService.analyzeAudioLevels(null);
    expect(levels.inputLevel).toBeGreaterThan(0);
    expect(levels.peakLevel).toBeGreaterThan(0);
    expect(levels.noiseFloor).toBeGreaterThan(0);
  });

  it('2. should classify Voice Activity Detection (VAD) and track duration', () => {
    const initialState = {
      isVoiceDetected: false,
      currentVoiceDurationMs: 0,
      totalVoiceDurationMs: 0,
      voiceEventCount: 0,
      confidence: 90,
    };

    const res = voiceActivityService.analyzeVoiceActivity(0.3, 1000, initialState);
    expect(res.isVoiceDetected).toBe(true);
    expect(res.currentVoiceDurationMs).toBe(1000);
    expect(res.voiceEventCount).toBe(1);
  });

  it('3. should analyze background noise and classify acoustic sound types', () => {
    const noise = noiseAnalysisService.analyzeBackgroundNoise(0.45, 0.05);
    expect(noise.category).toBe('Moderate');
    expect(noise.soundType).toBe('Speech-like Activity');
    expect(noise.noiseLevelDb).toBeGreaterThan(-60);
  });

  it('4. should generate structured audio telemetry events with privacy explanations & limitations', () => {
    const evt = audioService.createAudioEvent(
      'VoiceActivity',
      'LongVoiceActivity',
      'Medium',
      'High',
      'Voice activity was detected continuously for approximately 12 seconds.',
      'Voice activity detection does not identify speakers or recognize spoken content.',
      12000,
      { audioLevel: 0.71, noiseFloor: 0.18 }
    );

    expect(evt.module).toBe('VoiceActivity');
    expect(evt.type).toBe('LongVoiceActivity');
    expect(evt.duration).toBe(12000);
    expect(evt.explanation).toContain('Voice activity was detected');
    expect(evt.limitations).toContain('does not identify speakers');
  });
});
