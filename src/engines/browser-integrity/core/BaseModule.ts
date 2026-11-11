import { EventBus } from './EventBus';
import { SessionManager } from './SessionManager';
import {
  IntegritySeverity,
  IntegrityConfidence,
  IntegrityEventDetails,
  IntegrityEvent,
} from '../types/IntegrityEvent';

export interface DOMEventListenerRegistration {
  target: EventTarget;
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
}

/**
 * @class BaseModule
 * @abstract
 * @description Foundation lifecycle base class for all Browser Integrity Engine telemetry modules.
 * Enforces standardized subscription lifecycle, safe event listener removal, and zero memory leaks.
 */
export abstract class BaseModule {
  protected isRunning: boolean = false;
  private domListeners: DOMEventListenerRegistration[] = [];

  constructor(
    public readonly moduleName: string,
    protected eventBus: EventBus,
    protected sessionManager: SessionManager
  ) {}

  /**
   * Start telemetry tracking. Must be implemented by derived modules.
   */
  public abstract start(): void;

  /**
   * Stop telemetry tracking. Must be implemented by derived modules.
   */
  public abstract stop(): void;

  /**
   * Safely attach DOM event listeners with automatic tracking for memory leak prevention.
   */
  protected addDOMListener(
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    target.addEventListener(type, listener, options);
    this.domListeners.push({ target, type, listener, options });
  }

  /**
   * Remove all attached DOM listeners to ensure clean teardown.
   */
  protected removeAllDOMListeners(): void {
    this.domListeners.forEach(({ target, type, listener, options }) => {
      target.removeEventListener(type, listener, options);
    });
    this.domListeners = [];
  }

  /**
   * Helper to publish a structured integrity telemetry event into the EventBus.
   */
  protected emitEvent(params: {
    type: string;
    severity: IntegritySeverity;
    confidence: IntegrityConfidence;
    details: IntegrityEventDetails;
  }): IntegrityEvent {
    const timestampMs = Date.now();
    const session = this.sessionManager.getSessionState();

    const event: IntegrityEvent = {
      id: `evt_${this.moduleName.toLowerCase()}_${timestampMs}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date(timestampMs).toISOString(),
      timestampMs,
      module: this.moduleName,
      type: params.type,
      severity: params.severity,
      confidence: params.confidence,
      details: params.details,
      sessionId: session.sessionId,
      candidateId: session.candidateId,
      examId: session.examId,
    };

    this.eventBus.publish(event);
    return event;
  }

  /**
   * Register and start module telemetry monitoring.
   */
  public register(): void {
    this.start();
  }

  /**
   * Unregister and stop module telemetry monitoring.
   */
  public unregister(): void {
    this.stop();
  }

  /**
   * Alias for teardown and cleanup of all resources.
   */
  public cleanup(): void {
    this.destroy();
  }

  /**
   * Teardown module and release all listeners.
   */
  public destroy(): void {
    this.stop();
    this.removeAllDOMListeners();
  }
}
