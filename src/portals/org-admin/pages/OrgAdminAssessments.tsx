import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { BookOpen, Calendar } from 'lucide-react';

export const OrgAdminAssessments: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Institutional Assessment Management</h1>
        <p className="text-xs text-[#64748B] mt-1">Approval workflows, examination scheduling, and academic calendar sync.</p>
      </div>

      <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3 font-sans text-xs">
        <h3 className="font-bold text-sm text-[#0F172A]">Fall 2026 Examination Schedule</h3>
        <p className="text-[#64748B]">128 Scheduled Exams • 100% Proctored • All Campuses Synced</p>
      </Card>
    </div>
  );
};

export default OrgAdminAssessments;
