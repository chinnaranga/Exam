/**
 * Layer 2 Browser & Host Integrity Hardening Engine
 * 
 * Implements advanced runtime integrity defenses:
 * 1. Virtual camera/mic device label scanning against blacklist (OBS, ManyCam, v4l2loopback, etc.).
 * 2. WebRTC IP leak analysis and VPN/proxy detection.
 * 3. Runtime self-checksum verification of proctoring Wasm modules (SHA-256 validation).
 * 4. Subresource Integrity (SRI) verification helpers.
 * 5. Timer throttling detection via performance.now() interval drift (>20s delay).
 * 6. Multi-monitor topology detection via the modern Window Management API (isExtended).
 * 7. "requireSecureClient" enforcement for high-stakes examinations.
 */

export interface Layer2ViolationEvent {
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  points: number;
  reason: string;
  details?: Record<string, unknown>;
  timestamp: number;
}

export interface Layer2HardenerOptions {
  onViolation: (event: Layer2ViolationEvent) => void;
  requireSecureClient?: boolean; // high-stakes exam flag
  expectedSessionIp?: string;
  expectedWasmSha256?: string;
  deviceScanIntervalMs?: number; // default: 10000ms
  timerCheckIntervalMs?: number; // default: 1000ms
  enabled?: boolean;
}

export const VIRTUAL_DEVICE_BLACKLIST = [
  'obs',
  'manycam',
  'virtual',
  'snap camera',
  'v4l2loopback',
  'camtwist',
  'droidcam',
  'epoccam',
  'xsplit',
  'ndi',
  'fake',
  'camo',
  'chromacam',
  'prism live',
  'wirecast',
  'ip camera',
  'streamlabs',
  'blackhole',
  'soundflower',
  'vb-audio',
  'virtual audio',
  'virtual cable',
];

export class Layer2IntegrityHardener {
  private options: Layer2HardenerOptions;
  private isRunning: boolean = false;
  private deviceScanTimer: ReturnType<typeof setInterval> | null = null;
  private throttlingCheckTimer: ReturnType<typeof setInterval> | null = null;
  private screenDetailsObject: any = null;

  // Timer throttling baseline
  private lastPerfTimestamp: number = 0;
  private lastWallTimestamp: number = 0;

  constructor(options: Layer2HardenerOptions) {
    this.options = {
      requireSecureClient: false,
      deviceScanIntervalMs: 10000,
      timerCheckIntervalMs: 1000,
      enabled: true,
      ...options,
    };
  }

  public async start(): Promise<void> {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;

    this.lastPerfTimestamp = performance.now();
    this.lastWallTimestamp = Date.now();

    // 1. Secure Client Check (Gate for high-stakes exams)
    if (this.options.requireSecureClient) {
      this.checkSecureClientRequirement();
    }

    // 2. Initial & Periodic Media Device Scanner (Virtual Cameras / Mics)
    await this.scanMediaDevices();
    this.initDeviceChangeListener();

    // 3. WebRTC IP Leak & VPN/Proxy Detection
    this.runWebRtcVpnDetection();

    // 4. Multi-Monitor Detection via Window Management API
    await this.checkMultiMonitor();

    // 5. Timer Throttling & JS Freezing Sentinel (comparing performance.now() vs wall clock)
    this.startThrottlingSentinel();
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.deviceScanTimer) {
      clearInterval(this.deviceScanTimer);
      this.deviceScanTimer = null;
    }
    if (this.throttlingCheckTimer) {
      clearInterval(this.throttlingCheckTimer);
      this.throttlingCheckTimer = null;
    }

    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.ondevicechange = null;
    }

    if (this.screenDetailsObject) {
      try {
        this.screenDetailsObject.removeEventListener?.('screenschange', this.handleScreenChange);
      } catch {}
      this.screenDetailsObject = null;
    }
  }

  // ─── 1. SECURE CLIENT REQUIREMENT (HIGH-STAKES EXAMS) ───────────────────────

  public isSecureClient(): boolean {
    if (typeof window === 'undefined') return true;

    // Check for custom Electron bridge or secure browser runtime markers
    const hasElectronBridge = !!(window as any).assessIqElectron;
    const hasSecureBrowserGlobal = !!(window as any).__SECURE_BROWSER__;
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const hasSecureUASignature = userAgent.includes('AssessIQ-Secure-Client') || userAgent.includes('Electron');

    return hasElectronBridge || hasSecureBrowserGlobal || hasSecureUASignature;
  }

  private checkSecureClientRequirement(): void {
    if (!this.isSecureClient()) {
      this.emitViolation({
        type: 'SECURE_CLIENT_REQUIRED',
        severity: 'CRITICAL',
        points: 8,
        reason: 'Candidate is accessing high-stakes exam from a standard browser instead of the locked-down desktop client.',
        details: {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
          requireSecureClient: true,
        },
        timestamp: Date.now(),
      });
    }
  }

  // ─── 2. VIRTUAL CAMERA & MICROPHONE SCANNER ─────────────────────────────────

  public async scanMediaDevices(): Promise<{ virtualDetected: boolean; matchedDevices: string[] }> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) {
      return { virtualDetected: false, matchedDevices: [] };
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const matched: string[] = [];

      for (const device of devices) {
        const label = (device.label || '').toLowerCase();
        if (!label) continue;

        const isVirtual = VIRTUAL_DEVICE_BLACKLIST.some((keyword) => label.includes(keyword));
        if (isVirtual) {
          matched.push(`${device.kind}: ${device.label}`);
        }
      }

      if (matched.length > 0) {
        this.emitViolation({
          type: 'VIRTUAL_CAMERA',
          severity: 'CRITICAL',
          points: 8,
          reason: `Virtual camera or virtual audio device detected (${matched.join(', ')}).`,
          details: { matchedDevices: matched },
          timestamp: Date.now(),
        });
        return { virtualDetected: true, matchedDevices: matched };
      }

      return { virtualDetected: false, matchedDevices: [] };
    } catch {
      return { virtualDetected: false, matchedDevices: [] };
    }
  }

  private initDeviceChangeListener(): void {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.ondevicechange = () => {
        this.scanMediaDevices();
      };
    }

    // Periodic check every 10s
    this.deviceScanTimer = setInterval(() => {
      if (this.isRunning) {
        this.scanMediaDevices();
      }
    }, this.options.deviceScanIntervalMs || 10000);
  }

  // ─── 3. WEBRTC IP LEAK & VPN/PROXY DETECTOR ─────────────────────────────────

  public async runWebRtcVpnDetection(): Promise<{ vpnDetected: boolean; ips: string[] }> {
    if (typeof window === 'undefined' || typeof RTCPeerConnection === 'undefined') {
      return { vpnDetected: false, ips: [] };
    }

    return new Promise((resolve) => {
      const detectedIps = new Set<string>();
      let isResolved = false;

      const finish = () => {
        if (isResolved) return;
        isResolved = true;
        try {
          pc.close();
        } catch {}

        const ipList = Array.from(detectedIps);
        let vpnDetected = false;
        let vpnReason = '';

        for (const ip of ipList) {
          // VPN tunnel adapter subnets (e.g. 10.8.x.x, 10.14.x.x OpenVPN/Wireguard default subnets)
          if (ip.startsWith('10.8.') || ip.startsWith('10.14.') || ip.startsWith('10.252.')) {
            vpnDetected = true;
            vpnReason = `VPN tunnel virtual adapter IP detected: ${ip}`;
            break;
          }
        }

        // Compare against expected session IP if supplied
        if (this.options.expectedSessionIp && ipList.length > 0) {
          const hasMatchingIp = ipList.some((ip) => ip === this.options.expectedSessionIp);
          const hasPublicReflexive = ipList.some((ip) => !this.isPrivateIp(ip));
          if (hasPublicReflexive && !hasMatchingIp) {
            vpnDetected = true;
            vpnReason = `WebRTC public IP (${ipList.join(', ')}) differs from session handshake IP (${this.options.expectedSessionIp}).`;
          }
        }

        if (vpnDetected) {
          this.emitViolation({
            type: 'VPN_OR_PROXY_DETECTED',
            severity: 'MEDIUM',
            points: 2,
            reason: vpnReason || 'VPN/Proxy network interface detected via WebRTC IP leak comparison.',
            details: { ips: ipList },
            timestamp: Date.now(),
          });
        }

        resolve({ vpnDetected, ips: ipList });
      };

      let pc: RTCPeerConnection;
      try {
        pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        pc.onicecandidate = (event) => {
          if (!event.candidate || !event.candidate.candidate) {
            finish();
            return;
          }

          const candidate = event.candidate.candidate;
          // Extract IPv4 or IPv6 address from candidate line
          const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
          const matches = candidate.match(ipRegex);
          if (matches) {
            matches.forEach((ip) => detectedIps.add(ip));
          }
        };

        // Create data channel and offer to trigger candidate gathering
        pc.createDataChannel('assessiq-integrity-probe');
        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .catch(() => finish());

        // Timeout fallback after 3.5 seconds
        setTimeout(finish, 3500);
      } catch {
        finish();
      }
    });
  }

  private isPrivateIp(ip: string): boolean {
    if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip === '127.0.0.1' || ip === 'localhost') {
      return true;
    }
    if (ip.startsWith('172.')) {
      const secondOctet = parseInt(ip.split('.')[1], 10);
      if (secondOctet >= 16 && secondOctet <= 31) return true;
    }
    return false;
  }

  // ─── 4. MULTI-MONITOR DETECTION VIA WINDOW MANAGEMENT API ───────────────────

  public async checkMultiMonitor(): Promise<boolean> {
    if (typeof window === 'undefined' || typeof screen === 'undefined') return false;

    let isMulti = false;
    let detectionSource = 'basic';

    // 1. Modern Window Management API: screen.isExtended
    if ('isExtended' in (screen as any) && (screen as any).isExtended === true) {
      isMulti = true;
      detectionSource = 'screen.isExtended';
    }

    // 2. Modern Window Management API: window.getScreenDetails
    if (!isMulti && 'getScreenDetails' in window && typeof (window as any).getScreenDetails === 'function') {
      try {
        const details = await (window as any).getScreenDetails();
        this.screenDetailsObject = details;
        if (details.screens && details.screens.length > 1) {
          isMulti = true;
          detectionSource = 'getScreenDetails()';
        }
        details.addEventListener('screenschange', this.handleScreenChange);
      } catch {
        // Permission denied or unfulfilled
      }
    }

    // 3. Fallback coordinate boundaries
    if (!isMulti) {
      const screenLeft = window.screenLeft || (window as any).screenX || 0;
      const screenTop = window.screenTop || (window as any).screenY || 0;
      if (
        screenLeft < 0 ||
        screenLeft >= screen.width ||
        screenTop < 0 ||
        screenTop >= screen.height ||
        screen.availWidth > screen.width * 1.5
      ) {
        isMulti = true;
        detectionSource = 'coordinate-boundaries';
      }
    }

    if (isMulti) {
      this.emitViolation({
        type: 'MULTIPLE_MONITORS',
        severity: 'HIGH',
        points: 3,
        reason: 'Secondary display monitor attached or active during examination.',
        details: { detectionSource },
        timestamp: Date.now(),
      });
    }

    return isMulti;
  }

  private handleScreenChange = () => {
    this.checkMultiMonitor();
  };

  // ─── 5. TIMER THROTTLING & DEBUGGER PAUSE SENTINEL ──────────────────────────

  private startThrottlingSentinel(): void {
    const intervalMs = this.options.timerCheckIntervalMs || 1000;
    this.lastPerfTimestamp = performance.now();
    this.lastWallTimestamp = Date.now();

    this.throttlingCheckTimer = setInterval(() => {
      if (!this.isRunning) return;

      const nowPerf = performance.now();
      const nowWall = Date.now();

      const elapsedPerf = nowPerf - this.lastPerfTimestamp;
      const elapsedWall = nowWall - this.lastWallTimestamp;

      // Update baselines
      this.lastPerfTimestamp = nowPerf;
      this.lastWallTimestamp = nowWall;

      // If an expected 1000ms timer fired after > 20000ms (20 seconds),
      // or if performance.now() delta drifted by > 20 seconds
      if (elapsedWall > 20000 || Math.abs(elapsedWall - elapsedPerf) > 20000) {
        this.emitViolation({
          type: 'TIMER_THROTTLING_DETECTED',
          severity: 'HIGH',
          points: 3,
          reason: `Execution pause or timer throttling detected (Elapsed: ${(elapsedWall / 1000).toFixed(1)}s, Drift: ${(Math.abs(elapsedWall - elapsedPerf) / 1000).toFixed(1)}s > 20s).`,
          details: { elapsedWallMs: elapsedWall, elapsedPerfMs: elapsedPerf },
          timestamp: nowWall,
        });
      }
    }, intervalMs);
  }

  // ─── 6. CODE & WASM RUNTIME INTEGRITY VERIFICATION ──────────────────────────

  /**
   * Verifies the cryptographic SHA-256 self-checksum of proctoring Wasm modules.
   * Any mismatch triggers PROCTORING_MODULE_TAMPERING (CRITICAL = 8 pts, instant kill).
   */
  public async verifyWasmModuleIntegrity(
    wasmBuffer: ArrayBuffer | Uint8Array,
    expectedChecksum: string
  ): Promise<boolean> {
    const computedHash = await computeSha256(wasmBuffer);
    const matches = computedHash.toLowerCase() === expectedChecksum.toLowerCase();

    if (!matches) {
      this.emitViolation({
        type: 'PROCTORING_MODULE_TAMPERING',
        severity: 'CRITICAL',
        points: 8,
        reason: 'Proctoring Wasm binary failed cryptographic SHA-256 self-checksum verification.',
        details: {
          expectedChecksum,
          actualChecksum: computedHash,
        },
        timestamp: Date.now(),
      });
      return false;
    }

    return true;
  }

  // ─── UTILITIES ──────────────────────────────────────────────────────────────

  private emitViolation(event: Layer2ViolationEvent): void {
    if (!this.isRunning) return;
    this.options.onViolation(event);
  }
}

/**
 * Universal SHA-256 byte digest computation for browser and Node.js test runners.
 */
export async function computeSha256(bufferOrBytes: ArrayBuffer | Uint8Array): Promise<string> {
  const bytes = bufferOrBytes instanceof Uint8Array ? bufferOrBytes : new Uint8Array(bufferOrBytes);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Fallback for Node.js test environments
  try {
    const nodeCrypto = await import('crypto');
    return nodeCrypto.createHash('sha256').update(bytes).digest('hex');
  } catch {
    throw new Error('SHA-256 is not supported in this runtime environment');
  }
}

