import { NormalizedKeyboardEvent } from './KeyboardEvent';
import { KeyboardShortcutRule } from './KeyboardShortcut';

export interface KeyboardViolation {
  id: string;
  rule: KeyboardShortcutRule;
  event: NormalizedKeyboardEvent;
  timestamp: string;
}
