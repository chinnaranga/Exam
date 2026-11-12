import {
  QuestionDefinition,
  QuestionDifficulty,
  QuestionApprovalStatus,
  QuestionType,
} from './questionTypes';

export interface QuestionFilterCriteria {
  topic?: string;
  difficulty?: QuestionDifficulty;
  learningOutcome?: string;
  status?: QuestionApprovalStatus;
  type?: QuestionType;
  search?: string;
}

export class QuestionBankService {
  // Current active question versions: Key is questionId
  private questions: Map<string, QuestionDefinition> = new Map();
  // Historical versions: Key is `${questionId}:v${version}`
  private versionHistory: Map<string, QuestionDefinition> = new Map();

  constructor() {
    this.seedDefaultBank();
  }

  /**
   * Create a new question draft in the bank (starts at Version 1, DRAFT).
   */
  public createQuestion(
    data: Omit<QuestionDefinition, 'id' | 'version' | 'status'>,
    authorId: string = 'system_faculty'
  ): QuestionDefinition {
    const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const question: QuestionDefinition = {
      ...data,
      id,
      version: 1,
      status: 'DRAFT',
      authorId,
    };

    this.questions.set(id, question);
    this.saveVersionSnapshot(question);
    return question;
  }

  /**
   * Update question content.
   * If the question was already APPROVED, modifying it automatically increments the version
   * and requires re-approval before live deployment.
   */
  public updateQuestion(
    questionId: string,
    updates: Partial<QuestionDefinition>,
    authorId: string
  ): QuestionDefinition {
    const current = this.questions.get(questionId);
    if (!current) {
      throw new Error(`Question "${questionId}" not found in bank.`);
    }

    if (current.status === 'APPROVED') {
      // Archive current version into history and bump version
      this.saveVersionSnapshot(current);

      const nextVersion = current.version + 1;
      const updated: QuestionDefinition = {
        ...current,
        ...updates,
        id: current.id,
        version: nextVersion,
        status: 'PENDING_REVIEW', // Must be re-approved
        authorId,
        reviewerId: undefined,
        reviewedAt: undefined,
        approvalNotes: undefined,
      };

      this.questions.set(questionId, updated);
      this.saveVersionSnapshot(updated);
      return updated;
    }

    // In draft/pending review: update in-place
    const updated: QuestionDefinition = {
      ...current,
      ...updates,
      id: current.id,
      version: current.version,
    };

    this.questions.set(questionId, updated);
    this.saveVersionSnapshot(updated);
    return updated;
  }

  /**
   * Transition question to PENDING_REVIEW for faculty peer review.
   */
  public submitForReview(questionId: string): QuestionDefinition {
    const question = this.questions.get(questionId);
    if (!question) {
      throw new Error(`Question "${questionId}" not found.`);
    }

    question.status = 'PENDING_REVIEW';
    return question;
  }

  /**
   * Senior Faculty / Peer reviews and approves or rejects question.
   */
  public reviewQuestion(params: {
    questionId: string;
    reviewerId: string;
    decision: 'APPROVE' | 'REJECT';
    notes?: string;
  }): QuestionDefinition {
    const question = this.questions.get(params.questionId);
    if (!question) {
      throw new Error(`Question "${params.questionId}" not found.`);
    }

    if (question.status !== 'PENDING_REVIEW') {
      throw new Error(`Question "${params.questionId}" is not pending review (status: ${question.status}).`);
    }

    question.reviewerId = params.reviewerId;
    question.approvedBy = params.reviewerId;
    question.reviewedAt = Date.now();
    question.approvalNotes = params.notes;

    if (params.decision === 'APPROVE') {
      question.status = 'APPROVED';
    } else {
      question.status = 'DRAFT'; // Sent back for edits
    }

    this.saveVersionSnapshot(question);
    return question;
  }

  /**
   * Approves a question under peer review.
   */
  public approveQuestion(questionId: string, reviewerId: string, notes?: string): QuestionDefinition {
    return this.reviewQuestion({
      questionId,
      reviewerId,
      decision: 'APPROVE',
      notes,
    });
  }

  /**
   * Rejects a question under review, returning it to DRAFT.
   */
  public rejectQuestion(questionId: string, reviewerId: string, notes?: string): QuestionDefinition {
    return this.reviewQuestion({
      questionId,
      reviewerId,
      decision: 'REJECT',
      notes,
    });
  }

  /**
   * Archive obsolete question.
   */
  public archiveQuestion(questionId: string): QuestionDefinition {
    const question = this.questions.get(questionId);
    if (!question) {
      throw new Error(`Question "${questionId}" not found.`);
    }
    question.status = 'ARCHIVED';
    this.saveVersionSnapshot(question);
    return question;
  }

  public getQuestion(questionId: string): QuestionDefinition | undefined {
    return this.questions.get(questionId);
  }

  public getQuestionVersion(questionId: string, version: number): QuestionDefinition | undefined {
    return this.versionHistory.get(`${questionId}:v${version}`);
  }

  /**
   * Filter and query the question bank by topic, difficulty, outcome, status, and search string.
   */
  public queryQuestions(criteria: QuestionFilterCriteria = {}): QuestionDefinition[] {
    return Array.from(this.questions.values()).filter((q) => {
      if (criteria.topic && q.topic.toLowerCase() !== criteria.topic.toLowerCase()) {
        return false;
      }
      if (criteria.difficulty && q.difficulty !== criteria.difficulty) {
        return false;
      }
      if (criteria.learningOutcome && q.learningOutcome !== criteria.learningOutcome) {
        return false;
      }
      if (criteria.status && q.status !== criteria.status) {
        return false;
      }
      if (criteria.type && q.type !== criteria.type) {
        return false;
      }
      if (criteria.search) {
        const query = criteria.search.toLowerCase();
        const matchesStem = q.stem.toLowerCase().includes(query);
        const matchesTopic = q.topic.toLowerCase().includes(query);
        const matchesTags = (q.tags || []).some((t) => t.toLowerCase().includes(query));
        if (!matchesStem && !matchesTopic && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }

  private saveVersionSnapshot(q: QuestionDefinition): void {
    this.versionHistory.set(`${q.id}:v${q.version}`, JSON.parse(JSON.stringify(q)));
  }

  private seedDefaultBank(): void {
    // 1. Matching
    this.createQuestion({
      topic: 'Distributed Systems',
      learningOutcome: 'LO-CS-402-CONSENSUS',
      difficulty: 'MEDIUM',
      points: 4,
      stem: 'Match each distributed consensus role with its primary algorithmic responsibility.',
      type: 'MATCHING',
      matchingConfig: {
        premises: [
          { id: 'p_leader', text: 'Raft Leader' },
          { id: 'p_follower', text: 'Raft Follower' },
          { id: 'p_candidate', text: 'Raft Candidate' },
          { id: 'p_learner', text: 'Paxos Learner' },
        ],
        responses: [
          { id: 'r_heartbeats', text: 'Issues periodic AppendEntries heartbeats and coordinates log commit.' },
          { id: 'r_passive', text: 'Responds passively to RPCs and resets randomized timeout.' },
          { id: 'r_request_votes', text: 'Increments term and solicits RequestVote RPCs.' },
          { id: 'r_observe', text: 'Monitors committed values without participating in consensus quorum.' },
        ],
        correctPairs: {
          p_leader: 'r_heartbeats',
          p_follower: 'r_passive',
          p_candidate: 'r_request_votes',
          p_learner: 'r_observe',
        },
        allowPartialCredit: true,
        negativeMarkingPerMismatch: 0.25,
      },
    });

    // 2. Ordering
    this.createQuestion({
      topic: 'Database Architecture',
      learningOutcome: 'LO-DB-ARIES-RECOVERY',
      difficulty: 'HARD',
      points: 5,
      stem: 'Arrange the three fundamental phases of ARIES Crash Recovery in correct chronological execution order.',
      type: 'ORDERING',
      orderingConfig: {
        items: [
          { id: 'phase_analysis', text: 'Analysis Phase (Reconstruct Dirty Page Table & Active Transactions)' },
          { id: 'phase_redo', text: 'Redo Phase (Repeating history forward from smallest RecLSN)' },
          { id: 'phase_undo', text: 'Undo Phase (Rolling back active uncommitted transactions backward)' },
        ],
        correctOrder: ['phase_analysis', 'phase_redo', 'phase_undo'],
        scoringStrategy: 'EXACT_SEQUENCE',
        negativeMarking: 1.0,
      },
    });

    // 3. Fill in the Blank
    this.createQuestion({
      topic: 'Computer Networks',
      learningOutcome: 'LO-NET-CONGESTION',
      difficulty: 'MEDIUM',
      points: 3,
      stem: 'In TCP Reno, the congestion window is halved upon {blank_1} packet loss, whereas a timeout triggers reset to {blank_2} MSS.',
      type: 'FILL_IN_THE_BLANK',
      fillInTheBlankConfig: {
        template: 'In TCP Reno, the congestion window is halved upon {blank_1} packet loss, whereas a timeout triggers reset to {blank_2} MSS.',
        blanks: [
          { id: 'blank_1', acceptedAnswers: ['triple duplicate ack', 'triple duplicate', '3 dup ack', 'fast retransmit'] },
          { id: 'blank_2', acceptedAnswers: ['1', 'one', '1 mss'] },
        ],
        allowPartialCredit: true,
      },
    });

    // 4. Numeric with Tolerance and Units
    this.createQuestion({
      topic: 'Network Engineering',
      learningOutcome: 'LO-NET-BANDWIDTH-DELAY',
      difficulty: 'MEDIUM',
      points: 4,
      stem: 'Calculate the Bandwidth-Delay Product (BDP) for a 10 Gbps fiber link with a Round-Trip Time (RTT) of 40 ms. Express your answer in Megabytes (MB).',
      type: 'NUMERIC',
      numericConfig: {
        expectedValue: 50,
        toleranceType: 'ABSOLUTE',
        toleranceValue: 0.5,
        requiredUnit: 'MB',
      },
    });

    // 5. Math Equation Input
    this.createQuestion({
      topic: 'Information Theory',
      learningOutcome: 'LO-INFO-ENTROPY',
      difficulty: 'HARD',
      points: 4,
      stem: 'Write Shannon’s formula for the channel capacity C of an AWGN channel with bandwidth B and signal-to-noise ratio S/N in LaTeX notation.',
      type: 'MATH_EQUATION',
      mathEquationConfig: {
        expectedLatex: 'C = B \\log_2(1 + \\frac{S}{N})',
        acceptedVariations: [
          'C=B\\log_{2}(1+\\frac{S}{N})',
          'C = B * \\log_2(1 + S/N)',
        ],
      },
    });

    // 6. Image Hotspot
    this.createQuestion({
      topic: 'Distributed Storage',
      learningOutcome: 'LO-STORAGE-LSM',
      difficulty: 'MEDIUM',
      points: 3,
      stem: 'Click the region of the LSM-Tree architecture diagram that represents the in-memory MemTable component before write-ahead flushing.',
      type: 'IMAGE_HOTSPOT',
      imageHotspotConfig: {
        imageUrl: '/assets/diagrams/lsm_tree_architecture.png',
        zones: [
          { id: 'zone_memtable', shape: 'RECTANGLE', coordinates: { x: 10, y: 15, width: 25, height: 20 }, label: 'MemTable' },
          { id: 'zone_wal', shape: 'RECTANGLE', coordinates: { x: 40, y: 15, width: 20, height: 20 }, label: 'Write-Ahead Log' },
          { id: 'zone_sstable', shape: 'RECTANGLE', coordinates: { x: 10, y: 55, width: 80, height: 35 }, label: 'SSTable Disk Levels' },
        ],
        targetZoneIds: ['zone_memtable'],
        negativeMarkingPerWrongClick: 0.5,
      },
    });

    // 7. Case Study
    this.createQuestion({
      topic: 'Cloud Infrastructure',
      learningOutcome: 'LO-CLOUD-FAILOVER',
      difficulty: 'HARD',
      points: 8,
      stem: 'Review the high-availability failover case study below and answer the two linked sub-questions.',
      type: 'CASE_STUDY',
      caseStudyConfig: {
        passageTitle: 'Global Financial Ledger Network Partition Event',
        passageContent: 'At 14:02 UTC, a fiber transponder failed between US-East and EU-West datacenters during an active quorum write. The Raft consensus group consisted of 5 nodes: 3 in US-East and 2 in EU-West. Both clusters retained network access to regional read replicas.',
        subQuestions: [
          {
            id: 'case_sub_1',
            version: 1,
            topic: 'Cloud Infrastructure',
            difficulty: 'MEDIUM',
            status: 'APPROVED',
            stem: 'Could the EU-West datacenter partition independently commit new write transactions during the partition?',
            type: 'MULTIPLE_CHOICE',
            points: 4,
            multipleChoiceOptions: [
              { id: 'opt_eu_no', text: 'No, because 2 nodes cannot satisfy the majority quorum (3 of 5).', isCorrect: true },
              { id: 'opt_eu_yes', text: 'Yes, because regional replicas assume local consensus.', isCorrect: false },
            ],
          },
          {
            id: 'case_sub_2',
            version: 1,
            topic: 'Cloud Infrastructure',
            difficulty: 'MEDIUM',
            status: 'APPROVED',
            stem: 'What is the maximum number of simultaneous node failures this 5-node cluster can tolerate while remaining operational?',
            type: 'NUMERIC',
            points: 4,
            numericConfig: {
              expectedValue: 2,
              toleranceType: 'ABSOLUTE',
              toleranceValue: 0,
            },
          },
        ],
      },
    });

    // Approve all seeded questions
    for (const q of this.questions.values()) {
      q.status = 'APPROVED';
      q.reviewedAt = Date.now();
      q.reviewerId = 'chief_curator';
      this.saveVersionSnapshot(q);
    }
  }
}

export const questionBankService = new QuestionBankService();
export default questionBankService;
