export type IntegritySeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IntegrityConfidence = 'LOW' | 'MEDIUM' | 'HIGH';

export interface IntegrityEventDetails {
  message: string;
  signalStrength?: number; // 0.0 to 1.0
  rawEventType?: string;
  explanation: string;
  limitationNote?: string;
  possibleFalsePositives?: string[];
  metadata?: Record<string, any>;
}

export interface IntegrityEvent {
  id: string;
  timestamp: string; // ISO 8601 string
  timestampMs: number;
  module: string;
  type: string;
  severity: IntegritySeverity;
  confidence: IntegrityConfidence;
  details: IntegrityEventDetails;
  sessionId?: string;
  candidateId?: string;
  examId?: string;
}

export interface EventFilterOptions {
  modules?: string[];
  severities?: IntegritySeverity[];
  confidences?: IntegrityConfidence[];
  startTimeMs?: number;
  endTimeMs?: number;
  searchQuery?: string;
}

export interface IntegritySummary {
  totalEvents: number;
  eventsBySeverity: Record<IntegritySeverity, number>;
  eventsByModule: Record<string, number>;
  activeSignalsCount: number;
  sessionDurationSeconds: number;
}
