import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Users, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useCandidates } from '@/shared/hooks/useApiQueries';

export const OrgAdminUsers: React.FC = () => {
  const { data: candidatesData, isLoading } = useCandidates({ page: 1, pageSize: 10 });
  const candidatesList = candidatesData?.data || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Institutional Roster & User Management</h1>
          <p className="text-xs text-[#64748B] mt-1">Manage faculty, invigilators, and student registrations.</p>
        </div>
        <Button onClick={() => toast.success('Invitation Sent')} className="bg-[#15803D] hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl">
          <UserPlus className="w-4 h-4 mr-1" /> Invite User
        </Button>
      </div>

      <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3 font-sans text-xs">
        <h3 className="font-bold text-sm text-[#0F172A]">Active Institutional Directory</h3>

        {isLoading ? (
          <p className="text-[#64748B] font-mono animate-pulse">Loading directory...</p>
        ) : candidatesList.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-[#0F172A]">No candidates or users registered yet.</p>
            <p className="text-xs text-[#64748B]">Click 'Invite User' to add institutional members to your directory.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[#64748B] font-mono">{candidatesData?.total || candidatesList.length} Active Registered Members</p>
            <div className="divide-y divide-[#E2E8F0]">
              {candidatesList.map((user) => (
                <div key={user.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0F172A]">{user.firstName} {user.lastName}</span>
                    <span className="text-[#64748B] ml-2 font-mono">({user.email})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-mono font-bold border border-blue-200">
                    {user.department || 'STUDENT'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrgAdminUsers;
