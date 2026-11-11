import React from 'react';
import { ConsentCard } from './ConsentCard';

export const PrivacyNotice: React.FC = () => {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#475569' }}>
        AssessIQ operates under strict privacy and ethical proctoring guidelines. Please review how your examination telemetry will be processed.
      </p>

      {/* 1. Camera & Video Telemetry */}
      <ConsentCard title="1. Camera & Video Telemetry">
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
          Webcam telemetry is analyzed solely to confirm candidate identity, continuous presence, and monitor for secondary screens or secondary individuals.
        </p>
      </ConsentCard>

      {/* 2. Microphone & Audio Telemetry */}
      <ConsentCard title="2. Microphone & Audio Telemetry">
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
          Ambient acoustic levels are processed to flag speech or acoustic anomalies. Background ambient noise is discarded.
        </p>
      </ConsentCard>

      {/* 3. What AI Analyzes & Human Review */}
      <ConsentCard title="3. AI Telemetry Analysis & No Automatic Failures" variant="accent">
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.5 }}>
          <li>AI models calculate non-conclusive risk indicators.</li>
          <li><strong>No candidate is ever automatically failed by AI.</strong></li>
          <li>All integrity reports are subject to human review by institutional proctors.</li>
        </ul>
      </ConsentCard>

      {/* 4. What is NOT Collected */}
      <ConsentCard title="4. Strict Privacy Boundaries — What IS NOT Collected" variant="warning">
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#991b1b', lineHeight: 1.5 }}>
          <li>NO keystroke text logging or password recording.</li>
          <li>NO access to personal files, hard drives, or desktop documents.</li>
          <li>NO web browsing history, search history, or cookies collection.</li>
        </ul>
      </ConsentCard>

      {/* 5. Data Encryption, Retention & Candidate Rights */}
      <ConsentCard title="5. Data Encryption & 90-Day Purge Policy">
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
          Telemetry metadata is encrypted at rest using <strong>AES-256</strong> and in transit using <strong>TLS 1.3</strong>.
          Session data is retained for <strong>90 days</strong> according to institutional compliance policies, after which it is permanently purged. Candidates maintain full rights to appeal flagged events.
        </p>
      </ConsentCard>
    </div>
  );
};
