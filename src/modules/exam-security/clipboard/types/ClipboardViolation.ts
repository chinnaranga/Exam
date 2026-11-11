import { NormalizedClipboardEvent } from './ClipboardEvent';
import { ClipboardActionRule } from './ClipboardAction';

export interface ClipboardViolation {
  id: string;
  rule: ClipboardActionRule;
  event: NormalizedClipboardEvent;
  timestamp: string;
}
