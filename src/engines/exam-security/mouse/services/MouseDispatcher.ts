import { NormalizedMouseEvent } from '../types/MouseEvent';
import { MouseActionRule } from '../types/MouseAction';
import { globalSecurityEventBus } from '../../events/SecurityEventBus';
import { MOUSE_SECURITY_EVENTS } from '../events/MouseEvents';
import { RestrictionManager } from '../../core/RestrictionManager';

export class MouseDispatcher {
  private restrictionManager?: RestrictionManager;
  private lastViolationTimestamp = 0;
  private duplicateWindowMs = 300;

  constructor(restrictionManager?: RestrictionManager) {
    this.restrictionManager = restrictionManager;
  }

  public setRestrictionManager(rm: RestrictionManager): void {
    this.restrictionManager = rm;
  }

  public dispatch(event: NormalizedMouseEvent, rule?: MouseActionRule): void {
    globalSecurityEventBus.dispatch(MOUSE_SECURITY_EVENTS.INTERACTION_RECORDED, event);

    if (rule && (rule.action === 'BLOCK' || rule.action === 'WARN')) {
      const now = Date.now();
      if (now - this.lastViolationTimestamp < this.duplicateWindowMs) {
        return; // Suppress duplicate violation spam
      }
      this.lastViolationTimestamp = now;

      if (this.restrictionManager) {
        this.restrictionManager.triggerViolation({
          ruleId: rule.id,
          category: 'INPUT',
          severity: rule.severity,
          message: `Restricted mouse action detected: ${rule.name}`,
          metadata: { ...event, ruleId: rule.id },
        });
      }
    }
  }
}
