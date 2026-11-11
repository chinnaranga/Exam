import { BaseModule } from '../core/BaseModule';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';

export interface NetworkStateSnapshot {
  timestamp: string;
  timestampMs: number;
  online: boolean;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
}

/**
 * @class NetworkMonitor
 * @extends BaseModule
 * @description Monitors network status, connection switching, degradation, and online/offline transitions.
 * Maintains a rolling network timeline history throughout the examination session.
 * 
 * COLLECTED METRICS:
 * • navigator.onLine status
 * • Network Information API (navigator.connection / webkitConnection / mozConnection):
 *   - effectiveType ('slow-2g', '2g', '3g', '4g')
 *   - downlink (Mbps speed estimate)
 *   - rtt (round trip latency in ms)
 *   - saveData (data-saver preference)
 *   - type ('wifi', 'cellular', 'ethernet', 'unknown')
 * 
 * DETECTIONS:
 * • Online / Offline transitions
 * • Connection degradation (effectiveType drops to 2g / slow-2g or RTT > 1500ms)
 * • Network connection switching (e.g. WiFi to Cellular hot-spot)
 * 
 * HEURISTIC LIMITATIONS & FALSE POSITIVES:
 * • Network drops happen naturally due to router hiccups, ISP issues, or signal interference.
 * • Network Information API relies on browser implementation support (Chromium supported, Safari restricted).
 */
export class NetworkMonitor extends BaseModule {
  private networkTimeline: NetworkStateSnapshot[] = [];
  private static readonly MAX_TIMELINE_ENTRIES = 50;

  private lastSnapshot: NetworkStateSnapshot | null = null;
  private connectionObject: any = null;

  constructor(eventBus: EventBus, sessionManager: SessionManager) {
    super('NetworkMonitor', eventBus, sessionManager);
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;

    // Capture initial network state
    this.lastSnapshot = this.captureSnapshot();
    this.recordTimeline(this.lastSnapshot);

    // Attach event-driven listeners
    this.addDOMListener(window, 'online', this.handleOnline, { passive: true });
    this.addDOMListener(window, 'offline', this.handleOffline, { passive: true });

    // Listen to Network Information API changes if available
    this.initNetworkInformationAPI();
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.connectionObject) {
      try {
        this.connectionObject.removeEventListener('change', this.handleConnectionChange);
      } catch {}
      this.connectionObject = null;
    }

    this.removeAllDOMListeners();
  }

  /**
   * Returns the recorded network timeline history.
   */
  public getNetworkTimeline(): NetworkStateSnapshot[] {
    return [...this.networkTimeline];
  }

  /**
   * Capture current network metrics snapshot.
   */
  public captureSnapshot(): NetworkStateSnapshot {
    const timestampMs = Date.now();
    const online = typeof navigator !== 'undefined' ? navigator.onLine : true;

    const conn = this.getConnectionObject();
    const effectiveType = conn?.effectiveType || 'unknown';
    const downlink = typeof conn?.downlink === 'number' ? conn.downlink : 0;
    const rtt = typeof conn?.rtt === 'number' ? conn.rtt : 0;
    const saveData = !!conn?.saveData;
    const connectionType = this.classifyConnectionType(conn?.type);

    return {
      timestamp: new Date(timestampMs).toISOString(),
      timestampMs,
      online,
      effectiveType,
      downlink,
      rtt,
      saveData,
      connectionType,
    };
  }

  /**
   * Initialize Network Information API change listener.
   */
  private initNetworkInformationAPI(): void {
    const conn = this.getConnectionObject();
    if (conn) {
      this.connectionObject = conn;
      try {
        conn.addEventListener('change', this.handleConnectionChange);
      } catch {}
    }
  }

  /**
   * Event handler for 'online' event.
   */
  private handleOnline = () => {
    if (!this.isRunning) return;

    const current = this.captureSnapshot();
    this.recordTimeline(current);

    const offlineDurationMs = this.lastSnapshot && !this.lastSnapshot.online
      ? current.timestampMs - this.lastSnapshot.timestampMs
      : 0;

    this.emitEvent({
      type: 'Online',
      severity: 'INFO',
      confidence: 'HIGH',
      details: {
        message: `Network connectivity restored after ${Math.round(offlineDurationMs / 1000)}s offline.`,
        explanation: 'Browser re-established active internet connection.',
        limitationNote: 'Does not guarantee server API availability, only client network interface status.',
        metadata: {
          offlineDurationSec: Math.round(offlineDurationMs / 1000),
          effectiveType: current.effectiveType,
          connectionType: current.connectionType,
        },
      },
    });

    this.lastSnapshot = current;
  };

  /**
   * Event handler for 'offline' event.
   */
  private handleOffline = () => {
    if (!this.isRunning) return;

    const current = this.captureSnapshot();
    this.recordTimeline(current);

    this.emitEvent({
      type: 'Offline',
      severity: 'HIGH',
      confidence: 'HIGH',
      details: {
        message: 'Network connection lost.',
        signalStrength: 0.9,
        explanation: 'Browser network interface transitioned to offline state.',
        limitationNote: 'Network disconnects happen frequently due to router drops or Wi-Fi interference.',
        possibleFalsePositives: ['Wi-Fi signal drop', 'Router reboot', 'Airplane mode toggled accidentally'],
        metadata: { timestamp: current.timestamp },
      },
    });

    this.lastSnapshot = current;
  };

  /**
   * Event handler for Network Information API change event.
   */
  private handleConnectionChange = () => {
    if (!this.isRunning || !this.lastSnapshot) return;

    const current = this.captureSnapshot();
    this.recordTimeline(current);

    // 1. Connection Type Switch (WiFi -> Cellular, etc.)
    if (current.connectionType !== this.lastSnapshot.connectionType && current.connectionType !== 'unknown') {
      this.emitEvent({
        type: 'ConnectionChanged',
        severity: 'MEDIUM',
        confidence: 'HIGH',
        details: {
          message: `Network connection medium switched from ${this.lastSnapshot.connectionType} to ${current.connectionType}.`,
          signalStrength: 0.6,
          explanation: 'Candidate switched network physical connection interface (e.g. Wi-Fi to Mobile Hotspot).',
          limitationNote: 'Auto-failover to mobile hotspot occurs when primary Wi-Fi degrades.',
          possibleFalsePositives: ['Automatic Wi-Fi to cellular failover', 'Ethernet cable plugged/unplugged'],
          metadata: {
            previousMedium: this.lastSnapshot.connectionType,
            currentMedium: current.connectionType,
            effectiveType: current.effectiveType,
          },
        },
      });
    }

    // 2. Network Degradation / Slow Network
    const isSlowType = current.effectiveType === 'slow-2g' || current.effectiveType === '2g';
    const isHighLatency = current.rtt > 1500;

    if (isSlowType || isHighLatency) {
      this.emitEvent({
        type: 'SlowNetwork',
        severity: 'MEDIUM',
        confidence: 'HIGH',
        details: {
          message: `Significant network degradation detected (EffectiveType: ${current.effectiveType}, RTT: ${current.rtt}ms).`,
          signalStrength: 0.5,
          explanation: 'Client network latency or throughput degraded below acceptable operational thresholds.',
          limitationNote: 'ISP congestion or background downloads cause network slowdowns.',
          possibleFalsePositives: ['ISP bandwidth throttling', 'Heavy network background download'],
          metadata: {
            effectiveType: current.effectiveType,
            downlink: current.downlink,
            rtt: current.rtt,
          },
        },
      });
    }

    this.lastSnapshot = current;
  };

  /**
   * Maintain capped rolling timeline history array.
   */
  private recordTimeline(snapshot: NetworkStateSnapshot): void {
    this.networkTimeline.push(snapshot);
    if (this.networkTimeline.length > NetworkMonitor.MAX_TIMELINE_ENTRIES) {
      this.networkTimeline.shift();
    }
  }

  /**
   * Retrieve navigator.connection cross-browser object.
   */
  private getConnectionObject(): any {
    if (typeof navigator === 'undefined') return null;
    return (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection || null;
  }

  /**
   * Map string type to standardized connection classification.
   */
  private classifyConnectionType(type?: string): 'wifi' | 'cellular' | 'ethernet' | 'unknown' {
    if (!type) return 'unknown';
    const lower = type.toLowerCase();
    if (lower.includes('wifi') || lower.includes('wlan')) return 'wifi';
    if (lower.includes('cellular') || lower.includes('4g') || lower.includes('3g') || lower.includes('2g')) return 'cellular';
    if (lower.includes('ethernet')) return 'ethernet';
    return 'unknown';
  }
}
