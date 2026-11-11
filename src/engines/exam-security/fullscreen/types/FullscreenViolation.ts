import { NormalizedFullscreenEvent } from './FullscreenEvent';
import { FullscreenPolicyRule } from './FullscreenPolicy';

export interface FullscreenViolation {
  id: string;
  rule: FullscreenPolicyRule;
  event: NormalizedFullscreenEvent;
  timestamp: string;
}
