import React from 'react';
import { useFace } from './hooks/useFace';

export const VerificationHistory: React.FC = () => {
  const { verificationHistory, runVerification } = useFace();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
          Biometric Identity Verification Audit Log
        </h4>
        <button
          type="button"
          onClick={() => runVerification('manual_proctor_trigger')}
          style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
        >
          + Trigger Verification Check
        </button>
      </div>

      {verificationHistory.length === 0 ? (
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
          No verification checks conducted yet. Verification occurs before the exam, during random checks, or on manual trigger.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {verificationHistory.map((rec) => (
            <div key={rec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
              <div>
                <strong>Reason: {rec.reason.replace(/_/g, ' ').toUpperCase()}</strong>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{new Date(rec.timestamp).toLocaleTimeString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ backgroundColor: rec.status === 'verified' ? '#dcfce7' : '#fee2e2', color: rec.status === 'verified' ? '#15803d' : '#b91c1c', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
                  {rec.status.toUpperCase()} ({rec.similarityScore}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
