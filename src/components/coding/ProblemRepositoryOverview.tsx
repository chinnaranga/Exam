import React from 'react';
import { Card } from '@/components/ui/card';
import { ProblemRepoSummary } from '@/types/codingDashboard';
import { FileCode2, CheckCircle2, Clock, Archive, Sparkles, Layers, PieChart } from 'lucide-react';

interface Props {
  repoSummary: ProblemRepoSummary;
  isLoading?: boolean;
}

export const ProblemRepositoryOverview: React.FC<Props> = ({ repoSummary, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-8 bg-white border border-[#E2E8F0] rounded-2xl animate-pulse text-center">
        Loading problem repository statistics...
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider font-mono flex items-center">
          <span className="w-2 h-2 rounded-full bg-purple-600 mr-2 inline-block" />
          Section 4: Problem Repository & Taxonomy Overview
        </h2>
        <span className="text-xs text-emerald-700 font-mono font-bold">
          {repoSummary.growthRate}
        </span>
      </div>

      {/* Top 8 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3.5">
        <Card className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-semibold text-[#64748B]">Total Problems</span>
          <div className="text-xl font-extrabold text-[#0F172A]">{repoSummary.totalProblems}</div>
          <span className="text-[10px] text-blue-600 font-bold font-mono">Calibrated Items</span>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-semibold text-emerald-800">Easy Difficulty</span>
          <div className="text-xl font-extrabold text-emerald-700">{repoSummary.easy}</div>
          <span className="text-[10px] text-emerald-600 font-bold font-mono">
            {((repoSummary.easy / repoSummary.totalProblems) * 100).toFixed(1)}% Share
          </span>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-semibold text-amber-800">Medium Difficulty</span>
          <div className="text-xl font-extrabold text-amber-700">{repoSummary.medium}</div>
          <span className="text-[10px] text-amber-600 font-bold font-mono">
            {((repoSummary.medium / repoSummary.totalProblems) * 100).toFixed(1)}% Share
          </span>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-semibold text-rose-800">Hard Difficulty</span>
          <div className="text-xl font-extrabold text-rose-700">{repoSummary.hard}</div>
          <span className="text-[10px] text-rose-600 font-bold font-mono">
            {((repoSummary.hard / repoSummary.totalProblems) * 100).toFixed(1)}% Share
          </span>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-semibold text-[#64748B]">Pending Review</span>
          <div className="text-xl font-extrabold text-purple-700">{repoSummary.pendingReview}</div>
          <span className="text-[10px] text-purple-600 font-bold font-mono">Awaiting Sign-off</span>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-semibold text-[#64748B]">Approved Items</span>
          <div className="text-xl font-extrabold text-emerald-700">{repoSummary.approved}</div>
          <span className="text-[10px] text-emerald-600 font-bold font-mono">Live in Bank</span>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-semibold text-[#64748B]">Archived Items</span>
          <div className="text-xl font-extrabold text-slate-500">{repoSummary.archived}</div>
          <span className="text-[10px] text-slate-400 font-bold font-mono">Deprecated</span>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-semibold text-[#64748B]">Recently Updated</span>
          <div className="text-xl font-extrabold text-blue-700">{repoSummary.recentlyUpdated}</div>
          <span className="text-[10px] text-blue-600 font-bold font-mono">Last 7 Days</span>
        </Card>
      </div>

      {/* Topic Distribution Grid */}
      <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-purple-600" />
            <h3 className="font-extrabold text-sm text-[#0F172A]">Taxonomy & Topic Distribution</h3>
          </div>
          <span className="text-xs font-mono text-[#64748B]">Bloom's IRT Calibrated Topics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {repoSummary.topicDistribution.map((item) => (
            <div key={item.topic} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0F172A]">{item.topic}</span>
                <span className="font-mono font-bold text-purple-700">{item.count} items ({item.percentage}%)</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProblemRepositoryOverview;
