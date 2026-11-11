import { MousePolicyService } from './services/MousePolicyService';
import { MouseDispatcher } from './services/MouseDispatcher';
import { MouseListener } from './services/MouseListener';
import { RestrictionManager } from '../core/RestrictionManager';

export class MouseRestrictionEngine {
  public readonly policyService: MousePolicyService;
  public readonly dispatcher: MouseDispatcher;
  public readonly listener: MouseListener;

  constructor(restrictionManager?: RestrictionManager) {
    this.policyService = new MousePolicyService();
    this.dispatcher = new MouseDispatcher(restrictionManager);
    this.listener = new MouseListener(this.policyService, this.dispatcher);
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
    return this.listener.analyticsEngine.getSummary();
  }

  public getTimeline() {
    return this.listener.analyticsEngine.getTimeline();
  }
}
