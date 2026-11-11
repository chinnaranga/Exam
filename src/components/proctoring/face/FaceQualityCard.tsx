import React from 'react';
import { useFace } from './hooks/useFace';

export const FaceQualityCard: React.FC = () => {
  const { quality } = useFace();

  const getRatingColor = () => {
    if (quality.rating === 'excellent') return '#166534';
    if (quality.rating === 'good') return '#15803d';
    if (quality.rating === 'fair') return '#b45309';
    return '#b91c1c';
  };

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
          Face Quality & Lighting Analysis
        </h4>
        <span style={{ backgroundColor: '#f1f5f9', color: getRatingColor(), padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
          {quality.rating}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Brightness:</span>
          <div style={{ fontWeight: 700, color: quality.brightness >= 40 ? '#166534' : '#b91c1c' }}>
            {quality.brightness}%
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Contrast:</span>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>{quality.contrast}%</div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Sharpness:</span>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>{quality.sharpness}%</div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Blur Score:</span>
          <div style={{ fontWeight: 700, color: quality.blurScore < 30 ? '#166534' : '#b91c1c' }}>
            {quality.blurScore}%
          </div>
        </div>
      </div>

      {quality.reasons.length > 0 && (
        <div style={{ marginTop: '0.75rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309' }}>Quality Rationale:</span>
          <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1rem', fontSize: '0.75rem', color: '#92400e' }}>
            {quality.reasons.map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
