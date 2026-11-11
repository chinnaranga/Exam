// Unit Tests for Enterprise Browser Event Manager
import { describe, it, expect } from 'vitest';
import { BrowserEventManager } from '../BrowserEventManager';
import { EventNormalizer } from '../utils/EventNormalizer';

describe('BrowserEventManager & Normalizer Suite', () => {
  it('should normalize browser events cleanly with required envelope fields', () => {
    const norm = EventNormalizer.normalize('WINDOW_FOCUS', { test: true }, { examId: 'ex_1' });
    expect(norm.eventType).toBe('WINDOW_FOCUS');
    expect(norm.examId).toBe('ex_1');
    expect(norm.metadata?.test).toBe(true);
    expect(norm.id).toBeDefined();
    expect(norm.timestamp).toBeDefined();
  });

  it('should initialize BrowserEventManager and manage monitoring lifecycle', () => {
    const mgr = new BrowserEventManager({ examId: 'ex_99' });
    expect(mgr.getEventCount()).toBe(0);

    mgr.startMonitoring();
    expect(mgr.getEventCount()).toBe(0);

    mgr.stopMonitoring();
  });
});
