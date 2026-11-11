import { NormalizedClipboardEvent } from '../types/ClipboardEvent';

export interface ClipboardAnalyticsSummary {
  copyAttempts: number;
  pasteAttempts: number;
  cutAttempts: number;
  dragAttempts: number;
  blockedAttempts: number;
  allowedAttempts: number;
  totalAttempts: number;
  clipboardRiskScore: number; // 0 to 100
}

export interface ClipboardTimelineEntry {
  timestamp: string;
  operation: string;
  actionTaken: string;
  selectionLength: number;
}

export class ClipboardAnalyticsService {
  private copyAttempts = 0;
  private pasteAttempts = 0;
  private cutAttempts = 0;
  private dragAttempts = 0;
  private blockedAttempts = 0;
  private allowedAttempts = 0;
  private timeline: ClipboardTimelineEntry[] = [];

  public recordEvent(event: NormalizedClipboardEvent): void {
    const op = event.clipboardAction;
    if (op === 'COPY') this.copyAttempts += 1;
    else if (op === 'PASTE') this.pasteAttempts += 1;
    else if (op === 'CUT') this.cutAttempts += 1;
    else if (op === 'DRAG_CLIPBOARD') this.dragAttempts += 1;

    if (event.actionTaken === 'BLOCK') this.blockedAttempts += 1;
    else if (event.actionTaken === 'ALLOW') this.allowedAttempts += 1;

    this.timeline.push({
      timestamp: event.timestamp,
      operation: op,
      actionTaken: event.actionTaken,
      selectionLength: event.selectionLength,
    });
  }

  public getSummary(): ClipboardAnalyticsSummary {
    const totalAttempts = this.copyAttempts + this.pasteAttempts + this.cutAttempts + this.dragAttempts;
    let score = 0;

    if (this.pasteAttempts > 0) score += 40;
    if (this.copyAttempts > 2) score += 30;
    if (this.blockedAttempts > 3) score += 30;

    return {
      copyAttempts: this.copyAttempts,
      pasteAttempts: this.pasteAttempts,
      cutAttempts: this.cutAttempts,
      dragAttempts: this.dragAttempts,
      blockedAttempts: this.blockedAttempts,
      allowedAttempts: this.allowedAttempts,
      totalAttempts,
      clipboardRiskScore: Math.min(100, score),
    };
  }

  public getTimeline(): ClipboardTimelineEntry[] {
    return [...this.timeline];
  }

  public reset(): void {
    this.copyAttempts = 0;
    this.pasteAttempts = 0;
    this.cutAttempts = 0;
    this.dragAttempts = 0;
    this.blockedAttempts = 0;
    this.allowedAttempts = 0;
    this.timeline = [];
  }
}
