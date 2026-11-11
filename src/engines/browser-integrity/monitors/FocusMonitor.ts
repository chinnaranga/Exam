import { BaseModule } from '../core/BaseModule';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';

/**
 * @class FocusMonitor
 * @extends BaseModule
 * @description Tracks window focus, blur, tab visibility, and fullscreen mode duration metrics.
 * 
 * HEURISTICS & LIMITATIONS:
 * • Candidates with multi-monitor workstation setups or OS system alerts (antivirus, updates) generate focus loss events.
 * • Rapid tab switches can occur during legitimately permitted reference searches (if permitted by exam rules).
 */
export class FocusMonitor extends BaseModule {
  public focusDuration: number = 0;
  public blurDuration: number = 0;
  public visibilityDuration: number = 0;
  public fullscreenDuration: number = 0;

  private focusLossCount: number = 0;
  private tabSwitchCount: number = 0;
  private fullscreenExitCount: number = 0;

  private lastBlurTime: number | null = null;
  private lastFocusTime: number = Date.now();
  private lastVisibilityChangeTime: number = Date.now();
  private lastFullscreenChangeTime: number = Date.now();

  private rapidTabSwitchWindow: number[] = [];
  private pollIntervalId: ReturnType<typeof setInterval> | null = null;
  private wasFocused: boolean = true;

  constructor(eventBus: EventBus, sessionManager: SessionManager) {
    super('FocusMonitor', eventBus, sessionManager);
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;

    this.lastFocusTime = Date.now();
    this.lastVisibilityChangeTime = Date.now();
    this.wasFocused = typeof document !== 'undefined' && document.hasFocus ? document.hasFocus() : true;

    this.addDOMListener(window, 'focus', this.handleFocus, { passive: true });
    this.addDOMListener(window, 'blur', this.handleBlur, { passive: true });
    this.addDOMListener(document, 'visibilitychange', this.handleVisibilityChange, { passive: true });
    this.addDOMListener(document, 'fullscreenchange', this.handleFullscreenChange, { passive: true });
    this.addDOMListener(document, 'webkitfullscreenchange', this.handleFullscreenChange, { passive: true });

    // Active 500ms document.hasFocus() poller (do not rely only on blur events)
    this.pollIntervalId = setInterval(() => {
      if (!this.isRunning || typeof document === 'undefined') return;
      const currentlyFocused = document.hasFocus ? document.hasFocus() : true;
      if (!currentlyFocused && this.wasFocused) {
        this.wasFocused = false;
        this.handleBlur();
      } else if (currentlyFocused && !this.wasFocused) {
        this.wasFocused = true;
        this.handleFocus();
      }
    }, 500);
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }

    this.removeAllDOMListeners();
  }

  private handleFocus = () => {
    const now = Date.now();
    let durationSec = 0;

    if (this.lastBlurTime) {
      durationSec = Math.round((now - this.lastBlurTime) / 1000);
      this.blurDuration += durationSec;
      this.lastBlurTime = null;
    }
    this.lastFocusTime = now;

    const severity = durationSec > 45 ? 'HIGH' : durationSec > 15 ? 'MEDIUM' : 'LOW';

    this.emitEvent({
      type: 'FocusRecovered',
      severity,
      confidence: 'HIGH',
      details: {
        message: `Window focus recovered after ${durationSec} seconds away.`,
        signalStrength: Math.min(1.0, durationSec / 60),
        rawEventType: 'focus',
        explanation: `Candidate returned focus to the examination window after ${durationSec}s.`,
        limitationNote: 'Candidate may have been responding to OS alerts or using secondary monitor.',
        possibleFalsePositives: ['System notification popups', 'Secondary display click-away'],
        metadata: { durationSeconds: durationSec, focusLossCount: this.focusLossCount },
      },
    });
  };

  private handleBlur = () => {
    const now = Date.now();
    this.lastBlurTime = now;
    this.focusLossCount += 1;

    const durationFocused = Math.round((now - this.lastFocusTime) / 1000);
    this.focusDuration += durationFocused;

    this.emitEvent({
      type: 'FocusLost',
      severity: this.focusLossCount > 3 ? 'HIGH' : 'MEDIUM',
      confidence: 'HIGH',
      details: {
        message: `Window focus lost (Occurrence #${this.focusLossCount}).`,
        signalStrength: Math.min(1.0, this.focusLossCount * 0.25),
        rawEventType: 'blur',
        explanation: 'Browser window lost active user input focus.',
        limitationNote: 'Focus loss occurs automatically on system dialogs or desktop notifications.',
        possibleFalsePositives: ['OS update alert', 'Antivirus popup', 'Multi-monitor click'],
        metadata: { focusLossCount: this.focusLossCount, durationFocusedSec: durationFocused },
      },
    });
  };

  private handleVisibilityChange = () => {
    const now = Date.now();
    const isHidden = document.hidden;
    const duration = Math.round((now - this.lastVisibilityChangeTime) / 1000);
    this.lastVisibilityChangeTime = now;

    if (isHidden) {
      this.tabSwitchCount += 1;
      this.rapidTabSwitchWindow.push(now);
      // Clean timestamps older than 60 seconds
      this.rapidTabSwitchWindow = this.rapidTabSwitchWindow.filter((t) => now - t <= 60000);

      const isRapid = this.rapidTabSwitchWindow.length >= 3;

      this.emitEvent({
        type: 'VisibilityHidden',
        severity: isRapid ? 'HIGH' : 'MEDIUM',
        confidence: 'HIGH',
        details: {
          message: `Document hidden / tab switched (Switch #${this.tabSwitchCount}${isRapid ? ' - RAPID SWITCH' : ''}).`,
          signalStrength: isRapid ? 0.9 : 0.5,
          rawEventType: 'visibilitychange',
          explanation: isRapid ? 'Rapid succession of tab switches within 60s detected.' : 'Exam tab lost visibility.',
          limitationNote: 'Candidate may be consulting permitted reference materials.',
          possibleFalsePositives: ['Opening permitted docs', 'Accidental window minimize'],
          metadata: { tabSwitchCount: this.tabSwitchCount, isRapidSwitch: isRapid, visibleDurationSec: duration },
        },
      });
    } else {
      this.emitEvent({
        type: 'VisibilityVisible',
        severity: 'LOW',
        confidence: 'HIGH',
        details: {
          message: 'Document returned to visible state.',
          rawEventType: 'visibilitychange',
          explanation: 'Exam tab became visible again.',
          metadata: { hiddenDurationSec: duration },
        },
      });
    }
  };

  private handleFullscreenChange = () => {
    const now = Date.now();
    const isFS = !!document.fullscreenElement;
    const duration = Math.round((now - this.lastFullscreenChangeTime) / 1000);
    this.lastFullscreenChangeTime = now;

    if (!isFS) {
      this.fullscreenExitCount += 1;
      this.emitEvent({
        type: 'FullscreenExited',
        severity: this.fullscreenExitCount > 2 ? 'HIGH' : 'MEDIUM',
        confidence: 'HIGH',
        details: {
          message: `Fullscreen mode exited (Exit #${this.fullscreenExitCount}).`,
          signalStrength: Math.min(1.0, this.fullscreenExitCount * 0.35),
          rawEventType: 'fullscreenchange',
          explanation: 'Exam window exited fullscreen lockdown mode.',
          limitationNote: 'ESC key, browser notifications, or window resize trigger fullscreen exits.',
          possibleFalsePositives: ['ESC key pressed by habit', 'Browser notification alert'],
          metadata: { exitCount: this.fullscreenExitCount, fullscreenDurationSec: duration },
        },
      });
    } else {
      this.emitEvent({
        type: 'FullscreenEntered',
        severity: 'INFO',
        confidence: 'HIGH',
        details: {
          message: 'Fullscreen mode restored.',
          rawEventType: 'fullscreenchange',
          explanation: 'Candidate restored fullscreen examination mode.',
          metadata: { exitDurationSec: duration },
        },
      });
    }
  };
}
