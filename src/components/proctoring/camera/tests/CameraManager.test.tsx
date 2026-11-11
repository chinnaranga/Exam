import { describe, it, expect, beforeEach } from 'vitest';
import { cameraService } from '../services/camera.service';
import { CAMERA_THRESHOLDS } from '../constants/camera.constants';

describe('Module 2: Camera Manager & Webcam Verification Test Suite', () => {
  beforeEach(() => {
    // Reset service state
  });

  it('1. should enumerate available camera devices gracefully', async () => {
    const devices = await cameraService.getDevices();
    expect(Array.isArray(devices)).toBe(true);
  });

  it('2. should verify camera stream quality and calculate verification scores', () => {
    const mockTrack: any = {
      enabled: true,
      readyState: 'live',
      getSettings: () => ({
        width: 1280,
        height: 720,
        frameRate: 30,
      }),
    };

    const mockStream: any = {
      getVideoTracks: () => [mockTrack],
    };

    const result = cameraService.verifyCamera(mockStream);
    expect(result).toBeDefined();
    expect(result.status).toBe('passed');
    expect(result.score).toBe(100);
    expect(result.isResolutionAcceptable).toBe(true);
    expect(result.isFrameRateAcceptable).toBe(true);
  });

  it('3. should flag low resolution streams below threshold', () => {
    const mockTrack: any = {
      enabled: true,
      readyState: 'live',
      getSettings: () => ({
        width: 320,
        height: 240,
        frameRate: 10,
      }),
    };

    const mockStream: any = {
      getVideoTracks: () => [mockTrack],
    };

    const result = cameraService.verifyCamera(mockStream);
    expect(result.status).not.toBe('passed');
    expect(result.score).toBeLessThan(100);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('4. should compute camera health metrics correctly', () => {
    const mockTrack: any = {
      enabled: true,
      muted: false,
      readyState: 'live',
      getSettings: () => ({ frameRate: 30 }),
    };

    const mockStream: any = {
      getVideoTracks: () => [mockTrack],
    };

    const health = cameraService.getCameraHealth(mockStream);
    expect(health.isActive).toBe(true);
    expect(health.isTrackMuted).toBe(false);
    expect(health.fpsEstimate).toBe(30);
  });

  it('5. should generate structured camera events with correct metadata schema', () => {
    const evt = cameraService.createCameraEvent('CameraConnected', 'Info', 'High', {
      deviceId: 'dev_webcam_01',
      label: 'Integrated HD Webcam',
    });

    expect(evt.module).toBe('CameraManager');
    expect(evt.type).toBe('CameraConnected');
    expect(evt.severity).toBe('Info');
    expect(evt.details.deviceId).toBe('dev_webcam_01');
  });
});
