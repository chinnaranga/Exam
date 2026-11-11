import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar, Globe, Heart } from 'lucide-react';
import { toast } from 'sonner';

export const StudentProfilePersonal: React.FC = () => {
  const info = {
    firstName: 'Eleanor',
    middleName: 'Claire',
    lastName: 'Vance',
    preferredName: 'Ellie',
    dob: 'September 14, 2003',
    gender: 'Female',
    nationality: 'United States',
    bloodGroup: 'O Positive (O+)',
    languages: ['English (Native)', 'Spanish (Professional)', 'Mandarin (Basic)'],
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Personal Information</h1>
        <p className="text-xs text-[#64748B] mt-1">Legal name, demographic data, blood group, and language proficiencies.</p>
      </div>

      <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 font-sans text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="font-mono text-[10px] text-[#64748B]">FIRST NAME</p>
            <p className="font-bold text-[#0F172A]">{info.firstName}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="font-mono text-[10px] text-[#64748B]">MIDDLE NAME</p>
            <p className="font-bold text-[#0F172A]">{info.middleName}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="font-mono text-[10px] text-[#64748B]">LAST NAME</p>
            <p className="font-bold text-[#0F172A]">{info.lastName}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="font-mono text-[10px] text-[#64748B]">DATE OF BIRTH</p>
            <p className="font-bold text-[#0F172A]">{info.dob}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="font-mono text-[10px] text-[#64748B]">GENDER</p>
            <p className="font-bold text-[#0F172A]">{info.gender}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="font-mono text-[10px] text-[#64748B]">BLOOD GROUP</p>
            <p className="font-bold text-red-600">{info.bloodGroup}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentProfilePersonal;
