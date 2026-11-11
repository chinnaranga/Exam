import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrgHierarchyService, DepartmentItem } from '@/server/organization/org_hierarchy.service';
import { Layers, Plus, User, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentItem[]>(() => OrgHierarchyService.getDepartments());
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [headName, setHeadName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const created = OrgHierarchyService.createDepartment({
      campusId: 'camp-01',
      campusName: 'Main Cambridge Campus',
      name,
      code: code.toUpperCase(),
      headName: headName || 'Prof. Arthur Vance',
      status: 'ACTIVE',
    });

    setDepartments([...OrgHierarchyService.getDepartments()]);
    setName('');
    setCode('');
    setHeadName('');
    toast.success('Department Registered', { description: `${created.name} (${created.code}).` });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Academic & Departmental Scope</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Department Management</h1>
        <p className="text-xs text-[#6B7280]">
          Configure academic departments, department heads, and program allocations.
        </p>
      </div>

      <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#111827]">Add Academic Department</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Department Name</Label>
            <Input placeholder="EECS" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#FAFBFC] border-[#E5E7EB]" />
          </div>
          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Code</Label>
            <Input placeholder="EECS" value={code} onChange={(e) => setCode(e.target.value)} className="bg-[#FAFBFC] border-[#E5E7EB] font-mono" />
          </div>
          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Department Head</Label>
            <Input placeholder="Prof. Arthur Vance" value={headName} onChange={(e) => setHeadName(e.target.value)} className="bg-[#FAFBFC] border-[#E5E7EB]" />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-2 rounded-lg text-xs">
              <Plus className="w-4 h-4 mr-1" />
              Add Dept
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {departments.map((d) => (
          <Card key={d.id} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#111827]">{d.name}</h3>
              <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {d.code}
              </span>
            </div>
            <div className="space-y-1 text-xs text-[#6B7280]">
              <p className="flex items-center"><User className="w-3.5 h-3.5 mr-1 text-[#9CA3AF]" /> Department Head: {d.headName}</p>
              <p className="flex items-center"><BookOpen className="w-3.5 h-3.5 mr-1 text-[#9CA3AF]" /> Campus: {d.campusName}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepartmentManagement;
