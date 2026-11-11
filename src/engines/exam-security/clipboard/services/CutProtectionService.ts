import { ClipboardPolicyService } from './ClipboardPolicyService';
import { ClipboardDispatcher } from './ClipboardDispatcher';
import { ClipboardNormalizer } from '../utils/ClipboardNormalizer';

export class CutProtectionService {
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
    document.addEventListener('cut', this.handleCut, true);
    document.addEventListener('beforecut', this.handleBeforeCut, true);
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;
    document.removeEventListener('cut', this.handleCut, true);
    document.removeEventListener('beforecut', this.handleBeforeCut, true);
  }

  private handleBeforeCut = (e: Event) => {
    const rule = this.policyService.getRuleForOperation('CUT');
    if (rule && rule.action === 'BLOCK') {
      e.preventDefault();
    }
  };

  private handleCut = (e: ClipboardEvent) => {
    const rule = this.policyService.getRuleForOperation('CUT');
    if (!rule || rule.action === 'ALLOW' || rule.action === 'IGNORE') return;

    if (rule.preventDefault) e.preventDefault();
    if (rule.stopPropagation) e.stopPropagation();

    const normalized = ClipboardNormalizer.normalize(e, 'CUT', rule.action, rule.description, this.contextData);
    this.dispatcher.dispatch(normalized, rule);
  };
}
