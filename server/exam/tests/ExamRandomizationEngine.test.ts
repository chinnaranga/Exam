import crypto from 'crypto';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  ExamRandomizationEngine,
  ExamSpecification,
  SeededPRNG,
  evaluateSafeFormula,
} from '../ExamRandomizationEngine';
import { ExamSessionAuthority } from '../../integrity/ExamSessionAuthority';
import { ViolationEngine } from '../../integrity/ViolationEngine';

describe('ExamRandomizationEngine & Hash-Chained Autosave', () => {
  let authority: ExamSessionAuthority;
  let violations: ViolationEngine;
  let engine: ExamRandomizationEngine;

  const sampleExamSpec: ExamSpecification = {
    examId: 'exam_cs402_master',
    title: 'Distributed Systems & Network Consensus',
    sections: [
      {
        id: 'sec_raft',
        title: 'Section A: Raft Consensus Protocols',
        forwardOnly: true,
        lockOnComplete: true,
        perQuestionTimeCapSeconds: 60,
        pools: [
          {
            topic: 'Leader Election',
            pickCount: 2,
            questions: [
              {
                id: 'q_elect_1',
                topic: 'Leader Election',
                sectionId: 'sec_raft',
                stem: 'In Raft, what triggers a follower to become a candidate?',
                type: 'MULTIPLE_CHOICE',
                points: 2,
                options: [
                  { id: 'opt_1a', text: 'Election timeout elapses without receiving AppendEntries heartbeat.', isCorrect: true },
                  { id: 'opt_1b', text: 'Client issues a write transaction to follower.', isCorrect: false },
                  { id: 'opt_1c', text: 'Leader sends Terminate signal.', isCorrect: false },
                  { id: 'opt_1d', text: 'Follower receives vote request from minority node.', isCorrect: false },
                ],
              },
              {
                id: 'q_elect_2',
                topic: 'Leader Election',
                sectionId: 'sec_raft',
                stem: 'What prevents split-vote cycles during Raft leader elections?',
                type: 'MULTIPLE_CHOICE',
                points: 2,
                options: [
                  { id: 'opt_2a', text: 'Randomized election timeouts between 150ms and 300ms.', isCorrect: true },
                  { id: 'opt_2b', text: 'Fixed round-robin node priority.', isCorrect: false },
                  { id: 'opt_2c', text: 'Lamport timestamps on candidate declarations.', isCorrect: false },
                ],
              },
              {
                id: 'q_elect_3',
                topic: 'Leader Election',
                sectionId: 'sec_raft',
                stem: 'What does a candidate do when discovering a leader with term >= currentTerm?',
                type: 'MULTIPLE_CHOICE',
                points: 2,
                options: [
                  { id: 'opt_3a', text: 'Reverts to follower state and updates currentTerm.', isCorrect: true },
                  { id: 'opt_3b', text: 'Disregards the leader and forces re-election.', isCorrect: false },
                  { id: 'opt_3c', text: 'Increments term and broadcasts vote requests.', isCorrect: false },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sec_numeric',
        title: 'Section B: Quantitative Telemetry Calculations',
        forwardOnly: false,
        lockOnComplete: true,
        pools: [
          {
            topic: 'Bandwidth Delay Product',
            pickCount: 1,
            questions: [
              {
                id: 'q_bdp_1',
                topic: 'Bandwidth Delay Product',
                sectionId: 'sec_numeric',
                stem: 'Calculate the transmission delay in ms.',
                type: 'PARAMETERIZED_NUMERIC',
                points: 5,
                parameterizedConfig: {
                  template:
                    'A payload of {packetSize} KB is transmitted across a {bandwidth} Mbps WAN link. What is the transmission delay in milliseconds?',
                  params: {
                    packetSize: { min: 100, max: 1000, step: 100 },
                    bandwidth: { min: 10, max: 100, step: 10 },
                  },
                  formula: '(packetSize * 8) / bandwidth',
                  tolerance: 0.02,
                  unit: 'ms',
                },
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    authority = new ExamSessionAuthority();
    violations = new ViolationEngine(authority);
    engine = new ExamRandomizationEngine(authority, violations);
  });

  afterEach(() => {
    engine.clear();
    violations.clear();
    authority.clear();
  });

  describe('1. Seeded PRNG & Reproducibility', () => {
    it('produces identical output for identical seeds', () => {
      const prng1 = new SeededPRNG('sess_candidate_alpha');
      const prng2 = new SeededPRNG('sess_candidate_alpha');

      const seq1 = [prng1.next(), prng1.nextInt(1, 100), prng1.nextInt(50, 500, 10)];
      const seq2 = [prng2.next(), prng2.nextInt(1, 100), prng2.nextInt(50, 500, 10)];

      expect(seq1).toEqual(seq2);
    });

    it('produces different sequences for different session seeds', () => {
      const prng1 = new SeededPRNG('sess_candidate_alpha');
      const prng2 = new SeededPRNG('sess_candidate_beta');

      expect(prng1.next()).not.toEqual(prng2.next());
    });

    it('generates 100% reproducible exam randomization when re-run with the same sessionId', () => {
      const session1 = authority.startSession({
        sessionId: 'sess_repro_101',
        candidateId: 'cand_101',
        examId: 'exam_cs402_master',
        durationSeconds: 3600,
      });

      const view1 = engine.generateSessionExam({
        sessionId: session1.id,
        candidateId: 'cand_101',
        examSpec: sampleExamSpec,
      });

      const view2 = engine.generateSessionExam({
        sessionId: session1.id,
        candidateId: 'cand_101',
        examSpec: sampleExamSpec,
      });

      expect(view1).toEqual(view2);
    });

    it('shuffles differently for different candidate sessions', () => {
      const sessionA = authority.startSession({
        sessionId: 'sess_student_alice',
        candidateId: 'cand_alice',
        durationSeconds: 3600,
      });

      const sessionB = authority.startSession({
        sessionId: 'sess_student_bob',
        candidateId: 'cand_bob',
        durationSeconds: 3600,
      });

      const viewA = engine.generateSessionExam({
        sessionId: sessionA.id,
        candidateId: 'cand_alice',
        examSpec: sampleExamSpec,
      });

      const viewB = engine.generateSessionExam({
        sessionId: sessionB.id,
        candidateId: 'cand_bob',
        examSpec: sampleExamSpec,
      });

      // Different question IDs or different option orders
      const qIdsA = viewA.sections[0].questions.map((q) => q.id);
      const qIdsB = viewB.sections[0].questions.map((q) => q.id);

      // Either question order or option order differs
      const optOrderA = viewA.sections[0].questions[0].options?.map((o) => o.id);
      const optOrderB = viewB.sections[0].questions[0].options?.map((o) => o.id);

      const hasRandomDifference =
        JSON.stringify(qIdsA) !== JSON.stringify(qIdsB) ||
        JSON.stringify(optOrderA) !== JSON.stringify(optOrderB);

      expect(hasRandomDifference).toBe(true);
    });
  });

  describe('2. Question Pools & Parameterized Questions', () => {
    it('picks exactly N of M questions per pool', () => {
      const session = authority.startSession({
        sessionId: 'sess_pool_test',
        candidateId: 'cand_pool',
        durationSeconds: 3600,
      });

      const view = engine.generateSessionExam({
        sessionId: session.id,
        candidateId: 'cand_pool',
        examSpec: sampleExamSpec,
      });

      // Section A pool specifies pickCount: 2 out of 3 questions
      expect(view.sections[0].questions).toHaveLength(2);
    });

    it('interpolates numeric parameters and evaluates formula safely without leaking answers', () => {
      const session = authority.startSession({
        sessionId: 'sess_numeric_test',
        candidateId: 'cand_numeric',
        durationSeconds: 3600,
      });

      const view = engine.generateSessionExam({
        sessionId: session.id,
        candidateId: 'cand_numeric',
        examSpec: sampleExamSpec,
      });

      const numericQ = view.sections[1].questions[0];
      expect(numericQ.type).toBe('PARAMETERIZED_NUMERIC');
      expect(numericQ.stem).toMatch(/A payload of \d+ KB is transmitted across a \d+ Mbps WAN link\./);
      expect(numericQ.stem).not.toContain('{packetSize}');
      expect(numericQ.stem).not.toContain('{bandwidth}');

      // Client view MUST NOT contain answer or formula
      expect((numericQ as any).formula).toBeUndefined();
      expect((numericQ as any).calculatedNumericAnswer).toBeUndefined();
      expect((numericQ as any).expectedAnswer).toBeUndefined();
    });

    it('evaluates safe arithmetic formula correctly', () => {
      const res = evaluateSafeFormula('(packetSize * 8) / bandwidth', {
        packetSize: 500,
        bandwidth: 50,
      });
      // (500 * 8) / 50 = 4000 / 50 = 80
      expect(res).toBe(80);
    });
  });

  describe('3. Answer Key Secrecy & Server-Side Grading', () => {
    it('never exposes isCorrect or answers in candidate view', () => {
      const session = authority.startSession({
        sessionId: 'sess_secrecy_test',
        candidateId: 'cand_secret',
        durationSeconds: 3600,
      });

      const view = engine.generateSessionExam({
        sessionId: session.id,
        candidateId: 'cand_secret',
        examSpec: sampleExamSpec,
      });

      for (const section of view.sections) {
        for (const q of section.questions) {
          if (q.options) {
            for (const opt of q.options) {
              expect((opt as any).isCorrect).toBeUndefined();
            }
          }
        }
      }
    });

    it('accurately grades candidate submissions on the server', () => {
      const session = authority.startSession({
        sessionId: 'sess_grading_test',
        candidateId: 'cand_grading',
        durationSeconds: 3600,
      });

      const view = engine.generateSessionExam({
        sessionId: session.id,
        candidateId: 'cand_grading',
        examSpec: sampleExamSpec,
      });

      const cache = engine.getSessionExamCache(session.id);
      expect(cache).toBeDefined();

      // Submit all correct answers
      const submissions: Record<string, string | number> = {};
      for (const [qId, key] of cache!.answerKeys.entries()) {
        if (key.type === 'MULTIPLE_CHOICE') {
          submissions[qId] = key.correctOptionId!;
        } else if (key.type === 'PARAMETERIZED_NUMERIC') {
          submissions[qId] = key.calculatedNumericAnswer!;
        }
      }

      const gradeResult = engine.gradeExam(session.id, submissions);
      expect(gradeResult.totalScore).toBe(gradeResult.maxScore);
      expect(gradeResult.percentage).toBe(100);
      expect(gradeResult.passed).toBe(true);
    });
  });

  describe('4. Section Rules & Navigation Locks', () => {
    it('locks completed section when lockOnComplete is true and rejects subsequent submissions', () => {
      const session = authority.startSession({
        sessionId: 'sess_lock_test',
        candidateId: 'cand_lock',
        durationSeconds: 3600,
      });

      engine.generateSessionExam({
        sessionId: session.id,
        candidateId: 'cand_lock',
        examSpec: sampleExamSpec,
      });

      // Before completing section: submission allowed
      const checkBefore = engine.validateSubmissionRule(session.id, 'q_elect_1', 'sec_raft');
      expect(checkBefore.allowed).toBe(true);

      // Candidate completes Section A
      const lockRes = engine.completeSection(session.id, 'sec_raft');
      expect(lockRes.success).toBe(true);

      // After lock: submission rejected
      const checkAfter = engine.validateSubmissionRule(session.id, 'q_elect_1', 'sec_raft');
      expect(checkAfter.allowed).toBe(false);
      expect(checkAfter.reason).toContain('locked and cannot be modified');
    });
  });

  describe('5. Hash-Chained Autosave Verification', () => {
    it('validates a continuous, properly signed autosave hash chain', () => {
      const session = authority.startSession({
        sessionId: 'sess_autosave_valid',
        candidateId: 'cand_autosave',
        durationSeconds: 3600,
      });

      const secret = session.sessionSecret;
      const records: any[] = [];
      let prevHash = '0'.repeat(64);

      for (let seq = 1; seq <= 3; seq++) {
        const canonical = JSON.stringify({
          seq,
          prevHash,
          questionId: `q_${seq}`,
          answer: seq * 2,
          timestamp: 1700000000000 + seq * 1000,
        });

        const hash = crypto.createHmac('sha256', secret).update(canonical).digest('hex');

        records.push({
          index: seq - 1,
          sessionId: session.id,
          prevHash,
          seq,
          questionId: `q_${seq}`,
          answer: seq * 2,
          timestamp: 1700000000000 + seq * 1000,
          hash,
        });

        prevHash = hash;
      }

      const verification = engine.verifyAutosaveChain(session.id, records);
      expect(verification.valid).toBe(true);
    });

    it('detects a broken hash chain link (prevHash tampering) and logs CRITICAL violation', () => {
      const session = authority.startSession({
        sessionId: 'sess_autosave_broken',
        candidateId: 'cand_autosave',
        durationSeconds: 3600,
      });

      const secret = session.sessionSecret;
      const records: any[] = [];
      let prevHash = '0'.repeat(64);

      for (let seq = 1; seq <= 3; seq++) {
        const canonical = JSON.stringify({
          seq,
          prevHash,
          questionId: `q_${seq}`,
          answer: seq,
          timestamp: 1700000000000 + seq * 1000,
        });

        const hash = crypto.createHmac('sha256', secret).update(canonical).digest('hex');

        records.push({
          index: seq - 1,
          sessionId: session.id,
          prevHash,
          seq,
          questionId: `q_${seq}`,
          answer: seq,
          timestamp: 1700000000000 + seq * 1000,
          hash,
        });

        prevHash = hash;
      }

      // Tamper with record 2's prevHash
      records[2].prevHash = 'forged_broken_prev_hash_12345';

      const verification = engine.verifyAutosaveChain(session.id, records);
      expect(verification.valid).toBe(false);
      expect(verification.brokenAtIndex).toBe(2);
      expect(verification.error).toContain('Broken chain link at index 2');

      // CRITICAL violation AUTOSAVE_CHAIN_TAMPERED recorded
      const state = violations.getSessionState(session.id);
      expect(state?.isTerminated).toBe(true);
      expect(state?.violations.some((v) => v.type === 'AUTOSAVE_CHAIN_TAMPERED')).toBe(true);
    });

    it('detects an HMAC tampering attempt on answer payload', () => {
      const session = authority.startSession({
        sessionId: 'sess_autosave_hmac_tamper',
        candidateId: 'cand_autosave',
        durationSeconds: 3600,
      });

      const secret = session.sessionSecret;
      const prevHash = '0'.repeat(64);
      const canonical = JSON.stringify({
        seq: 1,
        prevHash,
        questionId: 'q_1',
        answer: 'option_A',
        timestamp: 1700000000000,
      });

      const hash = crypto.createHmac('sha256', secret).update(canonical).digest('hex');

      const records = [
        {
          index: 0,
          sessionId: session.id,
          prevHash,
          seq: 1,
          questionId: 'q_1',
          answer: 'option_TAMPERED_B', // Answer altered without updating HMAC!
          timestamp: 1700000000000,
          hash,
        },
      ];

      const verification = engine.verifyAutosaveChain(session.id, records);
      expect(verification.valid).toBe(false);
      expect(verification.brokenAtIndex).toBe(0);
      expect(verification.error).toContain('HMAC verification failed');
    });
  });
});

