import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import BrandLogo from "@/shared/components/BrandLogo";
import { Mail, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      toast.success('Verification Email Dispatched', {
        description: 'Check your inbox for the 6-digit confirmation link.',
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] font-sans text-[#111827] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-6 text-center">
        <div className="flex justify-center">
          <BrandLogo size="lg" variant="light" />
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 text-[#2563EB] w-fit mx-auto border border-blue-100">
          <Mail className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#111827]">Verify Your Email Address</h1>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            We dispatched a 6-digit verification code to your email address. Confirm to activate your tenant membership.
          </p>
        </div>

        <div className="pt-2 space-y-3 font-mono text-xs">
          <Button onClick={() => navigate('/auth/login')} className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-2.5 rounded-xl shadow-xs">
            Continue to Identity Sign In
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-xs text-[#2563EB] font-bold hover:underline inline-flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isResending ? 'animate-spin' : ''}`} />
            <span>{isResending ? 'Resending Link...' : 'Resend Verification Email'}</span>
          </button>
        </div>

        <div className="pt-4 border-t border-[#F1F5F9] text-[11px] font-mono text-[#9CA3AF]">
          Microsoft Entra ID / Okta Grade Identity Protection
        </div>
      </Card>
    </div>
  );
};

export default VerifyEmail;
