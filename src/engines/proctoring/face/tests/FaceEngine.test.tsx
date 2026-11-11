import { describe, it, expect } from 'vitest';
import { faceService } from '../services/face.service';
import { faceVerificationService } from '../services/faceVerification.service';

describe('Module 3: Face Detection & Identity Foundation Test Suite', () => {
  it('1. should run face frame analysis and return bounding box metrics', () => {
    const res = faceService.analyzeFrame(null);
    expect(res.detection).toBeDefined();
    expect(res.detection.faceCount).toBe(1);
    expect(res.detection.primaryFace).toBeDefined();
    expect(res.detection.primaryFace?.confidence).toBeGreaterThan(0.6);
  });

  it('2. should evaluate image quality parameters and return rationale', () => {
    const quality = faceService.evaluateQuality(25, 70, 60, 45, 10);
    expect(quality.rating).toBeDefined();
    expect(quality.reasons.length).toBeGreaterThan(0);
    expect(quality.reasons[0]).toContain('Low ambient lighting');
  });

  it('3. should capture reference biometric snapshot and run verification matching', async () => {
    const candidateId = 'cand_test_777';
    const refHash = await faceVerificationService.captureReferenceSnapshot(candidateId);
    expect(refHash).toBeDefined();
    expect(refHash).toContain(candidateId);

    const result = faceVerificationService.verifyFace('initial_pre_exam');
    expect(result.status).toBe('verified');
    expect(result.similarityScore).toBeGreaterThanOrEqual(75);
  });

  it('4. should flag unverified status when no reference snapshot exists', () => {
    const freshService = new (faceVerificationService.constructor as any)();
    const result = freshService.verifyFace('manual_proctor_trigger');
    expect(result.status).toBe('required');
    expect(result.similarityScore).toBe(0);
  });

  it('5. should generate structured audit events with explicit explanations & limitations', () => {
    const evt = faceService.createFaceEvent(
      'FacePresence',
      'FaceMissing',
      'High',
      'High',
      'No face detected for more than 12 seconds.',
      'Camera obstruction or severe lighting may also cause this.',
      { durationMs: 12000 }
    );

    expect(evt.module).toBe('FacePresence');
    expect(evt.type).toBe('FaceMissing');
    expect(evt.severity).toBe('High');
    expect(evt.explanation).toContain('No face detected');
    expect(evt.limitations).toContain('Camera obstruction');
  });
});
