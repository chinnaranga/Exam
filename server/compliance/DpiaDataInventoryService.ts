import { DpiaDataElement, DpiaInventoryReport } from './complianceTypes';

export class DpiaDataInventoryService {
  private inventoryElements: DpiaDataElement[] = [];

  constructor() {
    this.seedDefaultDpiaInventory();
  }

  public getInventory(): DpiaDataElement[] {
    return [...this.inventoryElements];
  }

  /**
   * Generates a comprehensive DPIA (Data Protection Impact Assessment) compliance report
   * ready for Data Protection Officers (DPOs), Institutional Review Boards (IRBs), and accreditation bodies.
   */
  public generateDpiaReport(params?: {
    institutionName?: string;
    dpoContact?: string;
  }): DpiaInventoryReport {
    return {
      institutionName: params?.institutionName || 'University Examination Authority',
      dpoContact: params?.dpoContact || 'dpo-privacy@institution.edu',
      generatedAt: Date.now(),
      version: 'GDPR-DPIA-2026.1',
      elements: this.getInventory(),
      plainLanguageSummary: {
        processedLocallyInBrowser: [
          'High-FPS Webcam Video Stream (TensorFlow.js / MediaPipe Wasm Face Mesh runs in client RAM; raw video is NEVER streamed to the cloud).',
          'Continuous Audio Analysis (Local Web Audio FFT decibel monitoring; raw audio is NEVER transmitted unless a sustained violation clip triggers).',
          'Head Pose & Gaze Direction Vectors (Computed locally via geometric facial landmark ratios).',
          'Liveness Challenge Gestures (Blinks, smiles, head turns verified in client memory).',
        ],
        sentToServerEncrypted: [
          'Encrypted Low-Resolution Periodic Snapshots (Sent via TLS 1.3, encrypted at rest with AES-256-GCM per-tenant key).',
          'HMAC-Signed Violation Telemetry Events (Focus loss, tab switch, secondary display detection).',
          'Typing Cadence Timing Signatures (Inter-keystroke intervals for essay author authentication).',
          'Cryptographically Sealed Answer Ledger (Hash-chained audit log with candidate signature).',
          'Government / Student ID Photo (Stored temporarily in encrypted storage during appeal window, then purged).',
        ],
        neverCollectedOrStored: [
          'Full-motion continuous raw video or audio recordings.',
          'Browser search history, passwords, or personal files outside the exam tab.',
          'GPS location or physical address (only general IP geolocation for regional proctor routing).',
          'Biometric facial templates sold or shared with any third-party brokers or advertisers.',
        ],
      },
    };
  }

  /**
   * Formats the DPIA data inventory as a publication-ready Markdown document.
   */
  public exportDpiaMarkdown(report: DpiaInventoryReport): string {
    let md = `# Data Protection Impact Assessment (DPIA) Inventory Report\n\n`;
    md += `**Institution:** ${report.institutionName}  \n`;
    md += `**Data Protection Officer:** ${report.dpoContact}  \n`;
    md += `**Generated:** ${new Date(report.generatedAt).toISOString()}  \n`;
    md += `**Compliance Framework:** GDPR (Regulation EU 2016/679) & FERPA (34 CFR Part 99)  \n\n`;

    md += `## 1. Plain-Language Privacy Architecture\n\n`;
    md += `### A. What Runs Strictly In Your Browser (Zero Cloud Transmission)\n`;
    for (const item of report.plainLanguageSummary.processedLocallyInBrowser) {
      md += `- ${item}\n`;
    }
    md += `\n### B. What Is Transmitted & Encrypted At Rest\n`;
    for (const item of report.plainLanguageSummary.sentToServerEncrypted) {
      md += `- ${item}\n`;
    }
    md += `\n### C. What Is NEVER Collected\n`;
    for (const item of report.plainLanguageSummary.neverCollectedOrStored) {
      md += `- ${item}\n`;
    }

    md += `\n## 2. Granular Data Asset Inventory\n\n`;
    md += `| Category | Fields | Purpose | Lawful Basis | Location | Encryption | Retention | Disposal |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    for (const el of report.elements) {
      md += `| **${el.dataCategory}** | ${el.dataFields.join(', ')} | ${el.purpose} | ${el.lawfulBasis} | ${
        el.processingLocation
      } | ${el.encryptionMethod} | ${el.retentionPeriod} | ${el.disposalMethod} |\n`;
    }

    return md;
  }

  private seedDefaultDpiaInventory() {
    this.inventoryElements = [
      {
        id: 'dpia_webcam_stream',
        dataCategory: 'Real-Time Webcam Video',
        dataFields: ['Raw video frames', 'Face bounding boxes', '468 facial mesh landmarks'],
        purpose: 'Verify candidate presence and track forward visual attention during exam.',
        lawfulBasis: 'CONSENT',
        processingLocation: 'BROWSER_LOCAL_WASM',
        storageLocation: 'Ephemeral Client Device RAM (Zero disk writes, zero server streaming)',
        encryptionMethod: 'In-Memory Only',
        retentionPeriod: 'Discarded immediately after frame processing (~33ms lifecycle)',
        disposalMethod: 'Garbage collected in client browser',
        thirdPartySharing: 'NONE',
      },
      {
        id: 'dpia_audio_stream',
        dataCategory: 'Real-Time Ambient Audio',
        dataFields: ['Decibel levels', 'Spectral voice frequency energy (FFT)'],
        purpose: 'Detect spoken collusion or third-party room presence.',
        lawfulBasis: 'CONSENT',
        processingLocation: 'BROWSER_LOCAL_WASM',
        storageLocation: 'Client RAM (Web Audio API buffer)',
        encryptionMethod: 'In-Memory Only',
        retentionPeriod: 'Instantaneous (100ms rolling window)',
        disposalMethod: 'Overwritten cyclically',
        thirdPartySharing: 'NONE',
      },
      {
        id: 'dpia_snapshots',
        dataCategory: 'Periodic Proctoring Snapshots',
        dataFields: ['JPEG snapshots (320x240)', 'Timestamp', 'Session ID'],
        purpose: 'Provide visual evidence for invigilator review if anomalies trigger.',
        lawfulBasis: 'CONTRACT',
        processingLocation: 'SERVER_ENCRYPTED_AT_REST',
        storageLocation: 'Isolated Cloud Storage (Per-Tenant Bucket)',
        encryptionMethod: 'AES-256-GCM with per-tenant rotating keys',
        retentionPeriod: '30 days (default retention limit)',
        disposalMethod: 'Cryptographic zero-fill deletion job with audit log',
        thirdPartySharing: 'NONE',
      },
      {
        id: 'dpia_id_verification',
        dataCategory: 'Candidate Identity Documents',
        dataFields: ['Government / Student ID photo', 'Face extraction crop', 'Match confidence score'],
        purpose: 'Prevent impersonation fraud during pre-exam onboarding.',
        lawfulBasis: 'CONSENT',
        processingLocation: 'SERVER_ENCRYPTED_AT_REST',
        storageLocation: 'Isolated Encrypted Object Store',
        encryptionMethod: 'AES-256-GCM Envelope Encryption',
        retentionPeriod: '7 days post-exam verification',
        disposalMethod: 'Automated cryptographic purge',
        thirdPartySharing: 'NONE',
      },
      {
        id: 'dpia_keystroke_cadence',
        dataCategory: 'Keystroke Dynamics Biometrics',
        dataFields: ['Key flight times', 'Hold durations', 'Typing cadence histogram'],
        purpose: 'Detect essay copy-pasting or unauthorized ghost-writing.',
        lawfulBasis: 'LEGITIMATE_INTEREST',
        processingLocation: 'SERVER_ENCRYPTED_AT_REST',
        storageLocation: 'Encrypted Telemetry Store',
        encryptionMethod: 'AES-256-GCM',
        retentionPeriod: '90 days (Appeal window + grade finalization)',
        disposalMethod: 'Scheduled retention purge',
        thirdPartySharing: 'NONE',
      },
      {
        id: 'dpia_audit_ledger',
        dataCategory: 'Cryptographic Audit Trail',
        dataFields: ['HMAC event signatures', 'Sequence numbers', 'Hash-chained block digests'],
        purpose: 'Guarantee exam integrity and non-repudiation for academic accreditation.',
        lawfulBasis: 'LEGAL_OBLIGATION',
        processingLocation: 'SERVER_ENCRYPTED_AT_REST',
        storageLocation: 'Authoritative Immutable Ledger',
        encryptionMethod: 'SHA-256 Hash Chain + AES-256-GCM',
        retentionPeriod: '365 days (1 Academic Year)',
        disposalMethod: 'Archive to cold storage',
        thirdPartySharing: 'NONE',
      },
    ];
  }
}

export const dpiaDataInventoryService = new DpiaDataInventoryService();

