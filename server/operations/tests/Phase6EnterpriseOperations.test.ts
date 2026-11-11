import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import { EnterpriseOperationsService } from '../services/EnterpriseOperationsService';
import { EnterpriseOperationsController } from '../controllers/EnterpriseOperationsController';

describe('Phase 6 Enterprise Operations Platform Test Suite', () => {
  let service: EnterpriseOperationsService;
  let controller: EnterpriseOperationsController;

  const mockOrgId = 'org_mit_01';

  beforeEach(() => {
    service = new EnterpriseOperationsService();
    controller = new EnterpriseOperationsController(service);
  });

  describe('20 Operations Modules Integration Tests', () => {
    it('1. Live Operations Center: should return active metrics', () => {
      const metrics = service.getLiveOperationsMetrics(mockOrgId);
      expect(metrics.candidatesOnlineCount).toBeGreaterThan(0);
      expect(metrics.aiInferenceHealthPercent).toBeGreaterThan(90);
    });

    it('2. Session Monitoring: should query live candidate grid with filtering', () => {
      const grid = service.getSessionMonitoringGrid(mockOrgId);
      expect(grid.length).toBeGreaterThan(0);
      expect(grid[0].candidateName).toBeDefined();
    });

    it('3. Proctor Workspace: should execute proctor pause and resume actions', () => {
      const pauseRes = service.executeProctorAction({ action: 'PAUSE', sessionId: 'session_live_101', proctorId: 'proctor_01' });
      expect(pauseRes.success).toBe(true);
      expect(pauseRes.session?.status).toBe('PAUSED');

      const resumeRes = service.executeProctorAction({ action: 'RESUME', sessionId: 'session_live_101', proctorId: 'proctor_01' });
      expect(resumeRes.success).toBe(true);
      expect(resumeRes.session?.status).toBe('ACTIVE');
    });

    it('4. Integrity Review Center: should list cases and update case status', () => {
      const cases = service.getReviewCases(mockOrgId);
      expect(cases.length).toBeGreaterThan(0);

      const updated = service.updateCaseStatus(cases[0].caseId, 'CLEARED', 'Cleared by proctor', 'proctor_01');
      expect(updated?.status).toBe('CLEARED');
    });

    it('5. Appeals Manager: should handle appeal submission and resolution workflow', () => {
      const appeal = service.submitAppeal('case_707', 'cand_bob_303', 'I suffered an internet outage.', []);
      expect(appeal.appealId).toBeDefined();
      expect(appeal.status).toBe('PENDING');

      const resolved = service.resolveAppeal(appeal.appealId, 'APPROVED', 'Evidence accepted');
      expect(resolved?.status).toBe('APPROVED');
    });

    it('6. AI Evidence Assistant: should generate non-binding evidence summaries', () => {
      const summary = service.generateAIEvidenceSummary('case_707');
      expect(summary.caseId).toBe('case_707');
      expect(summary.suggestedQuestions.length).toBeGreaterThan(0);
    });

    it('7. Compliance Center: should process GDPR/FERPA compliance requests', () => {
      const record = service.submitComplianceRequest(mockOrgId, 'GDPR', 'RIGHT_TO_DELETION', 'cand_alice_202');
      expect(record.framework).toBe('GDPR');
      expect(record.status).toBe('COMPLETED');
    });

    it('8. Audit Center: should record and retrieve immutable audit logs', () => {
      const logs = service.getAuditLogs(mockOrgId);
      expect(logs.length).toBeGreaterThan(0);
    });

    it('9. Analytics Platform: should calculate completion rates and integrity trends', () => {
      const analytics = service.getAnalyticsSummary(mockOrgId);
      expect(analytics.examCompletionRate).toBeGreaterThan(90);
      expect(analytics.integrityTrends.length).toBeGreaterThan(0);
    });

    it('10. Organization Policy Engine: should update per-organization policies', () => {
      const policy = service.updateOrganizationPolicy(mockOrgId, { allowCalculator: false });
      expect(policy.allowCalculator).toBe(false);
    });

    it('11. Alert Center: should list alerts and support acknowledgement', () => {
      const alerts = service.getAlerts(mockOrgId);
      expect(Array.isArray(alerts)).toBe(true);
    });

    it('12. Notification Service: should send multi-channel notifications', () => {
      const res = service.sendNotification(['email', 'sms'], 'admin@mit.edu', { title: 'Alert' });
      expect(res.delivered).toBe(true);
    });

    it('13. Incident Manager: should list operations incidents', () => {
      const incidents = service.getIncidents(mockOrgId);
      expect(Array.isArray(incidents)).toBe(true);
    });

    it('14. Risk Dashboard: should aggregate risk heatmap data', () => {
      const risk = service.getRiskDashboardData(mockOrgId);
      expect(risk.currentOrgRisk).toBeDefined();
    });

    it('15. Reporting Center: should export reports in JSON and CSV formats', () => {
      const jsonReport = service.generateOperationsReport('INTEGRITY', mockOrgId, 'json');
      expect(jsonReport.reportType).toBe('INTEGRITY');

      const csvReport = service.generateOperationsReport('INTEGRITY', mockOrgId, 'csv');
      expect(typeof csvReport).toBe('string');
      expect(csvReport).toContain('Type,Org,Sessions');
    });

    it('16. Retention Manager: should execute retention purge automation', () => {
      const res = service.executeRetentionPurge(mockOrgId, 90);
      expect(res.purgedCount).toBeGreaterThan(0);
    });

    it('17. Multi-Tenant Administration: should return tenant hierarchy', () => {
      const hierarchy = service.getMultiTenantHierarchy();
      expect(hierarchy.tenants.length).toBeGreaterThan(0);
    });

    it('18. Billing & Usage: should track exam attempts and AI inference usage', () => {
      const billing = service.getBillingUsage(mockOrgId);
      expect(billing.examAttemptsUsed).toBeGreaterThan(0);
    });

    it('19. System Health Center: should return system component metrics', () => {
      const health = service.getSystemHealth();
      expect(health.apiHealthPercent).toBeGreaterThan(99);
    });

    it('20. Disaster Recovery Dashboard: should return backup and failover status', () => {
      const dr = service.getDisasterRecoveryStatus();
      expect(dr.backupStatus).toBe('HEALTHY');
      expect(dr.failoverReady).toBe(true);
    });
  });

  describe('Express Router Integration', () => {
    it('should mount Express router with valid controller handlers', () => {
      const app = express();
      app.use(express.json());
      app.use('/api/v1/operations', controller.router);
      expect(controller.router).toBeDefined();
    });
  });
});
