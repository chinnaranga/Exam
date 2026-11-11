import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MOCK_ORGANIZATIONS } from "@/shared/services/authService";
import { useAuthStore } from "@/shared/stores/authStore";
import { SystemRole } from "@/shared/types/auth";
import { toast } from 'sonner';
import { CheckCircle2, Building2, Shield, User, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

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
      description: `Welcome to ExamifyPro Enterprise. Active Role: ${selectedRole}`,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] via-[#111827] to-[#1e1b4b] flex items-center justify-center p-4">
      <Card className="glass-card border-white/10 p-8 max-w-2xl w-full shadow-2xl backdrop-blur-xl bg-surface/30">
        {/* Wizard Stepper Progress Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
          {[
            { num: 1, title: 'Profile Setup' },
            { num: 2, title: 'Tenant Context' },
            { num: 3, title: 'Role Assignment' },
          ].map((s) => (
            <div key={s.num} className="flex items-center space-x-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : step > s.num
                    ? 'bg-green-500 text-white'
                    : 'bg-surface-dark text-gray-500'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-white' : 'text-gray-400'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Profile Setup */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Step 1: Confirm Profile Identity</h2>
              <p className="text-xs text-gray-400">Verify your display name across institutional assessment rosters</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300 uppercase font-medium">First Name</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-surface-dark border-white/10 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300 uppercase font-medium">Last Name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-surface-dark border-white/10 text-white" />
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold mt-4">
              Continue to Tenant Selection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Tenant Context */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Step 2: Select Organization Context</h2>
              <p className="text-xs text-gray-400">Choose the enterprise campus context to activate on login</p>
            </div>

            <div className="space-y-3">
              {MOCK_ORGANIZATIONS.map((org) => (
                <div
                  key={org.id}
                  onClick={() => setSelectedOrg(org)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedOrg.id === org.id
                      ? 'bg-primary/15 border-primary text-white'
                      : 'bg-surface-dark/80 border-white/5 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-semibold text-sm text-white">{org.name}</h3>
                      <p className="text-xs text-gray-400 font-mono">{org.slug}.examifypro.com</p>
                    </div>
                  </div>
                  {selectedOrg.id === org.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
              ))}
            </div>

            <div className="flex space-x-3 mt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="w-1/2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="w-1/2 bg-primary hover:bg-primary-dark text-white font-semibold">
                Continue to Role Config
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Role Config */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Step 3: Select Workspace Access Scope</h2>
              <p className="text-xs text-gray-400">Choose the RBAC workspace role permissions for your session</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { role: 'ORGANIZATION_ADMIN' as SystemRole, title: 'Organization Admin', desc: 'Full tenant management rights' },
                { role: 'FACULTY' as SystemRole, title: 'Faculty / Professor', desc: 'Question authoring & grading' },
                { role: 'INVIGILATOR' as SystemRole, title: 'Live Invigilator', desc: 'Real-time candidate proctoring' },
                { role: 'STUDENT' as SystemRole, title: 'Candidate / Student', desc: 'Take exams & view results' },
              ].map((item) => (
                <div
                  key={item.role}
                  onClick={() => setSelectedRole(item.role)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedRole === item.role
                      ? 'bg-primary/15 border-primary text-white'
                      : 'bg-surface-dark/80 border-white/5 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">{item.title}</span>
                    {selectedRole === item.role && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => setStep(2)} className="w-1/2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleCompleteOnboarding} className="w-1/2 bg-primary hover:bg-primary-dark text-white font-semibold shadow-lg shadow-primary/25">
                Complete Setup & Launch
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FirstLoginWizard;
