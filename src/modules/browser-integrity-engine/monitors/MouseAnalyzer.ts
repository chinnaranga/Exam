import { BaseModule } from '../core/BaseModule';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';

interface PositionSample {
  x: number;
  y: number;
  time: number;
}

/**
 * @class MouseAnalyzer
 * @extends BaseModule
 * @description Kinematic mouse motion analyzer tracking velocity, acceleration, trajectory linearity, and click cadence.
 * Stores strictly coordinate and timing metadata.
 * 
 * HEURISTICS & LIMITATIONS:
 * • Teleportation signals occur on touchscreens, stylus/pen tablets, dual-monitor mouse wrap, or RDP remote desktop latency.
 * • Linear trajectories can be produced by hardware accessibility switches, graphic tablets, or mouse snapping features.
 */
export class MouseAnalyzer extends BaseModule {
  private animFrameId: number | null = null;
  private pendingPos: PositionSample | null = null;
  private lastPos: PositionSample | null = null;
  private recentAngles: number[] = [];

  public lastMoveTimestamp: number = Date.now();
  public totalClickCount: number = 0;
  private clickTimestamps: number[] = [];

  constructor(eventBus: EventBus, sessionManager: SessionManager) {
    super('MouseAnalyzer', eventBus, sessionManager);
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;
    this.lastMoveTimestamp = Date.now();

    this.addDOMListener(window, 'mousemove', this.handleMouseMove, { passive: true });
    this.addDOMListener(window, 'mousedown', this.handleMouseDown, { passive: true });
    this.addDOMListener(window, 'mouseup', this.handleMouseUp, { passive: true });
    this.addDOMListener(window, 'click', this.handleClick, { passive: true });
    this.addDOMListener(window, 'dblclick', this.handleDblClick, { passive: true });
    this.addDOMListener(window, 'contextmenu', this.handleContextMenu, { passive: true });
    this.addDOMListener(window, 'wheel', this.handleWheel, { passive: true });

    this.tick();
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.removeAllDOMListeners();

    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private handleMouseMove = (e: Event) => {
    const mouseEvt = e as MouseEvent;
    this.pendingPos = { x: mouseEvt.clientX, y: mouseEvt.clientY, time: Date.now() };
    this.lastMoveTimestamp = Date.now();
  };

  private handleMouseDown = () => {
    this.lastMoveTimestamp = Date.now();
  };

  private handleMouseUp = () => {
    this.lastMoveTimestamp = Date.now();
  };

  private handleClick = () => {
    const now = Date.now();
    this.totalClickCount += 1;
    this.clickTimestamps.push(now);
    if (this.clickTimestamps.length > 12) {
      this.clickTimestamps.shift();
    }
    this.analyzeClickCadence();
  };

  private handleDblClick = () => {
    this.emitEvent({
      type: 'DoubleClickDetected',
      severity: 'INFO',
      confidence: 'HIGH',
      details: {
        message: 'Mouse double click recorded.',
        rawEventType: 'dblclick',
        explanation: 'Candidate double-clicked on an interface element.',
      },
    });
  };

  private handleContextMenu = (e: Event) => {
    const mouseEvt = e as MouseEvent;
    this.emitEvent({
      type: 'ContextMenuAttempted',
      severity: 'LOW',
      confidence: 'HIGH',
      details: {
        message: 'Right-click context menu attempted.',
        rawEventType: 'contextmenu',
        explanation: 'Candidate attempted to open context menu.',
        metadata: { x: mouseEvt.clientX, y: mouseEvt.clientY },
      },
    });
  };

  private handleWheel = () => {
    this.lastMoveTimestamp = Date.now();
  };

  private tick = () => {
    if (!this.isRunning) return;

    if (this.pendingPos) {
      const current = this.pendingPos;
      this.pendingPos = null;

      if (this.lastPos) {
        const dx = current.x - this.lastPos.x;
        const dy = current.y - this.lastPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const dt = Math.max(1, current.time - this.lastPos.time);
        const speed = (dist / dt) * 1000; // px/sec

        // 1. Detect Teleportation / Impossible Speed (> 600px in < 25ms)
        if (dist > 600 && dt < 25) {
          this.emitEvent({
            type: 'CursorTeleportation',
            severity: 'MEDIUM',
            confidence: 'MEDIUM',
            details: {
              message: `Cursor teleportation detected (${Math.round(dist)}px in ${dt}ms).`,
              signalStrength: 0.6,
              rawEventType: 'mousemove',
              explanation: 'Unusual sudden cursor position jump across large screen coordinates.',
              limitationNote: 'Touchscreen taps, graphics tablets, dual-monitor switches, or RDP cause valid jumps.',
              possibleFalsePositives: ['Touchscreen tap', 'Stylus / Pen tablet input', 'Remote desktop (RDP/VNC) cursor sync'],
              metadata: { distancePx: Math.round(dist), durationMs: dt, speedPxPerSec: Math.round(speed) },
            },
          });
        }

        // 2. Trajectory Linear Acceleration Variance Tracking
        if (dist > 10) {
          const angle = Math.atan2(dy, dx);
          this.recentAngles.push(angle);
          if (this.recentAngles.length > 15) {
            this.recentAngles.shift();
            this.analyzeTrajectoryLinearity();
          }
        }
      }
      this.lastPos = current;
    }

    this.animFrameId = requestAnimationFrame(this.tick);
  };

  private analyzeTrajectoryLinearity(): void {
    if (this.recentAngles.length < 10) return;

    let sum = 0;
    for (let i = 1; i < this.recentAngles.length; i++) {
      sum += Math.abs(this.recentAngles[i] - this.recentAngles[i - 1]);
    }
    const avgAngleDiff = sum / (this.recentAngles.length - 1);

    if (avgAngleDiff < 0.005) {
      this.emitEvent({
        type: 'RoboticMouseMovement',
        severity: 'MEDIUM',
        confidence: 'LOW',
        details: {
          message: 'Robotic straight-line mouse trajectory detected.',
          signalStrength: 0.5,
          rawEventType: 'mousemove',
          explanation: 'Mouse path exhibited mathematical zero-variance linearity characteristic of synthetic macros.',
          limitationNote: 'Hardware accessibility switches or graphics tablet straight-line gestures mimic linearity.',
          possibleFalsePositives: ['Graphics tablet ruler tool', 'Accessibility switch navigation', 'High-DPI gaming mouse macro'],
          metadata: { angularVariance: avgAngleDiff },
        },
      });
      this.recentAngles = [];
    }
  }

  private analyzeClickCadence(): void {
    if (this.clickTimestamps.length < 5) return;

    const intervals: number[] = [];
    for (let i = 1; i < this.clickTimestamps.length; i++) {
      intervals.push(this.clickTimestamps[i] - this.clickTimestamps[i - 1]);
    }

    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / intervals.length;

    if (variance < 100 && avg < 300) {
      this.emitEvent({
        type: 'UniformClickCadence',
        severity: 'MEDIUM',
        confidence: 'MEDIUM',
        details: {
          message: `Robotic click cadence detected (Avg ${Math.round(avg)}ms, variance ${Math.round(variance)}).`,
          signalStrength: 0.65,
          rawEventType: 'click',
          explanation: 'Click timestamps demonstrated synthetic uniform spacing characteristic of auto-clicker scripts.',
          limitationNote: 'Rapid double-clicks or gaming mouse hardware turbo buttons generate uniform clicks.',
          possibleFalsePositives: ['Turbo click hardware button', 'Rapid manual double-clicking'],
          metadata: { avgIntervalMs: Math.round(avg), variance },
        },
      });
      this.clickTimestamps = [];
    }
  }
}
