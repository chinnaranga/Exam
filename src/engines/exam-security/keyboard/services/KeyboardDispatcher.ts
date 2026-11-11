import { NormalizedKeyboardEvent } from '../types/KeyboardEvent';
import { KeyboardShortcutRule } from '../types/KeyboardShortcut';
import { globalSecurityEventBus } from '../../events/SecurityEventBus';
import { KEYBOARD_SECURITY_EVENTS } from '../events/KeyboardEvents';
import { RestrictionManager } from '../../core/RestrictionManager';

export class KeyboardDispatcher {
  private restrictionManager?: RestrictionManager;

  constructor(restrictionManager?: RestrictionManager) {
    this.restrictionManager = restrictionManager;
  }

  public setRestrictionManager(rm: RestrictionManager): void {
    this.restrictionManager = rm;
  }

  public dispatch(event: NormalizedKeyboardEvent, rule: KeyboardShortcutRule): void {
    globalSecurityEventBus.dispatch(KEYBOARD_SECURITY_EVENTS.SHORTCUT_DETECTED, { event, rule });

    if (rule.action === 'BLOCK' || rule.action === 'WARN_ONLY' || rule.action === 'ENABLED') {
      if (this.restrictionManager) {
        this.restrictionManager.triggerViolation({
          ruleId: rule.id,
          category: 'INPUT',
          severity: rule.severity,
          message: `Restricted shortcut detected: ${rule.name} (${rule.keyCombination})`,
          metadata: { ...event, ruleId: rule.id },
        });
      }
    }
  }
}
