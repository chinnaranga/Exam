import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MOCK_ORGANIZATIONS } from "@/shared/services/authService";
import { useAuthStore } from "@/shared/stores/authStore";
import { SystemRole } from "@/shared/types/auth";
import { toast } from 'sonner';
import { CheckCircle2, Building2, Shield, User, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import {
  RedCheck,
  RedCircle,
  CropMarks,
  MarginNote,
  OmrBubble,
} from '@/components/marks';

export const FirstLoginWizard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const setActiveOrganization = useAuthStore((state) => state.setActiveOrganization);

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [selectedOrg, setSelectedOrg] = useState(MOCK_ORGANIZATIONS[0]);
  const [selectedRole, setSelectedRole] = useState<SystemRole>('ORGANIZATION_ADMIN');

  const handleCompleteOnboarding = () => {
    updateUser({
      firstName,
      lastName,
      roles: [{ roleName: selectedRole, organizationId: selectedOrg.id }],
    });
    setActiveOrganization(selectedOrg);
    toast.success('Onboarding Completed!', {
      description: `Welcome to AssessIQ. Active Role: ${selectedRole}`,
    });
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
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
          FORM 10 // CANDIDATE ONBOARDING
        </span>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto my-auto py-10">
        <div className="relative p-8 sm:p-10 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6">
          <CropMarks />

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-[#2B2350]/20 pb-4">
            {[
              { num: 1, title: 'Profile Setup' },
              { num: 2, title: 'Campus Context' },
              { num: 3, title: 'Role Clearance' },
            ].map((s) => (
              <div key={s.num} className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full border-2 border-[#2B2350] flex items-center justify-center text-xs font-mono font-bold transition-all ${
                    step === s.num
                      ? 'bg-[#6C4DFF] text-white'
                      : step > s.num
                      ? 'bg-[#B8F0D2] text-[#2B2350]'
                      : 'bg-white text-[#6B6590]'
                  }`}
                >
                  {step > s.num ? <RedCheck className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-mono font-bold hidden sm:inline ${step === s.num ? 'text-[#2B2350]' : 'text-[#6B6590]'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Profile */}
          {step === 1 && (
            <div className="space-y-4 font-mono text-xs">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-[#2B2350]">
                  Step 1: Confirm <span className="relative inline-block px-1">Identity<RedCircle className="scale-110" /></span>
                </h2>
                <p className="text-xs text-[#6B6590] font-body mt-1">Please verify your legal profile details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="uppercase text-[#2B2350] text-[10px] font-bold">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2B2350] font-body outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase text-[#2B2350] text-[10px] font-bold">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2B2350] font-body outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-4 bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center justify-center space-x-2 transition-all"
              >
                <span>CONTINUE TO CAMPUS CONTEXT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Tenant Context */}
          {step === 2 && (
            <div className="space-y-4 font-mono text-xs">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-[#2B2350]">
                  Step 2: Campus <span className="relative inline-block px-1">Context<RedCircle className="scale-110" /></span>
                </h2>
                <p className="text-xs text-[#6B6590] font-body mt-1">Select your primary institution.</p>
              </div>

              <div className="space-y-2 pt-2">
                {MOCK_ORGANIZATIONS.map((org) => (
                  <div
                    key={org.id}
                    onClick={() => setSelectedOrg(org)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      selectedOrg.id === org.id
                        ? 'bg-[#FFF3A3]/50 border-[#2B2350] shadow-xs'
                        : 'bg-white border-[#2B2350]/30 hover:border-[#2B2350]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#2B2350]/30 flex items-center justify-center font-bold text-xs text-[#2B2350]">
                        {org.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-heading font-extrabold text-sm text-[#2B2350]">{org.name}</div>
                        <div className="text-[11px] text-[#6B6590]">{org.slug}.assessiq.io</div>
                      </div>
                    </div>
                    {selectedOrg.id === org.id && <RedCheck className="w-4 h-4" />}
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-white border-2 border-[#2B2350] text-[#2B2350] font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[2px_2px_0px_#2B2350]"
                >
                  ← BACK
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center justify-center space-x-2"
                >
                  <span>NEXT: ROLE ASSIGNMENT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Role Assignment */}
          {step === 3 && (
            <div className="space-y-4 font-mono text-xs">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-[#2B2350]">
                  Step 3: Role <span className="relative inline-block px-1">Clearance<RedCircle className="scale-110" /></span>
                </h2>
                <p className="text-xs text-[#6B6590] font-body mt-1">Select your designated access level.</p>
              </div>

              <div className="space-y-2 pt-2">
                {(['STUDENT', 'FACULTY', 'INVIGILATOR', 'ORGANIZATION_ADMIN', 'SUPER_ADMIN'] as SystemRole[]).map((r) => (
                  <div
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      selectedRole === r
                        ? 'bg-[#B8F0D2]/50 border-[#2B2350] shadow-xs'
                        : 'bg-white border-[#2B2350]/30 hover:border-[#2B2350]'
                    }`}
                  >
                    <span className="font-heading font-extrabold text-xs text-[#2B2350]">{r}</span>
                    {selectedRole === r && <RedCheck className="w-4 h-4" />}
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-white border-2 border-[#2B2350] text-[#2B2350] font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[2px_2px_0px_#2B2350]"
                >
                  ← BACK
                </button>
                <button
                  onClick={handleCompleteOnboarding}
                  className="w-2/3 bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center justify-center space-x-2"
                >
                  <span>COMPLETE ONBOARDING</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <MarginNote className="-rotate-2">onboarding checklist</MarginNote>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <span>FORM 10 VERIFIED</span>
      </footer>
    </div>
  );
};

export default FirstLoginWizard;
