import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useOrganizationStore } from '@/stores/organizationStore';
import { Building2, ChevronRight, ChevronDown, BookOpen, GraduationCap, Folder, Layers } from 'lucide-react';

export const HierarchyExplorer: React.FC = () => {
  const { campuses, departments, programs, courses } = useOrganizationStore();
  const [expandedCampuses, setExpandedCampuses] = useState<Record<string, boolean>>({ 'camp_mit_01': true });
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({ 'dept_eecs_01': true });

  const toggleCampus = (id: string) => {
    setExpandedCampuses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDept = (id: string) => {
    setExpandedDepts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#1E40AF]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Multi-Tenant Hierarchy Explorer</h2>
            <p className="text-xs text-[#64748B] font-mono">Platform → Organization → Campus → Department → Program → Course</p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-50 text-[#1E40AF] border border-blue-200 font-bold">
          3NF Enforced
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {/* Top-Level Organization Node */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 space-y-3 text-white">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>[ORGANIZATION] Massachusetts Institute of Technology (mit-main)</span>
          </div>

          {/* Campuses Level */}
          <div className="pl-6 space-y-3 border-l border-slate-700 ml-2 pt-1">
            {campuses.map((camp) => (
              <div key={camp.id} className="space-y-2">
                <div
                  onClick={() => toggleCampus(camp.id)}
                  className="flex items-center space-x-2 text-slate-200 cursor-pointer hover:text-white font-medium p-1.5 rounded hover:bg-slate-800"
                >
                  {expandedCampuses[camp.id] ? <ChevronDown className="w-3.5 h-3.5 text-blue-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>[CAMPUS] {camp.name} ({camp.code})</span>
                </div>

                {/* Departments Level */}
                {expandedCampuses[camp.id] && (
                  <div className="pl-6 space-y-2 border-l border-slate-700 ml-2">
                    {departments
                      .filter((d) => d.campusId === camp.id)
                      .map((dept) => (
                        <div key={dept.id} className="space-y-2">
                          <div
                            onClick={() => toggleDept(dept.id)}
                            className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white p-1.5 rounded hover:bg-slate-800"
                          >
                            {expandedDepts[dept.id] ? <ChevronDown className="w-3.5 h-3.5 text-blue-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                            <Folder className="w-3.5 h-3.5 text-amber-400" />
                            <span>[DEPARTMENT] {dept.name} ({dept.code})</span>
                          </div>

                          {/* Programs & Courses Level */}
                          {expandedDepts[dept.id] && (
                            <div className="pl-6 space-y-2 border-l border-slate-700 ml-2">
                              {programs
                                .filter((p) => p.departmentId === dept.id)
                                .map((prog) => (
                                  <div key={prog.id} className="p-3 rounded-lg bg-slate-900 border border-slate-700 space-y-1.5">
                                    <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                                      <GraduationCap className="w-4 h-4 text-cyan-400" />
                                      <span>[PROGRAM] {prog.name} ({prog.degreeLevel})</span>
                                    </div>

                                    <div className="pl-5 space-y-1">
                                      {courses
                                        .filter((c) => c.programId === prog.id)
                                        .map((crs) => (
                                          <div key={crs.id} className="flex items-center space-x-2 text-slate-300 text-[11px]">
                                            <BookOpen className="w-3 h-3 text-emerald-400" />
                                            <span>[COURSE] {crs.name} — Credits: {crs.credits}</span>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HierarchyExplorer;
