import { NormalizedMouseEvent } from '../types/MouseEvent';

export interface MouseAnalyticsSummary {
  clickCount: number;
  doubleClickCount: number;
  rightClickCount: number;
  selectionAttempts: number;
  dragAttempts: number;
  dropAttempts: number;
  pointerMovements: number;
  wheelEvents: number;
  averageClickIntervalMs: number;
  suspiciousScore: number; // 0 to 100
}

export interface MouseActivityTimelineEntry {
  timestamp: string;
  interactionType: string;
  x: number;
  y: number;
}

export class MouseAnalyticsEngine {
  private clickCount = 0;
  private doubleClickCount = 0;
  private rightClickCount = 0;
  private selectionAttempts = 0;
  private dragAttempts = 0;
  private dropAttempts = 0;
  private pointerMovements = 0;
  private wheelEvents = 0;

  private clickTimestamps: number[] = [];
  private timeline: MouseActivityTimelineEntry[] = [];

  public recordEvent(event: NormalizedMouseEvent): void {
    const type = event.interactionType;
    const now = new Date(event.timestamp).getTime();

    this.timeline.push({
      timestamp: event.timestamp,
      interactionType: type,
      x: event.coordinates.clientX,
      y: event.coordinates.clientY,
    });

    if (type === 'CLICK') {
      this.clickCount += 1;
      this.clickTimestamps.push(now);
    } else if (type === 'DOUBLE_CLICK') {
      this.doubleClickCount += 1;
    } else if (type === 'RIGHT_CLICK' || type === 'CONTEXT_MENU') {
      this.rightClickCount += 1;
    } else if (type === 'TEXT_SELECTION') {
      this.selectionAttempts += 1;
    } else if (type === 'DRAG_START' || type === 'DRAG_OVER') {
      this.dragAttempts += 1;
    } else if (type === 'DROP') {
      this.dropAttempts += 1;
    } else if (type === 'WHEEL') {
      this.wheelEvents += 1;
    } else if (type === 'POINTER_DOWN' || type === 'POINTER_UP') {
      this.pointerMovements += 1;
    }
  }

  public getSummary(): MouseAnalyticsSummary {
    let avgInterval = 0;
    if (this.clickTimestamps.length > 1) {
      let totalDiff = 0;
      for (let i = 1; i < this.clickTimestamps.length; i++) {
        totalDiff += this.clickTimestamps[i] - this.clickTimestamps[i - 1];
      }
      avgInterval = Math.round(totalDiff / (this.clickTimestamps.length - 1));
    }

    // Suspicious Mouse Score Calculation (0-100)
    let score = 0;
    if (this.rightClickCount > 3) score += 30;
    if (this.selectionAttempts > 5) score += 25;
    if (this.dropAttempts > 0) score += 35;
    if (avgInterval > 0 && avgInterval < 80) score += 20; // Rapid robotic clicking

    return {
      clickCount: this.clickCount,
      doubleClickCount: this.doubleClickCount,
      rightClickCount: this.rightClickCount,
      selectionAttempts: this.selectionAttempts,
      dragAttempts: this.dragAttempts,
      dropAttempts: this.dropAttempts,
      pointerMovements: this.pointerMovements,
      wheelEvents: this.wheelEvents,
      averageClickIntervalMs: avgInterval,
      suspiciousScore: Math.min(100, score),
    };
  }

  public getTimeline(): MouseActivityTimelineEntry[] {
    return [...this.timeline];
  }

  public reset(): void {
    this.clickCount = 0;
    this.doubleClickCount = 0;
    this.rightClickCount = 0;
    this.selectionAttempts = 0;
    this.dragAttempts = 0;
    this.dropAttempts = 0;
    this.pointerMovements = 0;
    this.wheelEvents = 0;
    this.clickTimestamps = [];
    this.timeline = [];
  }
}
