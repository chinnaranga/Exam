import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, Phone, Mail } from 'lucide-react';

export const StudentProfileGuardian: React.FC = () => {
  const guardians = [
    {
      name: 'Arthur Vance',
      rel: 'Father',
      occ: 'Principal Systems Architect',
      phone: '+1 (617) 555-0344',
      email: 'arthur.vance@enterprise.com',
      address: '450 Beacon Street, Boston, MA 02115',
    },
    {
      name: 'Dr. Margaret Vance',
      rel: 'Mother',
      occ: 'Chief Medical Officer',
      phone: '+1 (617) 555-0345',
      email: 'margaret.vance@massgeneral.org',
      address: '450 Beacon Street, Boston, MA 02115',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Parent & Guardian Records</h1>
        <p className="text-xs text-[#64748B] mt-1">Authorized family contacts for university administrative notifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
        {guardians.map((g, idx) => (
          <Card key={idx} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
            <div className="flex justify-between items-start border-b border-[#E2E8F0] pb-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#1E40AF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {g.rel}
                </span>
                <h3 className="font-bold text-sm text-[#0F172A] mt-1">{g.name}</h3>
              </div>
              <Users className="w-5 h-5 text-[#64748B]" />
            </div>
            <p className="text-[#64748B] font-mono text-[11px]">{g.occ}</p>
            <div className="space-y-1.5 pt-1 text-xs">
              <p className="flex items-center text-[#0F172A]"><Phone className="w-3.5 h-3.5 mr-1.5 text-[#15803D]" /> {g.phone}</p>
              <p className="flex items-center text-[#0F172A]"><Mail className="w-3.5 h-3.5 mr-1.5 text-[#1E40AF]" /> {g.email}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentProfileGuardian;
