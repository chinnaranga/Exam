import React, { useReducer, useMemo, useRef, useEffect } from 'react';
import { ExamSecurityContext, ExamSecurityContextValue } from './ExamSecurityContext';
import { RestrictionManager } from '../core/RestrictionManager';
import {
  RestrictionRule,
  ExamViolation,
  ViolationSeverity,
  ViolationCategory,
  ExamSecurityState,
} from '../types/security.types';

interface State {
  securityState: ExamSecurityState;
  warningCount: number;
  maxWarnings: number;
  violations: ExamViolation[];
  activeRestrictions: RestrictionRule[];
  lockReason?: string;
}

type Action =
  | { type: 'SYNC_STATE'; payload: Partial<State> };

function securityReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SYNC_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export interface ExamSecurityProviderProps {
  children: React.ReactNode;
  maxWarnings?: number;
}

export const ExamSecurityProvider: React.FC<ExamSecurityProviderProps> = ({
  children,
  maxWarnings = 3,
}) => {
  const restrictionManagerRef = useRef<RestrictionManager>(new RestrictionManager());
  const manager = restrictionManagerRef.current;

  const [state, dispatch] = useReducer(securityReducer, {
    securityState: manager.lockManager.getState(),
    warningCount: manager.warningManager.getWarningCount(),
    maxWarnings,
    violations: manager.violationRegistry.getAll(),
    activeRestrictions: manager.restrictionRegistry.getAll(),
    lockReason: manager.lockManager.getLockReason(),
  });

  const syncState = () => {
    dispatch({
      type: 'SYNC_STATE',
      payload: {
        securityState: manager.lockManager.getState(),
        warningCount: manager.warningManager.getWarningCount(),
        violations: manager.violationRegistry.getAll(),
        activeRestrictions: manager.restrictionRegistry.getAll(),
        lockReason: manager.lockManager.getLockReason(),
      },
    });
  };

  const registerRestriction = (rule: RestrictionRule) => {
    manager.registerRestriction(rule);
    syncState();
  };

  const removeRestriction = (ruleId: string) => {
    manager.removeRestriction(ruleId);
    syncState();
  };

  const triggerViolation = (params: {
    ruleId: string;
    category: ViolationCategory;
    severity: ViolationSeverity;
    message: string;
    metadata?: Record<string, any>;
  }) => {
    const violation = manager.triggerViolation(params);
    syncState();
    return violation;
  };

  const lockExam = (type: 'SOFT' | 'HARD' | 'TERMINATE', reason?: string) => {
    manager.lockExam(type, reason);
    syncState();
  };

  const unlockExam = () => {
    manager.unlockExam();
    syncState();
  };

  const contextValue: ExamSecurityContextValue = useMemo(
    () => ({
      securityState: state.securityState,
      warningCount: state.warningCount,
      maxWarnings: state.maxWarnings,
      violations: state.violations,
      activeRestrictions: state.activeRestrictions,
      lockReason: state.lockReason,
      registerRestriction,
      removeRestriction,
      triggerViolation,
      lockExam,
      unlockExam,
    }),
    [state]
  );

  return (
    <ExamSecurityContext.Provider value={contextValue}>
      {children}
    </ExamSecurityContext.Provider>
  );
};
