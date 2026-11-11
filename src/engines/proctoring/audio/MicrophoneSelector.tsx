import React from 'react';
import { useAudio } from './hooks/useAudio';

export const MicrophoneSelector: React.FC = () => {
  const { availableDevices, selectedDeviceId, selectMicrophone } = useAudio();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Microphone Device Selection
      </h4>

      <select
        value={selectedDeviceId || ''}
        onChange={(e) => selectMicrophone(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          fontSize: '0.85rem',
          color: '#0f172a',
          backgroundColor: '#f8fafc',
        }}
      >
        {availableDevices.map((dev) => (
          <option key={dev.deviceId} value={dev.deviceId}>
            {dev.label} {dev.isDefault ? '(System Default)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};
