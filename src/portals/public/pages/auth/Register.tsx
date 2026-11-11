import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import BrandLogo from "@/shared/components/BrandLogo";
import { authService } from "@/shared/services/authService";
import { useAuthStore } from "@/shared/stores/authStore";
import { toast } from 'sonner';
import { Building2, User, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import {
  RedCheck,
  RedCircle,
  CropMarks,
  MarginNote,
  OmrBubble,
} from '@/components/marks';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid institutional email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  organizationName: z.string().min(3, 'Organization name is required'),
  domainSlug: z.string().min(3, 'Domain slug is required').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      organizationName: '',
      domainSlug: '',
      acceptTerms: false,
    },
  });

  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('organizationName', val);
    setValue('domainSlug', val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const session = await authService.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        organizationName: values.organizationName,
        domainSlug: values.domainSlug,
      });
      setSession(session);
      toast.success('Institution Account Created', {
        description: `Welcome to AssessIQ, ${values.firstName}!`,
      });
      navigate('/org-admin/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to create institutional account.';
      toast.error('Registration Failed', {
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
        <div className="flex items-center space-x-3">
          <Link
            to="/auth/login"
            className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
          >
            HAVE AN ACCOUNT? SIGN IN →
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-2xl w-full mx-auto my-auto py-10">
        <div className="relative p-8 sm:p-10 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6">
          <CropMarks />

          <div className="flex items-center justify-between border-b-2 border-dashed border-[#2B2350]/20 pb-4">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
                FORM 02 // INSTITUTION ENROLLMENT
              </span>
              <h1 className="font-heading text-3xl font-extrabold text-[#2B2350] mt-2">
                Register Your <span className="relative inline-block px-1">Campus<RedCircle className="scale-110" /></span>
              </h1>
              <p className="text-xs text-[#6B6590] font-body mt-1">
                Start your pilot. Free for approved design partners.
              </p>
            </div>
            <MarginNote className="-rotate-6 hidden sm:inline-block">fast setup</MarginNote>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-mono text-xs">
            {/* First and Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="uppercase text-[#2B2350] text-[10px] font-bold">First Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6B6590] absolute left-3 top-2.5" />
                  <input
                    {...register('firstName')}
                    placeholder="Jane"
                    className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-[#2B2350] font-body outline-none"
                  />
                </div>
                {errors.firstName && <p className="text-[#FF4D5E] text-[10px]">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="uppercase text-[#2B2350] text-[10px] font-bold">Last Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6B6590] absolute left-3 top-2.5" />
                  <input
                    {...register('lastName')}
                    placeholder="Doe"
                    className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-[#2B2350] font-body outline-none"
                  />
                </div>
                {errors.lastName && <p className="text-[#FF4D5E] text-[10px]">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Institutional Email */}
            <div className="space-y-1">
              <label className="uppercase text-[#2B2350] text-[10px] font-bold">Institutional Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B6590] absolute left-3 top-2.5" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="dean@university.edu"
                  className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-[#2B2350] font-body outline-none"
                />
              </div>
              {errors.email && <p className="text-[#FF4D5E] text-[10px]">{errors.email.message}</p>}
            </div>

            {/* Organization Name */}
            <div className="space-y-1">
              <label className="uppercase text-[#2B2350] text-[10px] font-bold">Organization / University Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#6B6590] absolute left-3 top-2.5" />
                <input
                  {...register('organizationName')}
                  onChange={handleOrgNameChange}
                  placeholder="Oxford Assessment Institute"
                  className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-[#2B2350] font-body outline-none"
                />
              </div>
              {errors.organizationName && <p className="text-[#FF4D5E] text-[10px]">{errors.organizationName.message}</p>}
            </div>

            {/* Domain Slug */}
            <div className="space-y-1">
              <label className="uppercase text-[#2B2350] text-[10px] font-bold">Workspace URL Slug</label>
              <div className="flex items-center">
                <span className="bg-slate-100 border-2 border-r-0 border-[#2B2350]/30 rounded-l-xl px-3 py-2 text-xs text-[#6B6590]">
                  assessiq.io/
                </span>
                <input
                  {...register('domainSlug')}
                  placeholder="oxford"
                  className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-r-xl px-3 py-2 text-xs text-[#2B2350] font-body outline-none"
                />
              </div>
              {errors.domainSlug && <p className="text-[#FF4D5E] text-[10px]">{errors.domainSlug.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="uppercase text-[#2B2350] text-[10px] font-bold">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B6590] absolute left-3 top-2.5" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-[#2B2350] font-body outline-none"
                />
              </div>
              {errors.password && <p className="text-[#FF4D5E] text-[10px]">{errors.password.message}</p>}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                {...register('acceptTerms')}
                className="w-4 h-4 accent-[#6C4DFF] rounded border-2 border-[#2B2350]"
              />
              <label htmlFor="terms" className="text-[11px] text-[#6B6590] font-body">
                I agree to the pilot terms of service and evaluation privacy charter.
              </label>
            </div>
            {errors.acceptTerms && <p className="text-[#FF4D5E] text-[10px]">{errors.acceptTerms.message}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center justify-center space-x-2 transition-all group disabled:opacity-50"
            >
              <span>{isLoading ? 'ENROLLING INSTITUTION...' : 'ENROLL INSTITUTION & START PILOT'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <span>FORM 02 VERIFIED</span>
      </footer>
    </div>
  );
};

export default Register;
