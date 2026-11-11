import React from 'react';
import { usePipeline } from './hooks/usePipeline';

export const LivePipelineFeed: React.FC = () => {
  const { events } = usePipeline();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Live Normalized Telemetry Event Stream
      </h4>

      {events.length === 0 ? (
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
          No ingested events. Continuous normalized events from Modules 1–6 and Browser Integrity SDK stream here.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
          {events.map((evt) => (
            <div key={evt.eventId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>{evt.module}: {evt.eventType}</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{evt.explanation}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ backgroundColor: evt.confidence === 'High' ? '#dcfce7' : '#fee2e2', color: evt.confidence === 'High' ? '#15803d' : '#b91c1c', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
                  {evt.confidence.toUpperCase()} CONFIDENCE
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
