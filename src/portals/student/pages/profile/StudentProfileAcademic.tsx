import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { GraduationCap, Building2, BookOpen } from 'lucide-react';

export const StudentProfileAcademic: React.FC = () => {
  const acad = {
    university: 'Massachusetts Institute of Technology (MIT)',
    campus: 'Cambridge Main Campus',
    department: 'Department of Electrical Engineering & Computer Science (EECS)',
    program: 'B.S. Computer Science & Artificial Intelligence',
    specialization: 'Distributed Systems & Machine Learning Acceleration',
    semester: 'Semester 7 (Fall 2026)',
    advisor: 'Dr. Robert Chen (Professor of Computer Science)',
    admissionYear: 2023,
    expectedGraduation: 2026,
    category: 'UNDERGRADUATE',
    type: 'REGULAR FULL TIME',
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Academic Information</h1>
        <p className="text-xs text-[#64748B] mt-1">Official university enrollment record, faculty advisor, and campus allocation.</p>
      </div>

      <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 font-sans text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <p className="font-mono text-[10px] text-[#64748B]">INSTITUTION</p>
            <p className="font-bold text-sm text-[#0F172A]">{acad.university}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <p className="font-mono text-[10px] text-[#64748B]">CAMPUS</p>
            <p className="font-bold text-sm text-[#0F172A]">{acad.campus}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <p className="font-mono text-[10px] text-[#64748B]">DEPARTMENT</p>
            <p className="font-bold text-xs text-[#1E40AF]">{acad.department}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <p className="font-mono text-[10px] text-[#64748B]">DEGREE PROGRAM</p>
            <p className="font-bold text-xs text-[#1E40AF]">{acad.program}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <p className="font-mono text-[10px] text-[#64748B]">FACULTY ADVISOR</p>
            <p className="font-bold text-xs text-[#0F172A]">{acad.advisor}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <p className="font-mono text-[10px] text-[#64748B]">EXPECTED GRADUATION</p>
            <p className="font-bold text-xs text-[#15803D]">May {acad.expectedGraduation}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentProfileAcademic;
