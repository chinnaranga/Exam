import crypto from 'crypto';
import {
  ConsentCategory,
  ConsentRecord,
  ConsentVerificationResult,
  ConsentVersionConfig,
  InstitutionAlternativeProcess,
} from './complianceTypes';

export class ConsentService {
  private activeVersionConfig: ConsentVersionConfig;
  private versionHistory: Map<string, ConsentVersionConfig> = new Map();
  private consentRecords: Map<string, ConsentRecord> = new Map(); // Key: sessionId
  private candidateRecords: Map<string, ConsentRecord[]> = new Map(); // Key: candidateId

  constructor() {
    this.activeVersionConfig = this.buildDefaultConsentConfig();
    this.versionHistory.set(this.activeVersionConfig.version, this.activeVersionConfig);
  }

  /**
   * Retrieves the currently active consent version configuration.
   */
  public getActiveConsentConfig(): ConsentVersionConfig {
    return this.activeVersionConfig;
  }

  /**
   * Publishes a new consent policy version.
   */
  public publishNewVersion(config: ConsentVersionConfig): void {
    this.activeVersionConfig = config;
    this.versionHistory.set(config.version, config);
  }

  /**
   * Configures the institution's alternative examination accommodation process
   * for candidates who decline electronic/biometric proctoring.
   */
  public updateAlternativeProcess(process: InstitutionAlternativeProcess): void {
    this.activeVersionConfig.institutionAlternativeProcess = process;
  }

  /**
   * Records candidate consent with category-by-category selections and cryptographic hash.
   */
  public recordConsent(params: {
    candidateId: string;
    sessionId: string;
    examId: string;
    tenantId: string;
    consentedCategories: Partial<Record<ConsentCategory, boolean>>;
    ipAddress?: string;
    userAgent?: string;
    version?: string;
  }): ConsentRecord {
    const version = params.version || this.activeVersionConfig.version;
    const now = Date.now();

    const normalizedCategories: Record<ConsentCategory, boolean> = {
      camera: !!params.consentedCategories.camera,
      microphone: !!params.consentedCategories.microphone,
      biometrics: !!params.consentedCategories.biometrics,
      keystrokeData: !!params.consentedCategories.keystrokeData,
      roomScan: !!params.consentedCategories.roomScan,
      phoneCamera: !!params.consentedCategories.phoneCamera,
    };

    // Generate cryptographic signature proof
    const signaturePayload = `${params.candidateId}:${params.sessionId}:${version}:${JSON.stringify(
      normalizedCategories
    )}:${now}`;
    const signatureHash = crypto.createHash('sha256').update(signaturePayload).digest('hex');

    const consentId = `consent_${now}_${crypto.randomBytes(4).toString('hex')}`;

    const record: ConsentRecord = {
      consentId,
      candidateId: params.candidateId,
      sessionId: params.sessionId,
      examId: params.examId,
      tenantId: params.tenantId,
      version,
      consentedCategories: normalizedCategories,
      timestamp: now,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      signatureHash,
    };

    this.consentRecords.set(params.sessionId, record);

    const history = this.candidateRecords.get(params.candidateId) || [];
    history.push(record);
    this.candidateRecords.set(params.candidateId, history);

    return record;
  }

  /**
   * Verifies candidate consent before permitting the exam runner to launch.
   * If any mandatory category is declined, BLOCKS the exam and returns the
   * institution's alternative process.
   */
  public verifyCandidateConsent(sessionId: string): ConsentVerificationResult {
    const record = this.consentRecords.get(sessionId);
    const config = record ? this.versionHistory.get(record.version) || this.activeVersionConfig : this.activeVersionConfig;

    if (!record) {
      return {
        hasValidConsent: false,
        allMandatoryConsented: false,
        missingCategories: [...config.mandatoryCategories],
        alternativeProcess: config.institutionAlternativeProcess,
        reason: 'No consent record on file for this session. Consent must be provided before exam start.',
      };
    }

    if (record.isRevoked) {
      return {
        hasValidConsent: false,
        allMandatoryConsented: false,
        missingCategories: [...config.mandatoryCategories],
        record,
        alternativeProcess: config.institutionAlternativeProcess,
        reason: 'Consent for this exam session was revoked by the candidate.',
      };
    }

    const missing: ConsentCategory[] = [];
    for (const cat of config.mandatoryCategories) {
      if (!record.consentedCategories[cat]) {
        missing.push(cat);
      }
    }

    if (missing.length > 0) {
      return {
        hasValidConsent: false,
        allMandatoryConsented: false,
        missingCategories: missing,
        record,
        alternativeProcess: config.institutionAlternativeProcess,
        reason: `Mandatory consent was declined for: ${missing.join(', ')}. Candidate must use institutional alternative process.`,
      };
    }

    return {
      hasValidConsent: true,
      allMandatoryConsented: true,
      missingCategories: [],
      record,
    };
  }

  /**
   * Candidate revokes consent mid-session or prior to launch.
   */
  public revokeConsent(sessionId: string, reason?: string): ConsentRecord {
    const record = this.consentRecords.get(sessionId);
    if (!record) {
      throw new Error(`Consent record for session "${sessionId}" not found.`);
    }

    record.isRevoked = true;
    record.revokedAt = Date.now();
    return record;
  }

  /**
   * Get all historical consent records for a candidate (e.g. for DSR access requests).
   */
  public getCandidateConsentHistory(candidateId: string): ConsentRecord[] {
    return this.candidateRecords.get(candidateId) || [];
  }

  private buildDefaultConsentConfig(): ConsentVersionConfig {
    return {
      version: 'v2.2-compliance-2026',
      publishedAt: Date.now(),
      mandatoryCategories: ['camera', 'microphone', 'biometrics', 'keystrokeData'],
      summaryText:
        'AssessIQ operates automated privacy-first proctoring. Video streams are analyzed locally on your device via WebAssembly without high-fps transmission to cloud servers. Only low-resolution snapshots and signed telemetry events are securely stored.',
      categoryDescriptions: {
        camera: 'Webcam video stream analyzed locally in-browser for head pose, presence, and gaze tracking.',
        microphone: 'Microphone audio monitored locally for sustained speech detection exceeding ambient decibel thresholds.',
        biometrics: 'Local facial geometry feature-point comparison for candidate authentication and random liveness checks.',
        keystrokeData: 'Keystroke rhythm and flight-time timing dynamics captured during essay and coding responses.',
        roomScan: 'Optional 360-degree environment sweep performed before high-stakes certification examinations.',
        phoneCamera: 'Optional secondary phone camera angle for high-stakes dual-camera proctoring configurations.',
      },
      institutionAlternativeProcess: {
        offered: true,
        type: 'IN_PERSON_PROCTORED_LAB',
        description: 'University In-Person Proctored Testing Center',
        instructions:
          'If you decline biometric or electronic proctoring, you are entitled to complete this examination in-person at the campus testing facility under human supervision.',
        contactEmail: 'testing-accommodations@institution.edu',
        contactPhone: '+1 (555) 019-2834',
        facilityLocation: 'Campus Academic Services Building, Room 204B',
      },
    };
  }
}

export const consentService = new ConsentService();

