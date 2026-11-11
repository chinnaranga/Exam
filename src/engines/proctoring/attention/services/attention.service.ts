import { ATTENTION_LIMITATIONS_EXPLANATIONS, NON_PREJUDICIAL_EXPLANATIONS } from '../constants/attention.constants';
import { AttentionEvent, LookingAwayState } from '../types/attention.types';

/**
 * @class AttentionService
 * @description Enterprise Attention Analysis Service managing looking away durations,
 * non-prejudicial explanations, tracking confidence calculation, and structured audit event generation.
 */
export class AttentionService {
  private static eventCounter = 0;

  /**
   * Evaluate looking away timer and select appropriate non-prejudicial explanation.
   */
  public evaluateLookingAway(
    isGazeOffCenter: boolean,
    isHeadTurned: boolean,
    deltaMs: number,
    currentState: LookingAwayState
  ): LookingAwayState {
    const isAway = isGazeOffCenter || isHeadTurned;

    let currentAwayDurationMs = currentState.currentAwayDurationMs;
    let totalAwayDurationMs = currentState.totalAwayDurationMs;
    let awayFrequencyCount = currentState.awayFrequencyCount;

    if (isAway) {
      if (!currentState.isLookingAway) {
        awayFrequencyCount++;
      }
      currentAwayDurationMs += deltaMs;
      totalAwayDurationMs += deltaMs;
    } else {
      currentAwayDurationMs = 0;
    }

    // Pick objective explanation
    let explanation = NON_PREJUDICIAL_EXPLANATIONS[0];
    if (isHeadTurned) {
      explanation = NON_PREJUDICIAL_EXPLANATIONS[1];
    } else if (isGazeOffCenter) {
      explanation = NON_PREJUDICIAL_EXPLANATIONS[2];
    }

    return {
      isLookingAway: isAway,
      currentAwayDurationMs,
      totalAwayDurationMs,
      awayFrequencyCount,
      explanation,
    };
  }

  /**
   * Helper to build structured telemetry audit events with explicit explanations & limitations.
   */
  public createAttentionEvent(
    module: AttentionEvent['module'],
    type: AttentionEvent['type'],
    severity: AttentionEvent['severity'],
    confidence: AttentionEvent['confidence'],
    explanation: string,
    limitations: string,
    duration?: number,
    details: Record<string, any> = {}
  ): AttentionEvent {
    AttentionService.eventCounter++;
    return {
      id: `evt_att_${Date.now()}_${AttentionService.eventCounter}`,
      timestamp: new Date().toISOString(),
      module,
      type,
      severity,
      confidence,
      explanation,
      limitations: limitations || ATTENTION_LIMITATIONS_EXPLANATIONS.GAZE_ANGLE,
      duration,
      details,
    };
  }
}

export const attentionService = new AttentionService();
