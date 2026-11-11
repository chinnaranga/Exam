import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from "@/shared/stores/authStore";
import { getRoleHomeDashboard } from "@/shared/utils/rbac";
import { ShieldAlert, ArrowLeft, Lock, Sparkles, LayoutGrid, ArrowRight } from 'lucide-react';
import {
  RedCircle,
  CropMarks,
  MarginNote,
} from '@/components/marks';

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userRole = user?.roles?.[0]?.roleName;
  const authorizedDashboard = getRoleHomeDashboard(userRole);

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-body text-[#2B2350] selection:bg-[#FFF3A3] selection:text-[#2B2350] antialiased pencil-cursor flex flex-col justify-between p-4 sm:p-6 lg:p-8">
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
        <Link
          to="/"
          className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
        >
          ← HOME
        </Link>
      </header>

      {/* Main Sheet Card */}
      <main className="max-w-lg w-full mx-auto my-auto py-10 text-center">
        <div className="relative p-8 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-5">
          <CropMarks />

          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFB5A7]/60 border-2 border-[#2B2350] text-[#FF4D5E] flex items-center justify-center shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2 border-b-2 border-dashed border-[#2B2350]/20 pb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFB5A7]/70 text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
              STATUS 403 // FORBIDDEN ACCESS
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-[#2B2350] mt-2">
              Access <span className="relative inline-block px-1">Restricted<RedCircle className="scale-110" /></span>
            </h1>
            <p className="text-xs text-[#6B6590] font-body leading-relaxed max-w-sm mx-auto">
              Your role <span className="font-mono font-bold text-[#2B2350] bg-[#FFF3A3] px-1 rounded">[{user?.roles[0]?.roleName || 'UNAUTHORIZED'}]</span> does not possess the clearance required to enter this examination room.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF3A3]/30 border-2 border-[#2B2350] text-left text-xs font-mono space-y-1">
            <div className="flex items-center text-[#2B2350] font-bold">
              <Lock className="w-3.5 h-3.5 mr-1 text-[#FF4D5E]" />
              <span>RBAC Security Policy Active</span>
            </div>
            <p className="text-[#6B6590] font-body text-[11px]">
              If you require access to this module, contact your Campus Administrator to update your role permissions.
            </p>
          </div>

          <div className="flex justify-center">
            <MarginNote className="-rotate-2">clearance required</MarginNote>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            {userRole && authorizedDashboard !== '/auth/access-denied' && (
              <button
                onClick={() => navigate(authorizedDashboard)}
                className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3 rounded-2xl shadow-[0_4px_12px_rgba(108,77,255,0.25)] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>OPEN YOUR {userRole} WORKSPACE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => navigate(-1)}
                className="w-full sm:w-1/2 bg-white border-2 border-[#2B2350] text-[#2B2350] font-mono font-bold text-xs py-3 rounded-2xl shadow-[2px_2px_0px_#2B2350] flex items-center justify-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>GO BACK</span>
              </button>
              <Link to="/auth" className="w-full sm:w-1/2">
                <button className="w-full bg-[#FFF3A3] hover:bg-[#FFE680] text-[#2B2350] border-2 border-[#2B2350] font-mono font-bold text-xs py-3 rounded-2xl shadow-[2px_2px_0px_#2B2350] flex items-center justify-center space-x-1 cursor-pointer">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>SWITCH ROLE</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <span>RBAC ACCESS GOVERNANCE</span>
      </footer>
    </div>
  );
};

export default AccessDenied;
