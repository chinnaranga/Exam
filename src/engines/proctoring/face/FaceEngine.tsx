import React from 'react';
import { CameraProvider } from '../camera/CameraContext';
import { FaceProvider, useFaceContext } from './FaceContext';
import { FaceBoundingBox } from './FaceBoundingBox';
import { FaceStatus } from './FaceStatus';
import { MultipleFaceAlert } from './MultipleFaceAlert';
import { FacePresenceCard } from './FacePresenceCard';
import { FaceQualityCard } from './FaceQualityCard';
import { VerificationHistory } from './VerificationHistory';
import { FaceDetectionPanel } from './FaceDetectionPanel';
import { FaceVerificationWizard } from './FaceVerificationWizard';
import { CameraPreview } from '../camera/CameraPreview';
import { FaceVerificationRecord } from './types/face.types';

export interface FaceEngineProps {
  candidateId?: string;
  autoStart?: boolean;
  onVerificationComplete?: (record: FaceVerificationRecord) => void;
  onProceedToModule4?: () => void;
}

const FaceEngineContent: React.FC<{
  onVerificationComplete?: (record: FaceVerificationRecord) => void;
  onProceedToModule4?: () => void;
}> = ({ onVerificationComplete, onProceedToModule4 }) => {
  const { primaryFace, presenceStatus, faceCount } = useFaceContext();

  const faces = primaryFace ? [primaryFace] : [];

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a', maxWidth: '840px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0284c7', fontWeight: 700 }}>
            Module 3: Face Detection & Identity Foundation
          </h2>
          <FaceStatus presenceStatus={presenceStatus} faceCount={faceCount} />
        </div>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
          Real-time 5–10 FPS face presence detection, quality evaluation, multiple face alerts, and biometric identity verification.
        </p>
      </div>

      {/* Multiple Face Alert */}
      <MultipleFaceAlert />

      {/* Main Camera Preview with SVG Face Bounding Box Overlay */}
      <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
        <CameraPreview />
        <FaceBoundingBox faces={faces} />
      </div>

      {/* Biometric Face Verification Wizard */}
      <FaceVerificationWizard onVerificationComplete={onVerificationComplete} />

      {/* Presence & Quality Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <FacePresenceCard />
        <FaceQualityCard />
      </div>

      {/* Verification History Log */}
      <VerificationHistory />

      {/* Diagnostics Panel */}
      <FaceDetectionPanel />

      {/* Next Stage Navigation Footer */}
      {onProceedToModule4 && (
        <div style={{ textAlign: 'right', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={onProceedToModule4}
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
            Proceed to Module 4: Eye Tracking & Gaze Analysis →
          </button>
        </div>
      )}
    </div>
  );
};

export const FaceEngine: React.FC<FaceEngineProps> = (props) => {
  return (
    <CameraProvider autoStart={true}>
      <FaceProvider candidateId={props.candidateId} autoStart={props.autoStart}>
        <FaceEngineContent
          onVerificationComplete={props.onVerificationComplete}
          onProceedToModule4={props.onProceedToModule4}
        />
      </FaceProvider>
    </CameraProvider>
  );
};
