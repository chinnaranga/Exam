import { FullscreenPolicyRule, FullscreenPolicyRequirement, FullscreenPolicyAction } from '../types/FullscreenPolicy';
import { DEFAULT_FULLSCREEN_POLICY_RULE } from '../constants/FullscreenPolicies';

export class FullscreenPolicyService {
  private rule: FullscreenPolicyRule;

  constructor(rule: FullscreenPolicyRule = DEFAULT_FULLSCREEN_POLICY_RULE) {
    this.rule = { ...rule };
  }

  public getRule(): FullscreenPolicyRule {
    return { ...this.rule };
  }

  public updatePolicy(updates: Partial<FullscreenPolicyRule>): void {
    this.rule = { ...this.rule, ...updates };
  }
}
