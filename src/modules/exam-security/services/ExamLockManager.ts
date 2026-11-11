import { ExamSecurityState } from '../types/security.types';

export class ExamLockManager {
  private currentState: ExamSecurityState = 'INITIALIZING';
  private lockReason?: string;

  public activate(): void {
    this.currentState = 'ACTIVE';
  }

  public softLock(reason?: string): ExamSecurityState {
    this.currentState = 'SOFT_LOCKED';
    this.lockReason = reason || 'Exam soft-locked due to security rule evaluation.';
    return this.currentState;
  }

  public hardLock(reason?: string): ExamSecurityState {
    this.currentState = 'HARD_LOCKED';
    this.lockReason = reason || 'Exam hard-locked by invigilator or maximum severity violation.';
    return this.currentState;
  }

  public terminate(reason?: string): ExamSecurityState {
    this.currentState = 'TERMINATED';
    this.lockReason = reason || 'Exam session terminated due to unrecoverable security policy violation.';
    return this.currentState;
  }

  public unlock(): ExamSecurityState {
    this.currentState = 'ACTIVE';
    this.lockReason = undefined;
    return this.currentState;
  }

  public getState(): ExamSecurityState {
    return this.currentState;
  }

  public getLockReason(): string | undefined {
    return this.lockReason;
  }
}
