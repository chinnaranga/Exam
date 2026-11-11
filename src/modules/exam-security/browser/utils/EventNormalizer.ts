import { NormalizedBrowserEvent } from '../types/BrowserEvent';
import { BrowserEventType } from '../types/BrowserEventType';

export class EventNormalizer {
  public static normalize(
    eventType: BrowserEventType,
    rawMetadata?: Record<string, any>,
    contextData?: { examId?: string; studentId?: string; sessionId?: string }
  ): NormalizedBrowserEvent {
    return {
      id: `evt_raw_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      eventType,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      examId: contextData?.examId,
      studentId: contextData?.studentId,
      sessionId: contextData?.sessionId,
      metadata: rawMetadata || {},
    };
  }
}
