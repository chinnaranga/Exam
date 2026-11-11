import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import BrandLogo from "@/shared/components/BrandLogo";
import { authService } from "@/shared/services/authService";
import { useAuthStore } from "@/shared/stores/authStore";
import { SystemRole } from "@/shared/types/auth";
import { toast } from 'sonner';
import { Lock, Mail, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  RedCheck,
  RedCircle,
  CropMarks,
  MarginNote,
  OmrBubble,
} from '@/components/marks';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid institutional email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<SystemRole>('ORGANIZATION_ADMIN');

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@mit.edu',
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
        description: `Welcome back, ${session.user.firstName}! Active Role: ${session.user.roles[0]?.roleName}`,
      });

      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password.';
      toast.error('Authentication Failed', {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRoleSelect = (email: string, role: SystemRole) => {
    setValue('email', email);
    setValue('password', 'Password123!');
    setSelectedDemoRole(role);
    toast.info(`Preset Loaded: ${role}`, { description: `Credentials populated for ${email}` });
  };

  const DEMO_PRESETS: { label: string; email: string; role: SystemRole; bubble: string }[] = [
    { label: 'Student', email: 'student@mit.edu', role: 'STUDENT', bubble: 'A' },
    { label: 'Faculty', email: 'faculty@mit.edu', role: 'FACULTY', bubble: 'B' },
    { label: 'Invigilator', email: 'proctor@mit.edu', role: 'INVIGILATOR', bubble: 'C' },
    { label: 'Org Admin', email: 'admin@mit.edu', role: 'ORGANIZATION_ADMIN', bubble: 'D' },
    { label: 'Super Admin', email: 'root@assessiq.com', role: 'SUPER_ADMIN', bubble: 'E' },
  ];

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
        <div className="flex items-center space-x-3">
          <Link
            to="/auth"
            className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
          >
            ROLE GATEWAYS →
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Overview & Quick Presets */}
        <div className="lg:col-span-5 relative p-8 rounded-3xl bg-[#C9CCFF]/35 border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-6">
          <CropMarks />

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
              FORM 00 // GLOBAL ACCESS
            </span>
            <MarginNote className="-rotate-6">pencil ready</MarginNote>
          </div>

          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#2B2350] tracking-tight leading-tight">
              Sign In to <span className="relative inline-block px-1">AssessIQ<RedCircle className="scale-110" /></span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6590] mt-2 font-body leading-relaxed">
              Zero-leak assessment environment for students, educators, and proctors.
            </p>
          </div>

          {/* Quick Demo Preset Selection with OMR bubbles */}
          <div className="space-y-2 pt-2 border-t-2 border-dashed border-[#2B2350]/20">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2B2350]">
              QUICK ROLE PRESETS (ONE-CLICK)
            </div>
            <div className="space-y-1.5">
              {DEMO_PRESETS.map((p) => {
                const isActive = selectedDemoRole === p.role;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleQuickRoleSelect(p.email, p.role)}
                    className={`w-full p-2.5 rounded-xl border-2 font-mono text-xs flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-[#FFF3A3] border-[#2B2350] shadow-[2px_2px_0px_#2B2350]'
                        : 'bg-white/80 border-[#2B2350]/30 hover:border-[#2B2350]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full border border-[#2B2350] flex items-center justify-center font-bold text-[10px] bg-white">
                        {p.bubble}
                      </span>
                      <span className="font-bold text-[#2B2350]">{p.label}</span>
                    </div>
                    <span className="text-[10px] text-[#6B6590]">{p.email}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Sign-In Form */}
        <div className="lg:col-span-7">
          <div className="relative p-8 sm:p-10 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6">
            <CropMarks />

            <div className="border-b-2 border-dashed border-[#2B2350]/20 pb-4">
              <h2 className="font-heading text-2xl font-extrabold text-[#2B2350]">
                Institutional Credentials
              </h2>
              <p className="text-xs text-[#6B6590] font-body mt-1">
                Enter your registered campus email and password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="uppercase text-[#2B2350] text-[10px] font-bold tracking-wider">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B6590] absolute left-3.5 top-3" />
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#2B2350] font-body outline-none"
                  />
                </div>
                {errors.email && <p className="text-[#FF4D5E] text-[11px] font-mono">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="uppercase text-[#2B2350] text-[10px] font-bold tracking-wider">
                    Password / Access Key
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
                    className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#2B2350] font-body outline-none"
                  />
                </div>
                {errors.password && <p className="text-[#FF4D5E] text-[11px] font-mono">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center justify-center space-x-2 transition-all group disabled:opacity-50"
              >
                <span>{isLoading ? 'VERIFYING CREDENTIALS...' : 'SIGN IN & ENTER WORKSPACE'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <span>GLOBAL IDENTITY DISPATCH PROTOCOL</span>
      </footer>
    </div>
  );
};

export default Login;
