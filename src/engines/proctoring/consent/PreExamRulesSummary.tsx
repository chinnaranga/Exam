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
    camera: false,
    microphone: false,
    biometrics: false,
    keystrokeData: false,
    roomScan: false,
    phoneCamera: false,
    code: false,
  });
  const [expandedSection, setExpandedSection] = useState<string | null>('MONITORING');
  const [showAlternativeModal, setShowAlternativeModal] = useState(false);

  const isHighStakes = profileTier === 'HIGH_STAKES';
  const isPractice = profileTier === 'PRACTICE';

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Mandatory categories: camera, microphone, biometrics, keystrokeData, and honor code
  const mandatoryAcknowledged =
    checkedItems.camera &&
    checkedItems.microphone &&
    checkedItems.biometrics &&
    checkedItems.keystrokeData &&
    checkedItems.code;

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
                VERSIONED CONSENT (v2.2-compliance-2026)
              </span>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-300 text-emerald-700 bg-emerald-50">
                GDPR & FERPA VERIFIED
              </Badge>
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

      {/* Wellbeing & Candidate Reassurance Banner */}
      <div className="bg-[#B8F0D2]/50 border-2 border-[#2B2350] rounded-xl p-3.5 mb-4 text-xs font-body leading-relaxed flex items-center space-x-3 shadow-[2px_2px_0px_#2B2350]">
        <div className="w-8 h-8 rounded-lg bg-[#10B981] text-white flex items-center justify-center shrink-0 border border-[#2B2350]">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <strong className="text-[#065F46] block font-heading">Take a breath. You are prepared.</strong>
          <span className="text-[#065F46]/90 text-[11px]">
            Ensure your workspace is comfortable, your water is nearby, and proceed when you are ready. Our integrity checks are designed to protect your hard work and maintain a fair playing field for everyone.
          </span>
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
          <span>Statutory Consent & Readiness Acknowledgement</span>
        </h3>

        <div className="space-y-2.5 text-xs font-body">
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems.camera}
              onChange={() => toggleCheck('camera')}
              className="mt-0.5 rounded border-[#2B2350] text-[#6C4DFF] focus:ring-[#6C4DFF]"
            />
            <span>
              <strong>Webcam Stream (Local Wasm):</strong> I consent to on-device facial presence and head pose analysis.
            </span>
          </label>

          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems.microphone}
              onChange={() => toggleCheck('microphone')}
              className="mt-0.5 rounded border-[#2B2350] text-[#6C4DFF] focus:ring-[#6C4DFF]"
            />
            <span>
              <strong>Microphone Audio:</strong> I consent to local ambient audio decibel analysis for speech detection.
            </span>
          </label>

          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems.biometrics}
              onChange={() => toggleCheck('biometrics')}
              className="mt-0.5 rounded border-[#2B2350] text-[#6C4DFF] focus:ring-[#6C4DFF]"
            />
            <span>
              <strong>Biometric Geometry & Liveness:</strong> I consent to automated facial feature matching and random liveness prompts.
            </span>
          </label>

          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems.keystrokeData}
              onChange={() => toggleCheck('keystrokeData')}
              className="mt-0.5 rounded border-[#2B2350] text-[#6C4DFF] focus:ring-[#6C4DFF]"
            />
            <span>
              <strong>Keystroke Dynamics:</strong> I consent to typing rhythm and cadence monitoring during written answers.
            </span>
          </label>

          {isHighStakes && (
            <>
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedItems.roomScan}
                  onChange={() => toggleCheck('roomScan')}
                  className="mt-0.5 rounded border-[#2B2350] text-[#6C4DFF] focus:ring-[#6C4DFF]"
                />
                <span>
                  <strong>360° Room Environment Scan:</strong> I agree to show my immediate testing desk and surrounding room.
                </span>
              </label>

              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedItems.phoneCamera}
                  onChange={() => toggleCheck('phoneCamera')}
                  className="mt-0.5 rounded border-[#2B2350] text-[#6C4DFF] focus:ring-[#6C4DFF]"
                />
                <span>
                  <strong>Secondary Phone Camera:</strong> I agree to position my mobile phone camera for dual-angle monitoring.
                </span>
              </label>
            </>
          )}

          <label className="flex items-start space-x-2.5 cursor-pointer pt-1 border-t border-slate-200">
            <input
              type="checkbox"
              checked={checkedItems.code}
              onChange={() => toggleCheck('code')}
              className="mt-0.5 rounded border-[#2B2350] text-[#6C4DFF] focus:ring-[#6C4DFF]"
            />
            <span>
              <strong>Institutional Honor Code:</strong> I pledge that all submitted answers will be my own unaided work.
            </span>
          </label>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowAlternativeModal(true)}
          className="text-xs font-mono font-bold text-red-600 hover:text-red-700 underline cursor-pointer"
        >
          Decline Consent & View Alternative Testing Accommodation
        </button>

        <button
          type="button"
          disabled={!mandatoryAcknowledged}
          onClick={onAcknowledge}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-mono font-bold text-xs border-2 border-[#2B2350] transition-all flex items-center justify-center space-x-2 ${
            mandatoryAcknowledged
              ? 'bg-[#10B981] hover:bg-[#059669] text-white shadow-[3px_3px_0px_#2B2350] cursor-pointer hover:-translate-y-0.5'
              : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>I ACCEPT & PROCEED TO EXAM</span>
        </button>
      </div>

      {/* Institutional Alternative Process Modal (If Consent is Declined) */}
      {showAlternativeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border-2 border-[#2B2350] rounded-2xl shadow-[6px_6px_0px_#2B2350] p-6 max-w-lg w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold text-base text-[#2B2350]">Consent Declined: Exam Locked</h3>
                <p className="text-xs text-slate-500 font-mono">Institutional Non-Automated Alternative Process</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Under GDPR Article 22 and University Examination Regulations, candidates are not penalized for withholding proctoring consent. You are eligible to take this examination via the institution&apos;s approved alternative method.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 font-mono text-[#0F172A]">
              <div><strong>Format:</strong> In-Person Proctored Examination</div>
              <div><strong>Facility Location:</strong> Academic Services Building, Testing Center Hall B (Room 204)</div>
              <div><strong>Coordinator Email:</strong> testing-accommodations@institution.edu</div>
              <div><strong>Helpline:</strong> +1 (555) 019-2834</div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAlternativeModal(false)}
                className="px-4 py-2 border-2 border-[#2B2350] rounded-xl text-xs font-mono font-bold bg-white text-[#2B2350] hover:bg-slate-100"
              >
                Return to Consent Agreement
              </button>
              <a
                href="mailto:testing-accommodations@institution.edu?subject=Alternative%20Testing%20Accommodation%20Request"
                className="px-4 py-2 border-2 border-[#2B2350] rounded-xl text-xs font-mono font-bold bg-[#6C4DFF] text-white hover:bg-[#5839ee] flex items-center space-x-1"
              >
                <span>Email Coordinator</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

