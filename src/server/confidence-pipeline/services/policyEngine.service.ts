import { DEFAULT_PIPELINE_POLICY } from '../constants/pipeline.constants';
import { PipelinePolicyConfig, UnifiedIntegrityEvent } from '../types/pipeline.types';

/**
 * @class PolicyEngineService
 * @description Versioned Organization Policy Engine evaluating event rules, minimum duration thresholds,
 * allowed/blocked object policies, and alert severity levels.
 */
export class PolicyEngineService {
  private activePolicy: PipelinePolicyConfig = DEFAULT_PIPELINE_POLICY;

  public getPolicy(): PipelinePolicyConfig {
    return this.activePolicy;
  }

  public updatePolicy(newPolicy: Partial<PipelinePolicyConfig>): PipelinePolicyConfig {
    this.activePolicy = {
      ...this.activePolicy,
      ...newPolicy,
      policyVersion: `v2026.${Date.now()}`,
    };
    return this.activePolicy;
  }

  public evaluateEventPolicy(event: UnifiedIntegrityEvent): { isViolation: boolean; reason?: string } {
    if (event.module === 'ObjectDetector' && event.eventType.includes('Phone') && !this.activePolicy.phoneAllowed) {
      return { isViolation: true, reason: 'Mobile phone detected in frame violates institutional exam policy.' };
    }

    if (event.severity === 'High' || event.severity === 'Critical') {
      return { isViolation: true, reason: `Event severity (${event.severity}) exceeds policy alert threshold.` };
    }

    return { isViolation: false };
  }
}

export const policyEngineService = new PolicyEngineService();
