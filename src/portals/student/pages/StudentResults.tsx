import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, BarChart3, Download } from 'lucide-react';
import { toast } from 'sonner';

export const StudentResults: React.FC = () => {
  // Empty state handling when no evaluation transcripts exist
  const scorecards: any[] = [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">My Examination Scorecards & Transcripts</h1>
        <p className="text-xs text-[#64748B] mt-1">
          Detailed item breakdowns, IRT difficulty percentiles, and verified scorecards.
        </p>
      </div>

      {scorecards.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
          <BarChart3 className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="font-extrabold text-base text-[#0F172A]">No Transcripts Available</h3>
          <p className="text-xs text-[#64748B]">You currently have no completed examination scorecards or evaluation reports.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {scorecards.map((sc, idx) => (
            <Card key={idx} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-[#64748B]">
                <span>{sc.code}</span>
                <span className="text-[#15803D] font-bold">{sc.grade}</span>
              </div>
              <div className="text-3xl font-extrabold text-[#0F172A]">{sc.score}%</div>
              <p className="text-xs text-[#64748B]">{sc.date}</p>
              <Button onClick={() => toast.success('Transcript PDF Generated')} variant="outline" className="w-full text-xs font-bold border-[#E2E8F0] mt-2">
                <Download className="w-3.5 h-3.5 mr-1" /> Download Transcript PDF
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentResults;
