import React from 'react';
import { CameraProvider } from './CameraContext';
import { PermissionBanner } from './PermissionBanner';
import { CameraSelector } from './CameraSelector';
import { CameraPreview } from './CameraPreview';
import { CameraHealthCard } from './CameraHealthCard';
import { ResolutionCard } from './ResolutionCard';
import { DeviceInformation } from './DeviceInformation';
import { CameraVerificationWizard } from './CameraVerificationWizard';
import { CameraVerificationResult } from './types/camera.types';

export interface CameraManagerProps {
  autoStart?: boolean;
  onVerificationComplete?: (result: CameraVerificationResult) => void;
  onProceedToModule3?: () => void;
}

const CameraManagerContent: React.FC<{
  onVerificationComplete?: (result: CameraVerificationResult) => void;
  onProceedToModule3?: () => void;
}> = ({ onVerificationComplete, onProceedToModule3 }) => {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a', maxWidth: '840px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0284c7', fontWeight: 700 }}>
          Module 2: Camera Manager & Webcam Verification
        </h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
          WebRTC device discovery, video stream lifecycle, resolution validation, hardware health, and pre-exam verification.
        </p>
      </div>

      {/* Permission Handler */}
      <PermissionBanner />

      {/* Camera Selection */}
      <CameraSelector />

      {/* Main Video Preview Window */}
      <CameraPreview />

      {/* Verification Wizard */}
      <CameraVerificationWizard onVerificationComplete={onVerificationComplete} />

      {/* Real-time Hardware Metrics & Resolution Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <CameraHealthCard />
        <ResolutionCard />
      </div>

      {/* Technical Device Specs */}
      <DeviceInformation />

      {/* Next Stage Navigation Footer */}
      {onProceedToModule3 && (
        <div style={{ textAlign: 'right', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={onProceedToModule3}
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
            Proceed to Module 3: Face Detection →
          </button>
        </div>
      )}
    </div>
  );
};

export const CameraManager: React.FC<CameraManagerProps> = (props) => {
  return (
    <CameraProvider autoStart={props.autoStart}>
      <CameraManagerContent
        onVerificationComplete={props.onVerificationComplete}
        onProceedToModule3={props.onProceedToModule3}
      />
    </CameraProvider>
  );
};
