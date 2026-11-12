import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export interface MathEquationQuestionProps {
  value?: string; // LaTeX equation string
  onChange: (value: string) => void;
  disabled?: boolean;
}

const QUICK_MATH_SYMBOLS = [
  { label: '√x', latex: '\\sqrt{}' },
  { label: 'x²', latex: '^{2}' },
  { label: 'xⁿ', latex: '^{}' },
  { label: 'a/b', latex: '\\frac{}{}' },
  { label: '±', latex: '\\pm ' },
  { label: '×', latex: '\\times ' },
  { label: '÷', latex: '\\div ' },
  { label: 'π', latex: '\\pi ' },
  { label: 'θ', latex: '\\theta ' },
  { label: 'Σ', latex: '\\sum ' },
  { label: '∫', latex: '\\int ' },
  { label: '≠', latex: '\\neq ' },
  { label: '≤', latex: '\\leq ' },
  { label: '≥', latex: '\\geq ' },
];

export const MathEquationQuestion: React.FC<MathEquationQuestionProps> = ({
  value = '',
  onChange,
  disabled = false,
}) => {
  const insertSymbol = (latexSymbol: string) => {
    if (disabled) return;
    onChange(value + latexSymbol);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-2 border-b border-slate-100">
        <span>Enter the mathematical formula using standard LaTeX notation.</span>
        <span className="font-bold text-[#6C4DFF]">LaTeX Equation Editor</span>
      </div>

      {/* Quick Symbol Toolbar */}
      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
        <span className="text-[11px] font-mono text-slate-500 self-center px-1 mr-1 flex items-center">
          <Sparkles className="w-3 h-3 mr-1 text-[#6C4DFF]" /> Symbols:
        </span>
        {QUICK_MATH_SYMBOLS.map((sym) => (
          <Button
            key={sym.label}
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => insertSymbol(sym.latex)}
            className="h-7 px-2 text-xs font-mono font-bold bg-white text-slate-700 hover:bg-purple-50 hover:text-[#6C4DFF] border-slate-200"
          >
            {sym.label}
          </Button>
        ))}
      </div>

      {/* LaTeX Input Text Area */}
      <div className="space-y-2">
        <label htmlFor="latex-editor" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          LaTeX Formula Input
        </label>
        <div className="relative">
          <textarea
            id="latex-editor"
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g. E = m c^2  or  f(x) = \frac{1}{\sqrt{2\pi}} e^{-\frac{x^2}{2}}"
            className="w-full p-4 font-mono text-sm font-semibold text-[#0F172A] bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C4DFF] focus:border-[#6C4DFF] disabled:opacity-50"
          />
        </div>
      </div>

      {/* Live Formula Preview Box */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 space-y-2 shadow-inner">
        <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Formula Preview</span>
        </div>
        <div className="p-3 bg-slate-950/60 rounded-lg text-center font-serif text-lg text-emerald-300 tracking-wide min-h-[44px] flex items-center justify-center">
          {value.trim().length > 0 ? (
            <span className="italic">{value}</span>
          ) : (
            <span className="text-slate-600 font-sans text-xs italic">
              (Preview will appear here as you type LaTeX)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
