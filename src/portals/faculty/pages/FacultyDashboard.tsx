import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuestionBank, useExams } from '@/shared/hooks/useApiQueries';

export const FacultyDashboard: React.FC = () => {
  const { data: questionsData, isLoading: isQuestionsLoading } = useQuestionBank({ page: 1, pageSize: 10 });
  const { data: examsData, isLoading: isExamsLoading } = useExams({ page: 1, pageSize: 10 });

  const totalQuestions = questionsData?.total || questionsData?.data?.length || 0;
  const totalExams = examsData?.total || examsData?.data?.length || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-mono font-bold uppercase border border-purple-200 mb-2">
          <Brain className="w-3.5 h-3.5" />
          <span>Faculty Academic Authoring & Grading Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#111827]">Faculty Dashboard</h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Manage course blueprints, generate IRT 3PL calibrated items, and review essay evaluation Rubrics.
        </p>
      </div>

      {/* Dynamic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 font-mono text-xs">
        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Question Bank Items</span>
          {isQuestionsLoading ? (
            <div className="text-2xl font-extrabold text-purple-700 animate-pulse">...</div>
          ) : (
            <div className="text-2xl font-extrabold text-purple-700">{totalQuestions} Items</div>
          )}
          <span className="text-[10px] text-emerald-600 font-bold">IRT Calibrated</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Active Exams</span>
          {isExamsLoading ? (
            <div className="text-2xl font-extrabold text-[#111827] animate-pulse">...</div>
          ) : (
            <div className="text-2xl font-extrabold text-[#111827]">{totalExams} Exams</div>
          )}
          <span className="text-[10px] text-amber-600 font-bold">Live Assessments</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Active Courses</span>
          <div className="text-2xl font-extrabold text-[#111827]">Active Term</div>
          <span className="text-[10px] text-purple-700 font-bold">Department Roster</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">AI Generator Calibration</span>
          <div className="text-2xl font-extrabold text-emerald-600">Active</div>
          <span className="text-[10px] text-emerald-600 font-bold">Bloom's Verified</span>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        <Card className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3 className="font-bold text-base text-[#111827]">Generative AI Item Studio</h3>
            <span className="text-xs font-mono font-bold text-purple-700">IRT 3PL MODEL</span>
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Generate multiple-choice, coding, and essay questions fine-tuned to Bloom's taxonomy levels (Remember to Create).
          </p>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs">
            Launch AI Question Studio
          </Button>
        </Card>

        <Card className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3 className="font-bold text-base text-[#111827]">Assessment Blueprint Builder</h3>
            <span className="text-xs font-mono font-bold text-purple-700">BLUEPRINT MATCH</span>
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Construct domain-weighted examination blueprints with automated shuffle and anti-cheating variant generation.
          </p>
          <Link to="/faculty/exams">
            <Button className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs">
              Build Examination Blueprint
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboard;
