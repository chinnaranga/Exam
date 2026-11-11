import { SecurityEvent } from '../types/security.types';

type EventCallback = (event: SecurityEvent) => void;

export class SecurityEventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  public register(eventType: string): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
  }

  public unregister(eventType: string): void {
    this.listeners.delete(eventType);
  }

  public subscribe(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.register(eventType);
    }
    this.listeners.get(eventType)?.add(callback);

    return () => this.unsubscribe(eventType, callback);
  }

  public unsubscribe(eventType: string, callback: EventCallback): void {
    this.listeners.get(eventType)?.delete(callback);
  }

  public dispatch(eventType: string, payload: any): void {
    const callbacks = this.listeners.get(eventType);
    const event: SecurityEvent = {
      type: eventType,
      payload,
      timestamp: new Date().toISOString(),
    };

    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(event);
        } catch (err) {
          console.error(`[SecurityEventBus] Error in listener for ${eventType}:`, err);
        }
      });
    }
  }
}

export const globalSecurityEventBus = new SecurityEventBus();
