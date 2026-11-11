import { ClipboardPolicyService } from './ClipboardPolicyService';
import { ClipboardDispatcher } from './ClipboardDispatcher';
import { ClipboardNormalizer } from '../utils/ClipboardNormalizer';

export class PasteProtectionService {
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
    document.addEventListener('paste', this.handlePaste, true);
    document.addEventListener('beforepaste', this.handleBeforePaste, true);
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;
    document.removeEventListener('paste', this.handlePaste, true);
    document.removeEventListener('beforepaste', this.handleBeforePaste, true);
  }

  private handleBeforePaste = (e: Event) => {
    const rule = this.policyService.getRuleForOperation('PASTE');
    if (rule && rule.action === 'BLOCK') {
      e.preventDefault();
    }
  };

  private handlePaste = (e: ClipboardEvent) => {
    const rule = this.policyService.getRuleForOperation('PASTE');
    if (!rule || rule.action === 'ALLOW' || rule.action === 'IGNORE') return;

    if (rule.preventDefault) e.preventDefault();
    if (rule.stopPropagation) e.stopPropagation();

    // NEVER collect or store actual clipboard contents! Metadata only!
    const normalized = ClipboardNormalizer.normalize(e, 'PASTE', rule.action, rule.description, this.contextData);
    this.dispatcher.dispatch(normalized, rule);
  };
}
