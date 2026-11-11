export type ConfidenceScore = 'Very Low' | 'Low' | 'Medium' | 'High';

export type AlertSeverity = 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';

export type RiskDimensionType =
  | 'Camera Health'
  | 'Attention'
  | 'Environment'
  | 'Objects'
  | 'Audio'
  | 'Browser Integrity'
  | 'Network Stability';

export interface UnifiedIntegrityEvent {
  eventId: string;
  sessionId: string;
  organizationId: string;
  candidateId: string;
  examId: string;
  module: string;
  eventType: string;
  severity: AlertSeverity;
  confidence: ConfidenceScore;
  timestamp: string;
  duration?: number;
  explanation: string;
  limitations: string;
  policyVersion: string;
  metadata: Record<string, any>;
  evidenceReference?: string;
  correlationId?: string;
}

export interface RiskDimensionScore {
  dimension: RiskDimensionType;
  score: number; // 0..100
  trend: 'Improving' | 'Stable' | 'Degrading';
  confidence: ConfidenceScore;
  explanation: string;
}

export interface PipelineAlert {
  alertId: string;
  sessionId: string;
  timestamp: string;
  severity: AlertSeverity;
  reason: string;
  confidence: ConfidenceScore;
  relatedEvents: string[];
  policyReference: string;
  suggestedAction: string;
}

export interface PipelinePolicyConfig {
  policyVersion: string;
  cameraMandatory: boolean;
  eyeTrackingEnabled: boolean;
  phoneAllowed: boolean;
  calculatorAllowed: boolean;
  microphoneRequired: boolean;
  minObjectConfidence: number; // 0..100
  minDurationAlertMs: number;
  alertThreshold: AlertSeverity;
  evidenceCaptureEnabled: boolean;
}

export interface SessionState {
  sessionId: string;
  candidateId: string;
  examId: string;
  organizationId: string;
  status: 'active' | 'paused' | 'completed';
  healthScore: number;
  latestConfidence: ConfidenceScore;
  riskDimensions: RiskDimensionScore[];
  activeAlerts: PipelineAlert[];
  totalEventsProcessed: number;
}
