// Unit Tests for Enterprise Fullscreen Engine & Services
import { describe, it, expect } from 'vitest';
import { BrowserCompatibility } from '../utils/BrowserCompatibility';
import { FullscreenStateService } from '../services/FullscreenStateService';
import { FullscreenPolicyService } from '../services/FullscreenPolicyService';
import { FullscreenRecoveryService } from '../services/FullscreenRecoveryService';

describe('Fullscreen Engine & Compatibility Suite', () => {
  it('should evaluate browser compatibility safely', () => {
    const isFS = BrowserCompatibility.isCurrentlyFullscreen();
    expect(typeof isFS).toBe('boolean');
  });

  it('should manage fullscreen state changes cleanly', () => {
    const stateService = new FullscreenStateService();
    stateService.setState('ACTIVE');
    expect(stateService.getState()).toBe('ACTIVE');
  });

  it('should track recovery attempts and max limits', () => {
    const policy = new FullscreenPolicyService();
    const recovery = new FullscreenRecoveryService(policy);

    expect(recovery.getRecoveryAttempts()).toBe(0);
    const exitRes = recovery.handleExit();
    expect(exitRes.isPaused).toBe(true);
  });
});
