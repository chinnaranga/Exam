import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export const StudentPlacement: React.FC = () => {
  const jobs: any[] = [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Placement Readiness & Enterprise Job Match</h1>
        <p className="text-xs text-[#64748B] mt-1">Direct recruitment pipeline based on verified Assessment Scorecard transcripts.</p>
      </div>

      {jobs.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
          <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="font-extrabold text-base text-[#0F172A]">No Job Matches Available</h3>
          <p className="text-xs text-[#64748B]">There are currently no active enterprise job postings linked to your candidate profile.</p>
        </Card>
      ) : (
        <div className="space-y-4 font-sans text-xs">
          {jobs.map((j, idx) => (
            <Card key={idx} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#0F172A] text-sm">{j.company}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#15803D] border border-emerald-200">
                    {j.match} MATCH
                  </span>
                </div>
                <h3 className="font-bold text-xs text-[#1E40AF]">{j.role}</h3>
                <p className="text-[#64748B] font-mono text-[11px]">{j.location} • Direct Institutional Referral</p>
              </div>
              <Button onClick={() => toast.success(`Application Sent to ${j.company}!`)} className="bg-indigo-900 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                Apply with Transcript
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPlacement;
