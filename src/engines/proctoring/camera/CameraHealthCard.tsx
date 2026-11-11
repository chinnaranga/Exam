import React from 'react';
import { useCamera } from './hooks/useCamera';

export const CameraHealthCard: React.FC = () => {
  const { health, isStreaming, startCamera } = useCamera();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
          Real-Time Hardware & Stream Health
        </h4>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Last Checked: {health.lastChecked}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Track Status:</span>
          <div style={{ fontWeight: 700, color: health.isActive ? '#166534' : '#b91c1c' }}>
            {health.isActive ? 'Active (Live)' : 'Inactive'}
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Track Muted:</span>
          <div style={{ fontWeight: 700, color: health.isTrackMuted ? '#b91c1c' : '#166534' }}>
            {health.isTrackMuted ? 'Muted' : 'Unmuted'}
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Est. Live FPS:</span>
          <div style={{ fontWeight: 700, color: health.fpsEstimate >= 15 ? '#166534' : '#d97706' }}>
            {health.fpsEstimate} FPS
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Dropped Frames:</span>
          <div style={{ fontWeight: 700, color: health.droppedFramesCount === 0 ? '#166534' : '#d97706' }}>
            {health.droppedFramesCount}
          </div>
        </div>
      </div>

      {!health.isActive && isStreaming && (
        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#991b1b' }}>⚠ Video track degradation detected.</span>
          <button
            type="button"
            onClick={() => startCamera()}
            style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            Reconnect Stream
          </button>
        </div>
      )}
    </div>
  );
};
