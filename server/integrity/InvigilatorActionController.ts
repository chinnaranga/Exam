import express, { Request, Response, Router } from 'express';
import { ExamSessionAuthority, examSessionAuthority } from './ExamSessionAuthority';
import { humanReviewQueueService, ReviewDecision } from './HumanReviewQueueService';
import { integrityConfidenceEngine } from './IntegrityConfidenceEngine';
import { crossCandidateAnalysisEngine, CandidateSessionSubmission } from './CrossCandidateAnalysisEngine';
import { codeSimilarityAndSandboxEngine } from './CodeSimilarityAndSandboxEngine';
import { essayIntegrityEngine } from './EssayIntegrityEngine';
import { appealsAndRetentionService } from './AppealsAndRetentionService';
import { dailyLedgerAnchorService } from './DailyLedgerAnchorService';

export interface InvigilatorLiveSessionState {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  examId: string;
  status: 'ACTIVE' | 'PAUSED' | 'SUBMITTED' | 'TERMINATED';
  isPaused: boolean;
  pauseReason?: string;
  roomRescanPending: boolean;
  lastMessageReceived?: string;
  violationPoints: number;
  integrityScore: number;
  escalatedToChiefProctor: boolean;
  lastActiveAt: number;
}

export class InvigilatorActionController {
  public readonly router: Router;
  private authority: ExamSessionAuthority;
  private liveSessions: Map<string, InvigilatorLiveSessionState> = new Map();
  private messages: Array<{
    messageId: string;
    recipientType: 'DIRECT' | 'BULK';
    recipientId?: string; // sessionId or candidateId
    examId?: string;
    text: string;
    sentBy: string;
    sentAt: number;
  }> = [];

  constructor(authority: ExamSessionAuthority = examSessionAuthority) {
    this.authority = authority;
    this.router = express.Router();
    this.initializeDemoData();
    this.setupRoutes();
  }

  private initializeDemoData(): void {
    // Seed initial demo candidate sessions for proctor dashboard
    this.liveSessions.set('sess_student_01', {
      sessionId: 'sess_student_01',
      candidateId: 'cand_student_01',
      candidateName: 'Eleanor Vance',
      examId: 'exam_cs_402',
      status: 'ACTIVE',
      isPaused: false,
      roomRescanPending: false,
      violationPoints: 0,
      integrityScore: 98,
      escalatedToChiefProctor: false,
      lastActiveAt: Date.now(),
    });

    this.liveSessions.set('sess_student_02', {
      sessionId: 'sess_student_02',
      candidateId: 'cand_student_02',
      candidateName: 'Marcus Holloway',
      examId: 'exam_cs_402',
      status: 'ACTIVE',
      isPaused: false,
      roomRescanPending: false,
      violationPoints: 2,
      integrityScore: 78,
      escalatedToChiefProctor: false,
      lastActiveAt: Date.now(),
    });

    this.liveSessions.set('sess_student_03', {
      sessionId: 'sess_student_03',
      candidateId: 'cand_student_03',
      candidateName: 'Julian Croft',
      examId: 'exam_cs_402',
      status: 'ACTIVE',
      isPaused: false,
      roomRescanPending: false,
      violationPoints: 5,
      integrityScore: 42,
      escalatedToChiefProctor: true,
      lastActiveAt: Date.now(),
    });

    // Also populate review queue item
    humanReviewQueueService.enqueueSession({
      sessionId: 'sess_student_03',
      candidateId: 'cand_student_03',
      candidateName: 'Julian Croft',
      examId: 'exam_cs_402',
      flagReasons: ['Multiple monitors detected', 'High paste ratio (65%)', 'Gaze angle deviation off-screen'],
      integrityConfidenceScore: 42,
      violationPoints: 5,
    });
  }

  private setupRoutes(): void {
    // 1. GET Live Monitored Sessions
    this.router.get('/live-sessions', (_req: Request, res: Response) => {
      return res.json({
        success: true,
        sessions: Array.from(this.liveSessions.values()),
        totalActive: Array.from(this.liveSessions.values()).filter((s) => s.status === 'ACTIVE').length,
      });
    });

    // 2. POST Pause Candidate Session
    this.router.post('/session/:id/pause', (req: Request, res: Response) => {
      const sessionId = req.params.id;
      const { reason, invigilatorId = 'invigilator_admin' } = req.body;

      const session = this.liveSessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ success: false, error: `Session "${sessionId}" not found.` });
      }

      session.isPaused = true;
      session.status = 'PAUSED';
      session.pauseReason = reason || 'Proctor paused exam for security investigation.';

      // Commit action into the cryptographic hash-chained ledger!
      const authSession = this.authority.getSession(sessionId);
      if (authSession) {
        this.authority.appendLedgerRecord(authSession, {
          type: 'INVIGILATOR_ACTION_PAUSE',
          ts: Date.now(),
          payload: { invigilatorId, reason: session.pauseReason },
        });
      }

      return res.json({
        success: true,
        sessionId,
        status: session.status,
        isPaused: true,
        pauseReason: session.pauseReason,
      });
    });

    // 3. POST Resume Candidate Session
    this.router.post('/session/:id/resume', (req: Request, res: Response) => {
      const sessionId = req.params.id;
      const { invigilatorId = 'invigilator_admin' } = req.body;

      const session = this.liveSessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ success: false, error: `Session "${sessionId}" not found.` });
      }

      session.isPaused = false;
      session.status = 'ACTIVE';
      session.pauseReason = undefined;

      // Commit action into ledger!
      const authSession = this.authority.getSession(sessionId);
      if (authSession) {
        this.authority.appendLedgerRecord(authSession, {
          type: 'INVIGILATOR_ACTION_RESUME',
          ts: Date.now(),
          payload: { invigilatorId },
        });
      }

      return res.json({
        success: true,
        sessionId,
        status: session.status,
        isPaused: false,
      });
    });

    // 4. POST Request Room Re-Scan
    this.router.post('/session/:id/request-rescan', (req: Request, res: Response) => {
      const sessionId = req.params.id;
      const { instructions = 'Please perform a 360-degree camera sweep of your desk and room workspace.', invigilatorId = 'invigilator_admin' } = req.body;

      const session = this.liveSessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ success: false, error: `Session "${sessionId}" not found.` });
      }

      session.roomRescanPending = true;

      // Commit action into ledger!
      const authSession = this.authority.getSession(sessionId);
      if (authSession) {
        this.authority.appendLedgerRecord(authSession, {
          type: 'INVIGILATOR_ACTION_ROOM_RESCAN_REQUESTED',
          ts: Date.now(),
          payload: { invigilatorId, instructions },
        });
      }

      return res.json({
        success: true,
        sessionId,
        roomRescanPending: true,
        instructions,
      });
    });

    // 5. POST Send Direct or Bulk Message
    this.router.post('/message', (req: Request, res: Response) => {
      const { recipientType, recipientId, examId, text, invigilatorId = 'invigilator_admin' } = req.body;

      if (!text || !recipientType) {
        return res.status(400).json({ success: false, error: 'Message text and recipientType are required.' });
      }

      const msg = {
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        recipientType: recipientType as 'DIRECT' | 'BULK',
        recipientId,
        examId,
        text,
        sentBy: invigilatorId,
        sentAt: Date.now(),
      };

      this.messages.push(msg);

      if (recipientType === 'DIRECT' && recipientId) {
        const session = this.liveSessions.get(recipientId);
        if (session) {
          session.lastMessageReceived = text;
        }

        // Commit direct message to session ledger!
        const authSession = this.authority.getSession(recipientId);
        if (authSession) {
          this.authority.appendLedgerRecord(authSession, {
            type: 'INVIGILATOR_DIRECT_MESSAGE_SENT',
            ts: Date.now(),
            payload: { invigilatorId, text },
          });
        }
      } else if (recipientType === 'BULK') {
        // Log bulk broadcast in all relevant session ledgers
        for (const [sId, s] of this.liveSessions.entries()) {
          if (!examId || s.examId === examId) {
            s.lastMessageReceived = text;
            const authSession = this.authority.getSession(sId);
            if (authSession) {
              this.authority.appendLedgerRecord(authSession, {
                type: 'INVIGILATOR_BULK_MESSAGE_BROADCAST',
                ts: Date.now(),
                payload: { invigilatorId, text, examId },
              });
            }
          }
        }
      }

      return res.json({ success: true, message: msg });
    });

    // 6. POST Escalate to Chief Proctor
    this.router.post('/session/:id/escalate', (req: Request, res: Response) => {
      const sessionId = req.params.id;
      const { reason = 'Suspected coordinated collusion or device bypass.', invigilatorId = 'invigilator_admin' } = req.body;

      const session = this.liveSessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ success: false, error: `Session "${sessionId}" not found.` });
      }

      session.escalatedToChiefProctor = true;

      // Ensure session is in review queue with URGENT priority
      humanReviewQueueService.enqueueSession({
        sessionId,
        candidateId: session.candidateId,
        candidateName: session.candidateName,
        examId: session.examId,
        flagReasons: [`ESCALATED BY PROCTOR: ${reason}`],
        integrityConfidenceScore: session.integrityScore,
        violationPoints: session.violationPoints || 5,
      });

      // Commit escalation to ledger!
      const authSession = this.authority.getSession(sessionId);
      if (authSession) {
        this.authority.appendLedgerRecord(authSession, {
          type: 'INVIGILATOR_ACTION_ESCALATE_CHIEF_PROCTOR',
          ts: Date.now(),
          payload: { invigilatorId, reason },
        });
      }

      return res.json({
        success: true,
        sessionId,
        escalatedToChiefProctor: true,
        reason,
      });
    });

    // 7. GET Review Queue
    this.router.get('/review-queue', (_req: Request, res: Response) => {
      const queue = humanReviewQueueService.getQueue();
      return res.json({ success: true, queue });
    });

    // 8. POST Review Decision (CLEAR, WARN, INVALIDATE)
    this.router.post('/review-decision', (req: Request, res: Response) => {
      const { sessionId, decision, notes = '', reviewerId = 'proctor_admin' } = req.body;
      if (!sessionId || !decision) {
        return res.status(400).json({ success: false, error: 'sessionId and decision are required.' });
      }

      try {
        const item = humanReviewQueueService.recordDecision(sessionId, decision as ReviewDecision, reviewerId, notes);
        const live = this.liveSessions.get(sessionId);
        if (live && decision === 'INVALIDATE') {
          live.status = 'TERMINATED';
        }
        return res.json({ success: true, item });
      } catch (err: any) {
        return res.status(400).json({ success: false, error: err.message });
      }
    });

    // 9. POST Calculate Integrity Score
    this.router.post('/calculate-integrity-score', (req: Request, res: Response) => {
      const breakdown = integrityConfidenceEngine.calculateConfidenceScore(req.body);
      return res.json({ success: true, breakdown });
    });

    // 10. POST Cross-Candidate Collusion Similarity Analysis
    this.router.post('/cross-candidate-analysis', (req: Request, res: Response) => {
      const { examId, submissions, correctAnswers } = req.body;
      const report = crossCandidateAnalysisEngine.analyzeExamCohort(
        examId || 'exam_default',
        submissions || [],
        correctAnswers || {}
      );
      return res.json({ success: true, report });
    });

    // 11. POST Code Similarity & Sandbox Execution
    this.router.post('/code-similarity', (req: Request, res: Response) => {
      const { candidateA, codeA, candidateB, codeB } = req.body;
      const result = codeSimilarityAndSandboxEngine.compareCodeSubmissions(
        candidateA || 'Cand_A',
        codeA || '',
        candidateB || 'Cand_B',
        codeB || ''
      );
      return res.json({ success: true, result });
    });

    this.router.post('/sandbox-execute', async (req: Request, res: Response) => {
      const { code, timeoutMs } = req.body;
      const result = await codeSimilarityAndSandboxEngine.executeInSandbox(code || '', { timeoutMs });
      return res.json({ success: true, result });
    });

    // 12. POST Essay Integrity Analysis
    this.router.post('/essay-analysis', (req: Request, res: Response) => {
      const { essayId, sessionId, candidateId, text, mutations, ikis } = req.body;
      const analysis = essayIntegrityEngine.analyzeEssay(
        essayId || 'essay_1',
        sessionId || 'sess_1',
        candidateId || 'cand_1',
        text || '',
        mutations || [],
        ikis || []
      );
      return res.json({ success: true, analysis });
    });

    // 13. POST Daily Ledger Anchor
    this.router.post('/anchor-daily', (req: Request, res: Response) => {
      const { date, actorId = 'invigilator_admin' } = req.body;
      const targetDate = date || new Date().toISOString().split('T')[0];
      const anchor = dailyLedgerAnchorService.generateDailyAnchor(targetDate, undefined, actorId);
      return res.json({ success: true, anchor });
    });

    this.router.get('/anchors', (_req: Request, res: Response) => {
      return res.json({ success: true, anchors: dailyLedgerAnchorService.getAllAnchors() });
    });
  }
}

export const invigilatorActionController = new InvigilatorActionController();

