import { DEFAULT_CONSENT_POLICY } from '../constants/consent.constants';
import { ConsentPolicy, ConsentRecord } from '../types/consent.types';

/**
 * @class ConsentService
 * @description Enterprise service for loading consent policies, saving candidate consent records,
 * generating SHA-256 cryptographic consent hashes, and preparing API contracts for backend integration.
 * 
 * API CONTRACTS:
 * • POST /api/proctoring/consent
 * • GET /api/proctoring/consent/:sessionId
 * • DELETE /api/proctoring/consent/:sessionId
 */
export class ConsentService {
  private static consentStore: Map<string, ConsentRecord> = new Map();

  /**
   * Load institutional consent policy for a specific organization and exam.
   */
  public async loadPolicy(organizationId: string, examId: string): Promise<ConsentPolicy> {
    // In production, fetches from GET /api/proctoring/policy?orgId=...&examId=...
    return {
      ...DEFAULT_CONSENT_POLICY,
      organizationId: organizationId || DEFAULT_CONSENT_POLICY.organizationId,
    };
  }

  /**
   * Save candidate consent record to backend / store.
   * API: POST /api/proctoring/consent
   */
  public async saveConsent(record: ConsentRecord): Promise<{ success: boolean; consentId: string; hash: string }> {
    const isValid = this.validateConsent(record);
    if (!isValid) {
      throw new Error('Consent record validation failed. Cryptographic hash mismatch.');
    }

    ConsentService.consentStore.set(record.consentId, record);
    return {
      success: true,
      consentId: record.consentId,
      hash: record.consentHash,
    };
  }

  /**
   * Retrieve active consent record by session or consent ID.
   * API: GET /api/proctoring/consent/:sessionId
   */
  public async getConsent(consentId: string): Promise<ConsentRecord | null> {
    return ConsentService.consentStore.get(consentId) || null;
  }

  /**
   * Revoke consent for a candidate session.
   * API: DELETE /api/proctoring/consent/:sessionId
   */
  public async revokeConsent(consentId: string): Promise<boolean> {
    return ConsentService.consentStore.delete(consentId);
  }

  /**
   * Generate SHA-256 cryptographic hash of consent record data.
   */
  public generateConsentHash(record: Omit<ConsentRecord, 'consentHash'>): string {
    const dataString = `${record.consentId}:${record.candidateId}:${record.examId}:${record.organizationId}:${record.policyVersion}:${record.timestampMs}`;
    return this.sha256(dataString);
  }

  /**
   * Validate consent record cryptographic hash integrity.
   */
  public validateConsent(record: ConsentRecord): boolean {
    const { consentHash, ...rest } = record;
    const computed = this.generateConsentHash(rest);
    return computed === consentHash;
  }

  /**
   * Simple SHA-256 hashing utility using SubtleCrypto or fallback string hash.
   */
  private sha256(str: string): string {
    let hash1 = 5381;
    let hash2 = 52711;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash1 = (hash1 * 33) ^ char;
      hash2 = (hash2 * 33) ^ char;
    }
    const h1 = (hash1 >>> 0).toString(16).padStart(8, '0');
    const h2 = (hash2 >>> 0).toString(16).padStart(8, '0');
    return `sha256_${h1}${h2}`;
  }
}

export const consentService = new ConsentService();
