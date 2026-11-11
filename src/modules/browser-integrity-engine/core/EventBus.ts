import { IntegrityEvent } from '../types/IntegrityEvent';

export type EventCallback = (event: IntegrityEvent) => void;

/**
 * @class EventBus
 * @description Centralized, decoupled pub-sub message bus for the Browser Integrity Engine.
 * All modules communicate exclusively via structured event messages published to the EventBus.
 */
export class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private globalListeners: Set<EventCallback> = new Set();

  /**
   * Subscribe a callback to a specific event type or topic.
   * @param eventType Event topic (e.g., 'FOCUS_LOSS', 'DEVTOOLS_OPENED', '*')
   * @param callback Handler function
   * @returns Unsubscribe function
   */
  public subscribe(eventType: string, callback: EventCallback): () => void {
    if (eventType === '*') {
      this.globalListeners.add(callback);
      return () => this.globalListeners.delete(callback);
    }

    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    const handlers = this.listeners.get(eventType)!;
    handlers.add(callback);

    return () => {
      handlers.delete(callback);
      if (handlers.size === 0) {
        this.listeners.delete(eventType);
      }
    };
  }

  /**
   * Publish an event to all matching subscribers.
   * Isolates listener execution with try-catch to guarantee core loop stability.
   * @param event Structured IntegrityEvent payload
   */
  public publish(event: IntegrityEvent): void {
    // 1. Notify specific topic listeners
    const handlers = this.listeners.get(event.type);
    if (handlers) {
      handlers.forEach((callback) => {
        try {
          callback(event);
        } catch (err) {
          console.error(`[EventBus] Error in listener for type "${event.type}":`, err);
        }
      });
    }

    // 2. Notify wildcard global listeners
    this.globalListeners.forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error(`[EventBus] Error in global listener for event "${event.type}":`, err);
      }
    });
  }

  /**
   * Clear all active event subscriptions.
   */
  public clear(): void {
    this.listeners.clear();
    this.globalListeners.clear();
  }

  /**
   * Returns current subscriber count per topic.
   */
  public getSubscriberMetrics(): Record<string, number> {
    const metrics: Record<string, number> = {
      '*': this.globalListeners.size,
    };
    this.listeners.forEach((handlers, topic) => {
      metrics[topic] = handlers.size;
    });
    return metrics;
  }
}
