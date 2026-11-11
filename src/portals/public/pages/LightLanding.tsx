import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import BrandLogo from '@/shared/components/BrandLogo';
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Users,
  Brain,
  Video,
  Lock,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Globe,
  Layers,
  Sparkles,
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
  Terminal,
  Eye,
  ShieldAlert,
  Code2,
  Radio,
  Play,
  Check,
  ExternalLink,
} from 'lucide-react';

export const LightLanding: React.FC = () => {
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'sentinel' | 'ai' | 'security'>('sentinel');
  const [activeRoleFilter, setActiveRoleFilter] = useState<'all' | 'candidates' | 'educators' | 'admins'>('all');

  return (
    <div className="min-h-screen bg-[#030712] font-sans text-slate-100 selection:bg-blue-600/30 selection:text-blue-200 relative overflow-x-hidden">
      {/* Background Ambient Glows & Grid Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Subtle radial spotlight glows */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[-100px] w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-[70%] right-[-100px] w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* ================= SECTION 1: ENTERPRISE NAVIGATION HEADER ================= */}
        <header className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/[0.08] px-6 lg:px-12 py-3.5 flex items-center justify-between transition-all">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <BrandLogo size="md" variant="dark" />
            </Link>

            <nav className="hidden lg:flex items-center space-x-6 text-xs font-medium text-slate-300">
              <Link
                to="/proctoring"
                className="flex items-center space-x-1.5 text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
                <span>AI Proctoring Suite</span>
              </Link>
              <Link
                to="/operations"
                className="flex items-center space-x-1.5 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
              >
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>Operations Center</span>
              </Link>
              <a href="#ecosystem" className="hover:text-white transition-colors">
                Role Gateways
              </a>
              <a href="#capabilities" className="hover:text-white transition-colors">
                OS Architecture
              </a>
              <a href="#workflow" className="hover:text-white transition-colors">
                Workflow
              </a>
              <a href="#telemetry" className="hover:text-white transition-colors">
                Live Sentinel
              </a>
              <a href="#security" className="hover:text-white transition-colors">
                Security & RLS
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/proctoring" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                className="bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border-blue-500/30 hover:border-blue-400 font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm backdrop-blur-md transition-all"
              >
                AI Proctoring
              </Button>
            </Link>
            <Link to="/operations" className="hidden md:inline-flex">
              <Button
                variant="outline"
                className="bg-slate-900/60 hover:bg-slate-800 text-slate-200 border-white/10 hover:border-white/20 font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm backdrop-blur-md transition-all"
              >
                Operations
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                Sign In / Portals
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </header>

        <main>
          {/* ================= SECTION 2: NEXT-LEVEL DARK HERO ================= */}
          <section className="relative pt-20 pb-24 px-6 sm:px-12 text-center overflow-hidden border-b border-white/[0.06]">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Live Pill Announcement Badge */}
              <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-blue-950/50 text-blue-300 text-xs font-mono font-medium border border-blue-500/30 shadow-[0_0_25px_rgba(37,99,235,0.2)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="tracking-wide">ASSESSIQ OS 2.4 — ENTERPRISE AI ASSESSMENT OPERATING SYSTEM</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
              </div>

              {/* Main Headline with Gradient */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                Intelligent Assessments.{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(59,130,246,0.3)]">
                  Trusted Outcomes.
                </span>
              </h1>

              {/* Refined Subtitle */}
              <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-normal">
                AssessIQ is the mission-critical Enterprise AI Assessment Operating System engineered for Universities,
                Government Examination Boards, Healthcare Licensure, and Global Corporate Enterprise.
              </p>

              {/* High-Impact Action CTAs */}
              <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm px-8 py-6 rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30"
                  >
                    Launch Role Portals
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/proctoring">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.09] hover:border-white/25 font-semibold text-sm px-8 py-6 rounded-xl backdrop-blur-md transition-all shadow-sm"
                  >
                    <Radio className="w-4 h-4 mr-2 text-blue-400 animate-pulse" />
                    AI Proctoring Suite
                  </Button>
                </Link>
                <a href="#ecosystem">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-slate-400 hover:text-white hover:bg-white/[0.05] font-semibold text-sm px-6 py-6 rounded-xl transition-all"
                  >
                    Explore Ecosystem
                  </Button>
                </a>
              </div>

              {/* ================= EXECUTIVE CONTROL PLANE CONSOLE (DARK GLASS CARD) ================= */}
              <div className="mt-14 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.1] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl p-6 sm:p-7 max-w-4xl mx-auto text-left relative overflow-hidden group hover:border-blue-500/40 transition-all duration-500">
                {/* Ambient Card Top Glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                {/* macOS Console Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-slate-300 font-mono text-xs font-semibold ml-2 flex items-center space-x-2">
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      <span>assessiq-sentinel-v2.4 :: executive-control-plane</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
                      SYSTEM ONLINE • 100% HEALTHY
                    </span>
                  </div>
                </div>

                {/* Dynamic Telemetry Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {/* Metric 1 */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1.5 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider font-semibold">
                        Active Live Candidates
                      </span>
                      <Activity className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="text-2xl font-black text-white font-mono tracking-tight">14,290</div>
                    <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Wasm Sentinel Active</span>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1.5 hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider font-semibold">
                        IRT Calibrated Items
                      </span>
                      <Brain className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div className="text-2xl font-black text-blue-400 font-mono tracking-tight">1.2M Questions</div>
                    <div className="flex items-center space-x-1.5 text-[11px] text-blue-400 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                      <span>Bloom's Taxonomy Verified</span>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1.5 hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider font-semibold">
                        Multi-Tenant Isolation
                      </span>
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">SOC2 RLS Enforced</div>
                    <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Zero Leak Guarantee</span>
                    </div>
                  </div>
                </div>

                {/* Micro Terminal Live Event Ticker */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-blue-400 font-bold">[TELEMETRY]</span>
                    <span className="text-slate-300">Edge node us-east: 0 anomalies</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-300">Cluster latency: 12ms</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-300">IndexedDB autosave sync: 100%</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">Auto-refresh: 500ms</span>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 3: TRUSTED BY WORLD-CLASS INSTITUTIONS ================= */}
          <section className="py-12 px-6 border-b border-white/[0.06] bg-[#02050E]/60 text-center relative">
            <div className="max-w-6xl mx-auto space-y-5">
              <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                TRUSTED BY WORLD-CLASS UNIVERSITIES & CERTIFICATION BOARDS
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 font-mono font-bold text-xs sm:text-sm text-slate-400">
                <span className="hover:text-blue-400 transition-colors cursor-default flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <span>MIT CS & AI LAB</span>
                </span>
                <span className="hover:text-purple-400 transition-colors cursor-default flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>STANFORD MEDICINE</span>
                </span>
                <span className="hover:text-cyan-400 transition-colors cursor-default flex items-center space-x-2">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>PEARSON CERTIFICATION</span>
                </span>
                <span className="hover:text-emerald-400 transition-colors cursor-default flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>GOVERNMENT EXAM BOARD</span>
                </span>
                <span className="hover:text-amber-400 transition-colors cursor-default flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>AWS LEARNING PARTNERS</span>
                </span>
              </div>
            </div>
          </section>

          {/* ================= SECTION 4: ENTERPRISE ECOSYSTEM (ROLE GATEWAYS) ================= */}
          <section id="ecosystem" className="py-24 px-6 sm:px-12 border-b border-white/[0.06] relative">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 text-blue-400 text-xs font-mono font-bold uppercase border border-blue-500/30">
                  <Workflow className="w-3.5 h-3.5 text-blue-400" />
                  <span>AssessIQ Multi-Portal Ecosystem</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Dedicated Role Gateways
                </h2>
                <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Every stakeholder receives an isolated, zero-trust enterprise workspace designed specifically for their
                  operational responsibilities.
                </p>
              </div>

              {/* Portal Gateway Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Student Portal */}
                <div className="p-6 rounded-2xl bg-[#0B0F19]/80 border border-white/[0.08] flex flex-col justify-between space-y-5 hover:border-blue-500/50 hover:bg-[#111827]/90 transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        CANDIDATE
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
                        Student Portal
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Zero-distraction test runner, offline IndexedDB autosave, biometric check-in, score transcripts,
                        and digital badges.
                      </p>
                    </div>
                    <ul className="text-[11px] text-slate-400 space-y-1.5 border-t border-white/[0.06] pt-3">
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Offline-first test execution</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Tamper-proof fullscreen lockdown</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Instant verified score transcripts</span>
                      </li>
                    </ul>
                  </div>
                  <Link to="/student" className="w-full pt-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md transition-all">
                      Access Student Portal
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>

                {/* 2. Faculty Portal */}
                <div className="p-6 rounded-2xl bg-[#0B0F19]/80 border border-white/[0.08] flex flex-col justify-between space-y-5 hover:border-purple-500/50 hover:bg-[#111827]/90 transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Brain className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                        ACADEMIC
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                        Faculty Portal
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        AI item authoring studio, IRT difficulty calibration, automated blueprinting, and rubric grading
                        engine.
                      </p>
                    </div>
                    <ul className="text-[11px] text-slate-400 space-y-1.5 border-t border-white/[0.06] pt-3">
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Bloom's taxonomy AI generator</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>IRT parameter item analysis</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Automated essay rubric scoring</span>
                      </li>
                    </ul>
                  </div>
                  <Link to="/faculty" className="w-full pt-2">
                    <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md transition-all">
                      Access Faculty Portal
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>

                {/* 3. Invigilator Portal */}
                <div className="p-6 rounded-2xl bg-[#0B0F19]/80 border border-white/[0.08] flex flex-col justify-between space-y-5 hover:border-amber-500/50 hover:bg-[#111827]/90 transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Video className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        MONITORING
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                        Invigilator Portal
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Real-time candidate multi-video grid, Wasm computer vision gaze tracking, instant alerts, and
                        whisper audio.
                      </p>
                    </div>
                    <ul className="text-[11px] text-slate-400 space-y-1.5 border-t border-white/[0.06] pt-3">
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Multi-feed candidate video grid</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Real-time gaze & audio anomaly alerts</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Live two-way whisper intercom</span>
                      </li>
                    </ul>
                  </div>
                  <Link to="/invigilator" className="w-full pt-2">
                    <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md transition-all">
                      Access Invigilator Portal
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>

                {/* 4. Super Admin Portal */}
                <div className="p-6 rounded-2xl bg-[#0B0F19]/80 border border-white/[0.08] flex flex-col justify-between space-y-5 hover:border-emerald-500/50 hover:bg-[#111827]/90 transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Server className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        GOVERNANCE
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                        Super Admin
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Multi-tenant infrastructure control plane, RLS isolation policies, audit logs, and global risk
                        analytics.
                      </p>
                    </div>
                    <ul className="text-[11px] text-slate-400 space-y-1.5 border-t border-white/[0.06] pt-3">
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Multi-tenant isolation & RLS</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Role-based access governance</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Global platform risk analytics</span>
                      </li>
                    </ul>
                  </div>
                  <Link to="/admin" className="w-full pt-2">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md transition-all">
                      Access Super Admin
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Secondary Portals (Coding Hub & Org Management) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Coding Assessment Hub */}
                <div className="p-6 rounded-2xl bg-[#0B0F19]/60 border border-white/[0.08] hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-6 group">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-left">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-base text-white">Coding Assessment Hub</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          TECHNICAL
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        In-browser IDE sandbox, multi-language compiler, test case execution, memory & execution benchmarks.
                      </p>
                    </div>
                  </div>
                  <Link to="/coding" className="w-full sm:w-auto shrink-0">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border-cyan-500/30 text-xs font-semibold px-4 py-2 rounded-xl"
                    >
                      Open Coding Hub
                    </Button>
                  </Link>
                </div>

                {/* Organization Administration */}
                <div className="p-6 rounded-2xl bg-[#0B0F19]/60 border border-white/[0.08] hover:border-blue-500/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-6 group">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-left">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-base text-white">Institutional Org Admin</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                          TENANT HQ
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Campus and department tree management, batch faculty invitations, candidate roster import.
                      </p>
                    </div>
                  </div>
                  <Link to="/organization" className="w-full sm:w-auto shrink-0">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border-blue-500/30 text-xs font-semibold px-4 py-2 rounded-xl"
                    >
                      Open Org Admin
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 5: OPERATING SYSTEM ARCHITECTURE ================= */}
          <section id="capabilities" className="py-24 px-6 sm:px-12 border-b border-white/[0.06] bg-[#02050E]/80 relative">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  AssessIQ Operating System Architecture
                </h2>
                <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Engineered on a zero-trust distributed cloud architecture for maximum reliability, military-grade security, and scale.
                </p>
              </div>

              {/* Bento Grid Architecture */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Item Bank */}
                <div className="p-7 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors">
                    Generative AI Item Bank
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    AI-generated question stems mapped to Bloom's taxonomy with automated IRT (Item Response Theory)
                    parameter calibration and distractor quality analysis.
                  </p>
                  <div className="pt-2 flex items-center space-x-2 text-[11px] text-blue-400 font-mono">
                    <span>3PL IRT Model</span>
                    <span>•</span>
                    <span>Adaptive Difficulty</span>
                  </div>
                </div>

                {/* 2. Computer Vision Sentinel */}
                <div className="p-7 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                    Wasm Computer Vision Sentinel
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Zero-cloud-latency WebAssembly proctoring engine executing on-device neural networks for eye gaze,
                    multi-face detection, window focus, and acoustic spectrum analysis.
                  </p>
                  <div className="pt-2 flex items-center space-x-2 text-[11px] text-purple-400 font-mono">
                    <span>Edge Wasm Neural Net</span>
                    <span>•</span>
                    <span>Privacy First</span>
                  </div>
                </div>

                {/* 3. Enterprise RLS Isolation */}
                <div className="p-7 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                    Enterprise RLS Isolation
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    PostgreSQL Row-Level Security ensuring strict multi-tenant data boundaries across organizations with
                    tamper-proof cryptographic event chaining.
                  </p>
                  <div className="pt-2 flex items-center space-x-2 text-[11px] text-emerald-400 font-mono">
                    <span>Postgres RLS Enforced</span>
                    <span>•</span>
                    <span>SOC2 Type II</span>
                  </div>
                </div>

                {/* 4. Lockdown Engine */}
                <div className="p-7 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                    Browser Lockdown & Anti-Tamper
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Fullscreen enforcement, clipboard scrubbing, devtools detection, and keyboard shortcut interception
                    preventing unauthorized collaboration or external aids.
                  </p>
                  <div className="pt-2 flex items-center space-x-2 text-[11px] text-cyan-400 font-mono">
                    <span>DOM Guardian</span>
                    <span>•</span>
                    <span>Clipboard Shield</span>
                  </div>
                </div>

                {/* 5. Real-Time Telemetry Gateway */}
                <div className="p-7 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-300 space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                    WebSocket Telemetry Pipeline
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    High-throughput event streaming aggregating 10+ risk dimensions into an actionable composite integrity
                    score with real-time invigilator alerts.
                  </p>
                  <div className="pt-2 flex items-center space-x-2 text-[11px] text-amber-400 font-mono">
                    <span>Sub-20ms Telemetry</span>
                    <span>•</span>
                    <span>Risk Heatmap</span>
                  </div>
                </div>

                {/* 6. Offline-First Resilience */}
                <div className="p-7 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors">
                    Offline PWA Autosave Engine
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Encrypted IndexedDB transaction queue ensuring zero exam disruptions during campus Wi-Fi drops, with
                    automatic background sync upon reconnection.
                  </p>
                  <div className="pt-2 flex items-center space-x-2 text-[11px] text-blue-400 font-mono">
                    <span>IndexedDB Encrypted</span>
                    <span>•</span>
                    <span>Zero Data Loss</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 6: INTERACTIVE LIVE SENTINEL & TELEMETRY SHOWCASE ================= */}
          <section id="telemetry" className="py-24 px-6 sm:px-12 border-b border-white/[0.06] relative">
            <div className="max-w-6xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 text-emerald-400 text-xs font-mono font-bold uppercase border border-emerald-500/30">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-Time Intelligence Center</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Live Sentinel Telemetry Stream
                </h2>
                <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Experience how AssessIQ continuously synthesizes multi-modal behavioral signals into verified academic trust.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex justify-center">
                <div className="p-1 rounded-xl bg-slate-900/90 border border-white/[0.08] inline-flex space-x-1">
                  <button
                    onClick={() => setActiveTelemetryTab('sentinel')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                      activeTelemetryTab === 'sentinel'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Wasm Vision Sentinel</span>
                  </button>
                  <button
                    onClick={() => setActiveTelemetryTab('ai')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                      activeTelemetryTab === 'ai'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>AI Question Studio</span>
                  </button>
                  <button
                    onClick={() => setActiveTelemetryTab('security')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                      activeTelemetryTab === 'security'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Zero-Trust Lockdown</span>
                  </button>
                </div>
              </div>

              {/* Interactive Showcase Window */}
              <div className="rounded-2xl bg-[#0B0F19]/90 border border-white/[0.1] shadow-2xl p-6 sm:p-8 font-mono text-xs overflow-hidden backdrop-blur-2xl">
                {activeTelemetryTab === 'sentinel' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                      <div className="flex items-center space-x-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white font-bold font-sans text-sm">
                          Active Proctoring Feed — Candidate #89421 (CS-401 Final Exam)
                        </span>
                      </div>
                      <span className="text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-500/30 text-[11px] font-bold">
                        TRUST SCORE: 98.6%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                      {/* Telemetry Visual Box 1 */}
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-mono">Gaze Tracking</span>
                          <span className="text-emerald-400 font-mono font-bold">Centered (99.2%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[99.2%] rounded-full" />
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Candidate eyes locked within exam viewport bounds. Zero peripheral deviation detected.
                        </p>
                      </div>

                      {/* Telemetry Visual Box 2 */}
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-mono">Acoustic Spectrum</span>
                          <span className="text-blue-400 font-mono font-bold">18 dB (Quiet)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full w-[24%] rounded-full" />
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Ambient acoustic noise strictly below 45 dB threshold. No secondary vocal presence detected.
                        </p>
                      </div>

                      {/* Telemetry Visual Box 3 */}
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-mono">Face Verification</span>
                          <span className="text-emerald-400 font-mono font-bold">Single Face Confirmed</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[100%] rounded-full" />
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Facial embeddings match institutional credential registry with 99.8% cosine similarity.
                        </p>
                      </div>
                    </div>

                    {/* Live Stream Terminal Logs */}
                    <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06] font-mono text-[11px] space-y-1 text-slate-400">
                      <div className="text-slate-500">--- Live WebSocket Sentinel Stream (Channel: exam_sess_89421) ---</div>
                      <div>
                        <span className="text-emerald-400">[23:54:12]</span> Gaze verification snapshot: (x: 482, y: 310) — In Focus
                      </div>
                      <div>
                        <span className="text-blue-400">[23:54:15]</span> Keystroke cadence: 68 WPM — Natural human variance observed
                      </div>
                      <div>
                        <span className="text-emerald-400">[23:54:18]</span> IndexedDB snapshot #42 committed to local cache & synced to server
                      </div>
                      <div>
                        <span className="text-cyan-400">[23:54:21]</span> Fullscreen lockdown status: Active (window.blur count: 0)
                      </div>
                    </div>
                  </div>
                )}

                {activeTelemetryTab === 'ai' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                      <div className="flex items-center space-x-3">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-bold font-sans text-sm">
                          AI Question Blueprinting Studio (Bloom's Taxonomy Level: Analyzing)
                        </span>
                      </div>
                      <span className="text-purple-400 bg-purple-950/60 px-3 py-1 rounded border border-purple-500/30 text-[11px] font-bold">
                        IRT DIFFICULTY: θ = +1.15
                      </span>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-900/60 border border-white/[0.06] font-sans space-y-4">
                      <div className="text-xs text-slate-400 font-mono">Generated Stem Preview:</div>
                      <p className="text-white font-medium text-sm leading-relaxed">
                        "Consider a distributed Byzantine fault-tolerant consensus protocol operating across N = 3f + 1 nodes.
                        Under an asynchronous network model where message delays are unbounded, what is the minimum number of
                        consecutive round timeouts before a leader election cycle can safely finalize without violating safety?"
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                        <div className="p-3 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300">
                          A. f + 1 timeouts
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-semibold">
                          B. 2f + 1 timeouts (Verified Correct)
                        </div>
                        <div className="p-3 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300">
                          C. 3f timeouts
                        </div>
                        <div className="p-3 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300">
                          D. Asynchronous models cannot guarantee liveness under FLP impossibility
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTelemetryTab === 'security' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                      <div className="flex items-center space-x-3">
                        <ShieldAlert className="w-5 h-5 text-emerald-400" />
                        <span className="text-white font-bold font-sans text-sm">
                          Zero-Trust Client Lockdown State
                        </span>
                      </div>
                      <span className="text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-500/30 text-[11px] font-bold">
                        LOCKDOWN ENFORCED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-xs">
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1">
                        <div className="text-slate-400 text-[10px] font-mono uppercase">Fullscreen Trap</div>
                        <div className="text-emerald-400 font-bold font-mono">ACTIVE (100%)</div>
                        <p className="text-[11px] text-slate-400">Esc / F11 intercepted</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1">
                        <div className="text-slate-400 text-[10px] font-mono uppercase">Clipboard Isolation</div>
                        <div className="text-emerald-400 font-bold font-mono">PROTECTED</div>
                        <p className="text-[11px] text-slate-400">Ctrl+C/V sanitized</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1">
                        <div className="text-slate-400 text-[10px] font-mono uppercase">DevTools Monitor</div>
                        <div className="text-emerald-400 font-bold font-mono">UNOPENED</div>
                        <p className="text-[11px] text-slate-400">Timing diff detector active</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1">
                        <div className="text-slate-400 text-[10px] font-mono uppercase">Multi-Display Lock</div>
                        <div className="text-emerald-400 font-bold font-mono">SINGLE MONITOR</div>
                        <p className="text-[11px] text-slate-400">Screen API bounds verified</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ================= SECTION 7: END-TO-END WORKFLOW TIMELINE ================= */}
          <section id="workflow" className="py-24 px-6 sm:px-12 border-b border-white/[0.06] bg-[#02050E]/80 relative">
            <div className="max-w-6xl mx-auto space-y-14">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 text-blue-400 text-xs font-mono font-bold uppercase border border-blue-500/30">
                  <Workflow className="w-3.5 h-3.5 text-blue-400" />
                  <span>Enterprise Lifecycle</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  End-to-End Enterprise Assessment Workflow
                </h2>
                <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  From multi-campus organization setup to automated AI evaluation and cryptographically verifiable digital credentials.
                </p>
              </div>

              {/* 4 Pipeline Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {/* Step 1 */}
                <div className="p-6 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 space-y-4 group">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-blue-400 px-3 py-1 rounded-md bg-blue-950/80 border border-blue-800">
                      STEP 01
                    </span>
                    <Building2 className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors">
                      Org & Campus Setup
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Configure multi-tenant academic hierarchies, department structures, SSO/SAML directory sync, and
                      role-based permission boundaries.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-6 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 space-y-4 group">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-purple-400 px-3 py-1 rounded-md bg-purple-950/80 border border-purple-800">
                      STEP 02
                    </span>
                    <Brain className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                      AI Item Generation
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Author high-discrimination questions mapped to syllabus blueprints with automated IRT difficulty
                      calibration and anti-cheat distractors.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-6 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-300 space-y-4 group">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-amber-400 px-3 py-1 rounded-md bg-amber-950/80 border border-amber-800">
                      STEP 03
                    </span>
                    <Eye className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                      Live Candidate Test
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Students test inside a zero-distraction fullscreen lock with on-device Wasm computer vision proctoring
                      and continuous offline autosave.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-6 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 space-y-4 group">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-emerald-400 px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-800">
                      STEP 04
                    </span>
                    <Award className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                      AI Grading & Certs
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Instant algorithmic scoring, AI essay grading against faculty rubrics, composite integrity audit
                      reports, and verifiable digital badges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 8: ENTERPRISE SECURITY & COMPLIANCE MATRIX ================= */}
          <section id="security" className="py-24 px-6 sm:px-12 border-b border-white/[0.06] relative">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 text-emerald-400 text-xs font-mono font-bold uppercase border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero-Trust Security & Compliance</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Military-Grade Exam Security
                </h2>
                <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Engineered from the ground up to protect institutional academic integrity and candidate data privacy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-[#0B0F19]/80 border border-white/[0.08] space-y-3">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                  <h4 className="font-bold text-white text-base">SOC 2 Type II Certified</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Independently audited operational security, availability, and multi-tenant confidentiality standards.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#0B0F19]/80 border border-white/[0.08] space-y-3">
                  <Globe className="w-7 h-7 text-blue-400" />
                  <h4 className="font-bold text-white text-base">GDPR & FERPA Compliant</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Student biometric data processed entirely on-device via WebAssembly; never stored or sold.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#0B0F19]/80 border border-white/[0.08] space-y-3">
                  <Lock className="w-7 h-7 text-purple-400" />
                  <h4 className="font-bold text-white text-base">PostgreSQL RLS Partitioning</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Strict database Row-Level Security ensuring absolute institutional data isolation and zero leakage.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#0B0F19]/80 border border-white/[0.08] space-y-3">
                  <Cpu className="w-7 h-7 text-cyan-400" />
                  <h4 className="font-bold text-white text-base">AES-256 & TLS 1.3</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    End-to-end cryptographic encryption across all active exams, autosave packets, and question items.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 9: EXECUTIVE FINAL CALL TO ACTION ================= */}
          <section className="py-24 px-6 sm:px-12 relative overflow-hidden">
            <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-blue-950/60 via-[#0B0F19] to-[#0B0F19] border border-blue-500/30 p-10 sm:p-16 text-center space-y-8 relative shadow-[0_0_60px_rgba(37,99,235,0.2)]">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950 text-blue-300 text-xs font-mono font-bold uppercase border border-blue-700">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>TRANSFORM YOUR ASSESSMENT ECOSYSTEM</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to Modernize Your Institutional Examinations?
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Deploy AssessIQ across your university campus, testing center, or corporate licensure board with
                plug-and-play SSO integration and zero-trust proctoring.
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-8 py-6 rounded-xl shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all"
                  >
                    Get Started with AssessIQ
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/organization">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 bg-white/[0.05] text-white hover:bg-white/[0.1] font-semibold text-sm px-8 py-6 rounded-xl"
                  >
                    Schedule Institutional Demo
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* ================= SECTION 10: ENTERPRISE DARK FOOTER ================= */}
        <footer className="bg-[#02050E] border-t border-white/[0.08] py-16 px-6 sm:px-12 text-xs text-slate-400 font-sans">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {/* Brand Col */}
              <div className="col-span-2 space-y-4">
                <BrandLogo size="md" variant="dark" />
                <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                  AssessIQ is the mission-critical Enterprise AI Assessment Operating System engineered for Universities,
                  Government Examination Boards, and Global Enterprise.
                </p>
                <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-md border border-emerald-500/20 w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>All Systems Operational • 99.99% Uptime</span>
                </div>
              </div>

              {/* Col 2 */}
              <div className="space-y-3">
                <h5 className="font-mono text-xs font-bold uppercase text-white tracking-wider">Role Portals</h5>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link to="/student" className="hover:text-blue-400 transition-colors">
                      Student Portal
                    </Link>
                  </li>
                  <li>
                    <Link to="/faculty" className="hover:text-blue-400 transition-colors">
                      Faculty Portal
                    </Link>
                  </li>
                  <li>
                    <Link to="/invigilator" className="hover:text-blue-400 transition-colors">
                      Invigilator Portal
                    </Link>
                  </li>
                  <li>
                    <Link to="/organization" className="hover:text-blue-400 transition-colors">
                      Org Administration
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin" className="hover:text-blue-400 transition-colors">
                      Super Admin
                    </Link>
                  </li>
                  <li>
                    <Link to="/coding" className="hover:text-blue-400 transition-colors">
                      Coding Sandbox
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3 */}
              <div className="space-y-3">
                <h5 className="font-mono text-xs font-bold uppercase text-white tracking-wider">Architecture</h5>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link to="/proctoring" className="hover:text-blue-400 transition-colors">
                      Wasm Vision Sentinel
                    </Link>
                  </li>
                  <li>
                    <Link to="/operations" className="hover:text-blue-400 transition-colors">
                      Operations Center
                    </Link>
                  </li>
                  <li>
                    <a href="#capabilities" className="hover:text-blue-400 transition-colors">
                      IRT Item Banking
                    </a>
                  </li>
                  <li>
                    <a href="#security" className="hover:text-blue-400 transition-colors">
                      Postgres RLS Security
                    </a>
                  </li>
                  <li>
                    <a href="#workflow" className="hover:text-blue-400 transition-colors">
                      Assessment Workflow
                    </a>
                  </li>
                </ul>
              </div>

              {/* Col 4 */}
              <div className="space-y-3">
                <h5 className="font-mono text-xs font-bold uppercase text-white tracking-wider">Governance</h5>
                <ul className="space-y-2 text-xs">
                  <li>
                    <a href="#security" className="hover:text-blue-400 transition-colors">
                      SOC 2 Type II
                    </a>
                  </li>
                  <li>
                    <a href="#security" className="hover:text-blue-400 transition-colors">
                      ISO 27001 Certified
                    </a>
                  </li>
                  <li>
                    <a href="#security" className="hover:text-blue-400 transition-colors">
                      GDPR & FERPA
                    </a>
                  </li>
                  <li>
                    <Link to="/auth" className="hover:text-blue-400 transition-colors">
                      Institutional Sign In
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
              <p>© 2026 AssessIQ Inc. All rights reserved. SOC2 & ISO 27001 Certified Enterprise Assessment Platform.</p>
              <div className="flex space-x-6">
                <span className="hover:text-white cursor-pointer">Privacy Policy</span>
                <span className="hover:text-white cursor-pointer">Terms of Service</span>
                <span className="hover:text-white cursor-pointer">Security Center</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LightLanding;
