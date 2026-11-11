import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrgHierarchyService, WorkspaceItem } from '@/server/organization/org_hierarchy.service';
import { LayoutGrid, Plus, Users, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const WorkspaceManagement: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>(() => OrgHierarchyService.getWorkspaces());
  const [name, setName] = useState('');
  const [type, setType] = useState<'ACADEMIC' | 'CORPORATE' | 'CERTIFICATION' | 'GOVERNMENT'>('ACADEMIC');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const created = OrgHierarchyService.createWorkspace({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      type,
      status: 'ACTIVE',
    });

    setWorkspaces([...OrgHierarchyService.getWorkspaces()]);
    setName('');
    toast.success('Workspace Created', { description: `${created.name} (${created.type}).` });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Multi-Tenant Testing Workspaces</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Workspace Management</h1>
        <p className="text-xs text-[#6B7280]">
          Create and isolate testing workspaces for campuses, departments, or partner certification clients.
        </p>
      </div>

      <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#111827]">Provision Isolated Workspace</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Workspace Name</Label>
            <Input placeholder="Harvard Extension Testing Hub" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#FAFBFC] border-[#E5E7EB]" />
          </div>
          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Workspace Type</Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full h-9 rounded-md border border-[#E5E7EB] bg-[#FAFBFC] px-3 text-xs text-[#111827]"
            >
              <option value="ACADEMIC">ACADEMIC</option>
              <option value="CORPORATE">CORPORATE</option>
              <option value="CERTIFICATION">CERTIFICATION</option>
              <option value="GOVERNMENT">GOVERNMENT</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-2 rounded-lg text-xs">
              <Plus className="w-4 h-4 mr-1" />
              Create Workspace
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {workspaces.map((w) => (
          <Card key={w.id} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#111827]">{w.name}</h3>
              <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {w.type}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1 text-[#9CA3AF]" /> Members: {w.membersCount}</span>
              <span className="font-mono text-[#16A34A] font-bold">STATUS: {w.status}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceManagement;
