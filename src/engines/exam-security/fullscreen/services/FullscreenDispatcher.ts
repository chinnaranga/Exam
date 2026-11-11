import { NormalizedFullscreenEvent } from '../types/FullscreenEvent';
import { FullscreenPolicyRule } from '../types/FullscreenPolicy';
import { globalSecurityEventBus } from '../../events/SecurityEventBus';
import { FULLSCREEN_SECURITY_EVENTS } from '../constants/FullscreenEvents';
import { RestrictionManager } from '../../core/RestrictionManager';

export class FullscreenDispatcher {
  private restrictionManager?: RestrictionManager;

  constructor(restrictionManager?: RestrictionManager) {
    this.restrictionManager = restrictionManager;
  }

  public setRestrictionManager(rm: RestrictionManager): void {
    this.restrictionManager = rm;
  }

  public dispatch(event: NormalizedFullscreenEvent, rule?: FullscreenPolicyRule): void {
    globalSecurityEventBus.dispatch(FULLSCREEN_SECURITY_EVENTS.STATE_CHANGED, event);

    if (event.fullscreenState === 'EXITING' || event.fullscreenState === 'ERROR') {
      if (rule && (rule.actionOnExit === 'PAUSE' || rule.actionOnExit === 'TERMINATE')) {
        if (this.restrictionManager) {
          this.restrictionManager.triggerViolation({
            ruleId: rule.id,
            category: 'BROWSER',
            severity: rule.severity,
            message: `Fullscreen exit detected: ${event.reason}`,
            metadata: { ...event, ruleId: rule.id },
          });
        }
      }
    }
  }
}
