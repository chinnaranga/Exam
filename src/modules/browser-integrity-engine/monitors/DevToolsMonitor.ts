import { BaseModule } from '../core/BaseModule';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';

/**
 * @class DevToolsMonitor
 * @extends BaseModule
 * @description Collects best-effort indicators that browser Developer Tools (DevTools) may be open.
 * Uses 9 independent heuristics to evaluate potential DevTools activity without relying on a single signal.
 * 
 * HEURISTICS IMPLEMENTED:
 * 1. outerWidth vs innerWidth differential (Side-docked DevTools panel)
 * 2. outerHeight vs innerHeight differential (Bottom-docked DevTools panel)
 * 3. Debugger timing heuristic (measuring execution pause caused by active breakpoint/debugger statement)
 * 4. Viewport resize anomalies (detecting unusual aspect ratio shifts)
 * 5. Zoom level monitoring (tracking ratio changes between inner dimensions and screen space)
 * 6. devicePixelRatio dynamic changes (detecting Device Emulation Mode toggle)
 * 7. Console timing heuristic (measuring console object getter expansion delays)
 * 8. Performance loop drift timing anomalies (detecting profiling CPU overhead/freezes)
 * 9. Resize frequency threshold (detecting manual panel drag/docking activity)
 * 
 * HEURISTIC METADATA & CONFIDENCE RATIONALE:
 * • DevTools detection in modern browsers is intentionally restricted by browser vendors for security/privacy.
 * • No single client-side heuristic provides 100% certainty.
 * • False positives occur under normal user actions (multi-monitor scaling, browser sidebar/bookmarks bar, OS taskbar changes).
 * • This module NEVER asserts cheating; all signals are probabilistic telemetry events.
 */
export class DevToolsMonitor extends BaseModule {
  // Threshold constants
  private static readonly DIMENSION_DIFF_THRESHOLD_PX = 160;
  private static readonly DEBUGGER_DELAY_THRESHOLD_MS = 100;
  private static readonly CONSOLE_TIMING_THRESHOLD_MS = 10;
  private static readonly RESIZE_BURST_THRESHOLD = 5;
  private static readonly RESIZE_BURST_WINDOW_MS = 2000;
  private static readonly LOOP_DRIFT_THRESHOLD_MS = 500;

  // Tracked states
  private lastInnerWidth: number = 0;
  private lastInnerHeight: number = 0;
  private lastDevicePixelRatio: number = 1;
  private lastZoomRatio: number = 1;
  private resizeTimestamps: number[] = [];

  // Interval IDs for background heuristics
  private checkIntervalId: ReturnType<typeof setInterval> | null = null;
  private performanceLoopId: ReturnType<typeof setInterval> | null = null;
  private lastLoopTimestamp: number = Date.now();

  constructor(eventBus: EventBus, sessionManager: SessionManager) {
    super('DevToolsMonitor', eventBus, sessionManager);
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;

    this.lastInnerWidth = window.innerWidth;
    this.lastInnerHeight = window.innerHeight;
    this.lastDevicePixelRatio = window.devicePixelRatio || 1;
    this.lastZoomRatio = this.calculateZoomRatio();
    this.lastLoopTimestamp = Date.now();

    // Attach passive window listeners
    this.addDOMListener(window, 'resize', this.handleResize, { passive: true });

    // Periodic evaluation of heuristics (every 2000ms)
    this.checkIntervalId = setInterval(() => {
      if (!this.isRunning) return;
      this.runDimensionHeuristics();
      this.runDebuggerTimingHeuristic();
      this.runConsoleTimingHeuristic();
    }, 2000);

    // Performance loop drift checker (every 1000ms)
    this.performanceLoopId = setInterval(() => {
      if (!this.isRunning) return;
      this.runPerformanceTimingHeuristic();
    }, 1000);
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }
    if (this.performanceLoopId) {
      clearInterval(this.performanceLoopId);
      this.performanceLoopId = null;
    }

    this.removeAllDOMListeners();
  }

  /**
   * Handle window resize events for viewport, zoom, devicePixelRatio, and resize frequency heuristics.
   */
  private handleResize = () => {
    if (!this.isRunning) return;

    const now = Date.now();
    const currentInnerWidth = window.innerWidth;
    const currentInnerHeight = window.innerHeight;
    const currentDpr = window.devicePixelRatio || 1;
    const currentZoom = this.calculateZoomRatio();

    // 1. Resize Frequency Tracking
    this.resizeTimestamps.push(now);
    this.resizeTimestamps = this.resizeTimestamps.filter(
      (t) => now - t <= DevToolsMonitor.RESIZE_BURST_WINDOW_MS
    );
    const isRapidResizing = this.resizeTimestamps.length >= DevToolsMonitor.RESIZE_BURST_THRESHOLD;

    // 2. Viewport Changed Event
    const widthDiff = Math.abs(currentInnerWidth - this.lastInnerWidth);
    const heightDiff = Math.abs(currentInnerHeight - this.lastInnerHeight);

    if (widthDiff > 10 || heightDiff > 10) {
      this.emitEvent({
        type: 'ViewportChanged',
        severity: isRapidResizing ? 'MEDIUM' : 'LOW',
        confidence: 'HIGH',
        details: {
          message: `Viewport resized (${currentInnerWidth}x${currentInnerHeight}).`,
          explanation: 'Browser viewport dimensions updated.',
          limitationNote: 'Normal user window dragging, snapping, or dual monitor moves trigger viewport resizes.',
          possibleFalsePositives: ['Manual browser window resize', 'OS window snapping', 'Display resolution switch'],
          metadata: {
            innerWidth: currentInnerWidth,
            innerHeight: currentInnerHeight,
            deltaWidth: widthDiff,
            deltaHeight: heightDiff,
            rapidResizing: isRapidResizing,
            resizeFrequencyCount: this.resizeTimestamps.length,
          },
        },
      });
      this.lastInnerWidth = currentInnerWidth;
      this.lastInnerHeight = currentInnerHeight;
    }

    // 3. Zoom / devicePixelRatio Changed
    if (Math.abs(currentDpr - this.lastDevicePixelRatio) > 0.05 || Math.abs(currentZoom - this.lastZoomRatio) > 0.05) {
      this.emitEvent({
        type: 'ZoomChanged',
        severity: 'LOW',
        confidence: 'HIGH',
        details: {
          message: `Browser zoom level or devicePixelRatio changed (DPR: ${currentDpr.toFixed(2)}, Zoom: ${currentZoom.toFixed(2)}).`,
          explanation: 'Detected page zoom change or Device Emulation mode toggle.',
          limitationNote: 'Users frequently zoom in/out with Ctrl+MouseWheel or browser settings.',
          possibleFalsePositives: ['Pinch to zoom', 'Ctrl+/Ctrl- browser zoom', 'Accessibility zoom adjustments'],
          metadata: {
            previousDpr: this.lastDevicePixelRatio,
            currentDpr,
            previousZoom: this.lastZoomRatio,
            currentZoom,
          },
        },
      });
      this.lastDevicePixelRatio = currentDpr;
      this.lastZoomRatio = currentZoom;
    }

    // Evaluate dimension differentials on resize
    this.runDimensionHeuristics();
  };

  /**
   * Heuristic 1 & 2: Outer vs Inner Dimension Differentials
   * Confidence: MEDIUM
   * Limitations: Browser chrome, OS taskbars, sidebars (e.g. Edge sidebar, Safari sidebar), or bookmarks bar.
   * False Positives: Extended browser extensions, vertical tab bars, window borders.
   */
  private runDimensionHeuristics(): void {
    if (typeof window === 'undefined') return;

    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    const sideDocked = widthDiff > DevToolsMonitor.DIMENSION_DIFF_THRESHOLD_PX;
    const bottomDocked = heightDiff > DevToolsMonitor.DIMENSION_DIFF_THRESHOLD_PX;

    if (sideDocked || bottomDocked) {
      this.emitEvent({
        type: 'DevToolsPossible',
        severity: 'MEDIUM',
        confidence: 'MEDIUM',
        details: {
          message: `DevTools panel potentially open based on window dimension differential (WidthDiff: ${widthDiff}px, HeightDiff: ${heightDiff}px).`,
          signalStrength: Math.min(1.0, Math.max(widthDiff, heightDiff) / 400),
          explanation: sideDocked
            ? 'Side-docked DevTools panel detected via outerWidth vs innerWidth gap.'
            : 'Bottom-docked DevTools panel detected via outerHeight vs innerHeight gap.',
          limitationNote: 'Sidebars, vertical tab strips, OS taskbars, or browser frame padding increase outer dimensions.',
          possibleFalsePositives: ['Browser vertical tabs bar', 'OS taskbar on side/bottom', 'Browser extension side panels'],
          metadata: {
            outerWidth: window.outerWidth,
            innerWidth: window.innerWidth,
            outerHeight: window.outerHeight,
            innerHeight: window.innerHeight,
            widthDiff,
            heightDiff,
            dockType: sideDocked ? 'SIDE' : 'BOTTOM',
          },
        },
      });
    }
  }

  /**
   * Heuristic 3: Debugger Timing Heuristic
   * Measures time delay across a function call containing a conditional `debugger;` instruction or execution block.
   * Confidence: HIGH
   * Limitations: Disabled if candidate browser ignores `debugger;` statements or when script execution is backgrounded.
   * False Positives: Heavy CPU background tasks or browser tab throttling.
   */
  private runDebuggerTimingHeuristic(): void {
    const start = performance.now();
    // Executing micro-eval breakpoint check
    try {
      const fn = new Function('debugger;');
      fn();
    } catch {
      // Ignore if CSP blocks Function constructor
    }
    const duration = performance.now() - start;

    if (duration > DevToolsMonitor.DEBUGGER_DELAY_THRESHOLD_MS) {
      this.emitEvent({
        type: 'DebuggerDelay',
        severity: 'HIGH',
        confidence: 'HIGH',
        details: {
          message: `Execution pause of ${Math.round(duration)}ms detected during debugger statement evaluation.`,
          signalStrength: Math.min(1.0, duration / 1000),
          explanation: 'Script execution paused significantly, indicating an active breakpoint or debugger panel.',
          limitationNote: 'Extremely heavy CPU load or tab throttling may cause execution delay.',
          possibleFalsePositives: ['Thread execution freeze', 'Heavy garbage collection pause'],
          metadata: { delayMs: Math.round(duration) },
        },
      });
    }
  }

  /**
   * Heuristic 7: Console Timing Heuristic
   * Exploits lazy stringification / object inspection getters during console output.
   * Confidence: LOW
   * Limitations: Behavior varies across Chromium, Firefox, and WebKit rendering engines.
   * False Positives: Console logging overhead in development builds.
   */
  private runConsoleTimingHeuristic(): void {
    let getterTriggered = false;
    const element: any = new Image();
    Object.defineProperty(element, 'id', {
      get: () => {
        getterTriggered = true;
        return 'devtools-check';
      },
    });

    const start = performance.now();
    // Passing element with custom getter to console.dir/log
    if (typeof console !== 'undefined' && console.dir) {
      console.dir(element);
    }
    const duration = performance.now() - start;

    if (getterTriggered || duration > DevToolsMonitor.CONSOLE_TIMING_THRESHOLD_MS) {
      this.emitEvent({
        type: 'DevToolsPossible',
        severity: 'LOW',
        confidence: 'LOW',
        details: {
          message: 'Console timing anomaly detected via object property getter evaluation.',
          signalStrength: 0.4,
          explanation: 'Object getter was accessed during console output inspection.',
          limitationNote: 'Console inspection detection depends heavily on specific browser engine version.',
          possibleFalsePositives: ['Browser logging extensions', 'DevTools opened in separate window'],
          metadata: { getterTriggered, durationMs: Math.round(duration) },
        },
      });
    }
  }

  /**
   * Heuristic 8: Performance Loop Drift Timing Anomaly
   * Confidence: LOW
   * Limitations: Occurs during background tab throttling or intensive web rendering.
   */
  private runPerformanceTimingHeuristic(): void {
    const now = Date.now();
    const drift = now - this.lastLoopTimestamp - 1000;
    this.lastLoopTimestamp = now;

    if (drift > DevToolsMonitor.LOOP_DRIFT_THRESHOLD_MS) {
      // Only emit if window is active/focused to avoid background tab false positives
      if (typeof document !== 'undefined' && !document.hidden) {
        this.emitEvent({
          type: 'DevToolsPossible',
          severity: 'LOW',
          confidence: 'LOW',
          details: {
            message: `Performance loop drift of ${drift}ms detected in active tab.`,
            signalStrength: Math.min(1.0, drift / 2000),
            explanation: 'Execution loop experienced significant latency while tab was visible.',
            limitationNote: 'System lag, heavy background tasks, or GC sweeps cause loop drift.',
            possibleFalsePositives: ['High CPU utilization', 'Garbage collection pause', 'Tab switching delay'],
            metadata: { driftMs: drift },
          },
        });
      }
    }
  }

  /**
   * Helper to estimate browser zoom ratio based on window metrics.
   */
  private calculateZoomRatio(): number {
    if (typeof window === 'undefined') return 1;
    const screenWidth = window.screen?.width || window.innerWidth;
    if (screenWidth === 0) return 1;
    return Math.round((window.outerWidth / window.innerWidth) * 100) / 100;
  }
}
