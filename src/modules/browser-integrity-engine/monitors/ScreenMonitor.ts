import { BaseModule } from '../core/BaseModule';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';

export interface ScreenState {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  screenLeft: number;
  screenTop: number;
  innerWidth: number;
  innerHeight: number;
  outerWidth: number;
  outerHeight: number;
  devicePixelRatio: number;
  isFullscreen: boolean;
  screenCount: number;
}

/**
 * @class ScreenMonitor
 * @extends BaseModule
 * @description Tracks display configurations, window movements, multi-monitor setups, and screen switching events.
 * 
 * COLLECTED METRICS:
 * • screen.width / screen.height & availWidth / availHeight
 * • screenLeft / screenTop & screenX / screenY window offset coordinates
 * • innerWidth / innerHeight & outerWidth / outerHeight
 * • devicePixelRatio
 * • Fullscreen API state (document.fullscreenElement)
 * • Window Management API (getScreenDetails when supported in Chromium browsers)
 * 
 * DETECTIONS:
 * • Multiple displays attached to candidate workstation
 * • Window relocation across screen coordinates
 * • Display switching (moving window from primary to secondary monitor)
 * • Display resolution / configuration changes
 * • Fullscreen mode exit events
 * 
 * HEURISTIC LIMITATIONS & FALSE POSITIVES:
 * • Multi-monitor desktop setups are common for remote candidates and do not inherently indicate cheating.
 * • Moving a browser window slightly can trigger WindowMoved events.
 * • Window Management API requires candidate permission prompt in modern browsers.
 */
export class ScreenMonitor extends BaseModule {
  private lastState: ScreenState | null = null;
  private checkIntervalId: ReturnType<typeof setInterval> | null = null;
  private screenDetailsObject: any = null;

  constructor(eventBus: EventBus, sessionManager: SessionManager) {
    super('ScreenMonitor', eventBus, sessionManager);
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;

    // Capture initial state
    this.lastState = this.captureScreenState();

    // Initial check for multi-monitor setup
    if (this.lastState.screenCount > 1) {
      this.emitMultipleDisplaysDetected(this.lastState.screenCount, 'Initial state detection');
    }

    // Attach Window Management API listeners if supported
    this.initWindowManagementAPI();

    // Event listeners
    this.addDOMListener(window, 'resize', this.handleScreenChange, { passive: true });
    this.addDOMListener(document, 'fullscreenchange', this.handleFullscreenChange, { passive: true });
    this.addDOMListener(document, 'webkitfullscreenchange', this.handleFullscreenChange, { passive: true });

    // Periodic window coordinate check (every 1000ms) to catch moves that don't trigger resize
    this.checkIntervalId = setInterval(() => {
      if (this.isRunning) {
        this.verifyWindowPosition();
      }
    }, 1000);
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }

    if (this.screenDetailsObject) {
      try {
        this.screenDetailsObject.removeEventListener('currentscreenchange', this.handleScreenDetailsChange);
        this.screenDetailsObject.removeEventListener('screenschange', this.handleScreenDetailsChange);
      } catch {}
      this.screenDetailsObject = null;
    }

    this.removeAllDOMListeners();
  }

  /**
   * Helper to capture current screen and window position snapshot.
   */
  public captureScreenState(): ScreenState {
    const scr = typeof screen !== 'undefined' ? screen : ({} as any);
    const win = typeof window !== 'undefined' ? window : ({} as any);
    const doc = typeof document !== 'undefined' ? document : ({} as any);

    const screenLeft = typeof win.screenLeft === 'number' ? win.screenLeft : (win.screenX || 0);
    const screenTop = typeof win.screenTop === 'number' ? win.screenTop : (win.screenY || 0);

    const isFullscreen = !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement
    );

    const screenCount = this.estimateScreenCount();

    return {
      width: scr.width || 0,
      height: scr.height || 0,
      availWidth: scr.availWidth || 0,
      availHeight: scr.availHeight || 0,
      screenLeft,
      screenTop,
      innerWidth: win.innerWidth || 0,
      innerHeight: win.innerHeight || 0,
      outerWidth: win.outerWidth || 0,
      outerHeight: win.outerHeight || 0,
      devicePixelRatio: win.devicePixelRatio || 1,
      isFullscreen,
      screenCount,
    };
  }

  /**
   * Initialize Window Management API (window.getScreenDetails) if available and permitted.
   */
  private async initWindowManagementAPI(): Promise<void> {
    if (typeof window === 'undefined') return;

    if ('getScreenDetails' in window && typeof (window as any).getScreenDetails === 'function') {
      try {
        const details = await (window as any).getScreenDetails();
        this.screenDetailsObject = details;

        if (details.screens && details.screens.length > 1) {
          this.emitMultipleDisplaysDetected(details.screens.length, 'Window Management API confirmation');
        }

        details.addEventListener('currentscreenchange', this.handleScreenDetailsChange);
        details.addEventListener('screenschange', this.handleScreenDetailsChange);
      } catch {
        // Permission denied or API unfulfilled
      }
    }
  }

  private handleScreenDetailsChange = () => {
    if (!this.isRunning || !this.screenDetailsObject) return;

    const count = this.screenDetailsObject.screens?.length || 1;
    if (count > 1) {
      this.emitMultipleDisplaysDetected(count, 'Window Management API event trigger');
    }
  };

  /**
   * Inspect current window coordinates and compare against stored snapshot.
   */
  private verifyWindowPosition = () => {
    if (!this.lastState || !this.isRunning) return;

    const current = this.captureScreenState();

    // 1. Detect Window Moved / Relocated
    const deltaX = Math.abs(current.screenLeft - this.lastState.screenLeft);
    const deltaY = Math.abs(current.screenTop - this.lastState.screenTop);

    if (deltaX > 20 || deltaY > 20) {
      // Check if moved to a different monitor screen range
      const isCrossScreenSwitch =
        current.screenLeft < 0 ||
        current.screenLeft >= current.width ||
        current.screenTop < 0 ||
        current.screenTop >= current.height;

      this.emitEvent({
        type: 'WindowMoved',
        severity: isCrossScreenSwitch ? 'MEDIUM' : 'LOW',
        confidence: 'HIGH',
        details: {
          message: `Browser window position relocated (ScreenLeft: ${current.screenLeft}, ScreenTop: ${current.screenTop}).`,
          explanation: isCrossScreenSwitch
            ? 'Browser window was moved across screen boundaries onto a secondary display monitor.'
            : 'Browser window was repositioned on the display.',
          limitationNote: 'Candidates may adjust window alignment for comfortable viewing.',
          possibleFalsePositives: ['Dragging window alignment', 'OS window snapping', 'Multi-monitor reposition'],
          metadata: {
            previousX: this.lastState.screenLeft,
            previousY: this.lastState.screenTop,
            currentX: current.screenLeft,
            currentY: current.screenTop,
            deltaX,
            deltaY,
            isCrossScreenSwitch,
          },
        },
      });
      this.lastState = current;
    }

    // 2. Check Display Metrics Change (resolution or available area)
    if (current.width !== this.lastState.width || current.height !== this.lastState.height || current.devicePixelRatio !== this.lastState.devicePixelRatio) {
      this.emitEvent({
        type: 'DisplayChanged',
        severity: 'LOW',
        confidence: 'HIGH',
        details: {
          message: `Display configuration updated (${current.width}x${current.height}, DPR: ${current.devicePixelRatio}).`,
          explanation: 'Screen resolution or device pixel ratio changed.',
          limitationNote: 'Plugging in an external display or changing OS display scaling triggers this event.',
          possibleFalsePositives: ['Connecting external monitor', 'OS display scaling toggle', 'Projector connection'],
          metadata: {
            previousResolution: `${this.lastState.width}x${this.lastState.height}`,
            currentResolution: `${current.width}x${current.height}`,
            previousDpr: this.lastState.devicePixelRatio,
            currentDpr: current.devicePixelRatio,
          },
        },
      });
      this.lastState = current;
    }
  };

  /**
   * Handle resize event.
   */
  private handleScreenChange = () => {
    this.verifyWindowPosition();
  };

  /**
   * Handle Fullscreen state change events.
   */
  private handleFullscreenChange = () => {
    if (!this.isRunning) return;

    const isFS = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement
    );

    if (this.lastState && this.lastState.isFullscreen && !isFS) {
      this.emitEvent({
        type: 'FullscreenExited',
        severity: 'MEDIUM',
        confidence: 'HIGH',
        details: {
          message: 'Examination fullscreen lockdown mode was exited.',
          signalStrength: 0.75,
          explanation: 'Candidate exited fullscreen mode.',
          limitationNote: 'ESC key press, OS notifications, or browser alerts force exit fullscreen mode.',
          possibleFalsePositives: ['Accidental ESC key press', 'OS software notification popup'],
          metadata: { isFullscreen: false },
        },
      });
    }

    if (this.lastState) {
      this.lastState.isFullscreen = isFS;
    }
  };

  /**
   * Emit MultipleDisplaysDetected event helper.
   */
  private emitMultipleDisplaysDetected(count: number, detectionMethod: string): void {
    this.emitEvent({
      type: 'MultipleDisplaysDetected',
      severity: 'LOW',
      confidence: 'MEDIUM',
      details: {
        message: `Multiple displays detected (${count} screens attached).`,
        signalStrength: 0.4,
        explanation: 'Workstation possesses multiple connected display monitors.',
        limitationNote: 'Multi-monitor setups are standard for desktop workstations and do not prove cheating.',
        possibleFalsePositives: ['Dual monitor developer setup', 'External laptop monitor attached'],
        metadata: { estimatedScreenCount: count, detectionMethod },
      },
    });
  }

  /**
   * Estimate screen count using available screen coordinate boundaries and availWidth.
   */
  private estimateScreenCount(): number {
    if (typeof window === 'undefined' || typeof screen === 'undefined') return 1;

    // Check Window Management API cached count first
    if (this.screenDetailsObject?.screens) {
      return this.screenDetailsObject.screens.length;
    }

    // Heuristic boundary check
    const screenLeft = window.screenLeft || window.screenX || 0;
    const screenTop = window.screenTop || window.screenY || 0;

    if (screenLeft < 0 || screenLeft >= screen.width || screenTop < 0 || screenTop >= screen.height) {
      return 2;
    }

    if (screen.availWidth > screen.width * 1.5) {
      return 2;
    }

    return 1;
  }
}
