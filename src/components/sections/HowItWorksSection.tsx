import React from 'react';
import { HOW_IT_WORKS_STEPS } from '@/data/steps';
import { Workflow } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 px-6 sm:px-12 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto space-y-14">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
            <Workflow className="w-3.5 h-3.5" />
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            How AssessIQ Works
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
            From syllabus import to student certificate delivery in four clear steps.
          </p>
        </div>

        {/* 4-Step Horizontal Timeline with Connecting Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.number}
              className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs space-y-4 text-left flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-sm shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
                    {step.number}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase">
                    Step {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1E293B]">{step.title}</h3>
                  <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Short outcome line */}
              <div className="text-[11px] font-semibold text-[#2563EB] pt-3 border-t border-[#E2E8F0]">
                {step.outcome}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

