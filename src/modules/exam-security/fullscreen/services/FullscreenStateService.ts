import { FullscreenState } from '../types/FullscreenState';
import { BrowserCompatibility } from '../utils/BrowserCompatibility';

export class FullscreenStateService {
  private currentState: FullscreenState = 'UNKNOWN';

  constructor() {
    this.updateStateFromDOM();
  }

  public updateStateFromDOM(): FullscreenState {
    if (!BrowserCompatibility.isFullscreenSupported()) {
      this.currentState = 'UNSUPPORTED';
    } else if (BrowserCompatibility.isCurrentlyFullscreen()) {
      this.currentState = 'ACTIVE';
    } else {
      this.currentState = 'EXITING';
    }
    return this.currentState;
  }

  public setState(state: FullscreenState): void {
    this.currentState = state;
  }

  public getState(): FullscreenState {
    return this.currentState;
  }
}
