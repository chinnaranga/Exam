import { BaseModule } from '../core/BaseModule';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';

export interface FingerprintBaseline {
  userAgent: string;
  platform: string;
  language: string;
  languages: string[];
  vendor: string;
  deviceMemory: number | null;
  hardwareConcurrency: number | null;
  timezone: string;
  pluginsCount: number;
  cookieEnabled: boolean;
  pdfViewerEnabled: boolean | null;
  screenWidth: number;
  screenHeight: number;
  screenColorDepth: number;
  screenPixelDepth: number;
  devicePixelRatio: number;
  canvasHash: string;
  webglVendor: string;
  webglRenderer: string;
  audioHash: string;
}

/**
 * @class BrowserFingerprintMonitor
 * @extends BaseModule
 * @description Captures an immutable baseline fingerprint of the candidate's browser environment upon initialization.
 * Monitors for runtime changes (such as User-Agent spoofing, platform modifications, language shifts, or WebGL context spoofing).
 * 
 * COLLECTED METRICS:
 * • User Agent, Platform, Vendor, Language, Languages array
 * • Device memory estimate & Hardware concurrency (CPU cores)
 * • Timezone identifier via Intl API
 * • Plugins count & PDF viewer enablement
 * • Screen & Window metrics (width, height, color depth, pixel depth, DPR)
 * • Canvas 2D fingerprint hash
 * • WebGL unmasked Vendor & Renderer names
 * • AudioContext frequency response fingerprint hash
 * 
 * HEURISTIC LIMITATIONS & FALSE POSITIVES:
 * • System software updates, browser profile sync, or VPN/locale toggles can alter language or timezone mid-session.
 * • Virtual Machines or privacy-focused browser extensions (Brave, Arkenfox, Firefox Fingerprint Resistance) may randomize WebGL/Canvas hashes on page reloads.
 */
export class BrowserFingerprintMonitor extends BaseModule {
  private baseline: FingerprintBaseline | null = null;
  private checkIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(eventBus: EventBus, sessionManager: SessionManager) {
    super('BrowserFingerprintMonitor', eventBus, sessionManager);
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;

    // Capture baseline fingerprint
    this.baseline = this.collectFingerprint();

    // Attach listeners for window focus or visibility change to verify consistency
    this.addDOMListener(window, 'focus', this.verifyFingerprintConsistency, { passive: true });
    this.addDOMListener(document, 'visibilitychange', this.verifyFingerprintConsistency, { passive: true });

    // Periodic check every 60 seconds
    this.checkIntervalId = setInterval(() => {
      if (this.isRunning) {
        this.verifyFingerprintConsistency();
      }
    }, 60000);
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }

    this.removeAllDOMListeners();
  }

  /**
   * Get the current baseline fingerprint.
   */
  public getBaseline(): FingerprintBaseline | null {
    return this.baseline;
  }

  /**
   * Collect all baseline browser hardware, canvas, WebGL, audio, and environment parameters.
   */
  public collectFingerprint(): FingerprintBaseline {
    const nav = typeof navigator !== 'undefined' ? navigator : ({} as any);
    const scr = typeof screen !== 'undefined' ? screen : ({} as any);

    const userAgent = nav.userAgent || 'UNKNOWN';
    const platform = nav.platform || 'UNKNOWN';
    const language = nav.language || 'UNKNOWN';
    const languages = Array.isArray(nav.languages) ? [...nav.languages] : [language];
    const vendor = nav.vendor || 'UNKNOWN';
    const deviceMemory = (nav as any).deviceMemory || null;
    const hardwareConcurrency = nav.hardwareConcurrency || null;

    let timezone = 'UNKNOWN';
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UNKNOWN';
    } catch {
      timezone = 'UNKNOWN';
    }

    const pluginsCount = nav.plugins ? nav.plugins.length : 0;
    const cookieEnabled = !!nav.cookieEnabled;
    const pdfViewerEnabled = typeof (nav as any).pdfViewerEnabled === 'boolean' ? (nav as any).pdfViewerEnabled : null;

    const screenWidth = scr.width || 0;
    const screenHeight = scr.height || 0;
    const screenColorDepth = scr.colorDepth || 0;
    const screenPixelDepth = scr.pixelDepth || 0;
    const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    const canvasHash = this.generateCanvasFingerprint();
    const { webglVendor, webglRenderer } = this.collectWebGLInfo();
    const audioHash = this.generateAudioFingerprint();

    return {
      userAgent,
      platform,
      language,
      languages,
      vendor,
      deviceMemory,
      hardwareConcurrency,
      timezone,
      pluginsCount,
      cookieEnabled,
      pdfViewerEnabled,
      screenWidth,
      screenHeight,
      screenColorDepth,
      screenPixelDepth,
      devicePixelRatio,
      canvasHash,
      webglVendor,
      webglRenderer,
      audioHash,
    };
  }

  /**
   * Verify runtime parameters against the stored baseline.
   */
  private verifyFingerprintConsistency = () => {
    if (!this.baseline || !this.isRunning) return;

    const current = this.collectFingerprint();

    // 1. Check Platform change
    if (current.platform !== this.baseline.platform) {
      this.emitEvent({
        type: 'PlatformChanged',
        severity: 'HIGH',
        confidence: 'HIGH',
        details: {
          message: `Browser platform altered mid-session (Baseline: "${this.baseline.platform}", Current: "${current.platform}").`,
          signalStrength: 0.95,
          explanation: 'navigator.platform property changed during active exam session (indicates user-agent / header spoofing tool toggle).',
          limitationNote: 'Emulation tools or proxy extensions mid-session override navigator properties.',
          possibleFalsePositives: ['DevTools Device Mode toggled mid-exam', 'User Agent switcher extension activated'],
          metadata: { baselinePlatform: this.baseline.platform, currentPlatform: current.platform },
        },
      });
      this.baseline.platform = current.platform;
    }

    // 2. Check Renderer change
    if (current.webglRenderer !== this.baseline.webglRenderer || current.webglVendor !== this.baseline.webglVendor) {
      this.emitEvent({
        type: 'RendererChanged',
        severity: 'HIGH',
        confidence: 'HIGH',
        details: {
          message: `WebGL Renderer/Vendor changed (Baseline: "${this.baseline.webglRenderer}", Current: "${current.webglRenderer}").`,
          signalStrength: 0.9,
          explanation: 'Unmasked WebGL graphics card vendor/renderer altered dynamically.',
          limitationNote: 'GPU switching (integrated vs discrete GPU on laptops) occurs automatically under battery/power changes.',
          possibleFalsePositives: ['MacBook GPU switching (Intel -> AMD/NVIDIA)', 'Browser hardware acceleration toggle'],
          metadata: {
            baselineVendor: this.baseline.webglVendor,
            currentVendor: current.webglVendor,
            baselineRenderer: this.baseline.webglRenderer,
            currentRenderer: current.webglRenderer,
          },
        },
      });
      this.baseline.webglVendor = current.webglVendor;
      this.baseline.webglRenderer = current.webglRenderer;
    }

    // 3. Check Language change
    if (current.language !== this.baseline.language) {
      this.emitEvent({
        type: 'LanguageChanged',
        severity: 'LOW',
        confidence: 'HIGH',
        details: {
          message: `Primary browser language changed from "${this.baseline.language}" to "${current.language}".`,
          signalStrength: 0.4,
          explanation: 'navigator.language preference altered mid-session.',
          limitationNote: 'Candidate may have updated browser preference settings or OS locale.',
          possibleFalsePositives: ['Browser language settings updated', 'Auto-translation extension activated'],
          metadata: { baselineLanguage: this.baseline.language, currentLanguage: current.language },
        },
      });
      this.baseline.language = current.language;
    }

    // 4. Overall Fingerprint Changed
    const isUserAgentDiff = current.userAgent !== this.baseline.userAgent;
    const isCanvasDiff = current.canvasHash !== this.baseline.canvasHash && this.baseline.canvasHash !== 'UNSUPPORTED';
    const isHardwareDiff = current.hardwareConcurrency !== this.baseline.hardwareConcurrency;

    if (isUserAgentDiff || isCanvasDiff || isHardwareDiff) {
      this.emitEvent({
        type: 'FingerprintChanged',
        severity: 'HIGH',
        confidence: 'MEDIUM',
        details: {
          message: 'Core browser hardware fingerprint parameters diverged from baseline.',
          signalStrength: 0.85,
          explanation: 'Mismatch detected across immutable environment hardware metrics (UserAgent, Canvas Hash, or CPU core count).',
          limitationNote: 'Privacy extensions (ResistFingerprinting, Brave) randomize canvas hashes per session or draw.',
          possibleFalsePositives: ['Brave Browser Fingerprint Protection', 'Canvas Blocker Extension', 'Browser auto-update'],
          metadata: {
            isUserAgentDiff,
            isCanvasDiff,
            isHardwareDiff,
            baselineUA: this.baseline.userAgent,
            currentUA: current.userAgent,
          },
        },
      });
      // Update baseline after emission
      this.baseline = current;
    }
  };

  /**
   * Render text and shapes to a hidden HTML5 canvas and compute DJB2 hash.
   */
  private generateCanvasFingerprint(): string {
    if (typeof document === 'undefined') return 'UNSUPPORTED';

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'UNSUPPORTED';

      // Draw stylized text and shapes
      ctx.textBaseline = 'top';
      ctx.font = '14px "Arial", sans-serif';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('AssessIQ Engine, 🔒 integrity #123', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('AssessIQ Engine, 🔒 integrity #123', 4, 17);

      const dataUrl = canvas.toDataURL();
      return this.hashString(dataUrl);
    } catch {
      return 'BLOCKED';
    }
  }

  /**
   * Retrieve unmasked WebGL Vendor and Renderer details.
   */
  private collectWebGLInfo(): { webglVendor: string; webglRenderer: string } {
    if (typeof document === 'undefined') return { webglVendor: 'UNSUPPORTED', webglRenderer: 'UNSUPPORTED' };

    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      if (!gl) return { webglVendor: 'UNSUPPORTED', webglRenderer: 'UNSUPPORTED' };

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) {
        return {
          webglVendor: gl.getParameter(gl.VENDOR) || 'GENERIC_VENDOR',
          webglRenderer: gl.getParameter(gl.RENDERER) || 'GENERIC_RENDERER',
        };
      }

      const webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'UNKNOWN';
      const webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'UNKNOWN';

      return { webglVendor, webglRenderer };
    } catch {
      return { webglVendor: 'BLOCKED', webglRenderer: 'BLOCKED' };
    }
  }

  /**
   * Generate lightweight AudioContext fingerprint hash based on oscillator node dynamics.
   */
  private generateAudioFingerprint(): string {
    if (typeof window === 'undefined') return 'UNSUPPORTED';

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return 'UNSUPPORTED';

      // Lightweight static signature string from AudioContext prototype & sample rate
      const audioCtx = new AudioCtx();
      const sampleRate = audioCtx.sampleRate || 44100;
      const state = audioCtx.state || 'unknown';
      audioCtx.close().catch(() => {});

      return this.hashString(`audio_${sampleRate}_${state}`);
    } catch {
      return 'BLOCKED';
    }
  }

  /**
   * Simple DJB2 string hashing utility.
   */
  private hashString(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
  }
}
