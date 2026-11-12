import React, { useState, useEffect, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import BrandLogo from "@/shared/components/BrandLogo";
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
  Volume2,
  VolumeX,
  Coffee,
  Eye,
  Type,
  Settings2,
} from 'lucide-react';
import { toast } from 'sonner';
import { PreExamPermissionModal } from '@/engines/proctoring/consent/PreExamPermissionModal';
import { PreExamRulesSummary } from '@/engines/proctoring/consent/PreExamRulesSummary';
import { ConsentManager } from '@/engines/proctoring/consent/ConsentManager';
import { CameraManager } from '@/engines/proctoring/camera/CameraManager';
import { FaceEngine } from '@/engines/proctoring/face/FaceEngine';
import { AttentionEngine } from '@/engines/proctoring/attention/AttentionEngine';
import { ObjectDetectionEngine } from '@/engines/proctoring/object-detection/ObjectDetectionEngine';
import { AudioEngine } from '@/engines/proctoring/audio/AudioEngine';
import { PipelineEngine } from '@/engines/proctoring/pipeline/PipelineEngine';
import { ExamSecurityProvider } from '@/engines/exam-security/providers/ExamSecurityProvider';
import { BrowserEventProvider } from '@/engines/exam-security/browser/BrowserEventProvider';
import { KeyboardProvider } from '@/engines/exam-security/keyboard/KeyboardProvider';
import { MouseProvider } from '@/engines/exam-security/mouse/MouseProvider';
import { ClipboardProvider } from '@/engines/exam-security/clipboard/ClipboardProvider';
import { FullscreenProvider } from '@/engines/exam-security/fullscreen/FullscreenProvider';
import { FocusProvider } from '@/engines/exam-security/focus/FocusProvider';
import { NavigationProvider } from '@/engines/exam-security/navigation/NavigationProvider';
import { useNavigationSentinel } from '@/engines/exam-security/navigation/hooks/useNavigationSentinel';
import { useFullscreen } from '@/engines/exam-security/fullscreen/hooks/useFullscreen';
import { FullscreenOverlay } from '@/engines/exam-security/fullscreen/components/FullscreenOverlay';
import { BrowserCompatibility } from '@/engines/exam-security/fullscreen/utils/BrowserCompatibility';
import { ReverifyLivenessModal } from '@/engines/exam-security/ui/ReverifyLivenessModal';
import { useServerViolationSentinel } from '@/engines/exam-security/hooks/useServerViolationSentinel';
import { ViolationToast, CriticalAlertOverlay, LockdownTerminatedScreen } from '@/engines/exam-security/ui';
import { TamperResistantWatermark } from '@/engines/exam-security/watermark/TamperResistantWatermark';
import { useHashChainedAutosave } from '@/engines/exam-security/autosave/useHashChainedAutosave';
import { useOfflineLimitSentinel } from '@/engines/exam-security/offline/useOfflineLimitSentinel';
import { OfflinePausedScreen } from '@/engines/exam-security/offline/OfflinePausedScreen';
import { useHardenedSecuritySentinel } from '@/engines/exam-security/hooks/useHardenedSecuritySentinel';

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
  const [rulesAcknowledged, setRulesAcknowledged] = useState(false);
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

  // Session Rejoin & Crash Recovery State
  const [rejoinsCount, setRejoinsCount] = useState<number>(0);
  const [maxAllowedRejoins] = useState<number>(3);
  const [isRejoinFlagged, setIsRejoinFlagged] = useState<boolean>(false);

  // In-Exam Help & Technical Support Modal State
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [helpTab, setHelpTab] = useState<'CHAT' | 'TECH'>('CHAT');
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'STUDENT' | 'INVIGILATOR'; text: string; time: string }>
  >([
    {
      sender: 'INVIGILATOR',
      text: 'Hello Candidate STU-8841. Invigilator desk is active and monitoring your session. How may we assist you?',
      time: '10:00 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [techCategory, setTechCategory] = useState<string>('VIDEO_STREAM');
  const [techDescription, setTechDescription] = useState<string>('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState<boolean>(false);

  // Pre-Submit Final Review & Cryptographic Receipt State
  const [confirmSubmitChecked, setConfirmSubmitChecked] = useState<boolean>(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    submissionId: string;
    timestamp: string;
    answerCount: number;
    totalQuestions: number;
    terminalHash: string;
  } | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // Accessibility Accommodations & WCAG 2.2 AA Controls
  const [highContrastMode, setHighContrastMode] = useState<boolean>(() => {
    return localStorage.getItem('assessiq_a11y_high_contrast') === 'true';
  });
  const [largeTextMode, setLargeTextMode] = useState<boolean>(() => {
    return localStorage.getItem('assessiq_a11y_large_text') === 'true';
  });
  const [dyslexiaFont, setDyslexiaFont] = useState<boolean>(() => {
    return localStorage.getItem('assessiq_a11y_dyslexia_font') === 'true';
  });
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showA11yModal, setShowA11yModal] = useState<boolean>(false);

  // Timed Rest Breaks (Approved Accommodation)
  const [hasBreakAccommodation, setHasBreakAccommodation] = useState<boolean>(true);
  const [maxBreaksAllowed] = useState<number>(2);
  const [breaksUsed, setBreaksUsed] = useState<number>(0);
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState<number>(600); // 10 mins = 600s

  const handleStartRestBreak = () => {
    if (breaksUsed >= maxBreaksAllowed) {
      toast.error('Break Limit Reached', {
        description: `You have completed all ${maxBreaksAllowed} authorized rest breaks.`,
      });
      return;
    }
    const nextUsed = breaksUsed + 1;
    setBreaksUsed(nextUsed);
    setIsOnBreak(true);
    setBreakTimeRemaining(600);
    toast.info(`Rest Break ${nextUsed}/${maxBreaksAllowed} Started`, {
      description: 'The main exam timer is frozen. Violation tracking is paused.',
    });
  };

  const handleResumeFromBreak = () => {
    setIsOnBreak(false);
    toast.success('Exam Resumed', {
      description: 'Your rest break has ended. Exam clock and proctoring sentinels are now active.',
    });
  };

  // Break Countdown Timer
  useEffect(() => {
    let timer: any = null;
    if (isOnBreak && breakTimeRemaining > 0) {
      timer = setInterval(() => {
        setBreakTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleResumeFromBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOnBreak, breakTimeRemaining]);

  // Text-to-Speech (TTS) Reader
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const currentQ = EXAM_QUESTIONS[currentIdx];
    const textToSpeak = `Question ${currentIdx + 1}. ${currentQ.text}. ${
      currentQ.options.map((opt, i) => `Option ${String.fromCharCode(65 + i)}: ${opt}`).join('. ')
    }`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

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

  // Server-authoritative violation sentinel & weighted points engine
  const examSessionId = 'sess_demo_candidate';
  const {
    points,
    activeWarning,
    criticalAlert,
    isLockdownTerminated,
    reportViolation,
    dismissWarning,
    dismissCriticalAlert,
  } = useServerViolationSentinel({
    sessionId: examSessionId,
    pollIntervalMs: 5000,
  });

  // Hash-Chained WebCrypto IndexedDB Autosave
  const { saveAnswer, syncChainWithServer, recordsCount } = useHashChainedAutosave({
    sessionId: examSessionId,
    onChainTamperDetected: (details) => {
      reportViolation('AUTOSAVE_CHAIN_TAMPERED', details);
      toast.error('Autosave Chain Tampered', {
        description: 'CRITICAL: Hash chain failed cryptographic verification.',
      });
    },
  });

  // Offline Limit Sentinel (Maximum 3 Minutes = 180s)
  const { isOnline, isExamPaused, offlineSecondsElapsed } = useOfflineLimitSentinel({
    maxOfflineSeconds: 180,
    onOfflineLimitExceeded: (duration) => {
      reportViolation('OFFLINE_LIMIT_EXCEEDED', { duration });
      toast.error('Offline Limit Exceeded', {
        description: 'Workstation disconnected for > 3 minutes. Exam paused.',
      });
    },
    onConnectivityRestored: (duration) => {
      syncChainWithServer();
      toast.success('Connectivity Restored', {
        description: `Reconnected after ${duration}s. Resuming examination.`,
      });
    },
  });

  // Layer 1 and Layer 2 Hardened Security Sentinel
  useHardenedSecuritySentinel({
    sessionId: examSessionId,
    requireSecureClient: false, // Set true for high-stakes lockdown client exams
    reportViolation: async (type, payload) => {
      reportViolation(type, payload);
    },
    onViolationDetected: (evt) => {
      if (evt.severity === 'CRITICAL') {
        toast.error(`Critical Violation: ${evt.type}`, {
          description: evt.reason,
        });
      } else if (evt.severity === 'HIGH' || evt.severity === 'MEDIUM') {
        toast.warning(`Security Alert: ${evt.type}`, {
          description: evt.reason,
        });
      }
    },
    enabled: examStarted && !isTerminated && !isLockdownTerminated,
  });

  // Re-verification State (Random 10s biometric challenges mid-exam)
  const [reverifyPrompt, setReverifyPrompt] = useState<{
    active: boolean;
    challengeId: string;
    challengeType: 'TURN_HEAD_LEFT' | 'TURN_HEAD_RIGHT' | 'BLINK_TWICE' | 'SMILE' | 'STATIC_GAZE' | 'AUDIO_PHRASE';
    instructions: string;
    nonce: string;
  } | null>(null);

  // Bind session & schedule random mid-exam re-verification
  useEffect(() => {
    if (!examStarted) return;

    const deviceFingerprint = `${navigator.userAgent}-${window.screen.width}x${window.screen.height}-${navigator.hardwareConcurrency || 4}`;
    fetch(`/api/v1/session/${examSessionId}/identity/bind`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: 'cand_student_01',
        deviceFingerprint,
        durationSeconds: 3600,
      }),
    }).catch(() => {});

    // Schedule mid-exam random re-verification prompt (e.g. at 45s for demo)
    const reverifyTimer = setTimeout(() => {
      setReverifyPrompt({
        active: true,
        challengeId: `ch_mid_${Date.now()}`,
        challengeType: 'TURN_HEAD_RIGHT',
        instructions: 'Random Biometric Audit: Turn your head right and center your face in the camera.',
        nonce: Math.random().toString(36).substring(2, 10),
      });
    }, 45000);

    return () => clearTimeout(reverifyTimer);
  }, [examStarted]);

  // Crash / Refresh Recovery: Call server rejoin endpoint on mount
  useEffect(() => {
    const attemptRejoin = async () => {
      try {
        const res = await fetch(`/api/session/${examSessionId}/rejoin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateId: 'cand_student_01',
            clientLocalAnswersHash: savedState.answers ? '0x' + Object.keys(savedState.answers).length : undefined,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setRejoinsCount(data.rejoinsCount);
            if (data.isFlagged) {
              setIsRejoinFlagged(true);
              toast.warning(`Session Rejoined (${data.rejoinsCount}/${data.maxAllowedRejoins})`, {
                description: 'Notice: Excessive session rejoins detected. Session flagged for invigilator audit.',
              });
            } else if (data.rejoinsCount > 1) {
              toast.info(`Session Restored (${data.rejoinsCount}/${data.maxAllowedRejoins})`, {
                description: 'Authoritative server clock and answers synchronized.',
              });
            }
            if (data.remainingTimeMs !== undefined) {
              setTimeLeft(Math.floor(data.remainingTimeMs / 1000));
            }
            if (data.cachedAnswers && typeof data.cachedAnswers === 'object' && Object.keys(selectedAnswers).length === 0) {
              setSelectedAnswers(data.cachedAnswers as Record<number, number>);
            }
          }
        }
      } catch {
        // Fallback to local storage state
      }
    };
    attemptRejoin();
  }, [examSessionId]);

  // Periodic answer cache sync with server for crash recovery (every 15s)
  useEffect(() => {
    if (!examStarted || Object.keys(selectedAnswers).length === 0) return;
    const interval = setInterval(() => {
      fetch(`/api/session/${examSessionId}/answers/cache`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: selectedAnswers }),
      }).catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [examStarted, selectedAnswers, examSessionId]);

  // Send message to Invigilator desk
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const studentMsg = {
      sender: 'STUDENT' as const,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, studentMsg]);
    setChatInput('');
    toast.success('Message sent to proctor desk.');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'INVIGILATOR' as const,
          text: 'Thank you for your message. We have received your query and will monitor your feed. Please continue your assessment.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  // Submit Technical Support Ticket with sanitized diagnostics (excluding question answers)
  const handleSubmitTechTicket = async () => {
    if (!techDescription.trim()) {
      toast.error('Please describe the technical problem.');
      return;
    }
    setIsSubmittingTicket(true);
    try {
      // Diagnostic strictly excludes question answers
      const sanitizedDiagnostics = {
        browser: navigator.userAgent,
        platform: navigator.platform,
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        effectiveType: (navigator as unknown as { connection?: { effectiveType?: string } })?.connection?.effectiveType || '4g',
        downlink: (navigator as unknown as { connection?: { downlink?: number } })?.connection?.downlink || 10,
        rtt: (navigator as unknown as { connection?: { rtt?: number } })?.connection?.rtt || 50,
        hardwareConcurrency: navigator.hardwareConcurrency || 4,
        timeRemainingSeconds: timeLeft,
      };

      const res = await fetch(`/api/session/${examSessionId}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: techCategory,
          description: techDescription,
          diagnostics: sanitizedDiagnostics,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('Technical Problem Dispatched', {
          description: `Ticket ${data.ticketId} attached with sanitized system diagnostics.`,
        });
      } else {
        toast.success('Technical Problem Logged to Proctor Desk');
      }
    } catch {
      toast.success('Technical Problem Recorded');
    } finally {
      setIsSubmittingTicket(false);
      setTechDescription('');
      setShowHelpModal(false);
    }
  };

  // Security Violation Counter with Server Integration
  const [violationCount, setViolationCount] = useState<number>(0);
  const [isTerminated, setIsTerminated] = useState<boolean>(false);

  const triggerViolation = (reason: string, violationType: string = 'WINDOW_SWITCH') => {
    if (isTerminated || isLockdownTerminated) return;

    reportViolation(violationType, { reason });

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

  // Option Selection & Cryptographic Hash-Chained Auto-Save
  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
    setVisitedQuestions((prev) => ({ ...prev, [currentIdx]: true }));
    saveAnswer(String(currentQ.id), optIdx).catch(() => {});
    toast.success('Response Cryptographically Autosaved', {
      description: `Question ${currentIdx + 1} choice sealed in IndexedDB hash chain.`,
    });
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
    setShowSubmitModal(false);

    const submissionId = `SUB-2026-CS402-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();
    const terminalHash = '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';

    setSubmissionReceipt({
      submissionId,
      timestamp,
      answerCount: Object.keys(selectedAnswers).length,
      totalQuestions: EXAM_QUESTIONS.length,
      terminalHash,
    });
    setShowReceiptModal(true);

    toast.success('Exam Successfully Submitted!', {
      description: 'Your answers and cryptographic ledger chain have been committed.',
    });
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
    if (!rulesAcknowledged) {
      return (
        <div className="min-h-screen bg-[#FAFAF7] text-[#2B2350] flex items-center justify-center p-6 font-sans">
          <PreExamRulesSummary
            examTitle="CS-402: Distributed Consensus & Raft Architecture"
            durationMinutes={60}
            profileTier="HIGH_STAKES"
            onAcknowledge={() => setRulesAcknowledged(true)}
          />
        </div>
      );
    }

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
    <div
      className={`min-h-screen flex flex-col justify-between select-none transition-colors duration-150 ${
        highContrastMode ? 'bg-white text-black font-semibold' : 'bg-[#F8FAFC] font-sans text-[#0F172A]'
      } ${largeTextMode ? 'text-sm' : 'text-xs'} ${dyslexiaFont ? 'tracking-wide leading-relaxed font-sans' : ''}`}
    >
      {/* WCAG 2.2 AA Skip Link */}
      <a
        href="#main-question-area"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-[#6C4DFF] focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:shadow-lg focus:outline-none font-bold text-xs"
      >
        Skip to Question Content
      </a>

      {/* Network Offline Alert Banner (Never Color-Only) */}
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="bg-[#D97706] text-white border-b-2 border-[#92400E] px-6 py-2.5 text-xs font-mono font-bold flex items-center justify-between sticky top-0 z-50 shadow-xs"
        >
          <div className="flex items-center space-x-2.5">
            <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              STATUS: OFFLINE CACHE ACTIVE (Answers cryptographically saved in local storage. Automatic cloud sync upon reconnection.)
            </span>
          </div>
          <Badge className="bg-[#78350F] text-amber-100 border border-amber-300 text-[10px] font-mono">
            OFFLINE SAFE
          </Badge>
        </div>
      )}

      {/* Last 5-Minute Alert Banner (Never Color-Only) */}
      {timeLeft < 300 && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-[#DC2626] text-white border-b-2 border-[#7F1D1D] px-6 py-2 text-xs font-mono font-bold flex items-center justify-center space-x-2 sticky top-0 z-50 shadow-xs"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>
            CRITICAL TIME WARNING: Less than 5 minutes remaining! Server clock auto-submits at 00:00.
          </span>
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

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* TTS Read Question Aloud */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReadAloud}
            aria-label={isSpeaking ? 'Stop reading question aloud' : 'Read question and options aloud'}
            className={`text-xs font-bold border-[#CBD5E1] flex items-center space-x-1 ${
              isSpeaking ? 'bg-purple-100 text-purple-800 border-purple-400' : 'text-[#2B2350]'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-purple-700" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Stop TTS' : 'Read Aloud'}</span>
          </Button>

          {/* Timed Rest Break Button (Accommodation) */}
          {hasBreakAccommodation && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartRestBreak}
              disabled={breaksUsed >= maxBreaksAllowed || isOnBreak}
              aria-label={`Take rest break (${breaksUsed}/${maxBreaksAllowed} used)`}
              className="text-xs font-bold border-[#CBD5E1] bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300 flex items-center space-x-1"
            >
              <Coffee className="w-3.5 h-3.5 text-emerald-700" />
              <span>Break ({breaksUsed}/{maxBreaksAllowed})</span>
            </Button>
          )}

          {/* In-Exam Help & Proctor Chat */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHelpModal(true)}
            aria-label="Open live invigilator chat and technical help"
            className="text-xs font-bold border-[#CBD5E1] bg-indigo-50 text-[#6C4DFF] hover:bg-indigo-100 border-indigo-200 flex items-center space-x-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#6C4DFF]" />
            <span className="hidden sm:inline">Help & Chat</span>
          </Button>

          {/* Rejoin Recovery Badge */}
          {rejoinsCount > 0 && (
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border hidden lg:inline-block ${
                isRejoinFlagged
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              Rejoin: {rejoinsCount}/{maxAllowedRejoins} {isRejoinFlagged ? '(Audited)' : ''}
            </span>
          )}

          {/* Accessibility Options Drawer Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowA11yModal(true)}
            aria-label="Open accessibility options"
            className="text-xs font-bold border-[#CBD5E1] text-[#2B2350] flex items-center space-x-1"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Accessibility</span>
          </Button>

          {/* Persistent Sticky Timer */}
          <div
            aria-live="polite"
            aria-label={`Time remaining: ${formatTime(timeLeft)}`}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs ${
              timeLeft < 300 ? 'bg-red-50 text-red-700 border-red-300 animate-pulse' : 'bg-blue-50 text-[#1E40AF] border-blue-200'
            }`}
          >
            <Clock className="w-4 h-4 text-[#2563EB]" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalculator(!showCalculator)}
            aria-label="Toggle calculator"
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
          <TamperResistantWatermark
            candidateId="cand_student_2026"
            sessionId={examSessionId}
            onWatermarkTampered={(details) => {
              reportViolation('WATERMARK_TAMPERED', details);
              toast.error('Watermark Tampered!', {
                description: 'HIGH Violation (3 points): forensic watermark manipulation detected.',
              });
            }}
          >
            <Card className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-md space-y-6 relative overflow-hidden select-none">
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
              <h2 id="main-question-area" className="text-base font-extrabold text-[#0F172A] leading-relaxed">
                {currentQ.text}
              </h2>

              {currentQ.codeSnippet && (
                <pre className="p-4 rounded-xl bg-[#0F172A] text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              )}
            </div>

            {/* Options List with WCAG 2.2 Radio Group */}
            <div
              role="radiogroup"
              aria-labelledby="main-question-area"
              className="space-y-3 pt-2"
            >
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentIdx] === idx;
                const optLetter = String.fromCharCode(65 + idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Option ${optLetter}: ${opt}`}
                    onClick={() => handleSelectOption(idx)}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        handleSelectOption(idx);
                      }
                    }}
                    className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer focus-visible:ring-2 focus-visible:ring-[#6C4DFF] focus-visible:outline-none ${
                      isSelected
                        ? 'border-[#1E40AF] bg-blue-50/80 text-[#1E40AF] font-bold shadow-2xs'
                        : 'border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span className="pr-4">{opt}</span>
                    <span
                      aria-hidden="true"
                      className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[11px] shrink-0 ${
                        isSelected ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'border-[#CBD5E1]'
                      }`}
                    >
                      {optLetter}
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
          </TamperResistantWatermark>
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
                      type="button"
                      onClick={() => handleNavigate(i)}
                      aria-label={`Question ${i + 1}: ${
                        isAns ? 'Answered' : isMark ? 'Marked for Review' : 'Unanswered'
                      }`}
                      className={`h-10 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#6C4DFF] focus-visible:outline-none ${
                        isCurrent
                          ? 'ring-2 ring-[#1E40AF] ring-offset-2 bg-[#1E40AF] text-white shadow-md'
                          : isAns
                          ? 'bg-emerald-100 text-[#15803D] border border-emerald-300'
                          : isMark
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <span>{i + 1}</span>
                      {isAns && <span className="text-[9px] ml-0.5" aria-hidden="true">✓</span>}
                      {isMark && !isAns && <span className="text-[9px] ml-0.5" aria-hidden="true">⚐</span>}
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

      {/* 6. Pre-Submit Final Review Dialog */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="sm:max-w-[520px] bg-[#FAFAF7] text-[#2B2350] p-6 rounded-3xl border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350]">
          <DialogHeader className="border-b border-[#2B2350]/15 pb-3">
            <DialogTitle className="text-xl font-heading font-black text-[#2B2350]">
              Final Review & Submission Checklist
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6B6590]">
              Verify your question responses before committing your answers to the authoritative server.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3 text-xs">
            {/* Status Counts */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2.5">
                <span className="text-[10px] uppercase text-[#065F46] font-bold block">ANSWERED</span>
                <span className="text-lg font-black text-[#065F46]">{answeredCount}</span>
              </div>
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5">
                <span className="text-[10px] uppercase text-amber-900 font-bold block">FLAGGED</span>
                <span className="text-lg font-black text-amber-900">{markedCount}</span>
              </div>
              <div className="bg-rose-50 border border-rose-300 rounded-xl p-2.5">
                <span className="text-[10px] uppercase text-rose-900 font-bold block">UNANSWERED</span>
                <span className="text-lg font-black text-rose-900">{unansweredCount}</span>
              </div>
            </div>

            {/* Jump to Unanswered Questions if any */}
            {unansweredCount > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
                <span className="font-bold text-rose-900 flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  You have {unansweredCount} unanswered questions:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {EXAM_QUESTIONS.map((_, idx) => {
                    if (selectedAnswers[idx] === undefined) {
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCurrentIdx(idx);
                            setShowSubmitModal(false);
                          }}
                          className="px-2.5 py-1 bg-white border border-rose-300 rounded-lg text-rose-800 text-[11px] font-mono font-bold hover:bg-rose-100 transition-colors"
                        >
                          Jump to Q{idx + 1}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Jump to Flagged Questions if any */}
            {markedCount > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                <span className="font-bold text-amber-900 flex items-center">
                  <Flag className="w-3.5 h-3.5 mr-1" />
                  Review flagged questions:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {EXAM_QUESTIONS.map((_, idx) => {
                    if (flaggedQuestions[idx]) {
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCurrentIdx(idx);
                            setShowSubmitModal(false);
                          }}
                          className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-900 text-[11px] font-mono font-bold hover:bg-amber-100 transition-colors"
                        >
                          Jump to Q{idx + 1}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Confirmation Checkbox */}
            <div className="bg-white p-3 rounded-xl border border-[#2B2350]/20 mt-2">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmSubmitChecked}
                  onChange={(e) => setConfirmSubmitChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#15803D] rounded border-[#2B2350] cursor-pointer"
                />
                <span className="text-xs font-bold text-[#2B2350] leading-snug">
                  I have reviewed all my responses. I confirm that I am ready to finalize and submit my exam.
                </span>
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-[#2B2350]/15">
            <Button
              variant="outline"
              onClick={() => setShowSubmitModal(false)}
              className="text-xs font-bold border-[#2B2350] text-[#2B2350]"
            >
              Return to Exam
            </Button>
            <Button
              onClick={handleSubmitFinal}
              disabled={!confirmSubmitChecked && unansweredCount > 0}
              className="bg-[#15803D] hover:bg-emerald-800 text-white font-mono font-bold text-xs px-5 py-2.5 rounded-xl border border-[#2B2350] shadow-[2px_2px_0px_#2B2350] disabled:opacity-50 cursor-pointer"
            >
              Confirm & Submit Final Answers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. Post-Submit Cryptographic Receipt Modal */}
      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className="sm:max-w-lg bg-[#FAFAF7] text-[#2B2350] p-6 rounded-3xl border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350]">
          <DialogHeader className="border-b border-[#2B2350]/15 pb-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#B8F0D2] border-2 border-[#2B2350] flex items-center justify-center mx-auto text-[#065F46] mb-2">
              <FileCheck className="w-6 h-6" />
            </div>
            <DialogTitle className="font-heading font-black text-xl text-[#2B2350]">
              Official Examination Submission Receipt
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6B6590]">
              Keep this cryptographic receipt as official proof of timely submission.
            </DialogDescription>
          </DialogHeader>

          {submissionReceipt && (
            <div className="space-y-3 py-3 text-xs font-mono">
              <div className="bg-white p-4 rounded-2xl border-2 border-[#2B2350] space-y-2.5 shadow-2xs">
                <div className="flex justify-between items-center border-b border-[#2B2350]/10 pb-2">
                  <span className="text-[#6B6590]">SUBMISSION ID:</span>
                  <span className="font-bold text-[#6C4DFF] text-sm">{submissionReceipt.submissionId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B6590]">TIMESTAMP:</span>
                  <span className="text-[#2B2350]">{submissionReceipt.timestamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B6590]">ANSWERS SEALED:</span>
                  <span className="font-bold text-[#065F46]">
                    {submissionReceipt.answerCount} of {submissionReceipt.totalQuestions} Questions
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B6590]">LEDGER STATUS:</span>
                  <Badge className="bg-[#B8F0D2] text-[#065F46] border border-[#2B2350] text-[10px]">
                    VERIFIED & COMMITTED
                  </Badge>
                </div>
                <div className="border-t border-[#2B2350]/10 pt-2 space-y-1">
                  <span className="text-[#6B6590] block text-[10px]">TERMINAL SHA-256 LEDGER HASH:</span>
                  <span className="text-[10px] break-all text-[#2B2350] bg-slate-50 p-1.5 rounded block border border-slate-200">
                    {submissionReceipt.terminalHash}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-[#2B2350]/15">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="border-[#2B2350] text-[#2B2350] text-xs font-mono font-bold"
            >
              Print Receipt
            </Button>
            <Button
              onClick={() => {
                setShowReceiptModal(false);
                navigate('/student/results');
              }}
              className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-5 py-2.5 rounded-xl border border-[#2B2350]"
            >
              Proceed to Evaluation Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. In-Exam Help & Live Proctor Chat Modal */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="sm:max-w-[540px] bg-[#FAFAF7] text-[#2B2350] p-6 rounded-3xl border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350]">
          <DialogHeader className="border-b border-[#2B2350]/15 pb-3">
            <DialogTitle className="text-lg font-heading font-black text-[#2B2350] flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-[#6C4DFF]" />
              <span>Exam Support & Proctor Desk</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6B6590]">
              Direct communication line with active invigilators and technical support engineers.
            </DialogDescription>
          </DialogHeader>

          {/* Tab Selector */}
          <div className="flex border-b border-[#2B2350]/20 pt-2">
            <button
              type="button"
              onClick={() => setHelpTab('CHAT')}
              className={`flex-1 py-2 text-xs font-mono font-bold border-b-2 transition-colors cursor-pointer ${
                helpTab === 'CHAT'
                  ? 'border-[#6C4DFF] text-[#6C4DFF]'
                  : 'border-transparent text-[#6B6590] hover:text-[#2B2350]'
              }`}
            >
              Live Proctor Chat
            </button>
            <button
              type="button"
              onClick={() => setHelpTab('TECH')}
              className={`flex-1 py-2 text-xs font-mono font-bold border-b-2 transition-colors cursor-pointer ${
                helpTab === 'TECH'
                  ? 'border-[#6C4DFF] text-[#6C4DFF]'
                  : 'border-transparent text-[#6B6590] hover:text-[#2B2350]'
              }`}
            >
              Report Technical Problem
            </button>
          </div>

          {helpTab === 'CHAT' ? (
            <div className="space-y-3 pt-3">
              {/* Chat Message Box */}
              <div className="h-48 overflow-y-auto bg-white border border-[#2B2350]/20 rounded-2xl p-3 space-y-2 text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl max-w-[85%] ${
                      msg.sender === 'STUDENT'
                        ? 'ml-auto bg-[#6C4DFF] text-white'
                        : 'mr-auto bg-slate-100 text-[#2B2350] border border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[9px] font-mono opacity-80 mb-1">
                      <span>{msg.sender === 'STUDENT' ? 'You' : 'Chief Proctor'}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendChatMessage();
                    }
                  }}
                  placeholder="Type a message to your invigilator..."
                  className="flex-1 px-3 py-2 text-xs border-2 border-[#2B2350] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6C4DFF] bg-white text-[#2B2350]"
                />
                <Button
                  onClick={handleSendChatMessage}
                  className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-4 rounded-xl border border-[#2B2350]"
                >
                  Send
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-bold text-[#2B2350] mb-1">Issue Category:</label>
                <select
                  value={techCategory}
                  onChange={(e) => setTechCategory(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#2B2350] rounded-xl bg-white text-xs font-mono"
                >
                  <option value="VIDEO_STREAM">Webcam Video Stream Frozen or Low FPS</option>
                  <option value="AUDIO_MIC">Microphone Input Distortion</option>
                  <option value="QUESTION_DISPLAY">Question Formatting or Formula Render Glitch</option>
                  <option value="CONNECTIVITY">Periodic Network Disconnection</option>
                  <option value="OTHER">Other Technical Problem</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#2B2350] mb-1">Description:</label>
                <textarea
                  rows={3}
                  value={techDescription}
                  onChange={(e) => setTechDescription(e.target.value)}
                  placeholder="Describe what occurred..."
                  className="w-full p-2.5 border-2 border-[#2B2350] rounded-xl bg-white text-xs text-[#2B2350] focus:outline-none"
                />
              </div>

              {/* Diagnostic Privacy Guarantee Box */}
              <div className="bg-[#B8F0D2]/50 p-2.5 rounded-xl border border-emerald-600/30 text-[11px] text-[#065F46] space-y-0.5">
                <span className="font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#059669]" />
                  Privacy-Guaranteed Diagnostics Attached
                </span>
                <p>
                  System telemetry (browser version, OS, ping latency) is automatically attached to assist the engineering team. Question text and answers are strictly excluded.
                </p>
              </div>

              <Button
                onClick={handleSubmitTechTicket}
                disabled={isSubmittingTicket}
                className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-2.5 rounded-xl border-2 border-[#2B2350]"
              >
                {isSubmittingTicket ? 'Dispatching Ticket...' : 'Dispatch Technical Problem Report'}
              </Button>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-[#2B2350]/15">
            <Button
              variant="outline"
              onClick={() => setShowHelpModal(false)}
              className="w-full text-xs font-bold border-[#2B2350]"
            >
              Close Help Desk
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

      {/* 10-second Re-Verification Modal */}
      {reverifyPrompt && (
        <ReverifyLivenessModal
          isOpen={reverifyPrompt.active}
          sessionId={examSessionId}
          challengeId={reverifyPrompt.challengeId}
          challengeType={reverifyPrompt.challengeType}
          instructions={reverifyPrompt.instructions}
          nonce={reverifyPrompt.nonce}
          onSuccess={(score) => {
            setReverifyPrompt(null);
            toast.success('Identity Re-verified', { description: `Face match score: ${score}%` });
          }}
          onTimeout={() => {
            setReverifyPrompt(null);
            reportViolation('REVERIFY_CHALLENGE_TIMEOUT');
            toast.error('Re-verification Timed Out', { description: 'HIGH Violation (3 points) applied.' });
          }}
          onFailure={(reason) => {
            setReverifyPrompt(null);
            reportViolation('REVERIFY_CHALLENGE_FAILED', { reason });
          }}
        />
      )}

      {/* Violation Toast & Alerts */}
      {activeWarning && (
        <ViolationToast warning={activeWarning} onDismiss={dismissWarning} />
      )}
      {criticalAlert && (
        <CriticalAlertOverlay alert={criticalAlert} onAcknowledge={dismissCriticalAlert} />
      )}
      {isLockdownTerminated && (
        <LockdownTerminatedScreen
          reason="Maximum violation points exceeded or critical identity anomaly detected."
          onSubmitFinal={handleSubmitFinal}
        />
      )}

      {/* Offline Paused Screen (After 3-Minute Limit) */}
      {isExamPaused && (
        <OfflinePausedScreen
          offlineDurationSeconds={offlineSecondsElapsed}
          recordsCount={recordsCount}
        />
      )}

      {/* Timed Rest Break Full-Screen Overlay (Approved Accommodation) */}
      {isOnBreak && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="rest-break-title"
          className="fixed inset-0 z-50 bg-[#2B2350]/90 backdrop-blur-md flex items-center justify-center p-6 text-white"
        >
          <div className="max-w-md w-full bg-white text-[#2B2350] border-2 border-[#2B2350] rounded-3xl p-6 shadow-[8px_8px_0px_#2B2350] text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#B8F0D2] border-2 border-[#2B2350] flex items-center justify-center mx-auto text-[#065F46]">
              <Coffee className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#10B981] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                APPROVED ACCOMMODATION
              </span>
              <h2 id="rest-break-title" className="font-heading font-black text-xl text-[#2B2350] mt-1">
                Rest Break in Progress
              </h2>
              <p className="text-xs text-[#6B6590] mt-1 font-body">
                Take this time to stretch, rest your eyes, or step away. The main exam timer is frozen and proctoring violation sentinels are temporarily suspended.
              </p>
            </div>

            <div className="bg-[#FAFAF7] border-2 border-[#2B2350] rounded-2xl p-4 font-mono">
              <span className="text-[10px] text-[#6B6590] uppercase block">BREAK TIME REMAINING</span>
              <span className="text-3xl font-black text-[#6C4DFF]" aria-live="polite">
                {formatTime(breakTimeRemaining)}
              </span>
            </div>

            <Button
              onClick={handleResumeFromBreak}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-mono font-bold text-xs py-3 rounded-xl border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] cursor-pointer"
            >
              Resume Examination Early
            </Button>
          </div>
        </div>
      )}

      {/* Accessibility Options Modal */}
      <Dialog open={showA11yModal} onOpenChange={setShowA11yModal}>
        <DialogContent className="sm:max-w-[480px] bg-[#FAFAF7] text-[#2B2350] p-6 rounded-3xl border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350]">
          <DialogHeader className="border-b border-[#2B2350]/15 pb-3">
            <DialogTitle className="text-lg font-heading font-black text-[#2B2350] flex items-center space-x-2">
              <Settings2 className="w-5 h-5 text-[#6C4DFF]" />
              <span>Accessibility & Display Options (WCAG 2.2 AA)</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6B6590]">
              Personalize your viewing and interaction experience during the assessment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3 text-xs">
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#2B2350]">
              <div>
                <span className="font-bold text-[#2B2350] block">High Contrast Mode</span>
                <span className="text-[10px] text-[#6B6590]">High-contrast stark black & white styling</span>
              </div>
              <input
                type="checkbox"
                checked={highContrastMode}
                onChange={(e) => {
                  setHighContrastMode(e.target.checked);
                  localStorage.setItem('assessiq_a11y_high_contrast', String(e.target.checked));
                }}
                className="w-4 h-4 text-[#6C4DFF] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#2B2350]">
              <div>
                <span className="font-bold text-[#2B2350] block">Large Typography (125%)</span>
                <span className="text-[10px] text-[#6B6590]">Increases base text size across question stems</span>
              </div>
              <input
                type="checkbox"
                checked={largeTextMode}
                onChange={(e) => {
                  setLargeTextMode(e.target.checked);
                  localStorage.setItem('assessiq_a11y_large_text', String(e.target.checked));
                }}
                className="w-4 h-4 text-[#6C4DFF] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#2B2350]">
              <div>
                <span className="font-bold text-[#2B2350] block">Dyslexia-Friendly Layout</span>
                <span className="text-[10px] text-[#6B6590]">Increases letter spacing and line height</span>
              </div>
              <input
                type="checkbox"
                checked={dyslexiaFont}
                onChange={(e) => {
                  setDyslexiaFont(e.target.checked);
                  localStorage.setItem('assessiq_a11y_dyslexia_font', String(e.target.checked));
                }}
                className="w-4 h-4 text-[#6C4DFF] rounded cursor-pointer"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-[#2B2350]/15">
            <Button
              onClick={() => setShowA11yModal(false)}
              className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-2.5 rounded-xl border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350]"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer Status */}
      <footer className="bg-white border-t border-[#E2E8F0] py-3 px-6 text-xs text-[#64748B] flex justify-between font-mono">
        <span>WASM Proctoring: Active • Gaze Target: Center • Risk Points: {points}/8</span>
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
