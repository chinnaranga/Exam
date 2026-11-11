import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldAlert, FileText, CheckCircle2, ArrowRight, Download, Sparkles } from 'lucide-react';
import { CropMarks, MarginNote, OmrBubble, StickerBadge, RedCircle } from '@/components/marks';
import { EvidencePacket } from '../hooks/useServerViolationSentinel';
import { toast } from 'sonner';

export interface LockdownTerminatedScreenProps {
  reason: string;
  evidencePacket?: EvidencePacket | null;
  onExit?: () => void;
}

export const LockdownTerminatedScreen: React.FC<LockdownTerminatedScreenProps> = ({
  reason,
  evidencePacket,
  onExit,
}) => {
  const handleCopyEvidence = () => {
    if (!evidencePacket) {
      toast.info('No evidence packet attached.');
      return;
    }
    navigator.clipboard.writeText(JSON.stringify(evidencePacket, null, 2));
    toast.success('Evidence Receipt Copied', {
      description: 'SHA-256 cryptographic packet JSON copied to clipboard.',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-body text-[#2B2350] selection:bg-[#FFF3A3] selection:text-[#2B2350] antialiased flex flex-col justify-between p-4 sm:p-8">
      {/* Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b-2 border-dashed border-[#2B2350]/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF4D5E] text-white flex items-center justify-center shadow-xs">
            <Lock className="w-4 h-4 fill-white" />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight text-[#2B2350]">
            Assess<span className="text-[#FF4D5E]">IQ</span> Security Sentinel
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-[#FFB5A7] text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
            STAGE 3 // HARD LOCKDOWN
          </span>
        </div>
      </header>

      {/* Main Paper Sheet Card */}
      <main className="max-w-2xl w-full mx-auto my-6 p-8 sm:p-12 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6 text-center relative overflow-hidden">
        <CropMarks />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <OmrBubble letter="X" selected size="sm" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFB5A7] text-[#2B2350] px-2.5 py-0.5 rounded-full border border-[#2B2350]">
              TERMINATION NOTICE
            </span>
          </div>

          <StickerBadge color="coral" rotate={3}>
            HARD LOCKED
          </StickerBadge>
        </div>

        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FFB5A7]/40 border-2 border-[#2B2350] flex items-center justify-center shadow-xs">
            <ShieldAlert className="w-8 h-8 text-[#FF4D5E]" />
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#2B2350] tracking-tight">
            Examination <span className="relative inline-block px-1">Terminated<RedCircle className="scale-105" /></span>
          </h1>

          <p className="text-xs sm:text-sm text-[#6B6590] font-body max-w-md mx-auto leading-relaxed">
            {reason}. Answers recorded up to the point of termination have been securely committed and auto-submitted to your institution’s examination authority.
          </p>
        </div>

        {/* Evidence Packet Box */}
        <div className="p-5 rounded-2xl bg-[#FAFAF7] border-2 border-[#2B2350] text-left space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#2B2350]/15 pb-2">
            <span className="font-bold text-[#2B2350] flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1.5 text-[#6C4DFF]" />
              Forensic Evidence Summary
            </span>
            <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 font-bold">
              ✓ INVIGILATOR NOTIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[#6B6590] block">Points Accumulated:</span>
              <span className="font-bold text-[#FF4D5E]">
                {evidencePacket ? `${evidencePacket.finalPoints} points` : 'Threshold Exceeded'}
              </span>
            </div>
            <div>
              <span className="text-[#6B6590] block">Violations Logged:</span>
              <span className="font-bold text-[#2B2350]">
                {evidencePacket ? `${evidencePacket.totalViolationsCount} events` : 'Recorded'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-[#6B6590] block">Hash-Chain Root:</span>
              <span className="font-mono text-[10px] text-[#2B2350] break-all bg-white p-1 rounded-sm border border-[#2B2350]/20 block">
                {evidencePacket?.ledgerRootHash || 'SHA256_VERIFIED_LEDGER_ROOT'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleCopyEvidence}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border-2 border-[#2B2350] font-mono font-bold text-xs text-[#2B2350] hover:bg-[#FFF3A3] shadow-[2px_2px_0px_#2B2350] flex items-center justify-center space-x-1.5 transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#6C4DFF]" />
            <span>COPY EVIDENCE RECEIPT</span>
          </button>

          <Link to="/student/dashboard" className="w-full sm:w-auto">
            <button
              type="button"
              onClick={onExit}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs border-2 border-[#2B2350] shadow-[2px_2px_0px_#2B2350] flex items-center justify-center space-x-1.5 transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>RETURN TO DASHBOARD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>TIMESTAMP: {new Date().toISOString()}</span>
        <span>STATUS: HARD TERMINATED</span>
      </footer>
    </div>
  );
};

export default LockdownTerminatedScreen;

