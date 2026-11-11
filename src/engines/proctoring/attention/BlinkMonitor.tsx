import React from 'react';
import { useAttention } from './hooks/useAttention';

export const BlinkMonitor: React.FC = () => {
  const { eyeState } = useAttention();

  const isLongClosure = eyeState.leftEyeState === 'closed' && eyeState.rightEyeState === 'closed';

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
          Blink Rate & Eye Closure Monitor
        </h4>
        {isLongClosure && (
          <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
            ⚠ EYE CLOSURE DETECTED
          </span>
        )}
      </div>

      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
        Monitors blink frequency and flags eye closures longer than 2.5 seconds (potential fatigue or optical obstruction).
      </p>
    </div>
  );
};
