import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Code,
  Plus,
  FileCode2,
  Download,
  Terminal,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

interface HeaderProps {
  onOpenCreateExam: () => void;
  onOpenCreateProblem: () => void;
  onOpenImportProblems: () => void;
  onOpenSandbox: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const CodingDashboardHeader: React.FC<HeaderProps> = ({
  onOpenCreateExam,
  onOpenCreateProblem,
  onOpenImportProblems,
  onOpenSandbox,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="bg-white border-b border-[#E2E8F0] pb-6 pt-2 mb-6">
      {/* Top Breadcrumb & Status Pill */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center space-x-2 text-[#64748B] font-medium">
          <span className="flex items-center text-[#0F6CBD] font-semibold">
            <Code className="w-3.5 h-3.5 mr-1" /> Coding
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#0F172A] font-bold">Dashboard</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" /> ZERO-TRUST POLYGLOT ENGINE ACTIVE
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Zap className="w-3 h-3 mr-1 text-blue-600" /> 16/16 JUDGES ONLINE
          </span>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2.5xl font-extrabold text-[#0F172A] tracking-tight">
            Enterprise Coding Dashboard
          </h1>
          <p className="text-sm text-[#64748B] mt-1 font-sans">
            Monitor coding examinations, execution infrastructure, submissions, and platform performance.
          </p>
        </div>

        {/* Right Side Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50 font-semibold text-xs rounded-xl shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-[#0F6CBD]' : ''}`} />
            Refresh
          </Button>

          <Button
            onClick={onOpenSandbox}
            variant="outline"
            size="sm"
            className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50 font-semibold text-xs rounded-xl shadow-2xs cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
            Run Sandbox
          </Button>

          <Button
            onClick={onOpenImportProblems}
            variant="outline"
            size="sm"
            className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50 font-semibold text-xs rounded-xl shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Import Problems
          </Button>

          <Button
            onClick={onOpenCreateProblem}
            variant="outline"
            size="sm"
            className="border-[#CBD5E1] text-[#0F172A] hover:bg-slate-100 font-bold text-xs rounded-xl shadow-2xs cursor-pointer"
          >
            <FileCode2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Create Problem
          </Button>

          <Button
            onClick={onOpenCreateExam}
            size="sm"
            className="bg-[#0F6CBD] hover:bg-[#005A9E] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Coding Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodingDashboardHeader;
