import React from 'react';
import { CameraProvider } from '../camera/CameraContext';
import { AttentionProvider } from './AttentionContext';
import { GazeCompass } from './GazeCompass';
import { EyeTrackingPanel } from './EyeTrackingPanel';
import { HeadPosePanel } from './HeadPosePanel';
import { AttentionStatusCard } from './AttentionStatusCard';
import { LookingAwayCard } from './LookingAwayCard';
import { BlinkMonitor } from './BlinkMonitor';
import { HeadMovementCard } from './HeadMovementCard';
import { AttentionTimeline } from './AttentionTimeline';
import { CameraPreview } from '../camera/CameraPreview';

export interface AttentionEngineProps {
  autoStart?: boolean;
  onProceedToModule5?: () => void;
}

const AttentionEngineContent: React.FC<{ onProceedToModule5?: () => void }> = ({ onProceedToModule5 }) => {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a', maxWidth: '840px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0284c7', fontWeight: 700 }}>
          Module 4: Eye Tracking, Gaze Estimation & Head Pose Engine
        </h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
          Real-time attention analysis: gaze vector zone, eye aspect ratio (EAR), 3D head pose (Yaw/Pitch/Roll), looking away timer, and chronological timeline.
        </p>
      </div>

      {/* Main Camera Preview */}
      <CameraPreview />

      {/* Overall Attention Status Card */}
      <AttentionStatusCard />

      {/* Gaze Compass & Looking Away Tracker */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <GazeCompass />
        <LookingAwayCard />
      </div>

      {/* Eye Tracking & Head Pose Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <EyeTrackingPanel />
        <HeadPosePanel />
      </div>

      {/* Blink & Head Movement Monitors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <BlinkMonitor />
        <HeadMovementCard />
      </div>

      {/* Attention Timeline Log */}
      <AttentionTimeline />

      {/* Next Stage Navigation Footer */}
      {onProceedToModule5 && (
        <div style={{ textAlign: 'right', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={onProceedToModule5}
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
            Proceed to Module 5: Object & Secondary Device Detection →
          </button>
        </div>
      )}
    </div>
  );
};

export const AttentionEngine: React.FC<AttentionEngineProps> = (props) => {
  return (
    <CameraProvider autoStart={true}>
      <AttentionProvider autoStart={props.autoStart}>
        <AttentionEngineContent onProceedToModule5={props.onProceedToModule5} />
      </AttentionProvider>
    </CameraProvider>
  );
};
