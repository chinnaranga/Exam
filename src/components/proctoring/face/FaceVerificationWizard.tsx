import React, { useState } from 'react';
import { useFace } from './hooks/useFace';
import { FaceVerificationRecord } from './types/face.types';

export interface FaceVerificationWizardProps {
  candidateId?: string;
  onVerificationComplete?: (record: FaceVerificationRecord) => void;
}

export const FaceVerificationWizard: React.FC<FaceVerificationWizardProps> = ({
  candidateId = 'cand_student_2026',
  onVerificationComplete,
}) => {
  const { captureReferenceSnapshot, runVerification, primaryFace, faceCount } = useFace();
  const [step, setStep] = useState<number>(1);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [resultRecord, setResultRecord] = useState<FaceVerificationRecord | null>(null);

  const handleStartWizard = async () => {
    setIsVerifying(true);
    setStep(1);

    // Step 1: Position check
    await new Promise((r) => setTimeout(r, 600));

    // Step 2: Capture reference
    setStep(2);
    await captureReferenceSnapshot(candidateId);
    await new Promise((r) => setTimeout(r, 600));

    // Step 3: Run feature match
    setStep(3);
    await new Promise((r) => setTimeout(r, 600));

    // Step 4: Verification result output
    const rec = runVerification('initial_pre_exam');
    setResultRecord(rec);
    setStep(4);
    setIsVerifying(false);

    if (onVerificationComplete) {
      onVerificationComplete(rec);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a', fontWeight: 700 }}>
          Pre-Exam Biometric Face Verification Wizard
        </h4>
        <button
          type="button"
          onClick={handleStartWizard}
          disabled={isVerifying || faceCount !== 1}
          style={{
            backgroundColor: isVerifying || faceCount !== 1 ? '#cbd5e1' : '#0284c7',
            color: '#ffffff',
            border: 'none',
            padding: '0.45rem 1rem',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: isVerifying || faceCount !== 1 ? 'not-allowed' : 'pointer',
          }}
        >
          {isVerifying ? 'Verifying Identity...' : 'Run Face Verification'}
        </button>
      </div>

      {/* Steps Indicator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {[
          { num: 1, label: 'Position Alignment' },
          { num: 2, label: 'Reference Capture' },
          { num: 3, label: 'Feature Matching' },
          { num: 4, label: 'Identity Result' },
        ].map((s) => (
          <div
            key={s.num}
            style={{
              padding: '0.4rem',
              textAlign: 'center',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: step === s.num ? '#0284c7' : step > s.num ? '#dcfce7' : '#f1f5f9',
              color: step === s.num ? '#ffffff' : step > s.num ? '#15803d' : '#64748b',
              border: `1px solid ${step === s.num ? '#0284c7' : step > s.num ? '#bbf7d0' : '#e2e8f0'}`,
            }}
          >
            {s.num}. {s.label}
          </div>
        ))}
      </div>

      {/* Result Output */}
      {resultRecord && (
        <div
          style={{
            backgroundColor: resultRecord.status === 'verified' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${resultRecord.status === 'verified' ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '6px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '1.75rem' }}>{resultRecord.status === 'verified' ? '✓' : '✕'}</span>
          <div>
            <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: resultRecord.status === 'verified' ? '#166534' : '#991b1b' }}>
              Biometric Identity Verification: {resultRecord.status.toUpperCase()} ({resultRecord.similarityScore}% Match)
            </h5>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#475569' }}>
              Pre-examination biometric reference verification completed successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
