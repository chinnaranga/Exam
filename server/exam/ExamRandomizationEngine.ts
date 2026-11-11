import crypto from 'crypto';
import express, { Request, Response, Router } from 'express';
import { ExamSessionAuthority, examSessionAuthority } from '../integrity/ExamSessionAuthority';
import { ViolationEngine, violationEngine } from '../integrity/ViolationEngine';

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ParameterizedConfig {
  template: string;
  params: Record<string, { min: number; max: number; step?: number }>;
  formula: string; // e.g. "packetSize * 8 / bandwidth"
  tolerance?: number; // e.g. 0.05 (5% tolerance) or absolute
  unit?: string;
}

export interface ExamQuestionDefinition {
  id: string;
  topic: string;
  sectionId: string;
  stem: string;
  type: 'MULTIPLE_CHOICE' | 'PARAMETERIZED_NUMERIC' | 'CODING' | 'ESSAY';
  points: number;
  options?: MultipleChoiceOption[];
  parameterizedConfig?: ParameterizedConfig;
  correctAnswer?: string | number;
  explanation?: string;
}

export interface QuestionPoolDefinition {
  topic: string;
  pickCount: number;
  questions: ExamQuestionDefinition[];
}

export interface SectionRulesDefinition {
  id: string;
  title: string;
  forwardOnly: boolean;
  lockOnComplete: boolean;
  perQuestionTimeCapSeconds?: number;
  pools: QuestionPoolDefinition[];
}

export interface ExamSpecification {
  examId: string;
  title: string;
  sections: SectionRulesDefinition[];
}

// Client-facing Question View (never contains isCorrect, answers, or explanations)
export interface ClientQuestionView {
  id: string;
  sectionId: string;
  topic: string;
  stem: string;
  type: 'MULTIPLE_CHOICE' | 'PARAMETERIZED_NUMERIC' | 'CODING' | 'ESSAY';
  points: number;
  options?: { id: string; text: string }[];
  unit?: string;
  perQuestionTimeCapSeconds?: number;
}

export interface ClientSectionView {
  id: string;
  title: string;
  forwardOnly: boolean;
  lockOnComplete: boolean;
  perQuestionTimeCapSeconds?: number;
  isLocked: boolean;
  isCompleted: boolean;
  questions: ClientQuestionView[];
}

export interface ClientExamView {
  examId: string;
  sessionId: string;
  candidateId: string;
  sections: ClientSectionView[];
}

export interface InternalAnswerKey {
  questionId: string;
  sectionId: string;
  type: 'MULTIPLE_CHOICE' | 'PARAMETERIZED_NUMERIC' | 'CODING' | 'ESSAY';
  points: number;
  correctOptionId?: string;
  calculatedNumericAnswer?: number;
  tolerance?: number;
}

export interface AutosaveLedgerRecord {
  index: number;
  sessionId: string;
  prevHash: string;
  seq: number;
  questionId: string;
  answer: unknown;
  timestamp: number;
  hash: string;
}

export interface GradingResult {
  sessionId: string;
  candidateId: string;
  examId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  evaluatedAt: number;
  questionResults: {
    questionId: string;
    pointsAwarded: number;
    maxPoints: number;
    isCorrect: boolean;
  }[];
}

/**
 * Deterministic PRNG (Mulberry32) seeded by string (such as sessionId).
 * Guarantees that the exact same sessionId produces identical shuffling and numeric values.
 */
export class SeededPRNG {
  private s: number;

  constructor(seedStr: string) {
    let h = 0x811c9dc5;
    for (let i = 0; i < seedStr.length; i++) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    this.s = h >>> 0;
  }

  public next(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  public nextInt(min: number, max: number, step = 1): number {
    const stepsCount = Math.floor((max - min) / step);
    const chosenStep = Math.floor(this.next() * (stepsCount + 1));
    return min + chosenStep * step;
  }

  public shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  public pickN<T>(array: T[], n: number): T[] {
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, Math.min(n, shuffled.length));
  }
}

/**
 * Safely evaluates standard arithmetic formula strings with variables without using dangerous eval().
 */
export function evaluateSafeFormula(formula: string, vars: Record<string, number>): number {
  let expr = formula;
  for (const [key, val] of Object.entries(vars)) {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    expr = expr.replace(regex, `(${val})`);
  }

  // Allow only digits, parentheses, decimal points, and basic arithmetic operators
  if (!/^[\d\s+\-*/().]+$/.test(expr)) {
    throw new Error(`Unsafe characters in arithmetic expression: ${formula}`);
  }

  // Safe function evaluation of pure arithmetic math
  const fn = new Function(`return (${expr});`);
  const result = fn();
  return Number(result);
}

export class ExamRandomizationEngine {
  private authority: ExamSessionAuthority;
  private violations: ViolationEngine;
  public readonly router: Router;

  // Stored session exam state and answer keys (server-side only)
  private sessionExamCache: Map<
    string,
    {
      examSpec: ExamSpecification;
      candidateView: ClientExamView;
      answerKeys: Map<string, InternalAnswerKey>;
      completedSections: Set<string>;
      submittedAnswers: Map<string, unknown>;
    }
  > = new Map();

  constructor(
    authority: ExamSessionAuthority = examSessionAuthority,
    violations: ViolationEngine = violationEngine
  ) {
    this.authority = authority;
    this.violations = violations;
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Generates a reproducible, randomized exam view for a specific candidate session.
   * - Shuffles questions using seeded PRNG.
   * - Shuffles options within multiple-choice questions.
   * - Samples question pools (N of M per topic).
   * - Evaluates parameterized numeric values into the question stem.
   * - Keeps answer key exclusively on the server.
   */
  public generateSessionExam(params: {
    sessionId: string;
    candidateId: string;
    examSpec: ExamSpecification;
  }): ClientExamView {
    const prng = new SeededPRNG(params.sessionId);
    const answerKeys = new Map<string, InternalAnswerKey>();
    const clientSections: ClientSectionView[] = [];

    for (const section of params.examSpec.sections) {
      const selectedQuestions: ExamQuestionDefinition[] = [];

      // 1. Question Pools (Pick N of M per topic)
      for (const pool of section.pools) {
        const picked = prng.pickN(pool.questions, pool.pickCount);
        selectedQuestions.push(...picked);
      }

      // 2. Shuffle Question Order within section
      const shuffledQuestions = prng.shuffle(selectedQuestions);
      const clientQuestions: ClientQuestionView[] = [];

      for (const q of shuffledQuestions) {
        if (q.type === 'MULTIPLE_CHOICE' && q.options) {
          // 3. Shuffle Options Order
          const shuffledOptions = prng.shuffle(q.options);
          const correctOpt = q.options.find((o) => o.isCorrect);

          answerKeys.set(q.id, {
            questionId: q.id,
            sectionId: section.id,
            type: 'MULTIPLE_CHOICE',
            points: q.points,
            correctOptionId: correctOpt?.id,
          });

          // Strip `isCorrect` from client view
          clientQuestions.push({
            id: q.id,
            sectionId: section.id,
            topic: q.topic,
            stem: q.stem,
            type: 'MULTIPLE_CHOICE',
            points: q.points,
            options: shuffledOptions.map((o) => ({ id: o.id, text: o.text })),
            perQuestionTimeCapSeconds: section.perQuestionTimeCapSeconds,
          });
        } else if (q.type === 'PARAMETERIZED_NUMERIC' && q.parameterizedConfig) {
          // 4. Parameterized Numeric Question: Generate random values and compute answer
          const pConfig = q.parameterizedConfig;
          const assignedVars: Record<string, number> = {};

          for (const [varName, range] of Object.entries(pConfig.params)) {
            const step = range.step || 1;
            assignedVars[varName] = prng.nextInt(range.min, range.max, step);
          }

          // Evaluate formula for expected answer
          const calculatedAnswer = evaluateSafeFormula(pConfig.formula, assignedVars);
          answerKeys.set(q.id, {
            questionId: q.id,
            sectionId: section.id,
            type: 'PARAMETERIZED_NUMERIC',
            points: q.points,
            calculatedNumericAnswer: calculatedAnswer,
            tolerance: pConfig.tolerance || 0.02,
          });

          // Substitute variables into question stem
          let interpolatedStem = pConfig.template;
          for (const [varName, val] of Object.entries(assignedVars)) {
            interpolatedStem = interpolatedStem.replace(new RegExp(`\\{${varName}\\}`, 'g'), String(val));
          }

          clientQuestions.push({
            id: q.id,
            sectionId: section.id,
            topic: q.topic,
            stem: interpolatedStem,
            type: 'PARAMETERIZED_NUMERIC',
            points: q.points,
            unit: pConfig.unit,
            perQuestionTimeCapSeconds: section.perQuestionTimeCapSeconds,
          });
        } else {
          // Other question types (Coding, Essay)
          answerKeys.set(q.id, {
            questionId: q.id,
            sectionId: section.id,
            type: q.type,
            points: q.points,
          });

          clientQuestions.push({
            id: q.id,
            sectionId: section.id,
            topic: q.topic,
            stem: q.stem,
            type: q.type,
            points: q.points,
            perQuestionTimeCapSeconds: section.perQuestionTimeCapSeconds,
          });
        }
      }

      clientSections.push({
        id: section.id,
        title: section.title,
        forwardOnly: section.forwardOnly,
        lockOnComplete: section.lockOnComplete,
        perQuestionTimeCapSeconds: section.perQuestionTimeCapSeconds,
        isLocked: false,
        isCompleted: false,
        questions: clientQuestions,
      });
    }

    const candidateView: ClientExamView = {
      examId: params.examSpec.examId,
      sessionId: params.sessionId,
      candidateId: params.candidateId,
      sections: clientSections,
    };

    this.sessionExamCache.set(params.sessionId, {
      examSpec: params.examSpec,
      candidateView,
      answerKeys,
      completedSections: new Set<string>(),
      submittedAnswers: new Map<string, unknown>(),
    });

    // Record exam generation in hash-chained ledger
    const examSession = this.authority.getSession(params.sessionId);
    if (examSession) {
      this.authority.appendLedgerRecord(examSession, {
        type: 'CANDIDATE_EXAM_RANDOMIZED',
        ts: Date.now(),
        payload: {
          sessionId: params.sessionId,
          candidateId: params.candidateId,
          sectionsCount: clientSections.length,
          totalQuestionsCount: clientSections.reduce((acc, s) => acc + s.questions.length, 0),
        },
      });
    }

    return candidateView;
  }

  /**
   * Section Rules Enforcement: Locks a completed section.
   */
  public completeSection(sessionId: string, sectionId: string): { success: boolean; error?: string } {
    const session = this.sessionExamCache.get(sessionId);
    if (!session) {
      throw new Error(`Exam session ${sessionId} not found`);
    }

    const sec = session.candidateView.sections.find((s) => s.id === sectionId);
    if (!sec) {
      throw new Error(`Section ${sectionId} not found`);
    }

    sec.isCompleted = true;
    if (sec.lockOnComplete) {
      sec.isLocked = true;
      session.completedSections.add(sectionId);
    }

    const examSession = this.authority.getSession(sessionId);
    if (examSession) {
      this.authority.appendLedgerRecord(examSession, {
        type: 'SECTION_COMPLETED_LOCKED',
        ts: Date.now(),
        payload: { sectionId, lockOnComplete: sec.lockOnComplete },
      });
    }

    return { success: true };
  }

  /**
   * Validates whether an answer submission is permissible under section rules.
   */
  public validateSubmissionRule(
    sessionId: string,
    questionId: string,
    sectionId: string
  ): { allowed: boolean; reason?: string } {
    const session = this.sessionExamCache.get(sessionId);
    if (!session) {
      return { allowed: false, reason: 'Session not found' };
    }

    if (session.completedSections.has(sectionId)) {
      return { allowed: false, reason: `Section ${sectionId} is locked and cannot be modified.` };
    }

    return { allowed: true };
  }

  /**
   * Server-side grading of candidate answers.
   */
  public gradeExam(sessionId: string, submissions: Record<string, unknown>): GradingResult {
    const session = this.sessionExamCache.get(sessionId);
    if (!session) {
      throw new Error(`Exam session ${sessionId} not found`);
    }

    let totalScore = 0;
    let maxScore = 0;
    const questionResults: GradingResult['questionResults'] = [];

    for (const [qId, key] of session.answerKeys.entries()) {
      maxScore += key.points;
      const candidateAnswer = submissions[qId];
      let isCorrect = false;

      if (key.type === 'MULTIPLE_CHOICE') {
        isCorrect = String(candidateAnswer) === String(key.correctOptionId);
      } else if (key.type === 'PARAMETERIZED_NUMERIC' && key.calculatedNumericAnswer !== undefined) {
        const numVal = Number(candidateAnswer);
        const tolerance = key.tolerance || 0.02;
        const diff = Math.abs(numVal - key.calculatedNumericAnswer);
        const allowedDiff = Math.abs(key.calculatedNumericAnswer) * tolerance || 0.01;
        isCorrect = diff <= allowedDiff;
      }

      const pointsAwarded = isCorrect ? key.points : 0;
      totalScore += pointsAwarded;

      questionResults.push({
        questionId: qId,
        pointsAwarded,
        maxPoints: key.points,
        isCorrect,
      });
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const result: GradingResult = {
      sessionId,
      candidateId: session.candidateView.candidateId,
      examId: session.candidateView.examId,
      totalScore,
      maxScore,
      percentage,
      passed: percentage >= 60,
      evaluatedAt: Date.now(),
      questionResults,
    };

    const examSession = this.authority.getSession(sessionId);
    if (examSession) {
      this.authority.appendLedgerRecord(examSession, {
        type: 'EXAM_EVALUATION_COMPLETED',
        ts: Date.now(),
        payload: {
          totalScore,
          maxScore,
          percentage,
          passed: result.passed,
        },
      });
    }

    return result;
  }

  /**
   * Hash-Chained Autosave Verification.
   * Verifies the cryptographic HMAC and prevHash continuity of local IndexedDB autosave records.
   */
  public verifyAutosaveChain(
    sessionId: string,
    records: AutosaveLedgerRecord[]
  ): { valid: boolean; brokenAtIndex?: number; error?: string } {
    const examSession = this.authority.getSession(sessionId);
    if (!examSession) {
      return { valid: false, error: `Session ${sessionId} not found` };
    }

    if (!records || records.length === 0) {
      return { valid: true };
    }

    const secretKey = examSession.sessionSecret;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      // 1. Verify prevHash link
      if (i === 0) {
        if (record.prevHash !== '0'.repeat(64)) {
          this.violations.processViolation(sessionId, {
            type: 'AUTOSAVE_CHAIN_TAMPERED',
            payload: { index: 0, reason: 'Invalid genesis prevHash' },
          });
          return { valid: false, brokenAtIndex: 0, error: 'Invalid genesis prevHash' };
        }
      } else {
        const prev = records[i - 1];
        if (record.prevHash !== prev.hash) {
          this.violations.processViolation(sessionId, {
            type: 'AUTOSAVE_CHAIN_TAMPERED',
            payload: { index: i, expectedPrevHash: prev.hash, receivedPrevHash: record.prevHash },
          });
          return { valid: false, brokenAtIndex: i, error: `Broken chain link at index ${i}` };
        }
      }

      // 2. Re-compute HMAC and verify signature
      const canonicalPayload = JSON.stringify({
        seq: record.seq,
        prevHash: record.prevHash,
        questionId: record.questionId,
        answer: record.answer,
        timestamp: record.timestamp,
      });

      const expectedHmac = crypto
        .createHmac('sha256', secretKey)
        .update(canonicalPayload)
        .digest('hex');

      if (record.hash !== expectedHmac) {
        this.violations.processViolation(sessionId, {
          type: 'AUTOSAVE_CHAIN_TAMPERED',
          payload: { index: i, expectedHmac, receivedHash: record.hash },
        });
        return { valid: false, brokenAtIndex: i, error: `HMAC verification failed at index ${i}` };
      }
    }

    return { valid: true };
  }

  public getSessionExamCache(sessionId: string) {
    return this.sessionExamCache.get(sessionId) || null;
  }

  public clear(): void {
    this.sessionExamCache.clear();
  }

  private setupRoutes(): void {
    // 1. Generate / Retrieve Candidate Randomized Exam View
    this.router.post('/:id/exam/initialize', (req: Request, res: Response) => {
      try {
        const { candidateId, examSpec } = req.body;
        const view = this.generateSessionExam({
          sessionId: req.params.id,
          candidateId: candidateId || 'cand_demo',
          examSpec,
        });
        res.json(view);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 2. Lock a Completed Section
    this.router.post('/:id/exam/section/complete', (req: Request, res: Response) => {
      try {
        const { sectionId } = req.body;
        const result = this.completeSection(req.params.id, sectionId);
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 3. Verify Local IndexedDB Hash-Chained Autosave
    this.router.post('/:id/autosave/sync', (req: Request, res: Response) => {
      try {
        const { records } = req.body;
        const result = this.verifyAutosaveChain(req.params.id, records);
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });

    // 4. Submit & Grade Exam
    this.router.post('/:id/exam/submit-grade', (req: Request, res: Response) => {
      try {
        const { submissions } = req.body;
        const result = this.gradeExam(req.params.id, submissions || {});
        res.json(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
      }
    });
  }
}

export const examRandomizationEngine = new ExamRandomizationEngine();
export default examRandomizationEngine;
