import { NormalizedBrowserEvent } from '../types/BrowserEvent';
import { SecurityEventBus } from '../../events/SecurityEventBus';

export class BrowserEventDispatcher {
  private eventBus: SecurityEventBus;

  constructor(eventBus: SecurityEventBus) {
    this.eventBus = eventBus;
  }

  public dispatch(event: NormalizedBrowserEvent): void {
    this.eventBus.dispatch(`BROWSER_${event.eventType}`, event);
  }
}
