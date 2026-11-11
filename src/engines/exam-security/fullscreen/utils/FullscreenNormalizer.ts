import { NormalizedFullscreenEvent } from '../types/FullscreenEvent';
import { FullscreenState } from '../types/FullscreenState';
import { FullscreenPolicyAction } from '../types/FullscreenPolicy';

export class FullscreenNormalizer {
  public static normalize(
    state: FullscreenState,
    reason: string,
    policyResult: string,
    actionTaken?: FullscreenPolicyAction,
    contextData?: {
      studentId?: string;
      examId?: string;
      sessionId?: string;
      currentQuestion?: number;
      timeLeftSeconds?: number;
    }
  ): NormalizedFullscreenEvent {
    return {
      id: `fs_evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      studentId: contextData?.studentId,
      examId: contextData?.examId,
      sessionId: contextData?.sessionId,
      browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      operatingSystem: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
      fullscreenState: state,
      reason,
      currentQuestion: contextData?.currentQuestion,
      timeLeftSeconds: contextData?.timeLeftSeconds,
      actionTaken,
      policyResult,
    };
  }
}
