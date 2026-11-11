export type CaseStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'EVIDENCE_REQUESTED'
  | 'DECISION_PENDING'
  | 'CLEARED'
  | 'VIOLATION_CONFIRMED'
  | 'APPEALED'
  | 'CLOSED';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface LiveOpsMetrics {
  activeExamsCount: number;
  activeOrganizationsCount: number;
  candidatesOnlineCount: number;
  candidatesOfflineCount: number;
  examsPausedCount: number;
  networkIncidentsCount: number;
  highRiskSessionsCount: number;
  aiInferenceHealthPercent: number;
  queueLength: number;
  infrastructureHealthPercent: number;
  lastUpdated: string;
}

export interface CandidateSessionMonitorItem {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  organizationId: string;
  organizationName: string;
  examId: string;
  examTitle: string;
  timeRemainingSeconds: number;
  integrityDimensions: {
    focusRisk: number;
    typingRisk: number;
    clipboardRisk: number;
    browserRisk: number;
    deviceRisk: number;
    environmentRisk: number;
    networkRisk: number;
    overlayRisk: number;
    fullscreenRisk: number;
  };
  cameraHealth: 'HEALTHY' | 'DEGRADED' | 'FAILED' | 'DISABLED';
  browserHealth: 'HEALTHY' | 'DEVTOOLS_SUSPECTED' | 'OVERLAY_DETECTED';
  connectionQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'OFFLINE';
  status: 'ACTIVE' | 'PAUSED' | 'FLAGGED' | 'COMPLETED' | 'TERMINATED';
}

export interface ProctorActionRequest {
  action: 'WARNING' | 'PAUSE' | 'RESUME' | 'VERIFY_IDENTITY' | 'ESCALATE' | 'CHAT_MESSAGE';
  sessionId: string;
  proctorId: string;
  message?: string;
  metadata?: Record<string, any>;
}

export interface ReviewCase {
  caseId: string;
  sessionId: string;
  candidateId: string;
  candidateName: string;
  examId: string;
  organizationId: string;
  status: CaseStatus;
  assignedProctor?: string;
  riskScore: number;
  evidenceSummary: any;
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateAppeal {
  appealId: string;
  caseId: string;
  candidateId: string;
  statement: string;
  documentUrls: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REOPENED';
  reviewerNotes?: string;
  createdAt: string;
}

export interface AIEvidenceSummary {
  caseId: string;
  eventSummary: string;
  timelineSummary: string;
  riskExplanation: string;
  suggestedQuestions: string[];
  generatedAt: string;
}

export interface ComplianceRecord {
  id: string;
  organizationId: string;
  framework: 'GDPR' | 'FERPA' | 'BIPA' | 'ISO27001' | 'SOC2';
  requestType: 'CONSENT' | 'EXPORT' | 'RIGHT_TO_DELETION' | 'RETENTION_PURGE';
  targetId: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'REJECTED';
  details?: Record<string, any>;
  createdAt: string;
}

export interface AnalyticsSummary {
  examCompletionRate: number; // e.g. 96.5%
  integrityTrends: { date: string; avgRiskScore: number }[];
  organizationComparisons: { organizationName: string; sessionCount: number; flagRatePercent: number }[];
  questionAnalytics: { questionId: string; medianAnswerTimeSec: number; flagCount: number }[];
  proctorWorkload: { proctorId: string; casesReviewed: number; avgReviewTimeMin: number }[];
  falsePositiveRatePercent: number;
  appealsOutcomeRate: { approved: number; rejected: number; pending: number };
}

export interface OrgPolicy {
  organizationId: string;
  allowCopy: boolean;
  allowCalculator: boolean;
  requireFullscreen: boolean;
  enableAIProctoring: boolean;
  enableMicrophone: boolean;
  enableCamera: boolean;
  reviewScoreThreshold: number; // e.g. 60
  retentionDays: number;
}

export interface OperationsAlertItem {
  alertId: string;
  organizationId: string;
  severity: AlertSeverity;
  message: string;
  targetGroup: 'PROCTORS' | 'ADMINS' | 'OPERATIONS' | 'SUPPORT';
  isAcknowledged: boolean;
  createdAt: string;
}

export interface IncidentItem {
  incidentId: string;
  organizationId: string;
  type: 'NETWORK_OUTAGE' | 'CAMERA_FAILURE' | 'BROWSER_CRASH' | 'INFRASTRUCTURE' | 'POLICY_VIOLATION';
  severity: AlertSeverity;
  status: 'INVESTIGATING' | 'IDENTIFIED' | 'MONITORING' | 'RESOLVED';
  title: string;
  createdAt: string;
}

export interface SystemHealthMetrics {
  apiHealthPercent: number;
  queueHealthPercent: number;
  databaseHealthPercent: number;
  aiInferenceHealthPercent: number;
  workersActiveCount: number;
  storageUsagePercent: number;
  avgLatencyMs: number;
  lastChecked: string;
}

export interface DisasterRecoveryStatus {
  backupStatus: 'HEALTHY' | 'SYNCING' | 'ERROR';
  lastBackupTimestamp: string;
  replicationLagMs: number;
  failoverReady: boolean;
  serviceRestorationStatus: 'OPERATIONAL' | 'DEGRADED' | 'FAILOVER_ACTIVE';
}
