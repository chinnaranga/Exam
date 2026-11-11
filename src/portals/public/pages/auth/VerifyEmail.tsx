import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from "@/shared/components/BrandLogo";
import { Mail, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  RedCheck,
  RedCircle,
  CropMarks,
  MarginNote,
} from '@/components/marks';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      toast.success('Verification Dispatched', {
        description: 'Check your institutional inbox for the confirmation link.',
      });
    }, 600);
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
          to="/auth/login"
          className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
        >
          ← BACK TO SIGN IN
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-md w-full mx-auto my-auto py-10">
        <div className="relative p-8 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6 text-center">
          <CropMarks />

          <div className="p-3.5 rounded-2xl bg-[#FFF3A3] text-[#2B2350] border-2 border-[#2B2350] w-fit mx-auto shadow-xs">
            <Mail className="w-7 h-7" />
          </div>

          <div className="space-y-2 border-b-2 border-dashed border-[#2B2350]/20 pb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
              FORM 06 // EMAIL VERIFICATION
            </span>
            <h1 className="font-heading text-2xl font-extrabold text-[#2B2350] mt-2">
              Check Your <span className="relative inline-block px-1">Inbox<RedCircle className="scale-110" /></span>
            </h1>
            <p className="text-xs text-[#6B6590] font-body leading-relaxed">
              We sent a verification link to your email address. Click the link to activate your institutional profile.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <button
              onClick={() => navigate('/auth/login')}
              className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center justify-center space-x-2 transition-all"
            >
              <span>CONTINUE TO SIGN IN</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div>
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-xs text-[#6C4DFF] font-bold hover:underline inline-flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isResending ? 'animate-spin' : ''}`} />
                <span>{isResending ? 'Resending Link...' : 'Resend Verification Email'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <MarginNote className="-rotate-2">check spam folder</MarginNote>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <span>FORM 06 VERIFIED</span>
      </footer>
    </div>
  );
};

export default VerifyEmail;
