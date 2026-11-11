import { Router, Request, Response } from 'express';
import { EnterpriseOperationsService } from '../services/EnterpriseOperationsService';

export class EnterpriseOperationsController {
  public readonly router: Router;
  private service: EnterpriseOperationsService;

  constructor(service?: EnterpriseOperationsService) {
    this.router = Router();
    this.service = service || new EnterpriseOperationsService();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // 1. Live Operations Center
    this.router.get('/live', (req: Request, res: Response) => {
      const metrics = this.service.getLiveOperationsMetrics(req.query.orgId as string);
      return res.json({ success: true, metrics });
    });

    // 2. Session Monitoring Grid
    this.router.get('/sessions', (req: Request, res: Response) => {
      const items = this.service.getSessionMonitoringGrid(
        req.query.orgId as string,
        req.query.search as string,
        req.query.status as string
      );
      return res.json({ success: true, count: items.length, sessions: items });
    });

    // 3. Proctor Workspace
    this.router.post('/proctor/action', (req: Request, res: Response) => {
      const result = this.service.executeProctorAction(req.body);
      if (!result.success) return res.status(404).json({ success: false, message: 'Session not found.' });
      return res.json({ success: true, session: result.session });
    });

    // 4. Integrity Review Center
    this.router.get('/cases', (req: Request, res: Response) => {
      const cases = this.service.getReviewCases(req.query.orgId as string, req.query.status as any);
      return res.json({ success: true, cases });
    });

    this.router.patch('/cases/:id', (req: Request, res: Response) => {
      const updated = this.service.updateCaseStatus(req.params.id, req.body.status, req.body.reviewerNotes, req.body.proctorId);
      if (!updated) return res.status(404).json({ success: false, message: 'Case not found.' });
      return res.json({ success: true, case: updated });
    });

    // 5. Appeals Manager
    this.router.post('/appeals', (req: Request, res: Response) => {
      const appeal = this.service.submitAppeal(req.body.caseId, req.body.candidateId, req.body.statement, req.body.documentUrls || []);
      return res.json({ success: true, appeal });
    });

    this.router.patch('/appeals/:id', (req: Request, res: Response) => {
      const resolved = this.service.resolveAppeal(req.params.id, req.body.status, req.body.reviewerNotes);
      if (!resolved) return res.status(404).json({ success: false, message: 'Appeal not found.' });
      return res.json({ success: true, appeal: resolved });
    });

    // 6. AI Evidence Assistant
    this.router.get('/ai-assistant/:caseId', (req: Request, res: Response) => {
      const summary = this.service.generateAIEvidenceSummary(req.params.caseId);
      return res.json({ success: true, summary });
    });

    // 7. Compliance Center
    this.router.get('/compliance', (req: Request, res: Response) => {
      const records = this.service.getComplianceRecords(req.query.orgId as string);
      return res.json({ success: true, records });
    });

    this.router.post('/compliance', (req: Request, res: Response) => {
      const record = this.service.submitComplianceRequest(req.body.orgId, req.body.framework, req.body.requestType, req.body.targetId);
      return res.json({ success: true, record });
    });

    // 8. Audit Center
    this.router.get('/audit', (req: Request, res: Response) => {
      const logs = this.service.getAuditLogs(req.query.orgId as string);
      return res.json({ success: true, count: logs.length, logs });
    });

    // 9. Analytics Platform
    this.router.get('/analytics', (req: Request, res: Response) => {
      const analytics = this.service.getAnalyticsSummary(req.query.orgId as string);
      return res.json({ success: true, analytics });
    });

    // 10. Organization Policy Engine
    this.router.get('/policy/:orgId', (req: Request, res: Response) => {
      const policy = this.service.getOrganizationPolicy(req.params.orgId);
      return res.json({ success: true, policy });
    });

    this.router.put('/policy/:orgId', (req: Request, res: Response) => {
      const policy = this.service.updateOrganizationPolicy(req.params.orgId, req.body);
      return res.json({ success: true, policy });
    });

    // 11. Alert Center
    this.router.get('/alerts', (req: Request, res: Response) => {
      const alerts = this.service.getAlerts(req.query.orgId as string);
      return res.json({ success: true, alerts });
    });

    this.router.post('/alerts/:id/ack', (req: Request, res: Response) => {
      const ack = this.service.acknowledgeAlert(req.params.id);
      return res.json({ success: ack });
    });

    // 12. Notification Service
    this.router.post('/notifications/send', (req: Request, res: Response) => {
      const result = this.service.sendNotification(req.body.channels, req.body.recipient, req.body.payload);
      return res.json({ success: true, result });
    });

    // 13. Incident Manager
    this.router.get('/incidents', (req: Request, res: Response) => {
      const incidents = this.service.getIncidents(req.query.orgId as string);
      return res.json({ success: true, incidents });
    });

    // 14. Risk Dashboard
    this.router.get('/risk', (req: Request, res: Response) => {
      const risk = this.service.getRiskDashboardData(req.query.orgId as string);
      return res.json({ success: true, risk });
    });

    // 15. Reporting Center
    this.router.get('/reports', (req: Request, res: Response) => {
      const format = (req.query.format as any) || 'json';
      const report = this.service.generateOperationsReport((req.query.type as string) || 'OPERATIONAL', (req.query.orgId as string) || 'all', format);
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        return res.send(report);
      }
      return res.json({ success: true, report });
    });

    // 16. Retention Manager
    this.router.post('/retention/purge', (req: Request, res: Response) => {
      const result = this.service.executeRetentionPurge(req.body.orgId || 'all', req.body.retentionDays || 90);
      return res.json({ success: true, ...result });
    });

    // 17. Multi-Tenant Administration
    this.router.get('/multi-tenant', (req: Request, res: Response) => {
      const hierarchy = this.service.getMultiTenantHierarchy();
      return res.json({ success: true, hierarchy });
    });

    // 18. Billing & Usage
    this.router.get('/billing', (req: Request, res: Response) => {
      const usage = this.service.getBillingUsage((req.query.orgId as string) || 'org_mit_01');
      return res.json({ success: true, usage });
    });

    // 19. System Health Center
    this.router.get('/health', (req: Request, res: Response) => {
      const health = this.service.getSystemHealth();
      return res.json({ success: true, health });
    });

    // 20. Disaster Recovery Dashboard
    this.router.get('/disaster-recovery', (req: Request, res: Response) => {
      const dr = this.service.getDisasterRecoveryStatus();
      return res.json({ success: true, disasterRecovery: dr });
    });
  }
}
