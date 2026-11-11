import React from 'react';
import { useAudio } from './hooks/useAudio';

export const BackgroundNoiseCard: React.FC = () => {
  const { backgroundNoise } = useAudio();

  const getNoiseColor = () => {
    if (backgroundNoise.category === 'Quiet') return '#166534';
    if (backgroundNoise.category === 'Moderate') return '#d97706';
    return '#b91c1c';
  };

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
          Background Noise & Environmental Acoustics
        </h4>
        <span style={{ backgroundColor: '#f1f5f9', color: getNoiseColor(), padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
          {backgroundNoise.category.toUpperCase()} NOISE
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Estimated Noise Level:</span>
          <div style={{ fontWeight: 700, color: getNoiseColor() }}>
            {backgroundNoise.noiseLevelDb} dB
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Acoustic Sound Heuristic:</span>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>
            {backgroundNoise.soundType}
          </div>
        </div>
      </div>
    </div>
  );
};
