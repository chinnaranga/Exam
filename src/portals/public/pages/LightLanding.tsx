import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shared/components/ui/button';
import BrandLogo from '@/shared/components/BrandLogo';
import {
  Sparkles,
  ShieldCheck,
  Building2,
  GraduationCap,
  Users,
  Brain,
  Video,
  Lock,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe,
  Layers,
  Server,
  Activity,
  Cpu,
  Workflow,
  BarChart3,
  Award,
  BookOpen,
  FileCheck,
  UserCheck,
  Zap,
  Eye,
  ShieldAlert,
  Play,
  Check,
  X,
  Star,
  HelpCircle,
  Mail,
  Clock,
  ExternalLink,
  Laptop,
  FileText,
  AlertTriangle,
  Radio,
  Sliders,
  Database,
  Key,
} from 'lucide-react';

export const LightLanding: React.FC = () => {
  // Interactive UI states
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'proctoring' | 'analytics' | 'authoring'>('proctoring');
  const [isAnnualPricing, setIsAnnualPricing] = useState<boolean>(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [demoEmail, setDemoEmail] = useState<string>('');
  const [demoSubmitted, setDemoSubmitted] = useState<boolean>(false);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoEmail.trim()) {
      setDemoSubmitted(true);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1E293B] selection:bg-[#EFF6FF] selection:text-[#2563EB] antialiased">
      {/* ================= SECTION 1: STICKY TRANSLUCENT LIGHT NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-6 lg:px-12 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <BrandLogo size="md" variant="light" />
          </Link>

          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-[#475569]">
            <Link
              to="/proctoring"
              className="flex items-center space-x-1.5 text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              <Radio className="w-3 h-3 text-[#2563EB] animate-pulse" />
              <span>Proctoring</span>
            </Link>
            <a href="#portals" className="hover:text-[#2563EB] transition-colors">
              Portals
            </a>
            <a href="#capabilities" className="hover:text-[#2563EB] transition-colors">
              Capabilities
            </a>
            <a href="#workflow" className="hover:text-[#2563EB] transition-colors">
              Workflow
            </a>
            <a href="#security" className="hover:text-[#2563EB] transition-colors">
              Security
            </a>
            <a href="#pricing" className="hover:text-[#2563EB] transition-colors">
              Pricing
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/auth"
            className="text-xs font-semibold text-[#475569] hover:text-[#2563EB] transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <a href="#demo">
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all">
              Book Demo
            </Button>
          </a>
        </div>
      </header>

      <main>
        {/* ================= SECTION 2: LIGHT HERO WITH DASHBOARD & FLOATING CARDS ================= */}
        <section className="relative pt-16 pb-20 px-6 sm:px-12 text-center overflow-hidden bg-gradient-to-b from-[#EFF6FF]/60 via-[#F8FAFC] to-white border-b border-[#E2E8F0]">
          {/* Subtle blue gradient glow behind hero */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-b from-blue-200/40 via-blue-100/20 to-transparent blur-[90px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto space-y-7 relative z-10">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-mono font-semibold border border-[#BFDBFE] shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Enterprise AI Assessment Platform</span>
            </motion.div>

            {/* Main Headline (64-72px, bold, tight tracking) */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold text-[#1E293B] tracking-tight leading-[1.08]"
            >
              Intelligent Assessments.{' '}
              <span className="text-[#2563EB]">Trusted Outcomes.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#475569] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
            >
              AssessIQ is the mission-critical Enterprise AI Assessment Operating System engineered for Universities,
              Government Examination Boards, Healthcare Licensure, and Global Corporate Enterprise.
            </motion.p>

            {/* Two CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center items-center gap-4 pt-2"
            >
              <a href="#demo">
                <Button
                  size="lg"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm px-7 py-6 rounded-xl shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_22px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-0.5"
                >
                  Book Enterprise Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="#showcase">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] font-semibold text-sm px-7 py-6 rounded-xl transition-all shadow-xs"
                >
                  <Play className="w-4 h-4 mr-2 fill-[#2563EB] text-[#2563EB]" />
                  Watch 2-min Tour
                </Button>
              </a>
            </motion.div>

            {/* Product Dashboard Mockup Container with Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 relative max-w-4xl mx-auto"
            >
              {/* Floating Mini-Card 1: Gaze anomaly detected (Top-Right) */}
              <div className="hidden md:flex absolute -top-5 -right-6 z-20 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-xl p-3.5 shadow-[0_12px_30px_rgba(37,99,235,0.12)] items-center space-x-3 text-left animate-bounce duration-1000">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#F59E0B] border border-amber-200 flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#1E293B] flex items-center space-x-1.5">
                    <span>Gaze anomaly detected</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  </div>
                  <div className="text-[10px] text-[#64748B] font-mono">
                    Candidate #4892 · 3.2s deviation · Auto-logged
                  </div>
                </div>
              </div>

              {/* Floating Mini-Card 2: Exam auto-graded (Bottom-Left) */}
              <div className="hidden md:flex absolute -bottom-5 -left-6 z-20 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-xl p-3.5 shadow-[0_12px_30px_rgba(16,185,129,0.12)] items-center space-x-3 text-left">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#10B981] border border-emerald-200 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#1E293B] flex items-center space-x-1.5">
                    <span>Exam auto-graded</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  </div>
                  <div className="text-[10px] text-[#64748B] font-mono">
                    CS-401 Final · 94.5% Score · IRT Verified
                  </div>
                </div>
              </div>

              {/* Central Light Dashboard Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_16px_40px_rgba(37,99,235,0.08)] p-6 sm:p-7 text-left">
                {/* Header with macOS style dots and health pill */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-[#64748B] font-semibold text-xs ml-2 font-mono">
                      AssessIQ Executive Control Plane
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200 text-[11px] font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    <span>SYSTEM ONLINE • 100% HEALTHY</span>
                  </div>
                </div>

                {/* 3 Live Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <div className="text-[10px] uppercase font-mono font-bold text-[#64748B]">
                      Active Live Candidates
                    </div>
                    <div className="text-2xl font-extrabold text-[#1E293B] font-mono">14,290</div>
                    <div className="text-[11px] text-[#10B981] font-semibold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      <span>Wasm Sentinel Active</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <div className="text-[10px] uppercase font-mono font-bold text-[#64748B]">
                      IRT Calibrated Items
                    </div>
                    <div className="text-2xl font-extrabold text-[#2563EB] font-mono">1.2M Questions</div>
                    <div className="text-[11px] text-[#2563EB] font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-[#2563EB]" />
                      <span>Bloom's Taxonomy Verified</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <div className="text-[10px] uppercase font-mono font-bold text-[#64748B]">
                      Multi-Tenant Isolation
                    </div>
                    <div className="text-2xl font-extrabold text-[#1E293B] font-mono">SOC2 RLS Enforced</div>
                    <div className="text-[11px] text-[#10B981] font-semibold flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Zero Leak Guarantee</span>
                    </div>
                  </div>
                </div>

                {/* Micro Real-time Status Strip */}
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] font-mono">
                  <div className="flex items-center space-x-3">
                    <span className="text-[#2563EB] font-bold">[CLUSTER_STATUS]</span>
                    <span>Edge Latency: 16ms</span>
                    <span>•</span>
                    <span>IndexedDB Sync: 100%</span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">Auto-refreshed live via WebSocket</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= SECTION 3: TRUST BAR & 3 ANIMATED COUNTERS ================= */}
        <section className="py-14 px-6 border-b border-[#E2E8F0] bg-white text-center">
          <div className="max-w-6xl mx-auto space-y-8">
            <p className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
              Trusted by leading universities and certification boards
            </p>

            {/* Institution Logos Row */}
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 font-mono font-bold text-xs sm:text-sm text-[#475569]">
              <span className="hover:text-[#2563EB] transition-colors cursor-default flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                <span>STANFORD MEDICINE</span>
              </span>
              <span className="hover:text-[#2563EB] transition-colors cursor-default flex items-center space-x-2">
                <Brain className="w-4 h-4 text-[#2563EB]" />
                <span>MIT CS & AI LAB</span>
              </span>
              <span className="hover:text-[#2563EB] transition-colors cursor-default flex items-center space-x-2">
                <Award className="w-4 h-4 text-[#2563EB]" />
                <span>PEARSON CERTIFICATION</span>
              </span>
              <span className="hover:text-[#2563EB] transition-colors cursor-default flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#2563EB]" />
                <span>GOVERNMENT EXAM BOARD</span>
              </span>
              <span className="hover:text-[#2563EB] transition-colors cursor-default flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-[#2563EB]" />
                <span>AWS LEARNING PARTNERS</span>
              </span>
            </div>

            {/* 3 Animated Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E2E8F0]">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] font-mono">4.8M+</div>
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Candidates Assessed</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] font-mono">980,000+</div>
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Exams Delivered</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#10B981] font-mono">99.99%</div>
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Platform Uptime SLA</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4: PROBLEM / SOLUTION BEFORE & AFTER ================= */}
        <section className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
                <Zap className="w-3.5 h-3.5" />
                <span>The Modern Paradigm</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
                Eliminating Legacy Assessment Bottlenecks
              </h2>
              <p className="text-sm text-[#475569] max-w-2xl mx-auto">
                Traditional exam systems compromise on security, drag down faculty efficiency, and produce noisy psychometric outcomes.
              </p>
            </div>

            {/* 3 Problem / Solution Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Cheating */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all">
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 space-y-1">
                    <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase font-mono">
                      <X className="w-3.5 h-3.5" />
                      <span>Legacy Pain: Cheating</span>
                    </div>
                    <p className="text-xs text-rose-900 leading-relaxed">
                      Hours of manual video review, hardware video splitters, and browser shortcuts bypass basic lockouts.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1">
                    <div className="flex items-center space-x-2 text-[#10B981] text-xs font-bold uppercase font-mono">
                      <Check className="w-3.5 h-3.5" />
                      <span>AssessIQ Solution</span>
                    </div>
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                      Client-side Wasm Sentinel neural network detects multi-face anomalies, gaze shifts, and DevTools without cloud streaming.
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-[#64748B] font-mono border-t border-[#E2E8F0] pt-3">
                  Result: 99.4% reduction in invigilator fatigue
                </div>
              </div>

              {/* Card 2: Slow Grading */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all">
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 space-y-1">
                    <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase font-mono">
                      <X className="w-3.5 h-3.5" />
                      <span>Legacy Pain: Slow Grading</span>
                    </div>
                    <p className="text-xs text-rose-900 leading-relaxed">
                      Weeks spent hand-grading essays leads to subjective discrepancy, grader burnout, and delayed results.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1">
                    <div className="flex items-center space-x-2 text-[#10B981] text-xs font-bold uppercase font-mono">
                      <Check className="w-3.5 h-3.5" />
                      <span>AssessIQ Solution</span>
                    </div>
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                      AI Essay Rubric Engine evaluates semantic coherence, evidence strength, and rubrics in under 2 seconds.
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-[#64748B] font-mono border-t border-[#E2E8F0] pt-3">
                  Result: 14 days saved per exam cycle
                </div>
              </div>

              {/* Card 3: Outdated Items */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all">
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 space-y-1">
                    <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase font-mono">
                      <X className="w-3.5 h-3.5" />
                      <span>Legacy Pain: Leaked Items</span>
                    </div>
                    <p className="text-xs text-rose-900 leading-relaxed">
                      Question pools leak online quickly. Item difficulty is estimated subjectively without psychometric proof.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1">
                    <div className="flex items-center space-x-2 text-[#10B981] text-xs font-bold uppercase font-mono">
                      <Check className="w-3.5 h-3.5" />
                      <span>AssessIQ Solution</span>
                    </div>
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                      Generative AI authoring with 3PL Item Response Theory (IRT) parameter calibration and variable permutation.
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-[#64748B] font-mono border-t border-[#E2E8F0] pt-3">
                  Result: 100% leak-proof randomized blueprints
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 5: ROLE PORTALS (4 CARDS WITH LIGHT OUTLINED BUTTONS) ================= */}
        <section id="portals" className="py-20 px-6 sm:px-12 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
                <Workflow className="w-3.5 h-3.5" />
                <span>AssessIQ Multi-Portal Ecosystem</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
                Dedicated Role Gateways
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] max-w-2xl mx-auto">
                Every stakeholder receives a tailored enterprise workspace designed specifically for their operational responsibilities.
              </p>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Portal 1: Student */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#2563EB] hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#1E293B]">Student Portal</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Zero-distraction test runner, offline IndexedDB autosave, score transcripts, and digital badges.
                  </p>
                </div>
                <Link to="/student" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full bg-white border border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] font-semibold text-xs py-2 rounded-xl transition-all"
                  >
                    Access Portal →
                  </Button>
                </Link>
              </div>

              {/* Portal 2: Faculty */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#7C3AED] hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)] transition-all">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#1E293B]">Faculty Portal</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    AI item authoring, IRT difficulty calibration, exam blueprinting, and automated essay grading rubrics.
                  </p>
                </div>
                <Link to="/faculty" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full bg-white border border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50 font-semibold text-xs py-2 rounded-xl transition-all"
                  >
                    Access Portal →
                  </Button>
                </Link>
              </div>

              {/* Portal 3: Invigilator */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#F59E0B] hover:shadow-[0_8px_30px_rgba(245,158,11,0.08)] transition-all">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#1E293B]">Invigilator Portal</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Real-time video feeds, Wasm computer vision gaze tracking, instant whisper audio, and anomaly alerts.
                  </p>
                </div>
                <Link to="/invigilator" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full bg-white border border-[#D97706] text-[#D97706] hover:bg-amber-50 font-semibold text-xs py-2 rounded-xl transition-all"
                  >
                    Access Portal →
                  </Button>
                </Link>
              </div>

              {/* Portal 4: Super Admin */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#10B981] hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] transition-all">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center">
                    <Server className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#1E293B]">Super Admin</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Multi-tenant infrastructure control plane, RLS isolation policies, audit logs, and global risk engine.
                  </p>
                </div>
                <Link to="/admin" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full bg-white border border-[#059669] text-[#059669] hover:bg-emerald-50 font-semibold text-xs py-2 rounded-xl transition-all"
                  >
                    Access Portal →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 6: CORE CAPABILITIES (BENTO GRID) ================= */}
        <section id="capabilities" className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
                AssessIQ Operating System Architecture
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] max-w-2xl mx-auto">
                Built on a distributed cloud architecture for maximum reliability, military-grade security, and scalability.
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tile 1 (Large - Spans 2 cols on md) */}
              <div className="md:col-span-2 p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1E293B]">Generative AI Item Bank & IRT Calibration</h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    AI-generated question stems precisely mapped to Bloom's taxonomy (Remembering to Evaluating).
                    Automated 3-parameter Item Response Theory (IRT) difficulty calibration ($\theta$-scores) prevents question leakage through dynamic numerical swaps.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between text-xs font-mono text-[#2563EB]">
                  <span>Item Discrimination: α = 1.42</span>
                  <span>Difficulty: β = +0.85</span>
                  <span>Guessing: γ = 0.05</span>
                </div>
              </div>

              {/* Tile 2 (Standard) */}
              <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1E293B]">Wasm Vision Proctoring</h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    Client-side WebAssembly computer vision evaluates eye gaze direction, multiple faces, window focus, and audio spectrum on-device with zero privacy leakage.
                  </p>
                </div>
                <div className="inline-flex items-center space-x-1.5 text-xs text-[#10B981] font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>On-Device Edge Neural Net</span>
                </div>
              </div>

              {/* Tile 3 (Standard) */}
              <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1E293B]">Enterprise RLS Isolation</h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    PostgreSQL Row-Level Security ensures strict multi-tenant data boundaries across organizations with zero possibility of cross-institutional leaks.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-[#64748B]">
                  Enforced via cryptographically signed JWT tenant claims
                </div>
              </div>

              {/* Tile 4 (Standard) */}
              <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1E293B]">AI Essay Grading</h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    Instant semantic evaluation against faculty rubrics with detailed explanatory feedback, citation verification, and argumentation scoring.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-[#2563EB] font-semibold">
                  Sub-2-second latency per 1,500-word essay
                </div>
              </div>

              {/* Tile 5 (Standard) */}
              <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1E293B]">Offline PWA Autosave</h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    Encrypted IndexedDB transaction queue ensures candidates never lose test progress during campus Wi-Fi drops, auto-syncing upon reconnection.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-[#10B981] font-semibold">
                  100% data preservation guarantee
                </div>
              </div>

              {/* Tile 6 (Standard) */}
              <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1E293B]">Digital Badges & Certs</h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    Verifiable Open Badges 3.0 and cryptographically signed PDF transcripts issued automatically upon exam completion and faculty sign-off.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-[#7C3AED] font-semibold">
                  Tamper-evident verification hash
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 7: INTERACTIVE PRODUCT SHOWCASE ================= */}
        <section id="showcase" className="py-20 px-6 sm:px-12 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
                <Laptop className="w-3.5 h-3.5" />
                <span>Interactive Platform Preview</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
                Designed for Mission-Critical Reliability
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
                Explore the intuitive, high-speed interface engineered for candidate comfort and institutional oversight.
              </p>
            </div>

            {/* Showcase Tab Selector */}
            <div className="flex justify-center">
              <div className="p-1 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] inline-flex space-x-1">
                <button
                  onClick={() => setActiveShowcaseTab('proctoring')}
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                    activeShowcaseTab === 'proctoring'
                      ? 'bg-white text-[#2563EB] shadow-xs border border-[#E2E8F0]'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Proctoring Sentinel</span>
                </button>
                <button
                  onClick={() => setActiveShowcaseTab('analytics')}
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                    activeShowcaseTab === 'analytics'
                      ? 'bg-white text-[#2563EB] shadow-xs border border-[#E2E8F0]'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Psychometric Analytics</span>
                </button>
                <button
                  onClick={() => setActiveShowcaseTab('authoring')}
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                    activeShowcaseTab === 'authoring'
                      ? 'bg-white text-[#2563EB] shadow-xs border border-[#E2E8F0]'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>AI Item Authoring</span>
                </button>
              </div>
            </div>

            {/* Showcase Light UI Mockup Window */}
            <div className="rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_16px_40px_rgba(37,99,235,0.08)] p-6 sm:p-8">
              {activeShowcaseTab === 'proctoring' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                    <div className="flex items-center space-x-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                      <span className="text-[#1E293B] font-bold text-sm">
                        Candidate #89421 — Advanced Operating Systems (Live Sentinel Stream)
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#10B981] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      TRUST CONFIDENCE: 99.2%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <div className="text-[11px] font-mono text-[#64748B] uppercase">Gaze Direction</div>
                      <div className="text-base font-bold text-[#1E293B]">Centered on Viewport</div>
                      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#10B981] h-full w-[99.2%]" />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <div className="text-[11px] font-mono text-[#64748B] uppercase">Acoustic Spectrum</div>
                      <div className="text-base font-bold text-[#1E293B]">18 dB (Compliant)</div>
                      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#2563EB] h-full w-[24%]" />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <div className="text-[11px] font-mono text-[#64748B] uppercase">Focus Lock</div>
                      <div className="text-base font-bold text-[#1E293B]">0 Window Blur Events</div>
                      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#10B981] h-full w-[100%]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-mono text-[#1E40AF] flex items-center justify-between">
                    <span>Edge Wasm Sentinel Status: Active</span>
                    <span>Zero video transmission to cloud · 100% Student Privacy Preserved</span>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                    <span className="text-[#1E293B] font-bold text-sm">
                      Psychometric Cohort Analysis — Final Licensure Exam (N = 1,420)
                    </span>
                    <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                      RELIABILITY: α = 0.94
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="text-[11px] font-mono text-[#64748B] uppercase">Mean Score</div>
                      <div className="text-2xl font-extrabold text-[#1E293B] font-mono">84.2%</div>
                      <div className="text-[11px] text-[#10B981] font-semibold mt-1">Normal Distribution</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="text-[11px] font-mono text-[#64748B] uppercase">Std. Deviation</div>
                      <div className="text-2xl font-extrabold text-[#2563EB] font-mono">σ = 6.4</div>
                      <div className="text-[11px] text-[#2563EB] font-semibold mt-1">High Separation Power</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="text-[11px] font-mono text-[#64748B] uppercase">Flagged Anomaly Rate</div>
                      <div className="text-2xl font-extrabold text-[#10B981] font-mono">0.42%</div>
                      <div className="text-[11px] text-[#10B981] font-semibold mt-1">Fully Resolved</div>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'authoring' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                    <span className="text-[#1E293B] font-bold text-sm">
                      AI Question Authoring Studio — Bloom's Taxonomy: Analyzing
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
                      IRT DIFFICULTY: θ = +1.15
                    </span>
                  </div>

                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                    <div className="text-xs font-mono text-[#64748B]">Generated Item Stem:</div>
                    <p className="text-sm font-medium text-[#1E293B] leading-relaxed">
                      "Given a distributed Byzantine Fault Tolerant state machine with N = 3f + 1 nodes, calculate the minimum threshold of consecutive timeouts required to initiate a view change while ensuring safety across an asynchronous partition."
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[#475569]">
                        A. f + 1 rounds
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold">
                        B. 2f + 1 rounds (Correct Key)
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[#475569]">
                        C. 3f rounds
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[#475569]">
                        D. FLP impossibility forbids view changes
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= SECTION 8: 4-STEP WORKFLOW TIMELINE ================= */}
        <section id="workflow" className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-14">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
                <Workflow className="w-3.5 h-3.5" />
                <span>Seamless Assessment Lifecycle</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
                End-to-End Enterprise Assessment Workflow
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
                From organizational provisioning to automated AI grading and digital credential issuance.
              </p>
            </div>

            {/* Horizontal Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 relative">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-sm shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
                    01
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase">Provisioning</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1E293B]">Org & Campus Setup</h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    Configure institutional hierarchy, departments, SSO/SAML integration, and student rosters via CSV or LMS sync.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 relative">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-sm shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
                    02
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase">Authoring</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1E293B]">AI Item Generation</h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    Generate high-discrimination question items aligned with Bloom's taxonomy and calibrated by IRT psychometrics.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 relative">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-sm shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
                    03
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase">Execution</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1E293B]">Live Candidate Test</h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    Candidates complete assessments in zero-distraction lock with offline autosave and client-side Wasm proctoring.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 relative">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center font-mono font-bold text-sm shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                    04
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase">Outcomes</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1E293B]">AI Grading & Certs</h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    Instant AI rubric grading, psychometric cohort normalization, and cryptographically signed verifiable digital credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 9: SECURITY AND COMPLIANCE ================= */}
        <section id="security" className="py-20 px-6 sm:px-12 bg-[#EFF6FF] border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white text-[#2563EB] text-xs font-mono font-bold uppercase border border-[#BFDBFE]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Zero-Trust Enterprise Compliance</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
                Enterprise Security & Certifications
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
                Built to exceed the stringent security and privacy regulations of government, healthcare, and higher education.
              </p>
            </div>

            {/* Badge Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#1E293B]">SOC 2 Type II Certified</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Independently audited operational security, availability, and confidential data processing practices.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#1E293B]">ISO 27001 Certified</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  International standard for information security management systems (ISMS) across all cloud services.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#1E293B]">GDPR & FERPA Compliant</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Strict student biometric data protections. All video analysis executes client-side; zero video storage.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#1E293B]">Postgres Row-Level Security</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Cryptographically isolated tenant databases guarantee zero cross-institutional data leakage.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#1E293B]">AES-256 & TLS 1.3</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  End-to-end cryptographic encryption for question banks, candidate answers, and test telemetry in transit and at rest.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#1E293B]">Immutable Audit Logging</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Every user action, score modification, and proctoring flag is cryptographically signed and stored immutably.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 10: TESTIMONIALS ================= */}
        <section className="py-20 px-6 sm:px-12 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
                Trusted by Academic & Licensure Leaders
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
                Read how institutions worldwide scale secure, high-stakes assessments with AssessIQ.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#475569] italic leading-relaxed">
                    "AssessIQ transformed our medical board certification exams. The Wasm edge proctoring eliminated the privacy concerns our candidates had with invasive video recording."
                  </p>
                </div>
                <div className="flex items-center space-x-3 pt-3 border-t border-[#E2E8F0]">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-xs">
                    EV
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1E293B]">Dr. Elena Vance</h4>
                    <p className="text-[11px] text-[#64748B]">Dean of Academic Assessment, Eastern Polytechnic</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#475569] italic leading-relaxed">
                    "The IRT difficulty calibration alone saved our psychometrics team hundreds of hours. Question leakage is no longer an existential threat to our high-stakes licensure."
                  </p>
                </div>
                <div className="flex items-center space-x-3 pt-3 border-t border-[#E2E8F0]">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-xs">
                    MT
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1E293B]">Marcus Thorne</h4>
                    <p className="text-[11px] text-[#64748B]">Chief Psychometrician, National Licensure Board</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#475569] italic leading-relaxed">
                    "Our campus Wi-Fi went down during midterms, and the offline IndexedDB autosave engine performed flawlessly. Zero students lost test progress. An extraordinary product."
                  </p>
                </div>
                <div className="flex items-center space-x-3 pt-3 border-t border-[#E2E8F0]">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center font-bold text-xs">
                    SJ
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1E293B]">Sarah Jenkins</h4>
                    <p className="text-[11px] text-[#64748B]">Head of Engineering Education, CloudScale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 11: PRICING WITH MONTHLY/ANNUAL TOGGLE ================= */}
        <section id="pricing" className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
                <span>Transparent Enterprise Pricing</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
                Predictable Plans for Every Scale
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] max-w-lg mx-auto">
                Simple, transparent tiers designed for departments, campus-wide rollouts, and national exam boards.
              </p>

              {/* Monthly / Annual Toggle */}
              <div className="pt-2 flex items-center justify-center space-x-3">
                <span className={`text-xs font-semibold ${!isAnnualPricing ? 'text-[#1E293B]' : 'text-[#64748B]'}`}>
                  Monthly Billed
                </span>
                <button
                  type="button"
                  onClick={() => setIsAnnualPricing(!isAnnualPricing)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                    isAnnualPricing ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                      isAnnualPricing ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
                <div className="flex items-center space-x-1.5">
                  <span className={`text-xs font-semibold ${isAnnualPricing ? 'text-[#1E293B]' : 'text-[#64748B]'}`}>
                    Annual Billed
                  </span>
                  <span className="text-[10px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    SAVE 20%
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Tier 1: Starter */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-[#1E293B]">Department Starter</h3>
                    <p className="text-xs text-[#64748B] mt-1">Ideal for pilot programs and single academic departments.</p>
                  </div>
                  <div className="font-mono">
                    <span className="text-3xl font-extrabold text-[#1E293B]">
                      {isAnnualPricing ? '$490' : '$590'}
                    </span>
                    <span className="text-xs text-[#64748B]"> / month</span>
                  </div>
                  <ul className="text-xs text-[#475569] space-y-2.5 pt-2 border-t border-[#E2E8F0]">
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Up to 1,500 candidates / month</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Wasm edge computer vision sentinel</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>AI item authoring & rubric grading</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Encrypted IndexedDB autosave</span>
                    </li>
                  </ul>
                </div>
                <a href="#demo">
                  <Button
                    variant="outline"
                    className="w-full bg-white border border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] font-semibold text-xs py-2.5 rounded-xl transition-all"
                  >
                    Start Starter Pilot
                  </Button>
                </a>
              </div>

              {/* Tier 2: Growth (Most Popular) */}
              <div className="bg-white rounded-2xl border-2 border-[#2563EB] p-7 shadow-[0_12px_35px_rgba(37,99,235,0.12)] flex flex-col justify-between space-y-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full shadow-xs">
                  Most Popular
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-[#1E293B]">Campus Growth</h3>
                    <p className="text-xs text-[#64748B] mt-1">For multi-department faculties and regional testing organizations.</p>
                  </div>
                  <div className="font-mono">
                    <span className="text-3xl font-extrabold text-[#2563EB]">
                      {isAnnualPricing ? '$1,290' : '$1,590'}
                    </span>
                    <span className="text-xs text-[#64748B]"> / month</span>
                  </div>
                  <ul className="text-xs text-[#475569] space-y-2.5 pt-2 border-t border-[#E2E8F0]">
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Up to 10,000 candidates / month</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Real-time multi-candidate invigilator grid</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>3PL IRT Item psychometric calibration</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>SAML/SSO directory integration (Canvas/Moodle)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Open Badges 3.0 & signed certificates</span>
                    </li>
                  </ul>
                </div>
                <a href="#demo">
                  <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs py-2.5 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all">
                    Deploy Campus Growth
                  </Button>
                </a>
              </div>

              {/* Tier 3: Enterprise */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-[#1E293B]">Institutional Enterprise</h3>
                    <p className="text-xs text-[#64748B] mt-1">For national exam boards, health ministries, and full universities.</p>
                  </div>
                  <div className="font-mono">
                    <span className="text-3xl font-extrabold text-[#1E293B]">Custom</span>
                    <span className="text-xs text-[#64748B]"> / volume scale</span>
                  </div>
                  <ul className="text-xs text-[#475569] space-y-2.5 pt-2 border-t border-[#E2E8F0]">
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Unlimited candidates & exams</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Dedicated Postgres RLS tenant database</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Custom coding compiler runtimes</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>99.99% SLA uptime contract</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>24/7 dedicated psychometric & tech support</span>
                    </li>
                  </ul>
                </div>
                <a href="#demo">
                  <Button
                    variant="outline"
                    className="w-full bg-white border border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] font-semibold text-xs py-2.5 rounded-xl transition-all"
                  >
                    Contact Enterprise Sales
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 12: FAQ ACCORDION (6 QUESTIONS) ================= */}
        <section className="py-20 px-6 sm:px-12 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                Everything you need to know about security, deployment, and psychometric accuracy.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'How does Wasm computer vision proctoring work without invading student privacy?',
                  a: 'AssessIQ compiles lightweight neural networks into WebAssembly, running directly inside the student’s web browser. Facial features, eye gaze vectors, and acoustic levels are evaluated entirely in client RAM. No raw video or audio streams are ever recorded, uploaded, or stored in the cloud, guaranteeing 100% FERPA and GDPR compliance.',
                },
                {
                  q: 'Can AssessIQ function in low-bandwidth or offline environments?',
                  a: 'Yes. The student test runner is an offline-capable Progressive Web Application (PWA). Every question response and keystroke is encrypted and written to local IndexedDB storage. If campus Wi-Fi drops, the candidate continues taking the exam with zero disruption, and answers sync automatically once connectivity restores.',
                },
                {
                  q: 'What is IRT calibration and how does AssessIQ verify question difficulty?',
                  a: 'AssessIQ employs 3-Parameter Logistic Item Response Theory (3PL IRT) to mathematically measure question difficulty (β), discrimination capability (α), and guessing likelihood (γ). Questions are continuously calibrated based on empirical candidate response curves, ensuring rigorous, fair assessments.',
                },
                {
                  q: 'How does multi-tenant isolation protect our institution’s data?',
                  a: 'We leverage PostgreSQL Row-Level Security (RLS) and cryptographic tenant ID claims inside JSON Web Tokens. Each query is strictly isolated at the database engine level, preventing any organization from viewing another tenant’s candidates, questions, or score transcripts.',
                },
                {
                  q: 'Can AssessIQ integrate with our existing Canvas, Blackboard, or Moodle LMS?',
                  a: 'Yes. AssessIQ provides full LTI 1.3 Advantage integration, supporting single sign-on (SSO), roster synchronization, automated exam scheduling, and immediate gradebook writeback with all major Learning Management Systems.',
                },
                {
                  q: 'What certifications and compliance standards does AssessIQ maintain?',
                  a: 'AssessIQ is independently audited and compliant with SOC 2 Type II, ISO 27001, GDPR, and FERPA standards. All data at rest is encrypted with AES-256, and data in transit uses TLS 1.3.',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm text-[#1E293B] hover:text-[#2563EB] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#64748B] transition-transform duration-200 shrink-0 ml-4 ${
                        openFaqIndex === index ? 'rotate-180 text-[#2563EB]' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 text-xs text-[#475569] leading-relaxed border-t border-[#E2E8F0] pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= SECTION 13: FINAL CTA (LIGHT BLUE GRADIENT) ================= */}
        <section id="demo" className="py-20 px-6 sm:px-12 bg-white">
          <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE]/40 to-[#F8FAFC] border border-[#BFDBFE] p-10 sm:p-16 text-center space-y-6 shadow-[0_16px_40px_rgba(37,99,235,0.06)]">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white text-[#2563EB] text-xs font-mono font-bold uppercase border border-[#BFDBFE]">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Modernize Your Exams Today</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight">
              Ready to modernize your assessments?
            </h2>

            <p className="text-[#475569] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Join 100+ leading universities, government exam boards, and licensure institutions. Launch your first secure exam pilot in under 48 hours.
            </p>

            {/* Email Input Form */}
            {demoSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold max-w-md mx-auto flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Thank you! Our institutional onboarding team will contact you within 2 business hours.</span>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your institutional email..."
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  className="bg-white border border-[#CBD5E1] text-[#1E293B] text-xs rounded-xl px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] flex-1 shadow-xs"
                />
                <Button
                  type="submit"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all shrink-0"
                >
                  Book Demo
                </Button>
              </form>
            )}

            <div className="pt-2 text-[11px] text-[#64748B] flex items-center justify-center space-x-4">
              <span>No credit card required</span>
              <span>•</span>
              <span>SOC2 Type II Certified</span>
              <span>•</span>
              <span>Dedicated Onboarding Manager</span>
            </div>
          </div>
        </section>
      </main>

      {/* ================= SECTION 14: LIGHT FOOTER ================= */}
      <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0] py-16 px-6 sm:px-12 text-xs text-[#64748B] font-sans">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Col 1: Brand */}
            <div className="col-span-2 space-y-4">
              <BrandLogo size="md" variant="light" />
              <p className="text-xs text-[#475569] leading-relaxed max-w-sm">
                AssessIQ is the mission-critical Enterprise AI Assessment Operating System engineered for Universities,
                Government Examination Boards, Healthcare Licensure, and Global Enterprise.
              </p>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-[#10B981] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>All Systems Operational • 99.99% SLA</span>
              </div>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-3">
              <h5 className="font-mono text-xs font-bold uppercase text-[#1E293B] tracking-wider">Product</h5>
              <ul className="space-y-2 text-xs text-[#475569]">
                <li>
                  <Link to="/proctoring" className="hover:text-[#2563EB] transition-colors">
                    Wasm Vision Proctoring
                  </Link>
                </li>
                <li>
                  <a href="#capabilities" className="hover:text-[#2563EB] transition-colors">
                    AI Item Banking
                  </a>
                </li>
                <li>
                  <a href="#capabilities" className="hover:text-[#2563EB] transition-colors">
                    IRT Psychometrics
                  </a>
                </li>
                <li>
                  <a href="#capabilities" className="hover:text-[#2563EB] transition-colors">
                    Essay Rubric Grading
                  </a>
                </li>
                <li>
                  <Link to="/coding" className="hover:text-[#2563EB] transition-colors">
                    Coding Sandbox
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Role Portals */}
            <div className="space-y-3">
              <h5 className="font-mono text-xs font-bold uppercase text-[#1E293B] tracking-wider">Portals</h5>
              <ul className="space-y-2 text-xs text-[#475569]">
                <li>
                  <Link to="/student" className="hover:text-[#2563EB] transition-colors">
                    Student Portal
                  </Link>
                </li>
                <li>
                  <Link to="/faculty" className="hover:text-[#2563EB] transition-colors">
                    Faculty Portal
                  </Link>
                </li>
                <li>
                  <Link to="/invigilator" className="hover:text-[#2563EB] transition-colors">
                    Invigilator Portal
                  </Link>
                </li>
                <li>
                  <Link to="/organization" className="hover:text-[#2563EB] transition-colors">
                    Institutional Org Admin
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="hover:text-[#2563EB] transition-colors">
                    Super Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Trust & Compliance */}
            <div className="space-y-3">
              <h5 className="font-mono text-xs font-bold uppercase text-[#1E293B] tracking-wider">Trust & Legal</h5>
              <ul className="space-y-2 text-xs text-[#475569]">
                <li>
                  <a href="#security" className="hover:text-[#2563EB] transition-colors">
                    SOC 2 Type II
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:text-[#2563EB] transition-colors">
                    ISO 27001 Certified
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:text-[#2563EB] transition-colors">
                    GDPR & FERPA Policy
                  </a>
                </li>
                <li>
                  <span className="hover:text-[#2563EB] transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="hover:text-[#2563EB] transition-colors cursor-pointer">
                    Terms of Service
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#64748B]">
            <p>© 2026 AssessIQ Inc. All rights reserved. SOC2 & ISO 27001 Certified.</p>
            <div className="flex space-x-6 text-[#64748B]">
              <span className="hover:text-[#2563EB] cursor-pointer">Twitter / X</span>
              <span className="hover:text-[#2563EB] cursor-pointer">LinkedIn</span>
              <span className="hover:text-[#2563EB] cursor-pointer">GitHub</span>
              <span className="hover:text-[#2563EB] cursor-pointer">Security Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LightLanding;
