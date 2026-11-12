import {
  ItemAnalysisResult,
  ItemAnalysisSummary,
  ItemQualityFlag,
  DistractorStat,
} from './analyticsTypes';

export interface CandidateItemResponse {
  candidateId: string;
  totalExamScore: number;
  questionId: string;
  selectedOptionId?: string | null;
  pointsAwarded: number;
  maxPoints: number;
  isCorrect: boolean;
}

export interface QuestionMetadata {
  id: string;
  prompt: string;
  type: string;
  maxPoints: number;
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
}

export class ItemAnalysisEngine {
  private static readonly UPPER_LOWER_RATIO = 0.27; // Kelly's 27% rule
  private static readonly TOO_EASY_THRESHOLD = 0.90;
  private static readonly TOO_HARD_THRESHOLD = 0.20;
  private static readonly POOR_DISCRIMINATION_THRESHOLD = 0.20;
  private static readonly NON_FUNCTIONING_DISTRACTOR_THRESHOLD = 0.03; // <3%
  private static readonly AMBIGUOUS_DISTRACTOR_UPPER_THRESHOLD = 0.20; // >=20% of top performers

  /**
   * Performs full psychometric item analysis for an entire exam across all candidate responses.
   */
  public analyzeExamItems(
    examId: string,
    questions: QuestionMetadata[],
    responses: CandidateItemResponse[]
  ): ItemAnalysisSummary {
    if (questions.length === 0 || responses.length === 0) {
      return {
        examId,
        totalQuestions: questions.length,
        totalCandidatesEvaluated: 0,
        averageDifficulty: 0,
        averageDiscrimination: 0,
        flaggedQuestionsCount: 0,
        miskeyedQuestionsCount: 0,
        items: [],
      };
    }

    // Determine unique candidates and their overall scores
    const candidateScoreMap = new Map<string, number>();
    for (const resp of responses) {
      candidateScoreMap.set(resp.candidateId, resp.totalExamScore);
    }

    const candidateList = Array.from(candidateScoreMap.entries()).map(([candidateId, score]) => ({
      candidateId,
      score,
    }));

    // Sort descending by total score
    candidateList.sort((a, b) => b.score - a.score);
    const N = candidateList.length;

    // Group into Upper 27%, Lower 27%, and Middle 46%
    const cohortSize = Math.max(1, Math.round(N * ItemAnalysisEngine.UPPER_LOWER_RATIO));
    const upperCandidates = new Set(candidateList.slice(0, cohortSize).map((c) => c.candidateId));
    const lowerCandidates = new Set(candidateList.slice(Math.max(0, N - cohortSize)).map((c) => c.candidateId));

    // Calculate total exam score standard deviation for point-biserial
    const scores = candidateList.map((c) => c.score);
    const meanTotalScore = scores.reduce((sum, s) => sum + s, 0) / N;
    const totalScoreStdDev = Math.sqrt(
      scores.reduce((sum, s) => sum + Math.pow(s - meanTotalScore, 2), 0) / N
    );

    // Group responses by questionId
    const responseByQuestion = new Map<string, CandidateItemResponse[]>();
    for (const resp of responses) {
      const list = responseByQuestion.get(resp.questionId) || [];
      list.push(resp);
      responseByQuestion.set(resp.questionId, list);
    }

    const items: ItemAnalysisResult[] = [];
    let totalDifficulty = 0;
    let totalDiscrimination = 0;
    let flaggedCount = 0;
    let miskeyedCount = 0;

    for (const q of questions) {
      const qResponses = responseByQuestion.get(q.id) || [];
      const analysis = this.analyzeSingleItem({
        question: q,
        responses: qResponses,
        upperCandidates,
        lowerCandidates,
        candidateScoreMap,
        totalScoreStdDev,
      });

      items.push(analysis);
      totalDifficulty += analysis.difficultyIndex;
      totalDiscrimination += analysis.discriminationIndex;
      if (analysis.flags.length > 0) flaggedCount++;
      if (analysis.flags.includes('POSSIBLY_MISKEYED')) miskeyedCount++;
    }

    return {
      examId,
      totalQuestions: questions.length,
      totalCandidatesEvaluated: N,
      averageDifficulty: Math.round((totalDifficulty / questions.length) * 100) / 100,
      averageDiscrimination: Math.round((totalDiscrimination / questions.length) * 100) / 100,
      flaggedQuestionsCount: flaggedCount,
      miskeyedQuestionsCount: miskeyedCount,
      items,
    };
  }

  /**
   * Analyzes an individual question.
   */
  public analyzeSingleItem(params: {
    question: QuestionMetadata;
    responses: CandidateItemResponse[];
    upperCandidates: Set<string>;
    lowerCandidates: Set<string>;
    candidateScoreMap: Map<string, number>;
    totalScoreStdDev: number;
  }): ItemAnalysisResult {
    const { question, responses, upperCandidates, lowerCandidates, candidateScoreMap, totalScoreStdDev } = params;
    const totalAttempts = responses.length;

    if (totalAttempts === 0) {
      return {
        questionId: question.id,
        prompt: question.prompt,
        type: question.type,
        totalAttempts: 0,
        correctCount: 0,
        difficultyIndex: 0,
        discriminationIndex: 0,
        pointBiserial: 0,
        meanScore: 0,
        maxPoints: question.maxPoints,
        distractors: [],
        flags: [],
        recommendation: 'No responses recorded for this question.',
      };
    }

    let correctCount = 0;
    let totalScoreSum = 0;
    const correctCandidateScores: number[] = [];
    const incorrectCandidateScores: number[] = [];

    // Upper/Lower counts for discrimination
    let upperAttempts = 0;
    let upperCorrect = 0;
    let lowerAttempts = 0;
    let lowerCorrect = 0;

    for (const r of responses) {
      totalScoreSum += r.pointsAwarded;
      const candTotal = candidateScoreMap.get(r.candidateId) ?? r.totalExamScore;

      if (r.isCorrect) {
        correctCount++;
        correctCandidateScores.push(candTotal);
      } else {
        incorrectCandidateScores.push(candTotal);
      }

      if (upperCandidates.has(r.candidateId)) {
        upperAttempts++;
        if (r.isCorrect) upperCorrect++;
      } else if (lowerCandidates.has(r.candidateId)) {
        lowerAttempts++;
        if (r.isCorrect) lowerCorrect++;
      }
    }

    const meanScore = Math.round((totalScoreSum / totalAttempts) * 100) / 100;
    // Difficulty index p: Proportion of correct responses (or mean score / max points for partial credit)
    const rawP = question.maxPoints > 0 ? (totalScoreSum / (totalAttempts * question.maxPoints)) : (correctCount / totalAttempts);
    const difficultyIndex = Math.round(Math.max(0, Math.min(1, rawP)) * 1000) / 1000;

    // Discrimination index D: p_upper - p_lower
    const pUpper = upperAttempts > 0 ? upperCorrect / upperAttempts : 0;
    const pLower = lowerAttempts > 0 ? lowerCorrect / lowerAttempts : 0;
    const discriminationIndex = Math.round((pUpper - pLower) * 1000) / 1000;

    // Point-biserial correlation r_pbis
    let pointBiserial = 0;
    if (totalScoreStdDev > 0 && correctCount > 0 && correctCount < totalAttempts) {
      const meanX1 = correctCandidateScores.reduce((a, b) => a + b, 0) / correctCandidateScores.length;
      const meanX0 = incorrectCandidateScores.reduce((a, b) => a + b, 0) / incorrectCandidateScores.length;
      const p = correctCount / totalAttempts;
      const r = ((meanX1 - meanX0) / totalScoreStdDev) * Math.sqrt(p * (1 - p));
      pointBiserial = Math.round(Math.max(-1, Math.min(1, r)) * 1000) / 1000;
    }

    // Distractor Analysis (if options exist)
    const distractors: DistractorStat[] = [];
    const flags: ItemQualityFlag[] = [];

    if (question.options && question.options.length > 0) {
      const optionCountMap = new Map<string, { total: number; upper: number; lower: number; middle: number }>();
      for (const opt of question.options) {
        optionCountMap.set(opt.id, { total: 0, upper: 0, lower: 0, middle: 0 });
      }

      for (const r of responses) {
        if (r.selectedOptionId && optionCountMap.has(r.selectedOptionId)) {
          const counts = optionCountMap.get(r.selectedOptionId)!;
          counts.total++;
          if (upperCandidates.has(r.candidateId)) {
            counts.upper++;
          } else if (lowerCandidates.has(r.candidateId)) {
            counts.lower++;
          } else {
            counts.middle++;
          }
        }
      }

      let highestUpperDistractorCount = 0;
      let correctOptionUpperCount = 0;

      for (const opt of question.options) {
        const c = optionCountMap.get(opt.id) || { total: 0, upper: 0, lower: 0, middle: 0 };
        const selectedPct = totalAttempts > 0 ? Math.round((c.total / totalAttempts) * 1000) / 1000 : 0;
        const uRate = upperAttempts > 0 ? c.upper / upperAttempts : 0;
        const lRate = lowerAttempts > 0 ? c.lower / lowerAttempts : 0;
        const distDiscrim = Math.round((uRate - lRate) * 1000) / 1000;

        const isNonFunctioning = !opt.isCorrect && selectedPct < ItemAnalysisEngine.NON_FUNCTIONING_DISTRACTOR_THRESHOLD;
        const isAmbiguous = !opt.isCorrect && uRate >= ItemAnalysisEngine.AMBIGUOUS_DISTRACTOR_UPPER_THRESHOLD;

        if (opt.isCorrect) {
          correctOptionUpperCount = c.upper;
        } else {
          if (c.upper > highestUpperDistractorCount) {
            highestUpperDistractorCount = c.upper;
          }
        }

        if (isNonFunctioning && !flags.includes('NON_FUNCTIONING_DISTRACTOR')) {
          flags.push('NON_FUNCTIONING_DISTRACTOR');
        }
        if (isAmbiguous && !flags.includes('AMBIGUOUS_DISTRACTOR')) {
          flags.push('AMBIGUOUS_DISTRACTOR');
        }

        distractors.push({
          optionId: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
          totalSelected: c.total,
          selectedPercentage: selectedPct,
          upperGroupSelected: c.upper,
          lowerGroupSelected: c.lower,
          middleGroupSelected: c.middle,
          discrimination: distDiscrim,
          isNonFunctioning,
          isAmbiguous,
        });
      }

      // Check if a distractor was chosen by the upper group MORE frequently than the keyed answer
      if (highestUpperDistractorCount > correctOptionUpperCount && upperAttempts > 0) {
        flags.push('POSSIBLY_MISKEYED');
      }
    }

    // Psychometric Flags
    if (difficultyIndex > ItemAnalysisEngine.TOO_EASY_THRESHOLD) {
      flags.push('TOO_EASY');
    } else if (difficultyIndex < ItemAnalysisEngine.TOO_HARD_THRESHOLD) {
      flags.push('TOO_HARD');
    }

    if (discriminationIndex < 0 && !flags.includes('POSSIBLY_MISKEYED')) {
      flags.push('POSSIBLY_MISKEYED');
    } else if (discriminationIndex >= 0 && discriminationIndex < ItemAnalysisEngine.POOR_DISCRIMINATION_THRESHOLD) {
      flags.push('POOR_DISCRIMINATION');
    }

    // Recommendation synthesis
    let recommendation = 'Item exhibits sound psychometric properties.';
    if (flags.includes('POSSIBLY_MISKEYED')) {
      recommendation = 'CRITICAL: Negative discrimination or top performers selecting distractor. Check answer key immediately.';
    } else if (flags.includes('TOO_HARD') && flags.includes('POOR_DISCRIMINATION')) {
      recommendation = 'Item is excessively difficult and does not differentiate candidates. Consider revising wording or hints.';
    } else if (flags.includes('TOO_EASY')) {
      recommendation = 'Item is too easy (>90% pass rate). Useful for confidence building, but offers minimal discrimination.';
    } else if (flags.includes('POOR_DISCRIMINATION')) {
      recommendation = 'Item has low discrimination (D < 0.20). Review question clarity or replace distractors.';
    } else if (flags.includes('NON_FUNCTIONING_DISTRACTOR')) {
      recommendation = 'One or more distractors selected by <3% of candidates. Replace inactive options to maintain rigor.';
    }

    return {
      questionId: question.id,
      prompt: question.prompt,
      type: question.type,
      totalAttempts,
      correctCount,
      difficultyIndex,
      discriminationIndex,
      pointBiserial,
      meanScore,
      maxPoints: question.maxPoints,
      distractors,
      flags,
      recommendation,
    };
  }
}

export const itemAnalysisEngine = new ItemAnalysisEngine();

