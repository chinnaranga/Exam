import { useState, useEffect } from 'react';
import { AudioDevice, AudioPermissionState } from '../types/audio.types';

export const useMicrophone = (selectedDeviceId: string | null) => {
  const [permission, setPermission] = useState<AudioPermissionState>('granted');
  const [devices, setDevices] = useState<AudioDevice[]>([
    { deviceId: 'default', label: 'Default Built-in Microphone', groupId: 'group_1', kind: 'audioinput', isDefault: true },
    { deviceId: 'mic_usb_headset', label: 'USB Pro Headset Microphone', groupId: 'group_2', kind: 'audioinput' },
  ]);

  const requestPermission = async (): Promise<boolean> => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        setPermission('granted');
        return true;
      }
      return true;
    } catch {
      setPermission('denied');
      return false;
    }
  };

  return { permission, devices, requestPermission };
};
