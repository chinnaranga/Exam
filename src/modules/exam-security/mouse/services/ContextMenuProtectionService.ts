import { MousePolicyService } from './MousePolicyService';
import { MouseDispatcher } from './MouseDispatcher';
import { MouseEventNormalizer } from '../utils/MouseEventNormalizer';

export class ContextMenuProtectionService {
  private policyService: MousePolicyService;
  private dispatcher: MouseDispatcher;
  private isListening = false;
  private contextData?: { studentId?: string; examId?: string; sessionId?: string };

  constructor(policyService: MousePolicyService, dispatcher: MouseDispatcher) {
    this.policyService = policyService;
    this.dispatcher = dispatcher;
  }

  public setContextData(data?: { studentId?: string; examId?: string; sessionId?: string }): void {
    this.contextData = data;
  }

  public start(): void {
    if (this.isListening || typeof window === 'undefined') return;
    this.isListening = true;
    document.addEventListener('contextmenu', this.handleContextMenu, true);
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;
    document.removeEventListener('contextmenu', this.handleContextMenu, true);
  }

  private handleContextMenu = (e: MouseEvent) => {
    const rule = this.policyService.getRuleForInteraction('CONTEXT_MENU');
    if (!rule || rule.action === 'ALLOW' || rule.action === 'IGNORE') return;

    if (rule.preventDefault) {
      e.preventDefault();
    }
    if (rule.stopPropagation) {
      e.stopPropagation();
    }

    const normalized = MouseEventNormalizer.normalize(
      e,
      'CONTEXT_MENU',
      rule.action,
      rule.description,
      this.contextData
    );

    this.dispatcher.dispatch(normalized, rule);
  };
}
