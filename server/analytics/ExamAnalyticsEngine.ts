import {
  ExamAnalyticsReport,
  ScoreDistribution,
  QuestionTimeMetric,
  CompletionFunnelStep,
  ViolationHeatmapCell,
} from './analyticsTypes';

export interface CandidateExamSessionData {
  sessionId: string;
  candidateId: string;
  examId: string;
  examTitle: string;
  status: 'SUBMITTED' | 'TERMINATED' | 'ABANDONED' | 'TIMED_OUT' | 'IN_PROGRESS';
  startedAt: number;
  submittedAt?: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  questionTimes: Array<{
    questionId: string;
    prompt?: string;
    timeSpentSeconds: number;
    answered: boolean;
  }>;
  reachedQuestionIndex: number;
  violations: Array<{
    type: string;
    timestamp: number;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>;
}

export class ExamAnalyticsEngine {
  private static readonly PASSING_PERCENTAGE = 60.0;

  /**
   * Generates a comprehensive ExamAnalyticsReport from all candidate sessions.
   */
  public generateExamReport(
    examId: string,
    examTitle: string,
    sessions: CandidateExamSessionData[],
    allQuestions: Array<{ id: string; prompt: string }> = []
  ): ExamAnalyticsReport {
    const totalEnrollments = sessions.length;
    if (totalEnrollments === 0) {
      return {
        examId,
        examTitle,
        totalEnrollments: 0,
        completedCount: 0,
        abandonedCount: 0,
        completionRate: 0,
        averageDurationMinutes: 0,
        scoreDistribution: this.emptyScoreDistribution(),
        questionTimeMetrics: [],
        dropOffFunnel: [],
        violationHeatmap: [],
      };
    }

    const completedSessions = sessions.filter(
      (s) => s.status === 'SUBMITTED' || s.status === 'TIMED_OUT'
    );
    const abandonedSessions = sessions.filter(
      (s) => s.status === 'ABANDONED' || s.status === 'TERMINATED'
    );
    const completedCount = completedSessions.length;
    const abandonedCount = abandonedSessions.length;
    const completionRate = Math.round((completedCount / totalEnrollments) * 1000) / 10;

    // Average duration of completed exams
    let totalDurationSeconds = 0;
    let durationCount = 0;
    for (const s of completedSessions) {
      if (s.submittedAt && s.startedAt && s.submittedAt > s.startedAt) {
        totalDurationSeconds += (s.submittedAt - s.startedAt) / 1000;
        durationCount++;
      }
    }
    const averageDurationMinutes =
      durationCount > 0 ? Math.round((totalDurationSeconds / durationCount / 60) * 10) / 10 : 0;

    // 1. Score Distribution
    const scoreDistribution = this.computeScoreDistribution(completedSessions);

    // 2. Question Time Metrics
    const questionTimeMetrics = this.computeQuestionTimes(sessions, allQuestions);

    // 3. Drop-off Funnel
    const dropOffFunnel = this.computeDropOffFunnel(sessions, allQuestions);

    // 4. Violation Heatmap (by time bucket and type)
    const violationHeatmap = this.computeViolationHeatmap(sessions);

    return {
      examId,
      examTitle,
      totalEnrollments,
      completedCount,
      abandonedCount,
      completionRate,
      averageDurationMinutes,
      scoreDistribution,
      questionTimeMetrics,
      dropOffFunnel,
      violationHeatmap,
    };
  }

  /**
   * Computes score statistics: Mean, Median, StdDev, Variance, Min, Max, Quartiles, and Decile Histogram.
   */
  public computeScoreDistribution(sessions: CandidateExamSessionData[]): ScoreDistribution {
    if (sessions.length === 0) {
      return this.emptyScoreDistribution();
    }

    const percentages = sessions.map((s) => s.percentage).sort((a, b) => a - b);
    const total = percentages.length;
    const mean = percentages.reduce((sum, v) => sum + v, 0) / total;

    // Median
    const mid = Math.floor(total / 2);
    const median = total % 2 !== 0 ? percentages[mid] : (percentages[mid - 1] + percentages[mid]) / 2;

    // Quartiles
    const q1Index = Math.floor(total * 0.25);
    const q3Index = Math.floor(total * 0.75);
    const q1 = percentages[q1Index];
    const q3 = percentages[q3Index];

    // Variance and StdDev
    const variance = percentages.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / total;
    const standardDeviation = Math.sqrt(variance);

    // Pass rate
    const passCount = percentages.filter((p) => p >= ExamAnalyticsEngine.PASSING_PERCENTAGE).length;
    const passRate = Math.round((passCount / total) * 1000) / 10;

    // 10 Decile Histogram Buckets: [0-10%, 11-20%, ..., 91-100%]
    const histogram: Array<{ bucketLabel: string; min: number; max: number; count: number; percentage: number }> = [];
    for (let i = 0; i < 10; i++) {
      const min = i * 10;
      const max = (i + 1) * 10;
      const bucketLabel = `${min}% - ${max}%`;
      // Inclusive of 100 in the last bucket
      const inBucket = percentages.filter((p) => (i === 9 ? p >= min && p <= max : p >= min && p < max));
      histogram.push({
        bucketLabel,
        min,
        max,
        count: inBucket.length,
        percentage: Math.round((inBucket.length / total) * 1000) / 10,
      });
    }

    return {
      totalCandidates: total,
      meanScore: Math.round(mean * 10) / 10,
      medianScore: Math.round(median * 10) / 10,
      standardDeviation: Math.round(standardDeviation * 10) / 10,
      variance: Math.round(variance * 10) / 10,
      minScore: Math.round(percentages[0] * 10) / 10,
      maxScore: Math.round(percentages[total - 1] * 10) / 10,
      quartiles: {
        q1: Math.round(q1 * 10) / 10,
        q2: Math.round(median * 10) / 10,
        q3: Math.round(q3 * 10) / 10,
      },
      passRate,
      histogram,
    };
  }

  /**
   * Computes per-question timing metrics (average, median, min, max).
   */
  private computeQuestionTimes(
    sessions: CandidateExamSessionData[],
    allQuestions: Array<{ id: string; prompt: string }>
  ): QuestionTimeMetric[] {
    const timeMap = new Map<string, { prompt: string; times: number[] }>();

    for (const q of allQuestions) {
      timeMap.set(q.id, { prompt: q.prompt, times: [] });
    }

    for (const s of sessions) {
      for (const qt of s.questionTimes) {
        let entry = timeMap.get(qt.questionId);
        if (!entry) {
          entry = { prompt: qt.prompt || `Question ${qt.questionId}`, times: [] };
          timeMap.set(qt.questionId, entry);
        }
        if (qt.timeSpentSeconds > 0) {
          entry.times.push(qt.timeSpentSeconds);
        }
      }
    }

    const metrics: QuestionTimeMetric[] = [];
    for (const [qId, entry] of timeMap.entries()) {
      const times = entry.times.sort((a, b) => a - b);
      if (times.length === 0) {
        metrics.push({
          questionId: qId,
          prompt: entry.prompt,
          averageTimeSeconds: 0,
          medianTimeSeconds: 0,
          minTimeSeconds: 0,
          maxTimeSeconds: 0,
          totalAttempts: 0,
        });
        continue;
      }

      const total = times.reduce((sum, t) => sum + t, 0);
      const avg = Math.round((total / times.length) * 10) / 10;
      const mid = Math.floor(times.length / 2);
      const median = times.length % 2 !== 0 ? times[mid] : (times[mid - 1] + times[mid]) / 2;

      metrics.push({
        questionId: qId,
        prompt: entry.prompt,
        averageTimeSeconds: avg,
        medianTimeSeconds: Math.round(median * 10) / 10,
        minTimeSeconds: times[0],
        maxTimeSeconds: times[times.length - 1],
        totalAttempts: times.length,
      });
    }

    return metrics;
  }

  /**
   * Computes drop-off points funnel showing where candidates stopped.
   */
  private computeDropOffFunnel(
    sessions: CandidateExamSessionData[],
    allQuestions: Array<{ id: string; prompt: string }>
  ): CompletionFunnelStep[] {
    const totalCount = sessions.length;
    const numSteps = Math.max(allQuestions.length, 5);
    const funnel: CompletionFunnelStep[] = [];

    for (let step = 0; step < numSteps; step++) {
      const label = allQuestions[step] ? `Q${step + 1}: ${allQuestions[step].prompt.substring(0, 30)}...` : `Question ${step + 1}`;
      // A candidate reached step if reachedQuestionIndex >= step
      const active = sessions.filter((s) => s.reachedQuestionIndex >= step).length;
      const droppedAtStep = sessions.filter((s) => s.reachedQuestionIndex === step && s.status !== 'SUBMITTED').length;
      const dropOffRate = active > 0 ? Math.round((droppedAtStep / active) * 1000) / 1000 : 0;

      funnel.push({
        stepIndex: step,
        label,
        activeCandidates: active,
        dropOffCount: droppedAtStep,
        dropOffRate,
      });
    }

    return funnel;
  }

  /**
   * Builds violation heatmap by 5-minute time buckets from session start.
   */
  private computeViolationHeatmap(sessions: CandidateExamSessionData[]): ViolationHeatmapCell[] {
    const buckets = [
      { label: '0-5 min', maxSec: 300 },
      { label: '5-10 min', maxSec: 600 },
      { label: '10-15 min', maxSec: 900 },
      { label: '15-20 min', maxSec: 1200 },
      { label: '20-30 min', maxSec: 1800 },
      { label: '30+ min', maxSec: Infinity },
    ];

    const heatmapMap = new Map<string, ViolationHeatmapCell>();

    for (const s of sessions) {
      const sessionStart = s.startedAt;
      for (const v of s.violations) {
        const offsetSec = Math.max(0, (v.timestamp - sessionStart) / 1000);
        let bucketIdx = buckets.findIndex((b) => offsetSec <= b.maxSec);
        if (bucketIdx === -1) bucketIdx = buckets.length - 1;
        const bucket = buckets[bucketIdx];

        const key = `${bucket.label}::${v.type}`;
        let cell = heatmapMap.get(key);
        if (!cell) {
          cell = {
            timeBucket: bucket.label,
            timeBucketIndex: bucketIdx,
            violationType: v.type,
            count: 0,
            severity: v.severity || 'MEDIUM',
          };
          heatmapMap.set(key, cell);
        }
        cell.count++;
      }
    }

    return Array.from(heatmapMap.values()).sort((a, b) => {
      const diff = a.timeBucketIndex - b.timeBucketIndex;
      return diff !== 0 ? diff : b.count - a.count;
    });
  }

  private emptyScoreDistribution(): ScoreDistribution {
    return {
      totalCandidates: 0,
      meanScore: 0,
      medianScore: 0,
      standardDeviation: 0,
      variance: 0,
      minScore: 0,
      maxScore: 0,
      quartiles: { q1: 0, q2: 0, q3: 0 },
      passRate: 0,
      histogram: [],
    };
  }
}

export const examAnalyticsEngine = new ExamAnalyticsEngine();

