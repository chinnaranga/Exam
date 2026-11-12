import crypto from 'crypto';
import {
  SecurityProfile,
  SecurityProfileSettings,
  securityProfileEngine,
  ValidationResult,
} from './SecurityProfileEngine';
import { SectionRulesDefinition, QuestionPoolDefinition } from './ExamRandomizationEngine';
import { examSessionAuthority } from '../integrity/ExamSessionAuthority';

export interface ExamScheduleWindow {
  startWindow: string; // ISO 8601 string or timestamp
  endWindow: string;
}

export interface ExamConfigSnapshot {
  examId: string;
  version: number;
  title: string;
  department: string;
  durationMinutes: number;
  scheduleWindow: ExamScheduleWindow;
  securityProfile: SecurityProfile;
  instructions: string;
  allowedTools: string[];
  questionPools: QuestionPoolDefinition[];
  sections: SectionRulesDefinition[];
  configHash: string; // SHA-256 fingerprint of the configuration
  publishedAt: number;
  publishedBy: string;
  changeSummary?: string;
}

export interface CreateExamDraftInput {
  title: string;
  department?: string;
  durationMinutes: number;
  scheduleWindow?: ExamScheduleWindow;
  securityProfileId: string;
  securityProfileOverrides?: Partial<SecurityProfileSettings>;
  instructions?: string;
  allowedTools?: string[];
  questionPools?: QuestionPoolDefinition[];
  sections?: SectionRulesDefinition[];
  changeSummary?: string;
}

export class ExamConfigVersionManager {
  // examId -> (version -> ExamConfigSnapshot)
  private examHistoryMap: Map<string, Map<number, ExamConfigSnapshot>> = new Map();
  // examId -> latestVersionNumber
  private latestVersionMap: Map<string, number> = new Map();
  // sessionId -> { examId, version }
  private sessionBindings: Map<string, { examId: string; version: number }> = new Map();

  constructor() {
    this.seedDefaultExam();
  }

  /**
   * Seeds default CS-402 exam blueprint (Version 1)
   */
  private seedDefaultExam(): void {
    const examId = 'exam_cs402';
    const profile = securityProfileEngine.getProfile('STANDARD')!;

    const defaultSnapshot: ExamConfigSnapshot = {
      examId,
      version: 1,
      title: 'CS-402: Distributed Consensus & Raft Protocols',
      department: 'Electrical Engineering & Computer Science',
      durationMinutes: 60,
      scheduleWindow: {
        startWindow: new Date(Date.now() - 3600000).toISOString(),
        endWindow: new Date(Date.now() + 86400000).toISOString(),
      },
      securityProfile: profile,
      instructions:
        'Standard university examination rules apply. Fullscreen mode is enforced; keep your webcam active and centered.',
      allowedTools: ['SCRATCHPAD'],
      questionPools: [
        {
          topic: 'Raft Consensus',
          pickCount: 1,
          questions: [
            {
              id: 'q_raft_01',
              topic: 'Raft Consensus',
              sectionId: 'sec_core',
              stem: 'In Raft, what is the role of the term number during leader election?',
              type: 'MULTIPLE_CHOICE',
              points: 5,
            },
          ],
        },
      ],
      sections: [
        {
          id: 'sec_core',
          title: 'Core Distributed Systems',
          forwardOnly: false,
          lockOnComplete: false,
          pools: [],
        },
      ],
      configHash: '',
      publishedAt: Date.now() - 86400000,
      publishedBy: 'system_admin',
      changeSummary: 'Initial production blueprint publication',
    };

    defaultSnapshot.configHash = this.computeConfigHash(defaultSnapshot);

    const history = new Map<number, ExamConfigSnapshot>();
    history.set(1, defaultSnapshot);
    this.examHistoryMap.set(examId, history);
    this.latestVersionMap.set(examId, 1);
  }

  /**
   * Computes a canonical SHA-256 fingerprint for the configuration snapshot
   */
  public computeConfigHash(snapshot: Omit<ExamConfigSnapshot, 'configHash'>): string {
    const canonicalPayload = JSON.stringify({
      examId: snapshot.examId,
      version: snapshot.version,
      title: snapshot.title,
      durationMinutes: snapshot.durationMinutes,
      scheduleWindow: snapshot.scheduleWindow,
      profileId: snapshot.securityProfile.id,
      profileSettings: snapshot.securityProfile.settings,
      instructions: snapshot.instructions,
      allowedTools: snapshot.allowedTools,
      sections: (snapshot.sections || []).map((s) => ({
        id: s.id,
        forwardOnly: s.forwardOnly,
        lockOnComplete: s.lockOnComplete,
      })),
    });

    return crypto.createHash('sha256').update(canonicalPayload).digest('hex');
  }

  /**
   * Publishes or updates an exam configuration.
   * Increments the version number and creates an immutable snapshot.
   * Blocks publishing if settings conflict.
   */
  public publishExamConfig(
    examId: string,
    input: CreateExamDraftInput,
    publishedBy: string = 'admin'
  ): { snapshot: ExamConfigSnapshot; validation: ValidationResult } {
    // 1. Resolve Security Profile & Overrides
    let activeProfile: SecurityProfile;
    const baseProfile = securityProfileEngine.getProfile(input.securityProfileId);
    if (!baseProfile) {
      throw new Error(`Security profile "${input.securityProfileId}" not found.`);
    }

    if (input.securityProfileOverrides && Object.keys(input.securityProfileOverrides).length > 0) {
      activeProfile = securityProfileEngine.cloneProfile(
        input.securityProfileId,
        {
          name: `${baseProfile.name} (Custom Exam Override)`,
          settings: input.securityProfileOverrides,
        },
        `CUSTOM_${examId}_${Date.now()}`
      );
    } else {
      activeProfile = baseProfile;
    }

    // 2. Validate Profile Configuration - BLOCK if invalid
    const validation = securityProfileEngine.validateProfile(activeProfile);
    if (!validation.isValid) {
      const errorMsg = validation.errors
        .map((e) => `[${e.code}] ${e.message} - ${e.explanation}`)
        .join('\n');
      const err = new Error(`Cannot publish exam configuration due to validation conflicts:\n${errorMsg}`);
      (err as any).validation = validation;
      throw err;
    }

    // 3. Compute New Version Number
    const currentLatest = this.latestVersionMap.get(examId) || 0;
    const nextVersion = currentLatest + 1;

    // 4. Create Immutable Snapshot
    const snapshotWithoutHash: Omit<ExamConfigSnapshot, 'configHash'> = {
      examId,
      version: nextVersion,
      title: input.title,
      department: input.department || 'Academic Department',
      durationMinutes: input.durationMinutes,
      scheduleWindow: input.scheduleWindow || {
        startWindow: new Date().toISOString(),
        endWindow: new Date(Date.now() + 7 * 86400000).toISOString(),
      },
      securityProfile: activeProfile,
      instructions: input.instructions || 'Follow all standard academic integrity instructions.',
      allowedTools: input.allowedTools || activeProfile.settings.allowedTools || ['SCRATCHPAD'],
      questionPools: input.questionPools || [],
      sections: input.sections || [],
      publishedAt: Date.now(),
      publishedBy,
      changeSummary: input.changeSummary || `Version ${nextVersion} published by ${publishedBy}`,
    };

    const configHash = this.computeConfigHash(snapshotWithoutHash);
    const fullSnapshot: ExamConfigSnapshot = {
      ...snapshotWithoutHash,
      configHash,
    };

    // 5. Store in Version History
    let history = this.examHistoryMap.get(examId);
    if (!history) {
      history = new Map();
      this.examHistoryMap.set(examId, history);
    }
    history.set(nextVersion, fullSnapshot);
    this.latestVersionMap.set(examId, nextVersion);

    return { snapshot: fullSnapshot, validation };
  }

  /**
   * Binds a running session to a specific config version (or the latest version at session start).
   * Once bound, the session stays locked to that version permanently.
   */
  public bindSessionToConfig(
    sessionId: string,
    examId: string,
    specificVersion?: number
  ): ExamConfigSnapshot {
    const version = specificVersion || this.latestVersionMap.get(examId) || 1;
    const history = this.examHistoryMap.get(examId);
    const snapshot = history?.get(version);

    if (!snapshot) {
      throw new Error(`Exam config for exam "${examId}" version ${version} not found.`);
    }

    this.sessionBindings.set(sessionId, { examId, version });

    // Append cryptographic event to session ledger if session exists in authority
    try {
      const session = examSessionAuthority.getSession(sessionId);
      if (session) {
        examSessionAuthority.appendLedgerRecord(session, {
          type: 'CONFIG_VERSION_PINNED',
          ts: Date.now(),
          seq: 1,
          payload: {
            examId,
            pinnedVersion: version,
            configHash: snapshot.configHash,
            securityTier: snapshot.securityProfile.tier,
          },
        });
      }
    } catch {
      // Ignored for unit tests running isolated
    }

    return snapshot;
  }

  /**
   * Retrieves the pinned configuration snapshot for an active or completed session.
   * Guarantees that updates to the exam do not affect running candidates.
   */
  public getSessionConfig(sessionId: string): ExamConfigSnapshot {
    const binding = this.sessionBindings.get(sessionId);
    if (!binding) {
      throw new Error(`No exam configuration bound to session "${sessionId}".`);
    }

    const snapshot = this.getExamVersion(binding.examId, binding.version);
    if (!snapshot) {
      throw new Error(
        `Pinned exam configuration version ${binding.version} for exam "${binding.examId}" not found.`
      );
    }

    return snapshot;
  }

  /**
   * Gets a specific version of an exam config (or the latest if version is omitted)
   */
  public getExamVersion(examId: string, version?: number): ExamConfigSnapshot | undefined {
    const history = this.examHistoryMap.get(examId);
    if (!history) return undefined;

    const targetVersion = version || this.latestVersionMap.get(examId);
    if (!targetVersion) return undefined;

    return history.get(targetVersion);
  }

  /**
   * Lists all historical versions of an exam
   */
  public listExamVersions(examId: string): ExamConfigSnapshot[] {
    const history = this.examHistoryMap.get(examId);
    if (!history) return [];
    return Array.from(history.values()).sort((a, b) => b.version - a.version);
  }

  /**
   * Returns all exam IDs
   */
  public listExamIds(): string[] {
    return Array.from(this.examHistoryMap.keys());
  }
}

export const examConfigVersionManager = new ExamConfigVersionManager();

