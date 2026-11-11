import { RestrictionRegistry } from '../services/RestrictionRegistry';
import { ViolationRegistry } from '../services/ViolationRegistry';
import { WarningManager } from '../services/WarningManager';
import { ExamLockManager } from '../services/ExamLockManager';
import { SecurityEventBus } from '../events/SecurityEventBus';
import {
  RestrictionRule,
  ExamViolation,
  ViolationSeverity,
  ViolationCategory,
  ExamSecurityState,
} from '../types/security.types';
import { SECURITY_EVENT_TYPES } from '../constants/security.constants';

export class RestrictionManager {
  public readonly restrictionRegistry = new RestrictionRegistry();
  public readonly violationRegistry = new ViolationRegistry();
  public readonly warningManager = new WarningManager();
  public readonly lockManager = new ExamLockManager();
  public readonly eventBus = new SecurityEventBus();

  constructor() {
    this.lockManager.activate();
  }

  public registerRestriction(rule: RestrictionRule): void {
    this.restrictionRegistry.register(rule);
    this.eventBus.dispatch(SECURITY_EVENT_TYPES.RESTRICTION_REGISTERED, rule);
  }

  public removeRestriction(ruleId: string): void {
    this.restrictionRegistry.remove(ruleId);
    this.eventBus.dispatch(SECURITY_EVENT_TYPES.RESTRICTION_REMOVED, { ruleId });
  }

  public triggerViolation(params: {
    ruleId: string;
    category: ViolationCategory;
    severity: ViolationSeverity;
    message: string;
    metadata?: Record<string, any>;
  }): ExamViolation {
    const violation: ExamViolation = {
      id: `viol_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      ...params,
    };

    this.violationRegistry.add(violation);
    this.eventBus.dispatch(SECURITY_EVENT_TYPES.VIOLATION_TRIGGERED, violation);

    // Warning & Lock Evaluation
    if (params.severity === 'CRITICAL') {
      this.lockManager.hardLock(params.message);
      this.eventBus.dispatch(SECURITY_EVENT_TYPES.EXAM_LOCKED, { type: 'HARD_LOCK', reason: params.message });
    } else {
      const warningRes = this.warningManager.issueWarning(params.message);
      this.eventBus.dispatch(SECURITY_EVENT_TYPES.WARNING_ISSUED, warningRes);

      if (warningRes.isMaxReached) {
        this.lockManager.softLock('Maximum allowed security warnings exceeded.');
        this.eventBus.dispatch(SECURITY_EVENT_TYPES.EXAM_LOCKED, { type: 'SOFT_LOCK', reason: 'Max warnings reached' });
      }
    }

    return violation;
  }

  public lockExam(type: 'SOFT' | 'HARD' | 'TERMINATE', reason?: string): ExamSecurityState {
    let state: ExamSecurityState;
    if (type === 'SOFT') {
      state = this.lockManager.softLock(reason);
    } else if (type === 'HARD') {
      state = this.lockManager.hardLock(reason);
    } else {
      state = this.lockManager.terminate(reason);
    }

    this.eventBus.dispatch(SECURITY_EVENT_TYPES.EXAM_LOCKED, { type, reason });
    return state;
  }

  public unlockExam(): ExamSecurityState {
    const state = this.lockManager.unlock();
    this.eventBus.dispatch(SECURITY_EVENT_TYPES.EXAM_UNLOCKED, { state });
    return state;
  }
}
