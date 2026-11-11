import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { OrgHierarchyService, CampusItem } from '@/server/organization/org_hierarchy.service';
import { Building2, Plus, MapPin, Globe, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const CampusManagement: React.FC = () => {
  const [campuses, setCampuses] = useState<CampusItem[]>(() => OrgHierarchyService.getCampuses());
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const created = OrgHierarchyService.createCampus({
      name,
      code: code.toUpperCase(),
      address: address || 'Main Campus Address',
      timezone,
      status: 'ACTIVE',
    });

    setCampuses([...OrgHierarchyService.getCampuses()]);
    setName('');
    setCode('');
    setAddress('');
    toast.success('Campus Provisioned', { description: `Registered ${created.name} (${created.code}).` });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>Institutional Campus Hierarchy</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Campus Management</h1>
        <p className="text-xs text-[#6B7280]">
          Manage physical and virtual university campuses, regional centers, and timezones.
        </p>
      </div>

      <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#111827]">Provision New Institutional Campus</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Campus Name</Label>
            <Input placeholder="North Campus" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#FAFBFC] border-[#E5E7EB]" />
          </div>
          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Campus Code</Label>
            <Input placeholder="NORTH-01" value={code} onChange={(e) => setCode(e.target.value)} className="bg-[#FAFBFC] border-[#E5E7EB] font-mono" />
          </div>
          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Physical Address</Label>
            <Input placeholder="77 Mass Ave" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-[#FAFBFC] border-[#E5E7EB]" />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-2 rounded-lg text-xs">
              <Plus className="w-4 h-4 mr-1" />
              Add Campus
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {campuses.map((c) => (
          <Card key={c.id} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-bold text-sm text-[#111827]">{c.name}</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {c.code}
              </span>
            </div>
            <div className="space-y-1 text-xs text-[#6B7280]">
              <p className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-[#9CA3AF]" /> {c.address}</p>
              <p className="flex items-center"><Globe className="w-3.5 h-3.5 mr-1 text-[#9CA3AF]" /> Timezone: {c.timezone}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampusManagement;
