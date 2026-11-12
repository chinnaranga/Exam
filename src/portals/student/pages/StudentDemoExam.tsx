import React, { useState, useEffect, useRef } from 'react';
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
import BrandLogo from '@/shared/components/BrandLogo';
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
  Volume2,
  VolumeX,
  Coffee,
  Eye,
  Type,
  Settings2,
  Play,
  Smartphone,
  QrCode,
  Check,
  Award,
  BarChart3,
  Download,
  AlertOctagon,
  RefreshCw,
  FileText,
  Sliders,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

import { QuestionRenderer } from '@/engines/exam-questions/QuestionRenderer';
import { PreExamRulesSummary } from '@/engines/proctoring/consent/PreExamRulesSummary';
import { MobileSecondCameraWizard, SecondCameraConfigMode } from '@/engines/proctoring/camera/MobileSecondCameraWizard';
import { ViolationToast } from '@/engines/exam-security/ui/ViolationToast';
import { CriticalAlertOverlay } from '@/engines/exam-security/ui/CriticalAlertOverlay';
import { LockdownTerminatedScreen } from '@/engines/exam-security/ui/LockdownTerminatedScreen';
import { OfflinePausedScreen } from '@/engines/exam-security/offline/OfflinePausedScreen';
import { TamperResistantWatermark } from '@/engines/exam-security/watermark/TamperResistantWatermark';
import { getViolationExplainer } from '@/server/integrity/violationSeverityConfig';
import { LanguageSwitcher, useTranslation } from '@/shared/i18n/I18nContext';

// Types of security profiles
export type SecurityProfileTier = 'PRACTICE' | 'STANDARD' | 'HIGH_STAKES';

interface DemoQuestionItem {
  id: number;
  section: string;
  type: string;
  stem: string;
  points: number;
  codeSnippet?: string;
  options?: { id: string; text: string }[];
  correct?: number | string | any;
  matchingConfig?: any;
  orderingConfig?: any;
  fillInTheBlankConfig?: any;
  numericConfig?: any;
  unit?: string;
  mathEquationConfig?: any;
  imageHotspotConfig?: any;
  caseStudyConfig?: any;
  fileUploadConfig?: any;
  audioVideoConfig?: any;
}

const DEMO_EXAM_QUESTIONS: DemoQuestionItem[] = [
  {
    id: 1,
    section: 'Distributed Systems',
    type: 'MULTIPLE_CHOICE',
    stem: 'In the Raft Consensus Algorithm, what is the primary role of the Leader node during log replication?',
    points: 2,
    options: [
      { id: 'opt_0', text: 'To initiate election rounds randomly every 150ms.' },
      { id: 'opt_1', text: 'To accept client requests, append log entries, and propagate updates to Follower nodes.' },
      { id: 'opt_2', text: 'To validate SHA-256 signatures of client requests without appending logs.' },
      { id: 'opt_3', text: 'To delegate heartbeats exclusively to Candidate nodes.' },
    ],
    correct: 1,
  },
  {
    id: 2,
    section: 'Distributed Systems',
    type: 'MULTIPLE_CHOICE',
    stem: 'Which vector clock condition indicates that event A causally preceded event B (A → B)?',
    points: 2,
    codeSnippet: 'V(A)[i] <= V(B)[i] for all i, and V(A)[j] < V(B)[j] for at least one j.',
    options: [
      { id: 'opt_0', text: 'V(A)[i] == V(B)[i] across all process nodes.' },
      { id: 'opt_1', text: 'V(A)[i] <= V(B)[i] for all i, and V(A)[j] < V(B)[j] for at least one j.' },
      { id: 'opt_2', text: 'V(A)[0] > V(B)[0] strictly.' },
      { id: 'opt_3', text: 'None of the above; vector clocks require Lamport timestamps.' },
    ],
    correct: 1,
  },
  {
    id: 3,
    section: 'AI & Psychometrics',
    type: 'MULTIPLE_CHOICE',
    stem: 'Under the Item Response Theory (IRT) 3-Parameter Logistic (3PL) model, what does the parameter "c" represent?',
    points: 2,
    options: [
      { id: 'opt_0', text: 'Item discrimination index.' },
      { id: 'opt_1', text: 'Item difficulty threshold.' },
      { id: 'opt_2', text: 'Pseudo-guessing probability parameter (lower asymptote).' },
      { id: 'opt_3', text: 'Test duration scaling factor.' },
    ],
    correct: 2,
  },
  {
    id: 4,
    section: 'Machine Learning Infrastructure',
    type: 'MULTIPLE_CHOICE',
    stem: 'What is the primary architectural advantage of FlashAttention-2 over standard Multi-Head Attention?',
    points: 2,
    options: [
      { id: 'opt_0', text: 'Eliminates QKV projection matrices entirely.' },
      { id: 'opt_1', text: 'Tiling and IO-awareness to reduce GPU High Bandwidth Memory (HBM) reads/writes.' },
      { id: 'opt_2', text: 'Replaces softmax with GELU activation.' },
      { id: 'opt_3', text: 'Performs quantization without backward pass gradient computation.' },
    ],
    correct: 1,
  },
  {
    id: 5,
    section: 'Database Engine Architecture',
    type: 'MULTIPLE_CHOICE',
    stem: 'In Write-Ahead Logging (WAL) and ARIES database recovery, what occurs during the Redo phase?',
    points: 2,
    options: [
      { id: 'opt_0', text: 'Undoes uncommitted transactions starting from the crash point backward.' },
      { id: 'opt_1', text: 'Replays all logged changes from RedoLSN forward to restore exact state before crash.' },
      { id: 'opt_2', text: 'Wipes dirty pages from the memory buffer pool without disk write.' },
      { id: 'opt_3', text: 'Rehashes the page directory keys.' },
    ],
    correct: 1,
  },
  {
    id: 6,
    section: 'Networking & Protocols',
    type: 'MATCHING',
    stem: 'Match each standard network protocol with its canonical transport port.',
    points: 4,
    matchingConfig: {
      premises: [
        { id: 'p_http', text: 'HTTP (Hypertext Transfer Protocol)' },
        { id: 'p_https', text: 'HTTPS (HTTP Secure)' },
        { id: 'p_ssh', text: 'SSH (Secure Shell)' },
        { id: 'p_dns', text: 'DNS (Domain Name System)' },
      ],
      responses: [
        { id: 'r_80', text: 'TCP Port 80' },
        { id: 'r_443', text: 'TCP Port 443' },
        { id: 'r_22', text: 'TCP Port 22' },
        { id: 'r_53', text: 'UDP/TCP Port 53' },
      ],
    },
    correct: { p_http: 'r_80', p_https: 'r_443', p_ssh: 'r_22', p_dns: 'r_53' },
  },
  {
    id: 7,
    section: 'Operating Systems',
    type: 'ORDERING',
    stem: 'Arrange the Linux kernel bootstrap sequence in chronological execution order.',
    points: 4,
    orderingConfig: {
      items: [
        { id: 'step_uefi', text: '1. UEFI / BIOS Power-On Self Test (POST)' },
        { id: 'step_grub', text: '2. GRUB2 Bootloader Stage & Kernel Decompression' },
        { id: 'step_vmlinuz', text: '3. Kernel Initialization (setup_arch, page tables)' },
        { id: 'step_initramfs', text: '4. initramfs Root Filesystem Mount' },
        { id: 'step_systemd', text: '5. systemd / init (PID 1) Multi-User Target' },
      ],
    },
    correct: ['step_uefi', 'step_grub', 'step_vmlinuz', 'step_initramfs', 'step_systemd'],
  },
  {
    id: 8,
    section: 'Cryptography & PKI',
    type: 'FILL_IN_THE_BLANK',
    stem: 'Complete the statement regarding asymmetric key pairs in Public Key Infrastructure (PKI).',
    points: 3,
    fillInTheBlankConfig: {
      template: 'In RSA encryption, the {blank_pub} key is shared openly to encrypt messages, while the {blank_priv} key must remain guarded to decrypt ciphertext.',
      blankIds: ['blank_pub', 'blank_priv'],
    },
    correct: { blank_pub: 'public', blank_priv: 'private' },
  },
  {
    id: 9,
    section: 'Computer Networking',
    type: 'NUMERIC',
    stem: 'A 2.5 Megabyte (2.5 MB = 20,000,000 bits) payload is transmitted over a 100 Mbps WAN link. Calculate the serialization transmission delay in milliseconds (ms).',
    points: 3,
    numericConfig: {
      requiredUnit: 'ms',
    },
    unit: 'ms',
    correct: 200,
  },
  {
    id: 10,
    section: 'Relativistic Physics',
    type: 'MATH_EQUATION',
    stem: 'Enter Einstein’s canonical mass-energy equivalence equation in standard LaTeX notation.',
    points: 3,
    mathEquationConfig: {
      hasLatexInput: true,
    },
    correct: 'E = mc^2',
  },
  {
    id: 11,
    section: 'Hardware Architecture',
    type: 'IMAGE_HOTSPOT',
    stem: 'Click directly on the printed circuit board below to pinpoint the primary LGA CPU socket.',
    points: 3,
    imageHotspotConfig: {
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
      imageAltText: 'Modern workstation motherboard with CPU socket and VRM heatsinks',
    },
    correct: { x: 50, y: 50 },
  },
  {
    id: 12,
    section: 'Distributed Incident Analysis',
    type: 'CASE_STUDY',
    stem: 'Review the post-mortem incident report below and answer the linked questions.',
    points: 4,
    caseStudyConfig: {
      passageTitle: 'Incident #503: Asymmetric Partition in US-East Multi-AZ Raft Cluster',
      passageContent: `At 14:22 UTC, fiber degradation triggered an asymmetric network partition between Availability Zone A and Availability Zone B.\n\nThe Raft cluster comprised 5 consensus nodes (Node-1 through Node-5). Node-1 and Node-2 were isolated in Partition 1, while Node-3, Node-4, and Node-5 were in Partition 2.\n\nClients in Region A experienced timeout exceptions while attempting write transactions on Node-1, whereas clients routed to Partition 2 continued processing commits without data loss.`,
      subQuestions: [
        {
          id: 'sub_cs_1',
          stem: 'Did Partition 1 (Nodes 1 and 2) possess sufficient quorum to elect a new Leader?',
          points: 2,
          options: [
            { id: 'opt_no', text: 'No: Raft quorum requires a strict majority of (5/2) + 1 = 3 nodes.' },
            { id: 'opt_yes', text: 'Yes: Any connected pair can elect a provisional leader.' },
          ],
        },
        {
          id: 'sub_cs_2',
          stem: 'According to the Brewer CAP theorem, what property was maintained by Partition 2 during the partition?',
          points: 2,
          options: [
            { id: 'opt_cp', text: 'Consistency and Partition Tolerance (CP): rejecting non-linearizable writes.' },
            { id: 'opt_ap', text: 'Availability and Partition Tolerance (AP) without linearizability.' },
          ],
        },
      ],
    },
    correct: { sub_cs_1: 'opt_no', sub_cs_2: 'opt_cp' },
  },
  {
    id: 13,
    section: 'Capstone Architecture Defense',
    type: 'FILE_UPLOAD',
    stem: 'Upload your verified System Architecture Diagram & Threat Model in PDF or PNG format (Simulated Upload).',
    points: 4,
    fileUploadConfig: {
      allowedFileTypes: ['.pdf', '.png', '.jpg'],
      maxFileSizeMb: 10,
    },
    correct: 'uploaded_diagram.pdf',
  },
  {
    id: 14,
    section: 'Capstone Oral Defense',
    type: 'AUDIO_VIDEO_RESPONSE',
    stem: 'Record a brief oral explanation justifying why Raft was chosen over Multi-Paxos for the distributed consensus layer.',
    points: 4,
    audioVideoConfig: {
      mediaType: 'AUDIO',
      maxDurationSeconds: 120,
    },
    correct: 'audio_recording_sample.webm',
  },
];

export const StudentDemoExam: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useTranslation();

  // Mode & Profile Settings
  const [profileTier, setProfileTier] = useState<SecurityProfileTier>('STANDARD');
  const [setupStep, setSetupStep] = useState<'RULES_SETUP' | 'ACTIVE_EXAM' | 'COMPLETED'>('ACTIVE_EXAM');

  // Question & Navigation State
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'ANSWERED' | 'UNANSWERED' | 'MARKED'>('ALL');

  // Exam Clock State
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 60 minutes
  const [isClockRunning, setIsClockRunning] = useState<boolean>(true);

  // Anti-Cheat & Violation Points State
  const [integrityPoints, setIntegrityPoints] = useState<number>(0);
  const [integrityConfidence, setIntegrityConfidence] = useState<number>(100);
  const [activeToast, setActiveToast] = useState<{
    message: string;
    pointsAdded: number;
    ruleId: string;
  } | null>(null);

  const [criticalOverlay, setCriticalOverlay] = useState<{
    active: boolean;
    points: number;
    countdown: number;
    ruleId: string;
  } | null>(null);

  const [isLockedDown, setIsLockedDown] = useState<boolean>(false);
  const [lockdownReason, setLockdownReason] = useState<string>('');
  const [evidencePacket, setEvidencePacket] = useState<any>(null);

  // Fullscreen Exit Warning (Grace period countdown)
  const [fullscreenGraceCountdown, setFullscreenGraceCountdown] = useState<number | null>(null);

  // Second Camera Mobile State
  const [secondCameraMode, setSecondCameraMode] = useState<SecondCameraConfigMode>('REQUIRED');
  const [showSecondCameraModal, setShowSecondCameraModal] = useState<boolean>(false);
  const [isSecondCameraPaired, setIsSecondCameraPaired] = useState<boolean>(false);
  const [isSecondCameraDisconnected, setIsSecondCameraDisconnected] = useState<boolean>(false);
  const [secondCameraDropsCount, setSecondCameraDropsCount] = useState<number>(0);
  const [roomScanHash, setRoomScanHash] = useState<string | null>(null);

  // Accommodations & WCAG 2.2 AA
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [dyslexiaFont, setDyslexiaFont] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showA11yModal, setShowA11yModal] = useState<boolean>(false);

  // Timed Rest Breaks
  const [breaksAllowed] = useState<number>(2);
  const [breaksUsed, setBreaksUsed] = useState<number>(0);
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState<number>(300); // 5 mins

  // Autosave & Crash Recovery
  const [autosaveHashChain, setAutosaveHashChain] = useState<string[]>([
    '0x8f2a1b94e073c68a4d71593c2b8109ad5e4f3c2a1098b7654321fedcba098765',
  ]);
  const [rejoinCount, setRejoinCount] = useState<number>(1);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineSecondsElapsed, setOfflineSecondsElapsed] = useState<number>(0);
  const [showChainModal, setShowChainModal] = useState<boolean>(false);

  // Tools & Support Modals
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [calcInput, setCalcInput] = useState<string>('');
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [helpTab, setHelpTab] = useState<'CHAT' | 'TECH'>('CHAT');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'STUDENT' | 'INVIGILATOR'; text: string; time: string }>>([
    {
      sender: 'INVIGILATOR',
      text: 'AssessIQ Invigilation Desk online. System telemetry verified clean. Ask any procedural questions here.',
      time: '10:00 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Pre-Submission & Results State
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [confirmChecked, setConfirmChecked] = useState<boolean>(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<any>(null);
  const [examResults, setExamResults] = useState<any>(null);

  // Sandbox Toolbar Collapsed
  const [isSandboxCollapsed, setIsSandboxCollapsed] = useState<boolean>(false);
  const [sandboxTab, setSandboxTab] = useState<'VIOLATIONS' | 'MOBILE' | 'A11Y' | 'RECOVERY' | 'PROFILE'>('VIOLATIONS');

  // Main Exam Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (setupStep === 'ACTIVE_EXAM' && isClockRunning && !isOnBreak && !isLockedDown && !isOffline && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit('Exam time limit expired.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [setupStep, isClockRunning, isOnBreak, isLockedDown, isOffline, timeLeft]);

  // Timed Rest Break Countdown Effect
  useEffect(() => {
    let timer: any = null;
    if (isOnBreak && breakTimeRemaining > 0) {
      timer = setInterval(() => {
        setBreakTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsOnBreak(false);
            toast.success('Rest Break Ended. Exam resumed.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOnBreak, breakTimeRemaining]);

  // Offline Mode Simulator Effect
  useEffect(() => {
    let timer: any = null;
    if (isOffline) {
      timer = setInterval(() => {
        setOfflineSecondsElapsed((prev) => {
          if (prev >= 180) {
            clearInterval(timer);
            toast.error('Offline Limit (3 Minutes) Exceeded!', {
              description: 'Session locked by policy. Re-connection required.',
            });
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setOfflineSecondsElapsed(0);
    }
    return () => clearInterval(timer);
  }, [isOffline]);

  // Fullscreen Exit Grace Period Effect
  useEffect(() => {
    let timer: any = null;
    if (fullscreenGraceCountdown !== null && fullscreenGraceCountdown > 0) {
      timer = setInterval(() => {
        setFullscreenGraceCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            triggerViolation('FULLSCREEN_EXIT_EXTENDED', 3, 'Fullscreen Grace Period Expired (>10s)');
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [fullscreenGraceCountdown]);

  // Answer handler with hash chaining
  const handleSelectAnswer = (qId: number, value: any) => {
    setAnswers((prev) => {
      const next = { ...prev, [qId]: value };
      const nextHash = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
      setAutosaveHashChain((chain) => [...chain.slice(-4), nextHash]);
      return next;
    });
  };

  // Trigger simulated violation
  const triggerViolation = (ruleId: string, pointsToAdd: number, customMessage?: string) => {
    if (isLockedDown) return;

    const nextPoints = integrityPoints + pointsToAdd;
    setIntegrityPoints(nextPoints);

    // Update Integrity Confidence Score
    const calculatedConfidence = Math.max(0, 100 - nextPoints * 12);
    setIntegrityConfidence(calculatedConfidence);

    const explainer = getViolationExplainer(ruleId);
    const message = customMessage || `Simulated Violation: ${explainer.title} (+${pointsToAdd} pts)`;

    setActiveToast({
      message,
      pointsAdded: pointsToAdd,
      ruleId,
    });

    toast.warning(message, {
      description: `${explainer.whatHappened} - Total points: ${nextPoints}/8`,
      duration: 5000,
    });

    // Point Threshold Escalations
    if (nextPoints >= 8) {
      // 8 Points = Auto-Lockdown
      handleTriggerLockdown(
        `Critical Integrity Threshold Reached: ${nextPoints} points accumulated (${ruleId}).`
      );
    } else if (nextPoints >= 4 && !criticalOverlay?.active) {
      // 4 Points = Critical Warning Overlay
      setCriticalOverlay({
        active: true,
        points: nextPoints,
        countdown: 15,
        ruleId,
      });
    }
  };

  // Critical Lockdown Action
  const handleTriggerLockdown = (reason: string) => {
    setIsLockedDown(true);
    setLockdownReason(reason);
    setCriticalOverlay(null);

    const packet = {
      sessionId: 'sess_demo_evaluator_01',
      candidateId: 'CAND_DEMO_USER',
      examId: 'EXAM_DEMO_402',
      terminatedAt: Date.now(),
      terminationReason: reason,
      peakPoints: integrityPoints,
      finalPoints: integrityPoints,
      totalViolationsCount: 4,
      violationTimeline: [
        {
          id: 'v_1',
          ruleId: 'FOCUS_LOSS',
          name: 'Focus Loss / Alt-Tab',
          severity: 'LOW',
          pointsAdded: 1,
          totalPointsAfter: 1,
          timestamp: Date.now() - 40000,
          alertUser: true,
          invigilatorAlert: false,
        },
        {
          id: 'v_2',
          ruleId: 'SECOND_PERSON_DETECTED',
          name: 'Multiple Faces in Webcam Frame',
          severity: 'HIGH',
          pointsAdded: 3,
          totalPointsAfter: 4,
          timestamp: Date.now() - 25000,
          alertUser: true,
          invigilatorAlert: true,
        },
        {
          id: 'v_3',
          ruleId: 'PHONE_DETECTED',
          name: 'Mobile Phone in Frame',
          severity: 'HIGH',
          pointsAdded: 3,
          totalPointsAfter: 7,
          timestamp: Date.now() - 10000,
          alertUser: true,
          invigilatorAlert: true,
        },
        {
          id: 'v_4',
          ruleId: 'TAB_SWITCH',
          name: 'Proctoring Tab Switch',
          severity: 'MEDIUM',
          pointsAdded: 2,
          totalPointsAfter: 9,
          timestamp: Date.now(),
          alertUser: true,
          invigilatorAlert: true,
        },
      ],
      ledgerRootHash: '0x9e7b21f3a098d67c5412e8ba0231dfb87a6c9e01345d8f61204a91b2c3d4e5f6',
      invigilatorNotified: true,
      tamperProofVerified: true,
    };
    setEvidencePacket(packet);
    toast.error('Session Terminated by Proctor Sentinel', {
      description: 'Candidate locked down. Cryptographic evidence sealed.',
    });
  };

  // Reset Points (Sandbox helper for testers)
  const handleResetPoints = () => {
    setIntegrityPoints(0);
    setIntegrityConfidence(100);
    setIsLockedDown(false);
    setCriticalOverlay(null);
    setActiveToast(null);
    setFullscreenGraceCountdown(null);
    setIsSecondCameraDisconnected(false);
    toast.success('Integrity Points Reset to 0', {
      description: 'Session restored to clean baseline state. Ready for further testing.',
    });
  };

  // Mobile Second Camera Drop simulation
  const handleSimulateMobileDisconnect = () => {
    setIsSecondCameraDisconnected(true);
    const newDrops = secondCameraDropsCount + 1;
    setSecondCameraDropsCount(newDrops);

    if (newDrops >= 2) {
      triggerViolation('SECOND_CAMERA_PERSISTENT_DROP', 2, 'Repeated Secondary Camera Disconnect (+2 pts)');
    } else {
      toast.warning('Secondary Camera Disconnected (>30s)', {
        description: 'Exam is paused. Re-establishing WebRTC P2P stream...',
      });
    }
  };

  // Accommodations: Rest Break
  const handleStartBreak = () => {
    if (breaksUsed >= breaksAllowed) {
      toast.error(`All ${breaksAllowed} rest breaks have been utilized.`);
      return;
    }
    setBreaksUsed((prev) => prev + 1);
    setIsOnBreak(true);
    setBreakTimeRemaining(300);
    toast.info('Approved Rest Break Started', {
      description: 'Main exam timer is paused. Violation tracking is suspended.',
    });
  };

  // Accommodations: TTS Read Aloud
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-Speech not supported in this browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const q = DEMO_EXAM_QUESTIONS[currentIdx];
    const speechText = `Question ${currentIdx + 1}. Section: ${q.section}. ${q.stem}. ${
      q.options ? q.options.map((opt, i) => `Option ${i + 1}: ${opt.text}`).join('. ') : ''
    }`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Simulate Crash & Rejoin
  const handleSimulateCrashAndRejoin = () => {
    const nextRejoin = rejoinCount + 1;
    setRejoinCount(nextRejoin);
    toast.info(`Simulated Crash Recovery: Rejoin ${nextRejoin} of 3`, {
      description: 'Answers restored from hash-chained local ledger. Authoritative timer synced.',
    });
    if (nextRejoin > 3) {
      triggerViolation('EXCESSIVE_SESSION_REJOINS', 2, 'Excessive session rejoins flagged (>3 rejoins)');
    }
  };

  // Auto-Submit and Evaluation
  const handleAutoSubmit = (reason = 'Candidate Final Submission') => {
    setShowSubmitModal(false);

    // Evaluate answers
    let earnedPoints = 0;
    let totalPoints = 0;
    const evaluatedItems: any[] = [];

    DEMO_EXAM_QUESTIONS.forEach((q) => {
      totalPoints += q.points;
      const candAnswer = answers[q.id];
      let isCorrect = false;

      if (q.type === 'MULTIPLE_CHOICE') {
        isCorrect = candAnswer === q.correct;
      } else if (q.type === 'MATCHING') {
        if (candAnswer && typeof candAnswer === 'object') {
          const keys = Object.keys(q.correct);
          const matchCount = keys.filter((k) => candAnswer[k] === q.correct[k]).length;
          isCorrect = matchCount === keys.length;
        }
      } else if (q.type === 'ORDERING') {
        if (Array.isArray(candAnswer)) {
          isCorrect = JSON.stringify(candAnswer) === JSON.stringify(q.correct);
        }
      } else if (q.type === 'FILL_IN_THE_BLANK') {
        if (candAnswer && typeof candAnswer === 'object') {
          const val1 = String(candAnswer['blank_pub'] || '').trim().toLowerCase();
          const val2 = String(candAnswer['blank_priv'] || '').trim().toLowerCase();
          isCorrect = val1.includes('public') && val2.includes('private');
        }
      } else if (q.type === 'NUMERIC') {
        const num = parseFloat(candAnswer);
        isCorrect = Math.abs(num - q.correct) <= 1;
      } else if (q.type === 'MATH_EQUATION') {
        const str = String(candAnswer || '').replace(/\s+/g, '');
        isCorrect = str.includes('E=mc^2') || str.includes('E=mc^{2}');
      } else if (q.type === 'IMAGE_HOTSPOT') {
        isCorrect = Boolean(candAnswer);
      } else if (q.type === 'CASE_STUDY') {
        isCorrect = candAnswer?.sub_cs_1 === 'opt_no' && candAnswer?.sub_cs_2 === 'opt_cp';
      } else {
        // Subjective or uploaded files get full demo completion credit
        isCorrect = Boolean(candAnswer);
      }

      const pointsScored = isCorrect ? q.points : 0;
      earnedPoints += pointsScored;

      evaluatedItems.push({
        id: q.id,
        section: q.section,
        type: q.type,
        stem: q.stem,
        points: q.points,
        earned: pointsScored,
        isCorrect,
        userAnswer: candAnswer,
      });
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const receipt = {
      submissionId: `sub_assessiq_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      answersCount: Object.keys(answers).length,
      totalQuestions: DEMO_EXAM_QUESTIONS.length,
      earnedPoints,
      totalPoints,
      percentage,
      integrityConfidence,
      integrityPoints,
      terminalHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
    };

    setSubmissionReceipt(receipt);
    setExamResults({
      evaluatedItems,
      earnedPoints,
      totalPoints,
      percentage,
      thetaScore: ((percentage - 50) / 15).toFixed(2), // Mock IRT latent ability θ
      percentileRank: Math.min(99, Math.max(1, Math.round(percentage * 0.95 + 4))),
    });

    setSetupStep('COMPLETED');
    toast.success('Exam Submitted Successfully!', {
      description: `Final Score: ${earnedPoints}/${totalPoints} (${percentage}%). Cryptographic receipt generated.`,
    });
  };

  // Time formatter (MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const currentQ = DEMO_EXAM_QUESTIONS[currentIdx];
  const isAnswered = answers[currentQ.id] !== undefined;
  const isFlagged = Boolean(flagged[currentQ.id]);

  // Questions filtered list
  const filteredIndices = DEMO_EXAM_QUESTIONS.map((_, i) => i).filter((idx) => {
    const q = DEMO_EXAM_QUESTIONS[idx];
    if (filterCategory === 'ANSWERED') return answers[q.id] !== undefined;
    if (filterCategory === 'UNANSWERED') return answers[q.id] === undefined;
    if (filterCategory === 'MARKED') return Boolean(flagged[q.id]);
    return true;
  });

  return (
    <div
      className={`min-h-screen ${
        highContrast ? 'bg-black text-white' : 'bg-[#FAFAF7] text-[#2B2350]'
      } ${largeText ? 'text-lg' : 'text-sm'} ${dyslexiaFont ? 'font-sans tracking-wide leading-relaxed' : 'font-body'}`}
    >
      {/* 1. TOP FIXED FEATURE TESTING & SANDBOX CONTROLLER */}
      <div className="sticky top-0 z-40 bg-[#2B2350] text-white border-b-2 border-[#1E1838] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 bg-[#6C4DFF] px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#FFF3A3]" />
                <span>ASSESSIQ FEATURE TESTER</span>
              </div>
              <span className="text-xs text-white/80 hidden sm:inline font-mono">
                Interactive Testing Sandbox • Click any button to test features live
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={`font-mono text-[10px] px-2 py-0.5 border ${
                  integrityPoints === 0
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40'
                    : integrityPoints < 4
                    ? 'border-yellow-400 text-yellow-300 bg-yellow-950/40'
                    : 'border-red-400 text-red-300 bg-red-950/40 animate-pulse'
                }`}
              >
                RISK POINTS: {integrityPoints}/8 • CONFIDENCE: {integrityConfidence}%
              </Badge>

              <Button
                size="sm"
                onClick={handleResetPoints}
                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold px-2 rounded-md"
                title="Reset points to 0 to test again"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset Points
              </Button>

              <button
                onClick={() => setIsSandboxCollapsed(!isSandboxCollapsed)}
                className="text-white/80 hover:text-white p-1 rounded transition-colors"
                title="Toggle Sandbox Controls"
              >
                {isSandboxCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Collapsible Sandbox Tabs & Action Buttons */}
          {!isSandboxCollapsed && (
            <div className="mt-2 pt-2 border-t border-white/10 space-y-2 animate-in fade-in-50 duration-200">
              <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSandboxTab('VIOLATIONS')}
                  className={`px-3 py-1 rounded-md font-mono font-bold transition-all ${
                    sandboxTab === 'VIOLATIONS' ? 'bg-[#6C4DFF] text-white shadow-xs' : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  ⚡ Anti-Cheat Violations
                </button>
                <button
                  onClick={() => setSandboxTab('MOBILE')}
                  className={`px-3 py-1 rounded-md font-mono font-bold transition-all ${
                    sandboxTab === 'MOBILE' ? 'bg-[#6C4DFF] text-white shadow-xs' : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  📱 Mobile 2nd Camera
                </button>
                <button
                  onClick={() => setSandboxTab('A11Y')}
                  className={`px-3 py-1 rounded-md font-mono font-bold transition-all ${
                    sandboxTab === 'A11Y' ? 'bg-[#6C4DFF] text-white shadow-xs' : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  ♿ Accommodations (WCAG)
                </button>
                <button
                  onClick={() => setSandboxTab('RECOVERY')}
                  className={`px-3 py-1 rounded-md font-mono font-bold transition-all ${
                    sandboxTab === 'RECOVERY' ? 'bg-[#6C4DFF] text-white shadow-xs' : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  💾 Autosave & Rejoin
                </button>
                <button
                  onClick={() => setSandboxTab('PROFILE')}
                  className={`px-3 py-1 rounded-md font-mono font-bold transition-all ${
                    sandboxTab === 'PROFILE' ? 'bg-[#6C4DFF] text-white shadow-xs' : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  🎯 Profile: {profileTier}
                </button>
              </div>

              {/* Tab: Violations */}
              {sandboxTab === 'VIOLATIONS' && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => triggerViolation('FOCUS_LOSS', 1, 'Simulated Focus Loss (+1 pt)')}
                    className="h-7 text-[11px] bg-white/10 hover:bg-white/20 text-white font-mono"
                  >
                    Focus Loss (+1 pt)
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => triggerViolation('TAB_SWITCH', 2, 'Simulated Tab Switch (+2 pts)')}
                    className="h-7 text-[11px] bg-white/10 hover:bg-white/20 text-white font-mono"
                  >
                    Tab Switch (+2 pts)
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => triggerViolation('PHONE_DETECTED', 3, 'Simulated Phone Recognized (+3 pts)')}
                    className="h-7 text-[11px] bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-mono border border-yellow-500/30"
                  >
                    Phone Detected (+3 pts)
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => triggerViolation('SECOND_PERSON_DETECTED', 3, 'Simulated Second Person in Frame (+3 pts)')}
                    className="h-7 text-[11px] bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-mono border border-yellow-500/30"
                  >
                    Second Person (+3 pts)
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setFullscreenGraceCountdown(10);
                      toast.info('Simulated Fullscreen Exit: 10s Grace Countdown Started', {
                        description: 'Return to fullscreen before timer elapses to prevent 3-point penalty.',
                      });
                    }}
                    className="h-7 text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono border border-amber-500/30"
                  >
                    Fullscreen Exit (10s Grace)
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setCriticalOverlay({
                        active: true,
                        points: 4,
                        countdown: 15,
                        ruleId: 'STAGE_2_WARNING_THRESHOLD',
                      });
                    }}
                    className="h-7 text-[11px] bg-orange-600/30 hover:bg-orange-600/50 text-orange-200 font-mono border border-orange-500/40"
                  >
                    Trigger 4-Pt Warning Overlay
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleTriggerLockdown('Simulated Automated 8-Point Auto-Lockdown')}
                    className="h-7 text-[11px] bg-red-600/40 hover:bg-red-600/60 text-red-200 font-mono border border-red-500/40"
                  >
                    Trigger 8-Pt Lockdown
                  </Button>
                </div>
              )}

              {/* Tab: Mobile 2nd Camera */}
              {sandboxTab === 'MOBILE' && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowSecondCameraModal(true)}
                    className="h-7 text-[11px] bg-[#6C4DFF]/30 hover:bg-[#6C4DFF]/50 text-white font-mono border border-[#6C4DFF]"
                  >
                    <QrCode className="w-3 h-3 mr-1" /> Open QR Pairing Wizard
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setIsSecondCameraPaired(!isSecondCameraPaired);
                      setIsSecondCameraDisconnected(false);
                      toast.success(
                        !isSecondCameraPaired ? 'Mobile 2nd Camera Connected via WebRTC!' : 'Mobile Camera Disconnected'
                      );
                    }}
                    className={`h-7 text-[11px] font-mono ${
                      isSecondCameraPaired ? 'bg-emerald-600/30 text-emerald-300' : 'bg-white/10 text-white'
                    }`}
                  >
                    {isSecondCameraPaired ? '✓ Phone Connected (P2P)' : '+ Simulate Phone Connected'}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleSimulateMobileDisconnect}
                    className="h-7 text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-mono"
                  >
                    Simulate Disconnect (&gt;30s)
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const hash = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
                      setRoomScanHash(hash);
                      toast.success('360° Room Scan Generated', {
                        description: `Cryptographic Room Hash: ${hash}`,
                      });
                    }}
                    className="h-7 text-[11px] bg-white/10 hover:bg-white/20 text-white font-mono"
                  >
                    Run 360° Room Scan
                  </Button>
                </div>
              )}

              {/* Tab: Accommodations */}
              {sandboxTab === 'A11Y' && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setHighContrast(!highContrast)}
                    className={`h-7 text-[11px] font-mono ${
                      highContrast ? 'bg-white text-black font-bold' : 'bg-white/10 text-white'
                    }`}
                  >
                    High Contrast: {highContrast ? 'ON' : 'OFF'}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setLargeText(!largeText)}
                    className={`h-7 text-[11px] font-mono ${
                      largeText ? 'bg-[#6C4DFF] text-white font-bold' : 'bg-white/10 text-white'
                    }`}
                  >
                    Large Text (125%): {largeText ? 'ON' : 'OFF'}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setDyslexiaFont(!dyslexiaFont)}
                    className={`h-7 text-[11px] font-mono ${
                      dyslexiaFont ? 'bg-[#6C4DFF] text-white font-bold' : 'bg-white/10 text-white'
                    }`}
                  >
                    Dyslexia Font: {dyslexiaFont ? 'ON' : 'OFF'}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleStartBreak}
                    className="h-7 text-[11px] bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 font-mono border border-emerald-500/30"
                  >
                    <Coffee className="w-3 h-3 mr-1" /> Take Rest Break ({breaksUsed}/{breaksAllowed})
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleReadAloud}
                    className={`h-7 text-[11px] font-mono ${
                      isSpeaking ? 'bg-purple-600 text-white animate-pulse' : 'bg-white/10 text-white'
                    }`}
                  >
                    <Volume2 className="w-3 h-3 mr-1" /> {isSpeaking ? 'Stop Reading' : 'TTS Read Aloud'}
                  </Button>
                </div>
              )}

              {/* Tab: Recovery & Offline */}
              {sandboxTab === 'RECOVERY' && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const next = !isOffline;
                      setIsOffline(next);
                      if (next) {
                        toast.warning('Offline Mode Engaged (3-Minute Policy Limit)', {
                          description: 'Exam answers cached locally in hash-chained IndexedDB storage.',
                        });
                      } else {
                        toast.success('Network Reconnected', {
                          description: 'Cryptographic hash chain synced with server ledger.',
                        });
                      }
                    }}
                    className={`h-7 text-[11px] font-mono ${
                      isOffline ? 'bg-orange-600 text-white font-bold' : 'bg-white/10 text-white'
                    }`}
                  >
                    {isOffline ? `⚠️ Offline (${180 - offlineSecondsElapsed}s left)` : 'Simulate Going Offline'}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleSimulateCrashAndRejoin}
                    className="h-7 text-[11px] bg-white/10 hover:bg-white/20 text-white font-mono"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" /> Simulate Crash & Rejoin ({rejoinCount}/3)
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowChainModal(true)}
                    className="h-7 text-[11px] bg-[#6C4DFF]/30 hover:bg-[#6C4DFF]/50 text-white font-mono"
                  >
                    Inspect SHA-256 Chain ({autosaveHashChain.length} events)
                  </Button>
                </div>
              )}

              {/* Tab: Security Profile */}
              {sandboxTab === 'PROFILE' && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-white/70 font-mono">Current Policy Tier:</span>
                  {(['PRACTICE', 'STANDARD', 'HIGH_STAKES'] as SecurityProfileTier[]).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => {
                        setProfileTier(tier);
                        toast.info(`Switched Profile to: ${tier}`, {
                          description:
                            tier === 'PRACTICE'
                              ? 'Proctoring logged only, hints enabled.'
                              : tier === 'HIGH_STAKES'
                              ? 'Second camera required, secure client check, strict 3-min offline.'
                              : 'Standard proctoring, webcam focus, weighted engine.',
                        });
                      }}
                      className={`px-2.5 py-1 rounded font-mono text-[11px] font-bold border transition-colors ${
                        profileTier === tier
                          ? 'bg-[#FFF3A3] text-[#2B2350] border-[#FFF3A3]'
                          : 'border-white/20 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. EXAM RUNNER HEADER BAR */}
      <header
        className={`px-4 sm:px-6 py-3 border-b-2 flex flex-wrap items-center justify-between gap-3 ${
          highContrast ? 'bg-black border-white' : 'bg-white border-[#2B2350]/15'
        }`}
      >
        <div className="flex items-center space-x-3">
          <BrandLogo />
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              <h1 className="font-heading font-black text-sm tracking-tight text-[#2B2350]">
                CS-402: Distributed Systems & Consensus Architecture
              </h1>
              <Badge className="bg-[#E4DEFF] text-[#6C4DFF] border-none text-[10px] font-mono">
                {profileTier} PROFILE
              </Badge>
            </div>
            <p className="text-[11px] text-[#6B6590] font-mono">
              Candidate: STU-8841 (Demo Evaluator) • Session: sess_demo_cand
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Offline Pill Warning */}
          {isOffline && (
            <div className="flex items-center space-x-1.5 bg-orange-100 text-orange-800 border border-orange-300 px-2.5 py-1 rounded-full text-xs font-mono font-bold animate-pulse">
              <WifiOff className="w-3.5 h-3.5" />
              <span>OFFLINE: {180 - offlineSecondsElapsed}s</span>
            </div>
          )}

          {/* Fullscreen Grace Warning Pill */}
          {fullscreenGraceCountdown !== null && (
            <div className="flex items-center space-x-1.5 bg-red-100 text-red-800 border border-red-300 px-2.5 py-1 rounded-full text-xs font-mono font-bold animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>RETURN TO FULLSCREEN: {fullscreenGraceCountdown}s</span>
            </div>
          )}

          {/* Accommodation Active Pill */}
          <div className="hidden lg:flex items-center space-x-1 text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-300 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Accommodation Active</span>
          </div>

          {/* Multi-Language Switcher */}
          <div className="flex items-center space-x-1 bg-[#FAFAF7] border border-[#2B2350]/20 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded ${language === 'en' ? 'bg-[#6C4DFF] text-white font-bold' : 'text-[#6B6590]'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded ${language === 'hi' ? 'bg-[#6C4DFF] text-white font-bold' : 'text-[#6B6590]'}`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-0.5 rounded ${language === 'te' ? 'bg-[#6C4DFF] text-white font-bold' : 'text-[#6B6590]'}`}
            >
              తెలుగు
            </button>
          </div>

          {/* Timer Clock */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border-2 font-mono font-bold text-sm ${
              timeLeft < 300
                ? 'bg-red-50 border-red-500 text-red-600 animate-pulse'
                : timeLeft < 900
                ? 'bg-amber-50 border-amber-400 text-amber-700'
                : 'bg-[#FAFAF7] border-[#2B2350] text-[#2B2350]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#6C4DFF]" />
            <span aria-label="Exam Time Remaining">{formatTime(timeLeft)}</span>
          </div>

          {/* Action: Pre-Submission Review & Submit */}
          <Button
            onClick={() => setShowSubmitModal(true)}
            className="bg-[#10B981] hover:bg-[#059669] text-white font-mono font-bold text-xs py-2 px-3 rounded-xl border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350] cursor-pointer"
          >
            Submit Exam
          </Button>
        </div>
      </header>

      {/* 3. MAIN EXAM RUNNER BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT / CENTER: Active Question Workspace (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Question Stem Card */}
          <Card
            className={`p-6 rounded-3xl border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] ${
              highContrast ? 'bg-black text-white border-white' : 'bg-white text-[#2B2350]'
            }`}
          >
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2B2350]/15 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-2.5 py-0.5 rounded-full border border-[#2B2350]">
                  QUESTION {currentIdx + 1} OF {DEMO_EXAM_QUESTIONS.length}
                </span>
                <span className="text-xs text-[#6B6590] font-mono">{currentQ.section}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="font-mono text-xs border-[#2B2350]/30">
                  {currentQ.points} Points
                </Badge>
                <button
                  onClick={() => setFlagged((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                  className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 cursor-pointer transition-colors ${
                    isFlagged
                      ? 'bg-purple-100 border-[#6C4DFF] text-[#6C4DFF] font-bold'
                      : 'border-[#2B2350]/20 text-[#6B6590] hover:bg-slate-50'
                  }`}
                  title="Mark for later review"
                >
                  <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-[#6C4DFF]' : ''}`} />
                  <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Flag'}</span>
                </button>
              </div>
            </div>

            {/* Question Stem */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-heading font-black tracking-tight leading-snug">
                {currentQ.stem}
              </h2>

              {currentQ.codeSnippet && (
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-700">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              )}

              {/* Dynamic Question Renderer across All 9+ Question Types */}
              <div className="pt-2">
                <QuestionRenderer
                  question={{
                    id: String(currentQ.id),
                    type: currentQ.type,
                    stem: currentQ.stem,
                    points: currentQ.points,
                    options: currentQ.options,
                    matchingConfig: currentQ.matchingConfig,
                    orderingConfig: currentQ.orderingConfig,
                    fillInTheBlankConfig: currentQ.fillInTheBlankConfig,
                    numericConfig: currentQ.numericConfig,
                    unit: currentQ.unit,
                    mathEquationConfig: currentQ.mathEquationConfig,
                    imageHotspotConfig: currentQ.imageHotspotConfig,
                    caseStudyConfig: currentQ.caseStudyConfig,
                    fileUploadConfig: currentQ.fileUploadConfig,
                    audioVideoConfig: currentQ.audioVideoConfig,
                  }}
                  value={answers[currentQ.id]}
                  onChange={(val) => handleSelectAnswer(currentQ.id, val)}
                />
              </div>
            </div>

            {/* Question Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-[#2B2350]/15 mt-6">
              <Button
                variant="outline"
                disabled={currentIdx === 0}
                onClick={() => {
                  const prev = currentIdx - 1;
                  setCurrentIdx(prev);
                  setVisited((v) => ({ ...v, [prev]: true }));
                }}
                className="font-mono text-xs border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350]"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAnswers((prev) => {
                      const next = { ...prev };
                      delete next[currentQ.id];
                      return next;
                    });
                  }}
                  className="font-mono text-xs text-[#6B6590] hover:text-[#2B2350]"
                >
                  Clear Choice
                </Button>

                <Button
                  onClick={() => {
                    if (currentIdx < DEMO_EXAM_QUESTIONS.length - 1) {
                      const next = currentIdx + 1;
                      setCurrentIdx(next);
                      setVisited((v) => ({ ...v, [next]: true }));
                    } else {
                      setShowSubmitModal(true);
                    }
                  }}
                  className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-2 px-4 rounded-xl border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350] cursor-pointer"
                >
                  {currentIdx === DEMO_EXAM_QUESTIONS.length - 1 ? (
                    'Review & Finish'
                  ) : (
                    <>
                      Save & Next <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT: Live Proctoring HUD & Question Palette (1 Column) */}
        <div className="space-y-4">
          {/* 1. Live Webcam Proctoring HUD Widget */}
          <Card
            className={`p-4 rounded-3xl border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] ${
              highContrast ? 'bg-black text-white border-white' : 'bg-white text-[#2B2350]'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#2B2350]/15 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Primary Proctor Cam</span>
              </span>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-500 text-emerald-600">
                WASM Active
              </Badge>
            </div>

            {/* Webcam Simulation Viewport */}
            <div className="relative aspect-video rounded-2xl bg-slate-900 overflow-hidden border border-[#2B2350] flex items-center justify-center text-center p-3">
              <div className="space-y-1.5 text-white/80">
                <div className="w-10 h-10 rounded-full bg-[#6C4DFF]/30 border border-[#6C4DFF] flex items-center justify-center mx-auto text-[#FFF3A3]">
                  <Eye className="w-5 h-5" />
                </div>
                <p className="text-[11px] font-mono font-bold text-white">Gaze: Centered (0.02 rad)</p>
                <p className="text-[10px] font-mono text-emerald-400">1 Face Detected • Liveness: 0.98</p>
              </div>

              {/* Watermark overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center rotate-12">
                <span className="text-[10px] font-mono text-white tracking-widest">
                  STU-8841 // ASSESSIQ-DEMO
                </span>
              </div>
            </div>

            {/* Mobile Second Camera Status / Preview Pill */}
            <div className="mt-3 pt-3 border-t border-[#2B2350]/10 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center space-x-1.5 text-[#6B6590]">
                <Smartphone className="w-3.5 h-3.5" />
                <span>2nd Camera:</span>
              </span>
              {isSecondCameraPaired ? (
                <span className="text-emerald-600 font-bold flex items-center space-x-1">
                  <Check className="w-3 h-3" /> <span>P2P Active</span>
                </span>
              ) : (
                <button
                  onClick={() => setShowSecondCameraModal(true)}
                  className="text-[#6C4DFF] hover:underline font-bold"
                >
                  Pair Mobile QR
                </button>
              )}
            </div>
          </Card>

          {/* 2. Question Palette Navigation */}
          <Card
            className={`p-4 rounded-3xl border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] ${
              highContrast ? 'bg-black text-white border-white' : 'bg-white text-[#2B2350]'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#2B2350]/15 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Question Palette</span>
              <span className="text-[11px] font-mono text-[#6B6590]">
                {Object.keys(answers).length}/{DEMO_EXAM_QUESTIONS.length} Done
              </span>
            </div>

            {/* Palette Filter Pills */}
            <div className="flex items-center space-x-1 mb-3 text-[10px] font-mono overflow-x-auto pb-1">
              {(['ALL', 'ANSWERED', 'UNANSWERED', 'MARKED'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    filterCategory === cat ? 'bg-[#2B2350] text-white font-bold' : 'bg-slate-100 text-[#6B6590] hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Question Buttons Grid */}
            <div className="grid grid-cols-5 gap-2">
              {DEMO_EXAM_QUESTIONS.map((q, idx) => {
                const answered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;
                const isMarked = Boolean(flagged[q.id]);

                let btnBg = 'bg-[#FAFAF7] text-[#2B2350] border-[#2B2350]/30';
                if (answered) {
                  btnBg = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                } else if (isMarked) {
                  btnBg = 'bg-[#6C4DFF] text-white border-[#6C4DFF] font-bold';
                }

                if (isCurrent) {
                  btnBg += ' ring-2 ring-offset-1 ring-[#6C4DFF]';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setVisited((v) => ({ ...v, [idx]: true }));
                    }}
                    className={`h-9 rounded-xl border-2 text-xs font-mono transition-transform hover:scale-105 active:scale-95 flex items-center justify-center relative ${btnBg}`}
                  >
                    <span>{idx + 1}</span>
                    {isMarked && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Palette Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#2B2350]/15 text-[10px] font-mono text-[#6B6590]">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#FAFAF7] border border-slate-300" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#6C4DFF]" />
                <span>Flagged</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded border-2 border-[#6C4DFF]" />
                <span>Current</span>
              </div>
            </div>
          </Card>

          {/* 3. In-Exam Candidate Tools Card */}
          <Card
            className={`p-4 rounded-3xl border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] ${
              highContrast ? 'bg-black text-white border-white' : 'bg-white text-[#2B2350]'
            }`}
          >
            <div className="pb-2 border-b border-[#2B2350]/15 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Candidate Support Tools</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCalculator(!showCalculator)}
                className="font-mono text-xs border border-[#2B2350]/30"
              >
                <Calculator className="w-3.5 h-3.5 mr-1 text-[#6C4DFF]" /> Calculator
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelpModal(true)}
                className="font-mono text-xs border border-[#2B2350]/30"
              >
                <HelpCircle className="w-3.5 h-3.5 mr-1 text-[#6C4DFF]" /> Support Desk
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* 4. MODALS & OVERLAYS */}

      {/* (A) Fullscreen Warning Overlay */}
      {criticalOverlay?.active && (
        <CriticalAlertOverlay
          currentPoints={criticalOverlay.points}
          countdownSeconds={criticalOverlay.countdown}
          violationName={criticalOverlay.ruleId}
          onAcknowledge={() => setCriticalOverlay(null)}
        />
      )}

      {/* (B) Hard Lockdown Terminated Screen */}
      {isLockedDown && (
        <LockdownTerminatedScreen
          reason={lockdownReason}
          evidencePacket={evidencePacket}
          onExit={handleResetPoints}
        />
      )}

      {/* (C) Timed Rest Break Overlay */}
      {isOnBreak && (
        <div
          role="dialog"
          aria-modal="true"
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
              <h2 className="font-heading font-black text-xl text-[#2B2350] mt-1">Rest Break Active</h2>
              <p className="text-xs text-[#6B6590] mt-1 font-body">
                The main exam timer is frozen and proctoring violation sentinels are temporarily suspended.
              </p>
            </div>

            <div className="bg-[#FAFAF7] border-2 border-[#2B2350] rounded-2xl p-4 font-mono">
              <span className="text-[10px] text-[#6B6590] uppercase block">BREAK TIME REMAINING</span>
              <span className="text-3xl font-black text-[#6C4DFF]">{formatTime(breakTimeRemaining)}</span>
            </div>

            <Button
              onClick={() => setIsOnBreak(false)}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-mono font-bold text-xs py-3 rounded-xl border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] cursor-pointer"
            >
              Resume Examination Early
            </Button>
          </div>
        </div>
      )}

      {/* (D) Mobile Second Camera QR Pairing Wizard Modal */}
      <Dialog open={showSecondCameraModal} onOpenChange={setShowSecondCameraModal}>
        <DialogContent className="sm:max-w-xl bg-white text-[#2B2350] p-6 rounded-3xl border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350]">
          <MobileSecondCameraWizard
            sessionId="sess_demo_cand"
            examId="EXAM_DEMO_402"
            examTitle="CS-402: Distributed Systems (Demo)"
            mode={secondCameraMode}
            onComplete={(setup) => {
              setIsSecondCameraPaired(setup.paired);
              if (setup.roomScanHash) setRoomScanHash(setup.roomScanHash);
              setShowSecondCameraModal(false);
              toast.success('Mobile Second Camera Paired & Active');
            }}
            onSkip={() => setShowSecondCameraModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* (E) Pre-Submission Review Modal */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="sm:max-w-lg bg-[#FAFAF7] text-[#2B2350] p-6 rounded-3xl border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350]">
          <DialogHeader className="border-b border-[#2B2350]/15 pb-3">
            <DialogTitle className="text-lg font-heading font-black text-[#2B2350] flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-[#6C4DFF]" />
              <span>Final Exam Review & Submission</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6B6590]">
              Review your question completion telemetry before submitting to the grading engine.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3 text-xs font-mono">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl">
                <span className="text-[10px] text-emerald-700 block font-bold">ANSWERED</span>
                <span className="text-xl font-black text-emerald-800">{Object.keys(answers).length}</span>
              </div>
              <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl">
                <span className="text-[10px] text-amber-700 block font-bold">UNANSWERED</span>
                <span className="text-xl font-black text-amber-800">
                  {DEMO_EXAM_QUESTIONS.length - Object.keys(answers).length}
                </span>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-3 rounded-xl">
                <span className="text-[10px] text-purple-700 block font-bold">FLAGGED</span>
                <span className="text-xl font-black text-purple-800">{Object.keys(flagged).length}</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#2B2350]/20 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6B6590]">Proctoring Risk Points:</span>
                <span className="font-bold text-[#2B2350]">{integrityPoints}/8 Points</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6590]">Integrity Confidence:</span>
                <span className="font-bold text-emerald-600">{integrityConfidence}% Clean</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6590]">Local Hash Chain Events:</span>
                <span className="font-bold text-[#6C4DFF]">{autosaveHashChain.length} Verified</span>
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-1">
              <input
                type="checkbox"
                id="confirm-submit-checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#6C4DFF] rounded cursor-pointer"
              />
              <label htmlFor="confirm-submit-checkbox" className="text-[11px] text-[#2B2350] leading-tight cursor-pointer font-sans">
                I confirm that I have reviewed my answers. I understand that upon submission, answers are cryptographically sealed and auto-graded.
              </label>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-[#2B2350]/15 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSubmitModal(false)}
              className="font-mono text-xs border border-[#2B2350]/30"
            >
              Back to Questions
            </Button>
            <Button
              disabled={!confirmChecked}
              onClick={() => handleAutoSubmit()}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-mono font-bold text-xs py-2 px-4 rounded-xl border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350] cursor-pointer disabled:opacity-50"
            >
              Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* (F) Completed Exam Scorecard & Psychometrics Modal */}
      {setupStep === 'COMPLETED' && examResults && submissionReceipt && (
        <div className="fixed inset-0 z-50 bg-[#2B2350]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <Card className="max-w-3xl w-full p-6 sm:p-8 bg-white text-[#2B2350] border-2 border-[#2B2350] rounded-3xl shadow-[8px_8px_0px_#2B2350] my-auto space-y-6">
            <div className="flex items-start justify-between border-b border-[#2B2350]/15 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-[#6C4DFF]" />
                  <h2 className="text-xl sm:text-2xl font-heading font-black">Examination Results & Scorecard</h2>
                </div>
                <p className="text-xs text-[#6B6590] font-mono mt-0.5">
                  Submission ID: {submissionReceipt.submissionId} • Timestamp: {submissionReceipt.timestamp}
                </p>
              </div>

              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-400 font-mono text-xs">
                AUTO-GRADED
              </Badge>
            </div>

            {/* Score Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
              <div className="p-3 bg-[#FAFAF7] border-2 border-[#2B2350] rounded-2xl">
                <span className="text-[10px] text-[#6B6590] uppercase block">TOTAL SCORE</span>
                <span className="text-2xl font-black text-[#6C4DFF]">
                  {examResults.earnedPoints}/{examResults.totalPoints}
                </span>
                <span className="text-[10px] text-emerald-600 block font-bold">({examResults.percentage}%)</span>
              </div>

              <div className="p-3 bg-[#FAFAF7] border-2 border-[#2B2350] rounded-2xl">
                <span className="text-[10px] text-[#6B6590] uppercase block">PERCENTILE RANK</span>
                <span className="text-2xl font-black text-[#2B2350]">{examResults.percentileRank}th</span>
                <span className="text-[10px] text-[#6B6590] block">IRT Calibrated</span>
              </div>

              <div className="p-3 bg-[#FAFAF7] border-2 border-[#2B2350] rounded-2xl">
                <span className="text-[10px] text-[#6B6590] uppercase block">LATENT ABILITY (θ)</span>
                <span className="text-2xl font-black text-purple-700">+{examResults.thetaScore}</span>
                <span className="text-[10px] text-[#6B6590] block">3PL Model</span>
              </div>

              <div className="p-3 bg-[#FAFAF7] border-2 border-[#2B2350] rounded-2xl">
                <span className="text-[10px] text-[#6B6590] uppercase block">INTEGRITY CONFIDENCE</span>
                <span className="text-2xl font-black text-emerald-600">{submissionReceipt.integrityConfidence}%</span>
                <span className="text-[10px] text-emerald-700 block font-bold">Clean Audit</span>
              </div>
            </div>

            {/* Question by Question Item Breakdown */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B6590]">
                Item Performance & Psychometrics
              </h3>
              {examResults.evaluatedItems.map((item: any, idx: number) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl border border-[#2B2350]/15 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                        item.isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    >
                      {item.isCorrect ? '✓' : '✕'}
                    </span>
                    <span className="font-bold text-[#2B2350]">Q{idx + 1}.</span>
                    <span className="text-[#6B6590] truncate max-w-xs">{item.stem}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] text-[#6B6590] bg-slate-100 px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                    <span className="font-bold text-[#2B2350]">
                      {item.earned}/{item.points} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cryptographic Receipt Block */}
            <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-2xl space-y-1">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>CRYPTOGRAPHIC SUBMISSION RECEIPT</span>
                <span>HMAC-SHA256 VERIFIED</span>
              </div>
              <p className="truncate">Root Ledger Hash: {submissionReceipt.terminalHash}</p>
              <p className="text-slate-400">
                Audited with 0 tamper events • Zero-knowledge proof verified on AssessIQ Institutional Ledger.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast.success('Official Scorecard PDF Downloaded', {
                    description: 'Cryptographically signed institutional transcript generated.',
                  });
                }}
                className="font-mono text-xs border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350]"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Download PDF Transcript
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => {
                    setSetupStep('ACTIVE_EXAM');
                    setAnswers({});
                    setFlagged({});
                    setCurrentIdx(0);
                    handleResetPoints();
                    setTimeLeft(3600);
                  }}
                  className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-2 px-4 rounded-xl border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restart Demo Exam
                </Button>
                <Button
                  onClick={() => navigate('/student')}
                  variant="outline"
                  className="font-mono text-xs border border-[#2B2350]"
                >
                  Exit to Student Portal
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* (G) Interactive Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="sm:max-w-xs bg-white text-[#2B2350] p-4 rounded-3xl border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350]">
          <DialogHeader>
            <DialogTitle className="text-sm font-mono font-bold flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-[#6C4DFF]" />
              <span>Scientific Calculator</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 font-mono">
            <input
              type="text"
              readOnly
              value={calcInput || '0'}
              className="w-full text-right p-2.5 rounded-xl border-2 border-[#2B2350] bg-slate-50 text-base font-bold"
            />
            <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === 'C') {
                      setCalcInput('');
                    } else if (btn === '=') {
                      try {
                        // eslint-disable-next-line no-eval
                        const res = Function(`'use strict'; return (${calcInput})`)();
                        setCalcInput(String(res));
                      } catch {
                        setCalcInput('Err');
                      }
                    } else {
                      setCalcInput((prev) => prev + btn);
                    }
                  }}
                  className="p-2.5 rounded-lg border border-[#2B2350]/30 hover:bg-slate-100 active:scale-95"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* (H) In-Exam Support Chat & Tech Report */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="sm:max-w-md bg-[#FAFAF7] text-[#2B2350] p-6 rounded-3xl border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350]">
          <DialogHeader>
            <DialogTitle className="text-sm font-mono font-bold flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-[#6C4DFF]" />
              <span>In-Exam Invigilation Support Desk</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2 text-xs font-mono">
            <div className="h-44 overflow-y-auto space-y-2 p-2 bg-white rounded-xl border border-[#2B2350]/20">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg ${
                    msg.sender === 'STUDENT' ? 'bg-[#6C4DFF]/10 text-[#6C4DFF] ml-6' : 'bg-slate-100 text-[#2B2350] mr-6'
                  }`}
                >
                  <span className="text-[9px] block text-[#6B6590] uppercase">{msg.sender} • {msg.time}</span>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type question to proctor..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    setChatMessages((prev) => [
                      ...prev,
                      { sender: 'STUDENT', text: chatInput, time: new Date().toLocaleTimeString() },
                    ]);
                    setChatInput('');
                    setTimeout(() => {
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          sender: 'INVIGILATOR',
                          text: 'Proctor acknowledged. Telemetry looks healthy; please continue your exam.',
                          time: new Date().toLocaleTimeString(),
                        },
                      ]);
                    }, 1000);
                  }
                }}
                className="flex-1 p-2 rounded-xl border border-[#2B2350]/30 text-xs"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (chatInput.trim()) {
                    setChatMessages((prev) => [
                      ...prev,
                      { sender: 'STUDENT', text: chatInput, time: new Date().toLocaleTimeString() },
                    ]);
                    setChatInput('');
                  }
                }}
                className="bg-[#6C4DFF] text-white font-mono text-xs"
              >
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* (I) Autosave Hash Chain Popover */}
      <Dialog open={showChainModal} onOpenChange={setShowChainModal}>
        <DialogContent className="sm:max-w-md bg-slate-900 text-emerald-400 p-5 rounded-3xl border-2 border-slate-700 shadow-xl font-mono text-xs">
          <DialogHeader>
            <DialogTitle className="text-white text-sm font-mono flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Cryptographic Hash-Chained Autosave Ledger</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 pt-2">
            <p className="text-slate-400 text-[11px]">
              Every answer change produces a SHA-256 hash incorporating the previous block hash and candidate timestamp.
            </p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 bg-black/50 rounded-xl border border-slate-800 text-[10px]">
              {autosaveHashChain.map((hash, i) => (
                <div key={i} className="truncate">
                  <span className="text-slate-500">Block #{i + 1}:</span> {hash}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              Status: Validated locally • Zero hash chain collision or tampering detected.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDemoExam;

