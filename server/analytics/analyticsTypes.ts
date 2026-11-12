/**
 * AssessIQ Analytics & Reporting Platform Types
 * Covers: Exam Analytics, Item Analysis (Psychometrics), Integrity Analytics,
 * Candidate Scorecards with Release Rules, Bias Monitoring, and Scheduled Reporting.
 */

export type ItemQualityFlag =
  | 'TOO_EASY'
  | 'TOO_HARD'
  | 'POSSIBLY_MISKEYED'
  | 'POOR_DISCRIMINATION'
  | 'NON_FUNCTIONING_DISTRACTOR'
  | 'AMBIGUOUS_DISTRACTOR';

export interface DistractorStat {
  optionId: string;
  text: string;
  isCorrect: boolean;
  totalSelected: number;
  selectedPercentage: number;
  upperGroupSelected: number;
  lowerGroupSelected: number;
  middleGroupSelected: number;
  discrimination: number;
  isNonFunctioning: boolean;
  isAmbiguous: boolean;
}

export interface ItemAnalysisResult {
  questionId: string;
  prompt: string;
  type: string;
  totalAttempts: number;
  correctCount: number;
  difficultyIndex: number; // p-value: 0.00 to 1.00
  discriminationIndex: number; // D: -1.00 to 1.00
  pointBiserial: number; // r_pbis: -1.00 to 1.00
  meanScore: number;
  maxPoints: number;
  distractors: DistractorStat[];
  flags: ItemQualityFlag[];
  recommendation: string;
}

export interface ItemAnalysisSummary {
  examId: string;
  totalQuestions: number;
  totalCandidatesEvaluated: number;
  averageDifficulty: number;
  averageDiscrimination: number;
  flaggedQuestionsCount: number;
  miskeyedQuestionsCount: number;
  items: ItemAnalysisResult[];
}

export interface ScoreDistribution {
  totalCandidates: number;
  meanScore: number;
  medianScore: number;
  standardDeviation: number;
  variance: number;
  minScore: number;
  maxScore: number;
  quartiles: { q1: number; q2: number; q3: number };
  passRate: number;
  histogram: Array<{
    bucketLabel: string;
    min: number;
    max: number;
    count: number;
    percentage: number;
  }>;
}

export interface QuestionTimeMetric {
  questionId: string;
  prompt: string;
  averageTimeSeconds: number;
  medianTimeSeconds: number;
  minTimeSeconds: number;
  maxTimeSeconds: number;
  totalAttempts: number;
}

export interface CompletionFunnelStep {
  stepIndex: number;
  label: string;
  activeCandidates: number;
  dropOffCount: number;
  dropOffRate: number; // 0.0 to 1.0
}

export interface ViolationHeatmapCell {
  timeBucket: string; // e.g. "0-5 min", "5-10 min"
  timeBucketIndex: number;
  violationType: string;
  count: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ExamAnalyticsReport {
  examId: string;
  examTitle: string;
  totalEnrollments: number;
  completedCount: number;
  abandonedCount: number;
  completionRate: number; // 0 to 100%
  averageDurationMinutes: number;
  scoreDistribution: ScoreDistribution;
  questionTimeMetrics: QuestionTimeMetric[];
  dropOffFunnel: CompletionFunnelStep[];
  violationHeatmap: ViolationHeatmapCell[];
}

export interface SignalEffectivenessMetric {
  signalType: string;
  currentSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  currentPoints: number;
  totalTriggered: number;
  upheldCount: number;
  clearedCount: number;
  upheldRate: number; // Precision: 0.0 to 1.0
  falsePositiveRate: number; // 0.0 to 1.0
  reliabilityGrade: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

export interface WeightTuningRecommendation {
  signalType: string;
  currentPoints: number;
  recommendedPoints: number;
  currentSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason: string;
  action: 'INCREASE' | 'DECREASE' | 'MAINTAIN';
}

export interface IntegrityAnalyticsReport {
  examId: string;
  totalSessions: number;
  averageIntegrityScore: number;
  scoreDistribution: Array<{ range: string; count: number; percentage: number }>;
  totalFlaggedSessions: number;
  reviewBacklogCount: number;
  resolvedCasesCount: number;
  globalFalsePositiveRate: number;
  globalUpheldRate: number;
  signalEffectiveness: SignalEffectivenessMetric[];
  weightTuningRecommendations: WeightTuningRecommendation[];
}

export type ResultReleaseRule = 'IMMEDIATE' | 'AFTER_REVIEW' | 'SCHEDULED';
export type CandidateResultStatus = 'RELEASED' | 'WITHHELD_REVIEW' | 'WITHHELD_SCHEDULED';

export interface CandidateScorecard {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  examId: string;
  examTitle: string;
  status: CandidateResultStatus;
  releaseRule: ResultReleaseRule;
  isWithheld: boolean;
  withholdReason?: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  gradeLetter: string;
  percentileRank: number;
  passed: boolean;
  submittedAt: number;
  scheduledReleaseAt?: number;
  sectionBreakdown: Array<{
    sectionId: string;
    title: string;
    score: number;
    maxScore: number;
    percentage: number;
    timeSpentSeconds: number;
  }>;
  feedback: string[];
  integrityStatus: 'CLEARED' | 'UNDER_REVIEW' | 'FLAGGED';
}

export type ScheduledReportFrequency = 'DAILY' | 'WEEKLY' | 'POST_EXAM_BATCH';

export interface ScheduledReportConfig {
  id: string;
  tenantId: string;
  name: string;
  frequency: ScheduledReportFrequency;
  recipients: string[];
  examIds: string[]; // empty means all exams
  includeExamAnalytics: boolean;
  includeItemAnalysis: boolean;
  includeIntegrityAnalytics: boolean;
  includeBiasMonitoring: boolean;
  isActive: boolean;
  lastRunAt?: number;
  nextRunAt: number;
}

export interface ReportDispatchLog {
  dispatchId: string;
  configId: string;
  reportName: string;
  dispatchedAt: number;
  recipients: string[];
  status: 'SUCCESS' | 'FAILED';
  summaryMetrics: {
    totalExamsCovered: number;
    totalCandidatesCovered: number;
    averageScore: number;
    flaggedSessionsCount: number;
  };
}

export type BiasSegmentCategory = 'CAMERA_QUALITY' | 'LIGHTING_CONDITION' | 'ACCOMMODATION_STATUS';

export interface BiasCohortMetric {
  category: BiasSegmentCategory;
  segmentName: string;
  totalSessions: number;
  flaggedSessions: number;
  flagRate: number; // 0.0 to 1.0
  clearedSessions: number;
  falsePositiveRate: number; // 0.0 to 1.0
  averageIntegrityScore: number;
}

export interface DisparityAlert {
  id: string;
  category: BiasSegmentCategory;
  baselineSegment: string;
  comparisonSegment: string;
  baselineRate: number;
  comparisonRate: number;
  disparityRatio: number;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  mitigationRecommendation: string;
}

export interface BiasMonitoringReport {
  evaluatedAt: number;
  totalSessionsAnalyzed: number;
  cohorts: BiasCohortMetric[];
  alerts: DisparityAlert[];
}

