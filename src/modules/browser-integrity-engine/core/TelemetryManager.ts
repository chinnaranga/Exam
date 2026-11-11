import { EventBus } from './EventBus';
import { SessionManager } from './SessionManager';
import {
  IntegrityEvent,
  EventFilterOptions,
  IntegritySummary,
  IntegritySeverity,
} from '../types/IntegrityEvent';

/**
 * @class TelemetryManager
 * @description Stores, filters, aggregates, and exports structured integrity telemetry events in memory.
 * Employs a fixed-size ring-buffer state to guarantee zero memory leaks during 3+ hour assessments.
 */
export class TelemetryManager {
  private events: IntegrityEvent[] = [];
  private maxBufferCapacity: number;
  private unsubscribe?: () => void;

  constructor(
    private eventBus: EventBus,
    private sessionManager: SessionManager,
    maxCapacity: number = 5000
  ) {
    this.maxBufferCapacity = maxCapacity;
    this.attachEventListener();
  }

  private attachEventListener(): void {
    this.unsubscribe = this.eventBus.subscribe('*', (event: IntegrityEvent) => {
      this.recordEvent(event);
    });
  }

  /**
   * Append event to buffer. Enforces maximum capacity buffer limit.
   */
  public recordEvent(event: IntegrityEvent): void {
    // Enrich event with current session identifiers if missing
    const session = this.sessionManager.getSessionState();
    const enrichedEvent: IntegrityEvent = {
      ...event,
      sessionId: event.sessionId || session.sessionId,
      candidateId: event.candidateId || session.candidateId,
      examId: event.examId || session.examId,
    };

    if (this.events.length >= this.maxBufferCapacity) {
      this.events.shift(); // Evict oldest telemetry item
    }
    this.events.push(enrichedEvent);
  }

  /**
   * Returns all stored telemetry events.
   */
  public getAllEvents(): ReadonlyArray<IntegrityEvent> {
    return [...this.events];
  }

  /**
   * Filter telemetry events according to query parameters.
   */
  public getFilteredEvents(options: EventFilterOptions): IntegrityEvent[] {
    return this.events.filter((evt) => {
      if (options.modules && options.modules.length > 0 && !options.modules.includes(evt.module)) {
        return false;
      }
      if (options.severities && options.severities.length > 0 && !options.severities.includes(evt.severity)) {
        return false;
      }
      if (options.confidences && options.confidences.length > 0 && !options.confidences.includes(evt.confidence)) {
        return false;
      }
      if (options.startTimeMs && evt.timestampMs < options.startTimeMs) {
        return false;
      }
      if (options.endTimeMs && evt.timestampMs > options.endTimeMs) {
        return false;
      }
      if (options.searchQuery) {
        const query = options.searchQuery.toLowerCase();
        const msg = evt.details.message.toLowerCase();
        const exp = evt.details.explanation.toLowerCase();
        const mod = evt.module.toLowerCase();
        const type = evt.type.toLowerCase();
        if (!msg.includes(query) && !exp.includes(query) && !mod.includes(query) && !type.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Computes real-time telemetry summary metrics.
   */
  public getSummary(): IntegritySummary {
    const eventsBySeverity: Record<IntegritySeverity, number> = {
      INFO: 0,
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };
    const eventsByModule: Record<string, number> = {};

    let activeSignals = 0;

    for (const evt of this.events) {
      eventsBySeverity[evt.severity] = (eventsBySeverity[evt.severity] || 0) + 1;
      eventsByModule[evt.module] = (eventsByModule[evt.module] || 0) + 1;
      if (evt.severity === 'MEDIUM' || evt.severity === 'HIGH' || evt.severity === 'CRITICAL') {
        activeSignals += 1;
      }
    }

    return {
      totalEvents: this.events.length,
      eventsBySeverity,
      eventsByModule,
      activeSignalsCount: activeSignals,
      sessionDurationSeconds: this.sessionManager.getSessionDurationSeconds(),
    };
  }

  /**
   * Export complete session payload as a structured JSON object.
   */
  public exportJSONPayload(): Record<string, any> {
    const session = this.sessionManager.getSessionState();
    const summary = this.getSummary();

    return {
      exportVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      session,
      summary,
      events: this.events,
    };
  }

  /**
   * Clear in-memory event buffer.
   */
  public clear(): void {
    this.events = [];
  }

  /**
   * Clean up event subscriptions.
   */
  public destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
