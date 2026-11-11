import { FocusPolicyService } from './FocusPolicyService';
import { FocusDispatcher } from './FocusDispatcher';
import { FocusAnalyticsService } from './FocusAnalyticsService';
import { FocusNormalizer } from '../utils/FocusNormalizer';
import { FocusState } from '../types/FocusState';

export class FocusService {
  private isListening = false;
  public readonly policyService: FocusPolicyService;
  public readonly dispatcher: FocusDispatcher;
  public readonly analyticsService: FocusAnalyticsService;

  private contextData?: { studentId?: string; examId?: string; sessionId?: string };

  constructor(policyService: FocusPolicyService, dispatcher: FocusDispatcher) {
    this.policyService = policyService;
    this.dispatcher = dispatcher;
    this.analyticsService = new FocusAnalyticsService();
  }

  public setContextData(data?: { studentId?: string; examId?: string; sessionId?: string }): void {
    this.contextData = data;
  }

  public start(): void {
    if (this.isListening || typeof window === 'undefined') return;
    this.isListening = true;

    window.addEventListener('focus', this.handleFocus);
    window.addEventListener('blur', this.handleBlur);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;

    window.removeEventListener('focus', this.handleFocus);
    window.removeEventListener('blur', this.handleBlur);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleFocus = () => {
    this.emitStateChange('FOCUSED', 'focus', 'Window focus restored');
  };

  private handleBlur = () => {
    this.emitStateChange('UNFOCUSED', 'blur', 'Window focus lost');
  };

  private handleVisibilityChange = () => {
    const isHidden = document.hidden;
    this.emitStateChange(
      isHidden ? 'HIDDEN' : 'VISIBLE',
      'visibilitychange',
      isHidden ? 'Page tab switched or minimized' : 'Page tab active'
    );
  };

  private emitStateChange(state: FocusState, rawEvent: string, result: string): void {
    const rule = this.policyService.getRule();
    const normalized = FocusNormalizer.normalize(state, rawEvent, result, undefined, rule.actionOnBlur, this.contextData);
    this.analyticsService.recordEvent(normalized);
    this.dispatcher.dispatch(normalized, rule);
  }
}
