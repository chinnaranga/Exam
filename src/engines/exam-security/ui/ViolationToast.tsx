import React from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { CropMarks, OmrBubble } from '@/components/marks';

export interface ViolationToastProps {
  message: string;
  pointsAdded: number;
  totalPoints: number;
  maxPoints?: number;
  onDismiss: () => void;
}

export const ViolationToast: React.FC<ViolationToastProps> = ({
  message,
  pointsAdded,
  totalPoints,
  maxPoints = 8,
  onDismiss,
}) => {
  return (
    <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative p-4 rounded-2xl bg-[#FFF3A3] border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] text-[#2B2350] font-body flex items-start space-x-3">
        <CropMarks />

        <div className="w-8 h-8 rounded-xl bg-white border border-[#2B2350] flex items-center justify-center shrink-0 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-[#D97706]" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFB5A7] text-[#2B2350] px-2 py-0.5 rounded-full border border-[#2B2350]">
                +{pointsAdded} INTEGRITY PTS
              </span>
              <span className="text-[10px] font-mono font-bold text-[#6B6590]">
                TOTAL: {totalPoints}/{maxPoints} PTS
              </span>
            </div>

            <button
              type="button"
              onClick={onDismiss}
              className="text-[#6B6590] hover:text-[#2B2350] p-1 rounded-lg hover:bg-white/50 transition-colors"
              title="Dismiss warning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs font-medium text-[#2B2350] leading-snug">
            {message}
          </p>

          <p className="text-[10px] font-mono text-[#6B6590]">
            Note: 4 pts triggers critical alert overlay. 8 pts triggers exam termination.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViolationToast;

