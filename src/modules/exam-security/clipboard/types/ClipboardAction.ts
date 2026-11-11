// Clipboard Policy & Action Types

export type ClipboardPolicyAction = 'ALLOW' | 'WARN' | 'BLOCK' | 'IGNORE';

export type ClipboardOperationType = 'COPY' | 'CUT' | 'PASTE' | 'DRAG_CLIPBOARD';

export interface ClipboardActionRule {
  id: string;
  name: string;
  operationType: ClipboardOperationType;
  action: ClipboardPolicyAction;
  preventDefault: boolean;
  stopPropagation: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}
