import { FocusPolicyService } from './FocusPolicyService';
import { FocusDispatcher } from './FocusDispatcher';
import { FocusAnalyticsService } from './FocusAnalyticsService';
import { FocusNormalizer } from '../utils/FocusNormalizer';
import { FocusState } from '../types/FocusState';

export class FocusService {
  private isListening = false;
  private pollIntervalId: ReturnType<typeof setInterval> | null = null;
  private wasFocused = true;
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
    this.wasFocused = typeof document !== 'undefined' && document.hasFocus ? document.hasFocus() : true;

    window.addEventListener('focus', this.handleFocus);
    window.addEventListener('blur', this.handleBlur);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // 500ms document.hasFocus() polling sentinel (do not rely only on blur events)
    this.pollIntervalId = setInterval(() => {
      if (!this.isListening || typeof document === 'undefined') return;
      const currentlyFocused = document.hasFocus ? document.hasFocus() : true;
      if (!currentlyFocused && this.wasFocused) {
        this.wasFocused = false;
        this.handleBlur();
      } else if (currentlyFocused && !this.wasFocused) {
        this.wasFocused = true;
        this.handleFocus();
      }
    }, 500);
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;

    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }

    window.removeEventListener('focus', this.handleFocus);
    window.removeEventListener('blur', this.handleBlur);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleFocus = () => {
    this.wasFocused = true;
    this.emitStateChange('FOCUSED', 'focus', 'Window focus restored');
  };

  private handleBlur = () => {
    this.wasFocused = false;
    this.emitStateChange('UNFOCUSED', 'blur', 'Window focus lost (detected via 500ms hasFocus poller)');
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
