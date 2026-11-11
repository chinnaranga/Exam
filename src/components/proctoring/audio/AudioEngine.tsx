import React from 'react';
import { AudioProvider } from './AudioContext';
import { AudioStatusCard } from './AudioStatusCard';
import { MicrophoneSelector } from './MicrophoneSelector';
import { AudioLevelMeter } from './AudioLevelMeter';
import { VoiceActivityPanel } from './VoiceActivityPanel';
import { BackgroundNoiseCard } from './BackgroundNoiseCard';
import { AudioHealthCard } from './AudioHealthCard';
import { AudioTimeline } from './AudioTimeline';
import { AudioPolicyConfig } from './types/audio.types';

export interface AudioEngineProps {
  autoStart?: boolean;
  initialPolicy?: Partial<AudioPolicyConfig>;
  onProceedToModule7?: () => void;
}

const AudioEngineContent: React.FC<{ onProceedToModule7?: () => void }> = ({ onProceedToModule7 }) => {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a', maxWidth: '840px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0284c7', fontWeight: 700 }}>
          Module 6: Enterprise Audio Monitoring & Background Audio Analysis
        </h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
          Real-time audio level RMS metering, spectral Voice Activity Detection (VAD), background noise classification, microphone health, and privacy guarantees.
        </p>
      </div>

      {/* Audio Status Card */}
      <AudioStatusCard />

      {/* Microphone Device Selection */}
      <MicrophoneSelector />

      {/* Real-time Level Meter */}
      <AudioLevelMeter />

      {/* Voice Activity & Noise Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <VoiceActivityPanel />
        <BackgroundNoiseCard />
      </div>

      {/* Audio Health Card */}
      <AudioHealthCard />

      {/* Audio Event Log Timeline */}
      <AudioTimeline />

      {/* Next Stage Navigation Footer */}
      {onProceedToModule7 && (
        <div style={{ textAlign: 'right', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={onProceedToModule7}
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
            Proceed to Module 7: Comprehensive AI Integrity Risk Engine →
          </button>
        </div>
      )}
    </div>
  );
};

export const AudioEngine: React.FC<AudioEngineProps> = (props) => {
  return (
    <AudioProvider autoStart={props.autoStart} initialPolicy={props.initialPolicy}>
      <AudioEngineContent onProceedToModule7={props.onProceedToModule7} />
    </AudioProvider>
  );
};
