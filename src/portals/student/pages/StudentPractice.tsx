import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Sparkles, Brain, Play, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useQuestionBank } from '@/shared/hooks/useApiQueries';

export const StudentPractice: React.FC = () => {
  const { data: questionsData, isLoading } = useQuestionBank({ page: 1, pageSize: 10 });
  const questionsList = questionsData?.data || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">AI Practice Tests & Skill Drills</h1>
        <p className="text-xs text-[#64748B] mt-1">Adaptive item practice calibrated to your Bloom's weakness areas.</p>
      </div>

      {/* Feature Demo Exam Hero Banner */}
      <Card className="p-6 rounded-2xl bg-gradient-to-r from-[#2B2350] to-[#453682] text-white border-2 border-[#1E1838] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 bg-[#6C4DFF] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-[#FFF3A3]">
            <Sparkles className="w-3 h-3" />
            <span>INTERACTIVE FEATURE TEST SANDBOX</span>
          </div>
          <h2 className="text-lg font-heading font-black tracking-tight">AssessIQ Comprehensive Demo Examination</h2>
          <p className="text-xs text-white/80 leading-relaxed font-body">
            Test all platform features live: 14 diverse questions, proctoring violation triggers (focus loss, phone, second person), mobile QR second camera streaming, accommodations (WCAG 2.2 AA), hash-chained autosave, and cryptographic scoring.
          </p>
        </div>
        <Link to="/demo-exam">
          <Button className="bg-[#FFF3A3] hover:bg-[#FFE866] text-[#2B2350] font-mono font-bold text-xs px-4 py-2.5 rounded-xl border border-[#2B2350] shadow-sm whitespace-nowrap">
            Launch Demo Exam <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </Card>

      {isLoading ? (
        <div className="p-8 text-center text-slate-400 font-mono text-xs animate-pulse">
          Loading practice bank from API...
        </div>
      ) : questionsList.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
          <Brain className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="font-extrabold text-base text-[#0F172A]">No Practice Drills Available</h3>
          <p className="text-xs text-[#64748B]">There are currently no practice questions or adaptive skill drills available.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
          {questionsList.map((q, idx) => (
            <Card key={q.id || idx} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex justify-between items-start">
                <Sparkles className="w-6 h-6 text-purple-700" />
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  {q.section || 'General'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">{q.text}</h3>
                <p className="text-[#64748B] font-mono mt-1">{q.options?.length || 4} Multiple Choice Options</p>
              </div>
              <Button onClick={() => toast.success(`Starting Practice Drill`)} className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-2 rounded-xl">
                <Play className="w-3.5 h-3.5 mr-1.5" /> Start Practice Drill
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPractice;
