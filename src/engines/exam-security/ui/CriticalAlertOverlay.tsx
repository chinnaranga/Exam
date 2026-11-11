import React from 'react';
import { AlertOctagon, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { CropMarks, MarginNote, OmrBubble, StickerBadge, RedCircle } from '@/components/marks';

export interface CriticalAlertOverlayProps {
  currentPoints: number;
  maxPoints?: number;
  countdownSeconds: number;
  violationName?: string;
  onAcknowledge: () => void;
}

export const CriticalAlertOverlay: React.FC<CriticalAlertOverlayProps> = ({
  currentPoints,
  maxPoints = 8,
  countdownSeconds,
  violationName = 'Integrity Threshold Exceeded',
  onAcknowledge,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#2B2350]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] text-[#2B2350] font-body text-center space-y-6 animate-in zoom-in-95 duration-200">
        <CropMarks />

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <OmrBubble letter="!" selected size="sm" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-[#FFB5A7] text-[#2B2350] px-2.5 py-0.5 rounded-full border border-[#2B2350]">
              STAGE 2 ESCALATION
            </span>
          </div>

          <StickerBadge color="coral" rotate={-3}>
            4+ PTS ALERT
          </StickerBadge>
        </div>

        {/* Main Alert Content */}
        <div className="space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFB5A7]/40 border-2 border-[#2B2350] flex items-center justify-center shadow-xs">
            <AlertOctagon className="w-7 h-7 text-[#FF4D5E]" />
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2B2350] tracking-tight">
            Critical Integrity Warning
          </h2>

          <div className="inline-block">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B6590]">
              Accumulated Points:{' '}
            </span>
            <span className="relative inline-block font-mono font-extrabold text-sm text-[#FF4D5E] px-1.5">
              {currentPoints} / {maxPoints} PTS
              <RedCircle className="scale-110" />
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#6B6590] font-body leading-relaxed max-w-sm mx-auto">
            {violationName}. Your session has accumulated <strong>{currentPoints} points</strong>. Reaching <strong>{maxPoints} points</strong> will result in immediate examination termination and automatic submission with a forensic evidence packet.
          </p>
        </div>

        {/* Countdown Box */}
        <div className="p-4 rounded-2xl bg-[#FFF3A3]/35 border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="flex items-center text-[#2B2350]">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-[#6C4DFF]" />
              Acknowledgment Window
            </span>
            <span className="text-[#FF4D5E]">{countdownSeconds}s Remaining</span>
          </div>

          <div className="w-full bg-white h-2 rounded-full border border-[#2B2350] overflow-hidden">
            <div
              className="bg-[#6C4DFF] h-full transition-all duration-1000"
              style={{ width: `${Math.max(0, Math.min(100, (countdownSeconds / 30) * 100))}%` }}
            />
          </div>

          <p className="text-[10px] font-mono text-[#6B6590] text-left">
            Clean, compliant behavior will decay 1 point for every 5 minutes elapsed.
          </p>
        </div>

        {/* Acknowledge Button */}
        <div>
          <button
            type="button"
            onClick={onAcknowledge}
            className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 rounded-2xl border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] flex items-center justify-center space-x-2 transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>I UNDERSTAND & RESUME EXAMINATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlertOverlay;

