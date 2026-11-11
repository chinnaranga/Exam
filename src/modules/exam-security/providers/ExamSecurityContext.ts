import { createContext } from 'react';
import {
  RestrictionRule,
  ExamViolation,
  ViolationSeverity,
  ViolationCategory,
  ExamSecurityState,
} from '../types/security.types';

export interface ExamSecurityContextValue {
  securityState: ExamSecurityState;
  warningCount: number;
  maxWarnings: number;
  violations: ExamViolation[];
  activeRestrictions: RestrictionRule[];
  lockReason?: string;

  registerRestriction: (rule: RestrictionRule) => void;
  removeRestriction: (ruleId: string) => void;
  triggerViolation: (params: {
    ruleId: string;
    category: ViolationCategory;
    severity: ViolationSeverity;
    message: string;
    metadata?: Record<string, any>;
  }) => ExamViolation;
  lockExam: (type: 'SOFT' | 'HARD' | 'TERMINATE', reason?: string) => void;
  unlockExam: () => void;
}

export const ExamSecurityContext = createContext<ExamSecurityContextValue | undefined>(undefined);
