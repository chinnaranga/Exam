import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Shield, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { useExams } from '@/hooks/useApiQueries';

export const StudentScheduledExams: React.FC = () => {
  const navigate = useNavigate();
  const { data: examsData, isLoading } = useExams({ page: 1, pageSize: 10 });

  const examsList = examsData?.data || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Scheduled Examinations</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Official high-stakes proctored exams for your active course enrollments.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-[#15803D] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {examsList.length} EXAMS SCHEDULED
        </span>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-400 font-mono text-xs animate-pulse">
          Loading live exam schedule from backend...
        </div>
      ) : examsList.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="font-extrabold text-base text-[#0F172A]">No Examinations Found</h3>
          <p className="text-xs text-[#64748B]">You currently have no active or scheduled high-stakes assessments.</p>
        </Card>
      ) : (
        <div className="space-y-4 font-sans text-xs">
          {examsList.map((exam) => (
            <Card key={exam.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#1E40AF] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {exam.code}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> {exam.scheduledStartTime || 'Scheduled'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center">
                    <Shield className="w-3 h-3 mr-1" /> WASM PROCTORED
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-[#0F172A]">{exam.title}</h3>

                <div className="flex items-center space-x-4 text-xs text-[#64748B] font-mono pt-1">
                  <span className="flex items-center text-[#2563EB]">
                    <Clock className="w-3.5 h-3.5 mr-1" /> {exam.durationMinutes} Mins
                  </span>
                  <span>• {exam.totalQuestions} Questions</span>
                  <span>• Status: {exam.status}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center space-x-3">
                <Button
                  onClick={() => navigate('/student/exams/runner')}
                  className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md flex items-center cursor-pointer"
                >
                  <Play className="w-4 h-4 mr-2" /> Launch Test Runner
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentScheduledExams;
