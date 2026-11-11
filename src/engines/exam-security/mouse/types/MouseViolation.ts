import { NormalizedMouseEvent } from './MouseEvent';
import { MouseActionRule } from './MouseAction';

export interface MouseViolation {
  id: string;
  rule: MouseActionRule;
  event: NormalizedMouseEvent;
  timestamp: string;
}
