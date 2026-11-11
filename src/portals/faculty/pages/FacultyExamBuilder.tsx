import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useExams } from '@/hooks/useApiQueries';

interface BlueprintItem {
  id: string | number;
  title: string;
  department: string;
  itemsCount: number;
  duration: string;
  bloomsWeight: string;
}

export const FacultyExamBuilder: React.FC = () => {
  const { data: examsData, isLoading } = useExams({ page: 1, pageSize: 10 });
  const [customBlueprints, setCustomBlueprints] = useState<BlueprintItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [itemsCount, setItemsCount] = useState('45');
  const [duration, setDuration] = useState('60');

  // Combine API data with created blueprints
  const apiBlueprints: BlueprintItem[] = (examsData?.data || []).map((e) => ({
    id: e.id,
    title: e.title,
    department: e.code || 'EXAM',
    itemsCount: e.totalQuestions || 45,
    duration: `${e.durationMinutes || 60} min`,
    bloomsWeight: '30% Application, 50% Analysis, 20% Evaluation',
  }));

  const allBlueprints = [...customBlueprints, ...apiBlueprints];

  const handleCreateBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error('Please enter a blueprint title');
      return;
    }

    const newBlueprint: BlueprintItem = {
      id: `bp_${Date.now()}`,
      title,
      department: department || 'CS-402',
      itemsCount: Number(itemsCount) || 45,
      duration: `${duration} min`,
      bloomsWeight: '40% Application, 60% Analysis',
    };

    setCustomBlueprints([newBlueprint, ...customBlueprints]);
    setIsOpen(false);
    setTitle('');
    setDepartment('');
    toast.success('Exam Blueprint Created!', {
      description: `Created "${newBlueprint.title}" with ${newBlueprint.itemsCount} questions.`,
    });
  };

  const handlePublish = (title: string) => {
    toast.success(`Published Blueprint: ${title}`, {
      description: 'Exam is now active and ready for student enrollment.',
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Exam Blueprinting Studio</h1>
          <p className="text-xs text-[#64748B] mt-1">Assemble exams from calibrated item banks with automated difficulty balance.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer">
              <Plus className="w-4 h-4 mr-1" /> Create Exam Blueprint
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white text-[#0F172A] p-6 rounded-2xl border-[#E2E8F0]">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-lg font-bold text-[#0F172A]">New Exam Blueprint</DialogTitle>
              <DialogDescription className="text-xs text-[#64748B]">
                Configure Bloom's taxonomy weights and question counts.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateBlueprint} className="space-y-4 text-xs pt-2">
              <div className="space-y-1">
                <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Blueprint Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CS-402 Distributed Systems Final Exam"
                  className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-sans"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Course Code</Label>
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="CS-402"
                    className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Items Count</Label>
                  <Input
                    type="number"
                    value={itemsCount}
                    onChange={(e) => setItemsCount(e.target.value)}
                    className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Duration (m)</Label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-mono"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="text-xs font-bold border-[#E2E8F0] cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-5 cursor-pointer">
                  Save Blueprint
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-400 font-mono text-xs animate-pulse">
          Loading exam blueprints from API...
        </div>
      ) : allBlueprints.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="font-extrabold text-base text-[#0F172A]">No Exam Blueprints Available</h3>
          <p className="text-xs text-[#64748B]">Click '+ Create Exam Blueprint' to assemble your first exam blueprint.</p>
        </Card>
      ) : (
        <div className="space-y-3 font-sans text-xs">
          {allBlueprints.map((bp) => (
            <Card key={bp.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {bp.department}
                  </span>
                  <h3 className="font-bold text-sm text-[#0F172A] mt-1">{bp.title}</h3>
                  <p className="text-[#64748B] font-mono mt-0.5">{bp.itemsCount} Questions • Duration: {bp.duration} • Bloom's: {bp.bloomsWeight}</p>
                </div>
                <Button size="sm" className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 cursor-pointer" onClick={() => handlePublish(bp.title)}>
                  Publish Exam
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyExamBuilder;
