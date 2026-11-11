import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, Phone, MapPin } from 'lucide-react';

export const StudentProfileEmergency: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Emergency Contacts</h1>
        <p className="text-xs text-[#64748B] mt-1">High-priority emergency responders registered with Campus Health & Security.</p>
      </div>

      <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 font-sans text-xs">
        <div className="flex items-center space-x-2 text-red-600 font-bold text-sm border-b border-[#E2E8F0] pb-3">
          <AlertCircle className="w-5 h-5" />
          <span>Primary Campus Emergency Responder</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="font-mono text-[10px] text-[#64748B]">CONTACT NAME</p>
            <p className="font-bold text-[#0F172A]">Arthur Vance (Father)</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="font-mono text-[10px] text-[#64748B]">PRIMARY EMERGENCY PHONE</p>
            <p className="font-bold text-red-600">+1 (617) 555-0344</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="font-mono text-[10px] text-[#64748B]">ALTERNATIVE PHONE</p>
            <p className="font-bold text-[#0F172A]">+1 (617) 555-0345</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="font-mono text-[10px] text-[#64748B]">RESIDENTIAL ADDRESS</p>
            <p className="font-bold text-[#0F172A]">450 Beacon Street, Boston, MA 02115</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentProfileEmergency;
