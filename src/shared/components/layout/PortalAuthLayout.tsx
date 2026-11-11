import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import BrandLogo from "@/shared/components/BrandLogo";
import { authService } from "@/shared/services/authService";
import { useAuthStore } from "@/shared/stores/authStore";
import { SystemRole } from "@/shared/types/auth";
import { toast } from 'sonner';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import {
  RedCheck,
  RedCircle,
  CropMarks,
  MarginNote,
  OmrBubble,
} from '@/components/marks';

interface PortalAuthLayoutProps {
  portalTitle: string;
  portalSubtitle: string;
  badgeLabel: string;
  badgeColorClass: string;
  accentColor: string;
  defaultEmail: string;
  role: SystemRole;
  redirectPath: string;
  features: string[];
  icon: LucideIcon;
}

const loginSchema = z.object({
  email: z.string().email('Please enter a valid institutional email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const PortalAuthLayout: React.FC<PortalAuthLayoutProps> = ({
  portalTitle,
  portalSubtitle,
  badgeLabel,
  defaultEmail,
  role,
  redirectPath,
  features,
  icon: Icon,
}) => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail,
      password: 'Password123!',
      rememberMe: true,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const session = await authService.login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      setSession(session);
      toast.success('Identity Verified', {
        description: `Welcome to ${portalTitle}. Role: ${role}`,
      });

      navigate(redirectPath);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid institutional credentials.';
      toast.error('Verification Failed', {
        description: message,
      });
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
        <div className="flex items-center space-x-4">
          <Link
            to="/auth"
            className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
          >
            ← CHANGE STATION
          </Link>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#2B2350] bg-[#FFF3A3] text-[#2B2350]">
            {badgeLabel}
          </span>
        </div>
      </header>

      {/* Main Split Screen */}
      <main className="max-w-5xl w-full mx-auto my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Graded Portal Information Sheet */}
        <div className="lg:col-span-6 relative p-8 rounded-3xl bg-[#C9CCFF]/35 border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-6">
          <CropMarks />

          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#2B2350] shadow-xs text-xs font-mono font-bold uppercase text-[#2B2350]">
              <Icon className="w-3.5 h-3.5 text-[#6C4DFF]" />
              <span>STATION DISPATCH</span>
            </div>
            <MarginNote className="-rotate-6">verified pass</MarginNote>
          </div>

          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#2B2350] tracking-tight leading-tight">
              {portalTitle}
            </h1>
            <p className="text-sm text-[#6B6590] mt-2 font-body leading-relaxed">
              {portalSubtitle}
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t-2 border-dashed border-[#2B2350]/20">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6B6590]">
              STATION CLEARANCE CHECKLIST
            </div>
            {features.map((feat, i) => (
              <div key={i} className="flex items-center space-x-2.5 text-xs text-[#2B2350] font-medium">
                <RedCheck className="w-4 h-4 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#6B6590]">
            <span className="flex items-center text-[#2B2350] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5 animate-pulse" />
              SYSTEM 100% HEALTHY
            </span>
            <span className="border-b border-[#2B2350]/30 pb-0.5">ROOM #{role.slice(0, 4)}-01</span>
          </div>
        </div>

        {/* Right Side: Graded Answer Sheet Login Card */}
        <div className="lg:col-span-6">
          <div className="relative p-8 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6">
            <CropMarks />

            <div className="flex items-center justify-between border-b-2 border-dashed border-[#2B2350]/20 pb-4">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-[#2B2350]">
                  Candidate <span className="relative inline-block px-1">Sign-In<RedCircle className="scale-110" /></span>
                </h2>
                <p className="text-xs text-[#6B6590] font-body mt-1">Enter your registered institutional credentials.</p>
              </div>
              <div className="hidden sm:flex items-center space-x-1">
                {['A', 'B', 'C'].map((b, idx) => (
                  <OmrBubble key={b} letter={b} selected={idx === 0} size="sm" />
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="uppercase text-[#2B2350] text-[10px] font-bold tracking-wider">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B6590] absolute left-3.5 top-3" />
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#2B2350] font-body outline-none transition-colors"
                  />
                </div>
                {errors.email && <p className="text-[#FF4D5E] text-[11px] font-mono">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="uppercase text-[#2B2350] text-[10px] font-bold tracking-wider">
                    Access Key / Password
                  </label>
                  <Link to="/auth/forgot-password" className="text-[#6C4DFF] text-[11px] hover:underline font-bold">
                    Forgot key?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B6590] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    {...register('password')}
                    className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#2B2350] font-body outline-none transition-colors"
                  />
                </div>
                {errors.password && <p className="text-[#FF4D5E] text-[11px] font-mono">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center justify-center space-x-2 transition-all group disabled:opacity-50"
              >
                <span>{isLoading ? 'VERIFYING CREDENTIALS...' : `SIGN IN TO ${portalTitle.toUpperCase()}`}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20 gap-3">
        <span>© 2026 AssessIQ Inc. Graded Answer Sheet Dispatch Protocol.</span>
        <div className="flex items-center space-x-4">
          <Link to="/auth" className="hover:text-[#6C4DFF]">Portal Selection</Link>
          <span>•</span>
          <Link to="/" className="hover:text-[#6C4DFF]">Exam Home</Link>
        </div>
      </footer>
    </div>
  );
};

export default PortalAuthLayout;
