import { NormalizedFocusEvent } from '../types/FocusEvent';
import { FocusPolicyRule } from './FocusPolicyService';
import { globalSecurityEventBus } from '../../events/SecurityEventBus';
import { FOCUS_SECURITY_EVENTS } from '../constants/FocusEvents';
import { RestrictionManager } from '../../core/RestrictionManager';

export class FocusDispatcher {
  private restrictionManager?: RestrictionManager;

  constructor(restrictionManager?: RestrictionManager) {
    this.restrictionManager = restrictionManager;
  }

  public setRestrictionManager(rm: RestrictionManager): void {
    this.restrictionManager = rm;
  }

  public dispatch(event: NormalizedFocusEvent, rule: FocusPolicyRule): void {
    globalSecurityEventBus.dispatch(FOCUS_SECURITY_EVENTS.STATE_CHANGED, event);

    if (event.focusState === 'UNFOCUSED' || event.focusState === 'HIDDEN') {
      if (this.restrictionManager) {
        this.restrictionManager.triggerViolation({
          ruleId: rule.id,
          category: 'BROWSER',
          severity: rule.severity,
          message: `Focus loss detected: ${event.policyResult}`,
          metadata: { ...event, ruleId: rule.id },
        });
      }
    }
  }
}
