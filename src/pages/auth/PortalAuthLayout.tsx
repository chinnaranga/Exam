import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import BrandLogo from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { SystemRole } from '@/types/auth';
import { toast } from 'sonner';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Globe,
  LucideIcon,
  Server,
  Building2,
  Brain,
  Video,
  UserCheck,
} from 'lucide-react';

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
  badgeColorClass,
  accentColor,
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
      toast.success('Authenticated successfully', {
        description: `Welcome to ${portalTitle}. Active Role: ${role}`,
      });

      navigate(redirectPath);
    } catch (err: any) {
      toast.error('Authentication Failed', {
        description: err.message || 'Invalid institutional credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] font-sans text-[#0F172A] flex flex-col justify-between p-6">
      {/* Header Bar */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 border-b border-[#E2E8F0]">
        <Link to="/auth" className="flex items-center space-x-3">
          <BrandLogo size="md" variant="light" />
        </Link>
        <div className="flex items-center space-x-3">
          <Link to="/auth" className="text-xs text-[#475569] hover:text-[#0F172A] font-semibold">
            ← Change Portal
          </Link>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeColorClass}`}>
            {badgeLabel}
          </span>
        </div>
      </header>

      {/* Main Split Screen */}
      <main className="max-w-6xl w-full mx-auto my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Portal Value Highlights */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-xs text-xs font-mono font-bold uppercase text-[#0F172A]">
            <Icon className="w-4 h-4 text-[#1E40AF]" />
            <span>{badgeLabel} Identity Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            {portalTitle}
          </h1>

          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            {portalSubtitle}
          </p>

          <div className="space-y-2.5 pt-2">
            {features.map((feat, i) => (
              <div key={i} className="flex items-center space-x-2.5 text-xs text-[#0F172A] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center space-x-3 text-[11px] font-mono text-[#64748B]">
            <span className="flex items-center text-[#15803D] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#15803D] mr-1.5 animate-pulse" />
              SYSTEM 100% HEALTHY
            </span>
            <span>• SOC2 & ISO 27001 ENFORCED</span>
          </div>
        </div>

        {/* Right Side: Shared Form */}
        <div className="lg:col-span-6">
          <Card className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-lg space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-[#0F172A]">Sign In</h2>
              <p className="text-xs text-[#475569]">Enter your institutional email address to continue.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
              <div className="space-y-1">
                <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Institutional Email</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                  <Input {...register('email')} className="bg-[#F8FAFC] border-[#E2E8F0] pl-9 text-xs" />
                </div>
                {errors.email && <p className="text-red-600 text-[10px]">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Password</Label>
                  <Link to="/auth/forgot-password" className="text-[#2563EB] text-[11px] hover:underline font-semibold">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                  <Input type="password" {...register('password')} className="bg-[#F8FAFC] border-[#E2E8F0] pl-9 text-xs" />
                </div>
                {errors.password && <p className="text-red-600 text-[10px]">{errors.password.message}</p>}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold py-3 rounded-xl shadow-xs text-xs">
                {isLoading ? 'Authenticating...' : `Access ${portalTitle}`}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex justify-between items-center text-xs text-[#64748B] py-4 border-t border-[#E2E8F0]">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <div className="flex space-x-4">
          <Link to="/auth/login" className="hover:text-[#0F172A]">Privacy Policy</Link>
          <Link to="/auth/login" className="hover:text-[#0F172A]">Security SLA</Link>
        </div>
      </footer>
    </div>
  );
};

export default PortalAuthLayout;
