import React from 'react';
import { useCamera } from './hooks/useCamera';

export const CameraSelector: React.FC = () => {
  const { availableDevices, selectedDeviceId, selectCamera, refreshDevices } = useCamera();

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
        Select Camera Device:
      </label>
      <select
        value={selectedDeviceId || ''}
        onChange={(e) => selectCamera(e.target.value)}
        style={{
          backgroundColor: '#ffffff',
          color: '#0f172a',
          border: '1px solid #cbd5e1',
          padding: '0.45rem 0.8rem',
          borderRadius: '6px',
          fontSize: '0.85rem',
          width: '100%',
          maxWidth: '360px',
        }}
      >
        {availableDevices.map((dev) => (
          <option key={dev.deviceId} value={dev.deviceId}>
            {dev.label} {dev.isVirtual ? '(Virtual Camera)' : ''}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={refreshDevices}
        title="Refresh Camera Device List"
        style={{
          backgroundColor: '#f1f5f9',
          color: '#475569',
          border: '1px solid #cbd5e1',
          padding: '0.45rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.85rem',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        ↻ Refresh List
      </button>
    </div>
  );
};
