import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export interface MatchingPremise {
  id: string;
  text: string;
}

export interface MatchingResponse {
  id: string;
  text: string;
}

export interface MatchingQuestionProps {
  premises: MatchingPremise[];
  responses: MatchingResponse[];
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
}

export const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  premises,
  responses,
  value = {},
  onChange,
  disabled = false,
}) => {
  const handleSelect = (premiseId: string, responseId: string) => {
    if (disabled) return;
    const next = { ...value };
    if (!responseId) {
      delete next[premiseId];
    } else {
      next[premiseId] = responseId;
    }
    onChange(next);
  };

  const matchedCount = Object.keys(value).filter((k) => !!value[k]).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-2 border-b border-slate-100">
        <span>Match each premise on the left to its corresponding response.</span>
        <span className="font-bold text-[#6C4DFF]">
          {matchedCount} of {premises.length} matched
        </span>
      </div>

      <div className="space-y-3">
        {premises.map((premise, idx) => {
          const selectedResponseId = value[premise.id] || '';
          const isMatched = !!selectedResponseId;

          return (
            <div
              key={premise.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isMatched
                  ? 'border-indigo-200 bg-indigo-50/40'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Premise label & text */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-sm font-semibold text-[#0F172A] break-words">
                  {premise.text}
                </span>
              </div>

              {/* Connecting arrow */}
              <div className="hidden sm:flex items-center text-slate-400 shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>

              {/* Response selector dropdown */}
              <div className="sm:w-64 shrink-0">
                <select
                  value={selectedResponseId}
                  onChange={(e) => handleSelect(premise.id, e.target.value)}
                  disabled={disabled}
                  aria-label={`Match for ${premise.text}`}
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C4DFF] focus:border-[#6C4DFF] cursor-pointer disabled:opacity-50"
                >
                  <option value="">-- Select matching response --</option>
                  {responses.map((resp) => (
                    <option key={resp.id} value={resp.id}>
                      {resp.text}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status indicator */}
              <div className="hidden sm:block shrink-0">
                {isMatched ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

