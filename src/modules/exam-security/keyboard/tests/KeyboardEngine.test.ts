// Unit Tests for Enterprise Keyboard Restriction Engine
import { describe, it, expect } from 'vitest';
import { KeyCombinationParser } from '../utils/KeyCombinationParser';
import { ShortcutMatcher } from '../utils/ShortcutMatcher';
import { KeyboardPolicyService } from '../services/KeyboardPolicyService';
import { DEFAULT_RESTRICTED_SHORTCUTS } from '../constants/RestrictedKeys';

describe('Keyboard Engine & Parser Suite', () => {
  it('should correctly parse key combination strings', () => {
    const parsed = KeyCombinationParser.parseString('Ctrl+Shift+I');
    expect(parsed.ctrl).toBe(true);
    expect(parsed.shift).toBe(true);
    expect(parsed.alt).toBe(false);
    expect(parsed.mainKey).toBe('I');
  });

  it('should initialize KeyboardPolicyService with default restricted shortcuts', () => {
    const service = new KeyboardPolicyService();
    const rules = service.getRules();
    expect(rules.length).toBeGreaterThan(0);
    expect(service.getRule('f12_devtools')?.keyCombination).toBe('F12');
  });

  it('should update rule actions dynamically without hardcoded limits', () => {
    const service = new KeyboardPolicyService();
    service.updateRuleAction('f12_devtools', 'WARN_ONLY');
    expect(service.getRule('f12_devtools')?.action).toBe('WARN_ONLY');
  });
});
