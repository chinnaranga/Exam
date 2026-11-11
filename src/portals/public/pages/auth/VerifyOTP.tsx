import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { KeyRound, Sparkles, ArrowRight } from 'lucide-react';
import {
  RedCheck,
  RedCircle,
  CropMarks,
  MarginNote,
} from '@/components/marks';

export const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (val: string, index: number) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Please enter complete 6-digit OTP code');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Passcode Verified');
      navigate('/');
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

          <div className="border-b-2 border-dashed border-[#2B2350]/20 pb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
              FORM 05 // MFA PASSCODE
            </span>
            <h1 className="font-heading text-2xl font-extrabold text-[#2B2350] mt-2">
              Enter 6-Digit <span className="relative inline-block px-1">Passcode<RedCircle className="scale-110" /></span>
            </h1>
            <p className="text-xs text-[#6B6590] font-body mt-1">
              Enter the one-time code sent to your registered institutional device.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-between gap-2 max-w-xs mx-auto">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  className="w-11 h-13 text-center text-xl font-mono font-bold bg-[#FFF3A3]/25 border-2 border-[#2B2350] text-[#2B2350] rounded-xl focus:border-[#6C4DFF] focus:bg-white outline-none shadow-xs"
                />
              ))}
            </div>

            <div className="flex justify-center">
              <MarginNote className="-rotate-3">timed 60s</MarginNote>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center justify-center space-x-2 transition-all group disabled:opacity-50"
            >
              <span>{isLoading ? 'VERIFYING CODE...' : 'VERIFY PASSCODE & CONTINUE'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <span>FORM 05 VERIFIED</span>
      </footer>
    </div>
  );
};

export default VerifyOTP;
