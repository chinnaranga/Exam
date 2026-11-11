// AssessIQ Enterprise Exam Security & Restriction Framework Types
// Pearson VUE & CodeSignal Grade Architecture

export type ViolationSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ViolationCategory = 'BROWSER' | 'INPUT' | 'MEDIA' | 'NETWORK' | 'SYSTEM';

export type ExamSecurityState =
  | 'INITIALIZING'
  | 'ACTIVE'
  | 'WARNING'
  | 'SOFT_LOCKED'
  | 'HARD_LOCKED'
  | 'TERMINATED';

export type LockAction = 'NONE' | 'SOFT_LOCK' | 'HARD_LOCK' | 'TERMINATE';

export type WarningAction = 'DISPLAY_WARNING' | 'INCREMENT_WARNING' | 'AUTO_LOCK';

export interface ExamViolation {
  id: string;
  ruleId: string;
  category: ViolationCategory;
  severity: ViolationSeverity;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface RestrictionRule {
  id: string;
  name: string;
  category: ViolationCategory;
  severity: ViolationSeverity;
  isEnabled: boolean;
  maxAllowedViolations?: number;
  metadata?: Record<string, any>;
}

export interface SecurityEvent {
  type: string;
  payload: any;
  timestamp: string;
}

export interface ExamSecurityContextState {
  securityState: ExamSecurityState;
  warningCount: number;
  maxWarnings: number;
  violations: ExamViolation[];
  activeRestrictions: RestrictionRule[];
  lockReason?: string;
}
