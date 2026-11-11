import React from 'react';
import { CameraConnectionState } from './types/camera.types';

export interface CameraStatusProps {
  connection: CameraConnectionState;
  isMuted?: boolean;
}

export const CameraStatus: React.FC<CameraStatusProps> = ({ connection, isMuted = false }) => {
  if (connection === 'connected' && !isMuted) {
    return (
      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
        ● LIVE CAMERA ACTIVE
      </span>
    );
  }
  if (connection === 'connecting' || connection === 'reconnecting') {
    return (
      <span style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
        ⏳ CONNECTING CAMERA...
      </span>
    );
  }
  if (isMuted) {
    return (
      <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
        ⏸ STREAM MUTED
      </span>
    );
  }
  return (
    <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
      ○ CAMERA DISCONNECTED
    </span>
  );
};
