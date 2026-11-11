import React from 'react';
import { useAttention } from './hooks/useAttention';

export const HeadPosePanel: React.FC = () => {
  const { headPose } = useAttention();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        3D Head Pose Angles (Yaw / Pitch / Roll)
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Yaw (Left/Right):</span>
          <div style={{ fontWeight: 700, color: Math.abs(headPose.yawDeg) > 22 ? '#b91c1c' : '#166534' }}>
            {headPose.yawDeg}°
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Pitch (Up/Down):</span>
          <div style={{ fontWeight: 700, color: Math.abs(headPose.pitchDeg) > 22 ? '#b91c1c' : '#166534' }}>
            {headPose.pitchDeg}°
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Roll (Tilt):</span>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>{headPose.rollDeg}°</div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Stability Score:</span>
          <div style={{ fontWeight: 700, color: headPose.stabilityScore >= 70 ? '#166534' : '#b45309' }}>
            {headPose.stabilityScore}%
          </div>
        </div>
      </div>
    </div>
  );
};
