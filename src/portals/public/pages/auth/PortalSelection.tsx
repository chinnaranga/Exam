import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from "@/shared/components/BrandLogo";
import {
  UserCheck,
  Brain,
  Video,
  Building2,
  Server,
  ArrowRight,
  Code,
  Sparkles,
} from 'lucide-react';
import {
  RedCircle,
  RedUnderline,
  RedCheck,
  OmrBubble,
  MarginNote,
  StickerBadge,
  CropMarks,
} from '@/components/marks';

export const PortalSelection: React.FC = () => {
  const portals = [
    {
      id: 'student',
      bubble: 'A',
      title: 'Student Portal',
      subtitle: 'Zero-distraction test runner with offline autosave and verifiable digital score sheets.',
      path: '/student/login',
      icon: UserCheck,
      sheetColor: 'bg-[#C9CCFF]/35 hover:bg-[#C9CCFF]/50 border-[#2B2350]',
      tagBg: 'bg-[#C9CCFF] text-[#2B2350]',
      features: ['Zero-Distraction Test Window', 'Offline Autosave & Sync', 'Instant AI Score Transcripts'],
      note: 'most popular',
    },
    {
      id: 'coding',
      bubble: 'B',
      title: 'Coding Platform',
      subtitle: 'Polyglot coding assessments, 14 execution runtimes, judge cluster telemetry & sandbox.',
      path: '/coding/login',
      icon: Code,
      sheetColor: 'bg-[#FFF3A3]/45 hover:bg-[#FFF3A3]/65 border-[#2B2350]',
      tagBg: 'bg-[#FFF3A3] text-[#2B2350]',
      features: ['14 Polyglot Runtimes', '16 Online Judge Nodes', 'Live Execution Telemetry'],
      note: 'low latency',
    },
    {
      id: 'faculty',
      bubble: 'C',
      title: 'Faculty Portal',
      subtitle: 'AI item bank authoring, IRT calibration, essay rubric grading & exam blueprints.',
      path: '/faculty/login',
      icon: Brain,
      sheetColor: 'bg-[#B8F0D2]/45 hover:bg-[#B8F0D2]/65 border-[#2B2350]',
      tagBg: 'bg-[#B8F0D2] text-[#2B2350]',
      features: ['AI Question Generator', "Bloom's Taxonomy Matrix", 'IRT Difficulty Calibration'],
      note: 'rubric ready',
    },
    {
      id: 'invigilator',
      bubble: 'D',
      title: 'Invigilator Portal',
      subtitle: 'Real-time multi-candidate video grids, WASM computer vision gaze tracking & alerts.',
      path: '/invigilator/login',
      icon: Video,
      sheetColor: 'bg-[#FFB5A7]/35 hover:bg-[#FFB5A7]/50 border-[#2B2350]',
      tagBg: 'bg-[#FFB5A7] text-[#2B2350]',
      features: ['Live Candidate Grid', 'WASM Eye Gaze Detection', 'Instant Incident Audit Logs'],
      note: 'live room',
    },
    {
      id: 'org-admin',
      bubble: 'E',
      title: 'Organization Admin',
      subtitle: 'Campus, department, program management, custom branding & role provisioning.',
      path: '/org-admin/login',
      icon: Building2,
      sheetColor: 'bg-[#BFE6FF]/40 hover:bg-[#BFE6FF]/60 border-[#2B2350]',
      tagBg: 'bg-[#BFE6FF] text-[#2B2350]',
      features: ['Campus & Dept Scoping', 'Roster Bulk Invitations', 'Institutional Analytics'],
      note: 'admin control',
    },
    {
      id: 'super-admin',
      bubble: 'F',
      title: 'Super Admin Portal',
      subtitle: 'Global multi-tenant infrastructure control plane, RLS isolation & AI risk engine.',
      path: '/super-admin/login',
      icon: Server,
      sheetColor: 'bg-white hover:bg-slate-50 border-[#2B2350]',
      tagBg: 'bg-[#E2E8F0] text-[#2B2350]',
      features: ['Multi-Tenant Control Plane', 'RLS Row Level Security', 'Global AI Threat Radar'],
      note: 'root clearance',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-body text-[#2B2350] selection:bg-[#FFF3A3] selection:text-[#2B2350] antialiased pencil-cursor flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header Bar */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 border-b-2 border-dashed border-[#2B2350]/20">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#6C4DFF] text-white flex items-center justify-center shadow-xs group-hover:bg-[#5A3DEB] transition-colors">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight text-[#2B2350]">
            Assess<span className="text-[#6C4DFF]">IQ</span>
          </span>
        </Link>
        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
            FORM 01 // ROLE DISPATCH
          </span>
          <Link
            to="/"
            className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
          >
            ← BACK TO HOME
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto my-auto py-10 space-y-10">
        {/* Title Area */}
        <div className="text-center space-y-3 relative">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-[#2B2350] shadow-[2px_2px_0px_#2B2350] text-xs font-mono font-bold uppercase text-[#2B2350]">
            <span className="w-2 h-2 rounded-full bg-[#FF4D5E] animate-pulse" />
            <span>Select Your Graded Workspace</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2B2350] tracking-tight">
            Choose your <span className="relative inline-block px-1">station<RedCircle className="scale-110" /></span>
          </h1>

          <div className="flex items-center justify-center gap-2">
            <p className="text-sm sm:text-base text-[#6B6590] max-w-xl mx-auto font-body">
              Every participant enters a tailored, zero-leak testing environment.
            </p>
            <MarginNote className="-rotate-3 hidden sm:inline-block">fill one bubble</MarginNote>
          </div>
        </div>

        {/* 6 Cards Grid (3x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                className={`relative rounded-3xl border-2 p-6 flex flex-col justify-between space-y-5 transition-all duration-200 shadow-[4px_4px_0px_#2B2350] hover:shadow-[8px_8px_0px_#2B2350] hover:-translate-y-1 ${portal.sheetColor}`}
              >
                <CropMarks />

                <div className="space-y-4">
                  {/* Top Row: OMR Bubble + Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full border-2 border-[#2B2350] bg-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                        {portal.bubble}
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-[#2B2350]/30 shadow-xs">
                        <Icon className="w-4 h-4 text-[#2B2350]" />
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border border-[#2B2350]/30 ${portal.tagBg}`}>
                      {portal.note}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-extrabold text-[#2B2350]">
                      {portal.title}
                    </h3>
                    <p className="text-xs text-[#6B6590] mt-1.5 leading-relaxed font-body">
                      {portal.subtitle}
                    </p>
                  </div>

                  {/* Features with Red Check marks */}
                  <div className="pt-3 space-y-2 border-t border-[#2B2350]/15">
                    {portal.features.map((feat, idx) => (
                      <div key={idx} className="text-xs text-[#2B2350] font-medium flex items-center space-x-2">
                        <RedCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enter Button */}
                <Link to={portal.path} className="pt-2">
                  <button className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3 rounded-2xl shadow-[0_4px_12px_rgba(108,77,255,0.25)] flex items-center justify-center space-x-2 transition-all group">
                    <span>ENTER {portal.title.toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20 gap-3">
        <div className="flex items-center space-x-2">
          <span>Candidate Signature:</span>
          <span className="border-b border-[#2B2350] w-36 inline-block" />
        </div>
        <div className="flex items-center space-x-4">
          <span>DATE: {new Date().toISOString().slice(0, 10)}</span>
          <span>•</span>
          <div className="flex items-center space-x-1.5">
            {['A', 'B', 'C', 'D'].map((b) => (
              <span key={b} className="w-4 h-4 rounded-full border border-[#2B2350]/40 text-[9px] flex items-center justify-center font-mono">
                {b}
              </span>
            ))}
          </div>
          <span>•</span>
          <span>ASSESSIQ VERIFIED</span>
        </div>
      </footer>
    </div>
  );
};

export default PortalSelection;
