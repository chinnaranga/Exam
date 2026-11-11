import { NormalizedFocusEvent } from '../types/FocusEvent';

export interface FocusAnalyticsSummary {
  focusLossCount: number;
  tabSwitchCount: number;
  totalUnfocusedTimeSeconds: number;
  currentFocusState: string;
  focusScore: number; // 0 to 100
}

export class FocusAnalyticsService {
  private focusLossCount = 0;
  private tabSwitchCount = 0;
  private totalUnfocusedTimeSeconds = 0;
  private lastBlurTimestamp: number | null = null;
  private currentFocusState = 'FOCUSED';

  public recordEvent(event: NormalizedFocusEvent): void {
    this.currentFocusState = event.focusState;

    if (event.focusState === 'UNFOCUSED' || event.focusState === 'HIDDEN') {
      this.focusLossCount += 1;
      if (event.rawEventType === 'visibilitychange') {
        this.tabSwitchCount += 1;
      }
      this.lastBlurTimestamp = Date.now();
    } else if (event.focusState === 'FOCUSED' || event.focusState === 'VISIBLE') {
      if (this.lastBlurTimestamp) {
        const diff = Math.round((Date.now() - this.lastBlurTimestamp) / 1000);
        this.totalUnfocusedTimeSeconds += diff;
        this.lastBlurTimestamp = null;
      }
    }
  }

  public getSummary(): FocusAnalyticsSummary {
    let score = 100 - this.focusLossCount * 15 - this.tabSwitchCount * 25;
    return {
      focusLossCount: this.focusLossCount,
      tabSwitchCount: this.tabSwitchCount,
      totalUnfocusedTimeSeconds: this.totalUnfocusedTimeSeconds,
      currentFocusState: this.currentFocusState,
      focusScore: Math.max(0, score),
    };
  }

  public reset(): void {
    this.focusLossCount = 0;
    this.tabSwitchCount = 0;
    this.totalUnfocusedTimeSeconds = 0;
    this.lastBlurTimestamp = null;
    this.currentFocusState = 'FOCUSED';
  }
}
