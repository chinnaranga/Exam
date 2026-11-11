import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentAuthLayout } from '../../layout/StudentAuthLayout';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';

export const StudentMFA: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    toast.success('MFA Verification Successful');
    navigate('/student/dashboard');
  };

  return (
    <StudentAuthLayout title="Student MFA Verification" subtitle="Enter the 6-digit code from your authenticator app">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <Label className="uppercase text-[#0F172A] text-[10px]">TOTP Security Code</Label>
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="123456"
            className="bg-[#F8FAFC] border-[#E2E8F0] text-center font-mono text-lg tracking-widest"
          />
        </div>

        <Button type="submit" className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold py-2.5 rounded-xl shadow-xs">
          Verify TOTP Code
        </Button>
      </form>
    </StudentAuthLayout>
  );
};

export default StudentMFA;
