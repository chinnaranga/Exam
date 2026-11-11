import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrgHierarchyService, ProgramItem } from '@/server/organization/org_hierarchy.service';
import { GraduationCap, Plus, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

export const ProgramManagement: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramItem[]>(() => OrgHierarchyService.getPrograms());
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const created = OrgHierarchyService.createProgram({
      departmentId: 'dept-01',
      departmentName: 'EECS',
      name,
      code: code.toUpperCase(),
      durationMonths: 48,
      coordinatorName: 'Dr. Marcus Brody',
      status: 'ACTIVE',
    });

    setPrograms([...OrgHierarchyService.getPrograms()]);
    setName('');
    setCode('');
    toast.success('Degree Program Created', { description: `${created.name} (${created.code}).` });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Academic & Degree Program Curricula</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Program Management</h1>
        <p className="text-xs text-[#6B7280]">
          Manage degree programs, corporate learning tracks, and certification requirements.
        </p>
      </div>

      <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#111827]">Create Program Track</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Program Name</Label>
            <Input placeholder="B.Sc Software Eng" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#FAFBFC] border-[#E5E7EB]" />
          </div>
          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Program Code</Label>
            <Input placeholder="SE-BSC" value={code} onChange={(e) => setCode(e.target.value)} className="bg-[#FAFBFC] border-[#E5E7EB] font-mono" />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-2 rounded-lg text-xs">
              <Plus className="w-4 h-4 mr-1" />
              Create Program
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {programs.map((p) => (
          <Card key={p.id} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#111827]">{p.name}</h3>
              <span className="text-[10px] font-mono font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {p.code}
              </span>
            </div>
            <div className="space-y-1 text-xs text-[#6B7280]">
              <p className="flex items-center"><User className="w-3.5 h-3.5 mr-1 text-[#9CA3AF]" /> Coordinator: {p.coordinatorName}</p>
              <p className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-[#9CA3AF]" /> Duration: {p.durationMonths} Months</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgramManagement;
