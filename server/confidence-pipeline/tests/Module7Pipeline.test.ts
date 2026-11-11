import { describe, it, expect } from 'vitest';
import { eventNormalizerService } from '../services/eventNormalizer.service';
import { eventValidatorService } from '../services/eventValidator.service';
import { correlationEngineService } from '../services/correlationEngine.service';
import { aiConfidenceEngineService } from '../services/aiConfidenceEngine.service';
import { riskDimensionCalculatorService } from '../services/riskDimensionCalculator.service';
import { policyEngineService } from '../services/policyEngine.service';
import { eventGatewayService } from '../services/eventGateway.service';

describe('Module 7: AI Confidence Engine & Event Pipeline Test Suite', () => {
  it('1. should normalize raw telemetry payloads into unified 18-field schema', () => {
    const raw = { module: 'FaceDetector', eventType: 'FaceMissing' };
    const norm = eventNormalizerService.normalize(raw);
    expect(norm.eventId).toBeDefined();
    expect(norm.module).toBe('FaceDetector');
    expect(norm.policyVersion).toBeDefined();
  });

  it('2. should validate mandatory schema fields and detect duplicate event IDs', () => {
    const norm = eventNormalizerService.normalize({ eventId: 'evt_dup_101', module: 'FaceDetector', eventType: 'FaceMissing' });
    const v1 = eventValidatorService.validate(norm);
    expect(v1.isValid).toBe(true);

    const v2 = eventValidatorService.validate(norm);
    expect(v2.isValid).toBe(false);
    expect(v2.error).toContain('Duplicate event ID');
  });

  it('3. should correlate concurrent observations within 5-second window', () => {
    const norm1 = eventNormalizerService.normalize({ eventId: 'evt_corr_1', timestamp: new Date().toISOString(), eventType: 'LookingAway' });
    const norm2 = eventNormalizerService.normalize({ eventId: 'evt_corr_2', timestamp: new Date().toISOString(), eventType: 'HeadTurnRight' });

    correlationEngineService.correlate(norm1);
    const result = correlationEngineService.correlate(norm2);

    expect(result.correlationId).toBeDefined();
    expect(result.explanation).toContain('LookingAway');
  });

  it('4. should calculate AI confidence ratings and return human-readable rationale', () => {
    const norm = eventNormalizerService.normalize({ duration: 500 });
    const conf = aiConfidenceEngineService.calculateConfidence(norm);
    expect(conf.score).toBe('Low');
    expect(conf.explanation).toContain('< 1.0s');
  });

  it('5. should calculate 7 independent risk dimensions', () => {
    const norm = eventNormalizerService.normalize({ module: 'ObjectDetector' });
    const dims = riskDimensionCalculatorService.processEvent(norm);
    expect(dims.length).toBe(7);
    const objDim = dims.find((d) => d.dimension === 'Objects');
    expect(objDim).toBeDefined();
    expect(objDim?.score).toBe(90);
  });

  it('6. should evaluate versioned organization policies', () => {
    const norm = eventNormalizerService.normalize({ module: 'ObjectDetector', eventType: 'PhoneDetected' });
    const policyResult = policyEngineService.evaluateEventPolicy(norm);
    expect(policyResult.isViolation).toBe(true);
  });

  it('7. should process end-to-end event ingestion and generate reviewer alerts', () => {
    const res = eventGatewayService.processIngestedEvent({
      eventId: 'evt_ingest_888',
      module: 'ObjectDetector',
      eventType: 'PhoneDetected',
      severity: 'High',
    });

    expect(res.event).toBeDefined();
    expect(res.alert).toBeDefined();
    expect(res.alert?.suggestedAction).toContain('Review live proctor feed');
  });
});
