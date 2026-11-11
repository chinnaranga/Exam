import { FullscreenPolicyService } from './FullscreenPolicyService';
import { BrowserCompatibility } from '../utils/BrowserCompatibility';

export class FullscreenRecoveryService {
  private policyService: FullscreenPolicyService;
  private recoveryAttempts = 0;
  private isPaused = false;

  constructor(policyService: FullscreenPolicyService) {
    this.policyService = policyService;
  }

  public handleExit(): { isPaused: boolean; recoveryAttempts: number; maxReached: boolean } {
    const rule = this.policyService.getRule();
    if (rule.pauseExamOnExit) {
      this.isPaused = true;
    }
    const maxReached = this.recoveryAttempts >= rule.maxRecoveryAttempts;
    return {
      isPaused: this.isPaused,
      recoveryAttempts: this.recoveryAttempts,
      maxReached,
    };
  }

  public async attemptRecovery(): Promise<boolean> {
    const rule = this.policyService.getRule();
    if (this.recoveryAttempts >= rule.maxRecoveryAttempts) {
      return false;
    }
    this.recoveryAttempts += 1;
    try {
      await BrowserCompatibility.requestFullscreen();
      this.isPaused = false;
      return true;
    } catch {
      return false;
    }
  }

  public getRecoveryAttempts(): number {
    return this.recoveryAttempts;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public reset(): void {
    this.recoveryAttempts = 0;
    this.isPaused = false;
  }
}
