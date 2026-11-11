import React from 'react';
import { useAudio } from './hooks/useAudio';

export const AudioHealthCard: React.FC = () => {
  const { health } = useAudio();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
          Audio Health & Stream Integrity
        </h4>
        <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
          SCORE: {health.healthScore}/100
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Stream Status:</span>
          <div style={{ fontWeight: 700, color: health.isMicrophoneActive ? '#166534' : '#b91c1c' }}>
            {health.isMicrophoneActive ? 'Active Stream' : 'Stream Lost'}
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Clipping Status:</span>
          <div style={{ fontWeight: 700, color: health.isClipping ? '#b91c1c' : '#166534' }}>
            {health.isClipping ? 'Distortion Clipping' : 'Normal Dynamic Range'}
          </div>
        </div>
      </div>
    </div>
  );
};
