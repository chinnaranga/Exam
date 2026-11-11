import { Router, Request, Response } from 'express';
import { TelemetryGateway } from './TelemetryGateway';
import { EventStore } from './EventStore';
import { BaselineEngine } from './BaselineEngine';
import { BehaviorAnalyticsEngine } from './BehaviorAnalyticsEngine';
import { IntegrityRiskEngine } from './IntegrityRiskEngine';
import { EvidenceAggregator } from './EvidenceAggregator';
import { AuditService } from './AuditService';
import { ReportGenerator } from './ReportGenerator';
import { IntegrityPolicyConfig, ReviewStatus } from './types/IntegrityTypes';

export class HumanReviewAPI {
  public readonly router: Router;

  private gateway: TelemetryGateway;
  private eventStore: EventStore;
  private baselineEngine: BaselineEngine;
  private behaviorAnalytics: BehaviorAnalyticsEngine;
  private riskEngine: IntegrityRiskEngine;
  private evidenceAggregator: EvidenceAggregator;
  private auditService: AuditService;
  private reportGenerator: ReportGenerator;

  private currentPolicy: IntegrityPolicyConfig;
  private reviewStates: Map<string, { status: ReviewStatus; reviewerNotes?: string; reviewerId?: string; reviewedAt?: string }> = new Map();

  constructor(
    gateway?: TelemetryGateway,
    eventStore?: EventStore,
    baselineEngine?: BaselineEngine,
    behaviorAnalytics?: BehaviorAnalyticsEngine,
    riskEngine?: IntegrityRiskEngine,
    evidenceAggregator?: EvidenceAggregator,
    auditService?: AuditService,
    reportGenerator?: ReportGenerator
  ) {
    this.router = Router();

    this.gateway = gateway || new TelemetryGateway();
    this.eventStore = eventStore || new EventStore();
    this.baselineEngine = baselineEngine || new BaselineEngine();
    this.behaviorAnalytics = behaviorAnalytics || new BehaviorAnalyticsEngine();
    this.riskEngine = riskEngine || new IntegrityRiskEngine();
    this.evidenceAggregator = evidenceAggregator || new EvidenceAggregator();
    this.auditService = auditService || new AuditService();
    this.reportGenerator = reportGenerator || new ReportGenerator();

    this.currentPolicy = { ...IntegrityRiskEngine.DEFAULT_POLICY };

    this.setupRoutes();
  }

  private setupRoutes(): void {
    // 1. Ingest Batched Telemetry Events
    this.router.post('/events', async (req: Request, res: Response) => {
      try {
        const clientIp = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';
        const { isValid, result, validatedEvents } = this.gateway.validateAndProcessBatch(req.body, clientIp);

        if (!isValid) {
          return res.status(400).json({ success: false, ...result });
        }

        const sessionId = req.body.sessionId;
        const candidateId = req.body.candidateId;
        const examId = req.body.examId;
        const organizationId = req.body.organizationId;

        // Store validated events
        await this.eventStore.storeEvents(sessionId, validatedEvents, clientIp);

        // Update Baseline & Behavior Analytics
        const allSessionEvents = await this.eventStore.getSessionEvents(sessionId);
        const baseline = this.baselineEngine.updateSessionBaseline(sessionId, candidateId, allSessionEvents);
        const behaviorReport = this.behaviorAnalytics.generateBehaviorReport(sessionId, candidateId, allSessionEvents);

        // Evaluate Risk Assessment
        const assessment = this.riskEngine.evaluateAssessment(
          sessionId,
          candidateId,
          examId,
          organizationId,
          allSessionEvents,
          baseline,
          behaviorReport,
          this.currentPolicy
        );

        // Audit Trail Record
        this.auditService.logAction({
          sessionId,
          action: 'TELEMETRY_BATCH_RECEIVED',
          actorId: candidateId,
          policyVersion: this.currentPolicy.version,
          details: { acceptedCount: result.acceptedCount, overallRiskScore: assessment.overallRiskScore },
          ipAddress: clientIp,
        });

        return res.json({
          success: true,
          acceptedCount: result.acceptedCount,
          sessionId,
          overallRiskScore: assessment.overallRiskScore,
          reviewStatus: this.reviewStates.get(sessionId)?.status || assessment.reviewStatus,
        });
      } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
      }
    });

    // 2. GET Session Summary & Explainable Risk Dimensions
    this.router.get('/session/:id', async (req: Request, res: Response) => {
      try {
        const sessionId = req.params.id;
        const events = await this.eventStore.getSessionEvents(sessionId);

        if (events.length === 0) {
          return res.status(404).json({ success: false, message: `No integrity telemetry found for session "${sessionId}".` });
        }

        const candidateId = events[0].candidateId || 'unknown';
        const examId = events[0].examId || 'unknown';
        const organizationId = 'default_org';

        const baseline = this.baselineEngine.getSessionBaseline(sessionId);
        const behaviorReport = this.behaviorAnalytics.generateBehaviorReport(sessionId, candidateId, events);
        const assessment = this.riskEngine.evaluateAssessment(
          sessionId,
          candidateId,
          examId,
          organizationId,
          events,
          baseline,
          behaviorReport,
          this.currentPolicy
        );

        const currentReview = this.reviewStates.get(sessionId);
        const reviewStatus = currentReview?.status || assessment.reviewStatus;

        return res.json({
          success: true,
          sessionId,
          candidateId,
          examId,
          organizationId,
          reviewStatus,
          overallRiskScore: assessment.overallRiskScore,
          riskDimensions: assessment.dimensions,
          baseline,
          behaviorAnalytics: behaviorReport,
          eventsCount: events.length,
          reviewerNotes: currentReview?.reviewerNotes || null,
          reviewedAt: currentReview?.reviewedAt || null,
        });
      } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
      }
    });

    // 3. GET Integrity Report (JSON or HTML/PDF)
    this.router.get('/report/:id', async (req: Request, res: Response) => {
      try {
        const sessionId = req.params.id;
        const events = await this.eventStore.getSessionEvents(sessionId);

        if (events.length === 0) {
          return res.status(404).json({ success: false, message: `Session "${sessionId}" not found.` });
        }

        const candidateId = events[0].candidateId || 'unknown';
        const examId = events[0].examId || 'unknown';
        const organizationId = 'default_org';

        const baseline = this.baselineEngine.getSessionBaseline(sessionId);
        const behaviorReport = this.behaviorAnalytics.generateBehaviorReport(sessionId, candidateId, events);
        const assessment = this.riskEngine.evaluateAssessment(sessionId, candidateId, examId, organizationId, events, baseline, behaviorReport, this.currentPolicy);
        const evidencePackage = this.evidenceAggregator.aggregateEvidence(sessionId, candidateId, examId, organizationId, events);

        const currentReview = this.reviewStates.get(sessionId);
        const report = this.reportGenerator.generateReport(assessment, behaviorReport, evidencePackage, currentReview?.reviewerNotes, currentReview?.status);

        if (req.query.format === 'html' || req.headers.accept?.includes('text/html')) {
          const html = this.reportGenerator.generateHTMLReport(report);
          res.setHeader('Content-Type', 'text/html');
          return res.send(html);
        }

        return res.json({ success: true, report });
      } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
      }
    });

    // 4. POST Review State & Notes Update
    this.router.post('/review/:id', (req: Request, res: Response) => {
      try {
        const sessionId = req.params.id;
        const { status, reviewerNotes, reviewerId } = req.body;

        const validStatuses: ReviewStatus[] = [
          'PENDING_REVIEW',
          'UNDER_REVIEW',
          'REQUIRES_ADDITIONAL_EVIDENCE',
          'CLEARED',
          'CONFIRMED_VIOLATION',
          'APPEALED',
          'CLOSED',
        ];

        if (!status || !validStatuses.includes(status)) {
          return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const reviewedAt = new Date().toISOString();
        this.reviewStates.set(sessionId, { status, reviewerNotes, reviewerId, reviewedAt });

        this.auditService.logAction({
          sessionId,
          action: 'REVIEW_STATUS_UPDATED',
          actorId: reviewerId || 'proctor_admin',
          policyVersion: this.currentPolicy.version,
          details: { status, reviewerNotes },
        });

        return res.json({ success: true, sessionId, status, reviewerNotes, reviewedAt });
      } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
      }
    });

    // 5. Admin Policy Management API
    this.router.get('/policy', (req: Request, res: Response) => {
      return res.json({ success: true, policy: this.currentPolicy });
    });

    this.router.put('/policy', (req: Request, res: Response) => {
      try {
        const newPolicy = req.body as IntegrityPolicyConfig;
        if (!newPolicy || !newPolicy.weights || !newPolicy.thresholds) {
          return res.status(400).json({ success: false, error: 'Invalid policy configuration structure.' });
        }

        this.currentPolicy = { ...newPolicy };

        this.auditService.logAction({
          sessionId: 'SYSTEM',
          action: 'POLICY_UPDATED',
          actorId: req.body.updatedBy || 'admin',
          policyVersion: newPolicy.version || '1.0.1',
          details: { newWeights: newPolicy.weights },
        });

        return res.json({ success: true, policy: this.currentPolicy });
      } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
      }
    });
  }
}
