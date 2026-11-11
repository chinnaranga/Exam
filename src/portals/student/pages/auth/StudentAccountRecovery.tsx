import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StudentAuthLayout } from '../../layout/StudentAuthLayout';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { toast } from 'sonner';

export const StudentAccountRecovery: React.FC = () => {
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    toast.success('Account Recovery Request Submitted', { description: 'University IT Administrator notified.' });
  };

  return (
    <StudentAuthLayout title="Student Account Recovery" subtitle="Submit a ticket to your University IT Helpdesk for account access">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <Label className="uppercase text-[#0F172A] text-[10px]">Alternate Recovery Email / Phone</Label>
          <Input value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} className="bg-[#F8FAFC] border-[#E2E8F0]" placeholder="personal.email@gmail.com" />
        </div>

        <Button type="submit" className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold py-2.5 rounded-xl shadow-xs">
          Submit IT Support Request
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

export default StudentAccountRecovery;
