import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from "@/shared/stores/authStore";
import { authService } from "@/shared/services/authService";
import { SystemRole } from "@/shared/types/auth";
import { toast } from 'sonner';
import {
  UserCheck,
  Brain,
  Video,
  Building2,
  Server,
  ArrowRight,
  Code,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  RedCheck,
  OmrBubble,
  CropMarks,
  StickerBadge,
} from '@/components/marks';

export const PortalSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, setSession } = useAuthStore();
  const [loadingPortal, setLoadingPortal] = useState<string | null>(null);

  const activeRole = user?.roles?.[0]?.roleName;

  const portals: {
    id: string;
    bubble: string;
    title: string;
    subtitle: string;
    path: string;
    dashboardPath: string;
    demoEmail: string;
    role: SystemRole;
    icon: React.ComponentType<{ className?: string }>;
    sheetColor: string;
    tagBg: string;
    features: string[];
    note: string;
    isComingSoon?: boolean;
    comingSoonQuarter?: string;
  }[] = [
    {
      id: 'student',
      bubble: 'A',
      title: 'Student Portal',
      subtitle: 'Zero-distraction test runner with offline autosave and verifiable digital score sheets.',
      path: '/student/login',
      dashboardPath: '/student/dashboard',
      demoEmail: 'student@mit.edu',
      role: 'STUDENT',
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
      dashboardPath: '/coding/dashboard',
      demoEmail: 'coding.admin@assessiq.com',
      role: 'SUPER_ADMIN',
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
      dashboardPath: '/faculty/dashboard',
      demoEmail: 'faculty@mit.edu',
      role: 'FACULTY',
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
      dashboardPath: '/invigilator/dashboard',
      demoEmail: 'invigilator@mit.edu',
      role: 'INVIGILATOR',
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
      subtitle: 'Campus hierarchy, automated SCIM roster invitations, and custom university branding.',
      path: '/org-admin/coming-soon',
      dashboardPath: '/org-admin/coming-soon',
      demoEmail: 'admin@mit.edu',
      role: 'ORGANIZATION_ADMIN',
      icon: Building2,
      sheetColor: 'bg-[#BFE6FF]/40 hover:bg-[#BFE6FF]/60 border-[#2B2350]',
      tagBg: 'bg-[#BFE6FF] text-[#2B2350]',
      features: ['Campus & Dept Scoping', 'Automated SCIM Directory Sync', 'White-Label Branding'],
      note: 'in roadmap',
      isComingSoon: true,
      comingSoonQuarter: 'Q2 2027',
    },
    {
      id: 'super-admin',
      bubble: 'F',
      title: 'Super Admin Portal',
      subtitle: 'Global multi-tenant infrastructure control plane, RLS isolation & platform cluster health.',
      path: '/super-admin/coming-soon',
      dashboardPath: '/super-admin/coming-soon',
      demoEmail: 'superadmin@assessiq.com',
      role: 'SUPER_ADMIN',
      icon: Server,
      sheetColor: 'bg-white hover:bg-slate-50 border-[#2B2350]',
      tagBg: 'bg-[#E2E8F0] text-[#2B2350]',
      features: ['Postgres RLS Policies', 'Global Cluster Telemetry', 'Immutable Forensic Audit Logs'],
      note: 'in roadmap',
      isComingSoon: true,
      comingSoonQuarter: 'Q2 2027',
    },
  ];

  const handleFastLaunch = async (portal: typeof portals[0]) => {
    if (portal.isComingSoon) {
      toast.info(`${portal.title} is scheduled for ${portal.comingSoonQuarter || 'Q2 2027'} rollout`, {
        description: 'Directing you to the roadmap specifications & early access waitlist.',
      });
      navigate(portal.path);
      return;
    }

    setLoadingPortal(portal.id);
    try {
      const session = await authService.login({
        email: portal.demoEmail,
        password: 'Password123!',
        rememberMe: true,
      });

      setSession(session);
      toast.success('Clearance Granted', {
        description: `Dispatched as ${session.user.firstName} ${session.user.lastName} (${portal.role})`,
      });

      navigate(portal.dashboardPath, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Fast authentication failed.';
      toast.error('Dispatch Failed', { description: message });
    } finally {
      setLoadingPortal(null);
    }
  };

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
          {isAuthenticated && user && (
            <span className="hidden sm:inline-flex text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300 items-center">
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
              ACTIVE: {user.firstName} ({activeRole})
            </span>
          )}
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

      {/* Main Grid */}
      <main className="max-w-7xl w-full mx-auto my-auto py-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-[#6C4DFF] bg-[#C9CCFF]/40 px-3 py-1 rounded-full border border-[#2B2350]">
            <span>STATION ASSIGNMENT SHEET</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#2B2350] tracking-tight">
            Select Your Role Gateway
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6590] font-body">
            Choose your assessment station to enter your authorized workspace. Each portal enforces strict RBAC clearance boundaries.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            const isCurrentlyActive = isAuthenticated && activeRole === portal.role;
            const isBusy = loadingPortal === portal.id;

            return (
              <div
                key={portal.id}
                className={`relative p-6 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-5 shadow-[4px_4px_0px_#2B2350] hover:shadow-[6px_6px_0px_#2B2350] ${portal.sheetColor}`}
              >
                <CropMarks />

                <div className="space-y-4">
                  {/* Top Bar with OMR Bubble and Role Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <OmrBubble letter={portal.bubble} selected size="sm" />
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#2B2350] ${portal.tagBg}`}>
                        {portal.note}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {portal.isComingSoon ? (
                        <StickerBadge color="lemon" rotate={portal.bubble === 'E' ? -3 : 3}>
                          COMING SOON
                        </StickerBadge>
                      ) : isCurrentlyActive ? (
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-400">
                          LOGGED IN
                        </span>
                      ) : null}
                      <div className="w-8 h-8 rounded-xl bg-white border border-[#2B2350] flex items-center justify-center shadow-xs">
                        <Icon className="w-4 h-4 text-[#6C4DFF]" />
                      </div>
                    </div>
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

                {/* Actions: 1-Click Fast Launch + Standard Sign In OR Coming Soon Actions */}
                {portal.isComingSoon ? (
                  <div className="space-y-2 pt-2">
                    <Link to={portal.path} className="block">
                      <button
                        type="button"
                        className="w-full bg-[#FFF3A3] hover:bg-[#FFE680] text-[#2B2350] border-2 border-[#2B2350] font-mono font-bold text-xs py-2 rounded-xl shadow-[2px_2px_0px_#2B2350] flex items-center justify-center space-x-1.5 transition-transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#6C4DFF]" />
                        <span>ROADMAP SPECS ({portal.comingSoonQuarter})</span>
                      </button>
                    </Link>

                    <Link to={portal.path} className="block">
                      <button className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-2.5 rounded-xl shadow-[0_4px_12px_rgba(108,77,255,0.25)] flex items-center justify-center space-x-2 transition-all group cursor-pointer">
                        <span>REQUEST PILOT ACCESS</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleFastLaunch(portal)}
                      disabled={isBusy}
                      className="w-full bg-[#FFF3A3] hover:bg-[#FFE680] text-[#2B2350] border-2 border-[#2B2350] font-mono font-bold text-xs py-2 rounded-xl shadow-[2px_2px_0px_#2B2350] flex items-center justify-center space-x-1.5 transition-transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#6C4DFF] fill-[#6C4DFF]" />
                      <span>{isBusy ? 'LAUNCHING...' : '⚡ 1-CLICK INSTANT DISPATCH'}</span>
                    </button>

                    <Link to={portal.path} className="block">
                      <button className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-2.5 rounded-xl shadow-[0_4px_12px_rgba(108,77,255,0.25)] flex items-center justify-center space-x-2 transition-all group cursor-pointer">
                        <span>SIGN IN FORM</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                )}
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
        </div>
      </footer>
    </div>
  );
};

export default PortalSelection;
