import React from 'react';
import { useAudio } from './hooks/useAudio';

export const AudioLevelMeter: React.FC = () => {
  const { audioLevel } = useAudio();

  const levelPercent = Math.min(100, Math.round(audioLevel.inputLevel * 100));

  let barColor = '#166534'; // Green = quiet/normal
  if (levelPercent > 50) barColor = '#d97706'; // Yellow = moderate
  if (levelPercent > 80) barColor = '#dc2626'; // Red = peak/loud

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
          Real-Time Microphone Input Level Meter
        </h4>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: barColor }}>
          {levelPercent}% RMS
        </span>
      </div>

      {/* Animated Level Progress Bar */}
      <div style={{ width: '100%', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '7px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${levelPercent}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: '7px',
            transition: 'width 0.15s ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
        <span>Peak: {(audioLevel.peakLevel * 100).toFixed(0)}%</span>
        <span>Avg: {(audioLevel.averageLevel * 100).toFixed(0)}%</span>
        <span>Noise Floor: {(audioLevel.noiseFloor * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};
