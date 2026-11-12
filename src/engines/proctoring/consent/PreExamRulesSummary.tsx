import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Video,
  EyeOff,
  Monitor,
  Tool,
  Wifi,
  CheckCircle2,
  Lock,
  Smartphone,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';

export interface PreExamRulesSummaryProps {
  examTitle?: string;
  durationMinutes?: number;
  profileTier?: 'PRACTICE' | 'STANDARD' | 'HIGH_STAKES';
  onAcknowledge: () => void;
  className?: string;
}

export const PreExamRulesSummary: React.FC<PreExamRulesSummaryProps> = ({
  examTitle = 'CS-402: Distributed Consensus & Raft Architecture',
  durationMinutes = 60,
  profileTier = 'HIGH_STAKES',
  onAcknowledge,
  className = '',
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    room: false,
    screen: false,
    camera: false,
    code: false,
  });
  const [expandedSection, setExpandedSection] = useState<string | null>('MONITORING');

  const isHighStakes = profileTier === 'HIGH_STAKES';
  const isPractice = profileTier === 'PRACTICE';

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allAcknowledged =
    checkedItems.room && checkedItems.screen && checkedItems.camera && checkedItems.code;

  return (
    <div
      className={`bg-white border-2 border-[#2B2350] rounded-2xl shadow-[6px_6px_0px_#2B2350] p-6 max-w-2xl mx-auto text-[#2B2350] ${className}`}
    >
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b-2 border-[#2B2350]/15 pb-4 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#6C4DFF] text-white flex items-center justify-center border border-[#2B2350]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6C4DFF]">
                PRE-EXAM CANDIDATE DISCLOSURE
              </span>
              <Badge
                className={`text-[10px] font-mono font-bold uppercase ${
                  isHighStakes
                    ? 'bg-[#FF4D5E] text-white'
                    : isPractice
                    ? 'bg-[#B8F0D2] text-[#065F46]'
                    : 'bg-[#FFF3A3] text-[#2B2350]'
                }`}
              >
                {isHighStakes
                  ? 'HIGH-STAKES CERTIFICATION'
                  : isPractice
                  ? 'PRACTICE MODE'
                  : 'STANDARD PROCTORED'}
              </Badge>
            </div>
            <h2 className="font-heading text-lg font-black tracking-tight mt-0.5">{examTitle}</h2>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-mono text-[#6B6590]">DURATION</span>
          <div className="font-heading font-extrabold text-sm flex items-center space-x-1 justify-end text-[#2B2350]">
            <Clock className="w-3.5 h-3.5 text-[#6C4DFF]" />
            <span>{durationMinutes} Mins</span>
          </div>
        </div>
      </div>

      {/* Plain Language Summary Callout */}
      <div className="bg-[#FFF3A3]/40 border border-[#2B2350] rounded-xl p-3.5 mb-5 text-xs font-body leading-relaxed">
        <strong>Plain-Language Summary: </strong>
        {isPractice ? (
          <span>
            This is an unproctored formative assessment. Feel free to explore questions, utilize hints,
            and practice without time pressure or penalty flags.
          </span>
        ) : isHighStakes ? (
          <span>
            This is a high-stakes exam requiring dual-camera monitoring (webcam + phone) and the locked-down
            desktop client. Exiting fullscreen, switching tabs, or hiding your face will log security violation
            points. 4 points triggers a security alert; 8 points terminates the exam.
          </span>
        ) : (
          <span>
            This is a standard proctored exam. Stay in fullscreen with your camera centered and face
            clearly visible. Avoid switching windows or using external materials.
          </span>
        )}
      </div>

      {/* Rules Accordion Sections */}
      <div className="space-y-3 mb-6">
        {/* Monitoring & Camera */}
        <div className="border border-[#2B2350]/30 rounded-xl overflow-hidden bg-[#FAFAF7]">
          <button
            type="button"
            onClick={() =>
              setExpandedSection(expandedSection === 'MONITORING' ? null : 'MONITORING')
            }
            className="w-full px-4 py-3 text-left font-mono font-bold text-xs flex items-center justify-between hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              {isPractice ? (
                <EyeOff className="w-4 h-4 text-slate-500" />
              ) : (
                <Video className="w-4 h-4 text-[#6C4DFF]" />
              )}
              <span>CAMERA & BIOMETRIC MONITORING</span>
            </div>
            {expandedSection === 'MONITORING' ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {expandedSection === 'MONITORING' && (
            <div className="px-4 pb-3.5 pt-1 text-xs text-[#2B2350] space-y-1.5 font-body border-t border-[#2B2350]/10">
              {isPractice ? (
                <p className="text-[#6B6590]">No webcam or biometric tracking is active.</p>
              ) : (
                <>
                  <p>• <strong>Primary Webcam:</strong> Monitors eye gaze, head orientation, and room lighting.</p>
                  {isHighStakes && (
                    <p>• <strong>Mobile Second Camera:</strong> You will scan a QR code with your smartphone to provide a secondary side-view of your desk and hands.</p>
                  )}
                  {isHighStakes && (
                    <p>• <strong>Identity Check:</strong> Verify your government or student ID photo before entry. Random 10-second liveness checks will occur during the test.</p>
                  )}
                  <p className="text-[11px] text-[#6B6590]">Privacy Guarantee: Only encrypted verification scores and cryptographic ledger hashes are saved; raw video streams are never stored permanently.</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Workspace & Lockdown */}
        <div className="border border-[#2B2350]/30 rounded-xl overflow-hidden bg-[#FAFAF7]">
          <button
            type="button"
            onClick={() =>
              setExpandedSection(expandedSection === 'LOCKDOWN' ? null : 'LOCKDOWN')
            }
            className="w-full px-4 py-3 text-left font-mono font-bold text-xs flex items-center justify-between hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-[#6C4DFF]" />
              <span>SCREEN & WORKSTATION RULES</span>
            </div>
            {expandedSection === 'LOCKDOWN' ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {expandedSection === 'LOCKDOWN' && (
            <div className="px-4 pb-3.5 pt-1 text-xs text-[#2B2350] space-y-1.5 font-body border-t border-[#2B2350]/10">
              <p>• <strong>Mandatory Fullscreen:</strong> Do not exit fullscreen or switch windows. Exiting for &gt;10s incurs 3 violation points.</p>
              <p>• <strong>No Multiple Monitors:</strong> Disconnect any external displays. Multiple screens are blocked.</p>
              <p>• <strong>Keyboard Shortcuts:</strong> PrintScreen, copy/paste, DevTools (F12), and Cmd/Win key shortcuts are disabled.</p>
              {isHighStakes && (
                <p>• <strong>Forward-Only Navigation:</strong> Sections lock upon completion. You cannot go back to previous sections.</p>
              )}
            </div>
          )}
        </div>

        {/* Network & Offline Limits */}
        <div className="border border-[#2B2350]/30 rounded-xl overflow-hidden bg-[#FAFAF7]">
          <button
            type="button"
            onClick={() =>
              setExpandedSection(expandedSection === 'NETWORK' ? null : 'NETWORK')
            }
            className="w-full px-4 py-3 text-left font-mono font-bold text-xs flex items-center justify-between hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-[#6C4DFF]" />
              <span>OFFLINE AUTOSAVE & TIMER POLICY</span>
            </div>
            {expandedSection === 'NETWORK' ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {expandedSection === 'NETWORK' && (
            <div className="px-4 pb-3.5 pt-1 text-xs text-[#2B2350] space-y-1.5 font-body border-t border-[#2B2350]/10">
              <p>• <strong>Server-Authoritative Clock:</strong> The timer runs on the central server and re-syncs every 30 seconds.</p>
              <p>• <strong>Offline Resilience:</strong> Answers autosave locally with SHA-256 hash chains. You may stay offline for up to {isHighStakes ? '3 minutes' : '5 minutes'} before the exam safely pauses.</p>
              <p>• <strong>Automatic Submission:</strong> When time expires, answers are auto-submitted with a 10-second grace window.</p>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Verification Checklist */}
      <div className="bg-[#FAFAF7] border-2 border-[#2B2350] rounded-xl p-4 mb-5">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#2B2350] mb-3 flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>Candidate Readiness Acknowledgement</span>
        </h3>

        <div className="space-y-2.5 text-xs font-body">
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems.room}
              onChange={() => toggleCheck('room')}
              className="mt-0.5 rounded border-[#2B2350] text-[#6C4DFF] focus:ring-[#6C4DFF]"
            />
            <span>My testing room is private, quiet, and well-lit with no unauthorized individuals present.</span>
          </label>

          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems.screen}
              onChange={() => toggleCheck('screen')}
              className="mt-0.5 rounded border-[#2B2350] text-[#6C4DFF] focus:ring-[#6C4DFF]"
            />
            <span>I understand that leaving fullscreen mode, switching tabs, or opening developer tools will log violation points.</span>
          </label>

          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems.camera}
              onChange={() => toggleCheck('camera')}
              className="mt-0.5 rounded border-[#2B2350] text-[#6C4DFF] focus:ring-[#6C4DFF]"
            />
            <span>My camera and microphone are operational and unobstructed throughout the examination session.</span>
          </label>

          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems.code}
              onChange={() => toggleCheck('code')}
              className="mt-0.5 rounded border-[#2B2350] text-[#6C4DFF] focus:ring-[#6C4DFF]"
            />
            <span>I pledge to uphold academic integrity and adhere to the institutional honor code.</span>
          </label>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[11px] font-mono text-[#6B6590]">
          {allAcknowledged
            ? '✓ All rules acknowledged and verified'
            : 'Please check all 4 boxes to unlock exam runner'}
        </span>

        <button
          type="button"
          disabled={!allAcknowledged}
          onClick={onAcknowledge}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-mono font-bold text-xs border-2 border-[#2B2350] transition-all flex items-center justify-center space-x-2 ${
            allAcknowledged
              ? 'bg-[#10B981] hover:bg-[#059669] text-white shadow-[3px_3px_0px_#2B2350] cursor-pointer hover:-translate-y-0.5'
              : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>I ACCEPT & PROCEED TO EXAM</span>
        </button>
      </div>
    </div>
  );
};
