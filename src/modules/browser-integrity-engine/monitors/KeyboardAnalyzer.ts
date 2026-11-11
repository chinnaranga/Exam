import { BaseModule } from '../core/BaseModule';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';

/**
 * @class KeyboardAnalyzer
 * @extends BaseModule
 * @description Analyzes keystroke dynamics, inter-keystroke intervals (IKI), shortcut combinations, and correction rate.
 * STRICT PRIVACY REQUIREMENT: NEVER records typed text or key values. Stores only timing metadata and key category codes.
 * 
 * HEURISTICS & LIMITATIONS:
 * • High-speed touch typists or users with mechanical keyboards exhibit low IKI variance.
 * • Password managers or browser autofill scripts generate artificial keystroke bursts.
 */
export class KeyboardAnalyzer extends BaseModule {
  public ikis: number[] = [];
  public backspaceCount: number = 0;
  public deleteCount: number = 0;
  public tabNavCount: number = 0;
  public copyShortcutCount: number = 0;
  public pasteShortcutCount: number = 0;

  public firstKeystrokeTimeMs: number | null = null;
  private lastKeyTimestamp: number | null = null;
  private recentTabKeyTimes: number[] = [];

  constructor(eventBus: EventBus, sessionManager: SessionManager) {
    super('KeyboardAnalyzer', eventBus, sessionManager);
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;

    this.addDOMListener(window, 'keydown', this.handleKeyDown, { passive: true });
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.removeAllDOMListeners();
  }

  private handleKeyDown = (e: Event) => {
    const keyEvt = e as KeyboardEvent;
    const now = Date.now();

    if (!this.firstKeystrokeTimeMs) {
      this.firstKeystrokeTimeMs = now;
      const session = this.sessionManager.getSessionState();
      const timeToFirstKeystroke = Math.round((now - session.startTimeMs) / 1000);

      this.emitEvent({
        type: 'FirstKeystrokeRecorded',
        severity: 'INFO',
        confidence: 'HIGH',
        details: {
          message: `First keystroke recorded after ${timeToFirstKeystroke} seconds.`,
          rawEventType: 'keydown',
          explanation: 'Candidate produced initial keyboard input.',
          metadata: { timeToFirstKeystrokeSec: timeToFirstKeystroke },
        },
      });
    }

    // 1. Calculate Inter-Keystroke Interval (IKI)
    if (this.lastKeyTimestamp) {
      const iki = now - this.lastKeyTimestamp;
      if (iki < 3000) { // Ignore long pauses
        this.ikis.push(iki);
        if (this.ikis.length > 50) {
          this.ikis.shift();
        }
        this.analyzeIKIVariance();
      }
    }
    this.lastKeyTimestamp = now;

    // 2. Track Special Key Frequencies (ONLY category metadata, NEVER actual character)
    const code = keyEvt.code;
    const isControlOrMeta = keyEvt.ctrlKey || keyEvt.metaKey;

    if (code === 'Backspace') {
      this.backspaceCount += 1;
    } else if (code === 'Delete') {
      this.deleteCount += 1;
    } else if (code === 'Tab') {
      this.tabNavCount += 1;
      this.recentTabKeyTimes.push(now);
      this.analyzeRapidTabNav(now);
    } else if (isControlOrMeta && (code === 'KeyV' || keyEvt.key === 'v' || keyEvt.key === 'V')) {
      this.pasteShortcutCount += 1;
      this.emitEvent({
        type: 'RapidPasteShortcut',
        severity: this.pasteShortcutCount > 3 ? 'HIGH' : 'MEDIUM',
        confidence: 'HIGH',
        details: {
          message: `Paste shortcut (Ctrl+V / Cmd+V) detected (Count #${this.pasteShortcutCount}).`,
          signalStrength: Math.min(1.0, this.pasteShortcutCount * 0.3),
          rawEventType: 'keydown',
          explanation: 'Candidate executed keyboard paste shortcut.',
          limitationNote: 'Candidate may be pasting code snippets or permitted reference text.',
          possibleFalsePositives: ['Pasting permitted reference code', 'Accidental shortcut press'],
          metadata: { pasteShortcutCount: this.pasteShortcutCount },
        },
      });
    } else if (isControlOrMeta && (code === 'KeyC' || keyEvt.key === 'c' || keyEvt.key === 'C')) {
      this.copyShortcutCount += 1;
      this.emitEvent({
        type: 'CopyShortcutDetected',
        severity: 'LOW',
        confidence: 'HIGH',
        details: {
          message: `Copy shortcut (Ctrl+C / Cmd+C) detected (Count #${this.copyShortcutCount}).`,
          rawEventType: 'keydown',
          explanation: 'Candidate executed keyboard copy shortcut.',
          metadata: { copyShortcutCount: this.copyShortcutCount },
        },
      });
    }
  };

  private analyzeIKIVariance(): void {
    if (this.ikis.length < 15) return;

    const avg = this.ikis.reduce((a, b) => a + b, 0) / this.ikis.length;
    const variance = this.ikis.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / this.ikis.length;

    // Suspiciously uniform typing intervals (< 8ms variance, avg < 150ms)
    if (variance < 8 && avg < 150) {
      this.emitEvent({
        type: 'UniformKeystrokeTiming',
        severity: 'MEDIUM',
        confidence: 'MEDIUM',
        details: {
          message: `Suspiciously uniform keystroke timing detected (Avg IKI ${Math.round(avg)}ms, variance ${Math.round(variance)}).`,
          signalStrength: 0.6,
          rawEventType: 'keydown',
          explanation: 'Keystroke timing showed zero-variance periodicity characteristic of software auto-typer scripts.',
          limitationNote: 'Bar code scanners, password autofill scripts, or hardware macros emit fixed IKI.',
          possibleFalsePositives: ['Password manager autofill', 'Barcode scanner input', 'Hardware macro key'],
          metadata: { avgIKIMs: Math.round(avg), ikiVariance: Math.round(variance) },
        },
      });
      this.ikis = [];
    }
  }

  private analyzeRapidTabNav(now: number): void {
    this.recentTabKeyTimes = this.recentTabKeyTimes.filter((t) => now - t <= 3000);
    if (this.recentTabKeyTimes.length >= 5) {
      this.emitEvent({
        type: 'RapidTabNavigation',
        severity: 'LOW',
        confidence: 'HIGH',
        details: {
          message: `Rapid Tab key navigation detected (${this.recentTabKeyTimes.length} tabs in < 3s).`,
          rawEventType: 'keydown',
          explanation: 'Candidate rapidly cycled through interface focus targets using Tab key.',
          metadata: { tabCount: this.recentTabKeyTimes.length },
        },
      });
      this.recentTabKeyTimes = [];
    }
  }
}
