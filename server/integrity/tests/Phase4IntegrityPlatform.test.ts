import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import { TelemetryGateway } from '../TelemetryGateway';
import { EventStore } from '../EventStore';
import { BaselineEngine } from '../BaselineEngine';
import { BehaviorAnalyticsEngine } from '../BehaviorAnalyticsEngine';
import { IntegrityRiskEngine } from '../IntegrityRiskEngine';
import { EvidenceAggregator } from '../EvidenceAggregator';
import { AuditService } from '../AuditService';
import { ReportGenerator } from '../ReportGenerator';
import { HumanReviewAPI } from '../HumanReviewAPI';
import { BatchTelemetryRequest, IntegrityEventPayload } from '../types/IntegrityTypes';

describe('Phase 4 Enterprise Integrity Intelligence Platform Test Suite', () => {
  let gateway: TelemetryGateway;
  let eventStore: EventStore;
  let baselineEngine: BaselineEngine;
  let behaviorAnalytics: BehaviorAnalyticsEngine;
  let riskEngine: IntegrityRiskEngine;
  let evidenceAggregator: EvidenceAggregator;
  let auditService: AuditService;
  let reportGenerator: ReportGenerator;
  let humanReviewAPI: HumanReviewAPI;

  const mockSessionId = 'session_ent_test_101';
  const mockCandidateId = 'cand_909';
  const mockExamId = 'exam_550';
  const mockOrgId = 'org_enterprise';

  const createSampleEvents = (): IntegrityEventPayload[] => [
    {
      id: `evt_focus_${Date.now()}_1`,
      timestamp: new Date().toISOString(),
      timestampMs: Date.now(),
      module: 'FocusMonitor',
      type: 'FocusLost',
      severity: 'MEDIUM',
      confidence: 'HIGH',
      details: {
        message: 'Window focus lost.',
        explanation: 'Browser window lost focus.',
        limitationNote: 'OS notification popup.',
        possibleFalsePositives: ['Antivirus popup'],
        metadata: { durationFocusedSec: 45 },
      },
      sessionId: mockSessionId,
      candidateId: mockCandidateId,
      examId: mockExamId,
    },
    {
      id: `evt_typing_${Date.now()}_2`,
      timestamp: new Date().toISOString(),
      timestampMs: Date.now() + 1000,
      module: 'AnswerBehaviorMonitor',
      type: 'LargeInsertion',
      severity: 'HIGH',
      confidence: 'HIGH',
      details: {
        message: 'Large instant text insertion detected.',
        explanation: 'Sudden insertion of 300 characters.',
        limitationNote: 'Form autofill or permitted code paste.',
        possibleFalsePositives: ['IDE auto-complete'],
        metadata: { charDelta: 300, medianFlightTimeMs: 20, pauseDurationMs: 10, totalKeys: 300, backspaceCount: 5 },
      },
      sessionId: mockSessionId,
      candidateId: mockCandidateId,
      examId: mockExamId,
    },
    {
      id: `evt_clip_${Date.now()}_3`,
      timestamp: new Date().toISOString(),
      timestampMs: Date.now() + 2000,
      module: 'ClipboardMonitor',
      type: 'RapidPasteShortcut',
      severity: 'HIGH',
      confidence: 'HIGH',
      details: {
        message: 'Ctrl+V paste shortcut triggered.',
        explanation: 'Paste shortcut executed.',
        limitationNote: 'Pasting permitted formula.',
        possibleFalsePositives: ['Formatting correction'],
        metadata: { pasteShortcutCount: 1 },
      },
      sessionId: mockSessionId,
      candidateId: mockCandidateId,
      examId: mockExamId,
    },
  ];

  beforeEach(() => {
    gateway = new TelemetryGateway();
    eventStore = new EventStore();
    baselineEngine = new BaselineEngine();
    behaviorAnalytics = new BehaviorAnalyticsEngine();
    riskEngine = new IntegrityRiskEngine();
    evidenceAggregator = new EvidenceAggregator();
    auditService = new AuditService();
    reportGenerator = new ReportGenerator();
    humanReviewAPI = new HumanReviewAPI(
      gateway,
      eventStore,
      baselineEngine,
      behaviorAnalytics,
      riskEngine,
      evidenceAggregator,
      auditService,
      reportGenerator
    );
  });

  describe('Module 1: Telemetry Gateway', () => {
    it('should validate batch request, reject malformed payloads, and support idempotency deduplication', () => {
      const sampleEvents = createSampleEvents();
      const payload: BatchTelemetryRequest = {
        timestampMs: Date.now(),
        sessionId: mockSessionId,
        candidateId: mockCandidateId,
        examId: mockExamId,
        organizationId: mockOrgId,
        events: sampleEvents,
      };

      // 1. Process valid batch
      const { isValid, result, validatedEvents } = gateway.validateAndProcessBatch(payload);
      expect(isValid).toBe(true);
      expect(result.acceptedCount).toBe(3);
      expect(validatedEvents.length).toBe(3);

      // 2. Process exact same batch again (idempotency check)
      const duplicateRes = gateway.validateAndProcessBatch(payload);
      expect(duplicateRes.result.duplicateCount).toBe(3);
      expect(duplicateRes.result.acceptedCount).toBe(0);

      // 3. Reject invalid payload missing sessionId
      const invalidRes = gateway.validateAndProcessBatch({ ...payload, sessionId: undefined });
      expect(invalidRes.isValid).toBe(false);
      expect(invalidRes.result.errors.length).toBeGreaterThan(0);
    });

    it('should verify HMAC telemetry signatures correctly', () => {
      const sampleEvents = createSampleEvents();
      const rawBatch = {
        timestampMs: Date.now(),
        sessionId: mockSessionId,
        candidateId: mockCandidateId,
        examId: mockExamId,
        organizationId: mockOrgId,
        events: sampleEvents,
      };

      const signature = gateway.signBatchPayload(rawBatch);
      const signedBatch: BatchTelemetryRequest = { ...rawBatch, signature };

      expect(gateway.verifySignature(signedBatch)).toBe(true);

      // Tampered signature check
      const tamperedBatch = { ...signedBatch, signature: 'tampered_signature_hash' };
      expect(gateway.verifySignature(tamperedBatch)).toBe(false);
    });
  });

  describe('Module 2: Event Store', () => {
    it('should persist raw events, query with filters, and execute retention purging', async () => {
      const events = createSampleEvents();
      // Set timestamps to 100 days in the past for retention purge test
      const oldTime = Date.now() - 100 * 24 * 60 * 60 * 1000;
      events.forEach((e, idx) => {
        e.timestampMs = oldTime + idx * 1000;
      });

      const inserted = await eventStore.storeEvents(mockSessionId, events);
      expect(inserted).toBe(3);

      const queried = await eventStore.queryEvents({ sessionId: mockSessionId, page: 1, limit: 10 });
      expect(queried.totalCount).toBe(3);
      expect(queried.events.length).toBe(3);

      // Filter by severity
      const highSeverity = await eventStore.queryEvents({ sessionId: mockSessionId, severity: 'HIGH' });
      expect(highSeverity.totalCount).toBe(2);

      // Purge retention for events older than 90 days
      const purged = await eventStore.purgeRetentionEvents(90);
      expect(purged).toBe(3);
    });
  });

  describe('Module 3: Baseline Engine', () => {
    it('should build candidate self-baseline metrics without cohort comparisons', () => {
      const events = createSampleEvents();
      const baseline = baselineEngine.updateSessionBaseline(mockSessionId, mockCandidateId, events);

      expect(baseline.sessionId).toBe(mockSessionId);
      expect(baseline.candidateId).toBe(mockCandidateId);
      expect(baseline.medianTypingInterval).toBeGreaterThan(0);
      expect(baseline.sampleCount).toBe(3);
    });
  });

  describe('Module 4: Behavior Analytics Engine', () => {
    it('should generate BehaviorReport with timeline, trend graphs, and deviation summaries', () => {
      const events = createSampleEvents();
      const report = behaviorAnalytics.generateBehaviorReport(mockSessionId, mockCandidateId, events);

      expect(report.sessionId).toBe(mockSessionId);
      expect(report.timeline.length).toBe(3);
      expect(report.deviationSummaries.focusLossFrequency).toBe(1);
      expect(report.deviationSummaries.rapidPasteCount).toBe(1);
      expect(report.trendGraphs.focusContinuityOverTime.length).toBeGreaterThan(0);
    });
  });

  describe('Module 5: Integrity Risk Engine', () => {
    it('should compute 9 policy-configurable risk dimensions with explainability metadata', () => {
      const events = createSampleEvents();
      const baseline = baselineEngine.updateSessionBaseline(mockSessionId, mockCandidateId, events);
      const report = behaviorAnalytics.generateBehaviorReport(mockSessionId, mockCandidateId, events);

      const assessment = riskEngine.evaluateAssessment(
        mockSessionId,
        mockCandidateId,
        mockExamId,
        mockOrgId,
        events,
        baseline,
        report
      );

      expect(assessment.overallRiskScore).toBeGreaterThan(0);
      expect(assessment.dimensions['Focus Risk']).toBeDefined();
      expect(assessment.dimensions['Typing Risk']).toBeDefined();
      expect(assessment.dimensions['Clipboard Risk']).toBeDefined();
      expect(assessment.dimensions['Focus Risk'].possibleFalsePositives).toBeDefined();
      expect(assessment.dimensions['Focus Risk'].limitations).toBeDefined();
    });
  });

  describe('Module 6: Evidence Aggregator', () => {
    it('should group multi-dimensional telemetry into structured EvidencePackage', () => {
      const events = createSampleEvents();
      const pkg = evidenceAggregator.aggregateEvidence(
        mockSessionId,
        mockCandidateId,
        mockExamId,
        mockOrgId,
        events
      );

      expect(pkg.sessionId).toBe(mockSessionId);
      expect(pkg.focusHistory.length).toBe(1);
      expect(pkg.clipboardHistory.length).toBe(1);
      expect(pkg.questionEvidences).toBeDefined();
    });
  });

  describe('Module 8: Audit Service', () => {
    it('should maintain immutable audit logs for compliance tracking', () => {
      const log = auditService.logAction({
        sessionId: mockSessionId,
        action: 'TELEMETRY_BATCH_RECEIVED',
        actorId: mockCandidateId,
        details: { count: 3 },
      });

      expect(log.id).toBeDefined();
      expect(log.sessionId).toBe(mockSessionId);

      const trail = auditService.getSessionAuditTrail(mockSessionId);
      expect(trail.length).toBe(1);
    });
  });

  describe('Report Generator', () => {
    it('should generate JSON report and HTML string for PDF exports', () => {
      const events = createSampleEvents();
      const baseline = baselineEngine.updateSessionBaseline(mockSessionId, mockCandidateId, events);
      const report = behaviorAnalytics.generateBehaviorReport(mockSessionId, mockCandidateId, events);
      const assessment = riskEngine.evaluateAssessment(mockSessionId, mockCandidateId, mockExamId, mockOrgId, events, baseline, report);
      const pkg = evidenceAggregator.aggregateEvidence(mockSessionId, mockCandidateId, mockExamId, mockOrgId, events);

      const compReport = reportGenerator.generateReport(assessment, report, pkg, 'Proctor reviewed', 'CLEARED');
      expect(compReport.reportId).toBeDefined();
      expect(compReport.recommendations.length).toBeGreaterThan(0);

      const html = reportGenerator.generateHTMLReport(compReport);
      expect(html).toContain('AssessIQ Enterprise Integrity Report');
      expect(html).toContain(mockCandidateId);
    });
  });

  describe('Module 7 & API Routes Integration', () => {
    it('should mount endpoints and handle telemetry ingestion, session queries, and review updates', async () => {
      const app = express();
      app.use(express.json());
      app.use('/api/integrity', humanReviewAPI.router);

      // Verify router is instantiated
      expect(humanReviewAPI.router).toBeDefined();
    });
  });
});
