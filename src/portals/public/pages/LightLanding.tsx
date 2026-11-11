import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import BrandLogo from "@/shared/components/BrandLogo";
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
} from 'lucide-react';

export const LightLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A] selection:bg-blue-100 selection:text-blue-900">
      {/* ================= SECTION 1: ENTERPRISE NAVIGATION HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3">
            <BrandLogo size="md" variant="light" />
          </Link>

          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-[#475569]">
            <Link to="/proctoring" className="text-[#2563EB] font-bold hover:underline">AI Proctoring Suite</Link>
            <Link to="/operations" className="text-[#15803D] font-bold hover:underline">Operations Command Center</Link>
            <a href="#ecosystem" className="hover:text-[#2563EB] transition-colors">Portals</a>
            <a href="#capabilities" className="hover:text-[#2563EB] transition-colors">Capabilities</a>
            <a href="#workflow" className="hover:text-[#2563EB] transition-colors">Workflow</a>
            <a href="#security" className="hover:text-[#2563EB] transition-colors">Security</a>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/proctoring">
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs">
              AI Proctoring Suite
            </Button>
          </Link>
          <Link to="/operations">
            <Button className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs">
              Operations Center
            </Button>
          </Link>
          <Link to="/organization">
            <Button className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs">
              Book Enterprise Demo
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* ================= SECTION 2: ENTERPRISE HERO ================= */}
        <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-20 px-6 sm:px-12 text-center relative overflow-hidden">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#1E40AF] text-xs font-mono font-bold uppercase border border-blue-200">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>AssessIQ — Enterprise AI Assessment Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Intelligent Assessments. Trusted Outcomes.
            </h1>

            <p className="text-[#475569] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              AssessIQ is the mission-critical Enterprise AI Assessment Operating System engineered for Universities, Government Examination Boards, Healthcare Licensure, and Global Corporate Enterprise.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link to="/auth">
                <Button size="lg" className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs px-8 py-6 rounded-xl shadow-xs">
                  Book Enterprise Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="#ecosystem">
                <Button size="lg" variant="outline" className="border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F1F5F9] font-bold text-xs px-8 py-6 rounded-xl">
                  Explore Enterprise Ecosystem
                </Button>
              </a>
            </div>

            {/* Platform Preview Console Visual */}
            <div className="mt-12 rounded-2xl bg-white border border-[#E2E8F0] shadow-md p-6 max-w-4xl mx-auto text-left font-mono text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-[#64748B] font-sans font-bold ml-2">AssessIQ Executive Control Plane</span>
                </div>
                <span className="text-[10px] font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  SYSTEM ONLINE • 100% HEALTHY
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[#64748B] text-[10px] uppercase font-mono font-bold">Active Live Candidates</span>
                  <div className="text-xl font-extrabold text-[#0F172A]">14,290</div>
                  <span className="text-[10px] text-[#15803D] font-bold">Wasm Sentinel Active</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[#64748B] text-[10px] uppercase font-mono font-bold">IRT Calibrated Items</span>
                  <div className="text-xl font-extrabold text-[#2563EB]">1.2M Questions</div>
                  <span className="text-[10px] text-[#2563EB] font-bold">Bloom's Verified</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[#64748B] text-[10px] uppercase font-mono font-bold">Multi-Tenant Isolation</span>
                  <div className="text-xl font-extrabold text-[#15803D]">SOC2 RLS Enforced</div>
                  <span className="text-[10px] text-[#15803D] font-bold">Zero Leak Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: TRUSTED BY ================= */}
        <section className="py-12 px-6 border-b border-[#E2E8F0] bg-white text-center">
          <div className="max-w-6xl mx-auto space-y-6">
            <p className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
              TRUSTED BY WORLD-CLASS UNIVERSITIES & CERTIFICATION BOARDS
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-75 font-bold text-sm text-[#475569]">
              <span>MIT CS & AI LAB</span>
              <span>STANFORD MEDICINE</span>
              <span>PEARSON CERTIFICATION</span>
              <span>GOVERNMENT EXAM BOARD</span>
              <span>AWS LEARNING PARTNERS</span>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4: ENTERPRISE ECOSYSTEM (5 DEDICATED PORTAL GATEWAYS) ================= */}
        <section id="ecosystem" className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#1E40AF] text-xs font-mono font-bold uppercase border border-blue-100">
                <Workflow className="w-3.5 h-3.5" />
                <span>AssessIQ Multi-Portal Ecosystem</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                Dedicated Role Gateways
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] max-w-2xl mx-auto">
                Every stakeholder receives a tailored enterprise workspace designed specifically for their operational responsibilities.
              </p>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Portal 1: Student */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#0F172A]">Student Portal</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Zero-distraction test runner, offline autosave, score transcripts, digital badges.
                  </p>
                </div>
                <Link to="/student">
                  <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-2 rounded-xl">
                    Access Portal
                  </Button>
                </Link>
              </div>

              {/* Portal 2: Faculty */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#0F172A]">Faculty Portal</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    AI item authoring, IRT difficulty calibration, exam blueprinting, essay grading rubrics.
                  </p>
                </div>
                <Link to="/faculty">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 rounded-xl">
                    Access Portal
                  </Button>
                </Link>
              </div>

              {/* Portal 3: Invigilator */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#0F172A]">Invigilator Portal</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Real-time video feeds, Wasm computer vision gaze tracking, anomaly alerts.
                  </p>
                </div>
                <Link to="/invigilator">
                  <Button className="w-full bg-[#D97706] hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl">
                    Access Portal
                  </Button>
                </Link>
              </div>



              {/* Portal 5: Super Admin */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0F172A] flex items-center justify-center">
                    <Server className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#0F172A]">Super Admin</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Multi-tenant infrastructure control plane, RLS isolation policies, global risk engine.
                  </p>
                </div>
                <Link to="/admin">
                  <Button className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl">
                    Access Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 5: PLATFORM CAPABILITIES OS LAYOUT ================= */}
        <section id="capabilities" className="py-20 px-6 sm:px-12 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                AssessIQ Operating System Architecture
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] max-w-2xl mx-auto">
                Built on a distributed cloud architecture for maximum reliability and scalability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <Brain className="w-6 h-6 text-[#1E40AF]" />
                <h3 className="font-bold text-sm text-[#0F172A]">Generative AI Item Bank</h3>
                <p className="text-[#475569]">AI-generated questions mapped to Bloom's taxonomy with IRT difficulty parameter calibration.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <Video className="w-6 h-6 text-[#1E40AF]" />
                <h3 className="font-bold text-sm text-[#0F172A]">Wasm Computer Vision Sentinel</h3>
                <p className="text-[#475569]">Client-side WebAssembly proctoring engine evaluating eye gaze, window focus, and audio spectrum.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <ShieldCheck className="w-6 h-6 text-[#1E40AF]" />
                <h3 className="font-bold text-sm text-[#0F172A]">Enterprise RLS Isolation</h3>
                <p className="text-[#475569]">PostgreSQL Row-Level Security ensuring strict multi-tenant data boundaries across organizations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 6: WORKFLOW TIMELINE ================= */}
        <section id="workflow" className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                End-to-End Enterprise Assessment Workflow
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">From organization setup to automated AI evaluation and digital credential issuing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#1E40AF]">STEP 01</span>
                <p className="font-bold text-[#0F172A] font-sans">Org & Campus Setup</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#1E40AF]">STEP 02</span>
                <p className="font-bold text-[#0F172A] font-sans">AI Item Generation</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#1E40AF]">STEP 03</span>
                <p className="font-bold text-[#0F172A] font-sans">Live Candidate Test</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#15803D]">STEP 04</span>
                <p className="font-bold text-[#0F172A] font-sans">AI Grading & Certs</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= SECTION 14: ENTERPRISE FOOTER ================= */}
      <footer className="bg-white border-t border-[#E2E8F0] py-12 px-8 text-xs text-[#64748B] font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <BrandLogo size="md" variant="light" />
          <p>© 2026 AssessIQ Inc. All rights reserved. SOC2 & ISO 27001 Certified Enterprise Platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default LightLanding;
