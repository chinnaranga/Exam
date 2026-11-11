import { FocusPolicyService } from './services/FocusPolicyService';
import { FocusDispatcher } from './services/FocusDispatcher';
import { FocusService } from './services/FocusService';
import { RestrictionManager } from '../core/RestrictionManager';

export class FocusEngine {
  public readonly policyService: FocusPolicyService;
  public readonly dispatcher: FocusDispatcher;
  public readonly service: FocusService;

  constructor(restrictionManager?: RestrictionManager) {
    this.policyService = new FocusPolicyService();
    this.dispatcher = new FocusDispatcher(restrictionManager);
    this.service = new FocusService(this.policyService, this.dispatcher);
  }

  public setContextData(data?: { studentId?: string; examId?: string; sessionId?: string }): void {
    this.service.setContextData(data);
  }

  public start(): void {
    this.service.start();
  }

  public stop(): void {
    this.service.stop();
  }

  public getAnalytics() {
    return this.service.analyticsService.getSummary();
  }
}
