/**
 * Layer 1 Security Hardening Engine
 * 
 * Implements strict workstation restrictions:
 * 1. Blocking/flagging PrintScreen, Ctrl+P, Ctrl+S, Ctrl+F, Ctrl+U, Win/Cmd key combos.
 * 2. 500ms document.hasFocus() polling sentinel (never relies solely on blur events).
 * 3. Picture-in-Picture detection and automatic exit.
 * 4. Window snapping and abnormal resizing detection.
 * 5. DevTools detection via outer-vs-inner dimension discrepancies and debugger timing loops.
 * 6. Question text selection and drag-and-drop interception.
 * 7. Input hardening (disabling autofill, spellcheck, autocorrect).
 */

export interface Layer1ViolationEvent {
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  points: number;
  reason: string;
  details?: Record<string, unknown>;
  timestamp: number;
}

export interface Layer1HardenerOptions {
  onViolation: (event: Layer1ViolationEvent) => void;
  questionContainerSelector?: string;
  focusPollIntervalMs?: number; // default: 500ms
  devtoolsPollIntervalMs?: number; // default: 2000ms
  pipPollIntervalMs?: number; // default: 1000ms
  enabled?: boolean;
}

export class Layer1ExamHardener {
  private options: Layer1HardenerOptions;
  private isRunning: boolean = false;
  private focusPollTimer: ReturnType<typeof setInterval> | null = null;
  private devtoolsPollTimer: ReturnType<typeof setInterval> | null = null;
  private pipPollTimer: ReturnType<typeof setInterval> | null = null;

  // State tracking
  private lastFocusState: boolean = true;
  private focusLostAt: number | null = null;
  private lastInnerWidth: number = 0;
  private lastInnerHeight: number = 0;

  constructor(options: Layer1HardenerOptions) {
    this.options = {
      focusPollIntervalMs: 500,
      devtoolsPollIntervalMs: 2000,
      pipPollIntervalMs: 1000,
      enabled: true,
      ...options,
    };
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;

    this.lastInnerWidth = window.innerWidth;
    this.lastInnerHeight = window.innerHeight;
    this.lastFocusState = typeof document !== 'undefined' && document.hasFocus ? document.hasFocus() : true;

    // 1. Keyboard event listeners (capture phase)
    window.addEventListener('keydown', this.handleKeyDown, true);
    window.addEventListener('keyup', this.handleKeyUp, true);
    window.addEventListener('beforeprint', this.handleBeforePrint, true);

    // 2. Mouse selection & drag-and-drop prevention
    document.addEventListener('selectstart', this.handleSelectStart, true);
    document.addEventListener('dragstart', this.handleDragStart, true);
    document.addEventListener('dragover', this.handleDragOver, true);
    document.addEventListener('drop', this.handleDrop, true);

    // 3. Window resize / snap listener
    window.addEventListener('resize', this.handleWindowResize, { passive: true });

    // 4. Picture-in-picture listener
    document.addEventListener('enterpictureinpicture', this.handleEnterPiP, true);

    // 5. Active 500ms document.hasFocus() polling
    this.startFocusPolling();

    // 6. DevTools polling (dimensions + debugger timing)
    this.startDevToolsPolling();

    // 7. PiP polling check
    this.startPiPPolling();

    // 8. Enforce input hardening (autoComplete=off, spellCheck=false)
    this.hardenInputs();
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.focusPollTimer) {
      clearInterval(this.focusPollTimer);
      this.focusPollTimer = null;
    }
    if (this.devtoolsPollTimer) {
      clearInterval(this.devtoolsPollTimer);
      this.devtoolsPollTimer = null;
    }
    if (this.pipPollTimer) {
      clearInterval(this.pipPollTimer);
      this.pipPollTimer = null;
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown, true);
      window.removeEventListener('keyup', this.handleKeyUp, true);
      window.removeEventListener('beforeprint', this.handleBeforePrint, true);
      window.removeEventListener('resize', this.handleWindowResize, true);
    }

    if (typeof document !== 'undefined') {
      document.removeEventListener('selectstart', this.handleSelectStart, true);
      document.removeEventListener('dragstart', this.handleDragStart, true);
      document.removeEventListener('dragover', this.handleDragOver, true);
      document.removeEventListener('drop', this.handleDrop, true);
      document.removeEventListener('enterpictureinpicture', this.handleEnterPiP, true);
    }
  }

  // ─── KEYBOARD & SHORTCUT ENFORCEMENT ─────────────────────────────────────────

  private handleKeyDown = (e: KeyboardEvent) => {
    const isPrintScreen = e.key === 'PrintScreen' || e.code === 'PrintScreen';
    const isCtrlOrMeta = e.ctrlKey || e.metaKey;
    const keyLower = e.key.toLowerCase();
    const isTargetEditable = this.isEditableElement(e.target as HTMLElement);

    // 1. PrintScreen Interception
    if (isPrintScreen) {
      e.preventDefault();
      e.stopPropagation();
      this.clearClipboard();
      this.emitViolation({
        type: 'PRINT_SCREEN_ATTEMPT',
        severity: 'HIGH',
        points: 3,
        reason: 'PrintScreen screen capture attempt intercepted and blocked.',
        details: { key: e.key, code: e.code },
        timestamp: Date.now(),
      });
      return;
    }

    // 2. Ctrl+P / Cmd+P (Print)
    if (isCtrlOrMeta && (keyLower === 'p' || e.code === 'KeyP')) {
      e.preventDefault();
      e.stopPropagation();
      this.emitViolation({
        type: 'SHORTCUT_RESTRICTED',
        severity: 'HIGH',
        points: 3,
        reason: 'Browser Print shortcut (Ctrl+P / Cmd+P) intercepted.',
        details: { shortcut: 'Ctrl/Cmd+P', key: e.key },
        timestamp: Date.now(),
      });
      return;
    }

    // 3. Ctrl+S / Cmd+S (Save Page)
    if (isCtrlOrMeta && (keyLower === 's' || e.code === 'KeyS')) {
      e.preventDefault();
      e.stopPropagation();
      this.emitViolation({
        type: 'SHORTCUT_RESTRICTED',
        severity: 'HIGH',
        points: 3,
        reason: 'Save Page shortcut (Ctrl+S / Cmd+S) intercepted.',
        details: { shortcut: 'Ctrl/Cmd+S', key: e.key },
        timestamp: Date.now(),
      });
      return;
    }

    // 4. Ctrl+F / Cmd+F (Find in Page)
    if (isCtrlOrMeta && (keyLower === 'f' || e.code === 'KeyF')) {
      e.preventDefault();
      e.stopPropagation();
      this.emitViolation({
        type: 'SHORTCUT_RESTRICTED',
        severity: 'HIGH',
        points: 3,
        reason: 'Find in Page shortcut (Ctrl+F / Cmd+F) intercepted.',
        details: { shortcut: 'Ctrl/Cmd+F', key: e.key },
        timestamp: Date.now(),
      });
      return;
    }

    // 5. Ctrl+U / Cmd+U (View Source)
    if (isCtrlOrMeta && (keyLower === 'u' || e.code === 'KeyU')) {
      e.preventDefault();
      e.stopPropagation();
      this.emitViolation({
        type: 'SHORTCUT_RESTRICTED',
        severity: 'HIGH',
        points: 3,
        reason: 'View Source shortcut (Ctrl+U / Cmd+U) intercepted.',
        details: { shortcut: 'Ctrl/Cmd+U', key: e.key },
        timestamp: Date.now(),
      });
      return;
    }

    // 6. Generic Windows/Meta key combinations (Win+D, Win+E, Meta+Tab, etc.)
    if ((e.metaKey || e.key === 'Meta') && !isTargetEditable) {
      // Allow single modifier press without key, but block if combo or navigation
      if (e.key !== 'Meta' || e.code.includes('Meta')) {
        e.preventDefault();
        e.stopPropagation();
        this.emitViolation({
          type: 'SHORTCUT_RESTRICTED',
          severity: 'HIGH',
          points: 3,
          reason: `Operating System Win/Cmd shortcut (${e.key}) intercepted.`,
          details: { key: e.key, code: e.code, metaKey: true },
          timestamp: Date.now(),
        });
      }
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
      e.preventDefault();
      e.stopPropagation();
      this.clearClipboard();
    }
  };

  private handleBeforePrint = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    this.emitViolation({
      type: 'PRINT_SCREEN_ATTEMPT',
      severity: 'HIGH',
      points: 3,
      reason: 'Window beforeprint event intercepted and blocked.',
      details: { event: 'beforeprint' },
      timestamp: Date.now(),
    });
  };

  private clearClipboard(): void {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('');
      }
    } catch {
      // Clipboard write restrictions fallback
    }
  }

  // ─── TEXT SELECTION & DRAG-AND-DROP ENFORCEMENT ──────────────────────────────

  private handleSelectStart = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (this.isEditableElement(target)) {
      return; // Allow selecting inside code editors, textareas, search inputs
    }

    // Block text selection across question cards and question text
    e.preventDefault();
    e.stopPropagation();

    this.emitViolation({
      type: 'TEXT_SELECTION_ATTEMPT',
      severity: 'LOW',
      points: 1,
      reason: 'Attempted to highlight or copy protected question text.',
      details: { targetTag: target?.tagName || 'unknown' },
      timestamp: Date.now(),
    });
  };

  private handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLElement | null;
    if (this.isEditableElement(target)) return;

    e.preventDefault();
    e.stopPropagation();

    this.emitViolation({
      type: 'DRAG_DROP_ATTEMPT',
      severity: 'LOW',
      points: 1,
      reason: 'Attempted to drag question content outside test container.',
      details: { targetTag: target?.tagName || 'unknown' },
      timestamp: Date.now(),
    });
  };

  private handleDragOver = (e: DragEvent) => {
    // Prevent dropping external content into exam
    const target = e.target as HTMLElement | null;
    if (!this.isEditableElement(target)) {
      e.preventDefault();
    }
  };

  private handleDrop = (e: DragEvent) => {
    const target = e.target as HTMLElement | null;
    if (this.isEditableElement(target)) return;

    e.preventDefault();
    e.stopPropagation();
    this.emitViolation({
      type: 'DRAG_DROP_ATTEMPT',
      severity: 'LOW',
      points: 1,
      reason: 'Drop event intercepted on protected examination workspace.',
      timestamp: Date.now(),
    });
  };

  // ─── 500MS FOCUS POLLING SENTINEL ───────────────────────────────────────────

  private startFocusPolling(): void {
    const intervalMs = this.options.focusPollIntervalMs || 500;
    this.focusPollTimer = setInterval(() => {
      if (!this.isRunning || typeof document === 'undefined') return;

      const hasFocus = typeof document.hasFocus === 'function' ? document.hasFocus() : true;

      // Focus Lost
      if (!hasFocus && this.lastFocusState) {
        this.lastFocusState = false;
        this.focusLostAt = Date.now();
      } else if (hasFocus && !this.lastFocusState) {
        // Focus Recovered - Evaluate Duration
        this.lastFocusState = true;
        const now = Date.now();
        const durationSec = this.focusLostAt ? (now - this.focusLostAt) / 1000 : 0;
        this.focusLostAt = null;

        if (durationSec < 2) {
          // LOW = 1 point: Focus loss < 2s (log only, no user alert)
          this.emitViolation({
            type: 'FOCUS_LOSS_BRIEF',
            severity: 'LOW',
            points: 1,
            reason: `Brief focus loss (${durationSec.toFixed(1)}s < 2s) logged.`,
            details: { durationSeconds: durationSec },
            timestamp: now,
          });
        } else {
          // MEDIUM = 2 points: Tab switch or extended focus loss (>= 2s)
          this.emitViolation({
            type: 'TAB_SWITCH',
            severity: 'MEDIUM',
            points: 2,
            reason: `Focus lost for ${durationSec.toFixed(1)}s (tab switch or window departure).`,
            details: { durationSeconds: durationSec },
            timestamp: now,
          });
        }
      }
    }, intervalMs);
  }

  // ─── PICTURE-IN-PICTURE DETECTION ───────────────────────────────────────────

  private handleEnterPiP = (e: Event) => {
    e.preventDefault();
    this.exitActivePictureInPicture();
    this.emitViolation({
      type: 'PICTURE_IN_PICTURE_ACTIVE',
      severity: 'HIGH',
      points: 3,
      reason: 'Picture-in-picture floating overlay opened.',
      details: { event: 'enterpictureinpicture' },
      timestamp: Date.now(),
    });
  };

  private startPiPPolling(): void {
    const intervalMs = this.options.pipPollIntervalMs || 1000;
    this.pipPollTimer = setInterval(() => {
      if (!this.isRunning || typeof document === 'undefined') return;

      const pipElement = (document as any).pictureInPictureElement;
      if (pipElement) {
        this.exitActivePictureInPicture();
        this.emitViolation({
          type: 'PICTURE_IN_PICTURE_ACTIVE',
          severity: 'HIGH',
          points: 3,
          reason: 'Active picture-in-picture floating window detected via polling.',
          details: { tagName: pipElement.tagName },
          timestamp: Date.now(),
        });
      }
    }, intervalMs);
  }

  private exitActivePictureInPicture(): void {
    try {
      if (typeof document !== 'undefined' && (document as any).exitPictureInPicture) {
        (document as any).exitPictureInPicture().catch(() => {});
      }
    } catch {}
  }

  // ─── WINDOW RESIZE / SNAP DETECTION ─────────────────────────────────────────

  private handleWindowResize = () => {
    if (!this.isRunning || typeof window === 'undefined') return;

    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    const availWidth = typeof screen !== 'undefined' ? screen.availWidth : 0;

    // Detect snap-to-edge / half-screen tiling
    const isHalfScreenSnap = availWidth > 0 && Math.abs(currentWidth - Math.floor(availWidth / 2)) < 30;
    const widthDiff = Math.abs(currentWidth - this.lastInnerWidth);
    const heightDiff = Math.abs(currentHeight - this.lastInnerHeight);

    if (isHalfScreenSnap || widthDiff > 250 || heightDiff > 250) {
      this.emitViolation({
        type: 'WINDOW_RESIZE_SNAP',
        severity: 'MEDIUM',
        points: 2,
        reason: isHalfScreenSnap
          ? 'Window snapped to half-screen split layout.'
          : `Significant window resize detected (${currentWidth}x${currentHeight}).`,
        details: {
          currentWidth,
          currentHeight,
          isHalfScreenSnap,
          deltaWidth: widthDiff,
          deltaHeight: heightDiff,
        },
        timestamp: Date.now(),
      });
    }

    this.lastInnerWidth = currentWidth;
    this.lastInnerHeight = currentHeight;
  };

  // ─── DEVTOOLS DETECTION (DIMENSION DIFFERENCE + DEBUGGER TIMING) ─────────────

  private startDevToolsPolling(): void {
    const intervalMs = this.options.devtoolsPollIntervalMs || 2000;
    this.devtoolsPollTimer = setInterval(() => {
      if (!this.isRunning || typeof window === 'undefined') return;

      // 1. Dimension difference check (Side or bottom docked DevTools)
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const DIMENSION_THRESHOLD = 160;

      if (widthDiff > DIMENSION_THRESHOLD || heightDiff > DIMENSION_THRESHOLD) {
        this.emitViolation({
          type: 'DEVTOOLS_OPEN',
          severity: 'HIGH',
          points: 3,
          reason: `DevTools panel detected via window dimension differential (${widthDiff}x${heightDiff}px).`,
          details: { widthDiff, heightDiff, threshold: DIMENSION_THRESHOLD },
          timestamp: Date.now(),
        });
      }

      // 2. Debugger timing heuristic
      const t0 = performance.now();
      try {
        const fn = new Function('debugger;');
        fn();
      } catch {
        // Ignore if CSP restricts Function constructor
      }
      const delay = performance.now() - t0;

      // If active debugger paused execution by > 100ms
      if (delay > 100) {
        this.emitViolation({
          type: 'DEVTOOLS_OPEN',
          severity: 'HIGH',
          points: 3,
          reason: `Debugger execution delay of ${Math.round(delay)}ms detected.`,
          details: { delayMs: Math.round(delay), threshold: 100 },
          timestamp: Date.now(),
        });
      }
    }, intervalMs);
  }

  // ─── INPUT HARDENING (DISABLE AUTOFILL & SPELLCHECK) ─────────────────────────

  public hardenInputs(rootElement?: HTMLElement | Document): void {
    if (typeof document === 'undefined') return;
    const root = rootElement || document;
    const inputs = root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');

    inputs.forEach((input) => {
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('spellcheck', 'false');
    });
  }

  // ─── UTILITIES ──────────────────────────────────────────────────────────────

  private isEditableElement(target: HTMLElement | null): boolean {
    if (!target) return false;
    const tagName = target.tagName ? target.tagName.toUpperCase() : '';
    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
      return true;
    }
    if (target.isContentEditable) {
      return true;
    }
    // Check for Monaco, CodeMirror, Quill, TinyMCE classes
    const className = typeof target.className === 'string' ? target.className : '';
    if (
      className.includes('monaco') ||
      className.includes('cm-') ||
      className.includes('ql-') ||
      className.includes('code-editor')
    ) {
      return true;
    }
    return false;
  }

  private emitViolation(event: Layer1ViolationEvent): void {
    if (!this.isRunning) return;
    this.options.onViolation(event);
  }
}
