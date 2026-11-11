import React from 'react';
import { CameraProvider } from '../camera/CameraContext';
import { ObjectDetectionProvider, useObjectDetectionContext } from './ObjectDetectionContext';
import { DetectionOverlay } from './DetectionOverlay';
import { ObjectDetectionPanel } from './ObjectDetectionPanel';
import { DetectedObjectsCard } from './DetectedObjectsCard';
import { DetectionConfidenceCard } from './DetectionConfidenceCard';
import { PolicyIndicator } from './PolicyIndicator';
import { DetectionTimeline } from './DetectionTimeline';
import { CameraPreview } from '../camera/CameraPreview';
import { ObjectPolicyConfig } from './types/object.types';

export interface ObjectDetectionEngineProps {
  autoStart?: boolean;
  initialPolicy?: Partial<ObjectPolicyConfig>;
  onProceedToModule6?: () => void;
}

const ObjectDetectionEngineContent: React.FC<{ onProceedToModule6?: () => void }> = ({ onProceedToModule6 }) => {
  const { detectedObjects } = useObjectDetectionContext();

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a', maxWidth: '840px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0284c7', fontWeight: 700 }}>
          Module 5: Enterprise Object Detection Engine
        </h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
          Real-time object classification (mobile phones, books, calculators, displays), persistent OBJ-101 tracking, alternative object interpretations, and policy matrix rules.
        </p>
      </div>

      {/* Main Camera Preview with SVG Object Bounding Box Overlay */}
      <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
        <CameraPreview />
        <DetectionOverlay objects={detectedObjects} />
      </div>

      {/* Diagnostics Panel */}
      <ObjectDetectionPanel />

      {/* Tracked Objects & Confidence Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <DetectedObjectsCard />
        <DetectionConfidenceCard />
      </div>

      {/* Institutional Policy Matrix */}
      <PolicyIndicator />

      {/* Detection Timeline */}
      <DetectionTimeline />

      {/* Next Stage Navigation Footer */}
      {onProceedToModule6 && (
        <div style={{ textAlign: 'right', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={onProceedToModule6}
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
            Proceed to Module 6: Audio Activity & Acoustic Intelligence →
          </button>
        </div>
      )}
    </div>
  );
};

export const ObjectDetectionEngine: React.FC<ObjectDetectionEngineProps> = (props) => {
  return (
    <CameraProvider autoStart={true}>
      <ObjectDetectionProvider autoStart={props.autoStart} initialPolicy={props.initialPolicy}>
        <ObjectDetectionEngineContent onProceedToModule6={props.onProceedToModule6} />
      </ObjectDetectionProvider>
    </CameraProvider>
  );
};
