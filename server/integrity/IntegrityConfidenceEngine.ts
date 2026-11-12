import { ViolationSessionState } from './ViolationEngine';

export interface IntegrityScoreInput {
  sessionId: string;
  candidateId?: string;
  examId?: string;
  violationPoints: number; // 0 to 8+ points from ViolationEngine
  gazeVariance?: number; // 0.0 (perfectly centered) to 1.0 (extreme wandering)
  pasteRatio?: number; // 0.0 (all typed) to 1.0 (all pasted)
  responseTimeAnomaliesCount?: number; // count of sub-3s complex answers
  totalQuestionsAnswered?: number;
}

export interface IntegrityConfidenceBreakdown {
  sessionId: string;
  integrityConfidenceScore: number; // 0 to 100%
  rating: 'EXCELLENT' | 'ACCEPTABLE' | 'SUSPICIOUS' | 'CRITICAL';
  subScores: {
    violationScore: number; // 0-100
    gazeStabilityScore: number; // 0-100
    typingAuthenticityScore: number; // 0-100 (100 - paste penalty)
    responseCadenceScore: number; // 0-100
  };
  weights: {
    violations: number; // e.g. 0.40
    gaze: number; // e.g. 0.20
    typing: number; // e.g. 0.20
    responseCadence: number; // e.g. 0.20
  };
  deductions: Array<{
    factor: string;
    pointsLost: number;
    explanation: string;
  }>;
  evaluatedAt: number;
}

/**
 * @class IntegrityConfidenceEngine
 * @description Master Layer 5 engine that computes an explainable 0–100% Integrity Confidence Score
 * combining weighted violation points, gaze variance, paste ratio, and response-time anomalies.
 */
export class IntegrityConfidenceEngine {
  private static readonly DEFAULT_WEIGHTS = {
    violations: 0.40,
    gaze: 0.20,
    typing: 0.20,
    responseCadence: 0.20,
  };

  /**
   * Computes the 0–100% Integrity Confidence Score with granular deductions.
   */
  public calculateConfidenceScore(input: IntegrityScoreInput): IntegrityConfidenceBreakdown {
    const deductions: Array<{ factor: string; pointsLost: number; explanation: string }> = [];

    // 1. Violation Points Sub-Score (0 to 100)
    // 0 points = 100%, 4 points = 50%, 8+ points = 0%
    const rawViolationScore = Math.max(0, 100 - (input.violationPoints / 8) * 100);
    const violationScore = Math.round(rawViolationScore);
    if (input.violationPoints > 0) {
      const lost = Math.round((input.violationPoints / 8) * 100 * IntegrityConfidenceEngine.DEFAULT_WEIGHTS.violations);
      deductions.push({
        factor: 'VIOLATION_POINTS',
        pointsLost: lost,
        explanation: `${input.violationPoints} violation point(s) recorded in session authority ledger.`,
      });
    }

    // 2. Gaze Variance Sub-Score (0 to 100)
    // Gaze variance: normal reading drift up to 0.10 is 100% centered, 0.5 -> 50%, 1.0 (extreme off-screen) -> 0%
    const gazeVar = Math.max(0, Math.min(1.0, input.gazeVariance ?? 0.0));
    const gazeStabilityScore = gazeVar <= 0.10 ? 100 : Math.round(Math.max(0, (1.0 - gazeVar) * 100));
    if (gazeVar > 0.25) {
      const lost = Math.round((gazeVar * 100) * IntegrityConfidenceEngine.DEFAULT_WEIGHTS.gaze);
      deductions.push({
        factor: 'GAZE_VARIANCE',
        pointsLost: lost,
        explanation: `Off-screen gaze variance of ${(gazeVar * 100).toFixed(1)}% exceeded normal reading threshold.`,
      });
    }

    // 3. Paste Ratio / Typing Authenticity Sub-Score (0 to 100)
    // Paste ratio: 0.0 (all typed) -> 100%, > 0.5 (heavy paste) -> score drops rapidly
    const paste = Math.max(0, Math.min(1.0, input.pasteRatio ?? 0.0));
    let typingAuthenticityScore = 100;
    if (paste > 0.10) {
      // Normal minor paste (e.g. calculator or snippet) allowed up to 10%
      const excessPaste = paste - 0.10;
      typingAuthenticityScore = Math.max(0, Math.round(100 - (excessPaste / 0.90) * 100));
      const lost = Math.round(((100 - typingAuthenticityScore) * IntegrityConfidenceEngine.DEFAULT_WEIGHTS.typing));
      deductions.push({
        factor: 'PASTE_RATIO',
        pointsLost: lost,
        explanation: `${(paste * 100).toFixed(1)}% of response text was pasted rather than typed.`,
      });
    }

    // 4. Response-Time Anomalies Sub-Score (0 to 100)
    // Complex answers completed in <3 seconds
    const anomalies = input.responseTimeAnomaliesCount ?? 0;
    const totalAns = Math.max(1, input.totalQuestionsAnswered ?? 10);
    const anomalyRate = Math.min(1.0, anomalies / totalAns);
    const responseCadenceScore = Math.max(0, Math.round(100 - (anomalyRate * 120)));
    if (anomalies > 0) {
      const lost = Math.round((100 - responseCadenceScore) * IntegrityConfidenceEngine.DEFAULT_WEIGHTS.responseCadence);
      deductions.push({
        factor: 'RESPONSE_TIME_ANOMALY',
        pointsLost: lost,
        explanation: `${anomalies} question(s) were submitted in under 3 seconds (abnormal response speed).`,
      });
    }

    // Weighted Overall Score
    const weights = IntegrityConfidenceEngine.DEFAULT_WEIGHTS;
    let finalScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          violationScore * weights.violations +
          gazeStabilityScore * weights.gaze +
          typingAuthenticityScore * weights.typing +
          responseCadenceScore * weights.responseCadence
        )
      )
    );

    // If violation points reached terminal threshold (8+ points), score is capped at CRITICAL (<40)
    if (input.violationPoints >= 8) {
      finalScore = Math.min(finalScore, 35);
    }

    // Rating
    let rating: 'EXCELLENT' | 'ACCEPTABLE' | 'SUSPICIOUS' | 'CRITICAL';
    if (finalScore >= 85) {
      rating = 'EXCELLENT';
    } else if (finalScore >= 65) {
      rating = 'ACCEPTABLE';
    } else if (finalScore >= 40) {
      rating = 'SUSPICIOUS';
    } else {
      rating = 'CRITICAL';
    }

    return {
      sessionId: input.sessionId,
      integrityConfidenceScore: finalScore,
      rating,
      subScores: {
        violationScore,
        gazeStabilityScore,
        typingAuthenticityScore,
        responseCadenceScore,
      },
      weights,
      deductions,
      evaluatedAt: Date.now(),
    };
  }
}

export const integrityConfidenceEngine = new IntegrityConfidenceEngine();
