import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from "@/shared/stores/authStore";
import { useExams } from '@/shared/hooks/useApiQueries';
import {
  BookOpen,
  Award,
  Clock,
  Play,
  Sparkles,
  Calendar,
  BarChart3,
  UserCheck,
  Brain,
  Briefcase,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  Layers,
  Star,
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

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: examsData, isLoading: isExamsLoading } = useExams({ page: 1, pageSize: 5 });
  const apiExamsList = examsData?.data || [];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Candidate Operating System Synced', {
        description: 'Updated academic transcript, biometric consensus, and test blueprints.',
      });
    }, 400);
  };

  const studentName = user ? `${user.firstName} ${user.lastName}` : 'Jane Doe';

  // Sample production-grade examinations roster
  const fallbackExams = [
    {
      id: 'exam_cs402',
      code: 'CS-402',
      title: 'Distributed Consensus & Raft Protocols',
      department: 'EECS Dept',
      status: 'STARTS IN 45 MINS',
      statusColor: 'bg-[#FFF3A3] text-[#2B2350] border-[#2B2350]',
      duration: '60 Mins',
      questions: 40,
      proctored: true,
      urgent: true,
    },
    {
      id: 'exam_ai501',
      code: 'AI-501',
      title: 'Generative AI & LLM Inference Blueprints',
      department: 'AI & Data Lab',
      status: 'TOMORROW 2:00 PM',
      statusColor: 'bg-[#C9CCFF]/50 text-[#2B2350] border-[#2B2350]',
      duration: '90 Mins',
      questions: 50,
      proctored: true,
      urgent: false,
    },
    {
      id: 'exam_med801',
      code: 'MED-801',
      title: 'Clinical Diagnostics & Pharmacokinetics',
      department: 'Health Sciences',
      status: 'NEXT TUESDAY',
      statusColor: 'bg-[#B8F0D2]/50 text-[#2B2350] border-[#2B2350]',
      duration: '120 Mins',
      questions: 60,
      proctored: true,
      urgent: false,
    },
  ];

  const displayExams = apiExamsList.length > 0 ? apiExamsList.map((e) => ({
    id: String(e.id),
    code: e.code,
    title: e.title,
    department: 'Computer Science',
    status: e.scheduledStartTime || 'SCHEDULED',
    statusColor: 'bg-[#FFF3A3] text-[#2B2350] border-[#2B2350]',
    duration: `${e.durationMinutes} Mins`,
    questions: e.totalQuestions,
    proctored: true,
    urgent: true,
  })) : fallbackExams;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-body text-[#2B2350] antialiased">
      {/* ================= 1. THE GRADED ANSWER SHEET HERO BANNER ================= */}
      <section className="relative p-6 sm:p-8 rounded-3xl bg-[#C9CCFF]/35 border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6">
        <CropMarks />

        {/* Top Eyebrow Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed border-[#2B2350]/20 pb-4">
          <div className="flex items-center space-x-2.5">
            <OmrBubble letter="A" selected size="sm" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
              STATION 01 // CANDIDATE DOSSIER
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-2.5 py-1 rounded-full border border-[#2B2350]">
              DEAN'S HONOURS
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <MarginNote className="-rotate-2">grade: 98/100 A+</MarginNote>
            <span className="text-xs font-mono font-bold text-[#10B981] bg-white border border-[#2B2350] px-3 py-1 rounded-full flex items-center shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5 animate-pulse" />
              WASM SENTINEL ACTIVE
            </span>
          </div>
        </div>

        {/* Main Hero Split */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center space-x-5">
            {/* Candidate Monogram Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#6C4DFF] text-white border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] flex items-center justify-center font-heading font-extrabold text-3xl shrink-0">
              {studentName.charAt(0)}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#10B981]/20 text-[#047857] px-2.5 py-0.5 rounded-full border border-[#10B981]/40">
                  VERIFIED MIT CANDIDATE
                </span>
                <span className="text-[10px] font-mono font-bold text-[#6B6590] bg-white px-2 py-0.5 rounded-full border border-[#2B2350]/30">
                  ID: MIT-2026-CS402
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#2B2350] tracking-tight">
                Welcome back, <span className="relative inline-block px-1">{studentName}!<RedCircle className="scale-105" /></span>
              </h1>

              <p className="text-xs sm:text-sm text-[#6B6590] font-body">
                Electrical Engineering & Computer Science • Real-time IRT calibration and cryptographic assessment credentials.
              </p>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={handleRefresh}
              className="bg-white border-2 border-[#2B2350] text-[#2B2350] hover:bg-[#FFF3A3] font-mono font-bold text-xs px-4 py-3 rounded-2xl shadow-[2px_2px_0px_#2B2350] transition-all flex items-center space-x-1.5 cursor-pointer hover:-translate-y-0.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>SYNC TRANSCRIPT</span>
            </button>

            <Link to="/student/exams/runner" className="flex-1 lg:flex-none">
              <button className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-6 py-3.5 rounded-2xl border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] transition-all flex items-center justify-center space-x-2 cursor-pointer hover:-translate-y-0.5">
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>LAUNCH TEST RUNNER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 2. QUICK ACTIONS DISPATCH GATEWAY ================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-mono uppercase font-bold text-[#6B6590] tracking-wider">
            STATION DISPATCH // QUICK GATEWAYS
          </span>
          <span className="text-[10px] font-mono text-[#6C4DFF] font-bold">8 MODULES READY</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-xs">
          {[
            { label: 'Take Exam', note: '1 live today', icon: BookOpen, sheetColor: 'bg-[#C9CCFF]/35 hover:bg-[#C9CCFF]/60', path: '/student/exams' },
            { label: 'AI Practice', note: 'adaptive IRT', icon: Brain, sheetColor: 'bg-[#FFF3A3]/50 hover:bg-[#FFF3A3]/75', path: '/student/practice' },
            { label: 'Transcripts', note: 'grade A+', icon: BarChart3, sheetColor: 'bg-[#B8F0D2]/50 hover:bg-[#B8F0D2]/75', path: '/student/results' },
            { label: 'Digital Certs', note: 'SHA-256 seal', icon: Award, sheetColor: 'bg-[#FFB5A7]/40 hover:bg-[#FFB5A7]/65', path: '/student/certificates' },
            { label: 'Resume Hub', note: 'PDF verified', icon: Briefcase, sheetColor: 'bg-[#BFE6FF]/40 hover:bg-[#BFE6FF]/65', path: '/student/placement' },
            { label: 'Job Matches', note: '3 tech roles', icon: Sparkles, sheetColor: 'bg-[#FFF3A3]/50 hover:bg-[#FFF3A3]/75', path: '/student/placement' },
            { label: 'Study Plan', note: '5 modules', icon: Calendar, sheetColor: 'bg-[#C9CCFF]/35 hover:bg-[#C9CCFF]/60', path: '/student/courses' },
            { label: 'Security Key', note: 'MFA active', icon: UserCheck, sheetColor: 'bg-white hover:bg-slate-50', path: '/student/settings' },
          ].map((act, i) => {
            const Icon = act.icon;
            return (
              <button
                key={i}
                onClick={() => navigate(act.path)}
                className={`p-3.5 rounded-2xl border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] flex flex-col items-center justify-between text-center space-y-2 transition-transform hover:-translate-y-1 cursor-pointer ${act.sheetColor}`}
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-[#2B2350] flex items-center justify-center shadow-xs">
                  <Icon className="w-4 h-4 text-[#6C4DFF]" />
                </div>
                <div>
                  <span className="font-heading font-extrabold text-xs text-[#2B2350] leading-tight block">
                    {act.label}
                  </span>
                  <span className="text-[9px] font-mono text-[#6B6590] uppercase block mt-0.5">
                    {act.note}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= 3. GRADED ACADEMIC SCORE METRICS ROW ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* CGPA */}
        <div className="relative p-5 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] space-y-2">
          <CropMarks />
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#6B6590]">CUMULATIVE CGPA</span>
            <span className="text-[10px] font-bold bg-[#FFF3A3] text-[#2B2350] border border-[#2B2350] px-2 py-0.5 rounded-full">
              GRADE A+
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-heading text-3xl font-extrabold text-[#2B2350]">3.88</span>
            <span className="text-xs font-mono text-[#6B6590]">/ 4.00</span>
          </div>
          <div className="text-[11px] font-mono text-[#10B981] flex items-center">
            <RedCheck className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span>Top 4% of 2026 Cohort</span>
          </div>
        </div>

        {/* Degree Credits */}
        <div className="relative p-5 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] space-y-2">
          <CropMarks />
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#6B6590]">CREDIT PROGRESS</span>
            <span className="text-[10px] font-bold bg-[#C9CCFF] text-[#2B2350] border border-[#2B2350] px-2 py-0.5 rounded-full">
              78.3%
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-heading text-3xl font-extrabold text-[#2B2350]">94</span>
            <span className="text-xs font-mono text-[#6B6590]">/ 120 ECTS</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-[#FAFAF7] border border-[#2B2350] overflow-hidden">
            <div className="h-full bg-[#6C4DFF] rounded-full" style={{ width: '78.3%' }} />
          </div>
        </div>

        {/* Attendance & Focus */}
        <div className="relative p-5 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] space-y-2">
          <CropMarks />
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#6B6590]">EXAM INTEGRITY</span>
            <span className="text-[10px] font-bold bg-[#B8F0D2] text-[#2B2350] border border-[#2B2350] px-2 py-0.5 rounded-full">
              100% OK
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-heading text-3xl font-extrabold text-[#2B2350]">99.4%</span>
            <span className="text-xs font-mono text-[#6B6590]">Focus</span>
          </div>
          <div className="text-[11px] font-mono text-[#6B6590]">
            0 Browser Violation Flags
          </div>
        </div>

        {/* Placement Readiness */}
        <div className="relative p-5 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] space-y-2">
          <CropMarks />
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#6B6590]">PLACEMENT %ILE</span>
            <span className="text-[10px] font-bold bg-[#FFB5A7] text-[#2B2350] border border-[#2B2350] px-2 py-0.5 rounded-full">
              TIER 1
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-heading text-3xl font-extrabold text-[#2B2350]">96th</span>
            <span className="text-xs font-mono text-[#6B6590]">Percentile</span>
          </div>
          <div className="text-[11px] font-mono text-[#6B6590]">
            Systems & Cloud Track
          </div>
        </div>

        {/* Latest Exam Score */}
        <div className="relative p-5 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] space-y-2">
          <CropMarks />
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#6B6590]">LATEST SCORE</span>
            <span className="text-[10px] font-bold bg-[#FFF3A3] text-[#2B2350] border border-[#2B2350] px-2 py-0.5 rounded-full">
              CS-402
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-heading text-3xl font-extrabold text-[#2B2350]">98/100</span>
            <span className="text-[10px] font-mono font-bold text-[#FF4D5E] border-2 border-[#FF4D5E] px-2 py-0.5 rounded-lg -rotate-6">
              A+ PASS
            </span>
          </div>
          <div className="text-[11px] font-mono text-[#6B6590]">
            Graded in 12s by AI Rubric
          </div>
        </div>
      </section>

      {/* ================= 4. PRIMARY WORKSPACE GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheduled Examinations Roster & Digital Credentials (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Scheduled Examinations Roster */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-5">
            <CropMarks />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-dashed border-[#2B2350]/20 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6C4DFF]">
                    Q1 // UPCOMING ROSTER
                  </span>
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-[#2B2350] mt-0.5">
                  Scheduled Examinations Roster
                </h3>
                <p className="text-xs text-[#6B6590]">Registered high-stakes assessments with active proctoring policies.</p>
              </div>

              <span className="text-xs font-mono font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 self-start sm:self-auto">
                OFFLINE AUTOSAVE READY
              </span>
            </div>

            {/* Exam Rows */}
            <div className="space-y-3 font-mono text-xs">
              {displayExams.map((exam) => (
                <div
                  key={exam.id}
                  className={`p-5 rounded-2xl border-2 border-[#2B2350] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[3px_3px_0px_#2B2350] ${
                    exam.urgent ? 'bg-[#FFF3A3]/30' : 'bg-white'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-[#2B2350] bg-white border border-[#2B2350] px-2 py-0.5 rounded-full">
                        {exam.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${exam.statusColor}`}>
                        {exam.status}
                      </span>
                      {exam.proctored && (
                        <span className="text-[10px] font-bold bg-[#C9CCFF] text-[#2B2350] border border-[#2B2350] px-2 py-0.5 rounded-full">
                          WASM PROCTORED
                        </span>
                      )}
                    </div>

                    <h4 className="font-heading font-extrabold text-base text-[#2B2350]">
                      {exam.title}
                    </h4>

                    <p className="text-xs text-[#6B6590] font-body">
                      Duration: {exam.duration} • {exam.questions} Questions • Multi-modal Bloom Evaluation
                    </p>
                  </div>

                  <Link to="/student/exams/runner" className="shrink-0">
                    <button className="w-full sm:w-auto bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-5 py-2.5 rounded-xl border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350] flex items-center justify-center space-x-1.5 transition-transform hover:-translate-y-0.5 cursor-pointer">
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>START EXAM NOW</span>
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Verifiable Digital Credentials & Badges */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-[#B8F0D2]/25 border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-5">
            <CropMarks />

            <div className="flex items-center justify-between border-b-2 border-dashed border-[#2B2350]/20 pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#10B981]">
                  Q2 // CRYPTOGRAPHIC LEDGER
                </span>
                <h3 className="font-heading text-2xl font-extrabold text-[#2B2350] mt-0.5">
                  Verifiable Digital Credentials
                </h3>
                <p className="text-xs text-[#6B6590]">Ed25519 signed certificates verifiable on public key registries.</p>
              </div>
              <Award className="w-6 h-6 text-[#6C4DFF]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Certificate 1 */}
              <div className="p-5 rounded-2xl bg-white border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold bg-[#C9CCFF] text-[#2B2350] px-2 py-0.5 rounded border border-[#2B2350]">
                    DISTINCTION A+
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-[#2B2350]">
                    Distributed Systems & Raft Architecture
                  </h4>
                  <p className="text-[11px] text-[#6B6590] font-mono mt-1">
                    Issued: Oct 2026 • MIT CS & AI Lab
                  </p>
                </div>
                <div className="pt-2 border-t border-[#2B2350]/15 flex items-center justify-between text-[10px] font-mono text-[#6B6590]">
                  <span>SHA-256: 0x7F9B...38A2</span>
                  <Link to="/student/certificates" className="text-[#6C4DFF] font-bold hover:underline flex items-center">
                    VERIFY <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Certificate 2 */}
              <div className="p-5 rounded-2xl bg-white border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold bg-[#FFF3A3] text-[#2B2350] px-2 py-0.5 rounded border border-[#2B2350]">
                    ZERO-LEAK INTEGRITY
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-[#2B2350]">
                    AssessIQ Wasm Proctoring Integrity Pass
                  </h4>
                  <p className="text-[11px] text-[#6B6590] font-mono mt-1">
                    Issued: Nov 2026 • 100% Gaze Fidelity
                  </p>
                </div>
                <div className="pt-2 border-t border-[#2B2350]/15 flex items-center justify-between text-[10px] font-mono text-[#6B6590]">
                  <span>SHA-256: 0x1A4C...99D0</span>
                  <Link to="/student/certificates" className="text-[#6C4DFF] font-bold hover:underline flex items-center">
                    VERIFY <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Mastery, Career Matches, Quick Drills (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Bloom's AI Mastery Radar */}
          <div className="relative p-6 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-4">
            <CropMarks />

            <div className="flex items-center justify-between border-b-2 border-dashed border-[#2B2350]/20 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6C4DFF]">
                  Q3 // COGNITIVE TAXONOMY
                </span>
                <h3 className="font-heading font-extrabold text-base text-[#2B2350]">
                  Bloom's AI Mastery Insights
                </h3>
              </div>
              <Brain className="w-5 h-5 text-[#6C4DFF]" />
            </div>

            <p className="text-xs text-[#6B6590] font-body">
              Multi-dimensional psychometric evaluation across Bloom's 4 cognitive tiers.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-bold text-[#2B2350]">Analysis & Evaluation</span>
                  <span className="text-[#10B981] font-bold">96%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAFAF7] border border-[#2B2350] overflow-hidden">
                  <div className="h-full bg-[#10B981] rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-bold text-[#2B2350]">Algorithmic Synthesis</span>
                  <span className="text-[#6C4DFF] font-bold">92%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAFAF7] border border-[#2B2350] overflow-hidden">
                  <div className="h-full bg-[#6C4DFF] rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-bold text-[#2B2350]">Conceptual Architecture</span>
                  <span className="text-[#2563EB] font-bold">88%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAFAF7] border border-[#2B2350] overflow-hidden">
                  <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-bold text-[#2B2350]">Memory & Precision</span>
                  <span className="text-[#D97706] font-bold">98%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAFAF7] border border-[#2B2350] overflow-hidden">
                  <div className="h-full bg-[#D97706] rounded-full" style={{ width: '98%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <MarginNote className="-rotate-1">mastery benchmark: top tier</MarginNote>
            </div>
          </div>

          {/* Placement & Career Matches */}
          <div className="relative p-6 rounded-3xl bg-[#FFF3A3]/35 border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-4">
            <CropMarks />

            <div className="flex items-center justify-between border-b-2 border-dashed border-[#2B2350]/20 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2B2350]">
                  Q4 // RECRUITER RADAR
                </span>
                <h3 className="font-heading font-extrabold text-base text-[#2B2350]">
                  Placement & Career Matches
                </h3>
              </div>
              <Briefcase className="w-5 h-5 text-[#2B2350]" />
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#2B2350] flex justify-between items-center shadow-xs">
                <div>
                  <div className="font-bold text-[#2B2350]">Google Cloud Systems</div>
                  <div className="text-[10px] text-[#6B6590]">Distributed Systems Intern</div>
                </div>
                <span className="text-[10px] font-bold bg-[#10B981]/20 text-[#047857] px-2 py-0.5 rounded border border-[#10B981]/40">
                  98% MATCH
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#2B2350] flex justify-between items-center shadow-xs">
                <div>
                  <div className="font-bold text-[#2B2350]">Stripe Infrastructure</div>
                  <div className="text-[10px] text-[#6B6590]">Core Platform Fellow</div>
                </div>
                <span className="text-[10px] font-bold bg-[#6C4DFF]/20 text-[#6C4DFF] px-2 py-0.5 rounded border border-[#6C4DFF]/40">
                  95% MATCH
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#2B2350] flex justify-between items-center shadow-xs">
                <div>
                  <div className="font-bold text-[#2B2350]">Anthropic AI Safety</div>
                  <div className="text-[10px] text-[#6B6590]">Model Evaluation Intern</div>
                </div>
                <span className="text-[10px] font-bold bg-[#D97706]/20 text-[#B45309] px-2 py-0.5 rounded border border-[#D97706]/40">
                  93% MATCH
                </span>
              </div>
            </div>

            <Link to="/student/placement" className="block pt-1">
              <button className="w-full bg-white border-2 border-[#2B2350] hover:bg-[#FFF3A3] text-[#2B2350] font-mono font-bold text-xs py-2 rounded-xl shadow-[2px_2px_0px_#2B2350] transition-colors cursor-pointer">
                OPEN CAREER PORTFOLIO →
              </button>
            </Link>
          </div>

          {/* Daily 5-Min IRT Practice Drill */}
          <div className="relative p-6 rounded-3xl bg-[#FFB5A7]/35 border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-3">
            <CropMarks />

            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#6C4DFF]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2B2350]">
                DAILY COGNITIVE WARMUP
              </span>
            </div>

            <h4 className="font-heading font-extrabold text-base text-[#2B2350]">
              10-Question IRT Speed Drill
            </h4>

            <p className="text-xs text-[#6B6590] font-body">
              Adaptive questions calibrated to your weakest Bloom level. Takes approximately 5 minutes.
            </p>

            <Link to="/student/practice" className="block pt-1">
              <button className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-2.5 rounded-xl border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350] flex items-center justify-center space-x-1.5 transition-transform hover:-translate-y-0.5 cursor-pointer">
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>START 5-MIN DRILL NOW</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
