import { ClipboardPolicyService } from './services/ClipboardPolicyService';
import { ClipboardDispatcher } from './services/ClipboardDispatcher';
import { ClipboardListener } from './services/ClipboardListener';
import { RestrictionManager } from '../core/RestrictionManager';

export class ClipboardProtectionEngine {
  public readonly policyService: ClipboardPolicyService;
  public readonly dispatcher: ClipboardDispatcher;
  public readonly listener: ClipboardListener;

  constructor(restrictionManager?: RestrictionManager) {
    this.policyService = new ClipboardPolicyService();
    this.dispatcher = new ClipboardDispatcher(restrictionManager);
    this.listener = new ClipboardListener(this.policyService, this.dispatcher);
  }

  public setContextData(data?: { studentId?: string; examId?: string; sessionId?: string }): void {
    this.listener.setContextData(data);
  }

  public start(): void {
    this.listener.start();
  }

  public stop(): void {
    this.listener.stop();
  }

  public getAnalytics() {
    return this.listener.analyticsService.getSummary();
  }
}
