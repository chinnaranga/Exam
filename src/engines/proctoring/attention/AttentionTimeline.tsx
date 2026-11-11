import React from 'react';
import { useAttention } from './hooks/useAttention';

export const AttentionTimeline: React.FC = () => {
  const { timeline } = useAttention();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Attention Shift Chronological Timeline
      </h4>

      {timeline.length === 0 ? (
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
          No attention shifts logged yet. Continuous gaze and head orientation changes will appear here in real-time.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
          {timeline.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
              <div>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.type}</span>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.explanation}</div>
              </div>
              <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
