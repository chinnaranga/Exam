import React from 'react';
import { useObjectDetectionEngine } from './hooks/useObjectDetectionEngine';

export const PolicyIndicator: React.FC = () => {
  const { policyConfig } = useObjectDetectionEngine();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Institutional Object Policy Matrix
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '0.6rem' }}>
          <strong style={{ color: '#b91c1c', fontSize: '0.75rem' }}>BLOCKED OBJECTS:</strong>
          <div style={{ marginTop: '0.25rem', color: '#991b1b', fontSize: '0.75rem' }}>
            {policyConfig.blockedObjects.join(', ')}
          </div>
        </div>

        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '0.6rem' }}>
          <strong style={{ color: '#b45309', fontSize: '0.75rem' }}>WARNING OBJECTS:</strong>
          <div style={{ marginTop: '0.25rem', color: '#92400e', fontSize: '0.75rem' }}>
            {policyConfig.warningObjects.join(', ')}
          </div>
        </div>

        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.6rem' }}>
          <strong style={{ color: '#166534', fontSize: '0.75rem' }}>ALLOWED OBJECTS:</strong>
          <div style={{ marginTop: '0.25rem', color: '#14532d', fontSize: '0.75rem' }}>
            {policyConfig.allowedObjects.join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
};
