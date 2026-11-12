import crypto from 'crypto';
import {
  AnonymizedSubmission,
  DoubleMarkingRecord,
  GraderEvaluation,
  RubricEvaluationResult,
} from './questionTypes';

export interface DoubleMarkingConfig {
  disparityPercentageThreshold: number; // e.g. 15% disparity flags third grader
  disparityAbsolutePointsThreshold: number; // e.g. 5 points absolute difference
}

export class DoubleMarkingService {
  private config: DoubleMarkingConfig;

  // Key: anonymizedId -> Record
  private records: Map<string, DoubleMarkingRecord> = new Map();
  // Key: anonymizedId -> AnonymizedSubmission
  private submissions: Map<string, AnonymizedSubmission> = new Map();
  // Private mapping: submissionId -> anonymizedId
  private identityMap: Map<string, { submissionId: string; candidateId: string }> = new Map();

  constructor(
    config: DoubleMarkingConfig = {
      disparityPercentageThreshold: 15,
      disparityAbsolutePointsThreshold: 5,
    }
  ) {
    this.config = config;
  }

  /**
   * Registers a candidate submission under an anonymized token.
   * Graders see only the blind token, stripping candidate identity.
   */
  public registerAnonymizedSubmission(params: {
    submissionId: string;
    candidateId: string;
    examId: string;
    questionId: string;
    submittedContent: unknown;
    maxScore: number;
    submittedAt?: number;
  }): { anonymizedId: string; submission: AnonymizedSubmission } {
    const blindHash = crypto
      .createHash('sha256')
      .update(`${params.submissionId}:${params.candidateId}`)
      .digest('hex')
      .substring(0, 8)
      .toUpperCase();

    const anonymizedId = `ANON-${blindHash}`;

    const submission: AnonymizedSubmission = {
      anonymousSubmissionId: anonymizedId,
      examId: params.examId,
      questionId: params.questionId,
      submittedContent: params.submittedContent,
      submittedAt: params.submittedAt || Date.now(),
    };

    const record: DoubleMarkingRecord = {
      submissionId: params.submissionId,
      anonymizedId,
      questionId: params.questionId,
      maxScore: params.maxScore,
      status: 'PENDING_GRADERS',
    };

    this.submissions.set(anonymizedId, submission);
    this.records.set(anonymizedId, record);
    this.identityMap.set(anonymizedId, {
      submissionId: params.submissionId,
      candidateId: params.candidateId,
    });

    return { anonymizedId, submission };
  }

  /**
   * Grader submits an independent score without seeing the other grader's assessment.
   */
  public submitGraderScore(params: {
    anonymizedId: string;
    graderId: string;
    score: number;
    notes?: string;
    rubricEvaluation?: RubricEvaluationResult;
  }): DoubleMarkingRecord {
    const record = this.records.get(params.anonymizedId);
    if (!record) {
      throw new Error(`Submission "${params.anonymizedId}" not found.`);
    }

    if (params.score < 0 || params.score > record.maxScore) {
      throw new Error(`Score ${params.score} is out of bounds [0, ${record.maxScore}].`);
    }

    const evaluation: GraderEvaluation = {
      graderId: params.graderId,
      score: params.score,
      maxScore: record.maxScore,
      evaluatedAt: Date.now(),
      notes: params.notes,
      rubricEvaluation: params.rubricEvaluation,
    };

    if (!record.graderA) {
      record.graderA = evaluation;
    } else if (record.graderA.graderId === params.graderId) {
      throw new Error(`Grader "${params.graderId}" has already evaluated this submission as Grader A.`);
    } else if (!record.graderB) {
      record.graderB = evaluation;
    } else {
      throw new Error(`Submission "${params.anonymizedId}" already has evaluations from two independent graders.`);
    }

    // If both Grader A and Grader B have scored, calculate disparity
    if (record.graderA && record.graderB) {
      const diff = Math.abs(record.graderA.score - record.graderB.score);
      const disparityPct = record.maxScore > 0 ? (diff / record.maxScore) * 100 : 0;

      record.scoreDisparity = Math.round(diff * 100) / 100;
      record.scoreDisparityPercentage = Math.round(disparityPct * 100) / 100;
      record.disparityAbsolute = record.scoreDisparity;
      record.disparityPercentage = record.scoreDisparityPercentage;

      const exceedsPct = disparityPct > this.config.disparityPercentageThreshold;
      const exceedsAbs = diff > this.config.disparityAbsolutePointsThreshold;

      if (exceedsPct || exceedsAbs) {
        // Disagreement flagged: routes to third grader arbitrator
        record.status = 'DISAGREEMENT_FLAGGED';
      } else {
        // Concurred: average both independent scores
        record.status = 'CONCURRED';
        record.finalAuthoritativeScore =
          Math.round(((record.graderA.score + record.graderB.score) / 2) * 100) / 100;
        record.finalScore = record.finalAuthoritativeScore;
      }
    }

    return record;
  }

  /**
   * Convenience alias for submitGraderScore.
   */
  public recordGraderScore(params: {
    anonymizedId: string;
    graderId: string;
    score: number;
    notes?: string;
    rubricEvaluation?: RubricEvaluationResult;
  }): DoubleMarkingRecord {
    return this.submitGraderScore(params);
  }

  /**
   * Third grader (Chief Arbitrator) reviews flagged disagreement and resolves final score.
   */
  public arbitrateDisagreement(params: {
    anonymizedId: string;
    thirdGraderId: string;
    finalScore: number;
    arbitrationNotes: string;
  }): DoubleMarkingRecord {
    const record = this.records.get(params.anonymizedId);
    if (!record) {
      throw new Error(`Submission "${params.anonymizedId}" not found.`);
    }

    if (record.status !== 'DISAGREEMENT_FLAGGED') {
      throw new Error(`Submission "${params.anonymizedId}" is not flagged for arbitration (status: ${record.status}).`);
    }

    if (
      params.thirdGraderId === record.graderA?.graderId ||
      params.thirdGraderId === record.graderB?.graderId
    ) {
      throw new Error('Third grader arbitrator must be an independent third party.');
    }

    if (params.finalScore < 0 || params.finalScore > record.maxScore) {
      throw new Error(`Arbitrated score ${params.finalScore} is out of bounds [0, ${record.maxScore}].`);
    }

    record.thirdGraderArbitration = {
      graderId: params.thirdGraderId,
      score: params.finalScore,
      maxScore: record.maxScore,
      evaluatedAt: Date.now(),
      arbitrationNotes: params.arbitrationNotes,
    };
    record.thirdGrader = record.thirdGraderArbitration;

    record.status = 'ARBITRATED';
    record.finalAuthoritativeScore = params.finalScore;
    record.finalScore = params.finalScore;

    return record;
  }

  /**
   * Convenience alias for arbitrateDisagreement.
   */
  public resolveByArbitrator(params: {
    anonymizedId: string;
    arbitratorId: string;
    finalScore: number;
    resolutionRationale?: string;
  }): DoubleMarkingRecord {
    return this.arbitrateDisagreement({
      anonymizedId: params.anonymizedId,
      thirdGraderId: params.arbitratorId,
      finalScore: params.finalScore,
      arbitrationNotes: params.resolutionRationale || '',
    });
  }

  /**
   * Retrieves strictly anonymized submission content for graders.
   */
  public getAnonymizedSubmission(anonymizedId: string): AnonymizedSubmission | undefined {
    return this.submissions.get(anonymizedId);
  }

  public getRecord(anonymizedId: string): DoubleMarkingRecord | undefined {
    return this.records.get(anonymizedId);
  }

  public getFlaggedDisagreements(): DoubleMarkingRecord[] {
    return Array.from(this.records.values()).filter((r) => r.status === 'DISAGREEMENT_FLAGGED');
  }

  public clear(): void {
    this.records.clear();
    this.submissions.clear();
    this.identityMap.clear();
  }
}

export const doubleMarkingService = new DoubleMarkingService();
export default doubleMarkingService;
