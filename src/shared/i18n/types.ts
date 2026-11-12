export type SupportedLanguage = 'en' | 'hi' | 'te';
export type TextDirection = 'ltr' | 'rtl';

export interface LanguageMetadata {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: TextDirection;
  defaultLocale: string;
  defaultTimezone: string;
}

export interface TranslationDictionary {
  // Navigation & Status
  examRunnerTitle: string;
  remainingTime: string;
  proctoredActive: string;
  fullscreenActive: string;
  offlineIndicator: string;
  connectedSecurely: string;
  section: string;
  questionNumber: string;
  ofTotal: string;

  // Actions
  nextQuestion: string;
  previousQuestion: string;
  flagForReview: string;
  clearSelection: string;
  submitExam: string;
  confirmSubmission: string;
  cancel: string;
  saveAndContinue: string;

  // Proctoring & Integrity Alerts
  criticalWarning: string;
  fullscreenViolationMsg: string;
  faceMissingMsg: string;
  multipleMonitorsMsg: string;
  pointsAccumulated: string;
  lockdownNotice: string;

  // Pre-Exam & Rules
  preExamRulesTitle: string;
  systemCheckPass: string;
  consentAgreement: string;
  agreeAndProceed: string;
  alternativeTesting: string;

  // Results & Scorecards
  resultsTitle: string;
  totalScore: string;
  gradeAssigned: string;
  percentileRank: string;
  passedExam: string;
  underReviewTitle: string;
  underReviewDesc: string;
  downloadTranscript: string;
  verifiedOnLedger: string;

  // Common
  loading: string;
  timezoneLabel: string;
}

