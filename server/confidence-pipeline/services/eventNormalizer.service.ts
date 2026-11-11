import { UnifiedIntegrityEvent } from '../types/pipeline.types';

/**
 * @class EventNormalizerService
 * @description Standardizes heterogeneous telemetry events from Camera, Face, Attention, Object, Audio,
 * and Browser Integrity SDKs into a unified 18-field schema.
 */
export class EventNormalizerService {
  public normalize(raw: Partial<UnifiedIntegrityEvent>): UnifiedIntegrityEvent {
    return {
      eventId: raw.eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sessionId: raw.sessionId || 'sess_default_2026',
      organizationId: raw.organizationId || 'org_univ_01',
      candidateId: raw.candidateId || 'cand_student_2026',
      examId: raw.examId || 'exam_ai_proctoring_101',
      module: raw.module || 'BrowserIntegrityEngine',
      eventType: raw.eventType || 'TelemetryPing',
      severity: raw.severity || 'Info',
      confidence: raw.confidence || 'High',
      timestamp: raw.timestamp || new Date().toISOString(),
      duration: raw.duration || 0,
      explanation: raw.explanation || 'Standard telemetry event received.',
      limitations: raw.limitations || 'Observation bounded by client browser sensors.',
      policyVersion: raw.policyVersion || 'v2026.1.0-default',
      metadata: raw.metadata || {},
      evidenceReference: raw.evidenceReference,
      correlationId: raw.correlationId,
    };
  }
}

export const eventNormalizerService = new EventNormalizerService();
