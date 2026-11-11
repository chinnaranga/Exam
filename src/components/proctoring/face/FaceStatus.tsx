import React from 'react';
import { FacePresenceStatus } from './types/face.types';

export interface FaceStatusProps {
  presenceStatus: FacePresenceStatus;
  faceCount: number;
}

export const FaceStatus: React.FC<FaceStatusProps> = ({ presenceStatus, faceCount }) => {
  if (faceCount > 1) {
    return (
      <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
        ⚠ MULTIPLE FACES DETECTED ({faceCount})
      </span>
    );
  }
  if (presenceStatus === 'visible' && faceCount === 1) {
    return (
      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
        ● CANDIDATE FACE PRESENT
      </span>
    );
  }
  if (presenceStatus === 'partially_visible') {
    return (
      <span style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
        ◐ FACE PARTIALLY VISIBLE
      </span>
    );
  }
  return (
    <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
      ✕ NO FACE DETECTED
    </span>
  );
};
