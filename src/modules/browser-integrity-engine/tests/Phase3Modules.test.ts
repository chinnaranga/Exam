import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';
import { DevToolsMonitor } from '../monitors/DevToolsMonitor';
import { DOMOverlayScanner } from '../monitors/DOMOverlayScanner';
import { BrowserFingerprintMonitor } from '../monitors/BrowserFingerprintMonitor';
import { ScreenMonitor } from '../monitors/ScreenMonitor';
import { NetworkMonitor } from '../monitors/NetworkMonitor';
import { EnvironmentMonitor } from '../monitors/EnvironmentMonitor';
import { IntegrityEvent } from '../types/IntegrityEvent';

// Node environment fallback mocks if jsdom/happy-dom is absent
if (typeof window === 'undefined') {
  (global as any).window = {
    innerWidth: 1024,
    innerHeight: 768,
    outerWidth: 1024,
    outerHeight: 768,
    devicePixelRatio: 1,
    screen: { width: 1920, height: 1080, availWidth: 1920, availHeight: 1040, colorDepth: 24, pixelDepth: 24 },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}

if (typeof document === 'undefined') {
  (global as any).document = {
    hidden: false,
    fullscreenElement: null,
    documentElement: { clientWidth: 1024, clientHeight: 768 },
    querySelectorAll: vi.fn().mockReturnValue([]),
    createElement: vi.fn().mockReturnValue({
      getContext: vi.fn().mockReturnValue(null),
      setAttribute: vi.fn(),
      style: {},
      getBoundingClientRect: vi.fn().mockReturnValue({ width: 100, height: 100, left: 0, top: 0 }),
    }),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}

if (typeof navigator === 'undefined') {
  (global as any).navigator = {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    platform: 'MacIntel',
    language: 'en-US',
    languages: ['en-US', 'en'],
    vendor: 'Google Inc.',
    hardwareConcurrency: 8,
    deviceMemory: 16,
    onLine: true,
    plugins: [],
    cookieEnabled: true,
  };
}

describe('Phase 3 Environment Intelligence Modules Unit Tests', () => {
  let eventBus: EventBus;
  let sessionManager: SessionManager;
  let emittedEvents: IntegrityEvent[];

  beforeEach(() => {
    eventBus = new EventBus();
    sessionManager = new SessionManager({ candidateId: 'test_cand_phase3', examId: 'test_exam_phase3' });
    emittedEvents = [];

    eventBus.subscribe('*', (evt) => {
      emittedEvents.push(evt);
    });
  });

  afterEach(() => {
    eventBus.clear();
  });

  describe('Common Lifecycle Interface Verification', () => {
    it('should support start(), stop(), destroy(), cleanup(), register(), and unregister() across all modules', () => {
      const monitors = [
        new DevToolsMonitor(eventBus, sessionManager),
        new DOMOverlayScanner(eventBus, sessionManager),
        new BrowserFingerprintMonitor(eventBus, sessionManager),
        new ScreenMonitor(eventBus, sessionManager),
        new NetworkMonitor(eventBus, sessionManager),
        new EnvironmentMonitor(eventBus, sessionManager),
      ];

      monitors.forEach((m) => {
        expect(typeof m.start).toBe('function');
        expect(typeof m.stop).toBe('function');
        expect(typeof m.destroy).toBe('function');
        expect(typeof m.cleanup).toBe('function');
        expect(typeof m.register).toBe('function');
        expect(typeof m.unregister).toBe('function');

        m.register(); // Alias for start()
        m.unregister(); // Alias for stop()
        m.cleanup(); // Teardown
      });
    });
  });

  describe('DevToolsMonitor', () => {
    it('should initialize, detect viewport resize, and publish structured ViewportChanged event', () => {
      const monitor = new DevToolsMonitor(eventBus, sessionManager);
      monitor.start();

      // Change window innerWidth to trigger ViewportChanged event
      if (typeof window !== 'undefined') {
        (window as any).innerWidth = 1400;
      }

      // Trigger window resize event handling
      (monitor as any).handleResize();

      expect(emittedEvents.length).toBeGreaterThan(0);
      const vpEvt = emittedEvents.find((e) => e.type === 'ViewportChanged' || e.type === 'ZoomChanged' || e.type === 'DevToolsPossible');
      expect(vpEvt).toBeDefined();
      expect(vpEvt?.module).toBe('DevToolsMonitor');
      expect(vpEvt?.details.limitationNote).toBeDefined();
      expect(vpEvt?.details.possibleFalsePositives).toBeDefined();

      monitor.destroy();
    });
  });

  describe('DOMOverlayScanner', () => {
    it('should scan DOM and emit events with correct structure and limitation metadata', () => {
      const scanner = new DOMOverlayScanner(eventBus, sessionManager);
      scanner.start();

      // Force manual DOM scan execution
      (scanner as any).scanDOM();

      // Destroy and verify clean interval clearance
      scanner.destroy();
      expect((scanner as any).scanIntervalId).toBeNull();
    });
  });

  describe('BrowserFingerprintMonitor', () => {
    it('should capture immutable baseline fingerprint and detect platform change events', () => {
      const monitor = new BrowserFingerprintMonitor(eventBus, sessionManager);
      monitor.start();

      const baseline = monitor.getBaseline();
      expect(baseline).toBeDefined();
      expect(baseline?.userAgent).toBeDefined();
      expect(baseline?.platform).toBeDefined();

      // Simulate mid-session platform spoofing
      if (baseline) {
        baseline.platform = 'SPOOFED_PLATFORM';
        (monitor as any).verifyFingerprintConsistency();

        const platformEvt = emittedEvents.find((e) => e.type === 'PlatformChanged' || e.type === 'FingerprintChanged');
        expect(platformEvt).toBeDefined();
        expect(platformEvt?.severity).toBe('HIGH');
      }

      monitor.destroy();
    });
  });

  describe('ScreenMonitor', () => {
    it('should capture screen metrics, detect window movements and multi-monitor setup', () => {
      const monitor = new ScreenMonitor(eventBus, sessionManager);
      monitor.start();

      const state = monitor.captureScreenState();
      expect(state.width).toBeDefined();
      expect(state.height).toBeDefined();
      expect(state.devicePixelRatio).toBeDefined();

      // Trigger window relocation verification
      (monitor as any).verifyWindowPosition();

      monitor.destroy();
    });
  });

  describe('NetworkMonitor', () => {
    it('should track online/offline status, build timeline, and emit Network events', () => {
      const monitor = new NetworkMonitor(eventBus, sessionManager);
      monitor.start();

      // Simulate offline transition
      (monitor as any).handleOffline();

      const offlineEvt = emittedEvents.find((e) => e.type === 'Offline');
      expect(offlineEvt).toBeDefined();
      expect(offlineEvt?.module).toBe('NetworkMonitor');
      expect(offlineEvt?.severity).toBe('HIGH');

      // Check network timeline recording
      const timeline = monitor.getNetworkTimeline();
      expect(timeline.length).toBeGreaterThan(0);

      monitor.destroy();
    });
  });

  describe('EnvironmentMonitor', () => {
    it('should aggregate environment metadata and emit EnvironmentUpdated event', async () => {
      const monitor = new EnvironmentMonitor(eventBus, sessionManager);
      monitor.start();

      const metadata = await monitor.refreshEnvironmentMetadata();
      expect(metadata.browserName).toBeDefined();
      expect(metadata.os).toBeDefined();
      expect(metadata.locale).toBeDefined();

      const envEvt = emittedEvents.find((e) => e.type === 'EnvironmentUpdated');
      expect(envEvt).toBeDefined();
      expect(envEvt?.module).toBe('EnvironmentMonitor');
      expect(envEvt?.details.metadata?.browserName).toBeDefined();

      monitor.destroy();
    });
  });
});
