import React from 'react';
import { useAttention } from './hooks/useAttention';

export const AttentionStatusCard: React.FC = () => {
  const { status, trackingConfidence } = useAttention();

  const getStatusBadge = () => {
    if (status === 'focused') {
      return (
        <span style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
          ● ATTENTION FOCUSED
        </span>
      );
    }
    if (status === 'looking_away') {
      return (
        <span style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
          ◐ GAZE OFF-CENTER
        </span>
      );
    }
    if (status === 'head_turned') {
      return (
        <span style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
          🔄 HEAD ROTATED
        </span>
      );
    }
    return (
      <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
        ✕ ATTENTION UNSTABLE
      </span>
    );
  };

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>Candidate Attention Status</h4>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            Tracking Confidence: <strong style={{ color: '#0284c7' }}>{trackingConfidence}</strong>
          </p>
        </div>
        {getStatusBadge()}
      </div>
    </div>
  );
};
