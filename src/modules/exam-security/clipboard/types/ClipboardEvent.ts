import { ClipboardOperationType, ClipboardPolicyAction } from './ClipboardAction';

export interface NormalizedClipboardEvent {
  id: string;
  timestamp: string;
  studentId?: string;
  examId?: string;
  sessionId?: string;
  browser: string;
  operatingSystem: string;
  clipboardAction: ClipboardOperationType;
  rawEventType: string; // e.g. "copy", "paste", "cut"
  targetElement: {
    tagName: string;
    id?: string;
    className?: string;
    isEditable: boolean;
  };
  selectionLength: number;
  dataType?: string; // e.g. "text/plain", "text/html"
  actionTaken: ClipboardPolicyAction;
  policyResult: string;
}
