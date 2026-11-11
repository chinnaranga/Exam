import { useState, useEffect } from 'react';
import { cameraService } from '../services/camera.service';
import { CameraDevice } from '../types/camera.types';

/**
 * Custom hook `useCameraDevices` to discover, enumerate, and automatically handle
 * device attachment/detachment (`devicechange` listener).
 */
export const useCameraDevices = () => {
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshDevices = async () => {
    setIsLoading(true);
    try {
      const list = await cameraService.getDevices();
      setDevices(list);
      if (list.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(list[0].deviceId);
      }
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to enumerate media devices.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDevices();

    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      const handleDeviceChange = () => {
        refreshDevices();
      };
      navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      };
    }
  }, []);

  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    isLoading,
    error,
    refreshDevices,
  };
};
