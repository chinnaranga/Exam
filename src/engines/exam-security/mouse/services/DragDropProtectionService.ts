import { MousePolicyService } from './MousePolicyService';
import { MouseDispatcher } from './MouseDispatcher';
import { MouseEventNormalizer } from '../utils/MouseEventNormalizer';

export class DragDropProtectionService {
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
    document.addEventListener('dragstart', this.handleDragStart, true);
    document.addEventListener('dragover', this.handleDragOver, true);
    document.addEventListener('drop', this.handleDrop, true);
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;
    document.removeEventListener('dragstart', this.handleDragStart, true);
    document.removeEventListener('dragover', this.handleDragOver, true);
    document.removeEventListener('drop', this.handleDrop, true);
  }

  private handleDragStart = (e: DragEvent) => {
    const rule = this.policyService.getRuleForInteraction('DRAG_START');
    if (!rule || rule.action === 'ALLOW' || rule.action === 'IGNORE') return;

    if (rule.preventDefault) e.preventDefault();
    if (rule.stopPropagation) e.stopPropagation();

    const normalized = MouseEventNormalizer.normalize(e, 'DRAG_START', rule.action, rule.description, this.contextData);
    this.dispatcher.dispatch(normalized, rule);
  };

  private handleDragOver = (e: DragEvent) => {
    const rule = this.policyService.getRuleForInteraction('DRAG_OVER');
    if (rule && rule.action === 'BLOCK') {
      e.preventDefault();
    }
  };

  private handleDrop = (e: DragEvent) => {
    const rule = this.policyService.getRuleForInteraction('DROP');
    if (!rule || rule.action === 'ALLOW' || rule.action === 'IGNORE') return;

    if (rule.preventDefault) e.preventDefault();
    if (rule.stopPropagation) e.stopPropagation();

    const normalized = MouseEventNormalizer.normalize(e, 'DROP', rule.action, rule.description, this.contextData);
    this.dispatcher.dispatch(normalized, rule);
  };
}
