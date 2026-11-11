import React from 'react';
import { useObjectDetectionEngine } from './hooks/useObjectDetectionEngine';

export const DetectionTimeline: React.FC = () => {
  const { events } = useObjectDetectionEngine();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Object Detection Event Log & Audit Timeline
      </h4>

      {events.length === 0 ? (
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
          No object events logged yet. Active object detection events will populate here in real-time.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
          {events.map((evt) => (
            <div key={evt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>{evt.trackingId}: {evt.objectType} ({evt.event})</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{evt.explanation}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ backgroundColor: evt.severity === 'High' ? '#fee2e2' : '#f1f5f9', color: evt.severity === 'High' ? '#b91c1c' : '#475569', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
                  {evt.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
