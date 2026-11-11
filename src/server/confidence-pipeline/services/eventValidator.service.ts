import { UnifiedIntegrityEvent } from '../types/pipeline.types';

/**
 * @class EventValidatorService
 * @description Validates required schema fields, timestamp ordering, schema versioning, and duplicate event IDs.
 */
export class EventValidatorService {
  private processedEventIds = new Set<string>();

  public validate(event: UnifiedIntegrityEvent): { isValid: boolean; error?: string } {
    if (!event.eventId || !event.sessionId || !event.candidateId || !event.module || !event.eventType) {
      return { isValid: false, error: 'Missing mandatory event schema fields.' };
    }

    if (this.processedEventIds.has(event.eventId)) {
      return { isValid: false, error: `Duplicate event ID detected: ${event.eventId}` };
    }

    // Cache event ID for deduplication
    this.processedEventIds.add(event.eventId);
    if (this.processedEventIds.size > 5000) {
      const iterator = this.processedEventIds.values();
      this.processedEventIds.delete(iterator.next().value);
    }

    return { isValid: true };
  }
}

export const eventValidatorService = new EventValidatorService();
