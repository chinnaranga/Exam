import { KeyboardPolicyService } from './services/KeyboardPolicyService';
import { KeyboardDispatcher } from './services/KeyboardDispatcher';
import { KeyboardListener } from './services/KeyboardListener';
import { RestrictionManager } from '../core/RestrictionManager';

export class KeyboardRestrictionEngine {
  public readonly policyService: KeyboardPolicyService;
  public readonly dispatcher: KeyboardDispatcher;
  public readonly listener: KeyboardListener;

  constructor(restrictionManager?: RestrictionManager) {
    this.policyService = new KeyboardPolicyService();
    this.dispatcher = new KeyboardDispatcher(restrictionManager);
    this.listener = new KeyboardListener(this.policyService, this.dispatcher);
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
}
