import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from "@/shared/stores/authStore";
import { User, ShieldCheck, KeyRound, Bell, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const StudentSettings: React.FC = () => {
  const { user } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || 'Eleanor');
  const [lastName, setLastName] = useState(user?.lastName || 'Vance');
  const [email, setEmail] = useState(user?.email || 'student@mit.edu');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Account Settings Updated', {
      description: 'Saved personal preferences and security settings.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Student Account & Identity Settings</h1>
        <p className="text-xs text-[#64748B] mt-1">Manage personal student profile information, MFA preferences, and exam notifications.</p>
      </div>

      <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-6">
        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          <div className="flex items-center space-x-3 border-b border-[#E2E8F0] pb-4">
            <User className="w-5 h-5 text-[#1E40AF]" />
            <h3 className="font-bold text-sm text-[#0F172A]">Personal Profile Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="uppercase text-[#0F172A] text-[10px] font-bold">First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-sans"
              />
            </div>

            <div className="space-y-1">
              <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Institutional Email</Label>
            <Input
              value={email}
              disabled
              className="bg-[#F1F5F9] border-[#E2E8F0] text-xs font-mono text-[#64748B]"
            />
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
            <Button type="submit" className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs px-6 py-2 rounded-xl">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudentSettings;
