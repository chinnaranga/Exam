import crypto from 'crypto';
import { BatchTelemetryRequest, IntegrityEventPayload } from './types/IntegrityTypes';

export interface IngestionResult {
  success: boolean;
  acceptedCount: number;
  rejectedCount: number;
  duplicateCount: number;
  errors: string[];
}

/**
 * @class TelemetryGateway
 * @description Ingestion gateway for client-side telemetry signals.
 * Performs payload schema validation, HMAC signature verification, timestamp drift checking,
 * idempotency deduplication, and payload batching.
 * 
 * CORE PRINCIPLE:
 * • The browser environment is UNTRUSTED.
 * • All incoming telemetry payloads are validated and sanitized before queuing or persistence.
 */
export class TelemetryGateway {
  private static readonly MAX_TIMESTAMP_DRIFT_MS = 5 * 60 * 1000; // 5 minutes max drift
  private processedEventIds: Set<string> = new Set();
  private static readonly MAX_IDEMPOTENCY_CACHE_SIZE = 100000;

  private telemetrySecret: string;

  constructor(secret?: string) {
    this.telemetrySecret = secret || process.env.TELEMETRY_SECRET || 'assessiq_default_telemetry_signing_key_2026';
  }

  /**
   * Process and validate an incoming batch telemetry request payload.
   */
  public validateAndProcessBatch(
    payload: any,
    clientIp?: string
  ): { isValid: boolean; result: IngestionResult; validatedEvents: IntegrityEventPayload[] } {
    const errors: string[] = [];
    let acceptedCount = 0;
    let rejectedCount = 0;
    let duplicateCount = 0;
    const validatedEvents: IntegrityEventPayload[] = [];

    // 1. Structure Check
    if (!payload || typeof payload !== 'object') {
      return {
        isValid: false,
        result: { success: false, acceptedCount: 0, rejectedCount: 0, duplicateCount: 0, errors: ['Invalid JSON payload format.'] },
        validatedEvents: [],
      };
    }

    const batch = payload as BatchTelemetryRequest;

    // 2. Required Batch Metadata Check
    if (!batch.sessionId || typeof batch.sessionId !== 'string') {
      errors.push('Missing or invalid sessionId.');
    }
    if (!batch.candidateId || typeof batch.candidateId !== 'string') {
      errors.push('Missing or invalid candidateId.');
    }
    if (!batch.examId || typeof batch.examId !== 'string') {
      errors.push('Missing or invalid examId.');
    }
    if (!batch.organizationId || typeof batch.organizationId !== 'string') {
      errors.push('Missing or invalid organizationId.');
    }
    if (!Array.isArray(batch.events)) {
      errors.push('Missing or invalid events array.');
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        result: { success: false, acceptedCount: 0, rejectedCount: errors.length, duplicateCount: 0, errors },
        validatedEvents: [],
      };
    }

    // 3. Timestamp Drift & Replay Attack Check
    const now = Date.now();
    const drift = Math.abs(now - (batch.timestampMs || now));
    if (drift > TelemetryGateway.MAX_TIMESTAMP_DRIFT_MS) {
      errors.push(`Timestamp drift exceeded limit (${Math.round(drift / 1000)}s drift).`);
      return {
        isValid: false,
        result: { success: false, acceptedCount: 0, rejectedCount: 1, duplicateCount: 0, errors },
        validatedEvents: [],
      };
    }

    // 4. HMAC Signature Check (if signature provided)
    if (batch.signature) {
      const isSignatureValid = this.verifySignature(batch);
      if (!isSignatureValid) {
        errors.push('HMAC Signature verification failed. Telemetry payload may be tampered.');
        return {
          isValid: false,
          result: { success: false, acceptedCount: 0, rejectedCount: batch.events.length, duplicateCount: 0, errors },
          validatedEvents: [],
        };
      }
    }

    // 5. Individual Event Schema Validation & Idempotency Deduplication
    for (const evt of batch.events) {
      if (!evt || typeof evt !== 'object') {
        rejectedCount++;
        errors.push('Encountered malformed event object in batch.');
        continue;
      }

      // Check required event fields
      if (!evt.id || !evt.module || !evt.type || !evt.severity || !evt.confidence || !evt.details) {
        rejectedCount++;
        errors.push(`Event "${evt.id || 'unknown'}" missing required fields.`);
        continue;
      }

      // Idempotency deduplication check
      if (this.processedEventIds.has(evt.id)) {
        duplicateCount++;
        continue; // Skip duplicate without erroring out whole batch
      }

      // Add to deduplication cache
      this.cacheEventId(evt.id);

      // Attach session info if omitted on client
      const normalizedEvt: IntegrityEventPayload = {
        ...evt,
        sessionId: evt.sessionId || batch.sessionId,
        candidateId: evt.candidateId || batch.candidateId,
        examId: evt.examId || batch.examId,
      };

      validatedEvents.push(normalizedEvt);
      acceptedCount++;
    }

    const success = errors.length === 0;

    return {
      isValid: success,
      result: {
        success,
        acceptedCount,
        rejectedCount,
        duplicateCount,
        errors,
      },
      validatedEvents,
    };
  }

  /**
   * HMAC SHA-256 Signature verification helper.
   */
  public verifySignature(batch: BatchTelemetryRequest): boolean {
    if (!batch.signature) return false;
    try {
      const dataToSign = `${batch.sessionId}:${batch.candidateId}:${batch.examId}:${batch.timestampMs}:${batch.events.length}`;
      const expectedSignature = crypto
        .createHmac('sha256', this.telemetrySecret)
        .update(dataToSign)
        .digest('hex');

      return crypto.timingSafeEqual(Buffer.from(batch.signature), Buffer.from(expectedSignature));
    } catch {
      return false;
    }
  }

  /**
   * Generate HMAC SHA-256 signature for client/test payload signing.
   */
  public signBatchPayload(batch: Omit<BatchTelemetryRequest, 'signature'>): string {
    const dataToSign = `${batch.sessionId}:${batch.candidateId}:${batch.examId}:${batch.timestampMs}:${batch.events.length}`;
    return crypto.createHmac('sha256', this.telemetrySecret).update(dataToSign).digest('hex');
  }

  /**
   * Deduplication cache eviction helper.
   */
  private cacheEventId(eventId: string): void {
    if (this.processedEventIds.size >= TelemetryGateway.MAX_IDEMPOTENCY_CACHE_SIZE) {
      const firstItem = this.processedEventIds.values().next().value;
      if (firstItem) this.processedEventIds.delete(firstItem);
    }
    this.processedEventIds.add(eventId);
  }
}
