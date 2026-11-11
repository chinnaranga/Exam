import React from 'react';
import { Card } from '@/components/ui/card';
import { TimelineActivityItem } from '@/portals/coding/types/codingDashboard';
import { Clock, CheckCircle2, User, FileCode2, BookOpen, Server } from 'lucide-react';

interface Props {
  timeline: TimelineActivityItem[];
  isLoading?: boolean;
}

export const RecentActivityTimeline: React.FC<Props> = ({ timeline, isLoading = false }) => {
  return (
    <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <h3 className="font-extrabold text-sm text-[#0F172A] uppercase font-mono">
            Section 12: Chronological Audit Activity
          </h3>
        </div>
        <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
          IMMUTABLE LEDGER
        </span>
      </div>

      <div className="space-y-4 pt-1 font-sans text-xs relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {isLoading ? (
          <div className="p-4 text-center text-slate-400 font-mono">Loading timeline activity...</div>
        ) : (
          timeline.map((item) => (
            <div key={item.id} className="flex items-start space-x-3 relative z-10 pl-1">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 shadow-2xs font-bold">
                ✓
              </span>
              <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">{item.actor}</span>
                  <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
                </div>
                <p className="text-[#0F6CBD] font-semibold text-[11px]">
                  {item.action}: <span className="text-slate-700 font-medium">{item.target}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentActivityTimeline;
