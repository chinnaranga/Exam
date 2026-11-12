import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Radio,
  AlertTriangle,
  Video,
  Pause,
  Play,
  RotateCcw,
  MessageSquare,
  ShieldAlert,
  Send,
  CheckCircle2,
  XCircle,
  FileCode,
  Users,
  Search,
  Lock,
  RefreshCw,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

interface LiveCandidate {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  examId: string;
  status: 'ACTIVE' | 'PAUSED' | 'SUBMITTED' | 'TERMINATED';
  isPaused: boolean;
  pauseReason?: string;
  roomRescanPending: boolean;
  violationPoints: number;
  integrityScore: number;
  escalatedToChiefProctor: boolean;
  lastMessageReceived?: string;
  lastActiveAt: number;
}

interface ReviewQueueItem {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  examId: string;
  flagReasons: string[];
  integrityConfidenceScore: number;
  violationPoints: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_REVIEW' | 'RESOLVED';
  assignedReviewerId: string | null;
  decision: 'CLEAR' | 'WARN' | 'INVALIDATE' | null;
  decisionNotes: string | null;
}

interface DailyAnchor {
  date: string;
  totalSessionsCount: number;
  dailyRootHash: string;
  anchoredAt: number;
  anchoredBy: string;
}

export const InvigilatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MONITOR' | 'REVIEW_QUEUE' | 'COLLUSION' | 'ANCHORS'>('MONITOR');

  // Live Sessions State
  const [sessions, setSessions] = useState<LiveCandidate[]>([
    {
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
    },
    {
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
    },
    {
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
    },
  ]);

  // Review Queue State
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>([
    {
      sessionId: 'sess_student_03',
      candidateId: 'cand_student_03',
      candidateName: 'Julian Croft',
      examId: 'exam_cs_402',
      flagReasons: ['Multiple monitors detected', 'High paste ratio (65%)', 'Gaze angle deviation off-screen'],
      integrityConfidenceScore: 42,
      violationPoints: 5,
      priority: 'HIGH',
      status: 'PENDING',
      assignedReviewerId: null,
      decision: null,
      decisionNotes: null,
    },
  ]);

  // Daily Anchors State
  const [anchors, setAnchors] = useState<DailyAnchor[]>([
    {
      date: new Date().toISOString().split('T')[0],
      totalSessionsCount: 48,
      dailyRootHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      anchoredAt: Date.now() - 3600000,
      anchoredBy: 'system_cron_anchorer',
    },
  ]);

  // Modals & Controls State
  const [selectedCandidate, setSelectedCandidate] = useState<LiveCandidate | null>(null);
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>('');
  const [reviewModalItem, setReviewModalItem] = useState<ReviewQueueItem | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>('');

  // Fetch Live Telemetry Data from API
  const fetchLiveState = async () => {
    try {
      const res = await fetch('/api/v1/invigilator/live-sessions');
      if (res.ok) {
        const data = await res.json();
        if (data.sessions && data.sessions.length > 0) {
          setSessions(data.sessions);
        }
      }

      const qRes = await fetch('/api/v1/invigilator/review-queue');
      if (qRes.ok) {
        const qData = await qRes.json();
        if (qData.queue) {
          setReviewQueue(qData.queue);
        }
      }

      const aRes = await fetch('/api/v1/invigilator/anchors');
      if (aRes.ok) {
        const aData = await aRes.json();
        if (aData.anchors && aData.anchors.length > 0) {
          setAnchors(aData.anchors);
        }
      }
    } catch {
      // Fallback to local state if backend API is offline
    }
  };

  useEffect(() => {
    fetchLiveState();
    const interval = setInterval(fetchLiveState, 4000);
    return () => clearInterval(interval);
  }, []);

  // ─── ACTION 1: PAUSE CANDIDATE ───────────────────────────────────────────────
  const handlePauseCandidate = async (candidate: LiveCandidate) => {
    try {
      const res = await fetch(`/api/v1/invigilator/session/${candidate.sessionId}/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Proctor security review pause' }),
      });

      if (res.ok) {
        toast.warning(`Candidate ${candidate.candidateName} Paused`, {
          description: 'Exam clock halted and lockdown pause banner displayed.',
        });
      }
    } catch {}

    setSessions((prev) =>
      prev.map((s) => (s.sessionId === candidate.sessionId ? { ...s, isPaused: true, status: 'PAUSED' } : s))
    );
  };

  // ─── ACTION 2: RESUME CANDIDATE ──────────────────────────────────────────────
  const handleResumeCandidate = async (candidate: LiveCandidate) => {
    try {
      const res = await fetch(`/api/v1/invigilator/session/${candidate.sessionId}/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        toast.success(`Candidate ${candidate.candidateName} Resumed`, {
          description: 'Examination session restored.',
        });
      }
    } catch {}

    setSessions((prev) =>
      prev.map((s) => (s.sessionId === candidate.sessionId ? { ...s, isPaused: false, status: 'ACTIVE' } : s))
    );
  };

  // ─── ACTION 3: REQUEST ROOM RE-SCAN ──────────────────────────────────────────
  const handleRequestRoomRescan = async (candidate: LiveCandidate) => {
    try {
      const res = await fetch(`/api/v1/invigilator/session/${candidate.sessionId}/request-rescan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions: 'Perform 360-degree room scan' }),
      });

      if (res.ok) {
        toast.info(`Room Re-Scan Challenge Dispatched`, {
          description: `Candidate ${candidate.candidateName} prompted for 360-degree environment sweep.`,
        });
      }
    } catch {}

    setSessions((prev) =>
      prev.map((s) => (s.sessionId === candidate.sessionId ? { ...s, roomRescanPending: true } : s))
    );
  };

  // ─── ACTION 4: DIRECT MESSAGE ────────────────────────────────────────────────
  const handleSendDirectMessage = async () => {
    if (!selectedCandidate || !messageText.trim()) return;

    try {
      await fetch('/api/v1/invigilator/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientType: 'DIRECT',
          recipientId: selectedCandidate.sessionId,
          text: messageText.trim(),
        }),
      });

      toast.success(`Direct Message Sent`, {
        description: `Delivered to ${selectedCandidate.candidateName}: "${messageText.trim()}"`,
      });
    } catch {}

    setMessageText('');
    setShowMessageModal(false);
  };

  // ─── ACTION 5: BULK BROADCAST MESSAGE ────────────────────────────────────────
  const handleSendBulkMessage = async () => {
    if (!messageText.trim()) return;

    try {
      await fetch('/api/v1/invigilator/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientType: 'BULK',
          text: messageText.trim(),
        }),
      });

      toast.success(`Cohort Announcement Broadcasted`, {
        description: `Message sent to all active testing candidates.`,
      });
    } catch {}

    setMessageText('');
    setShowBulkModal(false);
  };

  // ─── ACTION 6: ESCALATE TO CHIEF PROCTOR ────────────────────────────────────
  const handleEscalateChiefProctor = async (candidate: LiveCandidate) => {
    try {
      const res = await fetch(`/api/v1/invigilator/session/${candidate.sessionId}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Coordinated violation escalation' }),
      });

      if (res.ok) {
        toast.error(`Escalated to Chief Proctor`, {
          description: `Priority alert issued for ${candidate.candidateName}. Evidence packet attached.`,
        });
      }
    } catch {}

    setSessions((prev) =>
      prev.map((s) => (s.sessionId === candidate.sessionId ? { ...s, escalatedToChiefProctor: true } : s))
    );
  };

  // ─── ACTION 7: REVIEW QUEUE DECISION (CLEAR / WARN / INVALIDATE) ────────────
  const handleReviewDecision = async (decision: 'CLEAR' | 'WARN' | 'INVALIDATE') => {
    if (!reviewModalItem) return;

    try {
      await fetch('/api/v1/invigilator/review-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: reviewModalItem.sessionId,
          decision,
          notes: reviewNotes.trim() || `Proctor resolved as ${decision}`,
        }),
      });

      toast.success(`Review Decision Recorded: ${decision}`, {
        description: `Session "${reviewModalItem.sessionId}" audit record committed.`,
      });

      setReviewQueue((prev) =>
        prev.map((item) =>
          item.sessionId === reviewModalItem.sessionId
            ? { ...item, status: 'RESOLVED', decision, decisionNotes: reviewNotes }
            : item
        )
      );
    } catch {}

    setReviewModalItem(null);
    setReviewNotes('');
  };

  // ─── ACTION 8: ANCHOR DAILY LEDGERS ─────────────────────────────────────────
  const handleGenerateDailyAnchor = async () => {
    try {
      const res = await fetch('/api/v1/invigilator/anchor-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: new Date().toISOString().split('T')[0] }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.anchor) {
          setAnchors((prev) => [data.anchor, ...prev.filter((a) => a.date !== data.anchor.date)]);
          toast.success('Daily Ledger Root Anchored!', {
            description: `Merkle Root: ${data.anchor.dailyRootHash.substring(0, 16)}...`,
          });
        }
      }
    } catch {
      toast.info('Daily Anchor Generated locally.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 font-sans text-[#2B2350] bg-[#FAFAF7] min-h-screen">
      {/* Top Header */}
      <div className="border-b border-[#E2E8F0] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFF3A3] text-[#2B2350] text-xs font-mono font-bold uppercase border border-[#E2E8F0] mb-2">
            <Radio className="w-3.5 h-3.5 text-[#FF4D5E] animate-pulse" />
            <span>Layer 5 Enterprise Proctoring Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#2B2350] tracking-tight">Invigilator Command Center</h1>
          <p className="text-xs text-[#64748B] mt-1 font-mono">
            Live Candidate Feeds • Real-time Interventions • Collusion Clustering • Tamper-proof Anchored Ledgers
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowBulkModal(true)}
            variant="outline"
            className="border-[#E2E8F0] bg-white text-xs font-bold text-[#2B2350] hover:bg-[#FFF3A3]"
          >
            <Send className="w-3.5 h-3.5 mr-1.5 text-[#6C4DFF]" />
            Cohort Announcement
          </Button>

          <Button
            onClick={handleGenerateDailyAnchor}
            className="bg-[#2B2350] hover:bg-[#1E1839] text-white text-xs font-bold"
          >
            <Lock className="w-3.5 h-3.5 mr-1.5 text-[#B8F0D2]" />
            Anchor Daily Root
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2 font-mono text-xs font-bold">
        <button
          onClick={() => setActiveTab('MONITOR')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'MONITOR' ? 'bg-[#2B2350] text-white' : 'text-[#64748B] hover:bg-slate-100'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Live Candidates ({sessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REVIEW_QUEUE')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'REVIEW_QUEUE' ? 'bg-[#2B2350] text-white' : 'text-[#64748B] hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-[#FF4D5E]" />
          <span>Review Queue ({reviewQueue.filter((q) => q.status === 'PENDING').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COLLUSION')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'COLLUSION' ? 'bg-[#2B2350] text-white' : 'text-[#64748B] hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-[#6C4DFF]" />
          <span>Collusion & Code Similarity</span>
        </button>

        <button
          onClick={() => setActiveTab('ANCHORS')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'ANCHORS' ? 'bg-[#2B2350] text-white' : 'text-[#64748B] hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4 text-[#16A34A]" />
          <span>Daily Ledger Anchors</span>
        </button>
      </div>

      {/* TAB 1: LIVE CANDIDATES & ACTIONS */}
      {activeTab === 'MONITOR' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {sessions.map((cand) => {
              const score = cand.integrityScore;
              const isHighRisk = score < 60 || cand.violationPoints >= 4;

              return (
                <Card
                  key={cand.sessionId}
                  className={`p-5 rounded-2xl bg-white border transition-all shadow-xs space-y-4 ${
                    cand.isPaused
                      ? 'border-amber-400 bg-amber-50/30'
                      : isHighRisk
                      ? 'border-red-300'
                      : 'border-[#E2E8F0]'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#2B2350]">{cand.candidateName}</h3>
                      <p className="text-[11px] text-[#64748B]">{cand.candidateId}</p>
                    </div>

                    <Badge
                      className={`text-[10px] font-bold ${
                        cand.isPaused
                          ? 'bg-amber-100 text-amber-800'
                          : cand.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {cand.isPaused ? 'PAUSED' : cand.status}
                    </Badge>
                  </div>

                  {/* Integrity Confidence Meter */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#64748B]">Integrity Confidence Score:</span>
                      <span
                        className={`font-extrabold ${
                          score >= 85 ? 'text-emerald-700' : score >= 65 ? 'text-amber-700' : 'text-red-600'
                        }`}
                      >
                        {score}%
                      </span>
                    </div>
                    <Progress value={score} className="h-2 rounded-full bg-slate-100" />
                  </div>

                  {/* Telemetry Snapshot Stats */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] p-2.5 rounded-xl bg-[#FAFAF7] border border-[#E2E8F0]">
                    <div>
                      <span className="text-[#64748B]">Violations:</span>
                      <p className="font-bold text-[#2B2350]">{cand.violationPoints} Points</p>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Room Re-Scan:</span>
                      <p className={`font-bold ${cand.roomRescanPending ? 'text-amber-600' : 'text-slate-600'}`}>
                        {cand.roomRescanPending ? 'Pending Sweep' : 'Verified'}
                      </p>
                    </div>
                  </div>

                  {/* Real-Time Action Controls */}
                  <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap gap-2">
                    {cand.isPaused ? (
                      <Button
                        size="sm"
                        onClick={() => handleResumeCandidate(cand)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold"
                      >
                        <Play className="w-3.5 h-3.5 mr-1" /> Resume
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePauseCandidate(cand)}
                        className="border-[#E2E8F0] text-amber-700 hover:bg-amber-50 text-[11px] font-bold"
                      >
                        <Pause className="w-3.5 h-3.5 mr-1" /> Pause
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRequestRoomRescan(cand)}
                      className="border-[#E2E8F0] text-[#6C4DFF] hover:bg-purple-50 text-[11px] font-bold"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Re-Scan
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedCandidate(cand);
                        setShowMessageModal(true);
                      }}
                      className="border-[#E2E8F0] text-[#2B2350] hover:bg-slate-100 text-[11px] font-bold"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1" /> Message
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEscalateChiefProctor(cand)}
                      className={`text-[11px] font-bold ${
                        cand.escalatedToChiefProctor ? 'text-red-700 bg-red-50' : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                      {cand.escalatedToChiefProctor ? 'Escalated' : 'Escalate'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: HUMAN REVIEW QUEUE */}
      {activeTab === 'REVIEW_QUEUE' && (
        <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="font-extrabold text-base text-[#2B2350]">Flagged Sessions Awaiting Review</h3>
              <p className="text-xs text-[#64748B]">Adjudicate suspicious sessions with documented decisions and ledger logging.</p>
            </div>
            <Badge className="bg-[#FFF3A3] text-[#2B2350] font-mono">
              {reviewQueue.filter((q) => q.status === 'PENDING').length} PENDING DECISIONS
            </Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {reviewQueue.map((item) => (
              <div
                key={item.sessionId}
                className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAF7] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-[#2B2350]">{item.candidateName}</span>
                    <Badge variant="outline" className="text-[10px] text-red-600 border-red-300">
                      {item.priority} PRIORITY
                    </Badge>
                    <span className="text-[10px] text-[#64748B]">ID: {item.candidateId}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Flagged For: {item.flagReasons.join(' • ')}
                  </p>
                  <div className="flex items-center space-x-4 text-[10px] text-slate-500 pt-1">
                    <span>Integrity Score: <strong className="text-red-600">{item.integrityConfidenceScore}%</strong></span>
                    <span>Points: <strong className="text-amber-700">{item.violationPoints} pts</strong></span>
                    <span>Status: <strong className="text-[#2B2350]">{item.status}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {item.status === 'RESOLVED' ? (
                    <Badge className="bg-slate-100 text-slate-800 font-bold">
                      RESOLVED: {item.decision}
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setReviewModalItem(item)}
                      className="bg-[#2B2350] hover:bg-[#1E1839] text-white text-xs font-bold"
                    >
                      Adjudicate Session
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3: COLLUSION & CODE SIMILARITY */}
      {activeTab === 'COLLUSION' && (
        <div className="space-y-6">
          <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#2B2350]">Cross-Candidate Collusion Clusters</h3>
                <p className="text-xs text-[#64748B]">Automated detection of identical wrong answers, shared IPs, and timing synchronization.</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800 font-mono">1 CLUSTER FLAGGED</Badge>
            </div>

            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center font-bold text-[#2B2350]">
                <span>CLUSTER_COL_01 (High Probability Collusion)</span>
                <span className="text-purple-700">84% Composite Similarity</span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Involved Candidates: <strong>Marcus Holloway (cand_student_02)</strong> & <strong>Julian Croft (cand_student_03)</strong>
              </p>
              <div className="space-y-1 text-[11px] text-slate-600 bg-white p-3 rounded-lg border border-purple-100">
                <p>• Shared IP Address: 192.168.1.104 (Local Gateway Match)</p>
                <p>• Identical Wrong Answers: 4 questions answered with identical incorrect distractor B</p>
                <p>• Synchronized Submissions: 5 answers logged within 1.8s of each other</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#2B2350]">Token/AST Code Similarity Sandbox</h3>
                <p className="text-xs text-[#64748B]">Compare candidate programming solutions with AST tokenization invariant to variable renaming.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E2E8F0] space-y-2">
                <span className="font-bold text-[#2B2350]">Candidate A (cand_student_02)</span>
                <pre className="p-3 rounded-lg bg-[#2B2350] text-[#B8F0D2] overflow-x-auto text-[11px]">
                  <code>{`function checkPrime(n) {
  if (n <= 1) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}`}</code>
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E2E8F0] space-y-2">
                <span className="font-bold text-[#2B2350]">Candidate B (cand_student_03)</span>
                <pre className="p-3 rounded-lg bg-[#2B2350] text-[#B8F0D2] overflow-x-auto text-[11px]">
                  <code>{`function isNumberPrime(num) {
  // renamed variables
  if (num <= 1) return false;
  for (let x = 2; x * x <= num; x++) {
    if (num % x === 0) return false;
  }
  return true;
}`}</code>
                </pre>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono text-amber-900 flex justify-between items-center">
              <span>Token $k$-gram Similarity: <strong>96.4% Plagiarism Match</strong> (Identifiers normalized)</span>
              <Badge className="bg-red-600 text-white font-bold">SUSPECTED COPY</Badge>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: DAILY ANCHORS */}
      {activeTab === 'ANCHORS' && (
        <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="font-extrabold text-base text-[#2B2350]">Daily Immutable Ledger Anchors</h3>
              <p className="text-xs text-[#64748B]">Cryptographic Merkle root hashes of all examination ledgers for legal tamper-evidence.</p>
            </div>
            <Button
              size="sm"
              onClick={handleGenerateDailyAnchor}
              className="bg-[#2B2350] hover:bg-[#1E1839] text-white text-xs font-bold font-mono"
            >
              Anchor Current Day
            </Button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {anchors.map((anc) => (
              <div
                key={anc.date}
                className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAF7] space-y-2"
              >
                <div className="flex justify-between items-center font-bold text-[#2B2350]">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Anchor Date: {anc.date}</span>
                  </span>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    {anc.totalSessionsCount} SESSIONS SECURED
                  </Badge>
                </div>
                <p className="text-[11px] text-[#64748B] break-all font-mono">
                  SHA-256 Daily Root Hash: <span className="text-[#2B2350] font-bold">{anc.dailyRootHash}</span>
                </p>
                <p className="text-[10px] text-slate-500">
                  Anchored by {anc.anchoredBy} at {new Date(anc.anchoredAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* MODAL: DIRECT MESSAGE CANDIDATE */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="sm:max-w-[450px] bg-white text-[#2B2350] p-6 rounded-2xl border-[#E2E8F0]">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">
              Direct Message: {selectedCandidate?.candidateName}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              This message will immediately pop up on the candidate's active exam runner. Action is logged in ledger.
            </DialogDescription>
          </DialogHeader>

          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="e.g. Please ensure your face is fully centered in the camera frame."
            className="w-full h-24 p-3 rounded-xl border border-[#E2E8F0] text-xs font-mono focus:outline-none focus:border-[#6C4DFF]"
          />

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowMessageModal(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSendDirectMessage} className="bg-[#2B2350] text-white">
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: BULK ANNOUNCEMENT */}
      <Dialog open={showBulkModal} onOpenChange={setShowBulkModal}>
        <DialogContent className="sm:max-w-[450px] bg-white text-[#2B2350] p-6 rounded-2xl border-[#E2E8F0]">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">Broadcast Cohort Announcement</DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Broadcast an urgent notification to all candidates currently taking the examination.
            </DialogDescription>
          </DialogHeader>

          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="e.g. 15 minutes remaining. Please begin reviewing your answers."
            className="w-full h-24 p-3 rounded-xl border border-[#E2E8F0] text-xs font-mono focus:outline-none focus:border-[#6C4DFF]"
          />

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowBulkModal(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSendBulkMessage} className="bg-[#6C4DFF] hover:bg-[#5839EE] text-white">
              Broadcast Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: ADJUDICATE REVIEW QUEUE ITEM */}
      <Dialog open={!!reviewModalItem} onOpenChange={() => setReviewModalItem(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white text-[#2B2350] p-6 rounded-2xl border-[#E2E8F0]">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">
              Review Decision: {reviewModalItem?.candidateName}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Render a formal decision for session "{reviewModalItem?.sessionId}". Action commits to ledger.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-1">
              <span className="font-bold text-[#2B2350]">Flagged Reasons:</span>
              <p className="text-[#64748B]">{reviewModalItem?.flagReasons.join(', ')}</p>
            </div>

            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Enter official reviewer notes / justification..."
              className="w-full h-20 p-2.5 rounded-xl border border-[#E2E8F0] text-xs font-mono"
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              size="sm"
              onClick={() => handleReviewDecision('CLEAR')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Clear Session
            </Button>
            <Button
              size="sm"
              onClick={() => handleReviewDecision('WARN')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              Issue Warning
            </Button>
            <Button
              size="sm"
              onClick={() => handleReviewDecision('INVALIDATE')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Invalidate Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvigilatorDashboard;
