import { PipelinePolicyConfig } from '../types/pipeline.types';

export const DEFAULT_PIPELINE_POLICY: PipelinePolicyConfig = {
  policyVersion: 'v2026.1.0-default',
  cameraMandatory: true,
  eyeTrackingEnabled: true,
  phoneAllowed: false,
  calculatorAllowed: true,
  microphoneRequired: true,
  minObjectConfidence: 65,
  minDurationAlertMs: 2500,
  alertThreshold: 'Medium',
  evidenceCaptureEnabled: true,
};

export const PIPELINE_SAFETY_EXPLANATIONS = {
  NON_DISCIPLINARY: 'AssessIQ Integrity Signals provide objective, probabilistic observations for human proctor review. No candidate is ever automatically penalized or failed by this engine.',
  CORRELATION_RATIONALE: 'Event correlation clusters concurrent observations (e.g. lateral gaze shift combined with head rotation) to present clear context to human invigilators.',
  CONFIDENCE_CALCULATION: 'Confidence score represents sensor measurement stability, lighting quality, and model probability.',
};
