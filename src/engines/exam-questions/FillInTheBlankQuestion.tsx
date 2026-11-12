import React from 'react';

export interface FillInTheBlankQuestionProps {
  template: string; // e.g. "Raft consensus elects a {blank_1} to replicate the {blank_2}."
  blankIds: string[]; // ['blank_1', 'blank_2']
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
}

export const FillInTheBlankQuestion: React.FC<FillInTheBlankQuestionProps> = ({
  template,
  blankIds,
  value = {},
  onChange,
  disabled = false,
}) => {
  const handleChange = (blankId: string, text: string) => {
    if (disabled) return;
    onChange({
      ...value,
      [blankId]: text,
    });
  };

  // Split template by {blank_xxx} tokens
  const parts = React.useMemo(() => {
    const tokens: Array<{ type: 'text' | 'blank'; content: string; blankId?: string }> = [];
    const regex = /\{([a-zA-Z0-9_-]+)\}/g;
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(template)) !== null) {
      if (match.index > lastIdx) {
        tokens.push({
          type: 'text',
          content: template.substring(lastIdx, match.index),
        });
      }

      tokens.push({
        type: 'blank',
        content: match[0],
        blankId: match[1],
      });

      lastIdx = regex.lastIndex;
    }

    if (lastIdx < template.length) {
      tokens.push({
        type: 'text',
        content: template.substring(lastIdx),
      });
    }

    return tokens;
  }, [template]);

  const filledCount = blankIds.filter((id) => (value[id] || '').trim().length > 0).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-2 border-b border-slate-100">
        <span>Type the missing term into each blank field below.</span>
        <span className="font-bold text-[#6C4DFF]">
          {filledCount} of {blankIds.length} filled
        </span>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 leading-loose text-base text-[#0F172A] font-medium">
        {parts.map((part, idx) => {
          if (part.type === 'text') {
            return <span key={idx}>{part.content}</span>;
          }

          const bId = part.blankId || `blank_${idx}`;
          const currentVal = value[bId] || '';

          return (
            <span key={idx} className="inline-block mx-1.5 align-baseline">
              <input
                type="text"
                value={currentVal}
                onChange={(e) => handleChange(bId, e.target.value)}
                disabled={disabled}
                placeholder={`[ Blank ${idx + 1} ]`}
                aria-label={`Blank ${bId}`}
                className="px-3 py-1 text-sm font-semibold text-[#2B2350] bg-white border-2 border-indigo-200 focus:border-[#6C4DFF] focus:outline-none rounded-lg shadow-xs min-w-[140px] text-center disabled:opacity-50"
              />
            </span>
          );
        })}
      </div>
    </div>
  );
};

