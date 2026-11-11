import React from 'react';
import { X, Check, Zap } from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  const cards = [
    {
      title: 'Academic Dishonesty',
      before: 'Cheating erodes trust',
      beforeDetail:
        'Clunky screen recordings invade student privacy, require hours of video review, and easily miss secondary screen lookups.',
      after: 'Smart, privacy-respecting proctoring',
      afterDetail:
        'On-device analysis flags suspicious gaze, tab switches, and audio for human proctors to verify. No invasive cloud recording.',
    },
    {
      title: 'Grading Bottlenecks',
      before: 'Grading takes weeks',
      beforeDetail:
        'Professors and TAs spend nights hand-grading piles of essay responses, leading to delayed feedback and scoring fatigue.',
      after: 'AI-assisted grading in minutes',
      afterDetail:
        'AI evaluates written answers against your exact faculty rubrics, returning detailed feedback and scores in seconds for faculty review.',
    },
    {
      title: 'Question Quality & Leakage',
      before: 'Exam quality is inconsistent',
      beforeDetail:
        'Static question pools leak online, and creating balanced new tests every semester eats up valuable teaching time.',
      after: 'AI drafts questions, faculty approves',
      afterDetail:
        'Generate balanced question sets tagged by topic and difficulty directly from your syllabus, reviewed and finalized by your faculty.',
    },
  ];

  return (
    <section className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
            <Zap className="w-3.5 h-3.5" />
            <span>The Modern Assessment Shift</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            From Frustrating Exam Cycles to Effortless Evaluations
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
            Traditional exam setups frustrate students and exhaust faculty. AssessIQ creates a fair, fast, and calm testing experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between space-y-5 hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all"
            >
              <div className="space-y-4">
                {/* Red Soft Before Strip */}
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 space-y-1 text-left">
                  <div className="flex items-center space-x-1.5 text-rose-700 text-xs font-bold font-mono uppercase">
                    <X className="w-3.5 h-3.5 shrink-0" />
                    <span>Before: {card.before}</span>
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed">
                    {card.beforeDetail}
                  </p>
                </div>

                {/* Green Soft After Strip */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1 text-left">
                  <div className="flex items-center space-x-1.5 text-[#10B981] text-xs font-bold font-mono uppercase">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>With AssessIQ: {card.after}</span>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {card.afterDetail}
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-[#64748B] pt-3 border-t border-[#F1F5F9] text-left">
                Verified outcome for higher-ed and certification teams
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;

