import React from 'react';
import CropMarks from '@/components/marks/CropMarks';
import StickerBadge from '@/components/marks/StickerBadge';
import RedArrow from '@/components/marks/RedArrow';
import MarginNote from '@/components/marks/MarginNote';
import { HOW_IT_WORKS_STEPS } from '@/data/steps';

export const Q4HowItWorks: React.FC = () => {
  return (
    <section
      id="q4-how-it-works"
      className="mx-3 sm:mx-6 my-4 sm:my-6 rounded-[40px] bg-[#B8F0D2] p-8 sm:p-14 lg:p-20 relative overflow-hidden border border-[#9DE6BE] shadow-[0_20px_50px_rgba(43,35,80,0.06)] text-left"
    >
      <CropMarks />

      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#2B2350] bg-white/70 px-3.5 py-1.5 rounded-full border border-[#2B2350]/20 shadow-xs">
          Q4 / 08 · HOW IT WORKS
        </span>
        <StickerBadge color="lemon" rotate={-3}>
          ANSWER KEY
        </StickerBadge>
      </div>

      <div className="space-y-4 mb-12">
        <h2 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2350] tracking-tight">
          How it works in practice.
        </h2>
        <p className="font-body text-base sm:text-lg text-[#2B2350]/80 max-w-xl font-medium">
          A four-step cycle that cuts exam preparation and grading from three weeks to under an hour.
        </p>
      </div>

      {/* 4 Steps laid out like an answer key */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {HOW_IT_WORKS_STEPS.map((step, idx) => (
          <div key={step.number} className="relative">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                {/* Big Outlined Number */}
                <div className="font-heading text-5xl font-extrabold text-transparent stroke-2 stroke-[#2B2350] [-webkit-text-stroke:2px_#2B2350] leading-none">
                  {step.number}
                </div>
                <h3 className="font-heading text-xl font-extrabold text-[#2B2350]">
                  {step.title}
                </h3>
                <p className="font-body text-xs text-[#6B6590] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] font-mono text-[11px] font-bold text-[#6C4DFF]">
                {step.outcome}
              </div>
            </div>

            {/* Hand-drawn red arrow linking to next on desktop */}
            {idx < 3 && (
              <div className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10">
                <RedArrow delay={0.2 * idx} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-right pr-4">
        <MarginNote rotate={-2} className="text-xl">
          four checks and you're done!
        </MarginNote>
      </div>
    </section>
  );
};

export default Q4HowItWorks;

