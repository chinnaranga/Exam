import React from 'react';
import { usePipeline } from './hooks/usePipeline';

export const ActiveAlertsCard: React.FC = () => {
  const { alerts } = usePipeline();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Active Pipeline Alerts & Reviewer Actions
      </h4>

      {alerts.length === 0 ? (
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
          No active alerts. Events exceeding institutional policy thresholds will trigger reviewer alerts here.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '0.6rem' }}>
          {alerts.map((alt) => (
            <div key={alt.alertId} style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <strong style={{ color: '#991b1b' }}>{alt.reason}</strong>
                <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {alt.severity.toUpperCase()}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#7f1d1d' }}>
                <strong>Suggested Action:</strong> {alt.suggestedAction}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
