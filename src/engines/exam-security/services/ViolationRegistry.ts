import { ExamViolation } from '../types/security.types';

export class ViolationRegistry {
  private violations: ExamViolation[] = [];

  public add(violation: ExamViolation): void {
    this.violations.push(violation);
  }

  public getAll(): ExamViolation[] {
    return [...this.violations];
  }

  public getByRuleId(ruleId: string): ExamViolation[] {
    return this.violations.filter((v) => v.ruleId === ruleId);
  }

  public count(): number {
    return this.violations.length;
  }

  public clear(): void {
    this.violations = [];
  }
}
