import { UnifiedIntegrityEvent } from '../types/pipeline.types';

/**
 * @class CorrelationEngineService
 * @description Correlates related concurrent observations (e.g. LookingAway + HeadTurnRight + FaceVisible = single correlated cluster)
 * without inferring candidate misconduct.
 */
export class CorrelationEngineService {
  private recentEventsWindow: UnifiedIntegrityEvent[] = [];

  public correlate(event: UnifiedIntegrityEvent): UnifiedIntegrityEvent {
    this.recentEventsWindow.push(event);
    if (this.recentEventsWindow.length > 20) {
      this.recentEventsWindow.shift();
    }

    // Look for concurrent events within a 5-second window
    const nowMs = new Date(event.timestamp).getTime();
    const concurrent = this.recentEventsWindow.filter(
      (e) => Math.abs(nowMs - new Date(e.timestamp).getTime()) <= 5000 && e.eventId !== event.eventId
    );

    if (concurrent.length > 0) {
      const clusterId = `corr_cluster_${Date.now()}`;
      return {
        ...event,
        correlationId: clusterId,
        explanation: `${event.explanation} (Correlated with ${concurrent.map((c) => c.eventType).join(', ')})`,
      };
    }

    return event;
  }
}

export const correlationEngineService = new CorrelationEngineService();
