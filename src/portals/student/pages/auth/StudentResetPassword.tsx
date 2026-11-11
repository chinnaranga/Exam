import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StudentAuthLayout } from '../../layout/StudentAuthLayout';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

export const StudentResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8 || password !== confirm) return;
    toast.success('Password Updated', { description: 'Your password has been reset. Please sign in.' });
    navigate('/student/login');
  };

  return (
    <StudentAuthLayout title="Choose New Password" subtitle="Enter your new secure password">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <Label className="uppercase text-[#0F172A] text-[10px]">New Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[#F8FAFC] border-[#E2E8F0]" />
        </div>

        <div className="space-y-1">
          <Label className="uppercase text-[#0F172A] text-[10px]">Confirm New Password</Label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="bg-[#F8FAFC] border-[#E2E8F0]" />
        </div>

        <Button type="submit" className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold py-2.5 rounded-xl shadow-xs">
          Update Password & Sign In
        </Button>
      </form>
    </StudentAuthLayout>
  );
};

export default StudentResetPassword;
