import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  Layer1ExamHardener,
  Layer1ViolationEvent,
} from '../../../src/engines/exam-security/hardening/Layer1ExamHardener';
import {
  Layer2IntegrityHardener,
  Layer2ViolationEvent,
  computeSha256,
} from '../../../src/engines/browser-integrity/hardening/Layer2IntegrityHardener';
import {
  resolveViolationRule,
} from '../violationSeverityConfig';
import { ViolationEngine } from '../ViolationEngine';
import { ExamSessionAuthority } from '../ExamSessionAuthority';

// ─── LIGHTWEIGHT DOM TEST HARNESS (Node.js Environment) ────────────────────────
class MockEvent {
  public type: string;
  public defaultPrevented = false;
  public cancelBubble = false;
  public target: any = null;
  constructor(type: string, init: any = {}) {
    this.type = type;
    this.target = init.target || null;
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
  stopPropagation() {
    this.cancelBubble = true;
  }
}

class MockKeyboardEvent extends MockEvent {
  public key: string;
  public code: string;
  public ctrlKey: boolean;
  public shiftKey: boolean;
  public altKey: boolean;
  public metaKey: boolean;
  public repeat: boolean;

  constructor(type: string, init: any = {}) {
    super(type, init);
    this.key = init.key || '';
    this.code = init.code || '';
    this.ctrlKey = !!init.ctrlKey;
    this.shiftKey = !!init.shiftKey;
    this.altKey = !!init.altKey;
    this.metaKey = !!init.metaKey;
    this.repeat = !!init.repeat;
  }
}

class MockDragEvent extends MockEvent {}

class MockDOMElement {
  public tagName: string;
  public isContentEditable: boolean = false;
  public className: string = '';
  public attributes: Record<string, string> = {};
  public children: MockDOMElement[] = [];

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
  }

  setAttribute(name: string, value: string) {
    this.attributes[name] = value;
  }

  getAttribute(name: string) {
    return this.attributes[name];
  }

  appendChild(child: MockDOMElement) {
    this.children.push(child);
  }

  removeChild(child: MockDOMElement) {
    this.children = this.children.filter((c) => c !== child);
  }

  dispatchEvent(event: MockEvent) {
    event.target = this;
    if (globalThis.document?.dispatchEvent) {
      globalThis.document.dispatchEvent(event);
    }
    return !event.defaultPrevented;
  }
}

class MockEventTarget {
  private listeners: Map<string, Set<(e: any) => void>> = new Map();

  addEventListener(type: string, listener: (e: any) => void, _capture?: boolean) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
  }

  removeEventListener(type: string, listener: (e: any) => void, _capture?: boolean) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event: any) {
    const list = this.listeners.get(event.type);
    if (list) {
      for (const listener of list) {
        listener(event);
      }
    }
    return !event.defaultPrevented;
  }
}

function setupMockDom() {
  const windowTarget = new MockEventTarget();
  const documentTarget = new MockEventTarget();

  const mockWindow: any = windowTarget;
  mockWindow.innerWidth = 1920;
  mockWindow.innerHeight = 1080;
  mockWindow.outerWidth = 1920;
  mockWindow.outerHeight = 1080;

  const mockDocument: any = documentTarget;
  mockDocument.body = new MockDOMElement('BODY');
  mockDocument.hasFocus = vi.fn().mockReturnValue(true);
  mockDocument.pictureInPictureElement = null;
  mockDocument.createElement = (tag: string) => new MockDOMElement(tag);
  mockDocument.querySelectorAll = () => [];

  const mockNavigator: any = {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
    mediaDevices: {
      enumerateDevices: vi.fn().mockResolvedValue([]),
      ondevicechange: null,
    },
  };

  const mockScreen: any = {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1040,
    isExtended: false,
  };

  Object.defineProperty(globalThis, 'window', { value: mockWindow, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'document', { value: mockDocument, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'navigator', { value: mockNavigator, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'screen', { value: mockScreen, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'KeyboardEvent', { value: MockKeyboardEvent, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'Event', { value: MockEvent, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'DragEvent', { value: MockDragEvent, configurable: true, writable: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('Layer 1 and Layer 2 Hardened Security Engine', () => {
  let authority: ExamSessionAuthority;
  let violationEngine: ViolationEngine;

  beforeEach(() => {
    setupMockDom();
    authority = new ExamSessionAuthority();
    violationEngine = new ViolationEngine(authority);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── 1. SEVERITY TABLE RULES & MAPPING ─────────────────────────────────────
  describe('Master Severity Table Hardened Rules', () => {
    it('correctly classifies Layer 1 and Layer 2 additions in the severity table', () => {
      // Critical (8 points, instant kill)
      const secClient = resolveViolationRule('SECURE_CLIENT_REQUIRED');
      expect(secClient.severity).toBe('CRITICAL');
      expect(secClient.points).toBe(8);
      expect(secClient.isInstantKill).toBe(true);

      const wasmTamper = resolveViolationRule('PROCTORING_MODULE_TAMPERING');
      expect(wasmTamper.severity).toBe('CRITICAL');
      expect(wasmTamper.points).toBe(8);
      expect(wasmTamper.isInstantKill).toBe(true);

      const virtCam = resolveViolationRule('VIRTUAL_CAMERA');
      expect(virtCam.severity).toBe('CRITICAL');
      expect(virtCam.points).toBe(8);
      expect(virtCam.isInstantKill).toBe(true);

      // High (3 points)
      const prtScn = resolveViolationRule('PRINT_SCREEN_ATTEMPT');
      expect(prtScn.severity).toBe('HIGH');
      expect(prtScn.points).toBe(3);
      expect(prtScn.isInstantKill).toBe(false);

      const shortcut = resolveViolationRule('SHORTCUT_RESTRICTED');
      expect(shortcut.severity).toBe('HIGH');
      expect(shortcut.points).toBe(3);

      const pip = resolveViolationRule('PICTURE_IN_PICTURE_ACTIVE');
      expect(pip.severity).toBe('HIGH');
      expect(pip.points).toBe(3);

      const devtools = resolveViolationRule('DEVTOOLS_OPEN');
      expect(devtools.severity).toBe('HIGH');
      expect(devtools.points).toBe(3);

      const throttling = resolveViolationRule('TIMER_THROTTLING_DETECTED');
      expect(throttling.severity).toBe('HIGH');
      expect(throttling.points).toBe(3);

      const multiMon = resolveViolationRule('MULTIPLE_MONITORS');
      expect(multiMon.severity).toBe('HIGH');
      expect(multiMon.points).toBe(3);

      // Medium (2 points)
      const vpn = resolveViolationRule('VPN_OR_PROXY_DETECTED');
      expect(vpn.severity).toBe('MEDIUM');
      expect(vpn.points).toBe(2);

      const resizeSnap = resolveViolationRule('WINDOW_RESIZE_SNAP');
      expect(resizeSnap.severity).toBe('MEDIUM');
      expect(resizeSnap.points).toBe(2);

      const tabSwitch = resolveViolationRule('TAB_SWITCH');
      expect(tabSwitch.severity).toBe('MEDIUM');
      expect(tabSwitch.points).toBe(2);

      // Low (1 point, log only)
      const briefFocus = resolveViolationRule('FOCUS_LOSS_BRIEF');
      expect(briefFocus.severity).toBe('LOW');
      expect(briefFocus.points).toBe(1);
      expect(briefFocus.alertUser).toBe(false);

      const textSel = resolveViolationRule('TEXT_SELECTION_ATTEMPT');
      expect(textSel.severity).toBe('LOW');
      expect(textSel.points).toBe(1);

      const dragDrop = resolveViolationRule('DRAG_DROP_ATTEMPT');
      expect(dragDrop.severity).toBe('LOW');
      expect(dragDrop.points).toBe(1);
    });

    it('instant-kills the exam when SECURE_CLIENT_REQUIRED or VIRTUAL_CAMERA is reported', () => {
      const sessionId = 'sess_test_instant_layer2';
      authority.startSession({
        sessionId,
        candidateId: 'cand_test',
        durationSeconds: 3600,
      });

      const decision = violationEngine.processViolation(sessionId, {
        type: 'SECURE_CLIENT_REQUIRED',
        payload: { userAgent: 'Mozilla/5.0 Standard Browser' },
      });

      expect(decision.isTerminated).toBe(true);
      expect(decision.action).toBe('TERMINATE');
      expect(decision.status).toBe('TERMINATED');
      expect(decision.currentPoints).toBe(8);
      expect(decision.evidencePacket).toBeDefined();
    });
  });

  // ─── 2. LAYER 1: KEYBOARD SHORTCUTS & PRINT SCREEN BLOCKING ──────────────────
  describe('Layer 1 Keyboard & Mouse Hardening', () => {
    let violations: Layer1ViolationEvent[] = [];
    let hardener: Layer1ExamHardener;

    beforeEach(() => {
      violations = [];
      hardener = new Layer1ExamHardener({
        onViolation: (evt) => violations.push(evt),
        focusPollIntervalMs: 500,
        devtoolsPollIntervalMs: 2000,
      });
      hardener.start();
    });

    afterEach(() => {
      hardener.stop();
    });

    it('blocks PrintScreen and flags PRINT_SCREEN_ATTEMPT', () => {
      const event = new MockKeyboardEvent('keydown', {
        key: 'PrintScreen',
        code: 'PrintScreen',
      });
      window.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(violations.some((v) => v.type === 'PRINT_SCREEN_ATTEMPT')).toBe(true);
    });

    it('blocks Ctrl+P / Cmd+P and flags SHORTCUT_RESTRICTED', () => {
      const event = new MockKeyboardEvent('keydown', {
        key: 'p',
        code: 'KeyP',
        ctrlKey: true,
      });
      window.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(violations.some((v) => v.type === 'SHORTCUT_RESTRICTED')).toBe(true);
    });

    it('blocks Ctrl+S / Cmd+S and flags SHORTCUT_RESTRICTED', () => {
      const event = new MockKeyboardEvent('keydown', {
        key: 's',
        code: 'KeyS',
        ctrlKey: true,
      });
      window.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(violations.some((v) => v.type === 'SHORTCUT_RESTRICTED')).toBe(true);
    });

    it('blocks Ctrl+F / Cmd+F and flags SHORTCUT_RESTRICTED', () => {
      const event = new MockKeyboardEvent('keydown', {
        key: 'f',
        code: 'KeyF',
        metaKey: true,
      });
      window.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(violations.some((v) => v.type === 'SHORTCUT_RESTRICTED')).toBe(true);
    });

    it('blocks Ctrl+U / Cmd+U and flags SHORTCUT_RESTRICTED', () => {
      const event = new MockKeyboardEvent('keydown', {
        key: 'u',
        code: 'KeyU',
        ctrlKey: true,
      });
      window.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(violations.some((v) => v.type === 'SHORTCUT_RESTRICTED')).toBe(true);
    });

    it('blocks Win/Cmd key combinations and flags SHORTCUT_RESTRICTED', () => {
      const event = new MockKeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        metaKey: true,
      });
      window.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(violations.some((v) => v.type === 'SHORTCUT_RESTRICTED')).toBe(true);
    });

    it('blocks window beforeprint event', () => {
      const event = new MockEvent('beforeprint');
      window.dispatchEvent(event);

      expect(violations.some((v) => v.type === 'PRINT_SCREEN_ATTEMPT')).toBe(true);
    });

    it('blocks text selection on non-editable elements and flags TEXT_SELECTION_ATTEMPT', () => {
      const nonEditable = new MockDOMElement('div');
      const event = new MockEvent('selectstart', { target: nonEditable });
      document.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(violations.some((v) => v.type === 'TEXT_SELECTION_ATTEMPT')).toBe(true);
    });

    it('allows text selection in editable input and textarea elements', () => {
      const input = new MockDOMElement('input');
      const event = new MockEvent('selectstart', { target: input });
      document.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
      expect(violations.some((v) => v.type === 'TEXT_SELECTION_ATTEMPT')).toBe(false);
    });

    it('blocks drag and drop and flags DRAG_DROP_ATTEMPT', () => {
      const nonEditable = new MockDOMElement('div');
      const dragEvent = new MockDragEvent('dragstart', { target: nonEditable });
      document.dispatchEvent(dragEvent);

      expect(dragEvent.defaultPrevented).toBe(true);
      expect(violations.some((v) => v.type === 'DRAG_DROP_ATTEMPT')).toBe(true);
    });
  });

  // ─── 3. LAYER 1: 500MS FOCUS POLLING SENTINEL ────────────────────────────────
  describe('Layer 1 500ms Focus Polling Sentinel', () => {
    let violations: Layer1ViolationEvent[] = [];
    let hardener: Layer1ExamHardener;

    beforeEach(() => {
      vi.useFakeTimers();
      violations = [];
      hardener = new Layer1ExamHardener({
        onViolation: (evt) => violations.push(evt),
        focusPollIntervalMs: 500,
      });
      hardener.start();
    });

    afterEach(() => {
      hardener.stop();
      vi.useRealTimers();
    });

    it('detects brief focus loss (<2s) and logs FOCUS_LOSS_BRIEF (LOW 1 pt)', () => {
      // Simulate document losing focus
      document.hasFocus = vi.fn().mockReturnValue(false);
      vi.advanceTimersByTime(500); // 1 poll: focus lost

      // Focus returns after 1 second (< 2s)
      vi.advanceTimersByTime(1000);
      document.hasFocus = vi.fn().mockReturnValue(true);
      vi.advanceTimersByTime(500); // 1 poll: focus restored

      const briefEvt = violations.find((v) => v.type === 'FOCUS_LOSS_BRIEF');
      expect(briefEvt).toBeDefined();
      expect(briefEvt?.severity).toBe('LOW');
      expect(briefEvt?.points).toBe(1);
    });

    it('detects extended focus loss / tab switch (>=2s) and flags TAB_SWITCH (MEDIUM 2 pts)', () => {
      // Simulate document losing focus
      document.hasFocus = vi.fn().mockReturnValue(false);
      vi.advanceTimersByTime(500); // focus lost

      // Focus returns after 3.5 seconds (>= 2s)
      vi.advanceTimersByTime(3500);
      document.hasFocus = vi.fn().mockReturnValue(true);
      vi.advanceTimersByTime(500); // focus restored

      const tabEvt = violations.find((v) => v.type === 'TAB_SWITCH');
      expect(tabEvt).toBeDefined();
      expect(tabEvt?.severity).toBe('MEDIUM');
      expect(tabEvt?.points).toBe(2);
    });
  });

  // ─── 4. LAYER 1: PICTURE-IN-PICTURE & WINDOW RESIZE/SNAP & DEVTOOLS ──────────
  describe('Layer 1 Picture-in-Picture & DevTools Detection', () => {
    let violations: Layer1ViolationEvent[] = [];
    let hardener: Layer1ExamHardener;

    beforeEach(() => {
      vi.useFakeTimers();
      violations = [];
      hardener = new Layer1ExamHardener({
        onViolation: (evt) => violations.push(evt),
        devtoolsPollIntervalMs: 2000,
        pipPollIntervalMs: 1000,
      });
      hardener.start();
    });

    afterEach(() => {
      hardener.stop();
      vi.useRealTimers();
    });

    it('detects Picture-in-Picture and flags PICTURE_IN_PICTURE_ACTIVE', () => {
      const enterPipEvt = new MockEvent('enterpictureinpicture');
      document.dispatchEvent(enterPipEvt);

      expect(violations.some((v) => v.type === 'PICTURE_IN_PICTURE_ACTIVE')).toBe(true);
    });

    it('detects DevTools when outerWidth - innerWidth > 160px', () => {
      window.outerWidth = 1600;
      window.innerWidth = 1200; // diff = 400 > 160
      window.outerHeight = 900;
      window.innerHeight = 900;

      vi.advanceTimersByTime(2000);

      const devtoolsEvt = violations.find((v) => v.type === 'DEVTOOLS_OPEN');
      expect(devtoolsEvt).toBeDefined();
      expect(devtoolsEvt?.severity).toBe('HIGH');
    });

    it('detects window half-screen snap during resize', () => {
      screen.availWidth = 1920;
      window.innerWidth = 960; // exactly half of 1920

      window.dispatchEvent(new MockEvent('resize'));

      const snapEvt = violations.find((v) => v.type === 'WINDOW_RESIZE_SNAP');
      expect(snapEvt).toBeDefined();
      expect(snapEvt?.severity).toBe('MEDIUM');
    });
  });

  // ─── 5. LAYER 2: VIRTUAL CAMERA & MIC SCANNER ────────────────────────────────
  describe('Layer 2 Virtual Device Scanner', () => {
    let violations: Layer2ViolationEvent[] = [];
    let hardener: Layer2IntegrityHardener;

    beforeEach(() => {
      violations = [];
      hardener = new Layer2IntegrityHardener({
        onViolation: (evt) => violations.push(evt),
        deviceScanIntervalMs: 10000,
      });
    });

    afterEach(() => {
      hardener.stop();
    });

    it('flags VIRTUAL_CAMERA (CRITICAL = 8 pts) when OBS or ManyCam device is detected', async () => {
      const mockDevices = [
        {
          deviceId: 'cam_1',
          kind: 'videoinput',
          label: 'OBS Virtual Camera',
          groupId: 'grp_1',
        },
        {
          deviceId: 'mic_1',
          kind: 'audioinput',
          label: 'Internal Microphone',
          groupId: 'grp_1',
        },
      ];

      navigator.mediaDevices.enumerateDevices = vi.fn().mockResolvedValue(mockDevices);

      await hardener.start();

      const virtEvt = violations.find((v) => v.type === 'VIRTUAL_CAMERA');
      expect(virtEvt).toBeDefined();
      expect(virtEvt?.severity).toBe('CRITICAL');
      expect(virtEvt?.points).toBe(8);
      expect(virtEvt?.reason).toContain('OBS Virtual Camera');
    });

    it('allows genuine physical cameras (Logitech, FaceTime HD)', async () => {
      const mockDevices = [
        {
          deviceId: 'cam_2',
          kind: 'videoinput',
          label: 'FaceTime HD Camera (Built-in)',
          groupId: 'grp_1',
        },
        {
          deviceId: 'cam_3',
          kind: 'videoinput',
          label: 'Logitech Webcam C920',
          groupId: 'grp_2',
        },
      ];

      navigator.mediaDevices.enumerateDevices = vi.fn().mockResolvedValue(mockDevices);

      await hardener.start();

      expect(violations.some((v) => v.type === 'VIRTUAL_CAMERA')).toBe(false);
    });
  });

  // ─── 6. LAYER 2: PROCTORING WASM SELF-CHECKSUM INTEGRITY ─────────────────────
  describe('Layer 2 Wasm Self-Checksum Integrity', () => {
    it('verifies valid Wasm checksum and detects tampered Wasm bytes', async () => {
      let violations: Layer2ViolationEvent[] = [];
      const hardener = new Layer2IntegrityHardener({
        onViolation: (evt) => violations.push(evt),
      });
      await hardener.start();

      const genuineBytes = new TextEncoder().encode('WASM_PROCTORING_BINARY_V1');
      const expectedChecksum = await computeSha256(genuineBytes);

      // 1. Valid Checksum passes
      const isValid = await hardener.verifyWasmModuleIntegrity(genuineBytes, expectedChecksum);
      expect(isValid).toBe(true);
      expect(violations.length).toBe(0);

      // 2. Tampered Checksum triggers PROCTORING_MODULE_TAMPERING (CRITICAL = 8 pts)
      const tamperedBytes = new TextEncoder().encode('WASM_PROCTORING_TAMPERED_INJECTED_CODE');
      const isTamperedValid = await hardener.verifyWasmModuleIntegrity(tamperedBytes, expectedChecksum);
      expect(isTamperedValid).toBe(false);

      const tamperEvt = violations.find((v) => v.type === 'PROCTORING_MODULE_TAMPERING');
      expect(tamperEvt).toBeDefined();
      expect(tamperEvt?.severity).toBe('CRITICAL');
      expect(tamperEvt?.points).toBe(8);

      hardener.stop();
    });
  });

  // ─── 7. LAYER 2: TIMER THROTTLING & PERFORMANCE DRIFT ─────────────────────────
  describe('Layer 2 Timer Throttling & JS Pause Detection', () => {
    let violations: Layer2ViolationEvent[] = [];
    let hardener: Layer2IntegrityHardener;

    beforeEach(() => {
      vi.useFakeTimers();
      violations = [];
      hardener = new Layer2IntegrityHardener({
        onViolation: (evt) => violations.push(evt),
        timerCheckIntervalMs: 1000,
      });
    });

    afterEach(() => {
      hardener.stop();
      vi.useRealTimers();
    });

    it('flags TIMER_THROTTLING_DETECTED when timer execution is paused for >20s', async () => {
      await hardener.start();

      // Normal 1s tick
      vi.advanceTimersByTime(1000);
      expect(violations.length).toBe(0);

      // Simulate thread execution freeze / background sleep of 25 seconds
      const baseNow = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(baseNow + 25000);
      vi.advanceTimersByTime(1000);

      const throttleEvt = violations.find((v) => v.type === 'TIMER_THROTTLING_DETECTED');
      expect(throttleEvt).toBeDefined();
      expect(throttleEvt?.severity).toBe('HIGH');
      expect(throttleEvt?.points).toBe(3);
    });
  });

  // ─── 8. LAYER 2: MULTI-MONITOR DETECTION ─────────────────────────────────────
  describe('Layer 2 Multi-Monitor Detection via Window Management API', () => {
    it('detects multiple monitors when screen.isExtended is true', async () => {
      const violations: Layer2ViolationEvent[] = [];
      const hardener = new Layer2IntegrityHardener({
        onViolation: (evt) => violations.push(evt),
      });
      await hardener.start();

      screen.isExtended = true;

      await hardener.checkMultiMonitor();

      const monEvt = violations.find((v) => v.type === 'MULTIPLE_MONITORS');
      expect(monEvt).toBeDefined();
      expect(monEvt?.severity).toBe('HIGH');
      expect(monEvt?.points).toBe(3);

      hardener.stop();
    });
  });

  // ─── 9. LAYER 2: REQUIRE SECURE CLIENT (LOCKED-DOWN DESKTOP CLIENT) ───────────
  describe('Layer 2 requireSecureClient Gate', () => {
    it('blocks standard browser with SECURE_CLIENT_REQUIRED (CRITICAL = 8 pts)', async () => {
      const violations: Layer2ViolationEvent[] = [];
      const hardener = new Layer2IntegrityHardener({
        requireSecureClient: true,
        onViolation: (evt) => violations.push(evt),
      });

      // Standard browser without electron bridge
      delete (window as any).assessIqElectron;
      delete (window as any).__SECURE_BROWSER__;
      navigator.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

      await hardener.start();

      const secEvt = violations.find((v) => v.type === 'SECURE_CLIENT_REQUIRED');
      expect(secEvt).toBeDefined();
      expect(secEvt?.severity).toBe('CRITICAL');
      expect(secEvt?.points).toBe(8);

      hardener.stop();
    });

    it('permits locked-down desktop client environment', async () => {
      const violations: Layer2ViolationEvent[] = [];
      const hardener = new Layer2IntegrityHardener({
        requireSecureClient: true,
        onViolation: (evt) => violations.push(evt),
      });

      // Desktop client signature
      (window as any).assessIqElectron = { version: '2.4.0', lockdownActive: true };

      await hardener.start();

      expect(violations.some((v) => v.type === 'SECURE_CLIENT_REQUIRED')).toBe(false);

      delete (window as any).assessIqElectron;
      hardener.stop();
    });
  });
});
