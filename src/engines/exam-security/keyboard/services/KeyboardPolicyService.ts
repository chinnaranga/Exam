import { KeyboardShortcutRule, KeyboardPolicyAction } from '../types/KeyboardShortcut';
import { DEFAULT_RESTRICTED_SHORTCUTS } from '../constants/RestrictedKeys';

export class KeyboardPolicyService {
  private rules: Map<string, KeyboardShortcutRule> = new Map();

  constructor(initialRules: KeyboardShortcutRule[] = DEFAULT_RESTRICTED_SHORTCUTS) {
    initialRules.forEach((rule) => this.rules.set(rule.id, { ...rule }));
  }

  public getRules(): KeyboardShortcutRule[] {
    return Array.from(this.rules.values());
  }

  public getRule(id: string): KeyboardShortcutRule | undefined {
    return this.rules.get(id);
  }

  public updateRuleAction(id: string, action: KeyboardPolicyAction): void {
    const rule = this.rules.get(id);
    if (rule) {
      rule.action = action;
      this.rules.set(id, rule);
    }
  }

  public setRules(rules: KeyboardShortcutRule[]): void {
    this.rules.clear();
    rules.forEach((rule) => this.rules.set(rule.id, { ...rule }));
  }
}
