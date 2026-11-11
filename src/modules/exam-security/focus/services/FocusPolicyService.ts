import { FocusPolicyAction } from '../types/FocusState';

export interface FocusPolicyRule {
  id: string;
  name: string;
  actionOnBlur: FocusPolicyAction;
  actionOnTabSwitch: FocusPolicyAction;
  maxAllowedTabSwitches: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}

export class FocusPolicyService {
  private rule: FocusPolicyRule = {
    id: 'focus_policy_default',
    name: 'Enterprise Focus & Tab Switch Policy',
    actionOnBlur: 'WARN',
    actionOnTabSwitch: 'PAUSE',
    maxAllowedTabSwitches: 3,
    severity: 'HIGH',
    description: 'Monitor window focus, blur, tab switching, and background app transitions.',
  };

  public getRule(): FocusPolicyRule {
    return { ...this.rule };
  }

  public updatePolicy(updates: Partial<FocusPolicyRule>): void {
    this.rule = { ...this.rule, ...updates };
  }
}
