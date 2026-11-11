export type PermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export type ConsentStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface PermissionStatus {
  camera: PermissionState;
  microphone: PermissionState;
  notifications: PermissionState;
  fullscreen: PermissionState;
}

export interface ConsentPolicyRule {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
}

export interface ConsentPolicy {
  version: string;
  effectiveDate: string;
  organizationId: string;
  organizationName: string;
  organizationLogoUrl?: string;
  retentionDays: number;
  policyText: string;
  rules: ConsentPolicyRule[];
}

export interface ConsentChecklistState {
  understandCamera: boolean;
  understandMicrophone: boolean;
  understandAIVideo: boolean;
  understandHumanReview: boolean;
  understandRetention: boolean;
  agreeExamRules: boolean;
}

export interface ConsentRecord {
  consentId: string;
  consentHash: string;
  candidateId: string;
  candidateName: string;
  examId: string;
  examName: string;
  organizationId: string;
  organizationName: string;
  policyVersion: string;
  grantedPermissions: PermissionStatus;
  checklistConfirmed: ConsentChecklistState;
  timestamp: string;
  timestampMs: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface ConsentState {
  currentStep: ConsentStep;
  candidateId: string;
  candidateName: string;
  examId: string;
  examName: string;
  organizationId: string;
  organizationName: string;
  examDurationMinutes: number;
  policy: ConsentPolicy | null;
  permissions: PermissionStatus;
  hasScrolledPolicyToBottom: boolean;
  checklist: ConsentChecklistState;
  consentRecord: ConsentRecord | null;
  isCompleted: boolean;
  error: string | null;
}

export interface ConsentEvent {
  type: 'STEP_CHANGED' | 'PERMISSION_CHANGED' | 'POLICY_SCROLLED' | 'CHECKLIST_TOGGLED' | 'CONSENT_GRANTED' | 'CONSENT_REVOKED';
  step?: ConsentStep;
  permission?: keyof PermissionStatus;
  status?: PermissionState;
  timestamp: string;
}
