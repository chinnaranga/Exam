import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IntegrityConfidenceEngine } from '../IntegrityConfidenceEngine';
import { CrossCandidateAnalysisEngine, CandidateSessionSubmission } from '../CrossCandidateAnalysisEngine';
import { CodeSimilarityAndSandboxEngine } from '../CodeSimilarityAndSandboxEngine';
import { EssayIntegrityEngine, KeystrokeMutation } from '../EssayIntegrityEngine';
import { HumanReviewQueueService } from '../HumanReviewQueueService';
import { AppealsAndRetentionService } from '../AppealsAndRetentionService';
import { DailyLedgerAnchorService } from '../DailyLedgerAnchorService';
import { InvigilatorActionController } from '../InvigilatorActionController';
import { ExamSessionAuthority } from '../ExamSessionAuthority';

describe('Layer 5 & Invigilator Platform Test Suite', () => {
  let authority: ExamSessionAuthority;

  beforeEach(() => {
    authority = new ExamSessionAuthority();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. INTEGRITY CONFIDENCE SCORE
  // ─────────────────────────────────────────────────────────────────────────────
  describe('IntegrityConfidenceEngine (0-100% Score)', () => {
    const engine = new IntegrityConfidenceEngine();

    it('produces 100% EXCELLENT score for a clean exam session', () => {
      const result = engine.calculateConfidenceScore({
        sessionId: 'sess_clean',
        violationPoints: 0,
        gazeVariance: 0.05,
        pasteRatio: 0.0,
        responseTimeAnomaliesCount: 0,
        totalQuestionsAnswered: 20,
      });

      expect(result.integrityConfidenceScore).toBe(100);
      expect(result.rating).toBe('EXCELLENT');
      expect(result.deductions.length).toBe(0);
      expect(result.subScores.violationScore).toBe(100);
    });

    it('penalizes violation points, high gaze variance, and paste bursts', () => {
      const result = engine.calculateConfidenceScore({
        sessionId: 'sess_suspicious',
        violationPoints: 4, // 50% violation score
        gazeVariance: 0.70, // 30% gaze stability
        pasteRatio: 0.80, // heavy paste penalty
        responseTimeAnomaliesCount: 5,
        totalQuestionsAnswered: 10,
      });

      expect(result.integrityConfidenceScore).toBeLessThan(50);
      expect(['SUSPICIOUS', 'CRITICAL']).toContain(result.rating);
      expect(result.deductions.length).toBeGreaterThanOrEqual(3);
      expect(result.deductions.some((d) => d.factor === 'VIOLATION_POINTS')).toBe(true);
      expect(result.deductions.some((d) => d.factor === 'PASTE_RATIO')).toBe(true);
    });

    it('drops score to CRITICAL when violation points reach 8 (termination threshold)', () => {
      const result = engine.calculateConfidenceScore({
        sessionId: 'sess_terminated',
        violationPoints: 8,
        gazeVariance: 0.30,
        pasteRatio: 0.50,
      });

      expect(result.subScores.violationScore).toBe(0);
      expect(result.integrityConfidenceScore).toBeLessThan(40);
      expect(result.rating).toBe('CRITICAL');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. CROSS-CANDIDATE COLLUSION ANALYSIS
  // ─────────────────────────────────────────────────────────────────────────────
  describe('CrossCandidateAnalysisEngine (Collusion & Similarity)', () => {
    const engine = new CrossCandidateAnalysisEngine();

    const correctAnswers = {
      q1: 1,
      q2: 2,
      q3: 0,
      q4: 3,
      q5: 1,
    };

    it('detects identical wrong answers, shared IP, and synchronized timing', () => {
      const subA: CandidateSessionSubmission = {
        sessionId: 'sess_A',
        candidateId: 'cand_A',
        examId: 'exam_cs_402',
        ipAddress: '198.51.100.5',
        answers: {
          q1: { selectedOption: 3, answeredAt: 10000 }, // WRONG (expected 1)
          q2: { selectedOption: 0, answeredAt: 20000 }, // WRONG (expected 2)
          q3: { selectedOption: 2, answeredAt: 30000 }, // WRONG (expected 0)
          q4: { selectedOption: 3, answeredAt: 40000 }, // CORRECT
          q5: { selectedOption: 1, answeredAt: 50000 }, // CORRECT
        },
      };

      const subB: CandidateSessionSubmission = {
        sessionId: 'sess_B',
        candidateId: 'cand_B',
        examId: 'exam_cs_402',
        ipAddress: '198.51.100.5', // Shared IP!
        answers: {
          q1: { selectedOption: 3, answeredAt: 10800 }, // EXACT SAME WRONG (0.8s diff)
          q2: { selectedOption: 0, answeredAt: 21200 }, // EXACT SAME WRONG (1.2s diff)
          q3: { selectedOption: 2, answeredAt: 30500 }, // EXACT SAME WRONG (0.5s diff)
          q4: { selectedOption: 3, answeredAt: 40900 },
          q5: { selectedOption: 1, answeredAt: 51100 },
        },
      };

      const report = engine.analyzeExamCohort('exam_cs_402', [subA, subB], correctAnswers);

      expect(report.totalCandidatesAnalyzed).toBe(2);
      expect(report.suspectedCollusionPairs.length).toBe(1);

      const pair = report.suspectedCollusionPairs[0];
      expect(pair.sharedIp).toBe(true);
      expect(pair.identicalWrongAnswersCount).toBe(3);
      expect(pair.synchronizedAnswerCount).toBe(5);
      expect(pair.isSuspectedCollusion).toBe(true);
      expect(report.collusionClusters.length).toBe(1);
    });

    it('does not flag independent candidates with different IPs and varied answers', () => {
      const subA: CandidateSessionSubmission = {
        sessionId: 'sess_A',
        candidateId: 'cand_A',
        examId: 'exam_cs_402',
        ipAddress: '198.51.100.1',
        answers: {
          q1: { selectedOption: 1, answeredAt: 10000 },
          q2: { selectedOption: 2, answeredAt: 25000 },
        },
      };

      const subC: CandidateSessionSubmission = {
        sessionId: 'sess_C',
        candidateId: 'cand_C',
        examId: 'exam_cs_402',
        ipAddress: '203.0.113.88',
        answers: {
          q1: { selectedOption: 0, answeredAt: 60000 },
          q2: { selectedOption: 1, answeredAt: 95000 },
        },
      };

      const report = engine.analyzeExamCohort('exam_cs_402', [subA, subC], correctAnswers);
      expect(report.suspectedCollusionPairs.length).toBe(0);
      expect(report.collusionClusters.length).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. CODE SIMILARITY & ISOLATED SANDBOX
  // ─────────────────────────────────────────────────────────────────────────────
  describe('CodeSimilarityAndSandboxEngine', () => {
    const engine = new CodeSimilarityAndSandboxEngine();

    it('detects code plagiarism despite renamed variables and altered comments', () => {
      const codeA = `
        // Check if number is prime
        function isPrime(n) {
          if (n <= 1) return false;
          for (let i = 2; i * i <= n; i++) {
            if (n % i === 0) return false;
          }
          return true;
        }
      `;

      const codeB = `
        /* Utility to test primality */
        function checkValue(x) {
          if (x <= 1) return false;
          for (let factor = 2; factor * factor <= x; factor++) {
            if (x % factor === 0) return false;
          }
          return true;
        }
      `;

      const comparison = engine.compareCodeSubmissions('cand_1', codeA, 'cand_2', codeB);
      expect(comparison.similarityPercentage).toBeGreaterThanOrEqual(75);
      expect(comparison.isPlagiarismSuspected).toBe(true);
      expect(comparison.tokenOverlapRatio).toBeGreaterThan(0.7);
    });

    it('safely runs candidate code in sandbox without network or process access', async () => {
      const candidateCode = `
        function solve(a, b) {
          return a * b + 10;
        }
        console.log("Result:", solve(5, 4));
      `;

      const result = await engine.executeInSandbox(candidateCode, { timeoutMs: 1500 });
      expect(result.success).toBe(true);
      expect(result.output).toContain('Result: 30');
      expect(result.timedOut).toBe(false);
    });

    it('aborts infinite loops within the specified timeout limit', async () => {
      const infiniteLoopCode = `
        let x = 0;
        while (true) {
          x++;
        }
      `;

      const result = await engine.executeInSandbox(infiniteLoopCode, { timeoutMs: 300 });
      expect(result.success).toBe(false);
      expect(result.timedOut).toBe(true);
      expect(result.error).toContain('timed out');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. ESSAY INTEGRITY & REVISION REPLAY
  // ─────────────────────────────────────────────────────────────────────────────
  describe('EssayIntegrityEngine', () => {
    const engine = new EssayIntegrityEngine();

    it('detects high paste ratio, builds revision history replay, and advisory AI indicator', () => {
      const essayText = 'In conclusion, the architecture of modern distributed systems plays a pivotal role in scalability. Furthermore, the consensus protocol is crucial.';
      const mutations: KeystrokeMutation[] = [
        { type: 'INSERT', charCount: 15, textSnippet: 'In conclusion, ', timestamp: 1000 },
        { type: 'PASTE', charCount: 120, textSnippet: essayText.slice(15), timestamp: 2000 },
      ];

      const analysis = engine.analyzeEssay(
        'essay_101',
        'sess_essay_test',
        'cand_student_01',
        essayText,
        mutations,
        [120, 110, 115]
      );

      expect(analysis.pasteRatio).toBeGreaterThan(0.7);
      expect(analysis.pasteBurstsCount).toBe(1);
      expect(analysis.revisionHistory.length).toBeGreaterThanOrEqual(2);
      expect(analysis.isFlaggedForReview).toBe(true);

      // AI-Text flag MUST have isProof = false per specification
      expect(analysis.aiTextIndicator.isProof).toBe(false);
      expect(analysis.aiTextIndicator.advisoryNote).toContain('Advisory signal only');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. HUMAN REVIEW QUEUE
  // ─────────────────────────────────────────────────────────────────────────────
  describe('HumanReviewQueueService (Clear / Warn / Invalidate)', () => {
    let queueService: HumanReviewQueueService;

    beforeEach(() => {
      queueService = new HumanReviewQueueService(authority);
    });

    it('enqueues flagged sessions, assigns reviewers, and records decisions to ledger', () => {
      authority.startSession({
        sessionId: 'sess_queue_test',
        candidateId: 'cand_flagged',
        durationSeconds: 3600,
      });

      const item = queueService.enqueueSession({
        sessionId: 'sess_queue_test',
        candidateId: 'cand_flagged',
        candidateName: 'John Doe',
        examId: 'exam_cs_402',
        flagReasons: ['DevTools opened', 'High paste ratio'],
        integrityConfidenceScore: 45,
        violationPoints: 5,
      });

      expect(item.status).toBe('PENDING');
      expect(item.priority).toBe('HIGH');

      // Assign Reviewer
      const assigned = queueService.assignReviewer('sess_queue_test', 'proctor_jane');
      expect(assigned.status).toBe('IN_REVIEW');
      expect(assigned.assignedReviewerId).toBe('proctor_jane');

      // Record Decision: WARN
      const resolved = queueService.recordDecision(
        'sess_queue_test',
        'WARN',
        'proctor_jane',
        'Candidate acknowledged secondary window. Warning issued.'
      );

      expect(resolved.status).toBe('RESOLVED');
      expect(resolved.decision).toBe('WARN');

      // Check Audit Trail
      const audits = queueService.getAuditTrail('sess_queue_test');
      expect(audits.length).toBe(3); // ENQUEUED, ASSIGNED, DECISION_MADE

      // Verify Ledger Record in authority
      const session = authority.getSession('sess_queue_test')!;
      expect(session.ledger.some((r) => (r.eventData as any).type === 'HUMAN_REVIEW_DECISION_WARN')).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. APPEALS SYSTEM & EVIDENCE AUTO-DELETION
  // ─────────────────────────────────────────────────────────────────────────────
  describe('AppealsAndRetentionService', () => {
    let service: AppealsAndRetentionService;

    beforeEach(() => {
      service = new AppealsAndRetentionService(authority);
    });

    it('accepts appeals within the window and rejects appeals after expiration', () => {
      authority.startSession({
        sessionId: 'sess_appeal_test',
        candidateId: 'cand_appeal',
        durationSeconds: 3600,
      });

      service.registerSessionEvidence(
        'sess_appeal_test',
        'cand_appeal',
        10, // snapshots
        250, // gaze
        15, // clipboard
        'root_hash_abc123',
        7 // 7 days window
      );

      // Within window: Submit Appeal
      const appeal = service.submitAppeal({
        sessionId: 'sess_appeal_test',
        candidateId: 'cand_appeal',
        examId: 'exam_cs_402',
        triggeredRulesSummary: [
          { ruleId: 'FULLSCREEN_EXIT', ruleName: 'Fullscreen Exit', severity: 'HIGH', description: 'Exited fullscreen', occurredAt: Date.now() },
        ],
        candidateStatement: 'My antivirus displayed an OS-level modal that stole focus.',
      });

      expect(appeal.status).toBe('PENDING');

      // Resolve Appeal: APPROVE
      const resolved = service.resolveAppeal(
        'sess_appeal_test',
        'APPROVED',
        'chief_proctor_bob',
        'Antivirus log provided. Appeal approved.'
      );
      expect(resolved.status).toBe('APPROVED');

      // After 8 days: Expiration
      const nowEightDaysLater = Date.now() + 8 * 24 * 60 * 60 * 1000;
      expect(service.isAppealWindowOpen('sess_appeal_test', nowEightDaysLater)).toBe(false);
    });

    it('purges raw biometric evidence after appeal window closes while retaining ledger root hash', () => {
      authority.startSession({
        sessionId: 'sess_purge_test',
        candidateId: 'cand_purge',
        durationSeconds: 3600,
      });

      service.registerSessionEvidence(
        'sess_purge_test',
        'cand_purge',
        15,
        500,
        20,
        'ledger_root_hash_xyz',
        7
      );

      // Purge 8 days later
      const futureNow = Date.now() + 8 * 24 * 60 * 60 * 1000;
      const purgeResult = service.purgeExpiredEvidence(futureNow);

      expect(purgeResult.purgedSessionsCount).toBe(1);
      expect(purgeResult.purgedSessionIds).toContain('sess_purge_test');

      const pkg = service.getEvidencePackage('sess_purge_test')!;
      expect(pkg.isPurged).toBe(true);
      expect(pkg.rawBiometricSnapshotsCount).toBe(0);
      expect(pkg.gazeTelemetryRecordsCount).toBe(0);
      expect(pkg.retainedLedgerHash).toBe('ledger_root_hash_xyz'); // Immutable proof retained
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. INVIGILATOR ACTIONS & LEDGER LOGGING
  // ─────────────────────────────────────────────────────────────────────────────
  describe('InvigilatorActionController Ledger Interventions', () => {
    let controller: InvigilatorActionController;

    beforeEach(() => {
      controller = new InvigilatorActionController(authority);
    });

    it('logs pause, resume, re-scan, messaging, and escalation directly in the authority ledger', () => {
      const sessionId = 'sess_invigilator_ledger_test';
      authority.startSession({
        sessionId,
        candidateId: 'cand_test_01',
        durationSeconds: 3600,
      });

      // Pause session
      const session = authority.getSession(sessionId)!;
      authority.appendLedgerRecord(session, {
        type: 'INVIGILATOR_ACTION_PAUSE',
        ts: Date.now(),
        payload: { invigilatorId: 'proctor_1', reason: 'Security check' },
      });

      // Request re-scan
      authority.appendLedgerRecord(session, {
        type: 'INVIGILATOR_ACTION_ROOM_RESCAN_REQUESTED',
        ts: Date.now(),
        payload: { invigilatorId: 'proctor_1', instructions: '360 scan' },
      });

      // Direct Message
      authority.appendLedgerRecord(session, {
        type: 'INVIGILATOR_DIRECT_MESSAGE_SENT',
        ts: Date.now(),
        payload: { invigilatorId: 'proctor_1', text: 'Please center face' },
      });

      // Escalate
      authority.appendLedgerRecord(session, {
        type: 'INVIGILATOR_ACTION_ESCALATE_CHIEF_PROCTOR',
        ts: Date.now(),
        payload: { invigilatorId: 'proctor_1', reason: 'Suspicious device' },
      });

      // Resume
      authority.appendLedgerRecord(session, {
        type: 'INVIGILATOR_ACTION_RESUME',
        ts: Date.now(),
        payload: { invigilatorId: 'proctor_1' },
      });

      // Verify all actions are committed to the tamper-proof hash-chained ledger
      const verification = authority.verifyLedger(sessionId);
      expect(verification.valid).toBe(true);
      expect(session.ledger.length).toBeGreaterThanOrEqual(5);

      const eventTypes = session.ledger.map((r) => (r.eventData as any).type);
      expect(eventTypes).toContain('INVIGILATOR_ACTION_PAUSE');
      expect(eventTypes).toContain('INVIGILATOR_ACTION_ROOM_RESCAN_REQUESTED');
      expect(eventTypes).toContain('INVIGILATOR_DIRECT_MESSAGE_SENT');
      expect(eventTypes).toContain('INVIGILATOR_ACTION_ESCALATE_CHIEF_PROCTOR');
      expect(eventTypes).toContain('INVIGILATOR_ACTION_RESUME');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. DAILY LEDGER ANCHORING
  // ─────────────────────────────────────────────────────────────────────────────
  describe('DailyLedgerAnchorService (Merkle Root Hash)', () => {
    let anchorService: DailyLedgerAnchorService;

    beforeEach(() => {
      anchorService = new DailyLedgerAnchorService(authority);
    });

    it('computes daily root hash, verifies tamper-evidence, and flags retroactive modifications', () => {
      const date = '2026-11-12';
      const sessionHashes = [
        { sessionId: 'sess_1', terminalHash: 'hash_terminal_1_abc' },
        { sessionId: 'sess_2', terminalHash: 'hash_terminal_2_def' },
        { sessionId: 'sess_3', terminalHash: 'hash_terminal_3_ghi' },
      ];

      const anchor = anchorService.generateDailyAnchor(date, sessionHashes, 'admin_proctor');
      expect(anchor.dailyRootHash).toBeDefined();
      expect(anchor.totalSessionsCount).toBe(3);

      // Verify clean anchor
      const cleanVerify = anchorService.verifyDailyAnchor(date, sessionHashes);
      expect(cleanVerify.valid).toBe(true);

      // Verify retroactive tampering detection: sess_2 terminal hash altered
      const tamperedSessionHashes = [
        { sessionId: 'sess_1', terminalHash: 'hash_terminal_1_abc' },
        { sessionId: 'sess_2', terminalHash: 'TAMPERED_MODIFIED_HASH' },
        { sessionId: 'sess_3', terminalHash: 'hash_terminal_3_ghi' },
      ];

      const tamperedVerify = anchorService.verifyDailyAnchor(date, tamperedSessionHashes);
      expect(tamperedVerify.valid).toBe(false);
      expect(tamperedVerify.tamperedSessionIds).toContain('sess_2');
      expect(tamperedVerify.reason).toContain('Cryptographic root hash mismatch');
    });
  });
});
