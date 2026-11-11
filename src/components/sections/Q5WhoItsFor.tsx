import React, { useState } from 'react';
import CropMarks from '@/components/marks/CropMarks';
import StickerBadge from '@/components/marks/StickerBadge';
import OmrBubble from '@/components/marks/OmrBubble';
import MarginNote from '@/components/marks/MarginNote';
import { ArrowRight, Check } from 'lucide-react';

export const Q5WhoItsFor: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<'A' | 'B' | 'C' | 'D'>('A');

  const audiences = {
    A: {
      letter: 'A',
      title: 'Universities & Colleges',
      sub: 'Higher Education Faculties & Deans',
      pain: 'Professors burn out during finals hand-grading 500+ long-form essay submissions.',
      solution: 'AssessIQ drafts exams from your curriculum and grades essays against your rubrics in seconds.',
      stat: 'Cuts turnaround from 14 days to under 24 hours.',
      note: 'educator favorite',
    },
    B: {
      letter: 'B',
      title: 'Certification Bodies',
      sub: 'Professional Skill & Tech Credentials',
      pain: 'Leaked item banks and unauthorized second-screen lookups undermine certificate prestige.',
      solution: 'Permuted numerical values and on-device gaze anomaly detection ensure true candidate competence.',
      stat: '100% leak-proof randomized question blueprints.',
      note: 'zero leaked items',
    },
    C: {
      letter: 'C',
      title: 'Healthcare Licensure Boards',
      sub: 'Nursing, Medical, & Clinical Boards',
      pain: 'Privacy backlash from candidates over invasive video surveillance of their homes.',
      solution: 'Zero-cloud-video proctoring evaluates signals entirely on the candidate’s local machine.',
      stat: 'Complete FERPA and HIPAA/GDPR alignment.',
      note: 'privacy first',
    },
    D: {
      letter: 'D',
      title: 'Corporate Training Teams',
      sub: 'Enterprise Compliance & Tech Upskilling',
      pain: 'Tests take too long to build, pulling busy managers away from revenue-driving projects.',
      solution: 'Turn internal PDF documentation into verified assessments with automated gradebooks.',
      stat: '80% faster assessment creation cycle.',
      note: 'saves team hours',
    },
  };

  const current = audiences[selectedLetter];

  return (
    <section
      id="q5-who-its-for"
      className="mx-3 sm:mx-6 my-4 sm:my-6 rounded-[40px] bg-[#FFB5A7] p-8 sm:p-14 lg:p-20 relative overflow-hidden border border-[#FFA190] shadow-[0_20px_50px_rgba(43,35,80,0.06)] text-left"
    >
      <CropMarks />

      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#2B2350] bg-white/70 px-3.5 py-1.5 rounded-full border border-[#2B2350]/20 shadow-xs">
          Q5 / 08 · WHO IT'S FOR
        </span>
        <StickerBadge color="lemon" rotate={4}>
          MULTIPLE CHOICE
        </StickerBadge>
      </div>

      <div className="max-w-5xl space-y-8">
        <div>
          <h2 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2350] tracking-tight">
            Who are you?
          </h2>
          <p className="font-body text-base text-[#2B2350]/80 mt-1 font-medium">
            (Select one answer to view tailored impact)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Multiple Choice Options with OMR Bubbles */}
          <div className="lg:col-span-6 space-y-3">
            {(['A', 'B', 'C', 'D'] as const).map((letter) => {
              const item = audiences[letter];
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-full p-4 rounded-2xl border-2 border-[#2B2350] flex items-center justify-between transition-all text-left ${
                    isSelected
                      ? 'bg-white shadow-[6px_6px_0px_#2B2350] translate-x-1'
                      : 'bg-white/60 hover:bg-white/90'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <OmrBubble
                      letter={letter}
                      filled={isSelected}
                      size="md"
                      onClick={() => setSelectedLetter(letter)}
                    />
                    <div>
                      <div className="font-heading text-base sm:text-lg font-bold text-[#2B2350]">
                        {item.title}
                      </div>
                      <div className="text-[11px] font-mono text-[#6B6590]">{item.sub}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="font-handwriting text-[#FF4D5E] font-bold text-lg hidden sm:inline-block pr-2">
                      selected!
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Tailored Pain & Outcome Panel */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-7 border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-5 text-left relative">
              <div className="flex items-center justify-between border-b-2 border-dashed border-[#2B2350]/15 pb-4">
                <span className="font-mono text-xs font-bold text-[#2B2350] uppercase">
                  OPTION {current.letter} DETAILS
                </span>
                <MarginNote rotate={-3} className="text-lg">
                  {current.note}
                </MarginNote>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="font-mono text-[11px] uppercase font-bold text-rose-700">
                    The Pain Point:
                  </div>
                  <p className="font-body text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed">
                    {current.pain}
                  </p>
                </div>

                <div>
                  <div className="font-mono text-[11px] uppercase font-bold text-emerald-700">
                    With AssessIQ:
                  </div>
                  <p className="font-body text-xs sm:text-sm text-[#1E293B] font-medium mt-1 leading-relaxed">
                    {current.solution}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFF3A3] border border-[#2B2350] text-xs font-mono font-bold text-[#2B2350] flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#10B981] stroke-[3]" />
                  <span>{current.stat}</span>
                </div>
              </div>

              <div className="pt-2">
                <a href="#q8-final">
                  <button className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-all flex items-center">
                    Explore {current.title} Pilot <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Q5WhoItsFor;

