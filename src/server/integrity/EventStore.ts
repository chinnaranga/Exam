import { IntegrityEventPayload } from './types/IntegrityTypes';

export interface EventStoreQueryOptions {
  sessionId?: string;
  candidateId?: string;
  examId?: string;
  organizationId?: string;
  module?: string;
  severity?: string;
  startTimeMs?: number;
  endTimeMs?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedEventQueryResult {
  events: IntegrityEventPayload[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * @class EventStore
 * @description High-throughput time-series event store for raw browser integrity telemetry signals.
 * Supports indexing, time-windowed querying, pagination, and configurable retention purging.
 */
export class EventStore {
  // In-memory high speed store buffer for immediate analytics & testing
  private inMemoryStore: Map<string, IntegrityEventPayload[]> = new Map();
  private eventIndexById: Map<string, IntegrityEventPayload> = new Map();

  /**
   * Persist a batch of validated telemetry events into the store.
   */
  public async storeEvents(
    sessionId: string,
    events: IntegrityEventPayload[],
    clientIp?: string
  ): Promise<number> {
    if (!this.inMemoryStore.has(sessionId)) {
      this.inMemoryStore.set(sessionId, []);
    }

    const sessionEvents = this.inMemoryStore.get(sessionId)!;
    let insertedCount = 0;

    for (const evt of events) {
      if (!this.eventIndexById.has(evt.id)) {
        sessionEvents.push(evt);
        this.eventIndexById.set(evt.id, evt);
        insertedCount++;
      }
    }

    // Sort session events chronologically
    sessionEvents.sort((a, b) => a.timestampMs - b.timestampMs);
    return insertedCount;
  }

  /**
   * Query raw integrity events with filtering, time range bounds, and pagination.
   */
  public async queryEvents(options: EventStoreQueryOptions): Promise<PaginatedEventQueryResult> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 100;

    let matchedEvents: IntegrityEventPayload[] = [];

    if (options.sessionId && this.inMemoryStore.has(options.sessionId)) {
      matchedEvents = [...this.inMemoryStore.get(options.sessionId)!];
    } else {
      this.inMemoryStore.forEach((events) => {
        matchedEvents.push(...events);
      });
    }

    // Apply filters
    if (options.candidateId) {
      matchedEvents = matchedEvents.filter((e) => e.candidateId === options.candidateId);
    }
    if (options.examId) {
      matchedEvents = matchedEvents.filter((e) => e.examId === options.examId);
    }
    if (options.module) {
      matchedEvents = matchedEvents.filter((e) => e.module === options.module);
    }
    if (options.severity) {
      matchedEvents = matchedEvents.filter((e) => e.severity === options.severity);
    }
    if (options.startTimeMs) {
      matchedEvents = matchedEvents.filter((e) => e.timestampMs >= options.startTimeMs!);
    }
    if (options.endTimeMs) {
      matchedEvents = matchedEvents.filter((e) => e.timestampMs <= options.endTimeMs!);
    }

    // Sort by timestamp
    matchedEvents.sort((a, b) => a.timestampMs - b.timestampMs);

    const totalCount = matchedEvents.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedEvents = matchedEvents.slice(startIndex, startIndex + limit);

    return {
      events: paginatedEvents,
      totalCount,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retrieve all events for a session.
   */
  public async getSessionEvents(sessionId: string): Promise<IntegrityEventPayload[]> {
    return this.inMemoryStore.get(sessionId) || [];
  }

  /**
   * Execute data retention purging for events older than retentionDays.
   */
  public async purgeRetentionEvents(retentionDays: number): Promise<number> {
    const cutoffMs = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    let purgedCount = 0;

    this.inMemoryStore.forEach((events, sessionId) => {
      const valid = events.filter((e) => {
        if (e.timestampMs <= cutoffMs) {
          this.eventIndexById.delete(e.id);
          purgedCount++;
          return false;
        }
        return true;
      });
      this.inMemoryStore.set(sessionId, valid);
    });

    return purgedCount;
  }
}
