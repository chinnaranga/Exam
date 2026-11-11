import { BehaviorReport, BehaviorTimelineEntry, IntegrityEventPayload } from './types/IntegrityTypes';

/**
 * @class BehaviorAnalyticsEngine
 * @description Analyzes multi-dimensional session timelines (focus, typing, clipboard, mouse, answer behavior,
 * fullscreen exits, network changes, environment updates) to generate a structured BehaviorReport.
 */
export class BehaviorAnalyticsEngine {
  /**
   * Process session raw events to construct a comprehensive BehaviorReport.
   */
  public generateBehaviorReport(sessionId: string, candidateId: string, events: IntegrityEventPayload[]): BehaviorReport {
    const timeline: BehaviorTimelineEntry[] = [];
    const focusTrends: { timeSec: number; focusActive: boolean }[] = [];
    const typingTrends: { timeSec: number; wpmEstimate: number }[] = [];
    const mouseTrends: { timeSec: number; entropy: number }[] = [];

    let focusLossFrequency = 0;
    let rapidPasteCount = 0;
    let unexpectedOverlayCount = 0;
    let networkDisconnectCount = 0;
    let typingCadenceShift = false;

    const sortedEvents = [...events].sort((a, b) => a.timestampMs - b.timestampMs);
    const startMs = sortedEvents.length > 0 ? sortedEvents[0].timestampMs : Date.now();

    sortedEvents.forEach((evt) => {
      const timeSec = Math.round((evt.timestampMs - startMs) / 1000);
      const category = this.categorizeModule(evt.module, evt.type);

      // Build Timeline Entry
      timeline.push({
        timestamp: evt.timestamp,
        timestampMs: evt.timestampMs,
        category,
        eventSummary: evt.details?.message || `${evt.module}: ${evt.type}`,
        severity: evt.severity,
        details: evt.details || {},
      });

      // Process Specific Telemetry Signals
      if (evt.type === 'FocusLost') {
        focusLossFrequency++;
        focusTrends.push({ timeSec, focusActive: false });
      } else if (evt.type === 'FocusRecovered') {
        focusTrends.push({ timeSec, focusActive: true });
      }

      if (evt.type === 'RapidPasteShortcut' || evt.type === 'PasteDetected') {
        rapidPasteCount++;
      }

      if (evt.type === 'OverlayDetected' || evt.type === 'LargeFixedElement' || evt.type === 'HiddenIframe') {
        unexpectedOverlayCount++;
      }

      if (evt.type === 'Offline') {
        networkDisconnectCount++;
      }

      if (evt.type === 'TypingCadenceShiftDetected' || evt.type === 'UnnaturalTypingCadence') {
        typingCadenceShift = true;
      }

      // Graph trend points
      if (evt.module === 'KeyboardAnalyzer' || evt.module === 'AnswerBehaviorMonitor') {
        const charDelta = evt.details?.metadata?.charDelta || 10;
        typingTrends.push({ timeSec, wpmEstimate: Math.min(150, charDelta * 3) });
      }

      if (evt.module === 'MouseAnalyzer') {
        const entropy = evt.details?.metadata?.entropy || 0.85;
        mouseTrends.push({ timeSec, entropy });
      }
    });

    return {
      sessionId,
      candidateId,
      timeline,
      trendGraphs: {
        focusContinuityOverTime: focusTrends,
        typingCadenceOverTime: typingTrends,
        mouseEntropyOverTime: mouseTrends,
      },
      deviationSummaries: {
        typingCadenceShift,
        focusLossFrequency,
        rapidPasteCount,
        unexpectedOverlayCount,
        networkDisconnectCount,
      },
    };
  }

  private categorizeModule(
    module: string,
    type: string
  ): 'FOCUS' | 'TYPING' | 'CLIPBOARD' | 'MOUSE' | 'NETWORK' | 'ENVIRONMENT' | 'SCREEN' {
    if (module === 'FocusMonitor' || type.includes('Focus') || type.includes('Visibility')) return 'FOCUS';
    if (module === 'KeyboardAnalyzer' || module === 'AnswerBehaviorMonitor' || type.includes('Typing')) return 'TYPING';
    if (module === 'ClipboardMonitor' || type.includes('Paste') || type.includes('Copy')) return 'CLIPBOARD';
    if (module === 'MouseAnalyzer' || type.includes('Mouse')) return 'MOUSE';
    if (module === 'NetworkMonitor' || type.includes('Offline') || type.includes('Online')) return 'NETWORK';
    if (module === 'EnvironmentMonitor' || module === 'DevToolsMonitor' || module === 'DOMOverlayScanner' || module === 'BrowserFingerprintMonitor') return 'ENVIRONMENT';
    return 'SCREEN';
  }
}
