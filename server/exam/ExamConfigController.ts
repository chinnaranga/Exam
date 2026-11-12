import express, { Request, Response, Router } from 'express';
import {
  securityProfileEngine,
  SecurityProfile,
  SecurityProfileSettings,
} from './SecurityProfileEngine';
import {
  examConfigVersionManager,
  CreateExamDraftInput,
} from './ExamConfigVersionManager';

export const examConfigRouter: Router = express.Router();

/**
 * GET /api/v1/exam-config/profiles
 * Lists all available security profiles (built-in + cloned)
 */
examConfigRouter.get('/profiles', (_req: Request, res: Response) => {
  const profiles = securityProfileEngine.listProfiles();
  return res.json({ success: true, count: profiles.length, profiles });
});

/**
 * GET /api/v1/exam-config/profiles/:id
 * Retrieves a single profile by ID
 */
examConfigRouter.get('/profiles/:id', (req: Request, res: Response) => {
  const profile = securityProfileEngine.getProfile(req.params.id);
  if (!profile) {
    return res.status(404).json({ success: false, error: 'Profile not found' });
  }
  return res.json({ success: true, profile });
});

/**
 * POST /api/v1/exam-config/profiles/clone
 * Clones a profile and overrides specific settings
 */
examConfigRouter.post('/profiles/clone', (req: Request, res: Response) => {
  const { baseProfileId, name, description, settings, customId } = req.body;

  if (!baseProfileId) {
    return res.status(400).json({ success: false, error: 'baseProfileId is required' });
  }

  try {
    const cloned = securityProfileEngine.cloneProfile(
      baseProfileId,
      { name, description, settings },
      customId
    );
    return res.status(201).json({ success: true, profile: cloned });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/v1/exam-config/validate
 * Validates a profile configuration before publishing
 */
examConfigRouter.post('/validate', (req: Request, res: Response) => {
  const { profile, settings, tier } = req.body;

  const target = profile || { tier: tier || 'CUSTOM', settings };
  if (!target || !target.settings) {
    return res.status(400).json({ success: false, error: 'settings object is required for validation' });
  }

  const validation = securityProfileEngine.validateProfile(target);
  return res.json({
    success: true,
    isValid: validation.isValid,
    errors: validation.errors,
    warnings: validation.warnings,
  });
});

/**
 * GET /api/v1/exam-config/exams
 * Lists all registered exam configurations
 */
examConfigRouter.get('/exams', (_req: Request, res: Response) => {
  const examIds = examConfigVersionManager.listExamIds();
  const exams = examIds.map((id) => examConfigVersionManager.getExamVersion(id));
  return res.json({ success: true, exams });
});

/**
 * GET /api/v1/exam-config/exams/:id
 * Retrieves the latest version of an exam config
 */
examConfigRouter.get('/exams/:id', (req: Request, res: Response) => {
  const exam = examConfigVersionManager.getExamVersion(req.params.id);
  if (!exam) {
    return res.status(404).json({ success: false, error: 'Exam not found' });
  }
  return res.json({ success: true, exam });
});

/**
 * GET /api/v1/exam-config/exams/:id/versions
 * Lists all historical snapshots of an exam config
 */
examConfigRouter.get('/exams/:id/versions', (req: Request, res: Response) => {
  const versions = examConfigVersionManager.listExamVersions(req.params.id);
  return res.json({ success: true, count: versions.length, versions });
});

/**
 * GET /api/v1/exam-config/exams/:id/versions/:version
 * Retrieves a specific historical snapshot
 */
examConfigRouter.get('/exams/:id/versions/:version', (req: Request, res: Response) => {
  const versionNum = parseInt(req.params.version, 10);
  const snapshot = examConfigVersionManager.getExamVersion(req.params.id, versionNum);
  if (!snapshot) {
    return res.status(404).json({ success: false, error: `Version ${req.params.version} not found` });
  }
  return res.json({ success: true, snapshot });
});

/**
 * POST /api/v1/exam-config/exams/:id/publish
 * Publishes a new version of an exam config.
 * Blocks publishing if settings conflict.
 */
examConfigRouter.post('/exams/:id/publish', (req: Request, res: Response) => {
  const examId = req.params.id;
  const draftInput: CreateExamDraftInput = req.body;
  const publishedBy = req.body.publishedBy || 'faculty_admin';

  try {
    const result = examConfigVersionManager.publishExamConfig(examId, draftInput, publishedBy);
    return res.status(201).json({
      success: true,
      snapshot: result.snapshot,
      validation: result.validation,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message,
      validation: error.validation || null,
    });
  }
});

/**
 * GET /api/v1/exam-config/exams/:id/candidate-rules
 * Returns a plain-language summary of the rules for candidates
 */
examConfigRouter.get('/exams/:id/candidate-rules', (req: Request, res: Response) => {
  const exam = examConfigVersionManager.getExamVersion(req.params.id);
  if (!exam) {
    return res.status(404).json({ success: false, error: 'Exam not found' });
  }

  const rulesSummary = securityProfileEngine.generateCandidateRulesSummary(
    exam.securityProfile,
    exam.title,
    exam.durationMinutes
  );

  return res.json({ success: true, summary: rulesSummary });
});

/**
 * POST /api/v1/exam-config/sessions/bind
 * Binds a candidate session to the current or specific exam config version
 */
examConfigRouter.post('/sessions/bind', (req: Request, res: Response) => {
  const { sessionId, examId, version } = req.body;
  if (!sessionId || !examId) {
    return res.status(400).json({ success: false, error: 'sessionId and examId are required' });
  }

  try {
    const snapshot = examConfigVersionManager.bindSessionToConfig(sessionId, examId, version);
    return res.json({
      success: true,
      sessionId,
      pinnedVersion: snapshot.version,
      configHash: snapshot.configHash,
      title: snapshot.title,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/exam-config/sessions/:sessionId/config
 * Retrieves the exact configuration pinned to this candidate session
 */
examConfigRouter.get('/sessions/:sessionId/config', (req: Request, res: Response) => {
  try {
    const snapshot = examConfigVersionManager.getSessionConfig(req.params.sessionId);
    return res.json({ success: true, snapshot });
  } catch (error: any) {
    return res.status(404).json({ success: false, error: error.message });
  }
});
