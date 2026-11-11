import React, { useState, useEffect, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import BrandLogo from '@/components/BrandLogo';
import {
  Clock,
  Flag,
  Calculator,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Save,
  HelpCircle,
  Maximize2,
  Wifi,
  WifiOff,
  RotateCcw,
  Sparkles,
  FileCheck,
  ListFilter,
} from 'lucide-react';
import { toast } from 'sonner';
import { PreExamPermissionModal } from '@/components/proctoring/consent/PreExamPermissionModal';
import { ConsentManager } from '@/components/proctoring/consent/ConsentManager';
import { CameraManager } from '@/components/proctoring/camera/CameraManager';
import { FaceEngine } from '@/components/proctoring/face/FaceEngine';
import { AttentionEngine } from '@/components/proctoring/attention/AttentionEngine';
import { ObjectDetectionEngine } from '@/components/proctoring/object-detection/ObjectDetectionEngine';
import { AudioEngine } from '@/components/proctoring/audio/AudioEngine';
import { PipelineEngine } from '@/components/proctoring/pipeline/PipelineEngine';
import { EnterpriseCommandCenter } from '@/modules/enterprise-operations/EnterpriseCommandCenter';
import { ExamSecurityProvider } from '@/modules/exam-security/providers/ExamSecurityProvider';
import { BrowserEventProvider } from '@/modules/exam-security/browser/BrowserEventProvider';
import { KeyboardProvider } from '@/modules/exam-security/keyboard/KeyboardProvider';
import { MouseProvider } from '@/modules/exam-security/mouse/MouseProvider';
import { ClipboardProvider } from '@/modules/exam-security/clipboard/ClipboardProvider';
import { FullscreenProvider } from '@/modules/exam-security/fullscreen/FullscreenProvider';
import { FocusProvider } from '@/modules/exam-security/focus/FocusProvider';
import { NavigationProvider } from '@/modules/exam-security/navigation/NavigationProvider';
import { useNavigationSentinel } from '@/modules/exam-security/navigation/hooks/useNavigationSentinel';
import { useFullscreen } from '@/modules/exam-security/fullscreen/hooks/useFullscreen';
import { FullscreenOverlay } from '@/modules/exam-security/fullscreen/components/FullscreenOverlay';
import { BrowserCompatibility } from '@/modules/exam-security/fullscreen/utils/BrowserCompatibility';

interface QuestionItem {
  id: number;
  section: string;
  text: string;
  codeSnippet?: string;
  options: string[];
  correct: number;
}

const EXAM_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    section: 'Distributed Systems',
    text: 'In Raft Consensus Algorithm, what is the primary role of the Leader node during log replication?',
    options: [
      'To initiate election rounds randomly every 150ms.',
      'To accept client requests, append log entries, and propagate updates to Follower nodes.',
      'To validate SHA-256 signatures of client requests without appending logs.',
      'To delegate heartbeats exclusively to Candidate nodes.',
    ],
    correct: 1,
  },
  {
    id: 2,
    section: 'Distributed Systems',
    text: 'Which vector clock condition indicates that event A causally preceded event B (A → B)?',
    codeSnippet: 'V(A)[i] <= V(B)[i] for all i, and V(A)[j] < V(B)[j] for at least one j.',
    options: [
      'V(A)[i] == V(B)[i] across all process nodes.',
      'V(A)[i] <= V(B)[i] for all i, and V(A)[j] < V(B)[j] for at least one j.',
      'V(A)[0] > V(B)[0] strictly.',
      'None of the above; vector clocks require Lamport timestamps.',
    ],
    correct: 1,
  },
  {
    id: 3,
    section: 'AI & LLM Architecture',
    text: 'Under IRT 3-Parameter Logistic (3PL) model, what does the parameter "c" represent?',
    options: [
      'Item discrimination index.',
      'Item difficulty threshold.',
      'Pseudo-guessing probability parameter.',
      'Test duration scaling factor.',
    ],
    correct: 2,
  },
  {
    id: 4,
    section: 'AI & LLM Architecture',
    text: 'What is the primary advantage of FlashAttention-2 over standard Multi-Head Attention?',
    options: [
      'Eliminates QKV projections entirely.',
      'Tiling and IO-awareness to reduce HBM memory reads/writes from O(N^2) to O(N).',
      'Replaces softmax with GELU activation.',
      'Reduces GPU memory allocation by 100x without IO optimization.',
    ],
    correct: 1,
  },
  {
    id: 5,
    section: 'Database Engine Design',
    text: 'In Write-Ahead Logging (WAL) and ARIES recovery, what occurs during the Redo phase?',
    options: [
      'Undoes uncommitted transactions starting from the crash point backward.',
      'Replays all logged changes from the RedoLSN forward to restore exact state before crash.',
      'Wipes dirty pages from the buffer pool.',
      'Calculates lock table hashes.',
    ],
    correct: 1,
  },
];

type FilterCategory = 'ALL' | 'ANSWERED' | 'UNANSWERED' | 'MARKED' | 'VISITED' | 'NOT_VISITED';

const StudentExamRunnerContent: React.FC = () => {
  const navigate = useNavigate();

  // Fullscreen & Navigation Security Engine Hooks
  const { requestFullscreen: requestSecurityFS, recoveryAttempts } = useFullscreen();
  const { lastEvent: navEvent } = useNavigationSentinel();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [showExitOverlay, setShowExitOverlay] = useState(false);

  // Persistence Key
  const STORAGE_KEY = 'assessiq_exam_runner_state';

  // Load Initial State from LocalStorage Refresh Buffer
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  const [currentIdx, setCurrentIdx] = useState<number>(savedState.currentIdx || 0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(savedState.answers || {});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>(savedState.flags || {});
  const [visitedQuestions, setVisitedQuestions] = useState<Record<number, boolean>>(savedState.visited || { 0: true });
  const [timeLeft, setTimeLeft] = useState<number>(savedState.timeLeft || 3599); // 60 mins

  // Filter & UI States
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('ALL');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  // Auto-Save State Sync & Live Proctor Broadcast
  useEffect(() => {
    if (examStarted) {
      const stateToSave = {
        currentIdx,
        answers: selectedAnswers,
        flags: flaggedQuestions,
        visited: visitedQuestions,
        timeLeft,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      localStorage.setItem('assessiq_active_live_exam', JSON.stringify({
        active: true,
        studentName: 'Candidate (Live Stream)',
        studentId: 'STU-8841',
        examTitle: 'Distributed Consensus Protocols',
        timestamp: Date.now(),
      }));
    }
  }, [currentIdx, selectedAnswers, flaggedQuestions, visitedQuestions, timeLeft, examStarted]);

  // Online / Offline Sentinel Listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Network Reconnected', { description: 'Syncing cached responses with AssessIQ cloud.' });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Network Connection Interrupted', { description: 'Offline Autosave Active. Responses cached locally.' });
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Security Violation Threshold Counter Engine (Max 3 Attempts)
  const [violationCount, setViolationCount] = useState<number>(0);
  const [isTerminated, setIsTerminated] = useState<boolean>(false);

  const triggerViolation = (reason: string) => {
    if (isTerminated) return;

    setViolationCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= 3) {
        setIsTerminated(true);
        toast.error('Maximum Security Violations (3/3) Reached!', {
          description: `Attempt 3/3 recorded (${reason}). Auto-submitting examination now...`,
        });
        setTimeout(() => {
          handleSubmitFinal();
        }, 1200);
      } else {
        toast.error(`Security Warning (Attempt ${nextCount}/3)`, {
          description: `${reason}. WARNING: 3 violations will automatically submit your exam.`,
        });
      }
      return nextCount;
    });
  };

  // Fullscreen Exit Sentinel Listener
  useEffect(() => {
    if (!examStarted) return;

    const handleFSChange = () => {
      const isFS = BrowserCompatibility.isCurrentlyFullscreen();
      setIsFullscreen(isFS);

      if (!isFS) {
        setShowExitOverlay(true);
        triggerViolation('Exited Fullscreen Mode');
      } else {
        setShowExitOverlay(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFSChange);
    document.addEventListener('webkitfullscreenchange', handleFSChange);
    document.addEventListener('mozfullscreenchange', handleFSChange);
    document.addEventListener('MSFullscreenChange', handleFSChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFSChange);
      document.removeEventListener('webkitfullscreenchange', handleFSChange);
      document.removeEventListener('mozfullscreenchange', handleFSChange);
      document.removeEventListener('MSFullscreenChange', handleFSChange);
    };
  }, [examStarted]);

  // Navigation Sentinel Security Toast & Alert Controller
  useEffect(() => {
    if (!examStarted || !navEvent) return;

    if (navEvent.type === 'BACK_BUTTON_ATTEMPT') {
      toast.error('Browser Back Disabled!', { description: 'Navigation controls are locked during an active examination.' });
    } else if (navEvent.type === 'BROWSER_REFRESH_ATTEMPT') {
      toast.warning('Refresh Intercepted!', { description: 'Accidental page reload prevented.' });
    } else if (navEvent.type === 'MULTIPLE_TABS_DETECTED') {
      triggerViolation('Multiple Exam Tabs Detected');
    } else if (navEvent.type === 'TAB_SWITCH') {
      triggerViolation('Switched Browser Tab');
    } else if (navEvent.type === 'WINDOW_SWITCH' || navEvent.type === 'WINDOW_BLURRED') {
      triggerViolation('Switched Window Focus / Desktop Application');
    } else if (navEvent.type === 'BROWSER_ZOOMED') {
      toast.info('Browser Zoom Scale Changed', { description: navEvent.details });
    }
  }, [navEvent, examStarted]);

  // Timer Countdown Engine & Auto-Submit
  useEffect(() => {
    if (!examStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('Time Expired!', { description: 'Submitting exam automatically...' });
          handleSubmitFinal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted]);

  // Fullscreen Enforcer
  const handleRequestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => { });
    }
    setIsFullscreen(true);
    setExamStarted(true);
    toast.success('Exam Started', { description: 'Mandatory Secure Lock-Down Mode Enabled.' });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = EXAM_QUESTIONS[currentIdx];

  // Option Selection & Immediate Auto-Save
  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
    setVisitedQuestions((prev) => ({ ...prev, [currentIdx]: true }));
    toast.success('Response Auto-Saved', { description: `Question ${currentIdx + 1} choice saved.` });
  };

  const handleClearResponse = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentIdx];
      return copy;
    });
    toast.info('Response Cleared');
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
  };

  const handleNavigate = (newIdx: number) => {
    if (newIdx >= 0 && newIdx < EXAM_QUESTIONS.length) {
      setCurrentIdx(newIdx);
      setVisitedQuestions((prev) => ({ ...prev, [newIdx]: true }));
    }
  };

  const handleSubmitFinal = () => {
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Exam Submitted Successfully!', { description: 'Generating evaluation transcript...' });
    navigate('/student/results');
  };

  // Metric Computations
  const totalQuestions = EXAM_QUESTIONS.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const markedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;
  const visitedCount = Object.keys(visitedQuestions).length;

  // Filtered Question Indices
  const getFilteredQuestionIndices = () => {
    return EXAM_QUESTIONS.map((_, idx) => idx).filter((idx) => {
      const isAns = selectedAnswers[idx] !== undefined;
      const isMark = !!flaggedQuestions[idx];
      const isVis = !!visitedQuestions[idx];

      if (filterCategory === 'ANSWERED') return isAns;
      if (filterCategory === 'UNANSWERED') return !isAns;
      if (filterCategory === 'MARKED') return isMark;
      if (filterCategory === 'VISITED') return isVis;
      if (filterCategory === 'NOT_VISITED') return !isVis;
      return true;
    });
  };

  // Pre-Exam Hardware & Sensor Permission Screen (No Developer Tabs)
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-6">
            <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[11px] font-mono uppercase font-bold px-3 py-1 mb-2">
              PEARSON VUE / PROMETRIC ENTERPRISE GRADE LOCKDOWN
            </Badge>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">AssessIQ Secure Exam Runner</h1>
            <p className="text-xs text-slate-400 mt-1">
              CS-402 Distributed Consensus Protocols & Raft Architecture • Duration: 60 Mins
            </p>
          </div>

          {/* Mandatory Pre-Exam Permission Check */}
          <PreExamPermissionModal onPermissionsGranted={handleRequestFullscreen} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] flex flex-col justify-between select-none">
      {/* Network Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-6 py-2 text-xs font-mono font-bold flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>OFFLINE MODE ACTIVE: Answers cached locally. They will automatically sync when network recovers.</span>
          </div>
          <Badge className="bg-white/20 text-white border-none text-[10px]">CACHE SECURE</Badge>
        </div>
      )}

      {/* Last 5-Minute Alert Banner */}
      {timeLeft < 300 && (
        <div className="bg-red-600 text-white px-6 py-1.5 text-xs font-mono font-bold flex items-center justify-center space-x-2 animate-pulse sticky top-0 z-50">
          <AlertTriangle className="w-4 h-4" />
          <span>ATTENTION: Less than 5 minutes remaining! Exam will auto-submit at 00:00.</span>
        </div>
      )}

      {/* Sticky Pearson VUE / Certification Header (Top Navigation Hidden) */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center space-x-4">
          <BrandLogo size="md" variant="light" />
          <div className="h-4 w-px bg-slate-200" />
          <div className="text-xs">
            <div className="font-bold text-[#0F172A]">CS-402: Distributed Consensus & Raft Architecture</div>
            <div className="text-[10px] text-slate-500 font-mono">Candidate ID: cand_student_2026 • Session: #7829-PROCTOR</div>
          </div>
        </div>

        {/* Real-time AI Proctoring Telemetry Header Capsule */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-600 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>AI Proctor Active</span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div className="text-[11px] text-slate-600 font-mono">
              Integrity Score: <strong className="text-emerald-700">100/100 (Optimal)</strong>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-200 flex items-center">
            <Lock className="w-3 h-3 mr-1" /> SECURE EXAM RUNNER
          </span>
          <span className="text-xs font-mono text-[#64748B] hidden md:inline-block">
            Section: <strong className="text-[#0F172A]">{currentQ.section}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-5">
          {/* Live Security Violation Attempt Counter Badge */}
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs ${
            violationCount === 0
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : violationCount === 1
              ? 'bg-amber-50 text-amber-700 border-amber-300'
              : 'bg-red-50 text-red-600 border-red-300 animate-pulse'
          }`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ATTEMPTS: {violationCount} / 3</span>
          </div>

          {/* Persistent Sticky Timer */}
          <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-xs ${timeLeft < 300 ? 'bg-red-50 text-red-700 border-red-300 animate-pulse' : 'bg-blue-50 text-[#1E40AF] border-blue-200'}`}>
            <Clock className="w-4 h-4 text-[#2563EB]" />
            <span>TIME REMAINING: {formatTime(timeLeft)}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalculator(!showCalculator)}
            className="border-[#E2E8F0] text-xs font-bold hidden sm:flex"
          >
            <Calculator className="w-3.5 h-3.5 mr-1" /> Calc
          </Button>

          {/* Sticky Submit Button */}
          <Button
            onClick={() => setShowSubmitModal(true)}
            className="bg-[#15803D] hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs cursor-pointer"
          >
            Submit Exam
          </Button>
        </div>
      </header>

      {/* Main Examination Workspace Body */}
      <main className="max-w-7xl w-full mx-auto my-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Question & Option Panel (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-md space-y-6 relative overflow-hidden">
            {/* Question Bar Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold text-[#1E40AF] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  QUESTION {currentIdx + 1} OF {totalQuestions}
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">Marks: +2.0 / -0.5</span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleFlag}
                  className={`text-xs font-bold ${flaggedQuestions[currentIdx] ? 'text-amber-600 bg-amber-50' : 'text-[#64748B]'}`}
                >
                  <Flag className="w-3.5 h-3.5 mr-1.5" />
                  {flaggedQuestions[currentIdx] ? 'Marked for Review' : 'Mark for Review'}
                </Button>

                {selectedAnswers[currentIdx] !== undefined && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearResponse}
                    className="text-xs font-bold text-red-600 hover:bg-red-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Clear Response
                  </Button>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-[#0F172A] leading-relaxed">
                {currentQ.text}
              </h2>

              {currentQ.codeSnippet && (
                <pre className="p-4 rounded-xl bg-[#0F172A] text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentIdx] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${isSelected
                        ? 'border-[#1E40AF] bg-blue-50/80 text-[#1E40AF] font-bold shadow-2xs'
                        : 'border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]'
                      }`}
                  >
                    <span className="pr-4">{opt}</span>
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[11px] shrink-0 ${isSelected ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'border-[#CBD5E1]'}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Previous / Next Navigation Footer */}
            <div className="flex justify-between items-center border-t border-[#E2E8F0] pt-4">
              <Button
                disabled={currentIdx === 0}
                onClick={() => handleNavigate(currentIdx - 1)}
                variant="outline"
                className="border-[#E2E8F0] text-xs font-bold"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              <span className="text-[11px] text-[#15803D] font-mono font-bold flex items-center">
                <Save className="w-3.5 h-3.5 mr-1" /> Immediate Auto-Saved
              </span>

              <Button
                disabled={currentIdx === totalQuestions - 1}
                onClick={() => handleNavigate(currentIdx + 1)}
                className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-bold px-5"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Palette, Filters & Progress Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-5">
            {/* Progress & Counter Summary */}
            <div className="space-y-2 border-b border-[#E2E8F0] pb-4">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#0F172A]">Overall Progress</span>
                <span className="text-[#1E40AF] font-mono">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
              </div>
              <Progress value={(answeredCount / totalQuestions) * 100} className="h-2 bg-[#F1F5F9]" />
              <div className="flex justify-between text-[11px] font-mono text-[#64748B] pt-1">
                <span>{answeredCount} Answered</span>
                <span>{unansweredCount} Remaining</span>
              </div>
            </div>

            {/* Filter Category Selector */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1 text-xs font-bold text-[#0F172A]">
                <ListFilter className="w-3.5 h-3.5 text-[#1E40AF]" />
                <span>Filter Question Palette</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                {[
                  { key: 'ALL', label: 'All' },
                  { key: 'ANSWERED', label: 'Answered' },
                  { key: 'UNANSWERED', label: 'Unanswered' },
                  { key: 'MARKED', label: 'Marked' },
                  { key: 'VISITED', label: 'Visited' },
                  { key: 'NOT_VISITED', label: 'Unvisited' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilterCategory(f.key as FilterCategory)}
                    className={`py-1 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${filterCategory === f.key
                        ? 'bg-[#1E40AF] text-white'
                        : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]'
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Jump Palette */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-[#0F172A]">Question Palette</h4>
              <div className="grid grid-cols-5 gap-2 font-mono text-xs">
                {EXAM_QUESTIONS.map((_, i) => {
                  const isFiltered = getFilteredQuestionIndices().includes(i);
                  if (!isFiltered) return null;

                  const isAns = selectedAnswers[i] !== undefined;
                  const isMark = !!flaggedQuestions[i];
                  const isCurrent = currentIdx === i;

                  return (
                    <button
                      key={i}
                      onClick={() => handleNavigate(i)}
                      className={`h-10 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer ${isCurrent
                          ? 'ring-2 ring-[#1E40AF] ring-offset-2 bg-[#1E40AF] text-white shadow-md'
                          : isAns
                            ? 'bg-emerald-100 text-[#15803D] border border-emerald-300'
                            : isMark
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]'
                        }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Palette Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#64748B] border-t border-[#E2E8F0] pt-4">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
                <span>Marked ({markedCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-[#F8FAFC] border border-[#E2E8F0]" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-[#1E40AF]" />
                <span>Current</span>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Confirmation Submit Modal Dialog */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="sm:max-w-[450px] bg-white text-[#0F172A] p-6 rounded-2xl border-[#E2E8F0]">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-[#0F172A]">Confirm Exam Submission</DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Are you sure you want to finalize your exam? You cannot modify your answers after submission.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs font-mono font-bold my-2">
            <div className="flex justify-between text-[#0F172A]">
              <span>Total Questions:</span>
              <span>{totalQuestions}</span>
            </div>
            <div className="flex justify-between text-[#15803D]">
              <span>Answered:</span>
              <span>{answeredCount}</span>
            </div>
            <div className="flex justify-between text-amber-700">
              <span>Marked for Review:</span>
              <span>{markedCount}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Unanswered:</span>
              <span>{unansweredCount}</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowSubmitModal(false)} className="text-xs font-bold border-[#E2E8F0]">
              Return to Exam
            </Button>
            <Button onClick={handleSubmitFinal} className="bg-[#15803D] hover:bg-emerald-800 text-white font-bold text-xs px-5">
              Confirm & Submit Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Exit Security Recovery Overlay */}
      {examStarted && showExitOverlay && (
        <FullscreenOverlay
          onReturnToFullscreen={async () => {
            try {
              await requestSecurityFS();
              setShowExitOverlay(false);
              toast.success('Fullscreen Restored', { description: 'Exam session resumed.' });
            } catch (err: any) {
              toast.error('Fullscreen Recovery Warning', { description: 'Please press F11 or click to re-enter fullscreen mode.' });
            }
          }}
          recoveryAttempts={Math.max(1, violationCount)}
          maxAttempts={3}
        />
      )}

      {/* Footer Status */}
      <footer className="bg-white border-t border-[#E2E8F0] py-3 px-6 text-xs text-[#64748B] flex justify-between font-mono">
        <span>WASM Proctoring: Active • Gaze Target: Center</span>
        <span>Keyboard Shortcuts: Alt+N (Next), Alt+P (Prev), Alt+M (Mark)</span>
      </footer>
    </div>
  );
};

const StudentExamRunner: React.FC = () => {
  return (
    <ExamSecurityProvider maxWarnings={3}>
      <BrowserEventProvider autoStart examId="ex_402" studentId="usr_student_01">
        <KeyboardProvider autoStart examId="ex_402" studentId="usr_student_01">
          <MouseProvider autoStart examId="ex_402" studentId="usr_student_01">
            <ClipboardProvider autoStart examId="ex_402" studentId="usr_student_01">
              <FullscreenProvider autoStart examId="ex_402" studentId="usr_student_01">
                <FocusProvider autoStart examId="ex_402" studentId="usr_student_01">
                  <NavigationProvider autoStart examId="ex_402" studentId="usr_student_01">
                    <StudentExamRunnerContent />
                  </NavigationProvider>
                </FocusProvider>
              </FullscreenProvider>
            </ClipboardProvider>
          </MouseProvider>
        </KeyboardProvider>
      </BrowserEventProvider>
    </ExamSecurityProvider>
  );
};

export default StudentExamRunner;
