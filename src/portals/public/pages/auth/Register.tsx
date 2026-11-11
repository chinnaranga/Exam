import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import BrandLogo from "@/shared/components/BrandLogo";
import { authService } from "@/shared/services/authService";
import { useAuthStore } from "@/shared/stores/authStore";
import { toast } from 'sonner';
import { Building2, User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

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
      toast.success('Enterprise Tenant Provisioned Successfully!', {
        description: `Organization "${values.organizationName}" registered.`,
      });
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Registration Failed', { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] font-sans text-[#111827] flex items-center justify-center p-6">
      <Card className="p-8 max-w-xl w-full rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <BrandLogo size="lg" variant="light" />
          </div>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Provision Enterprise Tenant</h2>
          <p className="text-xs text-[#6B7280]">Setup your institutional testing workspace in under 60 seconds</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#111827] uppercase font-medium">First Name</Label>
              <Input placeholder="Eleanor" className="bg-[#FAFBFC] border-[#E5E7EB] text-[#111827] text-xs" {...register('firstName')} />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[#111827] uppercase font-medium">Last Name</Label>
              <Input placeholder="Vance" className="bg-[#FAFBFC] border-[#E5E7EB] text-[#111827] text-xs" {...register('lastName')} />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-[#111827] uppercase font-medium">Work / Institutional Email</Label>
            <Input type="email" placeholder="admin@university.edu" className="bg-[#FAFBFC] border-[#E5E7EB] text-[#111827] text-xs" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-[#111827] uppercase font-medium">Organization / University Name</Label>
            <Input placeholder="Harvard Extension School" onChange={handleOrgNameChange} className="bg-[#FAFBFC] border-[#E5E7EB] text-[#111827] text-xs" />
            {errors.organizationName && <p className="text-xs text-red-500">{errors.organizationName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-[#111827] uppercase font-medium">Subdomain Identifier</Label>
            <div className="flex items-center space-x-2">
              <Input placeholder="harvard-ext" className="bg-[#FAFBFC] border-[#E5E7EB] text-[#111827] text-xs font-mono" {...register('domainSlug')} />
              <span className="text-xs text-[#6B7280] font-mono shrink-0">.examify-vanguard.com</span>
            </div>
            {errors.domainSlug && <p className="text-xs text-red-500">{errors.domainSlug.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-[#111827] uppercase font-medium">Master Password</Label>
            <Input type="password" placeholder="••••••••••••" className="bg-[#FAFBFC] border-[#E5E7EB] text-[#111827] text-xs font-mono" {...register('password')} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="terms" onCheckedChange={(val) => setValue('acceptTerms', !!val)} />
            <label htmlFor="terms" className="text-xs text-[#6B7280] cursor-pointer">
              I agree to the <Link to="#" className="text-[#2563EB] font-bold hover:underline">Enterprise SLA & Security Policies</Link>
            </label>
          </div>
          {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}

          <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs mt-4" disabled={isLoading}>
            {isLoading ? 'Provisioning Tenant...' : 'Register Enterprise Tenant'}
          </Button>
        </form>

        <div className="pt-4 border-t border-[#F1F5F9] text-center text-xs text-[#6B7280]">
          <span>Already registered? </span>
          <Link to="/auth/login" className="text-[#2563EB] font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
