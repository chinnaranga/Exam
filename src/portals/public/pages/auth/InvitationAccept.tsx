import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import BrandLogo from "@/shared/components/BrandLogo";
import { UserCheck, ShieldCheck, ArrowRight, Lock, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export const InvitationAccept: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !password) {
      toast.error('All fields are required');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Invitation Accepted', {
        description: 'Account created & membership activated for Massachusetts Institute of Technology.',
      });
      navigate('/auth/login');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] font-sans text-[#111827] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-6">
        <div className="flex justify-center">
          <BrandLogo size="lg" variant="light" />
        </div>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100">
            <Building2 className="w-3.5 h-3.5" />
            <span>MIT Tenant Membership Invitation</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Accept Invitation</h1>
          <p className="text-xs text-[#6B7280]">
            You were invited to join <strong>Massachusetts Institute of Technology</strong> as role <strong>FACULTY</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-[#111827] uppercase font-medium">Your Full Legal Name</Label>
            <Input
              type="text"
              placeholder="Dr. Arthur Vance"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-[#FAFBFC] border-[#E5E7EB] text-[#111827] text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-[#111827] uppercase font-medium">Create Secure Password</Label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#FAFBFC] border-[#E5E7EB] text-[#111827] text-xs font-mono"
            />
          </div>

          <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-2.5 rounded-xl shadow-xs" disabled={isSubmitting}>
            {isSubmitting ? 'Activating Account...' : 'Accept Invitation & Complete Profile'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="pt-4 border-t border-[#F1F5F9] text-center text-[11px] font-mono text-[#9CA3AF]">
          Powered by examify-vanguard Enterprise Identity Engine
        </div>
      </Card>
    </div>
  );
};

export default InvitationAccept;
