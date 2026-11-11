import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { StudentAuthLayout } from './StudentAuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const studentRegisterSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid university email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type StudentRegisterFormValues = z.infer<typeof studentRegisterSchema>;

export const StudentRegister: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<StudentRegisterFormValues>({
    resolver: zodResolver(studentRegisterSchema),
  });

  const onSubmit = async (values: StudentRegisterFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Registration Initiated', { description: 'Please verify your university email address.' });
      navigate('/student/verify-email');
    }, 600);
  };

  return (
    <StudentAuthLayout title="Create Student Account" subtitle="Register with your official university credentials">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="uppercase text-[#0F172A] text-[10px]">First Name</Label>
            <Input {...register('firstName')} className="bg-[#F8FAFC] border-[#E2E8F0]" placeholder="Eleanor" />
          </div>
          <div className="space-y-1">
            <Label className="uppercase text-[#0F172A] text-[10px]">Last Name</Label>
            <Input {...register('lastName')} className="bg-[#F8FAFC] border-[#E2E8F0]" placeholder="Vance" />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="uppercase text-[#0F172A] text-[10px]">University Email</Label>
          <Input {...register('email')} className="bg-[#F8FAFC] border-[#E2E8F0]" placeholder="e.vance@mit.edu" />
        </div>

        <div className="space-y-1">
          <Label className="uppercase text-[#0F172A] text-[10px]">Password</Label>
          <Input type="password" {...register('password')} className="bg-[#F8FAFC] border-[#E2E8F0]" />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold py-2.5 rounded-xl shadow-xs mt-2">
          {isLoading ? 'Creating Account...' : 'Register Student Account'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <div className="text-center pt-2 text-xs text-[#64748B]">
          Already registered?{' '}
          <Link to="/student/login" className="text-[#2563EB] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </StudentAuthLayout>
  );
};

export default StudentRegister;
