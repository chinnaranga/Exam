import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { LanguageMetric } from '@/portals/coding/types/codingDashboard';
import { Terminal, Code, Cpu, Clock, CheckCircle } from 'lucide-react';

interface Props {
  languages: LanguageMetric[];
  isLoading?: boolean;
}

export const LanguageDistributionGrid: React.FC<Props> = ({ languages, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-8 bg-white border border-[#E2E8F0] rounded-2xl animate-pulse text-center">
        Loading language statistics...
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider font-mono flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-600 mr-2 inline-block" />
          Section 6: Polyglot Language Distribution & Execution Metrics
        </h2>
        <span className="text-xs text-[#64748B] font-mono">
          14 Supported Enterprise Runtimes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
        {languages.map((lang) => (
          <Card
            key={lang.code}
            className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-md transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0F172A] truncate" style={{ color: lang.iconColor || '#0F172A' }}>
                {lang.name}
              </span>
              <Terminal className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
            </div>

            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between text-[#64748B]">
                <span>Executions:</span>
                <span className="font-bold text-[#0F172A]">{lang.executions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Avg Runtime:</span>
                <span className="font-bold text-blue-700">{lang.avgRuntimeMs} ms</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Avg Memory:</span>
                <span className="font-bold text-purple-700">{lang.avgMemoryMb} MB</span>
              </div>
              <div className="flex justify-between text-[#64748B] border-t border-slate-100 pt-1">
                <span>Pass Rate:</span>
                <span className="font-bold text-emerald-700">{lang.successRate}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LanguageDistributionGrid;
