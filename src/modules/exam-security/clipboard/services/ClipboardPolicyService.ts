import { ClipboardActionRule, ClipboardPolicyAction, ClipboardOperationType } from '../types/ClipboardAction';
import { DEFAULT_RESTRICTED_CLIPBOARD_RULES } from '../constants/RestrictedClipboardActions';

export class ClipboardPolicyService {
  private rules: Map<string, ClipboardActionRule> = new Map();

  constructor(initialRules: ClipboardActionRule[] = DEFAULT_RESTRICTED_CLIPBOARD_RULES) {
    initialRules.forEach((r) => this.rules.set(r.id, { ...r }));
  }

  public getRules(): ClipboardActionRule[] {
    return Array.from(this.rules.values());
  }

  public getRuleForOperation(op: ClipboardOperationType): ClipboardActionRule | undefined {
    return this.getRules().find((r) => r.operationType === op);
  }

  public updatePolicy(id: string, action: ClipboardPolicyAction): void {
    const rule = this.rules.get(id);
    if (rule) {
      rule.action = action;
      this.rules.set(id, rule);
    }
  }

  public setRules(rules: ClipboardActionRule[]): void {
    this.rules.clear();
    rules.forEach((r) => this.rules.set(r.id, { ...r }));
  }
}
