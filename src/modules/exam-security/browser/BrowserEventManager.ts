import { BrowserEventListener } from './services/BrowserEventListener';
import { BrowserEventDispatcher } from './services/BrowserEventDispatcher';
import { globalSecurityEventBus } from '../events/SecurityEventBus';
import { NormalizedBrowserEvent } from './types/BrowserEvent';

export class BrowserEventManager {
  private listener: BrowserEventListener;
  private dispatcher: BrowserEventDispatcher;
  private lastEvent?: NormalizedBrowserEvent;
  private eventCount = 0;

  constructor(contextData?: { examId?: string; studentId?: string; sessionId?: string }) {
    this.listener = new BrowserEventListener(contextData);
    this.dispatcher = new BrowserEventDispatcher(globalSecurityEventBus);
  }

  public startMonitoring(onEventCollected?: (event: NormalizedBrowserEvent) => void): void {
    this.listener.start((event) => {
      this.lastEvent = event;
      this.eventCount += 1;
      this.dispatcher.dispatch(event);
      if (onEventCollected) {
        onEventCollected(event);
      }
    });
  }

  public stopMonitoring(): void {
    this.listener.stop();
  }

  public setContextData(data?: { examId?: string; studentId?: string; sessionId?: string }): void {
    this.listener.setContextData(data);
  }

  public getLastEvent(): NormalizedBrowserEvent | undefined {
    return this.lastEvent;
  }

  public getEventCount(): number {
    return this.eventCount;
  }
}
