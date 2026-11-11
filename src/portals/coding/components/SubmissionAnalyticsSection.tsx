import React from 'react';
import { Card } from '@/components/ui/card';
import { SubmissionAnalyticsData } from '@/portals/coding/types/codingDashboard';
import { CheckCircle2, XCircle, AlertTriangle, Clock, Cpu, FileCode, HelpCircle, Layers } from 'lucide-react';

interface Props {
  analytics: SubmissionAnalyticsData;
  isLoading?: boolean;
}

export const SubmissionAnalyticsSection: React.FC<Props> = ({ analytics, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-8 bg-white border border-[#E2E8F0] rounded-2xl animate-pulse text-center">
        Loading submission analytics...
      </div>
    );
  }

  const items = [
    { label: 'Accepted (AC)', count: analytics.accepted, color: 'bg-emerald-500', textColor: 'text-emerald-700', icon: CheckCircle2 },
    { label: 'Wrong Answer (WA)', count: analytics.wrongAnswer, color: 'bg-rose-500', textColor: 'text-rose-700', icon: XCircle },
    { label: 'Compilation Error (CE)', count: analytics.compilationError, color: 'bg-amber-500', textColor: 'text-amber-700', icon: AlertTriangle },
    { label: 'Runtime Error (RE)', count: analytics.runtimeError, color: 'bg-purple-500', textColor: 'text-purple-700', icon: FileCode },
    { label: 'Time Limit Exceeded (TLE)', count: analytics.timeLimitExceeded, color: 'bg-blue-500', textColor: 'text-blue-700', icon: Clock },
    { label: 'Memory Limit Exceeded (MLE)', count: analytics.memoryLimitExceeded, color: 'bg-indigo-500', textColor: 'text-indigo-700', icon: Cpu },
    { label: 'Presentation Error (PE)', count: analytics.presentationError, color: 'bg-orange-500', textColor: 'text-orange-700', icon: HelpCircle },
    { label: 'Skipped Tests', count: analytics.skipped, color: 'bg-slate-400', textColor: 'text-slate-600', icon: Layers },
    { label: 'Pending Judge Execution', count: analytics.pending, color: 'bg-cyan-500', textColor: 'text-cyan-700', icon: Clock },
  ];

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider font-mono flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2 inline-block" />
          Section 7: Submission Outcome Analytics & Verdict Breakdown
        </h2>
        <span className="text-xs font-mono font-bold text-slate-600">
          {analytics.totalSubmissions.toLocaleString()} Total Evaluated Submissions
        </span>
      </div>

      <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        {/* Progress Bar Visualizer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#0F172A]">
            <span>Aggregate Outcome Share</span>
            <span className="text-emerald-600">
              {((analytics.accepted / analytics.totalSubmissions) * 100).toFixed(1)}% Acceptance Rate
            </span>
          </div>

          <div className="w-full bg-slate-100 h-4 rounded-xl overflow-hidden flex shadow-2xs">
            {items.map((item) => {
              const pct = (item.count / analytics.totalSubmissions) * 100;
              if (pct === 0) return null;
              return (
                <div
                  key={item.label}
                  className={`${item.color} h-full transition-all`}
                  style={{ width: `${pct}%` }}
                  title={`${item.label}: ${item.count} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>
        </div>

        {/* Detailed Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-3 pt-2">
          {items.map((item) => {
            const IconComp = item.icon;
            const pct = ((item.count / analytics.totalSubmissions) * 100).toFixed(1);
            return (
              <div key={item.label} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <IconComp className={`w-3.5 h-3.5 ${item.textColor}`} />
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{pct}%</span>
                </div>
                <div className="text-base font-extrabold text-[#0F172A]">{item.count}</div>
                <div className="text-[10px] text-[#64748B] font-medium leading-tight truncate">{item.label}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default SubmissionAnalyticsSection;
