import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from "@/shared/components/BrandLogo";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import {
  RedCheck,
  RedCircle,
  RedUnderline,
  CropMarks,
  MarginNote,
  OmrBubble,
} from '@/components/marks';

export const Welcome: React.FC = () => {
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
          <Link
            to="/auth/login"
            className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
          >
            SIGN IN
          </Link>
          <Link to="/auth/register">
            <button className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors">
              START PILOT
            </button>
          </Link>
        </div>
      </header>

      {/* Main Welcome Sheet */}
      <main className="max-w-5xl w-full mx-auto my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFF3A3] border border-[#2B2350] shadow-[2px_2px_0px_#2B2350] text-xs font-mono font-bold uppercase text-[#2B2350]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>EXAM BRIEF // WELCOME CANDIDATE</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2B2350] tracking-tight leading-tight">
            Exams that mark <span className="relative inline-block px-1">themselves<RedUnderline /></span>
          </h1>

          <p className="text-base sm:text-lg text-[#6B6590] font-body leading-relaxed max-w-xl">
            AssessIQ is the smart assessment platform built for universities, certification bodies, and healthcare teams who want reliable, cheat-resistant tests.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              'Zero-Distraction Test Window',
              'Offline Autosave & Sync',
              'Fast Human-in-the-Loop AI Grading',
              'Live Video & Screen Monitoring',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-2.5 text-xs text-[#2B2350] font-medium">
                <RedCheck className="w-4 h-4 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link to="/auth/register">
              <button className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-6 py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center space-x-2 transition-all group">
                <span>CREATE INSTITUTION ACCOUNT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/auth">
              <button className="bg-white border-2 border-[#2B2350] hover:bg-[#FFF3A3]/30 text-[#2B2350] font-mono font-bold text-xs px-6 py-3.5 rounded-2xl shadow-[3px_3px_0px_#2B2350] transition-all">
                SELECT PORTAL →
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side: Visual Exam Paper Card */}
        <div className="lg:col-span-5 relative">
          <div className="p-8 rounded-3xl bg-[#FFF3A3]/45 border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-5 rotate-1 hover:rotate-0 transition-transform">
            <CropMarks />

            <div className="flex items-center justify-between border-b-2 border-dashed border-[#2B2350]/20 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#2B2350]">
                ANSWER SHEET // DEMO
              </span>
              <div className="flex items-center space-x-1">
                {['A', 'B', 'C', 'D'].map((b, i) => (
                  <OmrBubble key={b} letter={b} selected={i === 2} size="sm" />
                ))}
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-[#6B6590]">
                <span>Status:</span>
                <span className="text-[#10B981] font-bold">READY FOR EXAM</span>
              </div>
              <div className="flex justify-between items-center text-[#6B6590]">
                <span>Score Transcripts:</span>
                <span className="text-[#2B2350] font-bold">INSTANT AI</span>
              </div>
              <div className="flex justify-between items-center text-[#6B6590]">
                <span>Proctoring:</span>
                <span className="text-[#2B2350] font-bold">SECURE SENTINEL</span>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-dashed border-[#2B2350]/20 flex items-center justify-between">
              <MarginNote className="-rotate-3">pilot ready</MarginNote>
              <span className="font-mono text-[10px] uppercase text-[#6B6590]">FREE PILOT FOR DESIGN PARTNERS</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <span>EXAM PORTAL BRIEF</span>
      </footer>
    </div>
  );
};

export default Welcome;
