import React from 'react';
import { Link } from 'react-router-dom';
import { StudentAuthLayout } from '../../layout/StudentAuthLayout';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const StudentVerifyEmail: React.FC = () => {
  return (
    <StudentAuthLayout title="Verify Your Email" subtitle="We have sent a verification link to your university inbox">
      <div className="text-center space-y-4 py-4">
        <div className="w-12 h-12 bg-blue-50 text-[#1E40AF] rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6" />
        </div>
        <p className="text-xs text-[#475569]">
          Please check your email and click the verification link to activate your student account.
        </p>
        <Button onClick={() => toast.success('Verification Resent')} variant="outline" className="w-full border-[#E2E8F0] font-bold text-xs py-2 rounded-xl">
          Resend Verification Email
        </Button>
        <Link to="/student/login" className="block text-xs font-bold text-[#2563EB] hover:underline pt-2">
          Return to Sign In
        </Link>
      </div>
    </StudentAuthLayout>
  );
};

export default StudentVerifyEmail;
