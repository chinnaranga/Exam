import * as crypto from 'crypto';
import {
  ApiKeyRecord,
  ApiKeyScope,
} from './institutionalTypes';

export class InstitutionalApiService {
  private apiKeys: Map<string, ApiKeyRecord> = new Map(); // keyId -> record
  private hashedSecretMap: Map<string, string> = new Map(); // hashedSecret -> keyId

  // Mock in-memory stores for API operations
  private examsStore: Map<string, any> = new Map();
  private enrollmentsStore: Map<string, any[]> = new Map(); // examId -> enrollments[]
  private resultsStore: Map<string, any[]> = new Map(); // examId -> results[]

  constructor() {
    // Seed default developer key
    const secret = 'aki_live_univ_secret_key_8829103948';
    const keyId = 'key_default_admin';
    const hashed = crypto.createHash('sha256').update(secret).digest('hex');

    const record: ApiKeyRecord = {
      keyId,
      tenantId: 'tenant_university_main',
      name: 'Default Canvas Integration Key',
      keyPrefix: 'aki_live_univ...',
      hashedSecret: hashed,
      scopes: [
        'exams:read',
        'exams:write',
        'enrollment:read',
        'enrollment:write',
        'results:read',
        'webhooks:manage',
      ],
      createdAt: Date.now(),
      isActive: true,
    };

    this.apiKeys.set(keyId, record);
    this.hashedSecretMap.set(hashed, keyId);
  }

  /**
   * Generates a new scoped API Key. Returns the raw secret once to the caller.
   */
  public generateApiKey(params: {
    tenantId: string;
    name: string;
    scopes: ApiKeyScope[];
    expiresInDays?: number;
  }): { keyRecord: ApiKeyRecord; rawSecretKey: string } {
    const randomHex = crypto.randomBytes(24).toString('hex');
    const rawSecretKey = `aki_live_${randomHex}`;
    const keyId = `key_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const hashedSecret = crypto.createHash('sha256').update(rawSecretKey).digest('hex');

    const expiresAt = params.expiresInDays
      ? Date.now() + params.expiresInDays * 86400 * 1000
      : undefined;

    const keyRecord: ApiKeyRecord = {
      keyId,
      tenantId: params.tenantId,
      name: params.name,
      keyPrefix: `${rawSecretKey.substring(0, 12)}...`,
      hashedSecret,
      scopes: params.scopes,
      createdAt: Date.now(),
      expiresAt,
      isActive: true,
    };

    this.apiKeys.set(keyId, keyRecord);
    this.hashedSecretMap.set(hashedSecret, keyId);

    return { keyRecord, rawSecretKey };
  }

  /**
   * Authenticates and authorizes an incoming API Key header.
   */
  public authenticateApiKey(
    rawApiKey: string,
    requiredScope: ApiKeyScope
  ): { isAuthenticated: boolean; tenantId?: string; error?: string } {
    if (!rawApiKey) {
      return { isAuthenticated: false, error: 'Missing X-API-Key header.' };
    }

    const hashedInput = crypto.createHash('sha256').update(rawApiKey.trim()).digest('hex');
    const keyId = this.hashedSecretMap.get(hashedInput);
    if (!keyId) {
      return { isAuthenticated: false, error: 'Invalid or unrecognized API Key.' };
    }

    const record = this.apiKeys.get(keyId);
    if (!record || !record.isActive) {
      return { isAuthenticated: false, error: 'API Key is revoked or inactive.' };
    }

    if (record.expiresAt && Date.now() > record.expiresAt) {
      return { isAuthenticated: false, error: 'API Key has expired.' };
    }

    if (!record.scopes.includes(requiredScope)) {
      return {
        isAuthenticated: false,
        error: `Insufficient permissions. Key lacks required scope: "${requiredScope}".`,
      };
    }

    record.lastUsedAt = Date.now();
    return { isAuthenticated: true, tenantId: record.tenantId };
  }

  // REST API: 1. Create Exam
  public apiCreateExam(rawApiKey: string, exam: { id: string; title: string; durationMinutes: number }): any {
    const auth = this.authenticateApiKey(rawApiKey, 'exams:write');
    if (!auth.isAuthenticated) throw new Error(auth.error);

    const fullExam = {
      ...exam,
      tenantId: auth.tenantId,
      createdAt: Date.now(),
      status: 'PUBLISHED',
    };
    this.examsStore.set(exam.id, fullExam);
    return fullExam;
  }

  // REST API: 2. Enroll Candidates
  public apiEnrollCandidate(
    rawApiKey: string,
    examId: string,
    candidate: { candidateId: string; email: string; name: string }
  ): any {
    const auth = this.authenticateApiKey(rawApiKey, 'enrollment:write');
    if (!auth.isAuthenticated) throw new Error(auth.error);

    const list = this.enrollmentsStore.get(examId) || [];
    const record = {
      ...candidate,
      examId,
      enrolledAt: Date.now(),
      tenantId: auth.tenantId,
    };
    list.push(record);
    this.enrollmentsStore.set(examId, list);
    return record;
  }

  // REST API: 3. Fetch Exam Results
  public apiFetchResults(rawApiKey: string, examId: string): any[] {
    const auth = this.authenticateApiKey(rawApiKey, 'results:read');
    if (!auth.isAuthenticated) throw new Error(auth.error);

    return this.resultsStore.get(examId) || [
      {
        candidateId: 'cand_demo_01',
        examId,
        score: 88,
        percentage: 88.0,
        grade: 'A',
        status: 'RELEASED',
        submittedAt: Date.now() - 3600000,
      },
    ];
  }
}

export const institutionalApiService = new InstitutionalApiService();

