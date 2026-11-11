import { NormalizedFocusEvent } from '../types/FocusEvent';
import { FocusState, FocusPolicyAction } from '../types/FocusState';

export class FocusNormalizer {
  public static normalize(
    focusState: FocusState,
    rawEventType: string,
    policyResult: string,
    unfocusedDurationSeconds?: number,
    actionTaken?: FocusPolicyAction,
    contextData?: { studentId?: string; examId?: string; sessionId?: string }
  ): NormalizedFocusEvent {
    return {
      id: `focus_evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      studentId: contextData?.studentId,
      examId: contextData?.examId,
      sessionId: contextData?.sessionId,
      browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      operatingSystem: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
      focusState,
      rawEventType,
      unfocusedDurationSeconds,
      actionTaken,
      policyResult,
    };
  }
}
