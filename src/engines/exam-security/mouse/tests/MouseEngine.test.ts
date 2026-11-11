// Unit Tests for Enterprise Mouse Restriction & Analytics Suite
import { describe, it, expect } from 'vitest';
import { MousePolicyService } from '../services/MousePolicyService';
import { MouseAnalyticsEngine } from '../services/MouseAnalyticsEngine';
import { MouseEventNormalizer } from '../utils/MouseEventNormalizer';

describe('Mouse Restriction Engine & Analytics Suite', () => {
  it('should identify code editor elements as editable target', () => {
    const fakeElem = { tagName: 'DIV', className: 'monaco-editor', isContentEditable: false } as any;
    expect(MouseEventNormalizer.isTargetEditable(fakeElem)).toBe(true);
  });

  it('should initialize MousePolicyService with default rules', () => {
    const service = new MousePolicyService();
    expect(service.getRules().length).toBeGreaterThan(0);
    expect(service.getRuleForInteraction('CONTEXT_MENU')?.action).toBe('BLOCK');
  });

  it('should compute mouse analytics summary and suspicious score correctly', () => {
    const analytics = new MouseAnalyticsEngine();
    const event = MouseEventNormalizer.normalize(new MouseEvent('click'), 'RIGHT_CLICK', 'BLOCK', 'Prevented');
    analytics.recordEvent(event);
    analytics.recordEvent(event);
    analytics.recordEvent(event);
    analytics.recordEvent(event);

    const summary = analytics.getSummary();
    expect(summary.rightClickCount).toBe(4);
    expect(summary.suspiciousScore).toBe(30);
  });
});
