import {
  IntegrityAnalyticsReport,
  SignalEffectivenessMetric,
  WeightTuningRecommendation,
} from './analyticsTypes';
import { HumanReviewQueueService, humanReviewQueueService, ReviewDecision } from '../integrity/HumanReviewQueueService';

export interface CandidateSessionIntegrityData {
  sessionId: string;
  candidateId: string;
  examId: string;
  integrityConfidenceScore: number; // 0 to 100
  violationPoints: number;
  signalsTriggered: Array<{
    type: string;
    points: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    timestamp: number;
  }>;
  reviewDecision?: ReviewDecision | null;
}

export class IntegrityAnalyticsEngine {
  private reviewQueue: HumanReviewQueueService;

  constructor(reviewQueue: HumanReviewQueueService = humanReviewQueueService) {
    this.reviewQueue = reviewQueue;
  }

  /**
   * Generates comprehensive Integrity Analytics Report for an exam.
   */
  public generateIntegrityReport(
    examId: string,
    sessions: CandidateSessionIntegrityData[]
  ): IntegrityAnalyticsReport {
    const totalSessions = sessions.length;
    if (totalSessions === 0) {
      return {
        examId,
        totalSessions: 0,
        averageIntegrityScore: 100,
        scoreDistribution: [],
        totalFlaggedSessions: 0,
        reviewBacklogCount: 0,
        resolvedCasesCount: 0,
        globalFalsePositiveRate: 0,
        globalUpheldRate: 0,
        signalEffectiveness: [],
        weightTuningRecommendations: [],
      };
    }

    // 1. Average Integrity Score & Score Distribution
    const scores = sessions.map((s) => s.integrityConfidenceScore);
    const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / totalSessions) * 10) / 10;

    const distributionRanges = [
      { range: '0-20% (Critical Risk)', min: 0, max: 20 },
      { range: '21-40% (Suspicious)', min: 21, max: 40 },
      { range: '41-60% (Elevated Risk)', min: 41, max: 60 },
      { range: '61-80% (Acceptable)', min: 61, max: 80 },
      { range: '81-100% (High Confidence)', min: 81, max: 100 },
    ];

    const scoreDistribution = distributionRanges.map((r) => {
      const count = scores.filter((sc) => sc >= r.min && sc <= r.max).length;
      return {
        range: r.range,
        count,
        percentage: Math.round((count / totalSessions) * 1000) / 10,
      };
    });

    // 2. Human Review Decisions & False Positive Rate
    // Cross-reference with reviewQueue service if not already attached on session
    let resolvedCount = 0;
    let clearCount = 0;
    let upheldCount = 0;
    let flaggedCount = 0;

    for (const s of sessions) {
      const queueItem = this.reviewQueue.getSessionItem(s.sessionId);
      const decision = s.reviewDecision ?? queueItem?.decision;
      if (s.violationPoints > 0 || (queueItem && queueItem.status !== 'RESOLVED')) {
        flaggedCount++;
      }

      if (decision) {
        resolvedCount++;
        if (decision === 'CLEAR') {
          clearCount++;
        } else if (decision === 'WARN' || decision === 'INVALIDATE') {
          upheldCount++;
        }
      }
    }

    const reviewBacklogCount = Math.max(0, flaggedCount - resolvedCount);
    const globalFalsePositiveRate =
      resolvedCount > 0 ? Math.round((clearCount / resolvedCount) * 1000) / 1000 : 0;
    const globalUpheldRate =
      resolvedCount > 0 ? Math.round((upheldCount / resolvedCount) * 1000) / 1000 : 0;

    // 3. Proctoring Signal Effectiveness Ranking
    const signalMap = new Map<
      string,
      {
        severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        points: number;
        total: number;
        upheld: number;
        cleared: number;
      }
    >();

    for (const s of sessions) {
      const queueItem = this.reviewQueue.getSessionItem(s.sessionId);
      const decision = s.reviewDecision ?? queueItem?.decision;

      for (const sig of s.signalsTriggered) {
        let entry = signalMap.get(sig.type);
        if (!entry) {
          entry = {
            severity: sig.severity,
            points: sig.points,
            total: 0,
            upheld: 0,
            cleared: 0,
          };
          signalMap.set(sig.type, entry);
        }
        entry.total++;

        if (decision === 'CLEAR') {
          entry.cleared++;
        } else if (decision === 'WARN' || decision === 'INVALIDATE') {
          entry.upheld++;
        }
      }
    }

    const signalEffectiveness: SignalEffectivenessMetric[] = [];
    const tuningRecommendations: WeightTuningRecommendation[] = [];

    for (const [sigType, data] of signalMap.entries()) {
      const reviewed = data.upheld + data.cleared;
      const upheldRate = reviewed > 0 ? Math.round((data.upheld / reviewed) * 1000) / 1000 : 0.8;
      const falsePositiveRate = reviewed > 0 ? Math.round((data.cleared / reviewed) * 1000) / 1000 : 0.2;

      let reliabilityGrade: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' = 'GOOD';
      if (upheldRate >= 0.85) reliabilityGrade = 'EXCELLENT';
      else if (upheldRate >= 0.70) reliabilityGrade = 'GOOD';
      else if (upheldRate >= 0.50) reliabilityGrade = 'FAIR';
      else reliabilityGrade = 'POOR';

      signalEffectiveness.push({
        signalType: sigType,
        currentSeverity: data.severity,
        currentPoints: data.points,
        totalTriggered: data.total,
        upheldCount: data.upheld,
        clearedCount: data.cleared,
        upheldRate,
        falsePositiveRate,
        reliabilityGrade,
      });

      // 4. Weight Tuning Recommendations
      if (reviewed >= 3) {
        if (falsePositiveRate >= 0.55 && data.points >= 2) {
          // Recommend decreasing points to reduce false alarm friction
          const recommendedPoints = Math.max(1, data.points - 1);
          const recommendedSeverity = recommendedPoints === 1 ? 'LOW' : 'MEDIUM';
          tuningRecommendations.push({
            signalType: sigType,
            currentPoints: data.points,
            recommendedPoints,
            currentSeverity: data.severity,
            recommendedSeverity,
            action: 'DECREASE',
            reason: `High false-positive rate (${(falsePositiveRate * 100).toFixed(0)}%). Reviewers cleared most occurrences. Reducing weight prevents unfair locks.`,
          });
        } else if (upheldRate >= 0.90 && data.points <= 2 && data.severity !== 'CRITICAL') {
          // High fidelity signal, can be upgraded
          const recommendedPoints = data.points + 1;
          const recommendedSeverity = recommendedPoints >= 3 ? 'HIGH' : 'MEDIUM';
          tuningRecommendations.push({
            signalType: sigType,
            currentPoints: data.points,
            recommendedPoints,
            currentSeverity: data.severity,
            recommendedSeverity,
            action: 'INCREASE',
            reason: `Consistently verified cheating signal (${(upheldRate * 100).toFixed(0)}% upheld). Increasing weight expedites proctor intervention.`,
          });
        }
      }
    }

    // Sort signals by totalTriggered descending
    signalEffectiveness.sort((a, b) => b.totalTriggered - a.totalTriggered);

    return {
      examId,
      totalSessions,
      averageIntegrityScore: avgScore,
      scoreDistribution,
      totalFlaggedSessions: flaggedCount,
      reviewBacklogCount,
      resolvedCasesCount: resolvedCount,
      globalFalsePositiveRate,
      globalUpheldRate,
      signalEffectiveness,
      weightTuningRecommendations: tuningRecommendations,
    };
  }
}

export const integrityAnalyticsEngine = new IntegrityAnalyticsEngine();

