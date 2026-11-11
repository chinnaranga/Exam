import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MOCK_ORGANIZATIONS } from "@/shared/services/authService";
import { useAuthStore } from "@/shared/stores/authStore";
import { useTenantStore } from "@/shared/stores/tenantStore";
import { toast } from 'sonner';
import { Building2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  RedCheck,
  RedCircle,
  CropMarks,
  MarginNote,
  OmrBubble,
} from '@/components/marks';

export const SelectTenant: React.FC = () => {
  const navigate = useNavigate();
  const setActiveOrganization = useAuthStore((state) => state.setActiveOrganization);
  const activeOrganization = useAuthStore((state) => state.activeOrganization);
  const user = useAuthStore((state) => state.user);

  const handleSelectOrg = (org: typeof MOCK_ORGANIZATIONS[0]) => {
    localStorage.setItem('assessiq_tenant_id', org.id);
    setActiveOrganization(org);
    useTenantStore.getState().selectOrganization(org.id);
    toast.success(`Active Tenant Set: ${org.name}`);
    navigate('/');
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
        <Link
          to="/"
          className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
        >
          ← HOME
        </Link>
      </header>

      {/* Main Sheet */}
      <main className="max-w-3xl w-full mx-auto my-auto py-10">
        <div className="relative p-8 sm:p-10 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6">
          <CropMarks />

          <div className="border-b-2 border-dashed border-[#2B2350]/20 pb-4 text-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
              FORM 09 // TENANT ROUTING
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-[#2B2350] mt-2">
              Select Active <span className="relative inline-block px-1">Organization<RedCircle className="scale-110" /></span>
            </h1>
            <p className="text-xs text-[#6B6590] font-body mt-1">
              Logged in as <span className="font-mono font-bold text-[#2B2350] bg-[#FFF3A3] px-1 rounded">{user?.email || 'admin@assessiq.com'}</span>. Choose your active workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_ORGANIZATIONS.map((org, idx) => {
              const isSelected = activeOrganization?.id === org.id;

              return (
                <div
                  key={org.id}
                  onClick={() => handleSelectOrg(org)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-[4px_4px_0px_#2B2350] hover:shadow-[6px_6px_0px_#2B2350] hover:-translate-y-0.5 ${
                    isSelected
                      ? 'bg-[#FFF3A3]/50 border-[#2B2350]'
                      : 'bg-[#C9CCFF]/25 border-[#2B2350]/50 hover:border-[#2B2350]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-9 w-9 rounded-xl bg-white border-2 border-[#2B2350] flex items-center justify-center font-mono font-bold text-xs text-[#2B2350]">
                        {org.name.substring(0, 2).toUpperCase()}
                      </div>
                      {isSelected ? (
                        <RedCheck className="w-5 h-5" />
                      ) : (
                        <span className="text-[10px] font-mono text-[#6B6590]">SELECT →</span>
                      )}
                    </div>
                    <h3 className="font-heading font-extrabold text-base text-[#2B2350]">{org.name}</h3>
                    <p className="text-xs text-[#6B6590] font-mono mt-1">{org.slug}.assessiq.io</p>
                  </div>

                  <div className="pt-2 border-t border-[#2B2350]/15 flex items-center justify-between text-[11px] font-mono text-[#2B2350]">
                    <span>STATUS: ACTIVE</span>
                    <span className="text-[#6C4DFF] font-bold">SWITCH →</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-2">
            <MarginNote className="-rotate-2">click to activate</MarginNote>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <span>FORM 09 VERIFIED</span>
      </footer>
    </div>
  );
};

export default SelectTenant;
