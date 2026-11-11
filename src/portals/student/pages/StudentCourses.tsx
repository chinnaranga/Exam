import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { BookOpen, Play } from 'lucide-react';
import { toast } from 'sonner';

export const StudentCourses: React.FC = () => {
  const courses: any[] = [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">My Learning & Enrolled Courses</h1>
        <p className="text-xs text-[#64748B] mt-1">Academic term enrollment and course progress trackers.</p>
      </div>

      {courses.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="font-extrabold text-base text-[#0F172A]">No Course Enrollments Found</h3>
          <p className="text-xs text-[#64748B]">You are not currently enrolled in any academic courses for this term.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((crs, idx) => (
            <Card key={idx} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 font-sans text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#1E40AF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {crs.code}
                  </span>
                  <h3 className="font-bold text-sm text-[#0F172A] mt-1.5">{crs.title}</h3>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${crs.status === 'Completed' ? 'bg-emerald-50 text-[#15803D] border border-emerald-200' : 'bg-blue-50 text-[#1E40AF] border border-blue-200'}`}>
                  {crs.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-[#64748B]">
                  <span>Course Completion</span>
                  <span className="font-bold text-[#0F172A]">{crs.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1E40AF] rounded-full" style={{ width: `${crs.progress}%` }} />
                </div>
              </div>

              <Button onClick={() => toast.success(`Opened course module for ${crs.code}`)} className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-bold py-2 rounded-xl">
                <Play className="w-3.5 h-3.5 mr-1.5" /> Continue Learning
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
