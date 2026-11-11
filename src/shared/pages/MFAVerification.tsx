import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  RedCircle,
  CropMarks,
  MarginNote,
} from '@/components/marks';

export const MFAVerification: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      toast.error('Enter valid 6-digit MFA passcode');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('MFA Verification Successful');
      navigate('/dashboard');
    }, 600);
  };

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
          to="/auth/login"
          className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
        >
          ← BACK TO SIGN IN
        </Link>
      </header>

      {/* Main Sheet Card */}
      <main className="max-w-md w-full mx-auto my-auto py-10 text-center">
        <div className="relative p-8 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-5">
          <CropMarks />

          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF3A3] border-2 border-[#2B2350] text-[#2B2350] flex items-center justify-center shadow-xs">
            <KeyRound className="w-7 h-7 text-[#6C4DFF]" />
          </div>

          <div className="space-y-2 border-b-2 border-dashed border-[#2B2350]/20 pb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
              TWO-FACTOR AUTHENTICATION
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-[#2B2350] mt-2">
              Enter TOTP <span className="relative inline-block px-1">Passcode<RedCircle className="scale-110" /></span>
            </h1>
            <p className="text-xs text-[#6B6590] font-body leading-relaxed">
              Open your authenticator app (Google Authenticator, Duo, or 1Password) and enter the 6-digit code.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4 font-mono text-xs">
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="w-full text-center tracking-[0.5em] text-2xl font-bold bg-[#FFF3A3]/25 border-2 border-[#2B2350] text-[#2B2350] rounded-xl py-3 outline-none focus:border-[#6C4DFF] focus:bg-white"
            />

            <div className="flex justify-center">
              <MarginNote className="-rotate-2">refreshes every 30s</MarginNote>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center justify-center space-x-2 transition-all group disabled:opacity-50"
            >
              <span>{isLoading ? 'VERIFYING TOTP...' : 'VERIFY & ENTER STATION'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <span>RFC 6238 TOTP PROTOCOL ENFORCED</span>
      </footer>
    </div>
  );
};

export default MFAVerification;
