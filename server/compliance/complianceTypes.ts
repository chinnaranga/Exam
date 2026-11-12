/**
 * Privacy, Compliance & Data Governance Types for AssessIQ
 * Compliant with GDPR (Arts. 6, 9, 15, 16, 17, 35) and FERPA.
 */

// ─── 1. Versioned Consent ───────────────────────────────────────────────────

export type ConsentCategory =
  | 'camera'
  | 'microphone'
  | 'biometrics'
  | 'keystrokeData'
  | 'roomScan'
  | 'phoneCamera';

export interface ConsentVersionConfig {
  version: string; // e.g. "v2.2-compliance-2026"
  publishedAt: number;
  mandatoryCategories: ConsentCategory[];
  summaryText: string;
  categoryDescriptions: Record<ConsentCategory, string>;
  institutionAlternativeProcess: InstitutionAlternativeProcess;
}

export interface InstitutionAlternativeProcess {
  offered: boolean;
  type: 'IN_PERSON_PROCTORED_LAB' | 'HUMAN_INVIGILATOR_1ON1' | 'PAPER_EQUIVALENT' | 'CONTACT_DEPT';
  description: string;
  instructions: string;
  contactEmail: string;
  contactPhone?: string;
  facilityLocation?: string;
}

export interface ConsentRecord {
  consentId: string;
  candidateId: string;
  sessionId: string;
  examId: string;
  tenantId: string;
  version: string;
  consentedCategories: Record<ConsentCategory, boolean>;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
  signatureHash: string; // HMAC/SHA-256 of candidateId + version + categories + timestamp
  isRevoked?: boolean;
  revokedAt?: number;
}

export interface ConsentVerificationResult {
  hasValidConsent: boolean;
  allMandatoryConsented: boolean;
  missingCategories: ConsentCategory[];
  record?: ConsentRecord;
  alternativeProcess?: InstitutionAlternativeProcess;
  reason?: string;
}

// ─── 2. Retention Policy ───────────────────────────────────────────────────

export type RetentionDataType =
  | 'EVIDENCE_CLIPS'
  | 'SNAPSHOTS'
  | 'ID_IMAGES'
  | 'KEYSTROKE_TEMPLATES'
  | 'AUDIT_LEDGERS';

export interface RetentionPolicyConfig {
  tenantId: string;
  updatedAt: number;
  retentionDays: Record<RetentionDataType, number>;
  autoPurgeEnabled: boolean;
}

export interface DeletionAuditRecord {
  deletionId: string;
  tenantId: string;
  dataType: RetentionDataType;
  recordsDeletedCount: number;
  affectedSessionIds: string[];
  executedAt: number;
  retentionLimitDays: number;
  cutoffTimestamp: number;
  deletionDigestHash: string; // SHA-256 seal of the deletion operation
  executedBy: string; // e.g. "SYSTEM_CRON_RETENTION_JOB" or admin user ID
}

export interface RetentionPurgeJobResult {
  jobId: string;
  startedAt: number;
  completedAt: number;
  totalRecordsPurged: number;
  deletionsByDataType: Record<RetentionDataType, number>;
  auditRecords: DeletionAuditRecord[];
}

// ─── 3. Data Subject Requests (DSR) ────────────────────────────────────────

export type DsrType = 'ACCESS' | 'CORRECTION' | 'DELETION';

export type DsrStatus = 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'COMPLETED' | 'REJECTED';

export interface DataSubjectRequest {
  requestId: string;
  candidateId: string;
  candidateEmail: string;
  tenantId: string;
  type: DsrType;
  details: string; // Specific request or corrected fields
  requestedCorrectionFields?: Record<string, string>;
  status: DsrStatus;
  submittedAt: number;
  slaDeadline: number; // Exactly 30 days from submission (statutory requirement)
  reviewedBy?: string;
  reviewedAt?: number;
  completedAt?: number;
  rejectionReason?: string;
  adminNotes?: string;
  exportBundleUrl?: string; // Generated for ACCESS requests
}

export interface DsrExportBundle {
  candidateId: string;
  generatedAt: number;
  tenantId: string;
  personalProfile: Record<string, unknown>;
  consentHistory: ConsentRecord[];
  examSessionSummaries: Array<{
    sessionId: string;
    examId: string;
    completedAt: number;
    score: number;
    integrityStatus: string;
    transparentViolations: unknown[];
  }>;
  accessLogAuditCount: number;
  verificationHash: string;
}

// ─── 4. Tenant Encryption at Rest & Key Rotation ───────────────────────────

export interface TenantKeyMetadata {
  tenantId: string;
  currentKeyVersion: number;
  algorithm: 'AES-256-GCM';
  createdAt: number;
  lastRotatedAt?: number;
  rotationHistory: KeyRotationEvent[];
}

export interface KeyRotationEvent {
  rotationId: string;
  tenantId: string;
  fromVersion: number;
  toVersion: number;
  rotatedAt: number;
  rotatedBy: string;
  reEncryptCount: number;
  status: 'COMPLETED' | 'FAILED';
}

export interface EncryptedPayload {
  cipherText: string; // Base64
  iv: string; // Hex (12 bytes for GCM)
  authTag: string; // Hex (16 bytes for GCM)
  keyVersion: number;
  tenantId: string;
  encryptedAt: number;
}

// ─── 5. Access Control & Evidence View Logging ─────────────────────────────

export type ComplianceRole =
  | 'CANDIDATE'
  | 'INVIGILATOR'
  | 'REVIEWER'
  | 'CHIEF_PROCTOR'
  | 'ADMIN';

export interface EvidenceAccessGrant {
  userId: string;
  role: ComplianceRole;
  tenantId: string;
  assignedCaseIds: string[]; // For reviewers: strictly only assigned cases
}

export interface EvidenceViewLog {
  logId: string;
  viewerId: string;
  role: ComplianceRole;
  caseId: string;
  sessionId: string;
  accessedAt: number;
  ipAddress?: string;
  userAgent?: string;
  reason: string;
  accessGranted: boolean;
  denialReason?: string;
}

// ─── 6. DPIA Data Inventory ────────────────────────────────────────────────

export interface DpiaDataElement {
  id: string;
  dataCategory: string; // e.g. "Biometric Face Embedding", "Keystroke Cadence"
  dataFields: string[];
  purpose: string;
  lawfulBasis: 'CONSENT' | 'CONTRACT' | 'LEGAL_OBLIGATION' | 'LEGITIMATE_INTEREST';
  processingLocation: 'BROWSER_LOCAL_WASM' | 'SERVER_ENCRYPTED_AT_REST';
  storageLocation: string;
  encryptionMethod: string;
  retentionPeriod: string;
  disposalMethod: string;
  thirdPartySharing: 'NONE' | 'DISCLOSED';
}

export interface DpiaInventoryReport {
  institutionName: string;
  dpoContact: string;
  generatedAt: number;
  version: string;
  elements: DpiaDataElement[];
  plainLanguageSummary: {
    processedLocallyInBrowser: string[];
    sentToServerEncrypted: string[];
    neverCollectedOrStored: string[];
  };
}

