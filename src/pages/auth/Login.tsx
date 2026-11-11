import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import BrandLogo from '@/components/BrandLogo';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { SystemRole } from '@/types/auth';
import { toast } from 'sonner';
import { Lock, Mail, ShieldCheck, Sparkles, Building2, UserCheck, ArrowRight, Globe } from 'lucide-react';

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
      toast.success('Authenticated successfully', {
        description: `Welcome back, ${session.user.firstName}! Active Role: ${session.user.roles[0]?.roleName}`,
      });

      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error('Authentication Failed', {
        description: err.message || 'Invalid email or password.',
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

  return (
    <div className="min-h-screen bg-[#FAFBFC] font-sans text-[#111827] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Info Panel */}
        <div className="lg:col-span-5 space-y-6 hidden lg:block">
          <BrandLogo size="lg" variant="light" />

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[#2563EB] text-xs font-mono font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Microsoft Entra ID Grade Identity Gateway</span>
          </div>

          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Zero-Trust Enterprise Assessment Ecosystem
          </h1>

          <p className="text-xs text-[#6B7280] leading-relaxed">
            Multi-tenant identity protection, granular RBAC permissions, and real-time candidate proctoring for high-stakes institutional testing.
          </p>

          <div className="space-y-3 pt-2">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B7280]">Quick Test Credentials by Role:</p>
            <div className="grid grid-cols-1 gap-2 font-mono text-xs">
              {[
                { label: 'Super Admin', email: 'superadmin@assessiq.com', role: 'SUPER_ADMIN' as SystemRole },
                { label: 'Organization Admin', email: 'admin@mit.edu', role: 'ORGANIZATION_ADMIN' as SystemRole },
                { label: 'Faculty / Professor', email: 'faculty@mit.edu', role: 'FACULTY' as SystemRole },
                { label: 'Live Invigilator', email: 'invigilator@mit.edu', role: 'INVIGILATOR' as SystemRole },
                { label: 'Candidate / Student', email: 'student@mit.edu', role: 'STUDENT' as SystemRole },
              ].map((item) => (
                <button
                  key={item.email}
                  type="button"
                  onClick={() => handleQuickRoleSelect(item.email, item.role)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#FAFBFC] text-left transition-all shadow-2xs"
                >
                  <span className="font-bold text-[#111827] font-sans">{item.label}</span>
                  <span className="text-[#6B7280] font-mono text-[11px]">{item.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7">
          <Card className="p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-6">
            <div className="text-center space-y-1">
              <div className="lg:hidden flex justify-center mb-3">
                <BrandLogo size="md" variant="light" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Sign In to examify-vanguard</h2>
              <p className="text-xs text-[#6B7280]">Enter your institutional credentials to access your workspace</p>
            </div>

            {/* Social & Enterprise SSO Shortcuts */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <Link to="/auth/discovery">
                <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] hover:bg-[#FAFBFC] font-semibold text-xs py-2 rounded-xl">
                  <Building2 className="w-4 h-4 mr-2 text-[#2563EB]" />
                  Enterprise SSO
                </Button>
              </Link>
              <Button variant="outline" className="w-full border-[#E5E7EB] text-[#111827] hover:bg-[#FAFBFC] font-semibold text-xs py-2 rounded-xl">
                <Globe className="w-4 h-4 mr-2 text-[#4F46E5]" />
                Google Workspace
              </Button>
            </div>

            <div className="relative text-center my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#F1F5F9]" />
              </div>
              <span className="relative bg-white px-3 text-[10px] font-mono text-[#9CA3AF] uppercase font-bold">
                OR SIGN IN WITH EMAIL
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-[#111827] font-medium uppercase tracking-wider">
                  Institutional Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#9CA3AF]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@mit.edu"
                    className="pl-10 bg-[#FAFBFC] border-[#E5E7EB] text-[#111827] text-xs"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs text-[#111827] font-medium uppercase tracking-wider">
                    Password
                  </Label>
                  <Link to="/auth/forgot-password" className="text-xs text-[#2563EB] hover:underline font-semibold">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#9CA3AF]" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    className="pl-10 bg-[#FAFBFC] border-[#E5E7EB] text-[#111827] text-xs font-mono"
                    {...register('password')}
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Switch id="remember" defaultChecked {...register('rememberMe')} />
                  <Label htmlFor="remember" className="text-xs text-[#6B7280] cursor-pointer">
                    Remember this device for 30 days
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating Identity...</span>
                  </div>
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#6B7280]">
              <span>New Institution or Candidate?</span>
              <Link to="/auth/register" className="text-[#2563EB] font-bold hover:underline flex items-center">
                <span>Create Enterprise Tenant</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
