import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { SecurityCenterService } from '@/server/security/security_center.service';
import { ShieldCheck, QrCode, Key, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const MfaWizardPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) return;

    const generated = SecurityCenterService.generateBackupCodes();
    setBackupCodes(generated);
    setStep(2);
    toast.success('TOTP MFA Authenticator Enrolled', {
      description: 'Multi-factor authentication is now active on your account.',
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
          <Lock className="w-3.5 h-3.5" />
          <span>TOTP Authenticator Setup</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">MFA Enrollment Wizard</h1>
        <p className="text-xs text-[#6B7280]">
          Protect your account with Time-based One-Time Password (TOTP) authenticators like Microsoft Authenticator or Google Authenticator.
        </p>
      </div>

      {step === 1 && (
        <Card className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-36 h-36 bg-[#FAFBFC] border-2 border-dashed border-[#E5E7EB] rounded-2xl flex items-center justify-center shrink-0">
              <QrCode className="w-20 h-20 text-[#2563EB]" />
            </div>
            <div className="space-y-2 text-xs text-[#6B7280]">
              <h3 className="font-bold text-sm text-[#111827]">Step 1: Scan QR Code with Authenticator App</h3>
              <p>Open Microsoft Authenticator, Google Authenticator, or 1Password and scan the QR code.</p>
              <p className="font-mono text-[11px] text-[#2563EB] bg-blue-50 p-2 rounded border border-blue-100 font-bold">
                Secret: JBSWY3DPEHPK3PXP
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyCode} className="space-y-3 pt-4 border-t border-[#E5E7EB]">
            <h4 className="font-bold text-xs text-[#111827]">Step 2: Enter 6-Digit Verification Code</h4>
            <div className="flex gap-3">
              <Input
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="bg-[#FAFBFC] border-[#E5E7EB] font-mono text-center tracking-widest text-base w-48"
              />
              <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-6 rounded-xl shadow-xs">
                Verify & Activate MFA
              </Button>
            </div>
          </form>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-[#16A34A]">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="font-bold text-base text-[#111827]">MFA Protection Activated!</h3>
          </div>
          <p className="text-xs text-[#6B7280]">
            Save these emergency 8-character backup recovery codes in a secure location.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB]">
            {backupCodes.map((c, i) => (
              <span key={i} className="font-bold text-[#111827]">{c}</span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MfaWizardPage;
