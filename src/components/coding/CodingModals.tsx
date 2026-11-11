import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, FileCode2, Download, Terminal, CheckCircle2, Code, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface ModalsProps {
  isCreateExamOpen: boolean;
  onCloseCreateExam: () => void;
  isCreateProblemOpen: boolean;
  onCloseCreateProblem: () => void;
  isImportProblemsOpen: boolean;
  onCloseImportProblems: () => void;
  isSandboxOpen: boolean;
  onCloseSandbox: () => void;
}

export const CodingModals: React.FC<ModalsProps> = ({
  isCreateExamOpen,
  onCloseCreateExam,
  isCreateProblemOpen,
  onCloseCreateProblem,
  isImportProblemsOpen,
  onCloseImportProblems,
  isSandboxOpen,
  onCloseSandbox,
}) => {
  // Modal Form States
  const [examTitle, setExamTitle] = useState('');
  const [examOrg, setExamOrg] = useState('Massachusetts Institute of Technology');

  const [problemTitle, setProblemTitle] = useState('');
  const [problemDiff, setProblemDiff] = useState('MEDIUM');

  const [sandboxCode, setSandboxCode] = useState('def solution(arr):\n    return sorted([x for x in arr if x % 2 == 0])\n\nprint(solution([4, 2, 9, 7, 6]))');
  const [sandboxLang, setSandboxLang] = useState('Python 3.12');
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);

  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) {
      toast.error('Please enter a coding exam title.');
      return;
    }
    toast.success(`Coding Exam Created: "${examTitle}"`, {
      description: `Assigned to ${examOrg}. Target environment provisioned.`,
    });
    setExamTitle('');
    onCloseCreateExam();
  };

  const handleCreateProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemTitle.trim()) {
      toast.error('Please enter a problem title.');
      return;
    }
    toast.success(`Coding Problem Authoring Saved: "${problemTitle}"`, {
      description: `Difficulty: ${problemDiff}. Calibrated to IRT item bank.`,
    });
    setProblemTitle('');
    onCloseCreateProblem();
  };

  const handleRunSandboxCode = () => {
    setSandboxOutput('Executing code in isolated WASM Docker sandbox...\n\nOutput:\n[2, 4, 6]\n\nExecution Time: 14ms\nMemory Used: 12.4 MB\nStatus: 0 Exit Code (SUCCESS)');
    toast.success('Sandbox Code Execution Completed!');
  };

  return (
    <>
      {/* 1. Create Coding Exam Modal */}
      <Dialog open={isCreateExamOpen} onOpenChange={onCloseCreateExam}>
        <DialogContent className="sm:max-w-[500px] bg-white text-[#0F172A] p-6 rounded-2xl border-[#E2E8F0]">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-[#0F172A] flex items-center">
              <Plus className="w-5 h-5 mr-2 text-[#0F6CBD]" /> Create Polyglot Coding Exam
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Author multi-problem coding benchmarks with automated unit test verification.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateExamSubmit} className="space-y-4 text-xs pt-2">
            <div className="space-y-1">
              <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Exam Title</Label>
              <Input
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                placeholder="e.g. Senior Systems Architecture & Algorithms Benchmark"
                className="bg-slate-50 border-[#E2E8F0] text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Target Organization / Tenant</Label>
              <select
                value={examOrg}
                onChange={(e) => setExamOrg(e.target.value)}
                className="w-full bg-slate-50 border border-[#E2E8F0] text-xs rounded-xl p-2 font-medium focus:outline-none"
              >
                <option value="Massachusetts Institute of Technology">Massachusetts Institute of Technology</option>
                <option value="Stanford University School of Medicine">Stanford University School of Medicine</option>
                <option value="Pearson VUE Global Tech">Pearson VUE Global Tech</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onCloseCreateExam} className="text-xs font-bold border-[#E2E8F0] cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0F6CBD] hover:bg-[#005A9E] text-white font-bold text-xs px-5 cursor-pointer">
                Create Coding Exam
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Create Coding Problem Modal */}
      <Dialog open={isCreateProblemOpen} onOpenChange={onCloseCreateProblem}>
        <DialogContent className="sm:max-w-[500px] bg-white text-[#0F172A] p-6 rounded-2xl border-[#E2E8F0]">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-[#0F172A] flex items-center">
              <FileCode2 className="w-5 h-5 mr-2 text-emerald-600" /> Create Coding Problem
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Add a new algorithmic or system design problem to the question bank.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProblemSubmit} className="space-y-4 text-xs pt-2">
            <div className="space-y-1">
              <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Problem Title</Label>
              <Input
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                placeholder="e.g. Distributed Lock Manager with Raft Consensus"
                className="bg-slate-50 border-[#E2E8F0] text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Difficulty Calibration</Label>
              <select
                value={problemDiff}
                onChange={(e) => setProblemDiff(e.target.value)}
                className="w-full bg-slate-50 border border-[#E2E8F0] text-xs rounded-xl p-2 font-medium focus:outline-none"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onCloseCreateProblem} className="text-xs font-bold border-[#E2E8F0] cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 cursor-pointer">
                Save & Calibrate Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Import Problems Modal */}
      <Dialog open={isImportProblemsOpen} onOpenChange={onCloseImportProblems}>
        <DialogContent className="sm:max-w-[450px] bg-white text-[#0F172A] p-6 rounded-2xl border-[#E2E8F0]">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-[#0F172A] flex items-center">
              <Download className="w-5 h-5 mr-2 text-purple-600" /> Import Problems Package
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Upload HackerRank, LeetCode, or custom ZIP/JSON problem bundles.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs pt-2">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer space-y-2">
              <Download className="w-8 h-8 mx-auto text-purple-500" />
              <p className="font-bold text-[#0F172A]">Drop ZIP or JSON Package Here</p>
              <p className="text-[11px] text-slate-500">Supports HackerRank for Work & CodeSignal Formats</p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onCloseImportProblems} className="text-xs font-bold border-[#E2E8F0] cursor-pointer">
                Close
              </Button>
              <Button
                onClick={() => {
                  toast.success('Imported 12 Problems into Bank');
                  onCloseImportProblems();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 cursor-pointer"
              >
                Import Selected Package
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. Run Sandbox Modal */}
      <Dialog open={isSandboxOpen} onOpenChange={onCloseSandbox}>
        <DialogContent className="sm:max-w-[650px] bg-white text-[#0F172A] p-6 rounded-2xl border-[#E2E8F0]">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-[#0F172A] flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-indigo-600" /> Polyglot Sandbox Execution IDE
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Test code execution against 14 polyglot runtimes in a zero-trust WASM container.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs pt-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500">Runtime Language:</span>
              <select
                value={sandboxLang}
                onChange={(e) => setSandboxLang(e.target.value)}
                className="bg-slate-100 border border-slate-300 rounded-lg text-xs p-1 font-bold text-[#0F172A]"
              >
                <option value="Python 3.12">Python 3.12</option>
                <option value="TypeScript 5.4">TypeScript 5.4</option>
                <option value="C++ 20">C++ 20</option>
                <option value="Java 21">Java 21</option>
                <option value="Go 1.22">Go 1.22</option>
                <option value="Rust 1.77">Rust 1.77</option>
              </select>
            </div>

            <textarea
              value={sandboxCode}
              onChange={(e) => setSandboxCode(e.target.value)}
              rows={6}
              className="w-full bg-[#0B0F19] text-emerald-400 p-3 rounded-xl border border-slate-800 text-xs font-mono focus:outline-none"
            />

            {sandboxOutput && (
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 text-[11px] font-mono whitespace-pre-wrap">
                {sandboxOutput}
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onCloseSandbox} className="text-xs font-bold border-[#E2E8F0] cursor-pointer">
                Close Sandbox
              </Button>
              <Button onClick={handleRunSandboxCode} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 cursor-pointer">
                <Zap className="w-3.5 h-3.5 mr-1" /> Run Code in Sandbox
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CodingModals;
