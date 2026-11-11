import { KeyboardPolicyAction } from './KeyboardShortcut';

export interface NormalizedKeyboardEvent {
  id: string;
  timestamp: string;
  studentId?: string;
  examId?: string;
  sessionId?: string;
  browser: string;
  operatingSystem: string;
  shortcutPressed: string;
  rawKey: string;
  rawCode: string;
  modifiers: {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
  };
  actionTaken: KeyboardPolicyAction;
  policyResult: string;
  isRepeat: boolean;
  targetTagName?: string;
  isEditableTarget: boolean;
}
