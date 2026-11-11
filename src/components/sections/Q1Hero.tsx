import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import RedCircle from '@/components/marks/RedCircle';
import RedUnderline from '@/components/marks/RedUnderline';
import MarginNote from '@/components/marks/MarginNote';
import StickerBadge from '@/components/marks/StickerBadge';
import OmrBubble from '@/components/marks/OmrBubble';
import CropMarks from '@/components/marks/CropMarks';

export const Q1Hero: React.FC = () => {
  const [activeBubble, setActiveBubble] = useState<number>(2); // 3rd bubble (C) fills on load
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveBubble(2);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 10, y: y * -10 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section className="mx-3 sm:mx-6 my-4 sm:my-6 rounded-[40px] bg-[#C9CCFF] p-8 sm:p-14 lg:p-20 relative overflow-hidden border border-[#B0B5FF] shadow-[0_20px_50px_rgba(43,35,80,0.06)] text-left">
      <CropMarks />

      {/* Top Question Number Badge */}
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#2B2350] bg-white/70 px-3.5 py-1.5 rounded-full border border-[#2B2350]/20 shadow-xs">
          Q1 / 08 · AI ASSESSMENT PLATFORM
        </span>
        <StickerBadge color="lemon" rotate={4}>
          BETA ACCESS
        </StickerBadge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Oversized Type & CTA */}
        <div className="lg:col-span-7 space-y-7">
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-[96px] text-[#2B2350] leading-[0.98] tracking-tight">
            Exams that{' '}
            <RedCircle delay={0.3}>
              <span className="text-[#2B2350]">mark</span>
            </RedCircle>{' '}
            <RedUnderline delay={0.6}>
              <span className="text-[#2B2350]">themselves.</span>
            </RedUnderline>
          </h1>

          <p className="font-body text-lg sm:text-xl text-[#2B2350]/85 max-w-xl leading-relaxed font-medium">
            Build questions with AI, keep every test fair, and return graded results in minutes, not weeks.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a href="#q8-final">
              <button className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-[0_6px_20px_rgba(108,77,255,0.35)] hover:shadow-[0_8px_25px_rgba(108,77,255,0.45)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center">
                Book a demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </a>
            <a href="#q4-how-it-works">
              <button className="bg-white hover:bg-[#F8FAFC] text-[#2B2350] border-2 border-[#2B2350] font-mono font-bold text-sm sm:text-base px-7 py-4 rounded-2xl shadow-xs transition-all flex items-center">
                <Play className="w-4 h-4 mr-2 fill-[#2B2350]" />
                Watch the 60-sec tour
              </button>
            </a>
          </div>

          {/* Row of 4 OMR bubbles under buttons: 3rd fills violet on load */}
          <div className="pt-4 flex items-center space-x-3">
            <span className="font-mono text-xs text-[#2B2350]/70 uppercase tracking-wider font-semibold">
              Fill one answer:
            </span>
            <div className="flex items-center space-x-2">
              {['A', 'B', 'C', 'D'].map((letter, idx) => (
                <OmrBubble
                  key={letter}
                  letter={letter}
                  filled={activeBubble === idx}
                  onClick={() => setActiveBubble(idx)}
                  animateFill={idx === 2}
                  size="md"
                />
              ))}
            </div>
            <MarginNote rotate={-4} className="ml-2 hidden sm:inline-block">
              ← pick C to auto-grade
            </MarginNote>
          </div>
        </div>

        {/* Right Column: Tilted White Exam Paper Card */}
        <div
          className="lg:col-span-5 flex justify-center perspective-[1000px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            style={{
              transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg) rotate(-2deg)`,
              transformStyle: 'preserve-3d',
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-full max-w-md bg-white border-2 border-[#2B2350] rounded-3xl p-6 sm:p-7 shadow-[10px_14px_0px_#2B2350] relative transition-shadow duration-300"
          >
            {/* Overlapping Stickers */}
            <div className="absolute -top-3 -right-3 z-30 flex flex-col items-end gap-1.5 pointer-events-none">
              <StickerBadge color="lemon" rotate={5}>
                AUTO-GRADED
              </StickerBadge>
              <StickerBadge color="mint" rotate={-3}>
                INTEGRITY CHECKED
              </StickerBadge>
            </div>

            {/* Exam Header */}
            <div className="border-b-2 border-dashed border-[#2B2350]/20 pb-4 mb-5">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#6B6590]">
                <span>EXAM CODE: CS-401</span>
                <span>SAMPLE DATA</span>
              </div>
              <div className="mt-2 text-xs font-mono text-[#2B2350]">
                Name: <span className="font-handwriting text-lg text-[#2B2350] font-bold">Jane Doe</span>
              </div>
            </div>

            {/* 3 Questions with Answer Bubbles */}
            <div className="space-y-4 font-body text-xs text-[#2B2350]">
              <div className="space-y-1.5">
                <div className="font-semibold flex justify-between">
                  <span>1. Primary benefit of AI rubric evaluation?</span>
                  <span className="font-handwriting text-[#FF4D5E] font-bold text-sm">+30pts</span>
                </div>
                <div className="flex space-x-2 pl-2">
                  <OmrBubble letter="A" size="sm" />
                  <OmrBubble letter="B" size="sm" filled />
                  <OmrBubble letter="C" size="sm" />
                  <OmrBubble letter="D" size="sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="font-semibold flex justify-between">
                  <span>2. Candidate data storage model?</span>
                  <span className="font-handwriting text-[#FF4D5E] font-bold text-sm">+32pts</span>
                </div>
                <div className="flex space-x-2 pl-2">
                  <OmrBubble letter="A" size="sm" filled />
                  <OmrBubble letter="B" size="sm" />
                  <OmrBubble letter="C" size="sm" />
                  <OmrBubble letter="D" size="sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="font-semibold flex justify-between">
                  <span>3. Wi-Fi drop handling during finals?</span>
                  <span className="font-handwriting text-[#FF4D5E] font-bold text-sm">+30pts</span>
                </div>
                <div className="flex space-x-2 pl-2">
                  <OmrBubble letter="A" size="sm" />
                  <OmrBubble letter="B" size="sm" />
                  <OmrBubble letter="C" size="sm" filled />
                  <OmrBubble letter="D" size="sm" />
                </div>
              </div>
            </div>

            {/* Footer with Circled Score & Margin Note */}
            <div className="mt-6 pt-4 border-t-2 border-[#2B2350]/15 flex items-center justify-between">
              <div>
                <MarginNote rotate={-5} className="text-xl">
                  graded in 12s!
                </MarginNote>
              </div>

              {/* Red Pen Circled Score */}
              <div className="relative">
                <span className="font-heading text-3xl font-extrabold text-[#FF4D5E] tracking-tight">
                  92/100
                </span>
                <svg
                  className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none"
                  viewBox="0 0 100 50"
                  fill="none"
                >
                  <path
                    d="M 10,25 C 12,8 45,5 75,7 C 95,9 98,22 93,36 C 88,48 50,48 20,45 C 5,42 6,28 10,18"
                    stroke="#FF4D5E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Q1Hero;

