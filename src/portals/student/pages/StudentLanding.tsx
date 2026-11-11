import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from "@/shared/stores/authStore";
import { authService } from "@/shared/services/authService";
import {
  Sparkles,
  Play,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award,
  Brain,
  Laptop,
  Lock,
  RefreshCw,
  ChevronDown,
  Zap,
  Clock,
  BookOpen,
  WifiOff,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import {
  RedCheck,
  RedCircle,
  RedUnderline,
  CropMarks,
  MarginNote,
  OmrBubble,
} from '@/components/marks';
import { toast } from 'sonner';

export const StudentLanding: React.FC = () => {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const [selectedBubble, setSelectedBubble] = useState<'A' | 'B' | 'C' | 'D'>('C');

  const handleInstantDemoAuth = async () => {
    setIsLaunching(true);
    try {
      const session = await authService.login({
        email: 'student@mit.edu',
        password: 'Password123!',
        rememberMe: true,
      });

      setSession(session);
      toast.success('Clearance Granted', {
        description: 'Welcome Jane Doe! Dispatched to Student Portal.',
      });

      navigate('/student/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Demo launch failed.';
      toast.error('Authentication Failed', { description: msg });
    } finally {
      setIsLaunching(false);
    }
  };

  const faqs = [
    {
      q: 'What happens if my Wi-Fi disconnects during a live final exam?',
      a: 'Zero panic. AssessIQ runs client-side encrypted autosaving into browser IndexedDB. Every radio choice, code snippet, and essay keystroke is cryptographically signed and stored locally, instantly syncing back with university servers the second your connection returns.',
      tag: 'OFFLINE CONSENSUS',
    },
    {
      q: 'Does AssessIQ record hours of my room video to third-party servers?',
      a: 'Never. Unlike invasive legacy proctoring platforms that stream video to overseas call centers, AssessIQ runs privacy-first computer vision locally inside your browser via WebAssembly (Wasm). Focus and gaze vectors are evaluated in-memory; raw webcam feeds are never uploaded.',
      tag: 'LOCAL WASM PRIVACY',
    },
    {
      q: 'How fast do I receive my exam grades and question feedback?',
      a: 'Multiple-choice and code execution tests are auto-graded in under 12 seconds. Free-response essays evaluated with AI rubrics provide question-by-question explanations, IRT difficulty percentiles, and Bloom mastery breakdowns immediately.',
      tag: '12-SEC AI RUBRIC',
    },
    {
      q: 'Are my digital certificates and badges verifiable by employers?',
      a: 'Yes. All completed credentials carry an immutable Ed25519 signature and SHA-256 hash. Employers (like Google, Stripe, or healthcare boards) can verify your transcript authenticity directly on public key registries without third-party fees.',
      tag: 'SHA-256 SEAL',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-body text-[#2B2350] selection:bg-[#FFF3A3] selection:text-[#2B2350] antialiased pencil-cursor pb-16">
      {/* ================= 1. THE ANSWER SHEET HEADER BAR ================= */}
      <header className="sticky top-0 z-50 bg-[#FAFAF7]/90 backdrop-blur-md border-b-2 border-dashed border-[#2B2350]/20 px-6 sm:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#6C4DFF] text-white flex items-center justify-center shadow-xs group-hover:bg-[#5A3DEB] transition-colors border border-[#2B2350]">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <span className="font-heading text-xl font-extrabold tracking-tight text-[#2B2350]">
              Assess<span className="text-[#6C4DFF]">IQ</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 bg-[#FFF3A3] text-[#2B2350] border border-[#2B2350] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
              <OmrBubble letter="A" selected size="sm" />
              <span>CANDIDATE STATION</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-[#6B6590] bg-[#C9CCFF]/40 border border-[#2B2350]/30 px-2.5 py-0.5 rounded-full">
              FORM STU-01
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-mono font-bold text-[#6B6590]">
          <a href="#features" className="hover:text-[#6C4DFF] transition-colors">FEATURES</a>
          <a href="#journey" className="hover:text-[#6C4DFF] transition-colors">EXAM FLOW</a>
          <a href="#credentials" className="hover:text-[#6C4DFF] transition-colors">CREDENTIALS</a>
          <a href="#faq" className="hover:text-[#6C4DFF] transition-colors">STUDENT FAQ</a>
        </nav>

        {/* Right CTA Group */}
        <div className="flex items-center space-x-3">
          <Link
            to="/auth"
            className="hidden sm:inline-block text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors px-2 py-1"
          >
            ← ALL PORTALS
          </Link>

          <Link to="/student/login">
            <button className="bg-white border-2 border-[#2B2350] hover:bg-[#FFF3A3] text-[#2B2350] font-mono font-bold text-xs px-3.5 py-2 rounded-xl shadow-[2px_2px_0px_#2B2350] transition-transform hover:-translate-y-0.5 cursor-pointer">
              SIGN IN
            </button>
          </Link>

          <button
            onClick={handleInstantDemoAuth}
            disabled={isLaunching}
            className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-4 py-2 rounded-xl border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350] transition-transform hover:-translate-y-0.5 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">{isLaunching ? 'LAUNCHING...' : '⚡ 1-CLICK DEMO'}</span>
            <span className="sm:hidden">DEMO</span>
          </button>
        </div>
      </header>

      {/* ================= 2. MAIN ANSWER SHEET STACK ================= */}
      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ================= SHEET 1: HERO (PERIWINKLE #C9CCFF) ================= */}
        <section className="relative p-6 sm:p-12 rounded-[36px] bg-[#C9CCFF]/35 border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-8">
          <CropMarks />

          {/* Top Eyebrow */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed border-[#2B2350]/20 pb-4">
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
                Q1 // ZERO-DISTRACTION TEST RUNNER
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-2.5 py-1 rounded-full border border-[#2B2350]">
                WASM SENTINEL ACTIVE
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <MarginNote className="-rotate-3">100% autosaved • offline safe</MarginNote>
              <span className="hidden sm:inline-block text-xs font-mono font-bold text-[#10B981] bg-white border border-[#2B2350] px-3 py-1 rounded-full shadow-xs">
                MIT EECS VERIFIED
              </span>
            </div>
          </div>

          {/* Hero Content Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Bold Headline & Student Pitch */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2350] tracking-tight leading-[1.08]">
                Exams that <span className="relative inline-block px-1">protect<RedCircle className="scale-110" /></span> your hard work.
              </h1>

              <p className="text-base sm:text-lg text-[#6B6590] font-body leading-relaxed max-w-xl">
                Built specifically for university candidates: zero-distraction full-screen testing, encrypted offline autosaving in IndexedDB, and instant AI rubric explanations in 12 seconds.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/student/dashboard">
                  <button className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] flex items-center space-x-2 transition-transform hover:-translate-y-0.5 cursor-pointer">
                    <span>ENTER STUDENT DESK</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>

                <button
                  onClick={handleInstantDemoAuth}
                  disabled={isLaunching}
                  className="bg-[#FFF3A3] hover:bg-[#FFE680] text-[#2B2350] border-2 border-[#2B2350] font-mono font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-[3px_3px_0px_#2B2350] flex items-center space-x-2 transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#6C4DFF] fill-[#6C4DFF]" />
                  <span>⚡ 1-CLICK FAST AUTH (DEMO)</span>
                </button>

                <Link to="/student/practice">
                  <button className="bg-white border-2 border-[#2B2350] hover:bg-slate-50 text-[#2B2350] font-mono font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-[2px_2px_0px_#2B2350] flex items-center space-x-1.5 transition-transform hover:-translate-y-0.5 cursor-pointer">
                    <Brain className="w-4 h-4 text-[#6C4DFF]" />
                    <span>TRY PRACTICE DRILL</span>
                  </button>
                </Link>
              </div>

              {/* Security Pill Roster */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono text-[#6B6590]">
                <span className="flex items-center text-[#2B2350] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mr-1.5" />
                  Offline AES-256 Storage
                </span>
                <span>•</span>
                <span className="flex items-center text-[#2B2350] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mr-1.5" />
                  No Creepy Cloud Video Stored
                </span>
                <span>•</span>
                <span className="flex items-center text-[#2B2350] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mr-1.5" />
                  Canvas LMS Compatible
                </span>
              </div>
            </div>

            {/* Right Column: Freshly Graded Exam Sheet Mockup */}
            <div className="lg:col-span-5">
              <div className="relative p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-4 rotate-1 hover:rotate-0 transition-transform">
                <CropMarks />

                {/* Graded Header */}
                <div className="flex items-center justify-between border-b-2 border-dashed border-[#2B2350]/20 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#6B6590] uppercase font-bold">EXAM CODE: CS-402</span>
                    <h3 className="font-heading font-extrabold text-base text-[#2B2350]">Jane Doe (MIT Candidate)</h3>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono font-bold bg-[#10B981]/20 text-[#047857] px-2 py-0.5 rounded border border-[#10B981]/40">
                      AUTOSAVE READY
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#FF4D5E] mt-1 -rotate-6">
                      graded in 12s!
                    </span>
                  </div>
                </div>

                {/* Sample Questions with OMR Bubbles */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#FFF3A3]/25 border border-[#2B2350] space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-bold text-[#2B2350]">
                      <span>1. Primary benefit of client-side Wasm?</span>
                      <span className="text-[#FF4D5E] font-bold">+50pts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {(['A', 'B', 'C', 'D'] as const).map((b) => (
                        <button
                          key={b}
                          onClick={() => setSelectedBubble(b)}
                          className="cursor-pointer"
                        >
                          <OmrBubble letter={b} selected={selectedBubble === b} size="sm" />
                        </button>
                      ))}
                      <span className="text-[10px] text-[#6B6590] ml-2">← click to bubble</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAFAF7] border border-[#2B2350] space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-bold text-[#2B2350]">
                      <span>2. Wi-Fi drops during finals?</span>
                      <span className="text-[#FF4D5E] font-bold">+50pts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <OmrBubble letter="A" size="sm" />
                      <OmrBubble letter="B" selected size="sm" />
                      <OmrBubble letter="C" size="sm" />
                      <OmrBubble letter="D" size="sm" />
                      <span className="text-[10px] text-[#10B981] font-bold ml-2">✓ Encrypted in IndexedDB</span>
                    </div>
                  </div>
                </div>

                {/* Score Stamp Footer */}
                <div className="pt-2 flex items-center justify-between border-t border-[#2B2350]/20">
                  <div className="text-[11px] font-mono text-[#6B6590]">
                    <span>STATUS: </span>
                    <span className="font-bold text-[#10B981]">CONSENSUS PASS</span>
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-[#FF4D5E] border-2 border-[#FF4D5E] px-3 py-0.5 rounded-xl -rotate-6 shadow-xs">
                    98/100
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Perforated Divider */}
        <div className="mx-8 border-b-2 border-dashed border-[#2B2350]/20" />

        {/* ================= SHEET 2: TELEMETRY & TRUST COUNTERS (LEMON #FFF3A3) ================= */}
        <section className="relative p-6 sm:p-10 rounded-[36px] bg-[#FFF3A3]/45 border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6">
          <CropMarks />

          <div className="flex items-center justify-between border-b-2 border-dashed border-[#2B2350]/20 pb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2B2350]">
              Q2 // VERIFIED TELEMETRY STATS
            </span>
            <MarginNote className="-rotate-2">zero data loss record</MarginNote>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-center">
            <div className="p-4 rounded-2xl bg-white border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] space-y-1">
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#6C4DFF]">18.9M+</div>
              <p className="text-xs font-bold text-[#2B2350]">Assessments Delivered</p>
              <p className="text-[10px] text-[#6B6590]">100% autosaved</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] space-y-1">
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#10B981]">0.0%</div>
              <p className="text-xs font-bold text-[#2B2350]">Data Loss During Drops</p>
              <p className="text-[10px] text-[#6B6590]">AES-256 IndexedDB</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] space-y-1">
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#2B2350]">12 Sec</div>
              <p className="text-xs font-bold text-[#2B2350]">Average AI Rubric Grade</p>
              <p className="text-[10px] text-[#6B6590]">No 3-week waiting</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] space-y-1">
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#FF4D5E]">99.8%</div>
              <p className="text-xs font-bold text-[#2B2350]">Student Trust Score</p>
              <p className="text-[10px] text-[#6B6590]">Zero privacy breaches</p>
            </div>
          </div>
        </section>

        {/* Perforated Divider */}
        <div className="mx-8 border-b-2 border-dashed border-[#2B2350]/20" />

        {/* ================= SHEET 3: CORE STUDENT FEATURES (WHITE SHEET WITH PASTEL BENTO) ================= */}
        <section id="features" className="relative p-6 sm:p-10 rounded-[36px] bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-8">
          <CropMarks />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-dashed border-[#2B2350]/20 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6C4DFF]">
                Q3 // THE STUDENT SUPERPOWERS
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#2B2350] mt-1">
                Engineered for Academic Confidence
              </h2>
            </div>
            <MarginNote className="-rotate-1">fair • reliable • fast</MarginNote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tile 1: Offline Autosave */}
            <div className="p-6 rounded-3xl bg-[#C9CCFF]/35 border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#2B2350] flex items-center justify-center shadow-xs">
                  <WifiOff className="w-5 h-5 text-[#6C4DFF]" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-[#2B2350]">
                  Offline Answer Autosave
                </h3>
                <p className="text-xs text-[#6B6590] font-body leading-relaxed">
                  Never lose an answer to network drops. Responses encrypt locally in IndexedDB and synchronize cleanly with server consensus once restored.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-[#6C4DFF] font-bold flex items-center">
                <RedCheck className="w-3.5 h-3.5 mr-1" />
                ZERO DATA LOSS
              </div>
            </div>

            {/* Tile 2: Instant AI Score Breakdown */}
            <div className="p-6 rounded-3xl bg-[#FFF3A3]/45 border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#2B2350] flex items-center justify-center shadow-xs">
                  <Brain className="w-5 h-5 text-[#2B2350]" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-[#2B2350]">
                  Instant AI Rubric Breakdown
                </h3>
                <p className="text-xs text-[#6B6590] font-body leading-relaxed">
                  Receive question-by-question explanations, IRT percentile curves, and personalized Bloom taxonomy study recommendations in 12 seconds.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-[#2B2350] font-bold flex items-center">
                <RedCheck className="w-3.5 h-3.5 mr-1 text-[#FF4D5E]" />
                NO 3-WEEK DELAYS
              </div>
            </div>

            {/* Tile 3: Local Wasm Proctoring */}
            <div className="p-6 rounded-3xl bg-[#B8F0D2]/40 border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#2B2350] flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-[#2B2350]">
                  Privacy-First Wasm Sentinel
                </h3>
                <p className="text-xs text-[#6B6590] font-body leading-relaxed">
                  No invasive human surveillance recording your bedroom. Computer vision executes directly on your machine inside WebAssembly sandbox.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-[#10B981] font-bold flex items-center">
                <RedCheck className="w-3.5 h-3.5 mr-1" />
                100% CLIENT PRIVATE
              </div>
            </div>

            {/* Tile 4: Verifiable Credentials */}
            <div className="p-6 rounded-3xl bg-[#FFB5A7]/35 border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#2B2350] flex items-center justify-center shadow-xs">
                  <Award className="w-5 h-5 text-[#FF4D5E]" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-[#2B2350]">
                  Cryptographic Badges
                </h3>
                <p className="text-xs text-[#6B6590] font-body leading-relaxed">
                  Ed25519-signed digital certificates with verifiable SHA-256 seals. Share directly on LinkedIn or with corporate engineering recruiters.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-[#FF4D5E] font-bold flex items-center">
                <RedCheck className="w-3.5 h-3.5 mr-1" />
                TAMPER-PROOF LEDGER
              </div>
            </div>
          </div>
        </section>

        {/* Perforated Divider */}
        <div className="mx-8 border-b-2 border-dashed border-[#2B2350]/20" />

        {/* ================= SHEET 4: 4-STEP EXAM JOURNEY (MINT #B8F0D2) ================= */}
        <section id="journey" className="relative p-6 sm:p-10 rounded-[36px] bg-[#B8F0D2]/35 border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-8">
          <CropMarks />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-dashed border-[#2B2350]/20 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#10B981]">
                Q4 // THE 4-STEP EXAM FLOW
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#2B2350] mt-1">
                How an Exam Feels from Your Seat
              </h2>
            </div>
            <MarginNote className="-rotate-2">streamlined & stress-free</MarginNote>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: '01', bubble: 'A', title: '5-Second Check-In', desc: 'Single sign-on via your university portal. Client Wasm runs a fast 5-second camera & mic check.', note: 'quick setup' },
              { step: '02', bubble: 'B', title: 'Zero-Distraction Runner', desc: 'High-contrast typography, keyboard shortcuts, formula sheets, and code execution IDE in full-screen.', note: 'focus mode' },
              { step: '03', bubble: 'C', title: 'Local Encryption Autosave', desc: 'Answers save locally in IndexedDB as you type. Real-time timer and progress indicators keep you grounded.', note: 'offline safe' },
              { step: '04', bubble: 'D', title: 'Instant Transcript & Seal', desc: 'Submit with 1-click. View your graded breakdown, rubric points, and cryptographically signed certificate.', note: 'instant cert' },
            ].map((st, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-[#FFF3A3] text-[#2B2350] px-2.5 py-0.5 rounded-full border border-[#2B2350]">
                      STEP {st.step}
                    </span>
                    <OmrBubble letter={st.bubble} selected size="sm" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#2B2350]">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#6B6590] font-body leading-relaxed">
                    {st.desc}
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-mono text-[#10B981] font-bold">
                  ✓ {st.note}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Perforated Divider */}
        <div className="mx-8 border-b-2 border-dashed border-[#2B2350]/20" />

        {/* ================= SHEET 5: FREQUENTLY ASKED QUESTIONS (CORAL #FFB5A7) ================= */}
        <section id="faq" className="relative p-6 sm:p-10 rounded-[36px] bg-[#FFB5A7]/30 border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6">
          <CropMarks />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-dashed border-[#2B2350]/20 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF4D5E]">
                Q5 // CANDIDATE INQUIRIES
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#2B2350] mt-1">
                Candidate Frequently Asked Questions
              </h2>
            </div>
            <MarginNote className="-rotate-1">transparent answers</MarginNote>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {faqs.map((faq, i) => (
              <div
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="p-5 rounded-2xl bg-white border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] cursor-pointer transition-all space-y-2"
              >
                <div className="flex justify-between items-center font-heading font-extrabold text-sm sm:text-base text-[#2B2350]">
                  <span className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono font-bold text-[#FF4D5E] bg-[#FFB5A7]/40 px-2 py-0.5 rounded border border-[#2B2350]">
                      {faq.tag}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#2B2350] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </div>

                {openFaq === i && (
                  <p className="text-xs text-[#6B6590] font-body leading-relaxed border-t border-[#2B2350]/15 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Perforated Divider */}
        <div className="mx-8 border-b-2 border-dashed border-[#2B2350]/20" />

        {/* ================= SHEET 6: FINAL CTA + FOOTER (LEMON #FFF3A3) ================= */}
        <section className="relative p-8 sm:p-14 rounded-[36px] bg-[#FFF3A3]/50 border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] text-center space-y-6">
          <CropMarks />

          <div className="flex justify-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white text-[#2B2350] px-3.5 py-1 rounded-full border border-[#2B2350]">
              Q6 // COMMENCE TESTING
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#2B2350] tracking-tight max-w-2xl mx-auto leading-tight">
            Ready for your next <span className="relative inline-block px-1">assessment?<RedCircle className="scale-110" /></span>
          </h2>

          <p className="text-xs sm:text-base text-[#6B6590] font-body max-w-xl mx-auto">
            Log in to your candidate workspace to take scheduled exams, view verifiable score transcripts, or practice with adaptive IRT mock tests.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/student/dashboard">
              <button className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs sm:text-sm px-8 py-4 rounded-2xl border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] flex items-center space-x-2 transition-transform hover:-translate-y-0.5 cursor-pointer">
                <span>OPEN CANDIDATE DESK</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <button
              onClick={handleInstantDemoAuth}
              disabled={isLaunching}
              className="bg-white border-2 border-[#2B2350] hover:bg-[#FFF3A3] text-[#2B2350] font-mono font-bold text-xs sm:text-sm px-7 py-4 rounded-2xl shadow-[3px_3px_0px_#2B2350] flex items-center space-x-2 transition-transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-[#6C4DFF] fill-[#6C4DFF]" />
              <span>⚡ 1-CLICK INSTANT SIGN-IN</span>
            </button>
          </div>

          {/* Signature Line */}
          <div className="pt-8 border-t-2 border-dashed border-[#2B2350]/20 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#6B6590] gap-4">
            <div className="flex items-center space-x-2">
              <span>Candidate Signature:</span>
              <span className="border-b-2 border-[#2B2350] w-40 inline-block" />
            </div>

            <div className="flex items-center space-x-4">
              <span>DATE: {new Date().toISOString().slice(0, 10)}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                {(['A', 'B', 'C', 'D'] as const).map((b) => (
                  <span key={b} className="w-4 h-4 rounded-full border border-[#2B2350] text-[9px] flex items-center justify-center font-mono font-bold bg-white">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Perforated Page Footer */}
      <footer className="max-w-[1300px] mx-auto px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#6B6590] gap-2 border-t-2 border-dashed border-[#2B2350]/20 mt-8">
        <span>© 2026 AssessIQ Inc. Candidate Assessment Protocol.</span>
        <div className="flex items-center space-x-4">
          <Link to="/auth" className="hover:text-[#6C4DFF]">All Portals</Link>
          <span>•</span>
          <Link to="/" className="hover:text-[#6C4DFF]">Platform Home</Link>
          <span>•</span>
          <span className="text-[#10B981] font-bold">100% AUTOSAVE CONSENSUS</span>
        </div>
      </footer>
    </div>
  );
};

export default StudentLanding;
