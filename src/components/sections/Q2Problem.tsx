import React from 'react';
import CropMarks from '@/components/marks/CropMarks';
import RedStrike from '@/components/marks/RedStrike';
import MarginNote from '@/components/marks/MarginNote';
import StickerBadge from '@/components/marks/StickerBadge';

export const Q2Problem: React.FC = () => {
  return (
    <section
      id="q2-problem"
      className="mx-3 sm:mx-6 my-4 sm:my-6 rounded-[40px] bg-[#FFF3A3] p-8 sm:p-14 lg:p-20 relative overflow-hidden border border-[#EBE085] shadow-[0_20px_50px_rgba(43,35,80,0.06)] text-left"
    >
      <CropMarks />

      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#2B2350] bg-white/70 px-3.5 py-1.5 rounded-full border border-[#2B2350]/20 shadow-xs">
          Q2 / 08 · THE PROBLEM
        </span>
        <StickerBadge color="coral" rotate={-4}>
          OUTDATED SYSTEMS
        </StickerBadge>
      </div>

      <div className="max-w-4xl space-y-12">
        <div>
          <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#2B2350] tracking-tight leading-[1.05]">
            Exams are still stuck in 2005.
          </h2>
          <p className="font-body text-base sm:text-lg text-[#6B6590] mt-3 font-medium">
            Online testing tools were built for compliance checkboxes, not teaching or integrity.
          </p>
        </div>

        {/* 3 Oversized Typographic Lines with Red Strike & Bold Fix */}
        <div className="space-y-10 font-heading">
          {/* Line 1: Cheating */}
          <div className="space-y-2 border-b-2 border-dashed border-[#2B2350]/15 pb-8">
            <div className="text-xl sm:text-3xl text-[#2B2350]/60">
              <RedStrike delay={0.2}>
                Invasive webcam spyware that records bedrooms and violates privacy
              </RedStrike>
            </div>
            <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B2350] pt-1">
              → Smart proctoring that respects student privacy and runs locally on-device.
            </div>
          </div>

          {/* Line 2: Weeks of grading */}
          <div className="space-y-2 border-b-2 border-dashed border-[#2B2350]/15 pb-8">
            <div className="text-xl sm:text-3xl text-[#2B2350]/60">
              <RedStrike delay={0.4}>
                Faculty burning through late nights hand-grading piles of essay papers
              </RedStrike>
            </div>
            <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B2350] pt-1">
              → AI rubric grading that returns consistent, detailed scores in minutes.
            </div>
          </div>

          {/* Line 3: Inconsistent questions */}
          <div className="space-y-2">
            <div className="text-xl sm:text-3xl text-[#2B2350]/60">
              <RedStrike delay={0.6}>
                Stale question banks that leak online and get turned into cheat sheets
              </RedStrike>
            </div>
            <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B2350] pt-1">
              → AI drafts fresh, syllabus-matched questions every single time.
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center space-x-3">
          <MarginNote rotate={-3} className="text-2xl">
            time to upgrade the test paper!
          </MarginNote>
        </div>
      </div>
    </section>
  );
};

export default Q2Problem;

