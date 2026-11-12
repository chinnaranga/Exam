import { describe, it, expect, beforeEach } from 'vitest';
import {
  ItemAnalysisEngine,
  QuestionMetadata,
  CandidateItemResponse,
} from '../ItemAnalysisEngine';
import { ExamAnalyticsEngine, CandidateExamSessionData } from '../ExamAnalyticsEngine';
import { IntegrityAnalyticsEngine } from '../IntegrityAnalyticsEngine';
import { CandidateResultService } from '../CandidateResultService';
import { BiasMonitoringService } from '../BiasMonitoringService';
import { HumanReviewQueueService } from '../../integrity/HumanReviewQueueService';

describe('AssessIQ Psychometrics & Item Analysis Engine', () => {
  let engine: ItemAnalysisEngine;

  beforeEach(() => {
    engine = new ItemAnalysisEngine();
  });

  it('calculates difficulty index (p-value) correctly for standard and edge cases', () => {
    const question: QuestionMetadata = {
      id: 'q_diff_1',
      prompt: 'What is 2 + 2?',
      type: 'MULTIPLE_CHOICE',
      maxPoints: 1,
    };

    // 10 candidates: 8 correct, 2 incorrect -> p = 0.80
    const responses: CandidateItemResponse[] = [
      ...Array.from({ length: 8 }, (_, i) => ({
        candidateId: `c_${i}`,
        totalExamScore: 80,
        questionId: 'q_diff_1',
        pointsAwarded: 1,
        maxPoints: 1,
        isCorrect: true,
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        candidateId: `c_${i + 8}`,
        totalExamScore: 40,
        questionId: 'q_diff_1',
        pointsAwarded: 0,
        maxPoints: 1,
        isCorrect: false,
      })),
    ];

    const result = engine.analyzeSingleItem({
      question,
      responses,
      upperCandidates: new Set(['c_0', 'c_1']),
      lowerCandidates: new Set(['c_8', 'c_9']),
      candidateScoreMap: new Map([
        ['c_0', 80],
        ['c_1', 80],
        ['c_8', 40],
        ['c_9', 40],
      ]),
      totalScoreStdDev: 20,
    });

    expect(result.difficultyIndex).toBe(0.8);
    expect(result.correctCount).toBe(8);
    expect(result.totalAttempts).toBe(10);
  });

  it('correctly flags questions that are TOO_EASY (p > 0.90)', () => {
    const question: QuestionMetadata = {
      id: 'q_easy',
      prompt: 'Is the sky blue on a clear day?',
      type: 'MULTIPLE_CHOICE',
      maxPoints: 1,
    };

    // 19 correct out of 20 -> p = 0.95
    const responses: CandidateItemResponse[] = [
      ...Array.from({ length: 19 }, (_, i) => ({
        candidateId: `c_${i}`,
        totalExamScore: 70 + i,
        questionId: 'q_easy',
        pointsAwarded: 1,
        maxPoints: 1,
        isCorrect: true,
      })),
      {
        candidateId: 'c_19',
        totalExamScore: 30,
        questionId: 'q_easy',
        pointsAwarded: 0,
        maxPoints: 1,
        isCorrect: false,
      },
    ];

    const result = engine.analyzeSingleItem({
      question,
      responses,
      upperCandidates: new Set(['c_18', 'c_17', 'c_16']),
      lowerCandidates: new Set(['c_19', 'c_0']),
      candidateScoreMap: new Map(responses.map((r) => [r.candidateId, r.totalExamScore])),
      totalScoreStdDev: 15,
    });

    expect(result.difficultyIndex).toBe(0.95);
    expect(result.flags).toContain('TOO_EASY');
    expect(result.recommendation).toContain('too easy');
  });

  it('correctly flags questions that are TOO_HARD (p < 0.20)', () => {
    const question: QuestionMetadata = {
      id: 'q_hard',
      prompt: 'Quantum electrodynamics tensor contraction',
      type: 'MULTIPLE_CHOICE',
      maxPoints: 2,
    };

    // 2 correct out of 20 -> p = 0.10
    const responses: CandidateItemResponse[] = [
      ...Array.from({ length: 2 }, (_, i) => ({
        candidateId: `c_${i}`,
        totalExamScore: 90,
        questionId: 'q_hard',
        pointsAwarded: 2,
        maxPoints: 2,
        isCorrect: true,
      })),
      ...Array.from({ length: 18 }, (_, i) => ({
        candidateId: `c_${i + 2}`,
        totalExamScore: 50,
        questionId: 'q_hard',
        pointsAwarded: 0,
        maxPoints: 2,
        isCorrect: false,
      })),
    ];

    const result = engine.analyzeSingleItem({
      question,
      responses,
      upperCandidates: new Set(['c_0', 'c_1']),
      lowerCandidates: new Set(['c_18', 'c_19']),
      candidateScoreMap: new Map(responses.map((r) => [r.candidateId, r.totalExamScore])),
      totalScoreStdDev: 18,
    });

    expect(result.difficultyIndex).toBe(0.1);
    expect(result.flags).toContain('TOO_HARD');
  });

  it('calculates Discrimination Index (D = p_upper - p_lower) and flags POOR_DISCRIMINATION', () => {
    const question: QuestionMetadata = {
      id: 'q_disc_good',
      prompt: 'Algorithm complexity question',
      type: 'MULTIPLE_CHOICE',
      maxPoints: 1,
    };

    // Upper cohort (3 candidates): 3 correct (p_upper = 1.0)
    // Lower cohort (3 candidates): 0 correct (p_lower = 0.0)
    // Expected D = 1.0 - 0.0 = 1.0 (Excellent discrimination)
    const upperResponses: CandidateItemResponse[] = ['u1', 'u2', 'u3'].map((id) => ({
      candidateId: id,
      totalExamScore: 95,
      questionId: 'q_disc_good',
      pointsAwarded: 1,
      maxPoints: 1,
      isCorrect: true,
    }));

    const lowerResponses: CandidateItemResponse[] = ['l1', 'l2', 'l3'].map((id) => ({
      candidateId: id,
      totalExamScore: 35,
      questionId: 'q_disc_good',
      pointsAwarded: 0,
      maxPoints: 1,
      isCorrect: false,
    }));

    const result = engine.analyzeSingleItem({
      question,
      responses: [...upperResponses, ...lowerResponses],
      upperCandidates: new Set(['u1', 'u2', 'u3']),
      lowerCandidates: new Set(['l1', 'l2', 'l3']),
      candidateScoreMap: new Map([
        ['u1', 95],
        ['u2', 95],
        ['u3', 95],
        ['l1', 35],
        ['l2', 35],
        ['l3', 35],
      ]),
      totalScoreStdDev: 30,
    });

    expect(result.discriminationIndex).toBe(1.0);
    expect(result.flags).not.toContain('POOR_DISCRIMINATION');
    expect(result.flags).not.toContain('POSSIBLY_MISKEYED');
  });

  it('detects POSSIBLY_MISKEYED questions due to negative discrimination (D < 0)', () => {
    const question: QuestionMetadata = {
      id: 'q_miskeyed_neg',
      prompt: 'Tricky question where lower scorers guess right',
      type: 'MULTIPLE_CHOICE',
      maxPoints: 1,
    };

    // Upper cohort (4 candidates): 1 correct (p_upper = 0.25)
    // Lower cohort (4 candidates): 3 correct (p_lower = 0.75)
    // D = 0.25 - 0.75 = -0.50 (Negative discrimination!)
    const upperResponses: CandidateItemResponse[] = [
      { candidateId: 'u1', totalExamScore: 90, questionId: 'q_miskeyed_neg', pointsAwarded: 1, maxPoints: 1, isCorrect: true },
      { candidateId: 'u2', totalExamScore: 88, questionId: 'q_miskeyed_neg', pointsAwarded: 0, maxPoints: 1, isCorrect: false },
      { candidateId: 'u3', totalExamScore: 86, questionId: 'q_miskeyed_neg', pointsAwarded: 0, maxPoints: 1, isCorrect: false },
      { candidateId: 'u4', totalExamScore: 84, questionId: 'q_miskeyed_neg', pointsAwarded: 0, maxPoints: 1, isCorrect: false },
    ];

    const lowerResponses: CandidateItemResponse[] = [
      { candidateId: 'l1', totalExamScore: 40, questionId: 'q_miskeyed_neg', pointsAwarded: 1, maxPoints: 1, isCorrect: true },
      { candidateId: 'l2', totalExamScore: 38, questionId: 'q_miskeyed_neg', pointsAwarded: 1, maxPoints: 1, isCorrect: true },
      { candidateId: 'l3', totalExamScore: 35, questionId: 'q_miskeyed_neg', pointsAwarded: 1, maxPoints: 1, isCorrect: true },
      { candidateId: 'l4', totalExamScore: 30, questionId: 'q_miskeyed_neg', pointsAwarded: 0, maxPoints: 1, isCorrect: false },
    ];

    const result = engine.analyzeSingleItem({
      question,
      responses: [...upperResponses, ...lowerResponses],
      upperCandidates: new Set(['u1', 'u2', 'u3', 'u4']),
      lowerCandidates: new Set(['l1', 'l2', 'l3', 'l4']),
      candidateScoreMap: new Map([...upperResponses, ...lowerResponses].map((r) => [r.candidateId, r.totalExamScore])),
      totalScoreStdDev: 25,
    });

    expect(result.discriminationIndex).toBe(-0.5);
    expect(result.flags).toContain('POSSIBLY_MISKEYED');
    expect(result.recommendation).toContain('CRITICAL');
  });

  it('performs distractor analysis, flagging NON_FUNCTIONING_DISTRACTOR and AMBIGUOUS_DISTRACTOR', () => {
    const question: QuestionMetadata = {
      id: 'q_distractors',
      prompt: 'Which data structure has O(1) average lookup?',
      type: 'MULTIPLE_CHOICE',
      maxPoints: 1,
      options: [
        { id: 'opt_a', text: 'Hash Table', isCorrect: true },
        { id: 'opt_b', text: 'Red-Black Tree', isCorrect: false },
        { id: 'opt_c', text: 'Linked List', isCorrect: false },
        { id: 'opt_d', text: 'Floppy Disk', isCorrect: false }, // Obvious distracter, 0 selections
      ],
    };

    // 20 candidates total
    // Upper (5): 4 picked opt_a, 1 picked opt_b (20% of upper -> AMBIGUOUS)
    // Lower (5): 1 picked opt_a, 2 picked opt_b, 2 picked opt_c
    // Middle (10): 6 picked opt_a, 2 picked opt_b, 2 picked opt_c
    // opt_d: 0 selections (<3% -> NON_FUNCTIONING_DISTRACTOR)
    const responses: CandidateItemResponse[] = [
      // Upper 5
      ...Array.from({ length: 4 }, (_, i) => ({
        candidateId: `u_${i}`,
        totalExamScore: 90,
        questionId: 'q_distractors',
        selectedOptionId: 'opt_a',
        pointsAwarded: 1,
        maxPoints: 1,
        isCorrect: true,
      })),
      {
        candidateId: 'u_4',
        totalExamScore: 88,
        questionId: 'q_distractors',
        selectedOptionId: 'opt_b', // Upper chose distractor
        pointsAwarded: 0,
        maxPoints: 1,
        isCorrect: false,
      },
      // Lower 5
      { candidateId: 'l_0', totalExamScore: 30, questionId: 'q_distractors', selectedOptionId: 'opt_a', pointsAwarded: 1, maxPoints: 1, isCorrect: true },
      { candidateId: 'l_1', totalExamScore: 28, questionId: 'q_distractors', selectedOptionId: 'opt_b', pointsAwarded: 0, maxPoints: 1, isCorrect: false },
      { candidateId: 'l_2', totalExamScore: 25, questionId: 'q_distractors', selectedOptionId: 'opt_b', pointsAwarded: 0, maxPoints: 1, isCorrect: false },
      { candidateId: 'l_3', totalExamScore: 22, questionId: 'q_distractors', selectedOptionId: 'opt_c', pointsAwarded: 0, maxPoints: 1, isCorrect: false },
      { candidateId: 'l_4', totalExamScore: 20, questionId: 'q_distractors', selectedOptionId: 'opt_c', pointsAwarded: 0, maxPoints: 1, isCorrect: false },
      // Middle 10
      ...Array.from({ length: 6 }, (_, i) => ({
        candidateId: `m_${i}`,
        totalExamScore: 60,
        questionId: 'q_distractors',
        selectedOptionId: 'opt_a',
        pointsAwarded: 1,
        maxPoints: 1,
        isCorrect: true,
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        candidateId: `m_${i + 6}`,
        totalExamScore: 55,
        questionId: 'q_distractors',
        selectedOptionId: 'opt_b',
        pointsAwarded: 0,
        maxPoints: 1,
        isCorrect: false,
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        candidateId: `m_${i + 8}`,
        totalExamScore: 50,
        questionId: 'q_distractors',
        selectedOptionId: 'opt_c',
        pointsAwarded: 0,
        maxPoints: 1,
        isCorrect: false,
      })),
    ];

    const upperIds = new Set(['u_0', 'u_1', 'u_2', 'u_3', 'u_4']);
    const lowerIds = new Set(['l_0', 'l_1', 'l_2', 'l_3', 'l_4']);

    const result = engine.analyzeSingleItem({
      question,
      responses,
      upperCandidates: upperIds,
      lowerCandidates: lowerIds,
      candidateScoreMap: new Map(responses.map((r) => [r.candidateId, r.totalExamScore])),
      totalScoreStdDev: 25,
    });

    expect(result.flags).toContain('NON_FUNCTIONING_DISTRACTOR');
    expect(result.flags).toContain('AMBIGUOUS_DISTRACTOR');

    const optD = result.distractors.find((d) => d.optionId === 'opt_d');
    expect(optD).toBeDefined();
    expect(optD?.isNonFunctioning).toBe(true);
    expect(optD?.totalSelected).toBe(0);

    const optB = result.distractors.find((d) => d.optionId === 'opt_b');
    expect(optB).toBeDefined();
    expect(optB?.isAmbiguous).toBe(true);
    expect(optB?.upperGroupSelected).toBe(1);
  });

  it('runs complete exam cohort analysis across multiple items with Kelly 27% rule', () => {
    const questions: QuestionMetadata[] = [
      { id: 'q1', prompt: 'Q1', type: 'MULTIPLE_CHOICE', maxPoints: 10 },
      { id: 'q2', prompt: 'Q2', type: 'MULTIPLE_CHOICE', maxPoints: 10 },
    ];

    const responses: CandidateItemResponse[] = [];
    // 10 candidates
    for (let i = 0; i < 10; i++) {
      const candScore = i * 10;
      responses.push({
        candidateId: `cand_${i}`,
        totalExamScore: candScore,
        questionId: 'q1',
        pointsAwarded: i >= 5 ? 10 : 0,
        maxPoints: 10,
        isCorrect: i >= 5,
      });
      responses.push({
        candidateId: `cand_${i}`,
        totalExamScore: candScore,
        questionId: 'q2',
        pointsAwarded: 10, // everyone got q2 right -> too easy
        maxPoints: 10,
        isCorrect: true,
      });
    }

    const summary = engine.analyzeExamItems('exam_test_1', questions, responses);
    expect(summary.totalQuestions).toBe(2);
    expect(summary.totalCandidatesEvaluated).toBe(10);
    expect(summary.items[1].flags).toContain('TOO_EASY');
    expect(summary.flaggedQuestionsCount).toBeGreaterThanOrEqual(1);
  });
});

describe('AssessIQ Candidate Result Service & Release Rules', () => {
  let resultService: CandidateResultService;
  let mockReviewQueue: HumanReviewQueueService;

  beforeEach(() => {
    mockReviewQueue = new HumanReviewQueueService();
    resultService = new CandidateResultService(mockReviewQueue);
  });

  it('immediately releases scorecard when rule is IMMEDIATE and session is clean', () => {
    resultService.registerSessionResult({
      sessionId: 'sess_clean',
      candidateId: 'cand_1',
      candidateName: 'Alice Johnson',
      examId: 'exam_cs101',
      examTitle: 'Introduction to Computer Science',
      releaseRule: 'IMMEDIATE',
      totalScore: 85,
      maxScore: 100,
      percentage: 85,
      submittedAt: Date.now() - 5000,
      sectionBreakdown: [
        { sectionId: 'sec_1', title: 'Data Structures', score: 45, maxScore: 50, percentage: 90, timeSpentSeconds: 600 },
        { sectionId: 'sec_2', title: 'Algorithms', score: 40, maxScore: 50, percentage: 80, timeSpentSeconds: 900 },
      ],
      violationPoints: 0,
    });

    const scorecard = resultService.getCandidateScorecard('sess_clean');
    expect(scorecard.status).toBe('RELEASED');
    expect(scorecard.isWithheld).toBe(false);
    expect(scorecard.totalScore).toBe(85);
    expect(scorecard.gradeLetter).toBe('B');
    expect(scorecard.sectionBreakdown.length).toBe(2);
  });

  it('securely withholds score and zeroes sensitive breakdowns when session is under integrity review', () => {
    mockReviewQueue.enqueueSession({
      sessionId: 'sess_flagged',
      candidateId: 'cand_bad',
      candidateName: 'Bob Flagged',
      examId: 'exam_cs101',
      flagReasons: ['MULTIPLE_MONITORS_DETECTED', 'DEVTOOLS_OPEN'],
      integrityConfidenceScore: 35,
      violationPoints: 6,
    });

    resultService.registerSessionResult({
      sessionId: 'sess_flagged',
      candidateId: 'cand_bad',
      candidateName: 'Bob Flagged',
      examId: 'exam_cs101',
      examTitle: 'Introduction to Computer Science',
      releaseRule: 'IMMEDIATE',
      totalScore: 92,
      maxScore: 100,
      percentage: 92,
      submittedAt: Date.now() - 10000,
      sectionBreakdown: [
        { sectionId: 'sec_1', title: 'Data Structures', score: 50, maxScore: 50, percentage: 100, timeSpentSeconds: 120 },
      ],
      violationPoints: 6,
    });

    const scorecard = resultService.getCandidateScorecard('sess_flagged');
    expect(scorecard.status).toBe('WITHHELD_REVIEW');
    expect(scorecard.isWithheld).toBe(true);
    // Sensitive points & breakdown must be masked from client!
    expect(scorecard.totalScore).toBe(0);
    expect(scorecard.percentage).toBe(0);
    expect(scorecard.gradeLetter).toBe('PENDING');
    expect(scorecard.sectionBreakdown).toEqual([]);
    expect(scorecard.withholdReason).toContain('undergoing final quality and integrity verification');
  });

  it('withholds results when releaseRule is SCHEDULED and current time is before release time', () => {
    const futureTime = Date.now() + 86400 * 1000; // Tomorrow
    resultService.registerSessionResult({
      sessionId: 'sess_scheduled',
      candidateId: 'cand_sched',
      candidateName: 'Carol Future',
      examId: 'exam_cs101',
      examTitle: 'Introduction to Computer Science',
      releaseRule: 'SCHEDULED',
      scheduledReleaseAt: futureTime,
      totalScore: 78,
      maxScore: 100,
      percentage: 78,
      submittedAt: Date.now() - 2000,
      sectionBreakdown: [],
      violationPoints: 0,
    });

    const scorecard = resultService.getCandidateScorecard('sess_scheduled', Date.now());
    expect(scorecard.status).toBe('WITHHELD_SCHEDULED');
    expect(scorecard.isWithheld).toBe(true);
    expect(scorecard.withholdReason).toContain('scheduled to be released');

    // After scheduled time passes, scorecard releases
    const scorecardLater = resultService.getCandidateScorecard('sess_scheduled', futureTime + 1000);
    expect(scorecardLater.status).toBe('RELEASED');
    expect(scorecardLater.isWithheld).toBe(false);
    expect(scorecardLater.totalScore).toBe(78);
  });
});

describe('AssessIQ Integrity Analytics & Proctoring Signal Tuning', () => {
  it('calculates global false positive rate and ranks proctoring signal reliability', () => {
    const mockReviewQueue = new HumanReviewQueueService();
    // Simulate reviewer decisions
    mockReviewQueue.enqueueSession({
      sessionId: 's1', candidateId: 'c1', examId: 'e1', flagReasons: ['GAZE_AWAY'], integrityConfidenceScore: 70, violationPoints: 2
    });
    mockReviewQueue.recordDecision('s1', 'CLEAR', 'rev_1', 'Natural eye drift, false alarm.');

    mockReviewQueue.enqueueSession({
      sessionId: 's2', candidateId: 'c2', examId: 'e1', flagReasons: ['PHONE_DETECTED'], integrityConfidenceScore: 30, violationPoints: 6
    });
    mockReviewQueue.recordDecision('s2', 'INVALIDATE', 'rev_1', 'Phone clearly visible.');

    const engine = new IntegrityAnalyticsEngine(mockReviewQueue);
    const report = engine.generateIntegrityReport('e1', [
      {
        sessionId: 's1',
        candidateId: 'c1',
        examId: 'e1',
        integrityConfidenceScore: 70,
        violationPoints: 2,
        signalsTriggered: [{ type: 'GAZE_AWAY', points: 2, severity: 'MEDIUM', timestamp: 100 }],
        reviewDecision: 'CLEAR',
      },
      {
        sessionId: 's2',
        candidateId: 'c2',
        examId: 'e1',
        integrityConfidenceScore: 30,
        violationPoints: 6,
        signalsTriggered: [{ type: 'PHONE_DETECTED', points: 3, severity: 'HIGH', timestamp: 200 }],
        reviewDecision: 'INVALIDATE',
      },
    ]);

    expect(report.totalSessions).toBe(2);
    expect(report.resolvedCasesCount).toBe(2);
    expect(report.globalFalsePositiveRate).toBe(0.5); // 1 clear out of 2 resolved
    expect(report.globalUpheldRate).toBe(0.5); // 1 invalidate out of 2 resolved

    const gazeSig = report.signalEffectiveness.find((s) => s.signalType === 'GAZE_AWAY');
    expect(gazeSig?.clearedCount).toBe(1);
    expect(gazeSig?.falsePositiveRate).toBe(1.0);

    const phoneSig = report.signalEffectiveness.find((s) => s.signalType === 'PHONE_DETECTED');
    expect(phoneSig?.upheldCount).toBe(1);
    expect(phoneSig?.upheldRate).toBe(1.0);
  });
});

describe('AssessIQ Bias Monitoring & Hardware Disparity Detection', () => {
  it('detects model disparity when low-resolution camera flag rate exceeds baseline by >25%', () => {
    const biasService = new BiasMonitoringService();

    // 10 high-res sessions (only 1 flagged -> 10% rate)
    const highResSessions = Array.from({ length: 10 }, (_, i) => ({
      sessionId: `hd_${i}`,
      candidateId: `cand_hd_${i}`,
      cameraQuality: 'HIGH_RES_720P_PLUS' as const,
      lightingCondition: 'BALANCED' as const,
      hasAccommodation: false,
      wasFlagged: i === 0, // 1/10 = 10%
      integrityConfidenceScore: 92,
    }));

    // 10 low-res sessions (4 flagged -> 40% rate; disparity = 40/10 = 4.0x)
    const lowResSessions = Array.from({ length: 10 }, (_, i) => ({
      sessionId: `sd_${i}`,
      candidateId: `cand_sd_${i}`,
      cameraQuality: 'LOW_RES_480P' as const,
      lightingCondition: 'BALANCED' as const,
      hasAccommodation: false,
      wasFlagged: i < 4, // 4/10 = 40%
      integrityConfidenceScore: 78,
    }));

    const report = biasService.evaluateBiasMetrics([...highResSessions, ...lowResSessions]);

    expect(report.totalSessionsAnalyzed).toBe(20);
    const cameraAlert = report.alerts.find((a) => a.category === 'CAMERA_QUALITY');
    expect(cameraAlert).toBeDefined();
    expect(cameraAlert?.disparityRatio).toBe(4.0);
    expect(cameraAlert?.message).toContain('Disproportionate proctoring flag rate detected on low-resolution webcams');
    expect(cameraAlert?.mitigationRecommendation).toContain('facial landmark confidence thresholds');
  });
});

