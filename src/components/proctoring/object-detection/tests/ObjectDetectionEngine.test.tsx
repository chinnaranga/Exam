import { describe, it, expect } from 'vitest';
import { objectDetectionService } from '../services/objectDetection.service';
import { objectTrackingService } from '../services/objectTracking.service';

describe('Module 5: Enterprise Object Detection Engine Test Suite', () => {
  it('1. should detect objects and return bounding box and confidence ratings', () => {
    const res = objectDetectionService.analyzeFrame(null);
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].objectType).toBe('Mobile Phone');
    expect(res[0].confidenceScore).toBeGreaterThan(60);
    expect(res[0].boundingBox.width).toBeGreaterThan(0);
  });

  it('2. should evaluate object policy rules correctly', () => {
    const phoneRule = objectDetectionService.evaluatePolicyRule('Mobile Phone');
    expect(phoneRule).toBe('Blocked');

    const idRule = objectDetectionService.evaluatePolicyRule('ID Card');
    expect(idRule).toBe('Allowed');
  });

  it('3. should update tracking IDs and accumulate object duration', () => {
    const res = objectDetectionService.analyzeFrame(null);
    const updated = objectTrackingService.updateTracks(res, 500);
    expect(updated[0].trackingId).toBe('OBJ-101');
    expect(updated[0].durationMs).toBeGreaterThan(0);
  });

  it('4. should generate structured object telemetry events with explanations & limitations', () => {
    const evt = objectDetectionService.createObjectEvent(
      'ObjectDetector',
      'Mobile Phone',
      'Detected',
      'Medium',
      'High',
      'A handheld rectangular object consistent with a mobile phone was detected for 5.1 seconds.',
      'Could also represent a calculator or wallet depending on camera angle.',
      5100,
      'OBJ-103',
      { x: 60, y: 50, width: 20, height: 30 }
    );

    expect(evt.module).toBe('ObjectDetector');
    expect(evt.objectType).toBe('Mobile Phone');
    expect(evt.trackingId).toBe('OBJ-103');
    expect(evt.explanation).toContain('mobile phone');
    expect(evt.limitations).toContain('calculator or wallet');
  });
});
