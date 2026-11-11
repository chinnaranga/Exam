import { FullscreenPolicyService } from './services/FullscreenPolicyService';
import { FullscreenDispatcher } from './services/FullscreenDispatcher';
import { FullscreenService } from './services/FullscreenService';
import { RestrictionManager } from '../core/RestrictionManager';

export class FullscreenEngine {
  public readonly policyService: FullscreenPolicyService;
  public readonly dispatcher: FullscreenDispatcher;
  public readonly service: FullscreenService;

  constructor(restrictionManager?: RestrictionManager) {
    this.policyService = new FullscreenPolicyService();
    this.dispatcher = new FullscreenDispatcher(restrictionManager);
    this.service = new FullscreenService(this.policyService, this.dispatcher);
  }

  public setContextData(data?: {
    studentId?: string;
    examId?: string;
    sessionId?: string;
    currentQuestion?: number;
    timeLeftSeconds?: number;
  }): void {
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
