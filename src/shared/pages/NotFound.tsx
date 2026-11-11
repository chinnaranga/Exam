import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, HelpCircle } from 'lucide-react';
import {
  RedCircle,
  CropMarks,
  MarginNote,
} from '@/components/marks';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF7] font-body text-[#2B2350] selection:bg-[#FFF3A3] selection:text-[#2B2350] antialiased pencil-cursor flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header Bar */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 border-b-2 border-dashed border-[#2B2350]/20">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#6C4DFF] text-white flex items-center justify-center shadow-xs group-hover:bg-[#5A3DEB] transition-colors">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight text-[#2B2350]">
            Assess<span className="text-[#6C4DFF]">IQ</span>
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
        >
          ← HOME
        </Link>
      </header>

      {/* Main Sheet Card */}
      <main className="max-w-md w-full mx-auto my-auto py-10 text-center">
        <div className="relative p-8 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-5">
          <CropMarks />

          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF3A3] border-2 border-[#2B2350] text-[#2B2350] flex items-center justify-center shadow-xs">
            <HelpCircle className="w-7 h-7" />
          </div>

          <div className="space-y-2 border-b-2 border-dashed border-[#2B2350]/20 pb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
              STATUS 404 // UNMAPPED QUESTION
            </span>
            <h1 className="font-heading text-4xl font-extrabold text-[#2B2350] mt-2">
              404 — Not <span className="relative inline-block px-1">Found<RedCircle className="scale-110" /></span>
            </h1>
            <p className="text-xs text-[#6B6590] font-body leading-relaxed max-w-xs mx-auto">
              This sheet or assessment station does not exist in the active syllabus.
            </p>
          </div>

          <div className="flex justify-center">
            <MarginNote className="-rotate-3">page missing</MarginNote>
          </div>

          <Link to="/" className="inline-block w-full">
            <button className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center justify-center space-x-2 transition-all">
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO ASSESSIQ HOME</span>
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <span>ERROR DISPATCH SENTINEL</span>
      </footer>
    </div>
  );
};

export default NotFound;
