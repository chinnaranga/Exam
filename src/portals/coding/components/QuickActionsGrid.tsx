import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  Plus,
  FileCode2,
  Download,
  Terminal,
  Settings,
  Server,
  BarChart3,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onOpenCreateExam: () => void;
  onOpenCreateProblem: () => void;
  onOpenImportProblems: () => void;
  onOpenSandbox: () => void;
}

export const QuickActionsGrid: React.FC<Props> = ({
  onOpenCreateExam,
  onOpenCreateProblem,
  onOpenImportProblems,
  onOpenSandbox,
}) => {
  const actions = [
    { label: 'Create Coding Exam', desc: 'Author polyglot test suite', icon: Plus, color: 'bg-blue-600', onClick: onOpenCreateExam },
    { label: 'Create Coding Problem', desc: 'Add IRT calibrated item', icon: FileCode2, color: 'bg-emerald-600', onClick: onOpenCreateProblem },
    { label: 'Import Problems', desc: 'Import ZIP / JSON package', icon: Download, color: 'bg-purple-600', onClick: onOpenImportProblems },
    { label: 'Run Sandbox', desc: 'Interactive polyglot IDE', icon: Terminal, color: 'bg-indigo-600', onClick: onOpenSandbox },
    { label: 'Manage Languages', desc: 'Configure compilers & flags', icon: Settings, color: 'bg-amber-600', onClick: () => toast.success('Opened Language Compiler Config') },
    { label: 'Judge Workers', desc: 'Scale cluster capacity', icon: Server, color: 'bg-teal-600', onClick: () => toast.success('Opened Judge Cluster Manager') },
    { label: 'Analytics Studio', desc: 'Deep IRT & Bloom metrics', icon: BarChart3, color: 'bg-rose-600', onClick: () => toast.success('Opened Analytics Studio') },
    { label: 'Leaderboard & Scores', desc: 'Live candidate rankings', icon: Trophy, color: 'bg-yellow-600', onClick: () => toast.success('Opened Live Leaderboard') },
  ];

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider font-mono flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-600 mr-2 inline-block" />
          Section 10: Operational Quick Actions
        </h2>
        <span className="text-xs text-[#64748B] font-mono">8 Rapid Operations</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((act) => {
          const IconComp = act.icon;
          return (
            <Card
              key={act.label}
              onClick={act.onClick}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${act.color} text-white shadow-2xs group-hover:scale-105 transition-transform`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#0F172A] group-hover:text-[#0F6CBD] transition-colors">
                    {act.label}
                  </h4>
                  <p className="text-[11px] text-[#64748B]">{act.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
