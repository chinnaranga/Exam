import { NavigationSentinelService } from './services/NavigationSentinelService';
import { NormalizedNavigationEvent } from './types/NavigationEvent';
import { globalSecurityEventBus } from '../events/SecurityEventBus';

export class NavigationEngine {
  private service: NavigationSentinelService;
  private logs: NormalizedNavigationEvent[] = [];

  constructor(contextData?: { examId?: string; studentId?: string }) {
    this.service = new NavigationSentinelService(contextData);
  }

  public setContextData(data?: { examId?: string; studentId?: string }): void {
    this.service.setContextData(data);
  }

  public start(onEvent?: (evt: NormalizedNavigationEvent) => void): void {
    this.service.start((evt) => {
      this.logs.push(evt);
      globalSecurityEventBus.dispatch(`NAV_${evt.type}`, evt);
      if (onEvent) onEvent(evt);
    });
  }

  public stop(): void {
    this.service.stop();
  }

  public getLogs(): NormalizedNavigationEvent[] {
    return [...this.logs];
  }
}
