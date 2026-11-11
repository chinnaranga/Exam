import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Layers, Plus, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export const OrgAdminStructure: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Campus & Academic Hierarchy</h1>
          <p className="text-xs text-[#64748B] mt-1">Configure campuses, departments, programs, and workspace scopes.</p>
        </div>
        <Button onClick={() => toast.success('Campus Added')} className="bg-[#15803D] hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl">
          <Plus className="w-4 h-4 mr-1" /> Add Campus Scope
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <span className="text-[#64748B] font-mono">Campuses</span>
          <div className="text-2xl font-extrabold text-[#15803D]">3 Campuses</div>
          <span className="text-[10px] text-[#64748B]">Cambridge, Boston, Online</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <span className="text-[#64748B] font-mono">Departments</span>
          <div className="text-2xl font-extrabold text-[#0F172A]">18 Departments</div>
          <span className="text-[10px] text-[#64748B]">CS, EE, BioMed, Physics</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <span className="text-[#64748B] font-mono">Academic Programs</span>
          <div className="text-2xl font-extrabold text-[#2563EB]">42 Programs</div>
          <span className="text-[10px] text-[#64748B]">B.S., M.S., Ph.D. Track</span>
        </Card>
      </div>
    </div>
  );
};

export default OrgAdminStructure;
