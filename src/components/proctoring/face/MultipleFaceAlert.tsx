import React from 'react';
import { useFace } from './hooks/useFace';

export const MultipleFaceAlert: React.FC = () => {
  const { faceCount } = useFace();

  if (faceCount <= 1) return null;

  return (
    <div
      style={{
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>🚨</span>
      <div>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#991b1b', fontWeight: 700 }}>
          Multiple Persons Detected ({faceCount} Faces in Frame)
        </h4>
        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#b91c1c' }}>
          Institutional policy requires candidate isolation during testing. Please ensure no secondary individuals are present in the camera view.
        </p>
      </div>
    </div>
  );
};
