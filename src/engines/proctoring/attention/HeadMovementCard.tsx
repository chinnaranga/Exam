import React from 'react';
import { useAttention } from './hooks/useAttention';

export const HeadMovementCard: React.FC = () => {
  const { headPose } = useAttention();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
          Head Rotation & Velocity Analyzer
        </h4>
        {headPose.isRapidTurn && (
          <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
            ⚡ RAPID HEAD TURN
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Orientation:</span>
          <div style={{ fontWeight: 700, color: headPose.orientation === 'centered' ? '#166534' : '#b45309', textTransform: 'capitalize' }}>
            {headPose.orientation}
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Angular Velocity:</span>
          <div style={{ fontWeight: 700, color: headPose.movementSpeed > 45 ? '#b91c1c' : '#0f172a' }}>
            {headPose.movementSpeed} deg/sec
          </div>
        </div>
      </div>
    </div>
  );
};
