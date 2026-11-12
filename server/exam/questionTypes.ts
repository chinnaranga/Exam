/**
 * Question Types and Grading Specifications for AssessIQ
 * Supports enterprise multi-format questions, rubrics, double-marking, and regrade appeals.
 */

export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'MATCHING'
  | 'ORDERING'
  | 'FILL_IN_THE_BLANK'
  | 'NUMERIC'
  | 'MATH_EQUATION'
  | 'IMAGE_HOTSPOT'
  | 'CASE_STUDY'
  | 'FILE_UPLOAD'
  | 'AUDIO_VIDEO_RESPONSE'
  | 'ESSAY'
  | 'CODING'
  | 'PARAMETERIZED_NUMERIC';

export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type QuestionApprovalStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'ARCHIVED';

// ─── Question Configurations ──────────────────────────────────────────────────

// 1. Matching
export interface MatchingPair {
  leftId: string;
  leftText: string;
  rightId: string;
  rightText: string;
}

export interface MatchingConfig {
  premises: { id: string; text: string }[];
  responses: { id: string; text: string }[];
  correctPairs: Record<string, string>; // leftId -> rightId
  allowPartialCredit?: boolean; // Default: true (points proportional to correct pairs)
  negativeMarkingPerMismatch?: number; // Penalty points per incorrect match (e.g. 0.5)
}

// 2. Drag-and-Drop Ordering
export interface OrderingItem {
  id: string;
  text: string;
}

export interface OrderingConfig {
  items: OrderingItem[];
  correctOrder: string[]; // Ordered list of item IDs
  scoringStrategy?: 'EXACT_SEQUENCE' | 'PAIRWISE_ORDER' | 'POSITIONAL_PARTIAL';
  negativeMarking?: number;
}

// 3. Fill-in-the-Blank
export interface BlankDefinition {
  id: string; // e.g. "blank_1"
  acceptedAnswers: string[]; // Synonyms and acceptable alternate spellings
  caseSensitive?: boolean; // Default: false
  numericTolerance?: number; // If blank is a number
}

export interface FillInTheBlankConfig {
  template: string; // Stem with markers e.g. "Raft consensus elects a {blank_1} to manage {blank_2}."
  blanks: BlankDefinition[];
  allowPartialCredit?: boolean; // Default: true (points per correct blank)
  negativeMarkingPerBlank?: number; // Penalty deducted for incorrect blanks
}

// 4. Numeric Answer with Tolerance and Units
export interface NumericConfig {
  expectedValue: number;
  toleranceType: 'PERCENTAGE' | 'ABSOLUTE';
  toleranceValue: number; // e.g. 0.05 for 5% or 0.2 for absolute ±0.2
  requiredUnit?: string; // e.g. "ms", "MB/s", "kg"
  unitCaseSensitive?: boolean;
  strictUnit?: boolean; // If true, missing unit results in partial credit
  negativeMarking?: number;
}

// 5. Math Equation Input with LaTeX
export interface MathEquationConfig {
  expectedLatex: string;
  canonicalExpression?: string; // e.g. "E = mc^2"
  acceptedVariations?: string[]; // Alternate valid LaTeX forms
  negativeMarking?: number;
}

// 6. Image Hotspot
export interface HotspotZone {
  id: string;
  shape: 'RECTANGLE' | 'CIRCLE';
  coordinates: {
    x: number; // Percentage (0-100) or pixel
    y: number; // Percentage (0-100) or pixel
    width?: number;
    height?: number;
    radius?: number;
  };
  label?: string;
}

export interface ImageHotspotConfig {
  imageUrl: string;
  imageAltText?: string;
  zones: HotspotZone[];
  targetZoneIds: string[]; // Correct zones that award credit
  allowMultiSelect?: boolean;
  negativeMarkingPerWrongClick?: number;
}

// 7. Case Study with Shared Passage & Sub-Questions
export interface CaseStudyConfig {
  passageTitle: string;
  passageContent: string; // Rich text / markdown / clinical scenario
  passageMediaUrl?: string;
  subQuestions: QuestionDefinition[];
}

// 8. File Upload
export interface FileUploadConfig {
  allowedFileTypes: string[]; // e.g. ['.pdf', '.png', '.jpg', '.jpeg']
  maxFileSizeMb: number; // e.g. 10 (10MB)
  virusScanRequired: boolean; // Default: true
  rubricId?: string;
}

// 9. Audio/Video Response
export interface AudioVideoConfig {
  mediaType: 'AUDIO' | 'VIDEO';
  maxDurationSeconds: number; // e.g. 180s (3 minutes)
  rubricId?: string;
}

// 10. Rubric Criteria for Subjective Questions
export interface RubricLevel {
  id: string;
  label: string; // e.g. 'Exemplary', 'Proficient', 'Developing', 'Inadequate'
  points: number;
  description: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description?: string;
  maxPoints: number;
  weight?: number; // e.g. 1.0 (default)
  levels: RubricLevel[];
}

export interface RubricDefinition {
  id: string;
  title: string;
  description?: string;
  criteria: RubricCriterion[];
}

// ─── Master Question Definition ───────────────────────────────────────────────

export interface QuestionDefinition {
  id: string;
  code?: string;
  version: number;
  topic: string;
  tags?: string[];
  learningOutcome?: string;
  difficulty: QuestionDifficulty;
  status: QuestionApprovalStatus;
  authorId?: string;
  reviewerId?: string;
  approvedBy?: string;
  reviewedAt?: number;
  approvalNotes?: string;
  stem: string;
  type: QuestionType;
  points: number;
  negativeMarkingFloor?: number; // Lowest score possible (default 0)
  negativeMarking?: number; // Default penalty for total failure

  // Configurations per type
  multipleChoiceOptions?: { id: string; text: string; isCorrect: boolean }[];
  options?: { id: string; text: string; isCorrect?: boolean }[];
  matchingConfig?: MatchingConfig;
  orderingConfig?: OrderingConfig;
  fillInTheBlankConfig?: FillInTheBlankConfig;
  numericConfig?: NumericConfig;
  mathEquationConfig?: MathEquationConfig;
  imageHotspotConfig?: ImageHotspotConfig;
  caseStudyConfig?: CaseStudyConfig;
  fileUploadConfig?: FileUploadConfig;
  audioVideoConfig?: AudioVideoConfig;
  rubric?: RubricDefinition;
  explanation?: string;
}

// ─── Client Safe Question View ───────────────────────────────────────────────

export interface ClientQuestionPayload {
  id: string;
  topic: string;
  stem: string;
  type: QuestionType;
  points: number;
  tags?: string[];
  difficulty: QuestionDifficulty;

  multipleChoiceOptions?: { id: string; text: string }[];
  matchingConfig?: {
    premises: { id: string; text: string }[];
    responses: { id: string; text: string }[];
  };
  orderingConfig?: {
    items: { id: string; text: string }[];
  };
  fillInTheBlankConfig?: {
    template: string;
    blankIds: string[];
  };
  numericConfig?: {
    requiredUnit?: string;
  };
  mathEquationConfig?: {
    hasLatexInput: boolean;
  };
  imageHotspotConfig?: {
    imageUrl: string;
    imageAltText?: string;
  };
  caseStudyConfig?: {
    passageTitle: string;
    passageContent: string;
    passageMediaUrl?: string;
    subQuestions: ClientQuestionPayload[];
  };
  fileUploadConfig?: {
    allowedFileTypes: string[];
    maxFileSizeMb: number;
  };
  audioVideoConfig?: {
    mediaType: 'AUDIO' | 'VIDEO';
    maxDurationSeconds: number;
  };
  rubricSummary?: {
    criteriaNames: string[];
  };
}

// ─── Grading Results & Evaluations ──────────────────────────────────────────

export interface QuestionGradingEvaluation {
  questionId: string;
  type: QuestionType;
  maxPoints: number;
  pointsAwarded: number;
  isCorrect: boolean;
  isPartial: boolean;
  feedback?: string;
  breakdown?: Record<string, unknown>;
}

export interface RubricEvaluationEntry {
  criterionId: string;
  selectedLevelId: string;
  pointsAwarded: number;
  comment?: string;
}

export interface RubricEvaluationResult {
  rubricId: string;
  graderId: string;
  evaluatedAt: number;
  totalScore: number;
  maxScore: number;
  percentage?: number;
  criteriaResults: RubricEvaluationEntry[];
  generalFeedback?: string;
}

// ─── Double-Marking & Disagreement ──────────────────────────────────────────

export interface AnonymizedSubmission {
  anonymousSubmissionId: string;
  examId: string;
  questionId: string;
  submittedContent: unknown;
  submittedAt: number;
}

export interface GraderEvaluation {
  graderId: string;
  score: number;
  maxScore: number;
  evaluatedAt: number;
  rubricEvaluation?: RubricEvaluationResult;
  notes?: string;
}

export interface DoubleMarkingRecord {
  submissionId: string;
  anonymizedId: string;
  questionId: string;
  maxScore: number;
  graderA?: GraderEvaluation;
  graderB?: GraderEvaluation;
  status: 'PENDING_GRADERS' | 'CONCURRED' | 'DISAGREEMENT_FLAGGED' | 'ARBITRATED';
  scoreDisparity?: number;
  scoreDisparityPercentage?: number;
  disparityAbsolute?: number;
  disparityPercentage?: number;
  thirdGraderArbitration?: GraderEvaluation & { arbitrationNotes: string };
  thirdGrader?: GraderEvaluation & { arbitrationNotes?: string };
  finalAuthoritativeScore?: number;
  finalScore?: number;
}

// ─── Regrade Request Specification ──────────────────────────────────────────

export interface DisputedQuestionRequest {
  questionId: string;
  currentPoints?: number;
  originalPointsAwarded?: number;
  requestedPoints?: number;
  candidateReason?: string;
  candidateRationale?: string;
}

export interface RegradeRequest {
  regradeId: string;
  sessionId: string;
  candidateId: string;
  examId: string;
  submittedAt: number;
  disputedQuestions: DisputedQuestionRequest[];
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'PARTIALLY_APPROVED' | 'REJECTED';
  reviewerId?: string;
  reviewedAt?: number;
  reviewerNotes?: string;
  originalTotalScore: number;
  newTotalScore?: number;
  revisedTotalScore?: number;
  scoreAdjustmentDelta?: number;
}
