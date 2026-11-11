import React from 'react';
import { WifiOff, ShieldCheck, RefreshCw, Lock } from 'lucide-react';
import { CropMarks, MarginNote, OmrBubble } from '@/components/marks';

export interface OfflinePausedScreenProps {
  offlineDurationSeconds: number;
  maxAllowedSeconds?: number;
  recordsCount?: number;
  onRetryConnection?: () => void;
}

export const OfflinePausedScreen: React.FC<OfflinePausedScreenProps> = ({
  offlineDurationSeconds,
  maxAllowedSeconds = 180,
  recordsCount = 0,
  onRetryConnection,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#2B2350]/80 backdrop-blur-md select-none font-body"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-3 border-[#2B2350] shadow-[10px_10px_0px_#2B2350] p-6 sm:p-8 space-y-6 text-[#2B2350] animate-in fade-in zoom-in-95 duration-200">
        <CropMarks />

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-[#2B2350]/20 pb-3">
          <div className="flex items-center space-x-2">
            <OmrBubble letter="!" selected size="sm" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B6590]">
              NETWORK SENTINEL // INTEGRITY PAUSE
            </span>
          </div>
          <span className="bg-[#FF4D5E] text-white px-3 py-1 rounded-full text-xs font-mono font-bold border border-[#2B2350] shadow-[2px_2px_0px_#2B2350]">
            OFFLINE &gt; {Math.floor(maxAllowedSeconds / 60)} MINS
          </span>
        </div>

        {/* Hero Visual Card */}
        <div className="p-5 rounded-2xl bg-[#FFF3A3]/40 border-2 border-[#2B2350] text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FF4D5E] text-white border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] flex items-center justify-center mx-auto">
            <WifiOff className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="font-heading text-xl font-extrabold text-[#2B2350]">
              Examination Session Paused
            </h2>
            <p className="text-xs text-[#6B6590] leading-relaxed">
              Your workstation has been disconnected from proctoring telemetry for{' '}
              <strong className="text-[#2B2350] font-mono">{offlineDurationSeconds}s</strong> (maximum permitted limit is{' '}
              {maxAllowedSeconds}s).
            </p>
          </div>
        </div>

        {/* Cryptographic Assurance Note */}
        <div className="p-4 rounded-xl bg-[#B8F0D2]/40 border-2 border-[#2B2350] text-xs space-y-1.5">
          <div className="flex items-center space-x-2 font-bold text-[#047857]">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Data Loss Guarantee</span>
          </div>
          <p className="text-[#2B2350]/90 leading-snug">
            All <strong className="font-mono">{recordsCount} responses</strong> are cryptographically sealed in the
            local WebCrypto IndexedDB hash chain. The exam timer is paused. Testing will automatically resume as soon as
            your network connection is restored.
          </p>
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onRetryConnection || (() => window.location.reload())}
            className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 px-6 rounded-2xl border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] transition-transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RE-CHECK NETWORK CONNECTION</span>
          </button>
          <span className="text-[10px] font-mono text-center text-[#6B6590] block">
            Institution: MIT EECS Proctoring Mesh • Protocol ENF-NET-3M
          </span>
        </div>
      </div>
    </div>
  );
};

export default OfflinePausedScreen;
