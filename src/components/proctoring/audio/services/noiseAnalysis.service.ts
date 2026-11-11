import { BackgroundNoiseState, EnvironmentalSoundType, NoiseEnvironmentCategory } from '../types/audio.types';

/**
 * @class NoiseAnalysisService
 * @description Background Noise Analyzer classifying environmental noise levels (Quiet, Moderate, High)
 * and environmental sound heuristics (keyboard typing, ambient noise, speech-like activity).
 */
export class NoiseAnalysisService {
  /**
   * Classify environmental noise category and sound type.
   */
  public analyzeBackgroundNoise(inputLevel: number, noiseFloor: number): BackgroundNoiseState {
    let category: NoiseEnvironmentCategory = 'Quiet';
    if (inputLevel > 0.6) category = 'High';
    else if (inputLevel > 0.35) category = 'Moderate';
    else if (inputLevel > 0.2) category = 'Intermittent';

    let soundType: EnvironmentalSoundType = 'General Environmental Noise';
    if (inputLevel > 0.4) soundType = 'Speech-like Activity';
    else if (inputLevel > 0.25) soundType = 'Keyboard Typing';

    const noiseLevelDb = Math.round(-60 + inputLevel * 60);
    const isSpike = inputLevel > 0.5;

    return {
      category,
      soundType,
      noiseLevelDb,
      isSpike,
    };
  }
}

export const noiseAnalysisService = new NoiseAnalysisService();
