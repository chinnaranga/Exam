import React from 'react';
import { COMPARISON_ROWS } from '@/data/comparison';
import { Check, Minus } from 'lucide-react';

export const ComparisonTableSection: React.FC = () => {
  return (
    <section className="py-20 px-6 sm:px-12 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            AssessIQ vs. Traditional Exam Tools
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
            See how modern AI-native assessment software compares against legacy proctoring and LMS quizzing tools.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
            <div className="grid grid-cols-12 bg-[#F8FAFC] border-b border-[#E2E8F0] p-4 text-xs font-mono font-bold text-[#64748B]">
              <div className="col-span-6 text-left">CAPABILITY</div>
              <div className="col-span-3 text-center text-[#2563EB] border-t-2 border-[#2563EB] -mt-4 pt-4 bg-[#EFF6FF]/60 rounded-t-lg">
                ASSESSIQ
              </div>
              <div className="col-span-3 text-center">TRADITIONAL TOOLS</div>
            </div>

            <div className="divide-y divide-[#E2E8F0] bg-white text-xs">
              {COMPARISON_ROWS.map((row) => (
                <div key={row.feature} className="grid grid-cols-12 p-4 items-center hover:bg-[#F8FAFC]/50 transition-colors">
                  <div className="col-span-6 text-left pr-4">
                    <div className="font-bold text-[#1E293B]">{row.feature}</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">{row.description}</div>
                  </div>

                  {/* AssessIQ Column (Highlighted with subtle blue tint) */}
                  <div className="col-span-3 text-center flex items-center justify-center font-bold text-[#2563EB] bg-[#EFF6FF]/30 py-2 rounded">
                    {typeof row.assessIq === 'boolean' ? (
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="font-mono">{row.assessIq}</span>
                    )}
                  </div>

                  {/* Traditional Tools Column */}
                  <div className="col-span-3 text-center flex items-center justify-center text-[#94A3B8]">
                    {typeof row.traditional === 'boolean' ? (
                      <Minus className="w-4 h-4 text-[#CBD5E1]" />
                    ) : (
                      <span className="font-mono text-[#64748B]">{row.traditional}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTableSection;
