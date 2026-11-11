import React, { useState } from 'react';
import { useCamera } from './hooks/useCamera';
import { CameraVerificationResult } from './types/camera.types';

export interface CameraVerificationWizardProps {
  onVerificationComplete?: (result: CameraVerificationResult) => void;
}

export const CameraVerificationWizard: React.FC<CameraVerificationWizardProps> = ({
  onVerificationComplete,
}) => {
  const { runVerification, verification, isStreaming, permission, requestPermission, startCamera } = useCamera();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleStartVerification = async () => {
    setIsRunning(true);
    setCurrentStep(1);

    if (permission !== 'granted') {
      const ok = await requestPermission();
      if (!ok) {
        setIsRunning(false);
        return;
      }
    }

    if (!isStreaming) {
      await startCamera();
    }

    // Step 2: Device selection
    setCurrentStep(2);
    await new Promise((r) => setTimeout(r, 600));

    // Step 3: Resolution & FPS test
    setCurrentStep(3);
    await new Promise((r) => setTimeout(r, 600));

    // Step 4: Stream stability check
    setCurrentStep(4);
    await new Promise((r) => setTimeout(r, 600));

    // Step 5: Finalize verification
    const res = runVerification();
    setCurrentStep(5);
    setIsRunning(false);

    if (onVerificationComplete) {
      onVerificationComplete(res);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a', fontWeight: 700 }}>
          Pre-Examination Webcam Verification Wizard
        </h4>
        <button
          type="button"
          onClick={handleStartVerification}
          disabled={isRunning}
          style={{
            backgroundColor: isRunning ? '#cbd5e1' : '#0284c7',
            color: '#ffffff',
            border: 'none',
            padding: '0.45rem 1rem',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: isRunning ? 'not-allowed' : 'pointer',
          }}
        >
          {isRunning ? 'Verifying Hardware...' : 'Run Camera Verification'}
        </button>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {[
          { num: 1, label: 'Permission' },
          { num: 2, label: 'Device Selection' },
          { num: 3, label: 'Resolution & FPS' },
          { num: 4, label: 'Stream Health' },
          { num: 5, label: 'Result Summary' },
        ].map((s) => (
          <div
            key={s.num}
            style={{
              padding: '0.4rem',
              textAlign: 'center',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: currentStep === s.num ? '#0284c7' : currentStep > s.num ? '#dcfce7' : '#f1f5f9',
              color: currentStep === s.num ? '#ffffff' : currentStep > s.num ? '#15803d' : '#64748b',
              border: `1px solid ${currentStep === s.num ? '#0284c7' : currentStep > s.num ? '#bbf7d0' : '#e2e8f0'}`,
            }}
          >
            {s.num}. {s.label}
          </div>
        ))}
      </div>

      {/* Verification Result Banner */}
      {verification && (
        <div
          style={{
            backgroundColor: verification.status === 'passed' ? '#f0fdf4' : verification.status === 'warning' ? '#fffbeb' : '#fef2f2',
            border: `1px solid ${verification.status === 'passed' ? '#bbf7d0' : verification.status === 'warning' ? '#fde68a' : '#fecaca'}`,
            borderRadius: '6px',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>
              {verification.status === 'passed' ? '✓' : verification.status === 'warning' ? '⚠' : '✕'}
            </span>
            <div>
              <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: verification.status === 'passed' ? '#166534' : verification.status === 'warning' ? '#b45309' : '#991b1b' }}>
                Camera Verification Status: {verification.status.toUpperCase()} (Score: {verification.score}/100)
              </h5>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#475569' }}>
                Verified at: {new Date(verification.verifiedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {verification.issues.length > 0 && (
            <ul style={{ margin: '0.75rem 0 0 0', paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#b91c1c' }}>
              {verification.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
