import React from 'react';
import { Hash } from 'lucide-react';

export interface NumericQuestionProps {
  requiredUnit?: string;
  value?: number | string | { value?: number | string; unit?: string };
  onChange: (value: { value: number | string; unit?: string } | number | string) => void;
  disabled?: boolean;
}

export const NumericQuestion: React.FC<NumericQuestionProps> = ({
  requiredUnit,
  value,
  onChange,
  disabled = false,
}) => {
  let numVal = '';
  let unitVal = requiredUnit || '';

  if (typeof value === 'number' || typeof value === 'string') {
    numVal = String(value);
  } else if (value && typeof value === 'object') {
    numVal = value.value !== undefined ? String(value.value) : '';
    unitVal = value.unit || requiredUnit || '';
  }

  const handleValChange = (valStr: string) => {
    if (disabled) return;
    onChange({
      value: valStr,
      unit: unitVal,
    });
  };

  const handleUnitChange = (uStr: string) => {
    if (disabled) return;
    onChange({
      value: numVal,
      unit: uStr,
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-slate-500 font-mono pb-2 border-b border-slate-100 flex items-center justify-between">
        <span>Enter the exact calculated numeric result.</span>
        {requiredUnit && (
          <span className="font-semibold text-slate-700">
            Expected unit: <code className="text-[#6C4DFF] bg-purple-50 px-1.5 py-0.5 rounded">{requiredUnit}</code>
          </span>
        )}
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
        <label htmlFor="numeric-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Numerical Answer Value
        </label>

        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Hash className="w-4 h-4" />
            </div>
            <input
              id="numeric-input"
              type="number"
              step="any"
              value={numVal}
              onChange={(e) => handleValChange(e.target.value)}
              disabled={disabled}
              placeholder="e.g. 120.5"
              className="w-full pl-9 pr-4 py-2.5 text-base font-mono font-bold text-[#0F172A] bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C4DFF] focus:border-[#6C4DFF] disabled:opacity-50"
            />
          </div>

          {/* Unit selector or fixed badge */}
          {requiredUnit ? (
            <div className="px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-700 select-none">
              {requiredUnit}
            </div>
          ) : (
            <div className="w-28">
              <input
                type="text"
                value={unitVal}
                onChange={(e) => handleUnitChange(e.target.value)}
                disabled={disabled}
                placeholder="Unit (optional)"
                className="w-full px-3 py-2.5 text-xs font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6C4DFF]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

