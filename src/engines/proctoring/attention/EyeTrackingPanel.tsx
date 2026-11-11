import React from 'react';
import { useAttention } from './hooks/useAttention';

export const EyeTrackingPanel: React.FC = () => {
  const { eyeState } = useAttention();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Eye Openness & EAR (Eye Aspect Ratio) Metrics
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Left Eye Openness:</span>
          <div style={{ fontWeight: 700, color: eyeState.leftEyeState === 'open' ? '#166534' : '#b91c1c' }}>
            {Math.round(eyeState.leftEyeOpenness * 100)}% ({eyeState.leftEyeState})
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Right Eye Openness:</span>
          <div style={{ fontWeight: 700, color: eyeState.rightEyeState === 'open' ? '#166534' : '#b91c1c' }}>
            {Math.round(eyeState.rightEyeOpenness * 100)}% ({eyeState.rightEyeState})
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Est. Blink Rate:</span>
          <div style={{ fontWeight: 700, color: '#0284c7' }}>{eyeState.blinkRatePerMin} / min</div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Normal: 15–20/min</span>
        </div>
      </div>
    </div>
  );
};
