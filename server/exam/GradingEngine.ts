import {
  QuestionDefinition,
  QuestionGradingEvaluation,
  QuestionType,
  MatchingConfig,
  OrderingConfig,
  FillInTheBlankConfig,
  NumericConfig,
  MathEquationConfig,
  ImageHotspotConfig,
  CaseStudyConfig,
} from './questionTypes';

/**
 * Server-Side Auto-Grading Engine for AssessIQ.
 * Evaluates objective question types, enforces partial credit, negative marking,
 * numeric tolerances, LaTeX equivalence, and hotspot boundary checks.
 */
export class GradingEngine {
  /**
   * Main evaluation entry point for a single question.
   */
  public evaluateQuestion(
    question: QuestionDefinition,
    candidateAnswer: unknown
  ): QuestionGradingEvaluation {
    const floor = question.negativeMarkingFloor ?? 0;

    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return this.evaluateMultipleChoice(question, candidateAnswer, floor);

      case 'MATCHING':
        return this.evaluateMatching(question, candidateAnswer, floor);

      case 'ORDERING':
        return this.evaluateOrdering(question, candidateAnswer, floor);

      case 'FILL_IN_THE_BLANK':
        return this.evaluateFillInTheBlank(question, candidateAnswer, floor);

      case 'NUMERIC':
      case 'PARAMETERIZED_NUMERIC':
        return this.evaluateNumeric(question, candidateAnswer, floor);

      case 'MATH_EQUATION':
        return this.evaluateMathEquation(question, candidateAnswer, floor);

      case 'IMAGE_HOTSPOT':
        return this.evaluateImageHotspot(question, candidateAnswer, floor);

      case 'CASE_STUDY':
        return this.evaluateCaseStudy(question, candidateAnswer, floor);

      default:
        // Subjective questions (Essay, File Upload, Audio/Video) require rubric evaluation
        return {
          questionId: question.id,
          type: question.type,
          maxPoints: question.points,
          pointsAwarded: 0,
          isCorrect: false,
          isPartial: false,
          feedback: 'Question requires manual or rubric evaluation.',
        };
    }
  }

  /**
   * 1. Multiple Choice Evaluation with Negative Marking
   */
  private evaluateMultipleChoice(
    question: QuestionDefinition,
    candidateAnswer: unknown,
    floor: number
  ): QuestionGradingEvaluation {
    const options = question.multipleChoiceOptions || [];
    const correctOpt = options.find((o) => o.isCorrect);
    const chosenId = String(candidateAnswer ?? '');
    const isCorrect = correctOpt ? chosenId === correctOpt.id : false;

    if (isCorrect) {
      return {
        questionId: question.id,
        type: 'MULTIPLE_CHOICE',
        maxPoints: question.points,
        pointsAwarded: question.points,
        isCorrect: true,
        isPartial: false,
        feedback: 'Correct response.',
      };
    }

    // Negative marking penalty for incorrect answer
    const penalty = question.negativeMarking ?? 0;
    const pointsAwarded = Math.max(floor, 0 - penalty);

    return {
      questionId: question.id,
      type: 'MULTIPLE_CHOICE',
      maxPoints: question.points,
      pointsAwarded,
      isCorrect: false,
      isPartial: false,
      feedback: penalty > 0 ? `Incorrect. Penalty of ${penalty} pts deducted.` : 'Incorrect response.',
    };
  }

  /**
   * 2. Matching Evaluation with Partial Credit & Per-Mismatch Negative Marking
   */
  private evaluateMatching(
    question: QuestionDefinition,
    candidateAnswer: unknown,
    floor: number
  ): QuestionGradingEvaluation {
    const config = question.matchingConfig;
    if (!config) {
      return this.fallbackZero(question, 'Missing matching configuration.');
    }

    const pairMap: Record<string, string> = {};
    if (Array.isArray(config.correctPairs)) {
      for (const p of config.correctPairs as any[]) {
        const left = p.leftId || p.premiseId;
        const right = p.rightId || p.responseId;
        if (left && right) {
          pairMap[left] = right;
        }
      }
    } else if (config.correctPairs && typeof config.correctPairs === 'object') {
      Object.assign(pairMap, config.correctPairs);
    }

    const submittedPairs = (candidateAnswer && typeof candidateAnswer === 'object' ? candidateAnswer : {}) as Record<
      string,
      string
    >;

    const totalPairs = Object.keys(pairMap).length;
    if (totalPairs === 0) {
      return this.fallbackZero(question, 'No matching pairs configured.');
    }

    let correctCount = 0;
    let incorrectCount = 0;

    for (const [leftId, expectedRightId] of Object.entries(pairMap)) {
      const chosenRightId = submittedPairs[leftId];
      if (chosenRightId === expectedRightId) {
        correctCount++;
      } else if (chosenRightId !== undefined && chosenRightId !== '') {
        incorrectCount++;
      }
    }

    const allowPartial = config.allowPartialCredit !== false;
    const pointsPerPair = question.points / totalPairs;
    const penaltyPerMismatch = config.negativeMarkingPerMismatch ?? (question.negativeMarking ? question.negativeMarking / totalPairs : 0);

    let rawScore = 0;
    if (allowPartial) {
      rawScore = correctCount * pointsPerPair - incorrectCount * penaltyPerMismatch;
    } else {
      rawScore = correctCount === totalPairs ? question.points : 0 - (question.negativeMarking ?? 0);
    }

    const pointsAwarded = Math.max(floor, Math.round(rawScore * 100) / 100);
    const isAllCorrect = correctCount === totalPairs;
    const isPartial = correctCount > 0 && !isAllCorrect;

    return {
      questionId: question.id,
      type: 'MATCHING',
      maxPoints: question.points,
      pointsAwarded,
      isCorrect: isAllCorrect,
      isPartial,
      feedback: `${correctCount}/${totalPairs} pairs correctly matched. ${
        incorrectCount > 0 && penaltyPerMismatch > 0 ? `(${incorrectCount} mismatches penalised)` : ''
      }`,
      breakdown: { correctCount, incorrectCount, totalPairs },
    };
  }

  /**
   * 3. Drag-and-Drop Ordering Evaluation with Sequence & Positional Partial Credit
   */
  private evaluateOrdering(
    question: QuestionDefinition,
    candidateAnswer: unknown,
    floor: number
  ): QuestionGradingEvaluation {
    const config = question.orderingConfig;
    if (!config || !config.correctOrder || config.correctOrder.length === 0) {
      return this.fallbackZero(question, 'Missing ordering configuration.');
    }

    const correct = config.correctOrder;
    const submitted = Array.isArray(candidateAnswer) ? candidateAnswer.map(String) : [];

    const isExact =
      submitted.length === correct.length && submitted.every((id, idx) => id === correct[idx]);

    if (isExact) {
      return {
        questionId: question.id,
        type: 'ORDERING',
        maxPoints: question.points,
        pointsAwarded: question.points,
        isCorrect: true,
        isPartial: false,
        feedback: 'Correct sequence.',
      };
    }

    const strategy = config.scoringStrategy || 'POSITIONAL_PARTIAL';
    let earnedRatio = 0;

    if (strategy === 'POSITIONAL_PARTIAL') {
      // Partial credit for items in their exact correct position
      let correctPositions = 0;
      for (let i = 0; i < correct.length; i++) {
        if (submitted[i] === correct[i]) {
          correctPositions++;
        }
      }
      earnedRatio = correctPositions / correct.length;
    } else if (strategy === 'PAIRWISE_ORDER') {
      // Pairwise relative ordering credit
      let correctPairs = 0;
      let totalPairs = 0;
      for (let i = 0; i < correct.length; i++) {
        for (let j = i + 1; j < correct.length; j++) {
          totalPairs++;
          const idxA = submitted.indexOf(correct[i]);
          const idxB = submitted.indexOf(correct[j]);
          if (idxA !== -1 && idxB !== -1 && idxA < idxB) {
            correctPairs++;
          }
        }
      }
      earnedRatio = totalPairs > 0 ? correctPairs / totalPairs : 0;
    }

    let calculatedPoints = earnedRatio * question.points;
    if (config.negativeMarking && earnedRatio === 0) {
      calculatedPoints -= config.negativeMarking;
    }

    const pointsAwarded = Math.max(floor, Math.round(calculatedPoints * 100) / 100);

    return {
      questionId: question.id,
      type: 'ORDERING',
      maxPoints: question.points,
      pointsAwarded,
      isCorrect: false,
      isPartial: pointsAwarded > 0,
      feedback: `Sequence partially matched (${Math.round(earnedRatio * 100)}% order correspondence).`,
    };
  }

  /**
   * 4. Fill-in-the-Blank with Multiple Blanks, Accepted Synonyms, and Negative Marking
   */
  private evaluateFillInTheBlank(
    question: QuestionDefinition,
    candidateAnswer: unknown,
    floor: number
  ): QuestionGradingEvaluation {
    const config = question.fillInTheBlankConfig;
    if (!config || !config.blanks || config.blanks.length === 0) {
      return this.fallbackZero(question, 'Missing fill-in-the-blank configuration.');
    }

    const blanks = config.blanks;
    const submitted = (candidateAnswer && typeof candidateAnswer === 'object' ? candidateAnswer : {}) as Record<
      string,
      string
    >;

    let correctCount = 0;
    let incorrectCount = 0;

    for (const blank of blanks) {
      const rawAns = submitted[blank.id] ?? '';
      const candidateText = blank.caseSensitive ? String(rawAns).trim() : String(rawAns).trim().toLowerCase();

      const matched = blank.acceptedAnswers.some((accepted) => {
        const target = blank.caseSensitive ? accepted.trim() : accepted.trim().toLowerCase();

        if (blank.numericTolerance !== undefined) {
          const numCandidate = parseFloat(candidateText);
          const numTarget = parseFloat(target);
          if (!isNaN(numCandidate) && !isNaN(numTarget)) {
            return Math.abs(numCandidate - numTarget) <= blank.numericTolerance;
          }
        }

        return candidateText === target;
      });

      if (matched && candidateText.length > 0) {
        correctCount++;
      } else if (candidateText.length > 0) {
        incorrectCount++;
      }
    }

    const allowPartial = config.allowPartialCredit !== false;
    const pointsPerBlank = question.points / blanks.length;
    const penaltyPerBlank = config.negativeMarkingPerBlank ?? 0;

    let rawScore = 0;
    if (allowPartial) {
      rawScore = correctCount * pointsPerBlank - incorrectCount * penaltyPerBlank;
    } else {
      rawScore = correctCount === blanks.length ? question.points : 0 - (question.negativeMarking ?? 0);
    }

    const pointsAwarded = Math.max(floor, Math.round(rawScore * 100) / 100);
    const isAllCorrect = correctCount === blanks.length;

    return {
      questionId: question.id,
      type: 'FILL_IN_THE_BLANK',
      maxPoints: question.points,
      pointsAwarded,
      isCorrect: isAllCorrect,
      isPartial: correctCount > 0 && !isAllCorrect,
      feedback: `${correctCount}/${blanks.length} blanks answered correctly.`,
      breakdown: { correctCount, incorrectCount, totalBlanks: blanks.length },
    };
  }

  /**
   * 5. Numeric Evaluation with Absolute/Percentage Tolerance and Units
   */
  private evaluateNumeric(
    question: QuestionDefinition,
    candidateAnswer: unknown,
    floor: number
  ): QuestionGradingEvaluation {
    const config = question.numericConfig;
    if (!config) {
      return this.fallbackZero(question, 'Missing numeric answer configuration.');
    }

    let candidateVal: number = NaN;
    let candidateUnit: string | undefined = undefined;

    if (typeof candidateAnswer === 'number') {
      candidateVal = candidateAnswer;
    } else if (typeof candidateAnswer === 'string') {
      // Parse string with potential unit e.g. "120.5 ms"
      const match = candidateAnswer.trim().match(/^([-+]?[0-9]*\.?[0-9]+)\s*([a-zA-Z/%]*)$/);
      if (match) {
        candidateVal = parseFloat(match[1]);
        candidateUnit = match[2] ? match[2].trim() : undefined;
      }
    } else if (candidateAnswer && typeof candidateAnswer === 'object') {
      const obj = candidateAnswer as { value?: number | string; unit?: string };
      candidateVal = typeof obj.value === 'number' ? obj.value : parseFloat(String(obj.value || ''));
      candidateUnit = obj.unit?.trim();
    }

    if (isNaN(candidateVal)) {
      const penalty = config.negativeMarking ?? question.negativeMarking ?? 0;
      return {
        questionId: question.id,
        type: 'NUMERIC',
        maxPoints: question.points,
        pointsAwarded: Math.max(floor, 0 - penalty),
        isCorrect: false,
        isPartial: false,
        feedback: 'Invalid numeric input.',
      };
    }

    // Check tolerance
    const expected = config.expectedValue;
    const diff = Math.abs(candidateVal - expected);
    let allowedDiff = 0;

    if (config.toleranceType === 'PERCENTAGE') {
      allowedDiff = Math.abs(expected) * config.toleranceValue;
    } else {
      allowedDiff = config.toleranceValue;
    }

    const valueMatches = diff <= allowedDiff + 1e-9;

    // Check unit if required
    let unitMatches = true;
    if (config.requiredUnit) {
      if (candidateUnit) {
        unitMatches = config.unitCaseSensitive
          ? candidateUnit === config.requiredUnit
          : candidateUnit.toLowerCase() === config.requiredUnit.toLowerCase();
      } else if (config.strictUnit) {
        unitMatches = false;
      }
    }

    const isCorrect = valueMatches && unitMatches;

    if (isCorrect) {
      return {
        questionId: question.id,
        type: 'NUMERIC',
        maxPoints: question.points,
        pointsAwarded: question.points,
        isCorrect: true,
        isPartial: false,
        feedback: `Correct (Within allowed tolerance ±${allowedDiff.toFixed(2)}${
          config.requiredUnit ? ` ${config.requiredUnit}` : ''
        }).`,
      };
    }

    // Partial credit if value is correct but unit is missing/incorrect
    if (valueMatches && !unitMatches && config.requiredUnit) {
      const halfPoints = Math.round((question.points * 0.5) * 100) / 100;
      return {
        questionId: question.id,
        type: 'NUMERIC',
        maxPoints: question.points,
        pointsAwarded: halfPoints,
        isCorrect: false,
        isPartial: true,
        feedback: `Numeric value correct, but unit "${candidateUnit || 'none'}" does not match required unit "${config.requiredUnit}".`,
      };
    }

    const penalty = config.negativeMarking ?? question.negativeMarking ?? 0;
    return {
      questionId: question.id,
      type: 'NUMERIC',
      maxPoints: question.points,
      pointsAwarded: Math.max(floor, 0 - penalty),
      isCorrect: false,
      isPartial: false,
      feedback: `Incorrect value (${candidateVal}). Difference (${diff.toFixed(2)}) exceeds tolerance limit (${allowedDiff.toFixed(2)}).`,
    };
  }

  /**
   * 6. Math Equation Input Evaluation with Canonical LaTeX Normalization
   */
  private evaluateMathEquation(
    question: QuestionDefinition,
    candidateAnswer: unknown,
    floor: number
  ): QuestionGradingEvaluation {
    const config = question.mathEquationConfig;
    if (!config) {
      return this.fallbackZero(question, 'Missing math equation configuration.');
    }

    const candidateLatex = this.normalizeLatex(String(candidateAnswer || ''));
    const expectedLatex = this.normalizeLatex(config.expectedLatex);
    const variations = (config.acceptedVariations || []).map((v) => this.normalizeLatex(v));

    const matches = candidateLatex === expectedLatex || variations.includes(candidateLatex);

    if (matches && candidateLatex.length > 0) {
      return {
        questionId: question.id,
        type: 'MATH_EQUATION',
        maxPoints: question.points,
        pointsAwarded: question.points,
        isCorrect: true,
        isPartial: false,
        feedback: 'Correct mathematical expression.',
      };
    }

    const penalty = config.negativeMarking ?? question.negativeMarking ?? 0;
    return {
      questionId: question.id,
      type: 'MATH_EQUATION',
      maxPoints: question.points,
      pointsAwarded: Math.max(floor, 0 - penalty),
      isCorrect: false,
      isPartial: false,
      feedback: 'Mathematical formula does not match canonical solution.',
    };
  }

  /**
   * 7. Image Hotspot Evaluation (Boundary Coordinate Check)
   */
  private evaluateImageHotspot(
    question: QuestionDefinition,
    candidateAnswer: unknown,
    floor: number
  ): QuestionGradingEvaluation {
    const config = question.imageHotspotConfig;
    if (!config || !config.zones || config.zones.length === 0) {
      return this.fallbackZero(question, 'Missing image hotspot configuration.');
    }

    const coords = (candidateAnswer && typeof candidateAnswer === 'object' ? candidateAnswer : {}) as {
      x?: number;
      y?: number;
    };

    if (coords.x === undefined || coords.y === undefined) {
      return {
        questionId: question.id,
        type: 'IMAGE_HOTSPOT',
        maxPoints: question.points,
        pointsAwarded: floor,
        isCorrect: false,
        isPartial: false,
        feedback: 'No hotspot coordinates clicked.',
      };
    }

    const { x, y } = coords;
    let hitTargetZone = false;

    for (const zone of config.zones) {
      if (!config.targetZoneIds.includes(zone.id)) continue;

      if (zone.shape === 'RECTANGLE' && zone.coordinates.width && zone.coordinates.height) {
        const inX = x >= zone.coordinates.x && x <= zone.coordinates.x + zone.coordinates.width;
        const inY = y >= zone.coordinates.y && y <= zone.coordinates.y + zone.coordinates.height;
        if (inX && inY) {
          hitTargetZone = true;
          break;
        }
      } else if (zone.shape === 'CIRCLE' && zone.coordinates.radius) {
        const dx = x - zone.coordinates.x;
        const dy = y - zone.coordinates.y;
        if (dx * dx + dy * dy <= zone.coordinates.radius * zone.coordinates.radius) {
          hitTargetZone = true;
          break;
        }
      }
    }

    if (hitTargetZone) {
      return {
        questionId: question.id,
        type: 'IMAGE_HOTSPOT',
        maxPoints: question.points,
        pointsAwarded: question.points,
        isCorrect: true,
        isPartial: false,
        feedback: 'Hotspot correctly located on visual artifact.',
      };
    }

    const penalty = config.negativeMarkingPerWrongClick ?? question.negativeMarking ?? 0;
    return {
      questionId: question.id,
      type: 'IMAGE_HOTSPOT',
      maxPoints: question.points,
      pointsAwarded: Math.max(floor, 0 - penalty),
      isCorrect: false,
      isPartial: false,
      feedback: `Target area missed (Clicked at [${x.toFixed(1)}, ${y.toFixed(1)}]).`,
    };
  }

  /**
   * 8. Case Study: Recursive Evaluation of Sub-Questions
   */
  private evaluateCaseStudy(
    question: QuestionDefinition,
    candidateAnswer: unknown,
    floor: number
  ): QuestionGradingEvaluation {
    const config = question.caseStudyConfig;
    if (!config || !config.subQuestions || config.subQuestions.length === 0) {
      return this.fallbackZero(question, 'Missing case study sub-questions.');
    }

    const answersMap = (candidateAnswer && typeof candidateAnswer === 'object' ? candidateAnswer : {}) as Record<
      string,
      unknown
    >;

    let totalAwarded = 0;
    let totalMax = 0;
    let allSubCorrect = true;
    const subEvaluations: QuestionGradingEvaluation[] = [];

    for (const subQ of config.subQuestions) {
      const subAns = answersMap[subQ.id];
      const evalResult = this.evaluateQuestion(subQ, subAns);
      subEvaluations.push(evalResult);
      totalAwarded += evalResult.pointsAwarded;
      totalMax += evalResult.maxPoints;
      if (!evalResult.isCorrect) {
        allSubCorrect = false;
      }
    }

    const pointsAwarded = Math.max(floor, totalAwarded);

    return {
      questionId: question.id,
      type: 'CASE_STUDY',
      maxPoints: totalMax,
      pointsAwarded,
      isCorrect: allSubCorrect,
      isPartial: pointsAwarded > 0 && !allSubCorrect,
      feedback: `Case study sub-questions evaluated: ${pointsAwarded}/${totalMax} points earned.`,
      breakdown: { subEvaluations },
    };
  }

  /**
   * Canonical LaTeX string normalizer
   */
  private normalizeLatex(str: string): string {
    return str
      .replace(/\s+/g, '') // remove whitespace
      .replace(/\\cdot/g, '*')
      .replace(/\\times/g, '*')
      .replace(/\\left/g, '')
      .replace(/\\right/g, '')
      .replace(/\{(\w)\}/g, '$1') // e.g. {x} -> x
      .toLowerCase();
  }

  private fallbackZero(question: QuestionDefinition, feedback: string): QuestionGradingEvaluation {
    return {
      questionId: question.id,
      type: question.type,
      maxPoints: question.points,
      pointsAwarded: question.negativeMarkingFloor ?? 0,
      isCorrect: false,
      isPartial: false,
      feedback,
    };
  }
}

export const gradingEngine = new GradingEngine();
export default gradingEngine;
