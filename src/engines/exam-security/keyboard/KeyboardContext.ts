import { createContext } from 'react';
import { KeyboardShortcutRule, KeyboardPolicyAction } from './types/KeyboardShortcut';

export interface KeyboardContextValue {
  isMonitoring: boolean;
  rules: KeyboardShortcutRule[];
  start: () => void;
  stop: () => void;
  updateRuleAction: (id: string, action: KeyboardPolicyAction) => void;
}

export const KeyboardContext = createContext<KeyboardContextValue | undefined>(undefined);
