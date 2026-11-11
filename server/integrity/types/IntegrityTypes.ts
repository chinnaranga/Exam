export type ReviewStatus =
  | 'PENDING_REVIEW'
  | 'UNDER_REVIEW'
  | 'REQUIRES_ADDITIONAL_EVIDENCE'
  | 'CLEARED'
  | 'CONFIRMED_VIOLATION'
  | 'APPEALED'
  | 'CLOSED';

export interface IntegrityEventPayload {
  id: string;
  timestamp: string;
  timestampMs: number;
  module: string;
  type: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  details: {
    message: string;
    signalStrength?: number;
    explanation?: string;
    limitationNote?: string;
    possibleFalsePositives?: string[];
    metadata?: Record<string, any>;
  };
  sessionId?: string;
  candidateId?: string;
  examId?: string;
}

export interface BatchTelemetryRequest {
  signature?: string; // HMAC SHA-256 telemetry payload signature
  nonce?: string;
  timestampMs: number;
  sessionId: string;
  candidateId: string;
  examId: string;
  organizationId: string;
  events: IntegrityEventPayload[];
}

export interface SessionBaseline {
  sessionId: string;
  candidateId: string;
  medianTypingInterval: number; // ms between keystrokes
  medianPauseMs: number; // ms pause duration
  typingVariance: number; // standard deviation / variance
  backspaceRatio: number; // backspaces / total keystrokes
  focusRatio: number; // focused time / total session time
  mouseEntropy: number; // spatial randomness score 0.0 - 1.0
  clipboardFrequency: number; // copy/paste ops per minute
  sampleCount: number;
}

export interface RiskDimensionScore {
  dimension:
    | 'Focus Risk'
    | 'Typing Risk'
    | 'Clipboard Risk'
    | 'Browser Risk'
    | 'Device Risk'
    | 'Environment Risk'
    | 'Network Risk'
    | 'Overlay Risk'
    | 'Fullscreen Risk';
  score: number; // 0 to 100
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  evidenceCount: number;
  explanation: string;
  possibleFalsePositives: string[];
  limitations: string;
  evidenceSnippets: any[];
}

export interface IntegrityAssessmentResult {
  sessionId: string;
  candidateId: string;
  examId: string;
  organizationId: string;
  overallRiskScore: number; // 0 to 100
  policyVersion: string;
  dimensions: Record<string, RiskDimensionScore>;
  reviewStatus: ReviewStatus;
  calculatedAt: string;
}

export interface BehaviorTimelineEntry {
  timestamp: string;
  timestampMs: number;
  category: 'FOCUS' | 'TYPING' | 'CLIPBOARD' | 'MOUSE' | 'NETWORK' | 'ENVIRONMENT' | 'SCREEN';
  eventSummary: string;
  severity: string;
  details: Record<string, any>;
}

export interface BehaviorReport {
  sessionId: string;
  candidateId: string;
  timeline: BehaviorTimelineEntry[];
  trendGraphs: {
    focusContinuityOverTime: { timeSec: number; focusActive: boolean }[];
    typingCadenceOverTime: { timeSec: number; wpmEstimate: number }[];
    mouseEntropyOverTime: { timeSec: number; entropy: number }[];
  };
  deviationSummaries: {
    typingCadenceShift: boolean;
    focusLossFrequency: number;
    rapidPasteCount: number;
    unexpectedOverlayCount: number;
    networkDisconnectCount: number;
  };
}

export interface EvidencePackage {
  candidateId: string;
  examId: string;
  sessionId: string;
  organizationId: string;
  eventsCount: number;
  events: IntegrityEventPayload[];
  focusHistory: any[];
  clipboardHistory: any[];
  browserHistory: any[];
  environmentHistory: any[];
  networkHistory: any[];
  questionEvidences: Record<string, any[]>;
}

export interface IntegrityPolicyConfig {
  organizationId: string;
  version: string;
  weights: {
    focusRiskWeight: number;
    typingRiskWeight: number;
    clipboardRiskWeight: number;
    browserRiskWeight: number;
    deviceRiskWeight: number;
    environmentRiskWeight: number;
    networkRiskWeight: number;
    overlayRiskWeight: number;
    fullscreenRiskWeight: number;
  };
  thresholds: {
    highRiskScoreThreshold: number; // e.g. 70
    mediumRiskScoreThreshold: number; // e.g. 40
    maxFocusLossCountAllowed: number; // e.g. 3
    maxRapidPasteCountAllowed: number; // e.g. 2
  };
  enabledModules: string[];
  retentionDays: number;
}
