import React from 'react';
import { useCamera } from './hooks/useCamera';

export const PermissionBanner: React.FC = () => {
  const { permission, requestPermission, startCamera } = useCamera();

  if (permission === 'granted') return null;

  return (
    <div
      style={{
        backgroundColor: permission === 'denied' ? '#fee2e2' : '#eff6ff',
        border: `1px solid ${permission === 'denied' ? '#fecaca' : '#bfdbfe'}`,
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: permission === 'denied' ? '#991b1b' : '#1e40af', fontWeight: 600 }}>
          {permission === 'denied' ? 'Camera Permission Required' : 'Camera Access Needs Authorization'}
        </h4>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: permission === 'denied' ? '#b91c1c' : '#1e3a8a' }}>
          {permission === 'denied'
            ? 'Browser access was denied. Please update site permissions in your browser address bar and click Retry.'
            : 'AssessIQ requires camera access to proceed with webcam verification.'}
        </p>
      </div>

      <button
        type="button"
        onClick={async () => {
          const ok = await requestPermission();
          if (ok) await startCamera();
        }}
        style={{
          backgroundColor: permission === 'denied' ? '#dc2626' : '#2563eb',
          color: '#ffffff',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          fontWeight: 600,
          fontSize: '0.85rem',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {permission === 'denied' ? 'Retry Permission' : 'Authorize Camera'}
      </button>
    </div>
  );
};
