import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  FileCheck,
  Brain,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
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
          <span>AI-powered online assessments</span>
        </motion.div>

        {/* H1 Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold text-[#1E293B] tracking-tight leading-[1.08]"
        >
          Create, proctor, and grade exams in a fraction of the time.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[#475569] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
        >
          AssessIQ helps institutions build better exams with AI, keep every test fair with smart proctoring, and
          deliver results and certificates in minutes, not weeks.
        </motion.p>

        {/* CTAs */}
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
              Book a Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <a href="#how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="bg-white border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] font-semibold text-sm px-7 py-6 rounded-xl transition-all shadow-xs"
            >
              <Play className="w-4 h-4 mr-2 fill-[#2563EB] text-[#2563EB]" />
              See How It Works
            </Button>
          </a>
        </motion.div>

        {/* Micro-trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-xs text-[#64748B] font-medium"
        >
          No credit card. Free pilot for design partners. Setup in a day.
        </motion.p>

        {/* Light Product Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 relative max-w-4xl mx-auto"
        >
          {/* Floating Mini-Card 1: Essay graded in 12 sec */}
          <div className="hidden md:flex absolute -top-5 -right-4 z-20 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-xl p-3.5 shadow-[0_12px_30px_rgba(16,185,129,0.14)] items-center space-x-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#10B981] border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#1E293B]">Essay graded in 12 sec</div>
              <div className="text-[10px] text-[#64748B] font-mono">
                CS-401 Final · 94.5% Score · Rubric verified
              </div>
            </div>
          </div>

          {/* Floating Mini-Card 2: Question set generated */}
          <div className="hidden md:flex absolute -bottom-5 -left-4 z-20 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-xl p-3.5 shadow-[0_12px_30px_rgba(37,99,235,0.14)] items-center space-x-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#1E293B]">Question set generated</div>
              <div className="text-[10px] text-[#64748B] font-mono">
                50 questions drafted from syllabus in 3 min
              </div>
            </div>
          </div>

          {/* Main Dashboard Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_16px_40px_rgba(37,99,235,0.08)] p-6 sm:p-7 text-left">
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] pb-4 gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E293B]">
                    CS-401: Distributed Computing & Systems Final Exam
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] text-[#64748B]">
                    <span>Spring Semester</span>
                    <span>•</span>
                    <span className="text-[#10B981] font-semibold flex items-center">
                      <Check className="w-3 h-3 mr-0.5" /> Auto-graded
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-[#10B981] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 w-fit">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Integrity verified · 0 severe flags</span>
              </div>
            </div>

            {/* 3 Stat Tiles labeled "Sample data" */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#64748B] uppercase">
                  <span>Exams Graded</span>
                  <span className="text-[9px] text-[#94A3B8] font-normal normal-case">Sample data</span>
                </div>
                <div className="text-2xl font-extrabold text-[#1E293B] font-mono">1,420</div>
                <div className="text-[11px] text-[#10B981] font-semibold">100% Cohort Complete</div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#64748B] uppercase">
                  <span>Avg. Grading Time</span>
                  <span className="text-[9px] text-[#94A3B8] font-normal normal-case">Sample data</span>
                </div>
                <div className="text-2xl font-extrabold text-[#2563EB] font-mono">14 sec</div>
                <div className="text-[11px] text-[#2563EB] font-semibold">Down from 12 days manual</div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#64748B] uppercase">
                  <span>Integrity Flags Reviewed</span>
                  <span className="text-[9px] text-[#94A3B8] font-normal normal-case">Sample data</span>
                </div>
                <div className="text-2xl font-extrabold text-[#1E293B] font-mono">100%</div>
                <div className="text-[11px] text-[#10B981] font-semibold">All flags resolved by proctors</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

