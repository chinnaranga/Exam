import { RestrictionRule } from '../types/security.types';

export class RestrictionRegistry {
  private restrictions: Map<string, RestrictionRule> = new Map();

  public register(rule: RestrictionRule): void {
    this.restrictions.set(rule.id, rule);
  }

  public remove(ruleId: string): boolean {
    return this.restrictions.delete(ruleId);
  }

  public get(ruleId: string): RestrictionRule | undefined {
    return this.restrictions.get(ruleId);
  }

  public getAll(): RestrictionRule[] {
    return Array.from(this.restrictions.values());
  }

  public clear(): void {
    this.restrictions.clear();
  }
}
