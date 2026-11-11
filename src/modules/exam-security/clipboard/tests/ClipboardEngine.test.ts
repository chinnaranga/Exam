// Unit Tests for Enterprise Clipboard Protection Suite
import { describe, it, expect } from 'vitest';
import { ClipboardPolicyService } from '../services/ClipboardPolicyService';
import { ClipboardAnalyticsService } from '../services/ClipboardAnalyticsService';
import { ClipboardNormalizer } from '../utils/ClipboardNormalizer';

describe('Clipboard Protection & Analytics Suite', () => {
  it('should normalize clipboard events capturing metadata ONLY (NEVER copied text content)', () => {
    const fakeEvt = new Event('copy');
    const norm = ClipboardNormalizer.normalize(fakeEvt, 'COPY', 'BLOCK', 'Prevented copy');

    expect(norm.clipboardAction).toBe('COPY');
    expect(norm.actionTaken).toBe('BLOCK');
    expect(norm.selectionLength).toBeDefined();
    // Ensure no content body field exists
    expect((norm as any).text).toBeUndefined();
    expect((norm as any).content).toBeUndefined();
  });

  it('should initialize ClipboardPolicyService with default rules', () => {
    const service = new ClipboardPolicyService();
    expect(service.getRules().length).toBeGreaterThan(0);
    expect(service.getRuleForOperation('COPY')?.action).toBe('BLOCK');
  });

  it('should calculate risk score in ClipboardAnalyticsService correctly', () => {
    const analytics = new ClipboardAnalyticsService();
    const event = ClipboardNormalizer.normalize(new Event('paste'), 'PASTE', 'BLOCK', 'Prevented paste');
    analytics.recordEvent(event);

    const summary = analytics.getSummary();
    expect(summary.pasteAttempts).toBe(1);
    expect(summary.clipboardRiskScore).toBe(70); // 40 for paste + 30 for block
  });
});
