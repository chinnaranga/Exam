import React from 'react';
import { useObjectDetectionEngine } from './hooks/useObjectDetectionEngine';

export const DetectedObjectsCard: React.FC = () => {
  const { detectedObjects } = useObjectDetectionEngine();

  const getPolicyBadge = (rule: string) => {
    if (rule === 'Blocked') {
      return (
        <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
          BLOCKED
        </span>
      );
    }
    if (rule === 'Warning') {
      return (
        <span style={{ backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
          WARNING
        </span>
      );
    }
    return (
      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
        ALLOWED
      </span>
    );
  };

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Currently Tracked Objects & Bounding Boxes
      </h4>

      {detectedObjects.length === 0 ? (
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
          No objects detected in the candidate examination frame.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {detectedObjects.map((obj) => (
            <div
              key={obj.trackingId}
              style={{
                backgroundColor: obj.policyRule === 'Blocked' ? '#fef2f2' : '#f8fafc',
                border: `1px solid ${obj.policyRule === 'Blocked' ? '#fecaca' : '#e2e8f0'}`,
                borderRadius: '6px',
                padding: '0.75rem',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                  {obj.trackingId}: {obj.objectType}
                </strong>
                {getPolicyBadge(obj.policyRule)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                <div>
                  Confidence: <strong style={{ color: '#0284c7' }}>{obj.confidenceScore}% ({obj.confidenceRating})</strong>
                </div>
                <div>
                  Duration: <strong>{(obj.durationMs / 1000).toFixed(1)}s</strong>
                </div>
                <div>
                  Bounds: <strong>{obj.boundingBox.width}% x {obj.boundingBox.height}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
