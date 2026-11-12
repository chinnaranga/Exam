import {
  CandidateScorecard,
  CandidateResultStatus,
  ResultReleaseRule,
} from './analyticsTypes';
import { HumanReviewQueueService, humanReviewQueueService } from '../integrity/HumanReviewQueueService';

export interface ScorecardInput {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  examId: string;
  examTitle: string;
  releaseRule: ResultReleaseRule;
  scheduledReleaseAt?: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  submittedAt: number;
  sectionBreakdown: Array<{
    sectionId: string;
    title: string;
    score: number;
    maxScore: number;
    percentage: number;
    timeSpentSeconds: number;
  }>;
  feedback?: string[];
  violationPoints?: number;
  integrityConfidenceScore?: number;
  isTerminated?: boolean;
}

export class CandidateResultService {
  private reviewQueue: HumanReviewQueueService;
  private examSessionMap: Map<string, ScorecardInput> = new Map();
  private cohortScoresMap: Map<string, number[]> = new Map(); // examId -> scores[] for percentiles

  constructor(reviewQueue: HumanReviewQueueService = humanReviewQueueService) {
    this.reviewQueue = reviewQueue;
  }

  /**
   * Registers a completed exam session result.
   */
  public registerSessionResult(input: ScorecardInput): void {
    this.examSessionMap.set(input.sessionId, input);

    // Track cohort scores for percentile calculation
    const scores = this.cohortScoresMap.get(input.examId) || [];
    scores.push(input.percentage);
    scores.sort((a, b) => a - b);
    this.cohortScoresMap.set(input.examId, scores);
  }

  /**
   * Evaluates release rules and returns the candidate scorecard.
   * If under integrity review or not yet scheduled, scores are withheld!
   */
  public getCandidateScorecard(sessionId: string, currentTime: number = Date.now()): CandidateScorecard {
    const data = this.examSessionMap.get(sessionId);
    if (!data) {
      throw new Error(`Scorecard for session "${sessionId}" not found.`);
    }

    // 1. Check Integrity Review Status
    const queueItem = this.reviewQueue.getSessionItem(sessionId);
    const hasUnresolvedFlag =
      queueItem && (queueItem.status === 'PENDING' || queueItem.status === 'IN_REVIEW');
    const isInvalidated =
      queueItem?.decision === 'INVALIDATE' || data.isTerminated || (data.violationPoints ?? 0) >= 8;
    const isUnderReview = hasUnresolvedFlag || ((data.violationPoints ?? 0) >= 4 && !queueItem?.decision);

    let integrityStatus: 'CLEARED' | 'UNDER_REVIEW' | 'FLAGGED' = 'CLEARED';
    if (isInvalidated) integrityStatus = 'FLAGGED';
    else if (isUnderReview) integrityStatus = 'UNDER_REVIEW';

    // 2. Check Release Rules
    let status: CandidateResultStatus = 'RELEASED';
    let isWithheld = false;
    let withholdReason: string | undefined = undefined;

    if (isUnderReview || hasUnresolvedFlag) {
      // Rule 1: Always withhold while under integrity review
      status = 'WITHHELD_REVIEW';
      isWithheld = true;
      withholdReason =
        'Your examination results are currently undergoing final quality and integrity verification. You will be notified once the review is completed.';
    } else if (isInvalidated) {
      status = 'WITHHELD_REVIEW';
      isWithheld = true;
      withholdReason =
        'This examination session has been flagged and invalidated due to confirmed proctoring policy non-compliance.';
    } else if (data.releaseRule === 'AFTER_REVIEW' && queueItem && queueItem.status !== 'RESOLVED') {
      status = 'WITHHELD_REVIEW';
      isWithheld = true;
      withholdReason =
        'Results for this examination are held until proctoring and grading review concludes.';
    } else if (data.releaseRule === 'SCHEDULED' && data.scheduledReleaseAt && currentTime < data.scheduledReleaseAt) {
      status = 'WITHHELD_SCHEDULED';
      isWithheld = true;
      const releaseDate = new Date(data.scheduledReleaseAt).toLocaleString();
      withholdReason = `Results for this examination are scheduled to be released on ${releaseDate}.`;
    }

    // 3. Compute Grade Letter & Percentile Rank
    const gradeLetter = this.computeGradeLetter(data.percentage);
    const percentileRank = this.computePercentile(data.examId, data.percentage);
    const passed = data.percentage >= 60.0;

    // 4. Secure Scorecard Output: If withheld, zero-out sensitive score breakdowns
    if (isWithheld) {
      return {
        sessionId: data.sessionId,
        candidateId: data.candidateId,
        candidateName: data.candidateName,
        candidateEmail: data.candidateEmail,
        examId: data.examId,
        examTitle: data.examTitle,
        status,
        releaseRule: data.releaseRule,
        isWithheld: true,
        withholdReason,
        totalScore: 0,
        maxScore: data.maxScore,
        percentage: 0,
        gradeLetter: 'PENDING',
        percentileRank: 0,
        passed: false,
        submittedAt: data.submittedAt,
        scheduledReleaseAt: data.scheduledReleaseAt,
        sectionBreakdown: [],
        feedback: [],
        integrityStatus,
      };
    }

    return {
      sessionId: data.sessionId,
      candidateId: data.candidateId,
      candidateName: data.candidateName,
      candidateEmail: data.candidateEmail,
      examId: data.examId,
      examTitle: data.examTitle,
      status: 'RELEASED',
      releaseRule: data.releaseRule,
      isWithheld: false,
      totalScore: data.totalScore,
      maxScore: data.maxScore,
      percentage: data.percentage,
      gradeLetter,
      percentileRank,
      passed,
      submittedAt: data.submittedAt,
      scheduledReleaseAt: data.scheduledReleaseAt,
      sectionBreakdown: data.sectionBreakdown,
      feedback: data.feedback || ['All examination sections completed and evaluated.'],
      integrityStatus,
    };
  }

  private computeGradeLetter(percentage: number): string {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  private computePercentile(examId: string, percentage: number): number {
    const scores = this.cohortScoresMap.get(examId);
    if (!scores || scores.length <= 1) return 100;

    const countBelow = scores.filter((s) => s < percentage).length;
    const countEqual = scores.filter((s) => s === percentage).length;
    // Standard percentile formula: (countBelow + 0.5 * countEqual) / N * 100
    const percentile = ((countBelow + 0.5 * countEqual) / scores.length) * 100;
    return Math.round(percentile * 10) / 10;
  }
}

export const candidateResultService = new CandidateResultService();

