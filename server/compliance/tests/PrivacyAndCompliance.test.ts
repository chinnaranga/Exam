import { describe, it, expect, beforeEach } from 'vitest';
import { ConsentService } from '../ConsentService';
import { RetentionPolicyService } from '../RetentionPolicyService';
import { DataSubjectRequestService } from '../DataSubjectRequestService';
import { TenantEncryptionService } from '../TenantEncryptionService';
import { EvidenceAccessControlService } from '../EvidenceAccessControlService';
import { DpiaDataInventoryService } from '../DpiaDataInventoryService';

describe('AssessIQ Privacy, Compliance & Data Governance Platform', () => {
  let consentService: ConsentService;
  let retentionService: RetentionPolicyService;
  let dsrService: DataSubjectRequestService;
  let encryptionService: TenantEncryptionService;
  let accessControlService: EvidenceAccessControlService;
  let dpiaService: DpiaDataInventoryService;

  beforeEach(() => {
    consentService = new ConsentService();
    retentionService = new RetentionPolicyService();
    dsrService = new DataSubjectRequestService(consentService, retentionService);
    encryptionService = new TenantEncryptionService();
    accessControlService = new EvidenceAccessControlService();
    dpiaService = new DpiaDataInventoryService();
  });

  // =========================================================================
  // 1. Retention Policy & Scheduled Cryptographic Deletion
  // =========================================================================
  describe('1. Retention Policy & Scheduled Cryptographic Purge', () => {
    it('deletes expired evidence items per configurable retention period and writes a deletion record', () => {
      const now = Date.now();
      const tenantId = 'tenant_stanford_cs';

      // Configure retention: Clips (14 days), Snapshots (30 days), ID Images (7 days)
      retentionService.updateRetentionPolicy({
        tenantId,
        retentionDays: {
          EVIDENCE_CLIPS: 14,
          SNAPSHOTS: 30,
          ID_IMAGES: 7,
          KEYSTROKE_TEMPLATES: 90,
          AUDIT_LEDGERS: 365,
        },
      });

      // 1. Store expired ID Image (created 10 days ago -> exceeds 7-day limit)
      const tenDaysAgo = now - 10 * 24 * 60 * 60 * 1000;
      const expiredId = retentionService.storeEvidenceItem({
        sessionId: 'sess_101',
        candidateId: 'cand_alice',
        tenantId,
        dataType: 'ID_IMAGES',
        payload: { imageBase64: 'data:image/jpeg;base64,...' },
        createdAt: tenDaysAgo,
      });

      // 2. Store active Snapshot (created 5 days ago -> within 30-day limit)
      const fiveDaysAgo = now - 5 * 24 * 60 * 60 * 1000;
      const activeSnapshot = retentionService.storeEvidenceItem({
        sessionId: 'sess_101',
        candidateId: 'cand_alice',
        tenantId,
        dataType: 'SNAPSHOTS',
        payload: { snapshotUrl: '/snapshots/snap_1.jpg' },
        createdAt: fiveDaysAgo,
      });

      // 3. Store expired Evidence Clip (created 20 days ago -> exceeds 14-day limit)
      const twentyDaysAgo = now - 20 * 24 * 60 * 60 * 1000;
      const expiredClip = retentionService.storeEvidenceItem({
        sessionId: 'sess_102',
        candidateId: 'cand_bob',
        tenantId,
        dataType: 'EVIDENCE_CLIPS',
        payload: { videoUrl: '/clips/flagged_clip.mp4' },
        createdAt: twentyDaysAgo,
      });

      // Execute scheduled retention purge
      const purgeResult = retentionService.executeScheduledRetentionPurge(now, tenantId);

      // Verify deletion stats
      expect(purgeResult.totalRecordsPurged).toBe(2);
      expect(purgeResult.deletionsByDataType.ID_IMAGES).toBe(1);
      expect(purgeResult.deletionsByDataType.EVIDENCE_CLIPS).toBe(1);
      expect(purgeResult.deletionsByDataType.SNAPSHOTS).toBe(0);

      // Verify items are sanitized and marked deleted
      const checkExpiredId = retentionService.getEvidenceItem(expiredId.id);
      expect(checkExpiredId).toBeUndefined(); // getEvidenceItem filters deleted items

      const checkActive = retentionService.getEvidenceItem(activeSnapshot.id);
      expect(checkActive).toBeDefined();
      expect(checkActive?.isDeleted).toBe(false);

      // Verify immutable cryptographic DeletionAuditRecord was committed
      expect(purgeResult.auditRecords.length).toBeGreaterThanOrEqual(2);
      const idAudit = purgeResult.auditRecords.find((r) => r.dataType === 'ID_IMAGES');
      expect(idAudit).toBeDefined();
      expect(idAudit?.recordsDeletedCount).toBe(1);
      expect(idAudit?.affectedSessionIds).toContain('sess_101');
      expect(idAudit?.deletionDigestHash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hash seal
      expect(idAudit?.executedBy).toBe('SYSTEM_CRON_RETENTION_JOB');
    });
  });

  // =========================================================================
  // 2. Role-Based Access Control & Evidence View Logging
  // =========================================================================
  describe('2. Role-Based Access Control & Evidence View Logging', () => {
    it('allows reviewers to view evidence strictly for assigned cases and logs the access', () => {
      const reviewerId = 'reviewer_patel';
      const assignedCaseId = 'case_viol_404';
      const unassignedCaseId = 'case_viol_999';

      accessControlService.setUserGrant({
        userId: reviewerId,
        role: 'REVIEWER',
        tenantId: 'default_tenant',
        assignedCaseIds: [assignedCaseId],
      });

      // 1. Authorized access to assigned case
      const authAccess = accessControlService.logAndVerifyEvidenceView({
        viewerId: reviewerId,
        caseId: assignedCaseId,
        sessionId: 'sess_exam_2026',
        reason: 'Reviewing gaze variance anomaly',
        ipAddress: '192.168.1.50',
      });

      expect(authAccess.allowed).toBe(true);
      expect(authAccess.log.role).toBe('REVIEWER');
      expect(authAccess.log.accessGranted).toBe(true);

      // 2. Unauthorized attempt to view unassigned case -> MUST be blocked and logged
      expect(() => {
        accessControlService.logAndVerifyEvidenceView({
          viewerId: reviewerId,
          caseId: unassignedCaseId,
          sessionId: 'sess_other_exam',
          reason: 'Curious browsing',
        });
      }).toThrow(/not assigned to reviewer/i);

      // Verify that the blocked attempt is recorded in the immutable audit log
      const logs = accessControlService.getAccessLogs({ caseId: unassignedCaseId });
      expect(logs).toHaveLength(1);
      expect(logs[0].accessGranted).toBe(false);
      expect(logs[0].denialReason).toContain('not assigned to reviewer');
      expect(logs[0].viewerId).toBe(reviewerId);
    });

    it('grants global access to Admin and Chief Proctor but blocks Candidates from raw evidence', () => {
      accessControlService.setUserGrant({
        userId: 'admin_root',
        role: 'ADMIN',
        tenantId: 'default_tenant',
      });

      accessControlService.setUserGrant({
        userId: 'cand_charlie',
        role: 'CANDIDATE',
        tenantId: 'default_tenant',
      });

      // Admin access granted to any case
      const adminAccess = accessControlService.logAndVerifyEvidenceView({
        viewerId: 'admin_root',
        caseId: 'any_case_id',
        sessionId: 'any_session_id',
        reason: 'Statutory compliance audit',
      });
      expect(adminAccess.allowed).toBe(true);

      // Candidate viewing another candidate's evidence -> blocked
      expect(() => {
        accessControlService.logAndVerifyEvidenceView({
          viewerId: 'cand_charlie',
          caseId: 'case_other_candidate',
          sessionId: 'sess_other',
          sessionCandidateId: 'cand_different_person',
          reason: 'Attempting to inspect peer evidence',
        });
      }).toThrow(/restricted from viewing raw proctoring evidence/i);
    });
  });

  // =========================================================================
  // 3. Versioned Consent & Institutional Alternative Process
  // =========================================================================
  describe('3. Versioned Consent & Alternative Accommodations', () => {
    it('records versioned consent with cryptographic signature and validates active consent', () => {
      const record = consentService.recordConsent({
        candidateId: 'cand_david',
        sessionId: 'sess_valid_consent',
        examId: 'cs501_final',
        tenantId: 'tenant_mit',
        consentedCategories: {
          camera: true,
          microphone: true,
          biometrics: true,
          keystrokeData: true,
        },
      });

      expect(record.version).toBe('v2.2-compliance-2026');
      expect(record.signatureHash).toBeDefined();

      const verification = consentService.verifyCandidateConsent('sess_valid_consent');
      expect(verification.hasValidConsent).toBe(true);
      expect(verification.allMandatoryConsented).toBe(true);
      expect(verification.missingCategories).toHaveLength(0);
    });

    it('blocks exam when mandatory consent is declined and offers institutional alternative', () => {
      // Candidate consents to camera and microphone, but declines biometrics
      consentService.recordConsent({
        candidateId: 'cand_elena',
        sessionId: 'sess_declined_consent',
        examId: 'cs501_final',
        tenantId: 'tenant_mit',
        consentedCategories: {
          camera: true,
          microphone: true,
          biometrics: false, // Mandatory category declined!
          keystrokeData: false,
        },
      });

      const verification = consentService.verifyCandidateConsent('sess_declined_consent');
      expect(verification.hasValidConsent).toBe(false);
      expect(verification.allMandatoryConsented).toBe(false);
      expect(verification.missingCategories).toContain('biometrics');
      expect(verification.missingCategories).toContain('keystrokeData');

      // Alternative process is offered
      expect(verification.alternativeProcess).toBeDefined();
      expect(verification.alternativeProcess?.offered).toBe(true);
      expect(verification.alternativeProcess?.type).toBe('IN_PERSON_PROCTORED_LAB');
      expect(verification.alternativeProcess?.contactEmail).toBe('testing-accommodations@institution.edu');
      expect(verification.reason).toContain('Mandatory consent was declined');
    });

    it('handles consent revocation mid-session', () => {
      consentService.recordConsent({
        candidateId: 'cand_frank',
        sessionId: 'sess_revoked',
        examId: 'cs501_final',
        tenantId: 'tenant_mit',
        consentedCategories: {
          camera: true,
          microphone: true,
          biometrics: true,
          keystrokeData: true,
        },
      });

      consentService.revokeConsent('sess_revoked', 'Candidate elected to withdraw from proctoring');

      const verification = consentService.verifyCandidateConsent('sess_revoked');
      expect(verification.hasValidConsent).toBe(false);
      expect(verification.reason).toContain('revoked');
    });
  });

  // =========================================================================
  // 4. Data Subject Requests (DSR) & Statutory SLA Deadlines
  // =========================================================================
  describe('4. Data Subject Requests (DSR / GDPR / FERPA)', () => {
    it('creates DSR with 30-day statutory SLA deadline and tracks approaching deadlines', () => {
      const now = Date.now();
      const request = dsrService.submitRequest({
        candidateId: 'cand_grace',
        candidateEmail: 'grace@university.edu',
        tenantId: 'tenant_oxford',
        type: 'ACCESS',
        details: 'Requesting full export of proctoring telemetry and assessment scores.',
        nowMs: now,
      });

      expect(request.status).toBe('SUBMITTED');
      expect(request.slaDeadline).toBe(now + 30 * 24 * 60 * 60 * 1000);

      const slaStatus = dsrService.getRequestSlaStatus(request.requestId, now);
      expect(slaStatus.daysRemaining).toBe(30);
      expect(slaStatus.isOverdue).toBe(false);
      expect(slaStatus.isApproachingDeadline).toBe(false);

      // 26 days later (4 days remaining) -> should flag isApproachingDeadline
      const nearDeadline = now + 26 * 24 * 60 * 60 * 1000;
      const nearStatus = dsrService.getRequestSlaStatus(request.requestId, nearDeadline);
      expect(nearStatus.daysRemaining).toBe(4);
      expect(nearStatus.isApproachingDeadline).toBe(true);
      expect(nearStatus.isOverdue).toBe(false);

      // 32 days later (exceeded 30 days) -> should flag isOverdue
      const overdueTime = now + 32 * 24 * 60 * 60 * 1000;
      const overdueStatus = dsrService.getRequestSlaStatus(request.requestId, overdueTime);
      expect(overdueStatus.isOverdue).toBe(true);
    });

    it('fulfills ACCESS request by generating complete verified GDPR export bundle', () => {
      // Record prior consent
      consentService.recordConsent({
        candidateId: 'cand_helen',
        sessionId: 'sess_prev_01',
        examId: 'cs101',
        tenantId: 'tenant_oxford',
        consentedCategories: { camera: true, microphone: true, biometrics: true, keystrokeData: true },
      });

      const request = dsrService.submitRequest({
        candidateId: 'cand_helen',
        candidateEmail: 'helen@oxford.ac.uk',
        tenantId: 'tenant_oxford',
        type: 'ACCESS',
        details: 'Export all personal data',
      });

      const fulfillment = dsrService.fulfillRequest({
        requestId: request.requestId,
        executedBy: 'dpo_compliance_officer',
      });

      expect(fulfillment.request.status).toBe('COMPLETED');
      expect(fulfillment.exportBundle).toBeDefined();
      expect(fulfillment.exportBundle?.candidateId).toBe('cand_helen');
      expect(fulfillment.exportBundle?.consentHistory).toHaveLength(1);
      expect(fulfillment.exportBundle?.verificationHash).toBeDefined();
    });
  });

  // =========================================================================
  // 5. Per-Tenant Encryption at Rest & Key Rotation
  // =========================================================================
  describe('5. Per-Tenant Encryption at Rest & Key Rotation', () => {
    it('encrypts data at rest with AES-256-GCM and decrypts accurately', () => {
      const tenantId = 'tenant_caltech';
      const secretBiometricSnapshot = 'BIOMETRIC_EMBEDDING_VECTOR_[0.823,-0.119,0.442]';

      const encrypted = encryptionService.encryptAtRest(secretBiometricSnapshot, tenantId);
      expect(encrypted.keyVersion).toBe(1);
      expect(encrypted.iv).toHaveLength(24); // 12 bytes in hex = 24 chars
      expect(encrypted.authTag).toHaveLength(32); // 16 bytes in hex = 32 chars
      expect(encrypted.cipherText).not.toBe(secretBiometricSnapshot);

      const decrypted = encryptionService.decryptAtRest(encrypted);
      expect(decrypted).toBe(secretBiometricSnapshot);
    });

    it('rotates tenant encryption key to version 2 while preserving historical decryption', () => {
      const tenantId = 'tenant_eth_zurich';
      const originalText = 'CONFIDENTIAL_EXAM_INTEGRITY_LEDGER_DATA';

      // Encrypt with Version 1 key
      const payloadV1 = encryptionService.encryptAtRest(originalText, tenantId);
      expect(payloadV1.keyVersion).toBe(1);

      // Rotate key to Version 2
      const rotation = encryptionService.rotateTenantKey(tenantId, 'security_admin_hans');
      expect(rotation.fromVersion).toBe(1);
      expect(rotation.toVersion).toBe(2);
      expect(rotation.status).toBe('COMPLETED');

      // Subsequent encryption uses Version 2 key
      const payloadV2 = encryptionService.encryptAtRest(originalText, tenantId);
      expect(payloadV2.keyVersion).toBe(2);

      // Decryption of BOTH Version 1 and Version 2 payloads succeeds seamlessly
      expect(encryptionService.decryptAtRest(payloadV1)).toBe(originalText);
      expect(encryptionService.decryptAtRest(payloadV2)).toBe(originalText);

      // Key rotation documentation is accessible for auditors
      const doc = encryptionService.getKeyRotationDocumentation();
      expect(doc.algorithm).toContain('AES-256-GCM');
      expect(doc.backwardCompatibility).toContain('Dual-key keyring retention');
    });
  });

  // =========================================================================
  // 6. DPIA Data Inventory & Plain-Language Privacy Architecture
  // =========================================================================
  describe('6. DPIA Data Inventory & Privacy Transparency', () => {
    it('generates DPIA data inventory distinguishing browser-local Wasm vs server-encrypted data', () => {
      const report = dpiaService.generateDpiaReport({
        institutionName: 'Technical University of Munich',
      });

      expect(report.institutionName).toBe('Technical University of Munich');
      expect(report.elements.length).toBeGreaterThanOrEqual(6);

      // Plain language breakdown
      const local = report.plainLanguageSummary.processedLocallyInBrowser;
      const server = report.plainLanguageSummary.sentToServerEncrypted;
      const never = report.plainLanguageSummary.neverCollectedOrStored;

      expect(local.some((item) => item.includes('Face Mesh') && item.includes('client RAM'))).toBe(true);
      expect(server.some((item) => item.includes('AES-256-GCM'))).toBe(true);
      expect(never.some((item) => item.includes('Full-motion continuous raw video'))).toBe(true);

      // Export to Markdown report
      const mdReport = dpiaService.exportDpiaMarkdown(report);
      expect(mdReport).toContain('# Data Protection Impact Assessment (DPIA)');
      expect(mdReport).toContain('Technical University of Munich');
      expect(mdReport).toContain('Real-Time Webcam Video');
      expect(mdReport).toContain('BROWSER_LOCAL_WASM');
    });
  });
});

