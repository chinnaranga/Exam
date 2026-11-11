import React from 'react';
import { useFace } from './hooks/useFace';

export const FacePresenceCard: React.FC = () => {
  const { presenceStatus, seatedDurationMs, totalAbsenceDurationMs } = useFace();

  const formatDuration = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Candidate Presence & Absence Timeline
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Presence State:</span>
          <div style={{ fontWeight: 700, color: presenceStatus === 'visible' ? '#166534' : '#b91c1c', textTransform: 'capitalize' }}>
            {presenceStatus.replace('_', ' ')}
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Seated Duration:</span>
          <div style={{ fontWeight: 700, color: '#166534' }}>{formatDuration(seatedDurationMs)}</div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Total Absence:</span>
          <div style={{ fontWeight: 700, color: totalAbsenceDurationMs > 0 ? '#b91c1c' : '#64748b' }}>
            {formatDuration(totalAbsenceDurationMs)}
          </div>
        </div>
      </div>
    </div>
  );
};
