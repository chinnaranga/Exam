import express, { Request, Response, Router } from 'express';
import { consentService, ConsentService } from './ConsentService';
import { retentionPolicyService, RetentionPolicyService } from './RetentionPolicyService';
import { dataSubjectRequestService, DataSubjectRequestService } from './DataSubjectRequestService';
import { tenantEncryptionService, TenantEncryptionService } from './TenantEncryptionService';
import { evidenceAccessControlService, EvidenceAccessControlService } from './EvidenceAccessControlService';
import { dpiaDataInventoryService, DpiaDataInventoryService } from './DpiaDataInventoryService';

export class PrivacyAndCompliancePlatform {
  public readonly router: Router;
  public readonly consent: ConsentService;
  public readonly retention: RetentionPolicyService;
  public readonly dsr: DataSubjectRequestService;
  public readonly encryption: TenantEncryptionService;
  public readonly accessControl: EvidenceAccessControlService;
  public readonly dpia: DpiaDataInventoryService;

  constructor(
    consent: ConsentService = consentService,
    retention: RetentionPolicyService = retentionPolicyService,
    dsr: DataSubjectRequestService = dataSubjectRequestService,
    encryption: TenantEncryptionService = tenantEncryptionService,
    accessControl: EvidenceAccessControlService = evidenceAccessControlService,
    dpia: DpiaDataInventoryService = dpiaDataInventoryService
  ) {
    this.consent = consent;
    this.retention = retention;
    this.dsr = dsr;
    this.encryption = encryption;
    this.accessControl = accessControl;
    this.dpia = dpia;

    this.router = express.Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    // 1. Consent Routes
    this.router.get('/consent/active-version', (req: Request, res: Response) => {
      res.json(this.consent.getActiveConsentConfig());
    });

    this.router.post('/consent/record', (req: Request, res: Response) => {
      try {
        const { candidateId, sessionId, examId, tenantId, consentedCategories } = req.body;
        const record = this.consent.recordConsent({
          candidateId,
          sessionId,
          examId,
          tenantId: tenantId || 'default_tenant',
          consentedCategories,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });
        res.status(201).json({ success: true, record });
      } catch (err: any) {
        res.status(400).json({ error: err.message });
      }
    });

    this.router.get('/consent/verify/:sessionId', (req: Request, res: Response) => {
      const result = this.consent.verifyCandidateConsent(req.params.sessionId);
      res.json(result);
    });

    // 2. Retention Policy Routes
    this.router.get('/retention/policy/:tenantId', (req: Request, res: Response) => {
      res.json(this.retention.getRetentionPolicy(req.params.tenantId));
    });

    this.router.post('/retention/purge-job', (req: Request, res: Response) => {
      const { tenantId } = req.body;
      const result = this.retention.executeScheduledRetentionPurge(undefined, tenantId);
      res.json(result);
    });

    this.router.get('/retention/audit-records', (req: Request, res: Response) => {
      const tenantId = req.query.tenantId as string | undefined;
      res.json(this.retention.getDeletionAuditRecords(tenantId));
    });

    // 3. Data Subject Requests (DSR)
    this.router.post('/dsr/submit', (req: Request, res: Response) => {
      try {
        const { candidateId, candidateEmail, tenantId, type, details, requestedCorrectionFields } = req.body;
        const request = this.dsr.submitRequest({
          candidateId,
          candidateEmail,
          tenantId: tenantId || 'default_tenant',
          type,
          details,
          requestedCorrectionFields,
        });
        res.status(201).json({ success: true, request });
      } catch (err: any) {
        res.status(400).json({ error: err.message });
      }
    });

    this.router.get('/dsr/list', (req: Request, res: Response) => {
      const { tenantId, candidateId, status, onlyUrgent } = req.query;
      const requests = this.dsr.queryRequests({
        tenantId: tenantId as string,
        candidateId: candidateId as string,
        status: status as any,
        onlyUrgent: onlyUrgent === 'true',
      });
      res.json(requests);
    });

    this.router.post('/dsr/:id/fulfill', (req: Request, res: Response) => {
      try {
        const { executedBy } = req.body;
        const result = this.dsr.fulfillRequest({
          requestId: req.params.id,
          executedBy: executedBy || 'admin',
        });
        res.json(result);
      } catch (err: any) {
        res.status(400).json({ error: err.message });
      }
    });

    // 4. Evidence Access & Audit View Route
    this.router.post('/evidence/view', (req: Request, res: Response) => {
      try {
        const { viewerId, caseId, sessionId, reason, sessionCandidateId } = req.body;
        const access = this.accessControl.logAndVerifyEvidenceView({
          viewerId,
          caseId,
          sessionId,
          reason: reason || 'Routine case review',
          sessionCandidateId,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });
        res.json({ success: true, allowed: access.allowed, logId: access.log.logId });
      } catch (err: any) {
        res.status(403).json({ error: err.message });
      }
    });

    this.router.get('/evidence/logs', (req: Request, res: Response) => {
      const { caseId, viewerId } = req.query;
      res.json(this.accessControl.getAccessLogs({ caseId: caseId as string, viewerId: viewerId as string }));
    });

    // 5. Key Rotation & Encryption Documentation
    this.router.get('/encryption/key-rotation-doc', (req: Request, res: Response) => {
      res.json(this.encryption.getKeyRotationDocumentation());
    });

    this.router.post('/encryption/rotate-key', (req: Request, res: Response) => {
      const { tenantId, rotatedBy } = req.body;
      const event = this.encryption.rotateTenantKey(tenantId || 'default_tenant', rotatedBy);
      res.json(event);
    });

    // 6. DPIA Data Inventory Route
    this.router.get('/dpia/report', (req: Request, res: Response) => {
      const report = this.dpia.generateDpiaReport();
      res.json(report);
    });

    this.router.get('/dpia/export-markdown', (req: Request, res: Response) => {
      const report = this.dpia.generateDpiaReport();
      const markdown = this.dpia.exportDpiaMarkdown(report);
      res.setHeader('Content-Type', 'text/markdown');
      res.send(markdown);
    });
  }
}

export const privacyAndCompliancePlatform = new PrivacyAndCompliancePlatform();

