import React from 'react';
import { usePipeline } from './hooks/usePipeline';

export const RiskDimensionsGrid: React.FC = () => {
  const { sessionState } = usePipeline();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        7 Independent Risk Dimension Metrics
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        {sessionState.riskDimensions.map((dim) => {
          let scoreColor = '#166534';
          if (dim.score < 90) scoreColor = '#d97706';
          if (dim.score < 75) scoreColor = '#b91c1c';

          return (
            <div key={dim.dimension} style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>{dim.dimension}:</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: scoreColor, marginTop: '0.15rem' }}>
                {dim.score}/100
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Trend: {dim.trend}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
