import { DEFAULT_MAX_WARNINGS } from '../constants/security.constants';

export class WarningManager {
  private warningCount: number = 0;
  private maxWarnings: number = DEFAULT_MAX_WARNINGS;

  constructor(maxWarnings: number = DEFAULT_MAX_WARNINGS) {
    this.maxWarnings = maxWarnings;
  }

  public issueWarning(customMessage?: string): { warningCount: number; maxWarnings: number; isMaxReached: boolean; message: string } {
    this.warningCount += 1;
    const isMaxReached = this.warningCount >= this.maxWarnings;
    const message = customMessage || `Security Warning ${this.warningCount}/${this.maxWarnings}: Exam restriction policy triggered.`;

    return {
      warningCount: this.warningCount,
      maxWarnings: this.maxWarnings,
      isMaxReached,
      message,
    };
  }

  public getWarningCount(): number {
    return this.warningCount;
  }

  public getMaxWarnings(): number {
    return this.maxWarnings;
  }

  public reset(): void {
    this.warningCount = 0;
  }
}
