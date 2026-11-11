import { ClipboardPolicyService } from './ClipboardPolicyService';
import { ClipboardDispatcher } from './ClipboardDispatcher';
import { ClipboardNormalizer } from '../utils/ClipboardNormalizer';

export class CopyProtectionService {
  private policyService: ClipboardPolicyService;
  private dispatcher: ClipboardDispatcher;
  private isListening = false;
  private contextData?: { studentId?: string; examId?: string; sessionId?: string };

  constructor(policyService: ClipboardPolicyService, dispatcher: ClipboardDispatcher) {
    this.policyService = policyService;
    this.dispatcher = dispatcher;
  }

  public setContextData(data?: { studentId?: string; examId?: string; sessionId?: string }): void {
    this.contextData = data;
  }

  public start(): void {
    if (this.isListening || typeof window === 'undefined') return;
    this.isListening = true;
    document.addEventListener('copy', this.handleCopy, true);
    document.addEventListener('beforecopy', this.handleBeforeCopy, true);
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;
    document.removeEventListener('copy', this.handleCopy, true);
    document.removeEventListener('beforecopy', this.handleBeforeCopy, true);
  }

  private handleBeforeCopy = (e: Event) => {
    const rule = this.policyService.getRuleForOperation('COPY');
    if (rule && rule.action === 'BLOCK') {
      e.preventDefault();
    }
  };

  private handleCopy = (e: ClipboardEvent) => {
    const rule = this.policyService.getRuleForOperation('COPY');
    if (!rule || rule.action === 'ALLOW' || rule.action === 'IGNORE') return;

    if (rule.preventDefault) e.preventDefault();
    if (rule.stopPropagation) e.stopPropagation();

    // NEVER store actual copied string text! Metadata only!
    const normalized = ClipboardNormalizer.normalize(e, 'COPY', rule.action, rule.description, this.contextData);
    this.dispatcher.dispatch(normalized, rule);
  };
}
