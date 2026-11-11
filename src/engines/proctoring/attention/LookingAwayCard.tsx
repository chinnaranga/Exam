import React from 'react';
import { useAttention } from './hooks/useAttention';

export const LookingAwayCard: React.FC = () => {
  const { lookingAway } = useAttention();

  const formatSec = (ms: number) => (ms / 1000).toFixed(1);

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
          Looking Away Duration & Frequency Tracker
        </h4>
        {lookingAway.isLookingAway && (
          <span style={{ backgroundColor: '#fffbeb', color: '#b45309', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
            CURRENTLY AWAY ({formatSec(lookingAway.currentAwayDurationMs)}s)
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Current Away:</span>
          <div style={{ fontWeight: 700, color: lookingAway.currentAwayDurationMs > 4000 ? '#b91c1c' : '#0f172a' }}>
            {formatSec(lookingAway.currentAwayDurationMs)}s
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Total Cumulative:</span>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>
            {formatSec(lookingAway.totalAwayDurationMs)}s
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Away Frequency:</span>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>
            {lookingAway.awayFrequencyCount} shifts
          </div>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', backgroundColor: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Objective Explanation:</span>
        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#0f172a' }}>
          {lookingAway.explanation}
        </p>
      </div>
    </div>
  );
};
