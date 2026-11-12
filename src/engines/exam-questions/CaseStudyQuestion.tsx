import React from 'react';
import { BookOpen, FileText } from 'lucide-react';

export interface CaseStudySubQuestion {
  id: string;
  topic?: string;
  stem: string;
  type: string;
  points: number;
  options?: { id: string; text: string }[];
}

export interface CaseStudyQuestionProps {
  passageTitle: string;
  passageContent: string;
  passageMediaUrl?: string;
  subQuestions: CaseStudySubQuestion[];
  value?: Record<string, unknown>; // subQuestionId -> candidateAnswer
  onChange: (value: Record<string, unknown>) => void;
  disabled?: boolean;
}

export const CaseStudyQuestion: React.FC<CaseStudyQuestionProps> = ({
  passageTitle,
  passageContent,
  passageMediaUrl,
  subQuestions,
  value = {},
  onChange,
  disabled = false,
}) => {
  const handleSubAnswer = (subQId: string, answer: unknown) => {
    if (disabled) return;
    onChange({
      ...value,
      [subQId]: answer,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Shared Passage Narrative (5 Cols) */}
      <div className="lg:col-span-5 space-y-4 sticky top-4">
        <div className="p-6 rounded-2xl border border-indigo-100 bg-indigo-50/40 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#6C4DFF] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Case Study Passage</span>
          </div>

          <h3 className="text-base font-extrabold text-[#0F172A] leading-snug">
            {passageTitle}
          </h3>

          {passageMediaUrl && (
            <div className="rounded-xl overflow-hidden border border-indigo-200 bg-white">
              <img
                src={passageMediaUrl}
                alt={passageTitle}
                className="w-full h-auto object-cover max-h-56"
              />
            </div>
          )}

          <div className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line max-h-[460px] overflow-y-auto pr-2 scrollbar-thin">
            {passageContent}
          </div>
        </div>
      </div>

      {/* Right Column: Linked Sub-Questions (7 Cols) */}
      <div className="lg:col-span-7 space-y-5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-2 border-b border-slate-100">
          <span>Answer the {subQuestions.length} sub-questions based on the passage.</span>
          <span className="font-bold text-[#6C4DFF] flex items-center">
            <FileText className="w-3.5 h-3.5 mr-1" /> {subQuestions.length} Linked Questions
          </span>
        </div>

        {subQuestions.map((subQ, idx) => {
          const currentAnswer = value[subQ.id];

          return (
            <div
              key={subQ.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-mono font-bold text-[#2B2350] bg-slate-100 px-2 py-0.5 rounded">
                  PART {idx + 1}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {subQ.points} {subQ.points === 1 ? 'mark' : 'marks'}
                </span>
              </div>

              <div className="text-sm font-bold text-[#0F172A]">
                {subQ.stem}
              </div>

              {/* Sub-Question Options */}
              {subQ.options && subQ.options.length > 0 ? (
                <div role="radiogroup" className="space-y-2">
                  {subQ.options.map((opt, optIdx) => {
                    const isSelected = currentAnswer === opt.id;
                    const optLetter = String.fromCharCode(65 + optIdx);

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={disabled}
                        onClick={() => handleSubAnswer(subQ.id, opt.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6C4DFF] ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-2xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span className="pr-3">{opt.text}</span>
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[10px] shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'border-slate-300 text-slate-500'
                          }`}
                        >
                          {optLetter}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <textarea
                    rows={2}
                    value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                    onChange={(e) => handleSubAnswer(subQ.id, e.target.value)}
                    disabled={disabled}
                    placeholder="Type your answer for this part..."
                    className="w-full p-3 text-xs font-medium text-[#0F172A] bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C4DFF]"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

