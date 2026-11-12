import { describe, it, expect, beforeEach } from 'vitest';
import {
  SecurityProfileEngine,
  SecurityProfile,
  SecurityProfileSettings,
} from '../SecurityProfileEngine';
import {
  ExamConfigVersionManager,
  CreateExamDraftInput,
} from '../ExamConfigVersionManager';

describe('Security Profile Engine & Exam Versioning Suite', () => {
  let engine: SecurityProfileEngine;
  let versionManager: ExamConfigVersionManager;

  beforeEach(() => {
    engine = new SecurityProfileEngine();
    versionManager = new ExamConfigVersionManager();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. BUILT-IN PROFILES
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Built-in Security Profiles (JSON Config)', () => {
    it('loads the 3 mandatory built-in profiles: PRACTICE, STANDARD, HIGH_STAKES', () => {
      const profiles = engine.listProfiles();
      const ids = profiles.map((p) => p.id);

      expect(ids).toContain('PRACTICE');
      expect(ids).toContain('STANDARD');
      expect(ids).toContain('HIGH_STAKES');

      const practice = engine.getProfile('PRACTICE')!;
      expect(practice.settings.proctoringEnabled).toBe(false);
      expect(practice.settings.hintsAllowed).toBe(true);
      expect(practice.settings.violationsMode).toBe('LOG_ONLY');
      expect(practice.settings.fullscreenRequired).toBe(false);
      expect(practice.settings.calculatorAllowed).toBe(true);

      const standard = engine.getProfile('STANDARD')!;
      expect(standard.settings.proctoringEnabled).toBe(true);
      expect(standard.settings.hintsAllowed).toBe(false);
      expect(standard.settings.violationsMode).toBe('ACTIVE');
      expect(standard.settings.fullscreenRequired).toBe(true);
      expect(standard.settings.focusTracking).toBe(true);
      expect(standard.settings.faceGazeTracking).toBe(true);
      expect(standard.settings.requireSecureClient).toBe(false);

      const highStakes = engine.getProfile('HIGH_STAKES')!;
      expect(highStakes.settings.proctoringEnabled).toBe(true);
      expect(highStakes.settings.identityVerificationRequired).toBe(true);
      expect(highStakes.settings.reverificationRequired).toBe(true);
      expect(highStakes.settings.phoneSecondCameraRequired).toBe(true);
      expect(highStakes.settings.requireSecureClient).toBe(true);
      expect(highStakes.settings.offlineLimitMinutes).toBe(3);
      expect(highStakes.settings.forwardOnlyNavigation).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. PROFILE CLONING & INDIVIDUAL OVERRIDES
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Profile Cloning & Overrides', () => {
    it('clones a profile and overrides individual settings without mutating the base profile', () => {
      const baseStandard = engine.getProfile('STANDARD')!;
      expect(baseStandard.settings.calculatorAllowed).toBe(false);
      expect(baseStandard.settings.offlineLimitMinutes).toBe(5);

      const cloned = engine.cloneProfile(
        'STANDARD',
        {
          name: 'Calculus Midterm Custom',
          description: 'Allows calculator and custom 10m offline limit',
          settings: {
            calculatorAllowed: true,
            offlineLimitMinutes: 10,
            thresholds: {
              overlayThreshold: 5,
              terminateThreshold: 10,
              decayIntervalMs: 180000,
              decayPointsPerInterval: 2,
            },
            allowedTools: ['CALCULATOR', 'FORMULA_SHEET'],
          },
        },
        'CUSTOM_CALC_2026'
      );

      expect(cloned.id).toBe('CUSTOM_CALC_2026');
      expect(cloned.tier).toBe('CUSTOM');
      expect(cloned.parentProfileId).toBe('STANDARD');
      expect(cloned.settings.calculatorAllowed).toBe(true);
      expect(cloned.settings.offlineLimitMinutes).toBe(10);
      expect(cloned.settings.thresholds.overlayThreshold).toBe(5);
      expect(cloned.settings.thresholds.terminateThreshold).toBe(10);
      expect(cloned.settings.allowedTools).toContain('CALCULATOR');

      // Verify base standard was NOT mutated
      const freshStandard = engine.getProfile('STANDARD')!;
      expect(freshStandard.settings.calculatorAllowed).toBe(false);
      expect(freshStandard.settings.offlineLimitMinutes).toBe(5);
      expect(freshStandard.settings.thresholds.overlayThreshold).toBe(4);
    });

    it('throws error when attempting to clone a non-existent base profile', () => {
      expect(() => {
        engine.cloneProfile('UNKNOWN_BASE', { name: 'Faulty' });
      }).toThrow(/not found/i);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. VALIDATION CONFLICTS (BLOCK PUBLISHING)
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Validation Conflicts & Explanations', () => {
    it('blocks publishing when phone second camera is required but secure client is disabled', () => {
      const base = engine.getProfile('HIGH_STAKES')!;
      const invalidSettings: SecurityProfileSettings = {
        ...base.settings,
        phoneSecondCameraRequired: true,
        requireSecureClient: false, // CONFLICT!
      };

      const result = engine.validateProfile({ tier: 'HIGH_STAKES', settings: invalidSettings });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      const conflict = result.errors.find(
        (e) => e.code === 'CONFLICT_PHONE_CAM_REQUIRES_SECURE_CLIENT'
      );
      expect(conflict).toBeDefined();
      expect(conflict?.explanation).toContain('Secure Desktop Client');
    });

    it('blocks publishing when proctoring is disabled but biometric sensors are enabled', () => {
      const base = engine.getProfile('PRACTICE')!;
      const invalidSettings: SecurityProfileSettings = {
        ...base.settings,
        proctoringEnabled: false,
        faceGazeTracking: true, // CONFLICT!
        identityVerificationRequired: true, // CONFLICT!
      };

      const result = engine.validateProfile({ tier: 'PRACTICE', settings: invalidSettings });
      expect(result.isValid).toBe(false);

      const faceErr = result.errors.find(
        (e) => e.code === 'CONFLICT_PROCTORING_DISABLED_FACE_TRACKING'
      );
      const idErr = result.errors.find(
        (e) => e.code === 'CONFLICT_PROCTORING_DISABLED_IDENTITY_CHECK'
      );

      expect(faceErr).toBeDefined();
      expect(idErr).toBeDefined();
    });

    it('blocks publishing when camera mode is NONE but phone second camera is requested', () => {
      const base = engine.getProfile('STANDARD')!;
      const invalidSettings: SecurityProfileSettings = {
        ...base.settings,
        cameraMode: 'NONE',
        phoneSecondCameraRequired: true,
        requireSecureClient: true,
      };

      const result = engine.validateProfile({ tier: 'STANDARD', settings: invalidSettings });
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.code === 'CONFLICT_PHONE_CAM_WITH_CAMERA_NONE')
      ).toBe(true);
    });

    it('blocks publishing when random re-verification is enabled without baseline identity check', () => {
      const base = engine.getProfile('STANDARD')!;
      const invalidSettings: SecurityProfileSettings = {
        ...base.settings,
        reverificationRequired: true,
        identityVerificationRequired: false, // CONFLICT!
      };

      const result = engine.validateProfile({ tier: 'STANDARD', settings: invalidSettings });
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.code === 'CONFLICT_REVERIFY_WITHOUT_INITIAL_ID')
      ).toBe(true);
    });

    it('blocks publishing when hints are enabled in ACTIVE violations mode', () => {
      const base = engine.getProfile('STANDARD')!;
      const invalidSettings: SecurityProfileSettings = {
        ...base.settings,
        hintsAllowed: true, // CONFLICT in ACTIVE mode!
        violationsMode: 'ACTIVE',
      };

      const result = engine.validateProfile({ tier: 'STANDARD', settings: invalidSettings });
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.code === 'CONFLICT_HINTS_IN_ACTIVE_MODE')
      ).toBe(true);
    });

    it('blocks publishing when overlay threshold >= terminate threshold', () => {
      const base = engine.getProfile('STANDARD')!;
      const invalidSettings: SecurityProfileSettings = {
        ...base.settings,
        thresholds: {
          ...base.settings.thresholds,
          overlayThreshold: 8,
          terminateThreshold: 8, // CONFLICT!
        },
      };

      const result = engine.validateProfile({ tier: 'STANDARD', settings: invalidSettings });
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.code === 'CONFLICT_INVALID_THRESHOLDS')
      ).toBe(true);
    });

    it('blocks publishing for High-Stakes exam allowing offline mode > 3 minutes', () => {
      const base = engine.getProfile('HIGH_STAKES')!;
      const invalidSettings: SecurityProfileSettings = {
        ...base.settings,
        offlineLimitMinutes: 10, // CONFLICT: exceeds 3 min limit for high-stakes!
      };

      const result = engine.validateProfile({ tier: 'HIGH_STAKES', settings: invalidSettings });
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.code === 'CONFLICT_HIGH_STAKES_OFFLINE_LIMIT')
      ).toBe(true);
    });

    it('passes validation for clean standard, practice, and high-stakes profiles', () => {
      expect(engine.validateProfile(engine.getProfile('PRACTICE')!).isValid).toBe(true);
      expect(engine.validateProfile(engine.getProfile('STANDARD')!).isValid).toBe(true);
      expect(engine.validateProfile(engine.getProfile('HIGH_STAKES')!).isValid).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. CONFIG VERSIONING & RUNNING SESSION PINNING
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Exam Config Versioning & Running Session Isolation', () => {
    it('creates version 1, bumps to version 2 on update, and keeps running sessions pinned to version 1', () => {
      const examId = 'exam_version_test';

      // 1. Publish Version 1
      const draftV1: CreateExamDraftInput = {
        title: 'Algorithms Final v1',
        durationMinutes: 90,
        securityProfileId: 'STANDARD',
        instructions: 'Initial instructions for v1.',
        allowedTools: ['SCRATCHPAD'],
      };

      const { snapshot: v1 } = versionManager.publishExamConfig(examId, draftV1, 'prof_smith');
      expect(v1.version).toBe(1);
      expect(v1.configHash).toBeDefined();
      expect(v1.configHash.length).toBe(64); // SHA-256

      // 2. Candidate starts session under Version 1
      const candidateSessionId = 'sess_cand_1001';
      const boundSnapshot = versionManager.bindSessionToConfig(candidateSessionId, examId);
      expect(boundSnapshot.version).toBe(1);
      expect(boundSnapshot.title).toBe('Algorithms Final v1');

      // 3. Admin updates exam to Version 2 (changes duration & instructions)
      const draftV2: CreateExamDraftInput = {
        title: 'Algorithms Final v2 (Updated Duration)',
        durationMinutes: 120, // changed
        securityProfileId: 'STANDARD',
        instructions: 'Updated instructions for v2.',
        allowedTools: ['SCRATCHPAD', 'CALCULATOR'],
        changeSummary: 'Extended time to 120 mins',
      };

      const { snapshot: v2 } = versionManager.publishExamConfig(examId, draftV2, 'prof_smith');
      expect(v2.version).toBe(2);
      expect(v2.title).toBe('Algorithms Final v2 (Updated Duration)');
      expect(v2.durationMinutes).toBe(120);
      expect(v2.configHash).not.toBe(v1.configHash);

      // 4. The RUNNING candidate session still retrieves Version 1 config!
      const runningSessionConfig = versionManager.getSessionConfig(candidateSessionId);
      expect(runningSessionConfig.version).toBe(1);
      expect(runningSessionConfig.title).toBe('Algorithms Final v1');
      expect(runningSessionConfig.durationMinutes).toBe(90);
      expect(runningSessionConfig.configHash).toBe(v1.configHash);

      // 5. A NEW candidate starting now gets latest Version 2
      const newCandidateSessionId = 'sess_cand_2002';
      const newBoundSnapshot = versionManager.bindSessionToConfig(newCandidateSessionId, examId);
      expect(newBoundSnapshot.version).toBe(2);
      expect(newBoundSnapshot.durationMinutes).toBe(120);

      // 6. Verify version history can retrieve both versions explicitly
      const history = versionManager.listExamVersions(examId);
      expect(history.length).toBe(2);
      expect(history.map((h) => h.version)).toEqual([2, 1]);
    });

    it('rejects publishing when settings conflict and does not bump version number', () => {
      const examId = 'exam_conflict_test';

      const draftV1: CreateExamDraftInput = {
        title: 'Valid V1',
        durationMinutes: 60,
        securityProfileId: 'STANDARD',
      };
      versionManager.publishExamConfig(examId, draftV1);

      // Attempt to publish conflicting settings
      const conflictingDraft: CreateExamDraftInput = {
        title: 'Conflicting V2',
        durationMinutes: 60,
        securityProfileId: 'HIGH_STAKES',
        securityProfileOverrides: {
          requireSecureClient: false, // CONFLICT with high stakes!
        },
      };

      expect(() => {
        versionManager.publishExamConfig(examId, conflictingDraft);
      }).toThrow(/Cannot publish exam configuration due to validation conflicts/i);

      // Latest version must still be 1
      const latest = versionManager.getExamVersion(examId);
      expect(latest?.version).toBe(1);
      expect(latest?.title).toBe('Valid V1');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. CANDIDATE PLAIN-LANGUAGE RULES SUMMARY
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Plain-Language Candidate Rules Summary', () => {
    it('generates clear, student-friendly rule explanations and checklists', () => {
      const highStakesProfile = engine.getProfile('HIGH_STAKES')!;
      const summary = engine.generateCandidateRulesSummary(
        highStakesProfile,
        'CS-402: Final Certification',
        90
      );

      expect(summary.examTitle).toBe('CS-402: Final Certification');
      expect(summary.durationMinutes).toBe(90);
      expect(summary.tier).toBe('HIGH_STAKES');
      expect(summary.plainLanguageSummary).toContain('high-stakes exam requiring dual-camera');

      // Rules categories
      const categories = summary.rules.map((r) => r.category);
      expect(categories).toContain('TIMING');
      expect(categories).toContain('MONITORING');
      expect(categories).toContain('WORKSPACE');
      expect(categories).toContain('TOOLS');
      expect(categories).toContain('NETWORK');
      expect(categories).toContain('INTEGRITY');

      // Video & Biometric monitoring details
      const monitoringRule = summary.rules.find((r) => r.category === 'MONITORING')!;
      expect(monitoringRule.bullets.some((b) => b.includes('Dual Camera'))).toBe(true);
      expect(monitoringRule.bullets.some((b) => b.includes('Identity Check'))).toBe(true);
      expect(monitoringRule.bullets.some((b) => b.includes('Random Re-verification'))).toBe(true);

      // Checklist contains mandatory items
      expect(summary.checklist.length).toBeGreaterThanOrEqual(4);
      expect(summary.checklist.every((c) => c.label.length > 0)).toBe(true);
    });

    it('generates non-restrictive summary for PRACTICE mode', () => {
      const practiceProfile = engine.getProfile('PRACTICE')!;
      const summary = engine.generateCandidateRulesSummary(
        practiceProfile,
        'Physics 101 Practice Drill',
        45
      );

      expect(summary.tier).toBe('PRACTICE');
      expect(summary.plainLanguageSummary).toContain('unproctored practice session');

      const monitoringRule = summary.rules.find((r) => r.category === 'MONITORING')!;
      expect(monitoringRule.bullets[0]).toContain('No camera or microphone monitoring is active');
    });
  });
});

