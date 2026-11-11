import { describe, it, expect, beforeEach } from 'vitest';
import { consentService } from '../services/consent.service';
import { DEFAULT_CONSENT_POLICY } from '../constants/consent.constants';

describe('Module 1: Consent Manager Test Suite', () => {
  const mockCandidate = {
    candidateId: 'cand_test_999',
    candidateName: 'Test Student',
    examId: 'exam_test_algo',
    examName: 'Algorithm Analysis Test',
    organizationId: 'org_test_mit',
    organizationName: 'MIT Engineering',
  };

  beforeEach(() => {
    // Reset service mock state if necessary
  });

  it('1. should load default or institutional consent policy', async () => {
    const policy = await consentService.loadPolicy(mockCandidate.organizationId, mockCandidate.examId);
    expect(policy).toBeDefined();
    expect(policy.rules.length).toBeGreaterThan(0);
    expect(policy.retentionDays).toBe(90);
  });

  it('2. should generate a valid SHA-256 cryptographic hash for consent record', () => {
    const recordData = {
      consentId: 'consent_1001',
      candidateId: mockCandidate.candidateId,
      candidateName: mockCandidate.candidateName,
      examId: mockCandidate.examId,
      examName: mockCandidate.examName,
      organizationId: mockCandidate.organizationId,
      organizationName: mockCandidate.organizationName,
      policyVersion: DEFAULT_CONSENT_POLICY.version,
      grantedPermissions: { camera: 'granted' as const, microphone: 'granted' as const, notifications: 'prompt' as const, fullscreen: 'granted' as const },
      checklistConfirmed: {
        understandCamera: true,
        understandMicrophone: true,
        understandAIVideo: true,
        understandHumanReview: true,
        understandRetention: true,
        agreeExamRules: true,
      },
      timestamp: new Date().toISOString(),
      timestampMs: Date.now(),
    };

    const hash = consentService.generateConsentHash(recordData);
    expect(hash).toBeDefined();
    expect(hash).toContain('sha256_');

    const fullRecord = { ...recordData, consentHash: hash };
    const isValid = consentService.validateConsent(fullRecord);
    expect(isValid).toBe(true);
  });

  it('3. should save consent record to store and reject tampered hashes', async () => {
    const recordData = {
      consentId: 'consent_1002',
      candidateId: mockCandidate.candidateId,
      candidateName: mockCandidate.candidateName,
      examId: mockCandidate.examId,
      examName: mockCandidate.examName,
      organizationId: mockCandidate.organizationId,
      organizationName: mockCandidate.organizationName,
      policyVersion: DEFAULT_CONSENT_POLICY.version,
      grantedPermissions: { camera: 'granted' as const, microphone: 'granted' as const, notifications: 'prompt' as const, fullscreen: 'granted' as const },
      checklistConfirmed: {
        understandCamera: true,
        understandMicrophone: true,
        understandAIVideo: true,
        understandHumanReview: true,
        understandRetention: true,
        agreeExamRules: true,
      },
      timestamp: new Date().toISOString(),
      timestampMs: Date.now(),
    };

    const validHash = consentService.generateConsentHash(recordData);
    const validRecord = { ...recordData, consentHash: validHash };

    const result = await consentService.saveConsent(validRecord);
    expect(result.success).toBe(true);
    expect(result.consentId).toBe('consent_1002');

    // Test tamper detection
    const tamperedRecord = { ...validRecord, candidateId: 'cand_hacked' };
    expect(() => consentService.validateConsent(tamperedRecord)).toBeDefined();
    expect(consentService.validateConsent(tamperedRecord)).toBe(false);
  });

  it('4. should retrieve saved consent by consent ID', async () => {
    const fetched = await consentService.getConsent('consent_1002');
    expect(fetched).toBeDefined();
    expect(fetched?.candidateName).toBe('Test Student');
  });

  it('5. should support consent revocation', async () => {
    const revoked = await consentService.revokeConsent('consent_1002');
    expect(revoked).toBe(true);

    const fetchedAfterRevoke = await consentService.getConsent('consent_1002');
    expect(fetchedAfterRevoke).toBeNull();
  });
});
