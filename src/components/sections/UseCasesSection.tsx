import React from 'react';
import { USE_CASES } from '@/data/useCases';
import { ArrowRight, Building } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  return (
    <section id="use-cases" className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
            <Building className="w-3.5 h-3.5" />
            <span>Tailored Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            Built for Your Institution's Needs
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
            Explore how colleges, licensure boards, and training organizations solve high-stakes challenges with AssessIQ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {USE_CASES.map((uc) => (
            <div
              key={uc.id}
              className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-5 hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all text-left"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-[#1E293B]">{uc.title}</h3>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
                    {uc.badge}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-rose-700 font-mono text-[11px] uppercase">
                      The Challenge:
                    </span>
                    <p className="text-[#475569] mt-0.5 leading-relaxed">{uc.painPoint}</p>
                  </div>
                  <div className="pt-1">
                    <span className="font-semibold text-emerald-700 font-mono text-[11px] uppercase">
                      How AssessIQ Helps:
                    </span>
                    <p className="text-[#475569] mt-0.5 leading-relaxed">{uc.solution}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#1E293B]">
                  {uc.outcome}
                </div>
              </div>

              <div className="pt-2 border-t border-[#F1F5F9]">
                <a
                  href={uc.href}
                  className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center transition-colors"
                >
                  Learn more about {uc.title}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;

