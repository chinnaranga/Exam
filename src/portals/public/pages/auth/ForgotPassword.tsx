import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from "@/shared/services/authService";
import { toast } from 'sonner';
import { Mail, ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import {
  RedCheck,
  RedCircle,
  CropMarks,
  MarginNote,
} from '@/components/marks';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your institutional email address');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Reset Instructions Dispatched', {
        description: `Check your inbox at ${email} for access key recovery instructions.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Recovery request failed';
      toast.error('Request Failed', { description: message });
    } finally {
      setIsLoading(false);
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
        <Link
          to="/auth/login"
          className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
        >
          ← BACK TO SIGN IN
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-md w-full mx-auto my-auto py-10">
        <div className="relative p-8 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6">
          <CropMarks />

          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto w-12 h-12 bg-[#B8F0D2] border-2 border-[#2B2350] rounded-full flex items-center justify-center shadow-xs">
                <RedCheck className="w-6 h-6" />
              </div>
              <h2 className="font-heading text-2xl font-extrabold text-[#2B2350]">
                Instructions Dispatched
              </h2>
              <p className="text-xs text-[#6B6590] font-body leading-relaxed">
                We sent a secure password reset link to{' '}
                <span className="font-mono font-bold text-[#2B2350] bg-[#FFF3A3] px-1 rounded">{email}</span>.
                Follow the link in your email to choose a new access key.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="w-full mt-4 bg-white border-2 border-[#2B2350] hover:bg-[#FFF3A3]/30 text-[#2B2350] font-mono font-bold text-xs py-3 rounded-2xl shadow-[3px_3px_0px_#2B2350] transition-all"
              >
                RESEND RESET LINK
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div className="border-b-2 border-dashed border-[#2B2350]/20 pb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
                  FORM 03 // KEY RECOVERY
                </span>
                <h1 className="font-heading text-2xl font-extrabold text-[#2B2350] mt-2">
                  Forgot Access <span className="relative inline-block px-1">Key?<RedCircle className="scale-110" /></span>
                </h1>
                <p className="text-xs text-[#6B6590] font-body mt-1">
                  Enter your registered institutional email to receive a password reset link.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="uppercase text-[#2B2350] text-[10px] font-bold tracking-wider">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B6590] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="proctor@institution.edu"
                    className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#2B2350] font-body outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center justify-center space-x-2 transition-all group disabled:opacity-50"
              >
                <span>{isLoading ? 'DISPATCHING...' : 'DISPATCH RESET INSTRUCTIONS'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <span>FORM 03 VERIFIED</span>
      </footer>
    </div>
  );
};

export default ForgotPassword;
