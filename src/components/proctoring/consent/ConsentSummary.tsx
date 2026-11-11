import React from 'react';
import { useConsent } from './hooks/useConsent';
import { ConsentCard } from './ConsentCard';

export interface ConsentSummaryProps {
  onProceedToEnvironmentCheck?: () => void;
}

export const ConsentSummary: React.FC<ConsentSummaryProps> = ({ onProceedToEnvironmentCheck }) => {
  const { consentRecord } = useConsent();

  if (!consentRecord) {
    return null;
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
        <span style={{ fontSize: '1.75rem' }}>✓</span>
        <h3 style={{ margin: '0.25rem 0 0 0', color: '#166534', fontSize: '1.2rem', fontWeight: 700 }}>
          Consent Verification Completed & Signed
        </h3>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#15803d' }}>
          Your cryptographic consent record has been logged and verified by AssessIQ Enterprise Gateway.
        </p>
      </div>

      <ConsentCard title="Signed Consent Metadata">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: '#64748b' }}>Candidate Name:</span>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{consentRecord.candidateName}</div>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Candidate ID:</span>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{consentRecord.candidateId}</div>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Organization:</span>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{consentRecord.organizationName}</div>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Examination:</span>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{consentRecord.examName}</div>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Policy Version:</span>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{consentRecord.policyVersion}</div>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Timestamp:</span>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{new Date(consentRecord.timestamp).toLocaleString()}</div>
          </div>
        </div>
      </ConsentCard>

      {/* Cryptographic Hash Metadata Container */}
      <ConsentCard title="Cryptographic Proof & Integrity Hash" variant="accent">
        <div style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Consent Record ID:</span>
            <div style={{ fontWeight: 600, color: '#0284c7' }}>{consentRecord.consentId}</div>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>SHA-256 Consent Hash:</span>
            <div style={{ fontWeight: 600, color: '#0f172a', wordBreak: 'break-all', backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
              {consentRecord.consentHash}
            </div>
          </div>
        </div>
      </ConsentCard>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={onProceedToEnvironmentCheck}
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
          Proceed to Module 2: Environment Check →
        </button>
      </div>
    </div>
  );
};
