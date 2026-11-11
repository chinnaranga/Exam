import { NormalizedFullscreenEvent } from '../types/FullscreenEvent';
import { BrowserCompatibility } from '../utils/BrowserCompatibility';

export interface FullscreenAnalyticsSummary {
  requestsCount: number;
  exitsCount: number;
  recoveriesCount: number;
  failuresCount: number;
  totalTimeOutsideSeconds: number;
  isSupported: boolean;
}

export class FullscreenAnalyticsService {
  private requestsCount = 0;
  private exitsCount = 0;
  private recoveriesCount = 0;
  private failuresCount = 0;

  private exitStartTimestamp: number | null = null;
  private totalTimeOutsideSeconds = 0;

  public recordEvent(event: NormalizedFullscreenEvent): void {
    const state = event.fullscreenState;

    if (state === 'ENTERING') {
      this.requestsCount += 1;
      if (this.exitStartTimestamp) {
        const diff = Math.round((Date.now() - this.exitStartTimestamp) / 1000);
        this.totalTimeOutsideSeconds += diff;
        this.exitStartTimestamp = null;
      }
    } else if (state === 'ACTIVE') {
      if (this.requestsCount > 1) {
        this.recoveriesCount += 1;
      }
      if (this.exitStartTimestamp) {
        const diff = Math.round((Date.now() - this.exitStartTimestamp) / 1000);
        this.totalTimeOutsideSeconds += diff;
        this.exitStartTimestamp = null;
      }
    } else if (state === 'EXITING') {
      this.exitsCount += 1;
      this.exitStartTimestamp = Date.now();
    } else if (state === 'ERROR' || state === 'UNSUPPORTED') {
      this.failuresCount += 1;
    }
  }

  public getSummary(): FullscreenAnalyticsSummary {
    return {
      requestsCount: this.requestsCount,
      exitsCount: this.exitsCount,
      recoveriesCount: this.recoveriesCount,
      failuresCount: this.failuresCount,
      totalTimeOutsideSeconds: this.totalTimeOutsideSeconds,
      isSupported: BrowserCompatibility.isFullscreenSupported(),
    };
  }

  public reset(): void {
    this.requestsCount = 0;
    this.exitsCount = 0;
    this.recoveriesCount = 0;
    this.failuresCount = 0;
    this.exitStartTimestamp = null;
    this.totalTimeOutsideSeconds = 0;
  }
}
