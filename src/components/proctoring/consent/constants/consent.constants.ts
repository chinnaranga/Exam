import { ConsentPolicy } from '../types/consent.types';

export const DEFAULT_CONSENT_POLICY: ConsentPolicy = {
  version: '2026.1.0-ENTERPRISE',
  effectiveDate: '2026-01-01',
  organizationId: 'org_enterprise_default',
  organizationName: 'Massachusetts Institute of Technology',
  retentionDays: 90,
  policyText: `
ASSESSIQ AI PROCTORING & EXAMINATION COMPLIANCE POLICY

1. PURPOSE & SCOPE
This Examination Compliance Policy governs the collection, processing, and retention of video, audio, and environmental integrity telemetry during online assessment sessions administered via AssessIQ.

2. PERMISSIONS & MONITORED CHANNELS
- Web Video: Used exclusively to confirm candidate presence and detect secondary screen/device usage.
- Web Audio: Used to detect environmental acoustic anomalies.
- Fullscreen Enforcement: Ensures candidate remains focused on the active examination window.

3. PRIVACY GUARANTEES & WHAT IS NOT COLLECTED
AssessIQ strictly enforces candidate privacy boundaries:
- NO passwords, typed keystrokes, personal files, browser search history, or cookies are captured.
- NO automatic failure decisions are ever made by AI algorithms.
- All risk assessments are non-conclusive evidence presented to human reviewers.

4. DATA STORAGE & RETENTION
All integrity metadata is encrypted in transit (TLS 1.3) and at rest (AES-256). In accordance with institutional policy, all session evidence will be automatically purged after 90 days.

5. CANDIDATE RIGHTS
Candidates maintain the right to review flagged session timelines and submit formal appeals with supporting statements to institutional proctors.
`.trim(),
  rules: [
    {
      id: 'rule_cam',
      title: 'Camera Monitoring Required',
      description: 'Webcam feed must remain active throughout the examination.',
      isRequired: true,
    },
    {
      id: 'rule_mic',
      title: 'Microphone Monitoring Required',
      description: 'Acoustic environment monitoring for speech or secondary audio devices.',
      isRequired: true,
    },
    {
      id: 'rule_fs',
      title: 'Fullscreen Lockdown Enabled',
      description: 'Window must remain in fullscreen mode during active testing.',
      isRequired: true,
    },
    {
      id: 'rule_no_autofail',
      title: 'No Automatic Failure',
      description: 'AI algorithms do not fail candidates. Human review is strictly required.',
      isRequired: true,
    },
  ],
};

export const CHECKLIST_STATEMENTS = {
  understandCamera: 'I understand camera monitoring will confirm my identity and presence.',
  understandMicrophone: 'I understand microphone monitoring will analyze ambient audio.',
  understandAIVideo: 'I understand AI algorithms analyze video telemetry solely for risk indicators.',
  understandHumanReview: 'I understand all flagged integrity signals are reviewed by human proctors.',
  understandRetention: 'I understand my examination telemetry will be retained according to policy.',
  agreeExamRules: 'I agree to strictly abide by the examination rules and institutional policy.',
};
