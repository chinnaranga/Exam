import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, ChevronDown, ChevronUp, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { CropMarks } from '@/components/marks';
import { getViolationExplainer, ViolationExplainer } from '@/server/integrity/violationSeverityConfig';

export interface ViolationToastProps {
  message?: string;
  pointsAdded?: number;
  totalPoints?: number;
  maxPoints?: number;
  ruleId?: string;
  explainer?: ViolationExplainer;
  warning?: {
    message: string;
    violation?: {
      ruleId?: string;
      name?: string;
      pointsAdded?: number;
      totalPointsAfter?: number;
      type?: string;
    };
    pointsAdded?: number;
    totalPoints?: number;
    explainer?: ViolationExplainer;
  };
  onDismiss: () => void;
}

export const ViolationToast: React.FC<ViolationToastProps> = ({
  message,
  pointsAdded,
  totalPoints,
  maxPoints = 8,
  ruleId,
  explainer,
  warning,
  onDismiss,
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(true);

  // Resolve unified fields across prop signatures
  const resolvedMessage = message || warning?.message || 'Security Sentinel Alert';
  const resolvedPointsAdded = pointsAdded ?? warning?.violation?.pointsAdded ?? warning?.pointsAdded ?? 1;
  const resolvedTotalPoints = totalPoints ?? warning?.violation?.totalPointsAfter ?? warning?.totalPoints ?? resolvedPointsAdded;
  const resolvedRuleId = ruleId || warning?.violation?.ruleId || warning?.violation?.type || resolvedMessage;

  const resolvedExplainer: ViolationExplainer =
    explainer || warning?.explainer || getViolationExplainer(resolvedRuleId);

  return (
    <aside
      aria-label="Security violation warning"
      role="alert"
      className="fixed top-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="relative p-4 rounded-2xl bg-[#FFF3A3] border-2 border-[#2B2350] shadow-[5px_5px_0px_#2B2350] text-[#2B2350] font-body flex items-start space-x-3">
        <CropMarks />

        <div className="w-8 h-8 rounded-xl bg-white border border-[#2B2350] flex items-center justify-center shrink-0 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-[#D97706]" />
        </div>

        <div className="flex-1 space-y-2">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFB5A7] text-[#2B2350] px-2 py-0.5 rounded-full border border-[#2B2350]">
                +{resolvedPointsAdded} PTS
              </span>
              <span className="text-[10px] font-mono font-bold text-[#6B6590]">
                TOTAL: {resolvedTotalPoints}/{maxPoints} PTS
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-[#6B6590] hover:text-[#2B2350] p-1 rounded-lg hover:bg-white/50 transition-colors text-[10px] font-mono font-bold flex items-center"
                title="Toggle explainer details"
              >
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="text-[#6B6590] hover:text-[#2B2350] p-1 rounded-lg hover:bg-white/50 transition-colors"
                title="Dismiss warning"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Primary Rule Message */}
          <p className="text-xs font-bold text-[#2B2350] leading-snug">
            {resolvedMessage}
          </p>

          {/* 3-Part Explainer (What Happened, Why It Matters, How to Fix) */}
          {showDetails && (
            <div className="bg-white/80 rounded-xl p-3 border border-[#2B2350]/20 space-y-2 text-[11px] leading-relaxed">
              <div>
                <span className="font-bold text-[#2B2350] flex items-center">
                  <Info className="w-3 h-3 mr-1 text-[#6C4DFF]" /> What happened:
                </span>
                <p className="text-[#4A4468] pl-4">{resolvedExplainer.whatHappened}</p>
              </div>

              <div>
                <span className="font-bold text-[#2B2350] flex items-center">
                  <ShieldAlert className="w-3 h-3 mr-1 text-[#D97706]" /> Why it matters:
                </span>
                <p className="text-[#4A4468] pl-4">{resolvedExplainer.whyItMatters}</p>
              </div>

              <div className="bg-[#B8F0D2]/40 p-2 rounded-lg border border-emerald-600/30">
                <span className="font-bold text-[#065F46] flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1 text-[#059669]" /> How to fix:
                </span>
                <p className="text-[#065F46] pl-4 font-medium">{resolvedExplainer.howToFix}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] font-mono text-[#6B6590] pt-0.5">
            <span>Clean behavior decays 1 pt every 5 min.</span>
            <span>Overlay at 4 pts • Terminate at 8 pts</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ViolationToast;

