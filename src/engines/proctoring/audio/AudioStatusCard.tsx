import React from 'react';
import { useAudio } from './hooks/useAudio';

export const AudioStatusCard: React.FC = () => {
  const { health, voiceActivity } = useAudio();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>Audio System Status</h4>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            Microphone Quality Rating: <strong style={{ color: '#166534' }}>{health.qualityRating}</strong>
          </p>
        </div>
        <div>
          {voiceActivity.isVoiceDetected ? (
            <span style={{ backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
              🎙 VOICE ACTIVITY DETECTED
            </span>
          ) : (
            <span style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
              ● MICROPHONE ACTIVE (QUIET)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
