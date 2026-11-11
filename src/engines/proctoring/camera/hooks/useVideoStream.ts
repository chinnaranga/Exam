import { useState, useEffect, useRef, useCallback } from 'react';
import { cameraService } from '../services/camera.service';
import { CameraConnectionState, CameraHealth, CameraResolution } from '../types/camera.types';

/**
 * Custom hook `useVideoStream` managing WebRTC MediaStream track acquisition,
 * camera switching, live health checking, and automatic track release on unmount.
 */
export const useVideoStream = (initialDeviceId?: string | null) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<CameraConnectionState>('disconnected');
  const [resolution, setResolution] = useState<CameraResolution | null>(null);
  const [health, setHealth] = useState<CameraHealth>({
    isActive: false,
    isTrackEnabled: false,
    isTrackMuted: false,
    hasTrackEnded: false,
    fpsEstimate: 0,
    droppedFramesCount: 0,
    reconnectAttempts: 0,
    brightnessScore: 0,
    lastChecked: new Date().toLocaleTimeString(),
  });
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  streamRef.current = stream;

  const startStream = useCallback(async (deviceId?: string | null) => {
    setConnectionState('connecting');
    setError(null);
    try {
      if (streamRef.current) {
        cameraService.stopStream(streamRef.current);
      }

      const newStream = await cameraService.startStream(deviceId);
      setStream(newStream);
      setConnectionState('connected');

      const res = cameraService.getStreamResolution(newStream);
      setResolution(res);

      const h = cameraService.getCameraHealth(newStream);
      setHealth(h);
      return newStream;
    } catch (err: any) {
      setConnectionState('error');
      setError(err?.message || 'Failed to start video stream.');
      setStream(null);
      return null;
    }
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      cameraService.stopStream(streamRef.current);
      setStream(null);
      setConnectionState('disconnected');
      setResolution(null);
    }
  }, []);

  const switchCamera = useCallback(async (newDeviceId: string) => {
    return await startStream(newDeviceId);
  }, [startStream]);

  // Clean up all tracks safely on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        cameraService.stopStream(streamRef.current);
      }
    };
  }, []);

  return {
    stream,
    connectionState,
    resolution,
    health,
    error,
    startStream,
    stopStream,
    switchCamera,
  };
};
