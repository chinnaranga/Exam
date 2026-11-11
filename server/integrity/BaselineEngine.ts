import { IntegrityEventPayload, SessionBaseline } from './types/IntegrityTypes';

/**
 * @class BaselineEngine
 * @description Builds per-session behavioral baseline metrics for candidate self-calibration.
 * 
 * CRITICAL RULE:
 * • NEVER compare candidate telemetry against other candidates or global cohort averages.
 * • ONLY compare candidate against their own baseline established during initial exam calibration.
 */
export class BaselineEngine {
  private sessionBaselines: Map<string, SessionBaseline> = new Map();

  /**
   * Build or update per-session candidate baseline from incoming raw integrity events.
   */
  public updateSessionBaseline(
    sessionId: string,
    candidateId: string,
    events: IntegrityEventPayload[]
  ): SessionBaseline {
    let baseline = this.sessionBaselines.get(sessionId);

    if (!baseline) {
      baseline = {
        sessionId,
        candidateId,
        medianTypingInterval: 150.0,
        medianPauseMs: 400.0,
        typingVariance: 25.0,
        backspaceRatio: 0.08,
        focusRatio: 1.0,
        mouseEntropy: 0.85,
        clipboardFrequency: 0.0,
        sampleCount: 0,
      };
    }

    if (!events || events.length === 0) {
      this.sessionBaselines.set(sessionId, baseline);
      return baseline;
    }

    // Extract Typing intervals, pauses, backspace counts from event metadata
    const typingIntervals: number[] = [];
    const pauses: number[] = [];
    let totalKeystrokes = 0;
    let backspaceCount = 0;
    let totalFocusedSec = 0;
    let totalBlurSec = 0;
    let copyPasteOps = 0;

    events.forEach((evt) => {
      const meta = evt.details?.metadata || {};

      // Typing telemetry signals
      if (evt.type === 'TypingBurstCompleted' || evt.type === 'KeystrokeCadenceMeasured') {
        if (typeof meta.medianFlightTimeMs === 'number') {
          typingIntervals.push(meta.medianFlightTimeMs);
        }
        if (typeof meta.pauseDurationMs === 'number') {
          pauses.push(meta.pauseDurationMs);
        }
        if (typeof meta.totalKeys === 'number') {
          totalKeystrokes += meta.totalKeys;
        }
        if (typeof meta.backspaceCount === 'number') {
          backspaceCount += meta.backspaceCount;
        }
      }

      // Focus telemetry signals
      if (evt.type === 'FocusLost') {
        totalBlurSec += meta.durationFocusedSec || 5;
      }
      if (evt.type === 'FocusRecovered') {
        totalBlurSec += meta.durationSeconds || 5;
        totalFocusedSec += 30; // Estimated baseline window
      }

      // Clipboard operations
      if (evt.type === 'CopyDetected' || evt.type === 'PasteDetected' || evt.type === 'RapidPasteShortcut') {
        copyPasteOps++;
      }
    });

    // Update Median Typing Interval if new samples arrived
    if (typingIntervals.length > 0) {
      const newMedianInterval = this.calculateMedian(typingIntervals);
      baseline.medianTypingInterval = Math.round((baseline.medianTypingInterval * 0.4 + newMedianInterval * 0.6) * 10) / 10;
      baseline.typingVariance = Math.round(this.calculateVariance(typingIntervals, newMedianInterval) * 10) / 10;
    }

    // Update Median Pause
    if (pauses.length > 0) {
      const newMedianPause = this.calculateMedian(pauses);
      baseline.medianPauseMs = Math.round((baseline.medianPauseMs * 0.4 + newMedianPause * 0.6) * 10) / 10;
    }

    // Update Backspace Ratio
    if (totalKeystrokes > 0) {
      const ratio = backspaceCount / totalKeystrokes;
      baseline.backspaceRatio = Math.round((baseline.backspaceRatio * 0.3 + ratio * 0.7) * 1000) / 1000;
    }

    // Update Focus Ratio
    const totalTimeSec = totalFocusedSec + totalBlurSec;
    if (totalTimeSec > 0) {
      baseline.focusRatio = Math.round((totalFocusedSec / totalTimeSec) * 100) / 100;
    }

    // Update Clipboard Frequency per minute estimate
    const sessionDurationMin = Math.max(1, events.length / 10);
    baseline.clipboardFrequency = Math.round((copyPasteOps / sessionDurationMin) * 100) / 100;

    baseline.sampleCount += events.length;
    this.sessionBaselines.set(sessionId, baseline);

    return baseline;
  }

  /**
   * Retrieve session baseline snapshot.
   */
  public getSessionBaseline(sessionId: string): SessionBaseline | null {
    return this.sessionBaselines.get(sessionId) || null;
  }

  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  }

  private calculateVariance(numbers: number[], mean: number): number {
    if (numbers.length === 0) return 0;
    const squareDiffs = numbers.map((value) => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / numbers.length;
    return Math.sqrt(avgSquareDiff);
  }
}
