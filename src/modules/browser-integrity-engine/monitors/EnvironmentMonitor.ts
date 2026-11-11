import { BaseModule } from '../core/BaseModule';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';

export interface EnvironmentMetadata {
  browserName: string;
  browserVersion: string;
  os: string;
  platform: string;
  cpuCores: number | null;
  memoryEstimateGb: number | null;
  touchSupport: boolean;
  maxTouchPoints: number;
  gpuRenderer: string;
  gpuVendor: string;
  locale: string;
  timezone: string;
  colorScheme: 'dark' | 'light' | 'no-preference';
  reducedMotion: boolean;
  highContrast: boolean;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  isIdle: boolean;
  lastUpdated: string;
}

/**
 * @class EnvironmentMonitor
 * @extends BaseModule
 * @description Aggregates passive environment metadata including browser version, OS, GPU renderer,
 * CPU cores, memory estimates, accessibility settings (reduced motion, high contrast), battery status, and idle state.
 * 
 * SCHEDULE:
 * • Collects initial metadata state on startup.
 * • Refreshes passive metadata state every 60 seconds (1 minute).
 * 
 * EMITS:
 * • EnvironmentUpdated
 * 
 * HEURISTIC LIMITATIONS & PRIVACY GUARANTEES:
 * • Collects STRICTLY environment metadata.
 * • NEVER accesses typed text, clipboard contents, cookies, passwords, localStorage, or personal documents.
 * • Battery API access is subject to browser security restrictions (deprecated in some engines for privacy).
 */
export class EnvironmentMonitor extends BaseModule {
  private currentMetadata: EnvironmentMetadata | null = null;
  private refreshIntervalId: ReturnType<typeof setInterval> | null = null;
  private idleTimerId: ReturnType<typeof setTimeout> | null = null;
  private isUserIdle: boolean = false;
  private static readonly IDLE_THRESHOLD_MS = 60000; // 60s idle timeout

  constructor(eventBus: EventBus, sessionManager: SessionManager) {
    super('EnvironmentMonitor', eventBus, sessionManager);
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;

    // Attach user activity listeners for passive idle state tracking
    this.resetIdleTimer();
    this.addDOMListener(window, 'mousemove', this.handleUserActivity, { passive: true });
    this.addDOMListener(window, 'keydown', this.handleUserActivity, { passive: true });
    this.addDOMListener(window, 'scroll', this.handleUserActivity, { passive: true });

    // Collect initial environment metadata
    this.refreshEnvironmentMetadata().then(() => {
      // Emit initial event
      this.emitEnvironmentUpdated('Initial baseline collection');
    });

    // Schedule refresh every 60 seconds (1 minute)
    this.refreshIntervalId = setInterval(() => {
      if (this.isRunning) {
        this.refreshEnvironmentMetadata().then(() => {
          this.emitEnvironmentUpdated('Periodic 60-second refresh');
        });
      }
    }, 60000);
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }
    if (this.idleTimerId) {
      clearTimeout(this.idleTimerId);
      this.idleTimerId = null;
    }

    this.removeAllDOMListeners();
  }

  /**
   * Returns current environment metadata state snapshot.
   */
  public getMetadata(): EnvironmentMetadata | null {
    return this.currentMetadata;
  }

  /**
   * Aggregate current environment metadata.
   */
  public async refreshEnvironmentMetadata(): Promise<EnvironmentMetadata> {
    const nav = typeof navigator !== 'undefined' ? navigator : ({} as any);
    const win = typeof window !== 'undefined' ? window : ({} as any);

    const userAgent = nav.userAgent || '';
    const { browserName, browserVersion, os } = this.parseUserAgent(userAgent);

    const platform = nav.platform || 'UNKNOWN';
    const cpuCores = nav.hardwareConcurrency || null;
    const memoryEstimateGb = (nav as any).deviceMemory || null;

    const maxTouchPoints = nav.maxTouchPoints || 0;
    const touchSupport = maxTouchPoints > 0 || (typeof win !== 'undefined' && 'ontouchstart' in win);

    const { gpuVendor, gpuRenderer } = this.getGPUInfo();
    const locale = nav.language || 'UNKNOWN';

    let timezone = 'UNKNOWN';
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UNKNOWN';
    } catch {
      timezone = 'UNKNOWN';
    }

    // Media query preferences
    const colorScheme = this.getColorSchemePreference();
    const reducedMotion = this.checkMediaQuery('(prefers-reduced-motion: reduce)');
    const highContrast = this.checkMediaQuery('(forced-colors: active)') || this.checkMediaQuery('(-ms-high-contrast: active)');

    // Battery status API
    const { batteryLevel, batteryCharging } = await this.getBatteryStatus();

    this.currentMetadata = {
      browserName,
      browserVersion,
      os,
      platform,
      cpuCores,
      memoryEstimateGb,
      touchSupport,
      maxTouchPoints,
      gpuRenderer,
      gpuVendor,
      locale,
      timezone,
      colorScheme,
      reducedMotion,
      highContrast,
      batteryLevel,
      batteryCharging,
      isIdle: this.isUserIdle,
      lastUpdated: new Date().toISOString(),
    };

    return this.currentMetadata;
  }

  /**
   * Emit EnvironmentUpdated event into EventBus.
   */
  private emitEnvironmentUpdated(triggerReason: string): void {
    if (!this.currentMetadata) return;

    this.emitEvent({
      type: 'EnvironmentUpdated',
      severity: 'INFO',
      confidence: 'HIGH',
      details: {
        message: `Passive environment metadata refreshed (${triggerReason}).`,
        explanation: 'Aggregated passive browser, OS, hardware, accessibility, and power metadata.',
        limitationNote: 'Aggregated metadata is passive evidence and does not indicate candidate performance or behavior.',
        metadata: {
          ...this.currentMetadata,
          triggerReason,
        },
      },
    });
  }

  /**
   * User activity handler for idle detection.
   */
  private handleUserActivity = () => {
    if (!this.isRunning) return;
    this.isUserIdle = false;
    this.resetIdleTimer();
  };

  private resetIdleTimer(): void {
    if (this.idleTimerId) {
      clearTimeout(this.idleTimerId);
    }
    this.idleTimerId = setTimeout(() => {
      this.isUserIdle = true;
    }, EnvironmentMonitor.IDLE_THRESHOLD_MS);
  }

  /**
   * Helper to parse Browser Name, Version, and OS from UserAgent.
   */
  private parseUserAgent(ua: string): { browserName: string; browserVersion: string; os: string } {
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    let os = 'Unknown';

    // OS detection
    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    // Browser detection
    if (ua.includes('Edg/')) {
      browserName = 'Edge';
      browserVersion = ua.split('Edg/')[1]?.split(' ')[0] || 'Unknown';
    } else if (ua.includes('Chrome/')) {
      browserName = 'Chrome';
      browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] || 'Unknown';
    } else if (ua.includes('Firefox/')) {
      browserName = 'Firefox';
      browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] || 'Unknown';
    } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
      browserName = 'Safari';
      browserVersion = ua.split('Version/')[1]?.split(' ')[0] || 'Unknown';
    }

    return { browserName, browserVersion, os };
  }

  /**
   * Retrieve GPU vendor and renderer using WebGL debug renderer info.
   */
  private getGPUInfo(): { gpuVendor: string; gpuRenderer: string } {
    if (typeof document === 'undefined') return { gpuVendor: 'UNSUPPORTED', gpuRenderer: 'UNSUPPORTED' };

    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      if (!gl) return { gpuVendor: 'UNSUPPORTED', gpuRenderer: 'UNSUPPORTED' };

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) {
        return {
          gpuVendor: gl.getParameter(gl.VENDOR) || 'GENERIC',
          gpuRenderer: gl.getParameter(gl.RENDERER) || 'GENERIC',
        };
      }

      return {
        gpuVendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'UNKNOWN',
        gpuRenderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'UNKNOWN',
      };
    } catch {
      return { gpuVendor: 'BLOCKED', gpuRenderer: 'BLOCKED' };
    }
  }

  /**
   * Get prefers-color-scheme value.
   */
  private getColorSchemePreference(): 'dark' | 'light' | 'no-preference' {
    if (this.checkMediaQuery('(prefers-color-scheme: dark)')) return 'dark';
    if (this.checkMediaQuery('(prefers-color-scheme: light)')) return 'light';
    return 'no-preference';
  }

  /**
   * Utility to safely check matchMedia queries.
   */
  private checkMediaQuery(query: string): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  }

  /**
   * Async helper to fetch battery status if supported by navigator.getBattery.
   */
  private async getBatteryStatus(): Promise<{ batteryLevel: number | null; batteryCharging: boolean | null }> {
    if (typeof navigator === 'undefined' || !('getBattery' in navigator)) {
      return { batteryLevel: null, batteryCharging: null };
    }
    try {
      const battery = await (navigator as any).getBattery();
      return {
        batteryLevel: Math.round(battery.level * 100),
        batteryCharging: !!battery.charging,
      };
    } catch {
      return { batteryLevel: null, batteryCharging: null };
    }
  }
}
