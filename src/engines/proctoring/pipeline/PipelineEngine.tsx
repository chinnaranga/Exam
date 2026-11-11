import React from 'react';
import { PipelineProvider } from './PipelineContext';
import { PipelineDiagnosticsCard } from './PipelineDiagnosticsCard';
import { RiskDimensionsGrid } from './RiskDimensionsGrid';
import { ActiveAlertsCard } from './ActiveAlertsCard';
import { LivePipelineFeed } from './LivePipelineFeed';

export interface PipelineEngineProps {
  sessionId?: string;
  onProceedToModule8?: () => void;
}

const PipelineEngineContent: React.FC<{ onProceedToModule8?: () => void }> = ({ onProceedToModule8 }) => {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a', maxWidth: '840px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0284c7', fontWeight: 700 }}>
          Module 7: AI Confidence Engine, Event Pipeline & Policy Engine
        </h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
          Standardizes telemetry from all AI modules into unified 18-field schemas, correlates concurrent observations, evaluates 7 independent risk dimensions, and dispatches explainable alerts.
        </p>
      </div>

      {/* Pipeline Diagnostics */}
      <PipelineDiagnosticsCard />

      {/* 7 Independent Risk Dimensions */}
      <RiskDimensionsGrid />

      {/* Active Reviewer Alerts */}
      <ActiveAlertsCard />

      {/* Live Ingested Telemetry Feed */}
      <LivePipelineFeed />

      {/* Next Stage Navigation Footer */}
      {onProceedToModule8 && (
        <div style={{ textAlign: 'right', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={onProceedToModule8}
            style={{
              backgroundColor: '#166534',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.75rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Proceed to Module 8: Invigilator & Reviewer Command Center →
          </button>
        </div>
      )}
    </div>
  );
};

export const PipelineEngine: React.FC<PipelineEngineProps> = (props) => {
  return (
    <PipelineProvider sessionId={props.sessionId}>
      <PipelineEngineContent onProceedToModule8={props.onProceedToModule8} />
    </PipelineProvider>
  );
};
