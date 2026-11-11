import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DashboardFilterState } from '@/types/codingDashboard';
import { Search, Filter, Building2, Code, FileCode2, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface Props {
  filterState: DashboardFilterState;
  onFilterChange: (newState: Partial<DashboardFilterState>) => void;
  onReset: () => void;
}

export const GlobalSearchFilterBar: React.FC<Props> = ({ filterState, onFilterChange, onReset }) => {
  return (
    <Card className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs mb-8 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Global Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <Input
            placeholder="Global Search across Coding Exams, Problems, Candidates, Organizations..."
            value={filterState.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="pl-10 bg-slate-50 border-[#E2E8F0] text-xs rounded-xl focus:bg-white transition-all py-2"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-[#E2E8F0] rounded-xl px-2.5 py-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterState.organization}
              onChange={(e) => onFilterChange({ organization: e.target.value })}
              className="bg-transparent text-[#0F172A] font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Organizations</option>
              <option value="Massachusetts Institute of Technology">MIT</option>
              <option value="Stanford University School of Medicine">Stanford</option>
              <option value="Pearson VUE Global Tech">Pearson VUE</option>
              <option value="Oracle Cloud Systems">Oracle Cloud</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-50 border border-[#E2E8F0] rounded-xl px-2.5 py-1.5">
            <Code className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterState.language}
              onChange={(e) => onFilterChange({ language: e.target.value })}
              className="bg-transparent text-[#0F172A] font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Languages (14)</option>
              <option value="Python">Python</option>
              <option value="TypeScript">TypeScript</option>
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-50 border border-[#E2E8F0] rounded-xl px-2.5 py-1.5">
            <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterState.difficulty}
              onChange={(e) => onFilterChange({ difficulty: e.target.value })}
              className="bg-transparent text-[#0F172A] font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <button
            onClick={onReset}
            className="text-xs font-bold text-slate-500 hover:text-blue-600 px-2 py-1 flex items-center cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 mr-1" /> Reset
          </button>
        </div>
      </div>
    </Card>
  );
};

export default GlobalSearchFilterBar;
