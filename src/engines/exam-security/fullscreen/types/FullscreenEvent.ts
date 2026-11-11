import { FullscreenState } from './FullscreenState';
import { FullscreenPolicyAction } from './FullscreenPolicy';

export interface NormalizedFullscreenEvent {
  id: string;
  timestamp: string;
  studentId?: string;
  examId?: string;
  sessionId?: string;
  browser: string;
  operatingSystem: string;
  fullscreenState: FullscreenState;
  reason: string;
  currentQuestion?: number;
  timeLeftSeconds?: number;
  actionTaken?: FullscreenPolicyAction;
  policyResult: string;
}
