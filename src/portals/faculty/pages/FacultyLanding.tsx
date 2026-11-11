import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, BookOpen, FileCode, ArrowRight, Zap, Layers } from 'lucide-react';
import {
  RedCheck,
  RedCircle,
  CropMarks,
  MarginNote,
  OmrBubble,
} from '@/components/marks';

export const FacultyLanding: React.FC = () => {
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
        <div className="flex items-center space-x-4">
          <Link
            to="/auth"
            className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
          >
            ← ALL PORTALS
          </Link>
          <Link to="/faculty/login">
            <button className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-4 py-2 rounded-xl shadow-[2px_2px_0px_#2B2350] transition-transform hover:-translate-y-0.5 cursor-pointer">
              FACULTY SIGN IN
            </button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto my-auto py-10 space-y-8">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-[#B8F0D2]/35 border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6 text-center">
          <CropMarks />

          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#2B2350] text-xs font-mono font-bold uppercase text-[#2B2350]">
              <Brain className="w-3.5 h-3.5 text-[#6C4DFF]" />
              <span>STATION C // FACULTY AUTHORING OS</span>
            </div>
            <MarginNote className="-rotate-3">IRT calibrated</MarginNote>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex justify-center mb-2">
              <OmrBubble letter="C" selected size="md" />
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2350] tracking-tight leading-tight">
              Academic Faculty <span className="relative inline-block px-1">Assessment Studio<RedCircle className="scale-110" /></span>
            </h1>
            <p className="text-sm sm:text-base text-[#6B6590] font-body max-w-2xl mx-auto leading-relaxed">
              Create domain-weighted examination blueprints, generate Bloom's taxonomy items using AI, calibrate IRT psychometrics, and grade student responses with customized rubrics.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left font-mono text-xs pt-4 border-t-2 border-dashed border-[#2B2350]/20 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] space-y-1">
              <span className="font-bold flex items-center text-[#2B2350]">
                <Brain className="w-4 h-4 mr-1.5 text-[#6C4DFF]" />
                AI Item Generator
              </span>
              <p className="text-[11px] font-body text-[#6B6590]">Turn lecture notes and syllabus outlines into Bloom's verified question banks in seconds.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] space-y-1">
              <span className="font-bold flex items-center text-[#2B2350]">
                <FileCode className="w-4 h-4 mr-1.5 text-[#10B981]" />
                Blueprint Matrix
              </span>
              <p className="text-[11px] font-body text-[#6B6590]">Assemble randomized test variants that maintain strict statistical equivalence.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] space-y-1">
              <span className="font-bold flex items-center text-[#2B2350]">
                <Layers className="w-4 h-4 mr-1.5 text-[#D97706]" />
                Rubric Essay Grading
              </span>
              <p className="text-[11px] font-body text-[#6B6590]">Evaluate free-form essays with assisted semantic rubrics and bias prevention blind mode.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/faculty/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-8 py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] flex items-center justify-center space-x-2 transition-transform hover:-translate-y-0.5 cursor-pointer">
                <span>ENTER FACULTY STUDIO</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/faculty/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white border-2 border-[#2B2350] text-[#2B2350] hover:bg-[#FFF3A3] font-mono font-bold text-xs px-8 py-3.5 rounded-2xl shadow-[2px_2px_0px_#2B2350] flex items-center justify-center space-x-2 transition-transform hover:-translate-y-0.5 cursor-pointer">
                <Zap className="w-3.5 h-3.5 text-[#6C4DFF]" />
                <span>SIGN IN WITH DEMO KEY</span>
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. Academic Authoring Framework.</span>
        <span>ROLE CLEARANCE: FACULTY / INSTRUCTOR</span>
      </footer>
    </div>
  );
};

export default FacultyLanding;
