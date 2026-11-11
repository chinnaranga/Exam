// Keyboard Shortcut Definitions & Policy Enums

export type KeyboardPolicyAction = 'ENABLED' | 'DISABLED' | 'WARN_ONLY' | 'BLOCK' | 'IGNORE';

export interface KeyboardShortcutRule {
  id: string;
  name: string;
  keyCombination: string; // e.g. "Ctrl+Shift+I", "F12"
  action: KeyboardPolicyAction;
  preventDefault: boolean;
  stopPropagation: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}
