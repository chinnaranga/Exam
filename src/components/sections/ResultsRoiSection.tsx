import React, { useState } from 'react';
import { RESULTS_STATS, ROI_DEFAULTS } from '@/data/stats';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { Calculator, Sparkles } from 'lucide-react';

export const ResultsRoiSection: React.FC = () => {
  const { ref, isInView } = useInView();

  // ROI Calculator states
  const [candidates, setCandidates] = useState<number>(ROI_DEFAULTS.candidatesPerYear);
  const [gradingHours, setGradingHours] = useState<number>(ROI_DEFAULTS.gradingHoursPerExam);
  const [examsPerYear, setExamsPerYear] = useState<number>(ROI_DEFAULTS.averageExamsPerYear);

  // Simple calculation: traditional total hours = examsPerYear * gradingHours
  // AssessIQ saves ~75% of grading time
  const totalTraditionalHours = examsPerYear * gradingHours;
  const estimatedHoursSaved = Math.round(totalTraditionalHours * 0.75);
  const estimatedWeeksSaved = (estimatedHoursSaved / 40).toFixed(1);

  // Count ups
  const count0 = useCountUp(RESULTS_STATS[0].targetNumber, 1500, isInView);
  const count1 = useCountUp(RESULTS_STATS[1].targetNumber, 1500, isInView);
  const count2 = useCountUp(RESULTS_STATS[2].targetNumber, 1500, isInView);
  const counts = [count0, count1, count2];

  return (
    <section ref={ref} className="py-20 px-6 sm:px-12 bg-[#EFF6FF] border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto space-y-14">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white text-[#2563EB] text-xs font-mono font-bold uppercase border border-[#BFDBFE]">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Proven Outcomes & Efficiency</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            Measurable Results for Busy Exam Directors
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
            Real efficiency gains across question drafting, proctor verification, and final grading turnaround.
          </p>
        </div>

        {/* 3 Big Count-Up Stats with {{STAT_VALUE}} Placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {RESULTS_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2"
            >
              <div className="text-4xl sm:text-5xl font-extrabold text-[#2563EB] font-mono tracking-tight">
                {counts[idx]}
                {stat.unit}
              </div>
              <div className="text-xs font-mono font-bold text-[#64748B]">
                {stat.placeholder}
              </div>
              <h3 className="font-bold text-base text-[#1E293B] pt-1">{stat.label}</h3>
              <p className="text-xs text-[#475569] leading-relaxed">{stat.subtext}</p>
            </div>
          ))}
        </div>

        {/* Small Interactive ROI Calculator */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6 text-left">
          <div className="flex items-center space-x-3 border-b border-[#E2E8F0] pb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1E293B]">
                Institutional Time-Savings Calculator
              </h3>
              <p className="text-xs text-[#64748B]">
                Estimate how many hours your faculty will save per academic year.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E293B]">Candidates per Year</label>
              <input
                type="number"
                min="100"
                step="500"
                value={candidates}
                onChange={(e) => setCandidates(Number(e.target.value) || 0)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#1E293B] focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E293B]">Exams per Year</label>
              <input
                type="number"
                min="1"
                max="50"
                value={examsPerYear}
                onChange={(e) => setExamsPerYear(Number(e.target.value) || 0)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#1E293B] focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E293B]">Grading Hours / Exam</label>
              <input
                type="number"
                min="5"
                step="5"
                value={gradingHours}
                onChange={(e) => setGradingHours(Number(e.target.value) || 0)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono text-[#1E293B] focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              />
            </div>
          </div>

          {/* Calculator Output */}
          <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase text-[#2563EB]">
                Estimate
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                ~{estimatedHoursSaved} Hours Saved per Year
              </div>
              <div className="text-xs text-[#475569]">
                Equivalent to approximately {estimatedWeeksSaved} full 40-hour workweeks returned to research & teaching.
              </div>
            </div>
            <a href="#demo" className="shrink-0">
              <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors">
                Book a Demo →
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsRoiSection;
