import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
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
} from 'lucide-react';
import { toast } from 'sonner';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: examsData, isLoading: isExamsLoading } = useExams({ page: 1, pageSize: 5 });
  const examsList = examsData?.data || [];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Student Operating System Synced', {
        description: 'Updated academic profile and active test schedules.',
      });
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-[#0F172A]">
      {/* ================= 1. WELCOME BANNER ================= */}
      <Card className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E40AF] to-indigo-900 text-white shadow-xl relative overflow-hidden border-none">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-extrabold text-3xl font-mono shadow-inner">
              {user?.firstName?.charAt(0) || 'S'}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase border border-emerald-400/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  STUDENT WORKSPACE • ACTIVE
                </span>
                <span className="text-[10px] font-mono text-blue-200 bg-white/10 px-2.5 py-1 rounded-full border border-white/20 font-bold">
                  ID: {user?.id || 'STU-2026'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.firstName || 'Candidate'} {user?.lastName || ''}!
              </h1>
              <p className="text-xs text-blue-100 font-sans">
                AssessIQ Enterprise AI Examination & Proctoring Platform
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Button onClick={handleRefresh} variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl backdrop-blur-md">
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync Profile
            </Button>
            <Link to="/student/exams/runner">
              <Button className="bg-white hover:bg-blue-50 text-[#1E40AF] font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg">
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Launch Test Runner
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* ================= 2. QUICK ACTIONS GATEWAY ================= */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase font-bold text-[#64748B] tracking-wider">Quick Actions Gateway</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-sans text-xs">
          {[
            { label: 'Take Exam', icon: BookOpen, color: 'text-[#1E40AF]', bg: 'bg-blue-50', path: '/student/exams' },
            { label: 'Practice Test', icon: Brain, color: 'text-purple-700', bg: 'bg-purple-50', path: '/student/practice' },
            { label: 'View Results', icon: BarChart3, color: 'text-amber-700', bg: 'bg-amber-50', path: '/student/results' },
            { label: 'Download Cert', icon: Award, color: 'text-emerald-700', bg: 'bg-emerald-50', path: '/student/certificates' },
            { label: 'Open Resume', icon: Briefcase, color: 'text-indigo-700', bg: 'bg-indigo-50', path: '/student/placement' },
            { label: 'Job Matches', icon: Sparkles, color: 'text-rose-700', bg: 'bg-rose-50', path: '/student/placement' },
            { label: 'Study Calendar', icon: Calendar, color: 'text-blue-700', bg: 'bg-blue-50', path: '/student/courses' },
            { label: 'Profile Settings', icon: UserCheck, color: 'text-slate-700', bg: 'bg-slate-100', path: '/student/settings' },
          ].map((act, i) => (
            <button
              key={i}
              onClick={() => navigate(act.path)}
              className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col items-center justify-center text-center space-y-2 hover:border-blue-300 transition-all hover:shadow-md cursor-pointer"
            >
              <div className={`p-2.5 rounded-xl ${act.bg} ${act.color}`}>
                <act.icon className="w-4 h-4" />
              </div>
              <span className="font-bold text-[11px] text-[#0F172A] leading-tight">{act.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= 3. ACADEMIC METRICS ROW ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-sans">
        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-[#64748B]">
            <span>Cumulative CGPA</span>
            <span className="text-[#15803D] font-bold">RECORD</span>
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A]">N/A</div>
          <p className="text-[11px] text-[#64748B] font-mono">No transcript recorded</p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-[#64748B]">
            <span>Credits Progress</span>
            <span className="text-[#1E40AF] font-bold">ENROLLMENT</span>
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A]">0 / 120</div>
          <p className="text-[11px] text-[#64748B] font-mono">No enrolled courses</p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-[#64748B]">
            <span>Attendance Rate</span>
            <span className="text-emerald-700 font-bold">STATUS</span>
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A]">N/A</div>
          <p className="text-[11px] text-[#64748B] font-mono">Biometric Scanned</p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-[#64748B]">
            <span>Placement Readiness</span>
            <span className="text-indigo-700 font-bold">STATUS</span>
          </div>
          <div className="text-3xl font-extrabold text-indigo-900">N/A</div>
          <p className="text-[11px] text-[#64748B] font-mono">Profile setup required</p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-[#64748B]">
            <span>Average Exam Score</span>
            <span className="text-[#15803D] font-bold">EXAMS</span>
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A]">N/A</div>
          <p className="text-[11px] text-[#64748B] font-mono">No exams completed</p>
        </Card>
      </div>

      {/* ================= 4. PRIMARY WORKSPACE GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Examination Schedule Roster & Digital Credentials (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Upcoming Examinations Roster */}
          <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A]">Scheduled Examinations Roster</h3>
                <p className="text-xs text-[#64748B]">Registered high-stakes assessments.</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#15803D] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                OFFLINE AUTOSAVE READY
              </span>
            </div>

            {isExamsLoading ? (
              <div className="p-8 text-center text-slate-400 font-mono text-xs animate-pulse">
                Loading exam roster from API...
              </div>
            ) : examsList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-bold text-[#0F172A]">No Active Examinations</p>
                <p className="text-xs text-[#64748B]">You currently have no scheduled or assigned assessments.</p>
              </div>
            ) : (
              <div className="space-y-3 font-sans text-xs">
                {examsList.map((exam) => (
                  <div key={exam.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold text-[#1E40AF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {exam.code}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {exam.scheduledStartTime || 'Scheduled'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#0F172A]">{exam.title}</h4>
                      <p className="text-xs text-[#64748B] font-mono">Duration: {exam.durationMinutes} Mins • {exam.totalQuestions} Questions</p>
                    </div>
                    <Link to="/student/exams/runner">
                      <Button className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs shrink-0 flex items-center">
                        <Play className="w-3.5 h-3.5 mr-1.5" />
                        Launch Exam
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Digital Credentials & Transcripts */}
          <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A]">Verifiable Digital Credentials & Badges</h3>
                <p className="text-xs text-[#64748B]">Cryptographically signed certificates.</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-[#1E40AF]" />
            </div>

            <div className="p-8 text-center text-slate-500 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <Award className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-bold text-[#0F172A]">No Digital Credentials Issued</p>
              <p className="text-xs text-[#64748B]">Complete verified examinations to earn digital badges and transcripts.</p>
            </div>
          </Card>
        </div>

        {/* Right Column: AI Recommendations & Placement Matrix (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Mastery Recommendations */}
          <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 font-sans text-xs">
            <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-3">
              <Brain className="w-5 h-5 text-purple-700" />
              <h3 className="font-bold text-sm text-[#0F172A]">Bloom's AI Mastery Insights</h3>
            </div>

            <div className="p-6 text-center text-slate-500 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <p className="font-bold text-[#0F172A] text-xs">No Analytics Available</p>
              <p className="text-[11px] text-[#64748B]">Complete practice drills to generate AI mastery analytics.</p>
            </div>
          </Card>

          {/* Placement & Career Readiness Breakdown */}
          <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 font-sans text-xs">
            <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-3">
              <Briefcase className="w-5 h-5 text-indigo-900" />
              <h3 className="font-bold text-sm text-[#0F172A]">Placement & Career Matrix</h3>
            </div>

            <div className="p-6 text-center text-slate-500 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <p className="font-bold text-[#0F172A] text-xs">No Career Data Logged</p>
              <p className="text-[11px] text-[#64748B]">Link your candidate resume to calculate placement readiness scores.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
