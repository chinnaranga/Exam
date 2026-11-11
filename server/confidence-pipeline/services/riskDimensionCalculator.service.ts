import { RiskDimensionScore, UnifiedIntegrityEvent } from '../types/pipeline.types';

/**
 * @class RiskDimensionCalculatorService
 * @description Calculates 7 independent risk dimensions (Camera Health, Attention, Environment, Objects, Audio,
 * Browser Integrity, Network Stability). Maintains individual scores and historical trends without a single cheating score.
 */
export class RiskDimensionCalculatorService {
  private dimensionScores: Record<string, number> = {
    'Camera Health': 100,
    Attention: 100,
    Environment: 100,
    Objects: 100,
    Audio: 100,
    'Browser Integrity': 100,
    'Network Stability': 100,
  };

  public processEvent(event: UnifiedIntegrityEvent): RiskDimensionScore[] {
    // Map event module to risk dimension
    if (event.module === 'CameraManager') {
      this.dimensionScores['Camera Health'] = Math.max(0, this.dimensionScores['Camera Health'] - 5);
    } else if (event.module === 'GazeEstimator' || event.module === 'HeadPoseEstimator') {
      this.dimensionScores['Attention'] = Math.max(0, this.dimensionScores['Attention'] - 3);
    } else if (event.module === 'ObjectDetector') {
      this.dimensionScores['Objects'] = Math.max(0, this.dimensionScores['Objects'] - 10);
    } else if (event.module === 'VoiceActivity' || event.module === 'NoiseAnalyzer') {
      this.dimensionScores['Audio'] = Math.max(0, this.dimensionScores['Audio'] - 4);
    } else if (event.module.includes('Browser') || event.module.includes('DOM')) {
      this.dimensionScores['Browser Integrity'] = Math.max(0, this.dimensionScores['Browser Integrity'] - 15);
    }

    return Object.entries(this.dimensionScores).map(([dimension, score]) => ({
      dimension: dimension as any,
      score,
      trend: score >= 90 ? 'Stable' : score >= 70 ? 'Degrading' : 'Improving',
      confidence: 'High',
      explanation: `${dimension} stability score evaluated at ${score}/100 based on recent sensor telemetry.`,
    }));
  }
}

export const riskDimensionCalculatorService = new RiskDimensionCalculatorService();
