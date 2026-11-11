import React from 'react';
import { useObjectDetectionEngine } from './hooks/useObjectDetectionEngine';

export const DetectionConfidenceCard: React.FC = () => {
  const { detectedObjects } = useObjectDetectionEngine();

  const primary = detectedObjects[0];

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Confidence Engine & Alternative Interpretations
      </h4>

      {!primary ? (
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
          No objects available for confidence analysis.
        </p>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
              Target: {primary.objectType}
            </span>
            <span style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
              {primary.confidenceRating} CONFIDENCE ({primary.confidenceScore}%)
            </span>
          </div>

          {primary.possibleAlternatives.length > 0 && (
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309' }}>Possible Alternative Object Classifications:</span>
              <ul style={{ margin: '0.2rem 0 0 0', paddingLeft: '1rem', fontSize: '0.75rem', color: '#92400e' }}>
                {primary.possibleAlternatives.map((alt, idx) => (
                  <li key={idx}>{alt}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#475569' }}>
            <strong>Explanation:</strong> {primary.explanation}
            <div style={{ marginTop: '0.25rem', color: '#64748b' }}>
              <strong>Limitations:</strong> {primary.limitations}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
