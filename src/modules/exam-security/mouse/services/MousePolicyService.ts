import { MouseActionRule, MousePolicyAction, MouseInteractionType } from '../types/MouseAction';
import { DEFAULT_RESTRICTED_MOUSE_RULES } from '../constants/RestrictedMouseActions';

export class MousePolicyService {
  private rules: Map<string, MouseActionRule> = new Map();

  constructor(initialRules: MouseActionRule[] = DEFAULT_RESTRICTED_MOUSE_RULES) {
    initialRules.forEach((r) => this.rules.set(r.id, { ...r }));
  }

  public getRules(): MouseActionRule[] {
    return Array.from(this.rules.values());
  }

  public getRuleForInteraction(type: MouseInteractionType): MouseActionRule | undefined {
    return this.getRules().find((r) => r.interactionType === type);
  }

  public updatePolicy(id: string, action: MousePolicyAction): void {
    const rule = this.rules.get(id);
    if (rule) {
      rule.action = action;
      this.rules.set(id, rule);
    }
  }
}
