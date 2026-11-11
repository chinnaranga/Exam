import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StudentAuthLayout } from './StudentAuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, ArrowRight } from 'lucide-react';

export const StudentForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Password Reset Email Sent', { description: `Sent reset instructions to ${email}.` });
  };

  return (
    <StudentAuthLayout title="Reset Student Password" subtitle="Enter your university email to receive a password reset link">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <Label className="uppercase text-[#0F172A] text-[10px]">University Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#F8FAFC] border-[#E2E8F0]" placeholder="student@university.edu" />
        </div>

        <Button type="submit" className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold py-2.5 rounded-xl shadow-xs">
          Send Password Reset Link
        </Button>

        <div className="text-center pt-2">
          <Link to="/student/login" className="text-xs font-bold text-[#2563EB] hover:underline">
            Back to Sign In
          </Link>
        </div>
      </form>
    </StudentAuthLayout>
  );
};

export default StudentForgotPassword;
