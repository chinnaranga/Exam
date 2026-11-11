import { EvidencePackage, IntegrityEventPayload } from './types/IntegrityTypes';

/**
 * @class EvidenceAggregator
 * @description Collects, indexes, and packages multi-dimensional telemetry evidence grouped by
 * question ID, section ID, timeline sequence, and candidate metadata.
 */
export class EvidenceAggregator {
  /**
   * Aggregate raw session events into a structured EvidencePackage.
   */
  public aggregateEvidence(
    sessionId: string,
    candidateId: string,
    examId: string,
    organizationId: string,
    events: IntegrityEventPayload[]
  ): EvidencePackage {
    const focusHistory: any[] = [];
    const clipboardHistory: any[] = [];
    const browserHistory: any[] = [];
    const environmentHistory: any[] = [];
    const networkHistory: any[] = [];
    const questionEvidences: Record<string, any[]> = {};

    events.forEach((evt) => {
      const item = {
        id: evt.id,
        timestamp: evt.timestamp,
        timestampMs: evt.timestampMs,
        type: evt.type,
        severity: evt.severity,
        confidence: evt.confidence,
        message: evt.details?.message,
        details: evt.details,
      };

      // Module category grouping
      if (evt.module === 'FocusMonitor' || evt.type.includes('Focus') || evt.type.includes('Visibility')) {
        focusHistory.push(item);
      } else if (evt.module === 'ClipboardMonitor' || evt.type.includes('Paste') || evt.type.includes('Copy')) {
        clipboardHistory.push(item);
      } else if (evt.module === 'DevToolsMonitor' || evt.module === 'DOMOverlayScanner' || evt.module === 'BrowserFingerprintMonitor') {
        browserHistory.push(item);
      } else if (evt.module === 'EnvironmentMonitor') {
        environmentHistory.push(item);
      } else if (evt.module === 'NetworkMonitor' || evt.type.includes('Offline') || evt.type.includes('Online')) {
        networkHistory.push(item);
      }

      // Question ID grouping if present in event metadata
      const questionId = evt.details?.metadata?.questionId || 'general_session';
      if (!questionEvidences[questionId]) {
        questionEvidences[questionId] = [];
      }
      questionEvidences[questionId].push(item);
    });

    return {
      candidateId,
      examId,
      sessionId,
      organizationId,
      eventsCount: events.length,
      events,
      focusHistory,
      clipboardHistory,
      browserHistory,
      environmentHistory,
      networkHistory,
      questionEvidences,
    };
  }
}
