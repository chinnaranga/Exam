import { aiConfidenceEngineService } from './aiConfidenceEngine.service';
import { alertEngineService } from './alertEngine.service';
import { correlationEngineService } from './correlationEngine.service';
import { eventNormalizerService } from './eventNormalizer.service';
import { eventValidatorService } from './eventValidator.service';
import { policyEngineService } from './policyEngine.service';
import { riskDimensionCalculatorService } from './riskDimensionCalculator.service';
import { sessionStateManagerService } from './sessionStateManager.service';
import { PipelineAlert, UnifiedIntegrityEvent } from '../types/pipeline.types';

/**
 * @class EventGatewayService
 * @description Master Event Gateway orchestrating 14 sub-engines across normalization, validation,
 * correlation, confidence calculation, risk dimension tracking, policy evaluation, alert generation, and WebSocket dispatch.
 */
export class EventGatewayService {
  private timelineLog: UnifiedIntegrityEvent[] = [];

  public processIngestedEvent(rawPayload: Partial<UnifiedIntegrityEvent>): {
    event: UnifiedIntegrityEvent;
    alert?: PipelineAlert;
  } {
    // 1. Normalize
    const normalized = eventNormalizerService.normalize(rawPayload);

    // 2. Validate
    const validation = eventValidatorService.validate(normalized);
    if (!validation.isValid) {
      throw new Error(`Event validation failed: ${validation.error}`);
    }

    // 3. Correlate
    const correlated = correlationEngineService.correlate(normalized);

    // 4. Calculate AI Confidence
    const conf = aiConfidenceEngineService.calculateConfidence(correlated);
    correlated.confidence = conf.score;

    // 5. Update Risk Dimensions
    const dimensions = riskDimensionCalculatorService.processEvent(correlated);

    // 6. Evaluate Policy
    const policyResult = policyEngineService.evaluateEventPolicy(correlated);

    // 7. Alert Generation if policy violation
    let alert: PipelineAlert | undefined;
    if (policyResult.isViolation && policyResult.reason) {
      alert = alertEngineService.generateAlert(correlated, policyResult.reason);
    }

    // 8. Update Session State
    sessionStateManagerService.updateSession(correlated.sessionId, correlated, dimensions, alert);

    // Log to Timeline
    this.timelineLog.unshift(correlated);
    if (this.timelineLog.length > 500) this.timelineLog.pop();

    return { event: correlated, alert };
  }

  public getTimeline(): UnifiedIntegrityEvent[] {
    return this.timelineLog;
  }
}

export const eventGatewayService = new EventGatewayService();
