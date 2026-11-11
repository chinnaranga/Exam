import { EventBus } from './EventBus';
import { SessionManager, SessionConfig } from './SessionManager';
import { TelemetryManager } from './TelemetryManager';
import {
  IntegrityEvent,
  IntegritySeverity,
  IntegrityConfidence,
  IntegrityEventDetails,
} from '../types/IntegrityEvent';

export interface EngineConfig extends SessionConfig {
  maxBufferCapacity?: number;
}

/**
 * @class BrowserIntegrityEngine
 * @description Master orchestrator for the AssessIQ Browser Integrity Engine SDK.
 * Collects, normalizes, stores, and streams behavioral telemetry signals entirely client-side.
 * 
 * CORE DESIGN PRINCIPLE:
 * • Client-side code is NOT trusted.
 * • Browser signals are probabilistic evidence, NEVER proof of misconduct.
 * • All final scoring occurs server-side.
 */
export class BrowserIntegrityEngine {
  public readonly eventBus: EventBus;
  public readonly sessionManager: SessionManager;
  public readonly telemetryManager: TelemetryManager;

  private isRunning: boolean = false;

  constructor(config?: EngineConfig) {
    this.eventBus = new EventBus();
    this.sessionManager = new SessionManager(config);
    this.telemetryManager = new TelemetryManager(
      this.eventBus,
      this.sessionManager,
      config?.maxBufferCapacity || 5000
    );
  }

  /**
   * Start the integrity collection engine and session clock.
   */
  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.sessionManager.startSession();

    // Emit initial system boot telemetry event
    this.emitSignal({
      module: 'ENGINE_CORE',
      type: 'ENGINE_STARTED',
      severity: 'INFO',
      confidence: 'HIGH',
      details: {
        message: 'Browser Integrity Engine initialized successfully.',
        explanation: 'Engine core started and listening for telemetry events via EventBus.',
      },
    });
  }

  /**
   * Stop the engine and freeze session telemetry.
   */
  public stop(): void {
    if (!this.isRunning) return;
    this.emitSignal({
      module: 'ENGINE_CORE',
      type: 'ENGINE_STOPPED',
      severity: 'INFO',
      confidence: 'HIGH',
      details: {
        message: 'Browser Integrity Engine stopped.',
        explanation: 'Session telemetry monitoring paused.',
      },
    });
    this.sessionManager.completeSession();
    this.isRunning = false;
  }

  /**
   * Emit a structured integrity telemetry signal into the EventBus.
   */
  public emitSignal(params: {
    module: string;
    type: string;
    severity: IntegritySeverity;
    confidence: IntegrityConfidence;
    details: IntegrityEventDetails;
  }): IntegrityEvent {
    const timestampMs = Date.now();
    const event: IntegrityEvent = {
      id: `evt_${timestampMs}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date(timestampMs).toISOString(),
      timestampMs,
      module: params.module,
      type: params.type,
      severity: params.severity,
      confidence: params.confidence,
      details: params.details,
      sessionId: this.sessionManager.getSessionState().sessionId,
      candidateId: this.sessionManager.getSessionState().candidateId,
      examId: this.sessionManager.getSessionState().examId,
    };

    this.eventBus.publish(event);
    return event;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public destroy(): void {
    this.stop();
    this.telemetryManager.destroy();
    this.eventBus.clear();
  }
}
