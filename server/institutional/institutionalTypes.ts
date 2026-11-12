/**
 * AssessIQ Institutional Integrations Types
 * Covers: SSO (SAML 2.0 & OIDC), LMS (LTI 1.3 & Grade Passback),
 * Scoped API Keys, Signed Webhooks, Multi-Channel Notifications,
 * Bulk Enrollment with Validation Reporting, and Multi-Tenant Branding/Isolation.
 */

export type SsoProtocol = 'SAML_2_0' | 'OIDC';
export type IdpProvider =
  | 'GOOGLE_WORKSPACE'
  | 'MICROSOFT_ENTRA'
  | 'INSTITUTIONAL_SAML'
  | 'OKTA'
  | 'GENERIC_OIDC';

export interface RoleMappingRule {
  id: string;
  claimKey: string; // e.g. "groups", "roles", "memberOf"
  matchType: 'EXACT' | 'CONTAINS' | 'REGEX';
  claimValue: string; // e.g. "Professors", "Invigilator_Pool", "student"
  assignedRole: 'STUDENT' | 'FACULTY' | 'INVIGILATOR' | 'ORG_ADMIN';
}

export interface SamlConfig {
  entityId: string;
  ssoUrl: string;
  certificate: string;
  signatureAlgorithm?: 'RSA_SHA256' | 'RSA_SHA512';
  allowUnsolicitedResponse?: boolean;
}

export interface OidcConfig {
  issuer: string;
  clientId: string;
  clientSecret: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userinfoEndpoint?: string;
  jwksUri: string;
}

export interface TenantSsoConfig {
  tenantId: string;
  isEnabled: boolean;
  protocol: SsoProtocol;
  provider: IdpProvider;
  samlConfig?: SamlConfig;
  oidcConfig?: OidcConfig;
  roleMappingRules: RoleMappingRule[];
  defaultRole: 'STUDENT' | 'FACULTY' | 'INVIGILATOR';
}

export interface SsoUserIdentity {
  idpUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  mappedRole: 'STUDENT' | 'FACULTY' | 'INVIGILATOR' | 'ORG_ADMIN';
  tenantId: string;
  rawClaims: Record<string, unknown>;
}

export type LmsPlatform = 'CANVAS' | 'MOODLE' | 'BLACKBOARD' | 'BRIGHTSPACE';

export interface LtiToolRegistration {
  id: string;
  tenantId: string;
  lmsPlatform: LmsPlatform;
  clientId: string;
  deploymentId: string;
  oidcAuthUrl: string;
  jwksUrl: string;
  issuer: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: number;
}

export interface LtiLaunchClaims {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  nonce: string;
  resourceLinkId: string;
  contextId: string;
  contextTitle: string;
  roles: string[];
  lineItemUrl?: string;
  targetLinkUri: string;
}

export interface LtiGradePassbackRequest {
  lineItemUrl: string;
  candidateId: string;
  scoreGiven: number;
  scoreMaximum: number;
  comment?: string;
  activityProgress: 'Initialized' | 'Started' | 'InProgress' | 'Submitted' | 'Completed';
  gradingProgress: 'FullyGraded' | 'PendingManual';
  timestamp: string;
}

export type ApiKeyScope =
  | 'exams:read'
  | 'exams:write'
  | 'enrollment:read'
  | 'enrollment:write'
  | 'results:read'
  | 'webhooks:manage';

export interface ApiKeyRecord {
  keyId: string;
  tenantId: string;
  name: string;
  keyPrefix: string; // e.g. "aki_live_3f92..."
  hashedSecret: string; // SHA-256 hash of the secret
  scopes: ApiKeyScope[];
  createdAt: number;
  expiresAt?: number;
  lastUsedAt?: number;
  isActive: boolean;
}

export type WebhookEventType =
  | 'exam.started'
  | 'exam.submitted'
  | 'session.flagged'
  | 'result.released';

export interface WebhookSubscription {
  id: string;
  tenantId: string;
  url: string;
  secret: string; // HMAC secret
  events: WebhookEventType[];
  isActive: boolean;
  createdAt: number;
  failureCount: number;
}

export interface SignedWebhookPayload {
  id: string;
  event: WebhookEventType;
  timestamp: number;
  tenantId: string;
  data: Record<string, unknown>;
}

export interface WebhookDeliveryResult {
  subscriptionId: string;
  status: 'SUCCESS' | 'FAILED';
  httpStatusCode?: number;
  signature: string;
  attemptNumber: number;
  durationMs: number;
  deliveredAt: number;
}

export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP';

export type NotificationEvent =
  | 'EXAM_SCHEDULED'
  | 'REMINDER_24H'
  | 'REMINDER_1H'
  | 'SUBMISSION_RECEIPT'
  | 'FLAG_DECISION'
  | 'APPEAL_UPDATE';

export interface NotificationTemplate {
  id: string;
  tenantId: string;
  event: NotificationEvent;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  isActive: boolean;
  variables: string[]; // e.g. ["candidateName", "examTitle", "scheduledTime"]
}

export interface NotificationDispatchLog {
  dispatchId: string;
  tenantId: string;
  candidateId: string;
  recipient: string;
  event: NotificationEvent;
  channel: NotificationChannel;
  formattedSubject?: string;
  formattedBody: string;
  dispatchedAt: number;
  status: 'DELIVERED' | 'FAILED';
}

export interface BulkEnrollmentRow {
  email: string;
  firstName: string;
  lastName: string;
  studentId: string;
  examId: string;
  accommodations?: string;
  section?: string;
}

export interface BulkEnrollmentError {
  rowNumber: number;
  field: string;
  value: string;
  error: string;
}

export interface BulkEnrollmentReport {
  batchId: string;
  tenantId: string;
  examId: string;
  totalRows: number;
  validCount: number;
  errorCount: number;
  enrolledCandidates: Array<{
    candidateId: string;
    studentId: string;
    email: string;
    name: string;
    accommodations: string[];
    section?: string;
  }>;
  errors: BulkEnrollmentError[];
  rejectedCsvData?: string;
}

export interface TenantBranding {
  institutionName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  subdomain: string;
  customDomain?: string;
  bannerMessage?: string;
}

export interface TenantInstitutionalProfile {
  tenantId: string;
  branding: TenantBranding;
  defaultSecurityProfile: string;
  retentionPolicyId: string;
  allowedEmailDomains: string[];
  ssoEnforced: boolean;
  activeLmsPlatforms: LmsPlatform[];
}

