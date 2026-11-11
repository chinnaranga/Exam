import { PipelineAlert, UnifiedIntegrityEvent } from '../types/pipeline.types';

/**
 * @class AlertEngineService
 * @description Generates configurable alerts (Critical, High, Medium, Low) with policy references,
 * confidence ratings, and suggested human reviewer actions.
 */
export class AlertEngineService {
  private static alertCounter = 0;

  public generateAlert(event: UnifiedIntegrityEvent, reason: string): PipelineAlert {
    AlertEngineService.alertCounter++;
    return {
      alertId: `alt_${Date.now()}_${AlertEngineService.alertCounter}`,
      sessionId: event.sessionId,
      timestamp: new Date().toISOString(),
      severity: event.severity,
      confidence: event.confidence,
      reason,
      relatedEvents: [event.eventId],
      policyReference: event.policyVersion,
      suggestedAction: 'Review live proctor feed and verify candidate environment context.',
    };
  }
}

export const alertEngineService = new AlertEngineService();
