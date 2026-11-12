import { describe, it, expect, beforeEach } from 'vitest';
import { GradingEngine } from '../GradingEngine';
import { RubricGradingService } from '../RubricGradingService';
import { DoubleMarkingService } from '../DoubleMarkingService';
import { RegradeService } from '../RegradeService';
import { QuestionBankService } from '../QuestionBankService';
import { FileUploadSecurityService } from '../FileUploadSecurityService';
import { ExamSessionAuthority } from '../../integrity/ExamSessionAuthority';
import { AppealsAndRetentionService } from '../../integrity/AppealsAndRetentionService';
import { QuestionDefinition, RubricDefinition } from '../questionTypes';

describe('AssessIQ Question Types and Grading Engine', () => {
  let gradingEngine: GradingEngine;
  let rubricService: RubricGradingService;
  let doubleMarkingService: DoubleMarkingService;
  let regradeService: RegradeService;
  let questionBankService: QuestionBankService;
  let fileUploadService: FileUploadSecurityService;
  let authority: ExamSessionAuthority;
  let appealsService: AppealsAndRetentionService;

  beforeEach(() => {
    gradingEngine = new GradingEngine();
    rubricService = new RubricGradingService();
    doubleMarkingService = new DoubleMarkingService({
      disparityPercentageThreshold: 15,
      disparityAbsolutePointsThreshold: 5,
    });
    authority = new ExamSessionAuthority();
    appealsService = new AppealsAndRetentionService(authority);
    regradeService = new RegradeService(appealsService, authority);
    questionBankService = new QuestionBankService();
    fileUploadService = new FileUploadSecurityService();
  });

  // =========================================================================
  // 1. Partial Credit & Negative Marking: Multiple Choice & Matching
  // =========================================================================
  describe('1. Partial Credit & Negative Marking (MCQ & Matching)', () => {
    it('applies negative marking penalty to multiple-choice question but respects floor', () => {
      const mcq: QuestionDefinition = {
        id: 'q_mcq_penalty',
        topic: 'Operating Systems',
        type: 'MULTIPLE_CHOICE',
        stem: 'Which scheduling algorithm is non-preemptive?',
        points: 4,
        negativeMarking: 1.5,
        negativeMarkingFloor: 0,
        multipleChoiceOptions: [
          { id: 'opt_1', text: 'First-Come, First-Served (FCFS)', isCorrect: true },
          { id: 'opt_2', text: 'Round Robin', isCorrect: false },
          { id: 'opt_3', text: 'Shortest Remaining Time First', isCorrect: false },
        ],
      };

      // Correct choice
      const correctEval = gradingEngine.evaluateQuestion(mcq, 'opt_1');
      expect(correctEval.isCorrect).toBe(true);
      expect(correctEval.pointsAwarded).toBe(4);

      // Wrong choice with negative marking
      const wrongEval = gradingEngine.evaluateQuestion(mcq, 'opt_2');
      expect(wrongEval.isCorrect).toBe(false);
      expect(wrongEval.pointsAwarded).toBe(0); // Floor prevents going below 0

      // With floor at -2
      const mcqNegativeFloor: QuestionDefinition = {
        ...mcq,
        negativeMarkingFloor: -2,
      };
      const wrongWithNegativeFloor = gradingEngine.evaluateQuestion(mcqNegativeFloor, 'opt_3');
      expect(wrongWithNegativeFloor.pointsAwarded).toBe(-1.5);
    });

    it('calculates partial credit for matching questions proportionally', () => {
      const matchingQ: QuestionDefinition = {
        id: 'q_match_1',
        topic: 'Network Protocols',
        type: 'MATCHING',
        stem: 'Match each protocol with its standard transport port.',
        points: 6,
        matchingConfig: {
          premises: [
            { id: 'p_http', text: 'HTTP' },
            { id: 'p_https', text: 'HTTPS' },
            { id: 'p_ssh', text: 'SSH' },
          ],
          responses: [
            { id: 'r_80', text: 'Port 80' },
            { id: 'r_443', text: 'Port 443' },
            { id: 'r_22', text: 'Port 22' },
          ],
          correctPairs: [
            { premiseId: 'p_http', responseId: 'r_80' },
            { premiseId: 'p_https', responseId: 'r_443' },
            { premiseId: 'p_ssh', responseId: 'r_22' },
          ],
          allowPartialCredit: true,
          negativeMarkingPerMismatch: 0,
        },
      };

      // All 3 correct = 6 points
      const full = gradingEngine.evaluateQuestion(matchingQ, {
        p_http: 'r_80',
        p_https: 'r_443',
        p_ssh: 'r_22',
      });
      expect(full.isCorrect).toBe(true);
      expect(full.pointsAwarded).toBe(6);

      // 2 of 3 correct = (2/3) * 6 = 4 points
      const partial = gradingEngine.evaluateQuestion(matchingQ, {
        p_http: 'r_80',
        p_https: 'r_443',
        p_ssh: 'r_80', // Wrong match
      });
      expect(partial.isCorrect).toBe(false);
      expect(partial.isPartial).toBe(true);
      expect(partial.pointsAwarded).toBe(4);
    });

    it('applies per-mismatch penalty in matching questions with floor enforcement', () => {
      const matchingPenaltyQ: QuestionDefinition = {
        id: 'q_match_pen',
        topic: 'Databases',
        type: 'MATCHING',
        stem: 'Match normal forms with their primary rules.',
        points: 6,
        negativeMarkingFloor: 0,
        matchingConfig: {
          premises: [
            { id: 'p_1nf', text: '1NF' },
            { id: 'p_2nf', text: '2NF' },
            { id: 'p_3nf', text: '3NF' },
          ],
          responses: [
            { id: 'r_atom', text: 'Atomic attributes' },
            { id: 'r_func', text: 'No partial dependencies' },
            { id: 'r_trans', text: 'No transitive dependencies' },
          ],
          correctPairs: [
            { premiseId: 'p_1nf', responseId: 'r_atom' },
            { premiseId: 'p_2nf', responseId: 'r_func' },
            { premiseId: 'p_3nf', responseId: 'r_trans' },
          ],
          allowPartialCredit: true,
          negativeMarkingPerMismatch: 1.0,
        },
      };

      // 1 correct (2 pts), 2 incorrect (-2 pts penalty) = 0 pts (floor = 0)
      const res = gradingEngine.evaluateQuestion(matchingPenaltyQ, {
        p_1nf: 'r_atom', // Correct (+2)
        p_2nf: 'r_trans', // Wrong (-1)
        p_3nf: 'r_func', // Wrong (-1)
      });
      expect(res.pointsAwarded).toBe(0);
    });
  });

  // =========================================================================
  // 2. Ordering & Fill-in-the-Blank Evaluation
  // =========================================================================
  describe('2. Ordering & Fill-in-the-Blank Evaluation', () => {
    it('evaluates ordering sequence using positional and pairwise strategies', () => {
      const orderingQ: QuestionDefinition = {
        id: 'q_order_boot',
        topic: 'System Architecture',
        type: 'ORDERING',
        stem: 'Arrange the Linux boot steps in chronological order.',
        points: 4,
        orderingConfig: {
          items: [
            { id: 'step_bios', text: 'BIOS/UEFI Init' },
            { id: 'step_grub', text: 'Bootloader (GRUB)' },
            { id: 'step_kernel', text: 'Kernel Execution' },
            { id: 'step_systemd', text: 'Init/systemd Target' },
          ],
          correctOrder: ['step_bios', 'step_grub', 'step_kernel', 'step_systemd'],
          scoringStrategy: 'POSITIONAL_PARTIAL',
        },
      };

      // Perfect order
      const full = gradingEngine.evaluateQuestion(orderingQ, [
        'step_bios',
        'step_grub',
        'step_kernel',
        'step_systemd',
      ]);
      expect(full.isCorrect).toBe(true);
      expect(full.pointsAwarded).toBe(4);

      // 2 in correct position, 2 swapped: ['step_bios', 'step_kernel', 'step_grub', 'step_systemd']
      const partialPos = gradingEngine.evaluateQuestion(orderingQ, [
        'step_bios',
        'step_kernel',
        'step_grub',
        'step_systemd',
      ]);
      expect(partialPos.isPartial).toBe(true);
      expect(partialPos.pointsAwarded).toBe(2); // 2/4 in place * 4 = 2 pts

      // Pairwise strategy test
      const pairwiseQ: QuestionDefinition = {
        ...orderingQ,
        orderingConfig: {
          ...orderingQ.orderingConfig!,
          scoringStrategy: 'PAIRWISE_ORDER',
        },
      };
      const pairwiseEval = gradingEngine.evaluateQuestion(pairwiseQ, [
        'step_bios',
        'step_grub',
        'step_systemd',
        'step_kernel',
      ]);
      expect(pairwiseEval.pointsAwarded).toBeGreaterThan(0);
    });

    it('evaluates fill-in-the-blank with accepted synonyms and case insensitivity', () => {
      const fibQ: QuestionDefinition = {
        id: 'q_fib_crypt',
        topic: 'Cryptography',
        type: 'FILL_IN_THE_BLANK',
        stem: 'In asymmetric encryption, the {blank_pub} key encrypts, while the {blank_priv} key decrypts.',
        points: 4,
        fillInTheBlankConfig: {
          template: 'In asymmetric encryption, the {blank_pub} key encrypts, while the {blank_priv} key decrypts.',
          blanks: [
            {
              id: 'blank_pub',
              acceptedAnswers: ['public', 'asymmetric public', 'pubkey'],
              caseSensitive: false,
            },
            {
              id: 'blank_priv',
              acceptedAnswers: ['private', 'secret', 'privkey'],
              caseSensitive: false,
            },
          ],
          allowPartialCredit: true,
        },
      };

      // Both correct with synonyms and different casing
      const full = gradingEngine.evaluateQuestion(fibQ, {
        blank_pub: 'PUBLIC',
        blank_priv: 'secret',
      });
      expect(full.isCorrect).toBe(true);
      expect(full.pointsAwarded).toBe(4);

      // 1 correct, 1 wrong = 2 points
      const partial = gradingEngine.evaluateQuestion(fibQ, {
        blank_pub: 'public',
        blank_priv: 'symmetric',
      });
      expect(partial.isPartial).toBe(true);
      expect(partial.pointsAwarded).toBe(2);
    });
  });

  // =========================================================================
  // 3. Numeric Tolerance and Units
  // =========================================================================
  describe('3. Numeric Answers with Tolerances & Units', () => {
    it('accepts answers within percentage tolerance and flags outside tolerance', () => {
      const numericQ: QuestionDefinition = {
        id: 'q_num_pct',
        topic: 'Physics',
        type: 'NUMERIC',
        stem: 'Calculate the resistance in Ohms when V=12V and I=0.25A.',
        points: 5,
        numericConfig: {
          expectedValue: 48,
          toleranceType: 'PERCENTAGE',
          toleranceValue: 0.05, // ±5% => [45.6, 50.4]
          requiredUnit: 'Ohms',
          strictUnit: false,
        },
      };

      // Exact match with unit
      const exact = gradingEngine.evaluateQuestion(numericQ, '48 Ohms');
      expect(exact.isCorrect).toBe(true);
      expect(exact.pointsAwarded).toBe(5);

      // Within 5% (47 is within 48 ± 2.4)
      const withinTol = gradingEngine.evaluateQuestion(numericQ, { value: 47, unit: 'Ohms' });
      expect(withinTol.isCorrect).toBe(true);
      expect(withinTol.pointsAwarded).toBe(5);

      // Outside 5% (44 is outside)
      const outsideTol = gradingEngine.evaluateQuestion(numericQ, '44 Ohms');
      expect(outsideTol.isCorrect).toBe(false);
      expect(outsideTol.pointsAwarded).toBe(0);
    });

    it('awards partial credit when numeric value is correct but unit is missing or incorrect', () => {
      const strictUnitQ: QuestionDefinition = {
        id: 'q_num_unit',
        topic: 'Networks',
        type: 'NUMERIC',
        stem: 'What is the RTT in milliseconds?',
        points: 6,
        numericConfig: {
          expectedValue: 120,
          toleranceType: 'ABSOLUTE',
          toleranceValue: 2, // 118 to 122
          requiredUnit: 'ms',
          strictUnit: true,
        },
      };

      // Correct value, correct unit
      const correct = gradingEngine.evaluateQuestion(strictUnitQ, '120 ms');
      expect(correct.isCorrect).toBe(true);
      expect(correct.pointsAwarded).toBe(6);

      // Correct value, wrong unit -> 50% partial credit
      const wrongUnit = gradingEngine.evaluateQuestion(strictUnitQ, '120 sec');
      expect(wrongUnit.isCorrect).toBe(false);
      expect(wrongUnit.isPartial).toBe(true);
      expect(wrongUnit.pointsAwarded).toBe(3); // 50% of 6

      // Correct value, missing unit with strictUnit=true -> 50% partial credit
      const missingUnit = gradingEngine.evaluateQuestion(strictUnitQ, 120);
      expect(missingUnit.isPartial).toBe(true);
      expect(missingUnit.pointsAwarded).toBe(3);
    });
  });

  // =========================================================================
  // 4. Math Equation LaTeX & Image Hotspots
  // =========================================================================
  describe('4. Math Equation & Image Hotspot', () => {
    it('normalizes and verifies LaTeX math expressions and accepted variations', () => {
      const mathQ: QuestionDefinition = {
        id: 'q_math_einstein',
        topic: 'Physics',
        type: 'MATH_EQUATION',
        stem: 'Write mass-energy equivalence equation.',
        points: 5,
        mathEquationConfig: {
          expectedLatex: 'E = m c^2',
          acceptedVariations: ['E = mc^2', 'E=mc^{2}', 'm c^2 = E'],
        },
      };

      // Canonical match with spacing differences
      const res1 = gradingEngine.evaluateQuestion(mathQ, 'E = m c^{2}');
      expect(res1.isCorrect).toBe(true);
      expect(res1.pointsAwarded).toBe(5);

      // Accepted variation
      const res2 = gradingEngine.evaluateQuestion(mathQ, 'E=mc^2');
      expect(res2.isCorrect).toBe(true);
      expect(res2.pointsAwarded).toBe(5);

      // Wrong equation
      const res3 = gradingEngine.evaluateQuestion(mathQ, 'E = \\frac{1}{2} m v^2');
      expect(res3.isCorrect).toBe(false);
      expect(res3.pointsAwarded).toBe(0);
    });

    it('evaluates image hotspot click coordinates for rectangular and circular zones', () => {
      const hotspotQ: QuestionDefinition = {
        id: 'q_hotspot_cpu',
        topic: 'Hardware',
        type: 'IMAGE_HOTSPOT',
        stem: 'Click the CPU socket on the motherboard diagram.',
        points: 4,
        imageHotspotConfig: {
          imageUrl: '/assets/motherboard.png',
          zones: [
            {
              id: 'zone_cpu',
              shape: 'RECTANGLE',
              coordinates: { x: 40, y: 30, width: 20, height: 20 }, // 40-60% x, 30-50% y
              label: 'CPU Socket',
            },
            {
              id: 'zone_ram',
              shape: 'RECTANGLE',
              coordinates: { x: 70, y: 20, width: 15, height: 40 },
              label: 'RAM Slots',
            },
          ],
          targetZoneIds: ['zone_cpu'],
          negativeMarkingPerWrongClick: 1.0,
        },
      };

      // Click inside CPU socket (x: 45, y: 35)
      const hit = gradingEngine.evaluateQuestion(hotspotQ, { x: 45, y: 35 });
      expect(hit.isCorrect).toBe(true);
      expect(hit.pointsAwarded).toBe(4);

      // Click outside in RAM zone (x: 75, y: 25)
      const miss = gradingEngine.evaluateQuestion(hotspotQ, { x: 75, y: 25 });
      expect(miss.isCorrect).toBe(false);
      expect(miss.pointsAwarded).toBe(0);
    });
  });

  // =========================================================================
  // 5. Case Study with Linked Sub-Questions
  // =========================================================================
  describe('5. Case Study Evaluation', () => {
    it('recursively grades linked sub-questions within a case study passage', () => {
      const caseStudyQ: QuestionDefinition = {
        id: 'q_case_distributed',
        topic: 'Distributed Systems',
        type: 'CASE_STUDY',
        stem: 'Read the incident report below and answer the following questions.',
        points: 6,
        caseStudyConfig: {
          passageTitle: 'Incident #404: Split-Brain in Data Center 3',
          passageContent: 'At 03:14 UTC, a network partition isolated 2 of 5 ZooKeeper ensemble nodes...',
          subQuestions: [
            {
              id: 'sub_q1',
              topic: 'Quorum',
              type: 'MULTIPLE_CHOICE',
              stem: 'Did the 2 isolated nodes maintain quorum?',
              points: 3,
              multipleChoiceOptions: [
                { id: 'opt_no', text: 'No, quorum requires >= 3 nodes', isCorrect: true },
                { id: 'opt_yes', text: 'Yes, minority can process reads', isCorrect: false },
              ],
            },
            {
              id: 'sub_q2',
              topic: 'CAP Theorem',
              type: 'MULTIPLE_CHOICE',
              stem: 'Which property was sacrificed by the minority partition?',
              points: 3,
              multipleChoiceOptions: [
                { id: 'opt_avail', text: 'Availability (returned errors)', isCorrect: true },
                { id: 'opt_cons', text: 'Consistency', isCorrect: false },
              ],
            },
          ],
        },
      };

      // Candidate answers both sub-questions correctly
      const evalBoth = gradingEngine.evaluateQuestion(caseStudyQ, {
        sub_q1: 'opt_no',
        sub_q2: 'opt_avail',
      });
      expect(evalBoth.isCorrect).toBe(true);
      expect(evalBoth.pointsAwarded).toBe(6);

      // Candidate answers 1 correct, 1 wrong = 3 points
      const evalPartial = gradingEngine.evaluateQuestion(caseStudyQ, {
        sub_q1: 'opt_no',
        sub_q2: 'opt_cons',
      });
      expect(evalPartial.isCorrect).toBe(false);
      expect(evalPartial.isPartial).toBe(true);
      expect(evalPartial.pointsAwarded).toBe(3);
    });
  });

  // =========================================================================
  // 6. File Upload Security & Virus Scanning
  // =========================================================================
  describe('6. File Upload Security & Virus Scan', () => {
    it('accepts valid PDF documents and validates magic bytes and hash', () => {
      // Valid PDF starts with %PDF-
      const pdfBuffer = Buffer.from('%PDF-1.4 sample content for essay submission');
      const result = fileUploadService.validateUploadedFile({
        fileName: 'architecture_report.pdf',
        fileContent: pdfBuffer,
        allowedExtensions: ['.pdf'],
        maxSizeBytes: 10 * 1024 * 1024,
      });

      expect(result.valid).toBe(true);
      expect(result.detectedMimeType).toBe('application/pdf');
      expect(result.virusScanPassed).toBe(true);
      expect(result.fileHash).toBeDefined();
    });

    it('blocks dangerous executable files and script extensions', () => {
      const scriptBuffer = Buffer.from('#!/bin/bash\necho "exploit"');
      const result = fileUploadService.validateUploadedFile({
        fileName: 'malicious.sh',
        fileContent: scriptBuffer,
        allowedExtensions: ['.pdf', '.sh'],
        maxSizeBytes: 5 * 1024 * 1024,
      });

      expect(result.valid).toBe(false);
      expect(result.virusScanPassed).toBe(false);
      expect(result.error).toContain('restricted for examination safety');
    });

    it('rejects files exceeding size limits', () => {
      const largeBuffer = Buffer.alloc(1024 * 1024 * 6); // 6MB
      const result = fileUploadService.validateUploadedFile({
        fileName: 'oversized.pdf',
        fileContent: largeBuffer,
        allowedExtensions: ['.pdf'],
        maxSizeBytes: 5 * 1024 * 1024, // 5MB limit
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds allowed limit');
    });

    it('detects simulated EICAR virus test string', () => {
      const eicarString = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
      const result = fileUploadService.validateUploadedFile({
        fileName: 'test_virus.pdf',
        fileContent: Buffer.from(`%PDF-1.4\n${eicarString}`),
        allowedExtensions: ['.pdf'],
        maxSizeBytes: 10 * 1024 * 1024,
      });

      expect(result.valid).toBe(false);
      expect(result.virusScanPassed).toBe(false);
      expect(result.error).toContain('Virus/Malware Detected');
    });
  });

  // =========================================================================
  // 7. Rubric Grading for Subjective Questions
  // =========================================================================
  describe('7. Rubric Grading Service', () => {
    it('evaluates multi-criteria rubrics with weights and level definitions', () => {
      const customRubric: RubricDefinition = {
        id: 'rubric_algo_design',
        title: 'Algorithm Design & Analysis Rubric',
        maxTotalPoints: 10,
        criteria: [
          {
            id: 'crit_correctness',
            name: 'Algorithmic Correctness',
            maxPoints: 5,
            weight: 1.0,
            levels: [
              { id: 'c_lvl_full', label: 'Optimal & Fully Correct', points: 5, description: 'Meets O(N log N)' },
              { id: 'c_lvl_sub', label: 'Suboptimal Correct', points: 3, description: 'O(N^2) complexity' },
              { id: 'c_lvl_inc', label: 'Flawed/Incomplete', points: 1, description: 'Fails edge cases' },
            ],
          },
          {
            id: 'crit_complexity',
            name: 'Complexity Proof',
            maxPoints: 5,
            weight: 1.0,
            levels: [
              { id: 'x_lvl_rigor', label: 'Rigorous Master Theorem', points: 5, description: 'Full inductive proof' },
              { id: 'x_lvl_inform', label: 'Informal Argument', points: 3, description: 'Basic intuition only' },
              { id: 'x_lvl_wrong', label: 'Incorrect Analysis', points: 0, description: 'Mistaken recurrence' },
            ],
          },
        ],
      };

      rubricService.registerRubric(customRubric);

      const evalResult = rubricService.evaluateSubmission(
        'rubric_algo_design',
        [
          { criterionId: 'crit_correctness', selectedLevelId: 'c_lvl_full', comment: 'Excellent optimal approach' },
          { criterionId: 'crit_complexity', selectedLevelId: 'x_lvl_inform', comment: 'Needs induction proof' },
        ],
        'grader_prof_smith',
        'Strong implementation, expand formal proof next time.'
      );

      expect(evalResult.totalScore).toBe(8); // 5 + 3 = 8
      expect(evalResult.maxScore).toBe(10);
      expect(evalResult.percentage).toBe(80);
      expect(evalResult.criteriaResults).toHaveLength(2);
    });
  });

  // =========================================================================
  // 8. Double-Marking & Third-Grader Arbitration
  // =========================================================================
  describe('8. Double-Marking & Disagreement Arbitration', () => {
    it('anonymizes candidate submissions so graders see only blind tokens', () => {
      const reg = doubleMarkingService.registerAnonymizedSubmission({
        submissionId: 'sub_candidate_42',
        candidateId: 'cand_alice_99',
        examId: 'cs301_final',
        questionId: 'q_essay_kernel',
        submittedContent: 'Microkernels isolate IPC into user space...',
        maxScore: 20,
      });

      expect(reg.anonymizedId).toMatch(/^ANON-[A-F0-9]{8}$/);
      expect(reg.submission.anonymousSubmissionId).toBe(reg.anonymizedId);
      // Grader view has no student ID
      expect((reg.submission as any).candidateId).toBeUndefined();
    });

    it('averages scores when two independent graders agree (disparity <= 15%)', () => {
      const reg = doubleMarkingService.registerAnonymizedSubmission({
        submissionId: 'sub_agree_test',
        candidateId: 'cand_bob_12',
        examId: 'cs301_final',
        questionId: 'q_essay_kernel',
        submittedContent: 'Monolithic vs microkernel tradeoff analysis...',
        maxScore: 20,
      });

      // Grader 1 awards 18
      doubleMarkingService.recordGraderScore({
        anonymizedId: reg.anonymizedId,
        graderId: 'grader_alpha',
        score: 18,
        rubricEvaluation: {
          rubricId: 'rubric_essay_standard',
          graderId: 'grader_alpha',
          evaluatedAt: Date.now(),
          totalScore: 18,
          maxScore: 20,
          percentage: 90,
          criteriaResults: [],
        },
      });

      // Grader 2 awards 17 (disparity = 1 point, 5% of 20 => well within 15%)
      const record = doubleMarkingService.recordGraderScore({
        anonymizedId: reg.anonymizedId,
        graderId: 'grader_beta',
        score: 17,
        rubricEvaluation: {
          rubricId: 'rubric_essay_standard',
          graderId: 'grader_beta',
          evaluatedAt: Date.now(),
          totalScore: 17,
          maxScore: 20,
          percentage: 85,
          criteriaResults: [],
        },
      });

      expect(record.status).toBe('CONCURRED');
      expect(record.finalScore).toBe(17.5); // Average of 18 and 17
    });

    it('flags disparity > 15% and routes to third-grader chief arbitrator', () => {
      const reg = doubleMarkingService.registerAnonymizedSubmission({
        submissionId: 'sub_dispute_test',
        candidateId: 'cand_carol_88',
        examId: 'cs301_final',
        questionId: 'q_essay_kernel',
        submittedContent: 'Discussion on paging and TLB invalidation...',
        maxScore: 20,
      });

      // Grader 1 awards 19/20
      doubleMarkingService.recordGraderScore({
        anonymizedId: reg.anonymizedId,
        graderId: 'grader_1',
        score: 19,
      });

      // Grader 2 awards 11/20 (disparity = 8 points = 40% of 20 => flags disagreement!)
      const flaggedRecord = doubleMarkingService.recordGraderScore({
        anonymizedId: reg.anonymizedId,
        graderId: 'grader_2',
        score: 11,
      });

      expect(flaggedRecord.status).toBe('DISAGREEMENT_FLAGGED');
      expect(flaggedRecord.disparityAbsolute).toBe(8);
      expect(flaggedRecord.disparityPercentage).toBe(40);
      expect(flaggedRecord.finalScore).toBeUndefined();

      // Third arbitrator steps in and assigns definitive resolution score
      const resolved = doubleMarkingService.resolveByArbitrator({
        anonymizedId: reg.anonymizedId,
        arbitratorId: 'chief_examiner_dr_clark',
        finalScore: 16,
        resolutionRationale: 'Candidate covered TLB shootdowns correctly; minor missing edge cases on multi-core.',
      });

      expect(resolved.status).toBe('ARBITRATED');
      expect(resolved.finalScore).toBe(16);
      expect(resolved.thirdGrader?.graderId).toBe('chief_examiner_dr_clark');
    });
  });

  // =========================================================================
  // 9. Regrade Requests & Appeal Flow Integration
  // =========================================================================
  describe('9. Regrade Requests & Appeal Flow', () => {
    it('enforces post-exam appeal window for regrade requests and records into session ledger', () => {
      const now = Date.now();
      const session = authority.startSession({
        sessionId: 'sess_regrade_test',
        candidateId: 'cand_dan_33',
        examId: 'exam_sys_prog',
        durationSeconds: 3600,
        nowMs: now - 3600000, // Started 1 hour ago
      });

      // Complete session and register evidence package with 7-day appeal window
      authority.recordStudentExit(session);
      appealsService.registerSessionEvidence(
        session.id,
        'cand_dan_33',
        1,
        1,
        1,
        'root_hash_regrade_101',
        7,
        now - 1000
      );

      // Open appeal window (default 7 days)
      const isWindowOpen = appealsService.isAppealWindowOpen(session.id, now);
      expect(isWindowOpen).toBe(true);

      // Submit regrade request
      const regrade = regradeService.submitRegradeRequest({
        sessionId: session.id,
        candidateId: 'cand_dan_33',
        examId: 'exam_sys_prog',
        disputedQuestions: [
          {
            questionId: 'q_bdp_1',
            originalPointsAwarded: 2.5,
            candidateRationale: 'Numeric unit was implicit in question stem formula.',
          },
        ],
        originalTotalScore: 75,
        nowMs: now,
      });

      expect(regrade.status).toBe('PENDING');
      expect(regrade.disputedQuestions).toHaveLength(1);

      // Reviewer resolves regrade with revised score
      const resolved = regradeService.resolveRegrade({
        regradeId: regrade.regradeId,
        reviewerId: 'faculty_reviewer_jen',
        status: 'APPROVED',
        revisedTotalScore: 80,
        reviewerNotes: 'Granted full marks on question 1 after review of formula unit ambiguity.',
      });

      expect(resolved.status).toBe('APPROVED');
      expect(resolved.revisedTotalScore).toBe(80);

      // Verify authoritative ledger recorded REGRADE_REQUESTED and REGRADE_RESOLVED
      const ledger = authority.getLedger(session.id);
      expect(ledger.some((e) => (e.eventData as any)?.type === 'REGRADE_REQUESTED')).toBe(true);
      expect(ledger.some((e) => (e.eventData as any)?.type === 'REGRADE_RESOLVED')).toBe(true);
    });

    it('rejects regrades submitted after the appeal window has closed', () => {
      const oldTime = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days ago
      const session = authority.startSession({
        sessionId: 'sess_expired_regrade',
        candidateId: 'cand_late_44',
        examId: 'exam_sys_prog',
        durationSeconds: 3600,
        nowMs: oldTime,
      });

      authority.recordStudentExit(session);
      appealsService.registerSessionEvidence(
        session.id,
        'cand_late_44',
        1,
        1,
        1,
        'root_hash_expired_102',
        7,
        oldTime
      );

      // Attempting to submit today (30 days later) should throw window expired
      expect(() => {
        regradeService.submitRegradeRequest({
          sessionId: session.id,
          candidateId: 'cand_late_44',
          examId: 'exam_sys_prog',
          disputedQuestions: [
            {
              questionId: 'q1',
              originalPointsAwarded: 0,
              candidateRationale: 'Too late',
            },
          ],
          originalTotalScore: 50,
          nowMs: Date.now(),
        });
      }).toThrow(/expired/i);
    });
  });

  // =========================================================================
  // 10. Question Bank: Tags, Versions, and Review Workflow
  // =========================================================================
  describe('10. Question Bank Lifecycle & Versioning', () => {
    it('creates draft questions and tracks lifecycle from DRAFT -> PENDING_REVIEW -> APPROVED', () => {
      const q = questionBankService.createQuestion({
        topic: 'Concurrent Programming',
        difficulty: 'HARD',
        learningOutcome: 'LO-CONCUR-01',
        type: 'MULTIPLE_CHOICE',
        stem: 'What is the primary condition for a deadlock in Coffman criteria?',
        points: 4,
        multipleChoiceOptions: [
          { id: 'opt_1', text: 'Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait', isCorrect: true },
          { id: 'opt_2', text: 'Race Conditions and Starvation', isCorrect: false },
        ],
      });

      expect(q.version).toBe(1);
      expect(q.status).toBe('DRAFT');

      // Submit for review
      const submitted = questionBankService.submitForReview(q.id);
      expect(submitted.status).toBe('PENDING_REVIEW');

      // Reviewer approves
      const approved = questionBankService.approveQuestion(q.id, 'reviewer_chair');
      expect(approved.status).toBe('APPROVED');
      expect(approved.approvedBy).toBe('reviewer_chair');
    });

    it('auto-increments version and requires re-approval when an APPROVED question is modified', () => {
      const created = questionBankService.createQuestion({
        topic: 'Data Structures',
        difficulty: 'MEDIUM',
        learningOutcome: 'LO-DS-AVL',
        type: 'MULTIPLE_CHOICE',
        stem: 'What is the balance factor of an AVL tree node?',
        points: 3,
        multipleChoiceOptions: [
          { id: 'opt_1', text: 'Height(Left) - Height(Right) in {-1, 0, 1}', isCorrect: true },
          { id: 'opt_2', text: 'Node count parity', isCorrect: false },
        ],
      });

      questionBankService.submitForReview(created.id);
      const approvedV1 = questionBankService.approveQuestion(created.id, 'lead_chair');
      expect(approvedV1.version).toBe(1);
      expect(approvedV1.status).toBe('APPROVED');

      // Author updates question content
      const updatedV2 = questionBankService.updateQuestion(
        created.id,
        { stem: 'Define the balance factor of an AVL tree node in terms of subtree heights.' },
        'author_dr_lee'
      );

      // Must be bumped to v2 and reset to PENDING_REVIEW
      expect(updatedV2.version).toBe(2);
      expect(updatedV2.status).toBe('PENDING_REVIEW');

      // Both versions exist in history
      const v1Snapshot = questionBankService.getQuestionVersion(created.id, 1);
      expect(v1Snapshot).toBeDefined();
      expect(v1Snapshot?.stem).toBe('What is the balance factor of an AVL tree node?');

      const v2Snapshot = questionBankService.getQuestion(created.id);
      expect(v2Snapshot?.stem).toContain('Define the balance factor');
    });

    it('filters question bank by topic, difficulty, learning outcome, and status', () => {
      const results = questionBankService.queryQuestions({
        topic: 'Distributed Systems',
      });
      expect(results.length).toBeGreaterThan(0);

      const hardQuestions = questionBankService.queryQuestions({
        difficulty: 'HARD',
      });
      expect(hardQuestions.every((q) => q.difficulty === 'HARD')).toBe(true);

      const approvedOnly = questionBankService.queryQuestions({
        status: 'APPROVED',
      });
      expect(approvedOnly.every((q) => q.status === 'APPROVED')).toBe(true);
    });
  });
});
