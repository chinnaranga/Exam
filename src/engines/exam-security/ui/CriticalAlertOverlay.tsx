import React from 'react';
import { AlertOctagon, Clock, ShieldAlert, ArrowRight, Info, CheckCircle } from 'lucide-react';
import { CropMarks, OmrBubble, StickerBadge, RedCircle } from '@/components/marks';
import { getViolationExplainer, ViolationExplainer } from '@/server/integrity/violationSeverityConfig';

export interface CriticalAlertOverlayProps {
  currentPoints?: number;
  maxPoints?: number;
  countdownSeconds?: number;
  violationName?: string;
  explainer?: ViolationExplainer;
  alert?: {
    currentPoints: number;
    maxPoints?: number;
    countdownSeconds: number;
    violationName?: string;
    explainer?: ViolationExplainer;
  };
  onAcknowledge: () => void;
}

export const CriticalAlertOverlay: React.FC<CriticalAlertOverlayProps> = ({
  currentPoints,
  maxPoints = 8,
  countdownSeconds,
  violationName = 'Integrity Threshold Exceeded',
  explainer,
  alert,
  onAcknowledge,
}) => {
  const resolvedPoints = currentPoints ?? alert?.currentPoints ?? 4;
  const resolvedMaxPoints = maxPoints ?? alert?.maxPoints ?? 8;
  const resolvedCountdown = countdownSeconds ?? alert?.countdownSeconds ?? 30;
  const resolvedViolationName = violationName || alert?.violationName || 'Integrity Threshold Exceeded';
  const resolvedExplainer: ViolationExplainer =
    explainer || alert?.explainer || getViolationExplainer(resolvedViolationName);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="critical-alert-title"
      className="fixed inset-0 z-50 bg-[#2B2350]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] text-[#2B2350] font-body text-center space-y-5 animate-in zoom-in-95 duration-200 my-auto">
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
        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFB5A7]/40 border-2 border-[#2B2350] flex items-center justify-center shadow-xs">
            <AlertOctagon className="w-6 h-6 text-[#FF4D5E]" />
          </div>

          <h2 id="critical-alert-title" className="font-heading text-xl sm:text-2xl font-extrabold text-[#2B2350] tracking-tight">
            Critical Integrity Warning
          </h2>

          <div className="inline-block">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B6590]">
              Accumulated Points:{' '}
            </span>
            <span className="relative inline-block font-mono font-extrabold text-sm text-[#FF4D5E] px-1.5">
              {resolvedPoints} / {resolvedMaxPoints} PTS
              <RedCircle className="scale-110" />
            </span>
          </div>

          <p className="text-xs text-[#6B6590] font-body leading-relaxed max-w-sm mx-auto">
            {resolvedViolationName}. Your session has accumulated <strong>{resolvedPoints} points</strong>. Reaching <strong>{resolvedMaxPoints} points</strong> will result in immediate examination termination and auto-submission.
          </p>
        </div>

        {/* 3-Part Explainer Box */}
        <div className="text-left bg-[#FAFAF7] rounded-2xl p-3.5 border-2 border-[#2B2350]/20 space-y-2 text-xs">
          <div>
            <span className="font-bold text-[#2B2350] flex items-center">
              <Info className="w-3.5 h-3.5 mr-1.5 text-[#6C4DFF]" /> What happened:
            </span>
            <p className="text-[#4A4468] pl-5">{resolvedExplainer.whatHappened}</p>
          </div>

          <div>
            <span className="font-bold text-[#2B2350] flex items-center">
              <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-[#D97706]" /> Why it matters:
            </span>
            <p className="text-[#4A4468] pl-5">{resolvedExplainer.whyItMatters}</p>
          </div>

          <div className="bg-[#B8F0D2]/50 p-2.5 rounded-xl border border-emerald-600/30">
            <span className="font-bold text-[#065F46] flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-[#059669]" /> How to fix:
            </span>
            <p className="text-[#065F46] pl-5 font-medium">{resolvedExplainer.howToFix}</p>
          </div>
        </div>

        {/* Countdown Box */}
        <div className="p-3.5 rounded-2xl bg-[#FFF3A3]/35 border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="flex items-center text-[#2B2350]">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-[#6C4DFF]" />
              Acknowledgment Window
            </span>
            <span className="text-[#FF4D5E]">{resolvedCountdown}s Remaining</span>
          </div>

          <div className="w-full bg-white h-2 rounded-full border border-[#2B2350] overflow-hidden">
            <div
              className="bg-[#6C4DFF] h-full transition-all duration-1000"
              style={{ width: `${Math.max(0, Math.min(100, (resolvedCountdown / 30) * 100))}%` }}
            />
          </div>

          <p className="text-[10px] font-mono text-[#6B6590] text-left">
            Clean, compliant behavior decays 1 point for every 5 minutes elapsed.
          </p>
        </div>

        {/* Acknowledge Button */}
        <div>
          <button
            type="button"
            onClick={onAcknowledge}
            className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3 rounded-2xl border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] flex items-center justify-center space-x-2 transition-transform hover:-translate-y-0.5 cursor-pointer"
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

