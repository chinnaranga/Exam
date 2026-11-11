import React from 'react';
import { useCamera } from './hooks/useCamera';
import { CAMERA_THRESHOLDS } from './constants/camera.constants';

export const ResolutionCard: React.FC = () => {
  const { currentResolution } = useCamera();

  if (!currentResolution) {
    return (
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Resolution Validation</h4>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Stream inactive. Connect camera to evaluate resolution compliance.</p>
      </div>
    );
  }

  const isWidthOk = currentResolution.width >= CAMERA_THRESHOLDS.MIN_WIDTH;
  const isHeightOk = currentResolution.height >= CAMERA_THRESHOLDS.MIN_HEIGHT;
  const isFpsOk = currentResolution.fps >= CAMERA_THRESHOLDS.MIN_FPS || currentResolution.fps === 0;

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Stream Resolution & Frame Rate Validation
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Resolution:</span>
          <div style={{ fontWeight: 700, color: isWidthOk && isHeightOk ? '#166534' : '#b91c1c' }}>
            {currentResolution.width} x {currentResolution.height}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Min: 640x480</span>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Aspect Ratio:</span>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>{currentResolution.aspectRatio} : 1</div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Standard 16:9 / 4:3</span>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Target Frame Rate:</span>
          <div style={{ fontWeight: 700, color: isFpsOk ? '#166534' : '#b91c1c' }}>
            {currentResolution.fps || 30} FPS
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Min: 15 FPS</span>
        </div>
      </div>
    </div>
  );
};
