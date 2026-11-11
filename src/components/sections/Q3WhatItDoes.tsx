import React, { useState, useEffect } from 'react';
import CropMarks from '@/components/marks/CropMarks';
import StickerBadge from '@/components/marks/StickerBadge';
import OmrBubble from '@/components/marks/OmrBubble';
import MarginNote from '@/components/marks/MarginNote';
import RedCheck from '@/components/marks/RedCheck';
import { WifiOff, Award, Sparkles } from 'lucide-react';

export const Q3WhatItDoes: React.FC = () => {
  // Live typing animation for tile 1 (AI Question Builder)
  const fullQuestion = 'Explain how distributed consensus maintains consistency during network partitions.';
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullQuestion.slice(0, index));
      index++;
      if (index > fullQuestion.length + 10) {
        index = 0;
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="q3-what-it-does"
      className="mx-3 sm:mx-6 my-4 sm:my-6 rounded-[40px] bg-white p-8 sm:p-14 lg:p-20 relative overflow-hidden border border-[#D4CEF0] shadow-[0_20px_50px_rgba(43,35,80,0.06)] text-left"
    >
      <CropMarks />

      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#2B2350] bg-[#EFF6FF] px-3.5 py-1.5 rounded-full border border-[#2B2350]/20 shadow-xs">
          Q3 / 08 · WHAT IT DOES
        </span>
        <StickerBadge color="violet" rotate={3}>
          6 CORE CAPABILITIES
        </StickerBadge>
      </div>

      <div className="space-y-4 mb-10">
        <h2 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2350] tracking-tight">
          Everything your exam needs.
        </h2>
        <p className="font-body text-base sm:text-lg text-[#6B6590] max-w-xl font-medium">
          Every tool is designed to work like the best teacher you ever had: sharp, thorough, and fair.
        </p>
      </div>

      {/* Bento Grid: 6 Tiles of varied sizes in pastel blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tile 1: AI Question Builder (Large, Periwinkle #C9CCFF) */}
        <div className="md:col-span-2 rounded-3xl bg-[#C9CCFF] p-7 border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-[#2B2350]">
                01 · AI QUESTION BUILDER
              </span>
              <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#2B2350] font-bold">
                SYLLABUS TO EXAM
              </span>
            </div>
            <h3 className="font-heading text-2xl font-extrabold text-[#2B2350]">
              Generate exam questions from your course slides
            </h3>
            <p className="font-body text-xs text-[#2B2350]/80">
              Paste your curriculum. AI drafts multiple-choice and short-answer questions with calibrated difficulty for faculty review.
            </p>
          </div>

          {/* Live Mini Typing UI */}
          <div className="bg-white rounded-2xl p-4 border border-[#2B2350] space-y-3 font-mono text-xs text-[#2B2350]">
            <div className="flex items-center space-x-2 text-[11px] text-[#6C4DFF] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DRAFTING QUESTION STEM:</span>
            </div>
            <div className="min-h-[36px] font-sans font-medium text-xs leading-relaxed text-[#2B2350]">
              {typedText}
              <span className="inline-block w-1.5 h-3.5 bg-[#6C4DFF] animate-pulse ml-1" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center space-x-2 p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                <OmrBubble letter="A" size="sm" />
                <span className="truncate text-[11px]">Two-phase commit protocol</span>
              </div>
              <div className="flex items-center space-x-2 p-1.5 rounded bg-emerald-50 border border-emerald-300">
                <OmrBubble letter="B" size="sm" filled />
                <span className="truncate text-[11px] font-bold">Raft quorum agreement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tile 2: Smart Proctoring (Large, Mint #B8F0D2) */}
        <div className="rounded-3xl bg-[#B8F0D2] p-7 border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-[#2B2350]">
                02 · SMART PROCTORING
              </span>
              <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#2B2350] font-bold">
                ON-DEVICE
              </span>
            </div>
            <h3 className="font-heading text-2xl font-extrabold text-[#2B2350]">
              Fair vigilance without spying
            </h3>
            <p className="font-body text-xs text-[#2B2350]/80">
              Flags unusual gaze and secondary tabs for human proctors. No video stored on servers.
            </p>
          </div>

          {/* Live Mini Face-Frame UI */}
          <div className="bg-white rounded-2xl p-4 border border-[#2B2350] text-center space-y-2">
            <div className="w-24 h-24 mx-auto rounded-full border-2 border-dashed border-[#2B2350] flex items-center justify-center relative bg-[#F8FAFC]">
              <div className="w-16 h-16 rounded-full bg-[#C9CCFF]/40 flex items-center justify-center font-heading text-lg font-bold text-[#2B2350]">
                JD
              </div>
              <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border border-white" />
            </div>
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-mono font-bold text-[#FF4D5E] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              <span>● Gaze drift: 3s flagged</span>
            </div>
            <div className="text-[10px] font-mono text-[#6B6590]">Sample data · Sent to proctor</div>
          </div>
        </div>

        {/* Tile 3: AI Essay Grading (Small, Coral #FFB5A7) */}
        <div className="rounded-3xl bg-[#FFB5A7] p-7 border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase text-[#2B2350]">
              03 · ESSAY GRADING
            </span>
            <h3 className="font-heading text-xl font-extrabold text-[#2B2350]">
              AI Rubric Grading
            </h3>
            <p className="font-body text-xs text-[#2B2350]/80">
              Evaluates semantic arguments against faculty rubrics in under 15 seconds.
            </p>
          </div>

          {/* Mini Essay Snippet with Red Highlight */}
          <div className="bg-white rounded-2xl p-3 border border-[#2B2350] text-xs font-mono space-y-1.5">
            <div className="text-[10px] text-[#6B6590]">ESSAY SNIPPET:</div>
            <p className="text-[11px] leading-relaxed text-[#2B2350]">
              "...therefore the safety principle holds because <span className="bg-[#FFF3A3] px-1 font-bold">quorum intersection</span> prevents two conflicting decisions."
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
              <span className="text-[10px] text-[#10B981] font-bold">Rubric: 10/10</span>
              <MarginNote rotate={-3} className="text-sm">
                well stated!
              </MarginNote>
            </div>
          </div>
        </div>

        {/* Tile 4: Works Offline (Small, Sky #BFE6FF) */}
        <div className="rounded-3xl bg-[#BFE6FF] p-7 border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase text-[#2B2350]">
              04 · OFFLINE-READY
            </span>
            <h3 className="font-heading text-xl font-extrabold text-[#2B2350]">
              Works Offline, Autosaves Always
            </h3>
            <p className="font-body text-xs text-[#2B2350]/80">
              Saves every keystroke locally. Wi-Fi can drop without losing candidate progress.
            </p>
          </div>

          {/* Mini Toast UI */}
          <div className="bg-white rounded-2xl p-3 border border-[#2B2350] flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#2563EB] flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4 text-[#2B2350]" />
            </div>
            <div className="text-left font-mono text-xs">
              <div className="font-bold text-[#2B2350]">Saved locally to browser</div>
              <div className="text-[10px] text-[#6B6590]">Syncs on reconnect</div>
            </div>
          </div>
        </div>

        {/* Tile 5: Certificates (Small, Lemon #FFF3A3) */}
        <div className="rounded-3xl bg-[#FFF3A3] p-7 border-2 border-[#2B2350] shadow-[6px_6px_0px_#2B2350] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase text-[#2B2350]">
              05 · CERTIFICATES
            </span>
            <h3 className="font-heading text-xl font-extrabold text-[#2B2350]">
              Digital Certificates & Badges
            </h3>
            <p className="font-body text-xs text-[#2B2350]/80">
              Automatic shareable credentials issued instantly once grades are approved.
            </p>
          </div>

          {/* Mini Certificate Card */}
          <div className="bg-white rounded-2xl p-3 border border-[#2B2350] flex items-center justify-between">
            <div className="flex items-center space-x-2 text-left">
              <Award className="w-6 h-6 text-[#6C4DFF]" />
              <div className="font-mono text-xs">
                <div className="font-bold text-[#2B2350]">Verified Pass</div>
                <div className="text-[10px] text-[#6B6590]">Open Badge 3.0</div>
              </div>
            </div>
            <StickerBadge color="mint" rotate={4} className="text-[9px] px-2 py-0.5">
              ISSUED
            </StickerBadge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Q3WhatItDoes;
