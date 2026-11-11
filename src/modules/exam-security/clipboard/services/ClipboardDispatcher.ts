import { NormalizedClipboardEvent } from '../types/ClipboardEvent';
import { ClipboardActionRule } from '../types/ClipboardAction';
import { globalSecurityEventBus } from '../../events/SecurityEventBus';
import { CLIPBOARD_SECURITY_EVENTS } from '../events/ClipboardEvents';
import { RestrictionManager } from '../../core/RestrictionManager';

export class ClipboardDispatcher {
  private restrictionManager?: RestrictionManager;
  private lastViolationTimestamp = 0;
  private duplicateDebounceMs = 300;

  constructor(restrictionManager?: RestrictionManager) {
    this.restrictionManager = restrictionManager;
  }

  public setRestrictionManager(rm: RestrictionManager): void {
    this.restrictionManager = rm;
  }

  public dispatch(event: NormalizedClipboardEvent, rule?: ClipboardActionRule): void {
    globalSecurityEventBus.dispatch(CLIPBOARD_SECURITY_EVENTS.OPERATION_RECORDED, event);

    if (rule && (rule.action === 'BLOCK' || rule.action === 'WARN')) {
      const now = Date.now();
      if (now - this.lastViolationTimestamp < this.duplicateDebounceMs) {
        return; // Prevent flooding
      }
      this.lastViolationTimestamp = now;

      if (this.restrictionManager) {
        this.restrictionManager.triggerViolation({
          ruleId: rule.id,
          category: 'INPUT',
          severity: rule.severity,
          message: `Restricted clipboard operation detected: ${rule.name}`,
          metadata: { ...event, ruleId: rule.id },
        });
      }
    }
  }
}
