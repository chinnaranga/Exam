import { MousePolicyService } from './MousePolicyService';
import { MouseDispatcher } from './MouseDispatcher';
import { MouseEventNormalizer } from '../utils/MouseEventNormalizer';

export class TextSelectionProtectionService {
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
    document.addEventListener('selectstart', this.handleSelectStart, true);
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;
    document.removeEventListener('selectstart', this.handleSelectStart, true);
  }

  private handleSelectStart = (e: Event) => {
    const target = e.target as HTMLElement | null;

    // Check if target is inside input, textarea, Monaco, CodeMirror, TinyMCE, CKEditor, or Quill
    if (MouseEventNormalizer.isTargetEditable(target)) {
      return; // Allow text selection in code editors and input fields!
    }

    const rule = this.policyService.getRuleForInteraction('TEXT_SELECTION');
    if (!rule || rule.action === 'ALLOW' || rule.action === 'IGNORE') return;

    if (rule.preventDefault) {
      e.preventDefault();
    }
    if (rule.stopPropagation) {
      e.stopPropagation();
    }

    const normalized = MouseEventNormalizer.normalize(
      e,
      'TEXT_SELECTION',
      rule.action,
      rule.description,
      this.contextData
    );

    this.dispatcher.dispatch(normalized, rule);
  };
}
