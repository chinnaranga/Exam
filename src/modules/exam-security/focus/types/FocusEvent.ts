import { FocusState, FocusPolicyAction } from './FocusState';

export interface NormalizedFocusEvent {
  id: string;
  timestamp: string;
  studentId?: string;
  examId?: string;
  sessionId?: string;
  browser: string;
  operatingSystem: string;
  focusState: FocusState;
  rawEventType: string;
  unfocusedDurationSeconds?: number;
  actionTaken?: FocusPolicyAction;
  policyResult: string;
}
