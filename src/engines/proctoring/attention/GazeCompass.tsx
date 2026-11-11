import React from 'react';
import { useAttention } from './hooks/useAttention';

/**
 * 360° Visual Gaze Compass displaying real-time candidate gaze angle and zone.
 */
export const GazeCompass: React.FC = () => {
  const { gaze } = useAttention();

  const getMarkerPosition = () => {
    let x = 50; // Percentage
    let y = 50;
    if (gaze.zone === 'left') x = 20;
    if (gaze.zone === 'right') x = 80;
    if (gaze.zone === 'up') y = 20;
    if (gaze.zone === 'down') y = 80;
    return { x, y };
  };

  const pos = getMarkerPosition();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Visual Gaze Compass & Directional Zone
      </h4>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '0.75rem 0' }}>
        <div
          style={{
            position: 'relative',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            backgroundColor: '#f8fafc',
            border: '2px solid #0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Compass Axis Lines */}
          <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#e2e8f0' }} />
          <div style={{ position: 'absolute', width: '1px', height: '100%', backgroundColor: '#e2e8f0' }} />

          {/* Compass Zone Labels */}
          <span style={{ position: 'absolute', top: '6px', fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>UP</span>
          <span style={{ position: 'absolute', bottom: '6px', fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>DOWN</span>
          <span style={{ position: 'absolute', left: '6px', fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>LEFT</span>
          <span style={{ position: 'absolute', right: '6px', fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>RIGHT</span>

          {/* Dynamic Gaze Target Pointer */}
          <div
            style={{
              position: 'absolute',
              top: `${pos.y}%`,
              left: `${pos.x}%`,
              transform: 'translate(-50%, -50%)',
              width: '16px',
              height: '16px',
              backgroundColor: gaze.zone === 'center' ? '#166534' : '#d97706',
              borderRadius: '50%',
              border: '2px solid #ffffff',
              boxShadow: '0 0 8px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: gaze.zone === 'center' ? '#166534' : '#b45309' }}>
        Current Zone: {gaze.zone.toUpperCase()} (H: {gaze.angleHorizontalDeg}°, V: {gaze.angleVerticalDeg}°)
      </div>
    </div>
  );
};
