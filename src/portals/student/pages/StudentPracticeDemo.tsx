import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  FileCheck,
  Home,
  Check,
} from 'lucide-react';
import BrandLogo from '@/shared/components/BrandLogo';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { toast } from 'sonner';
import { ViolationToast } from '@/engines/exam-security/ui/ViolationToast';
import { CriticalAlertOverlay } from '@/engines/exam-security/ui/CriticalAlertOverlay';
import { getViolationExplainer } from '@/server/integrity/violationSeverityConfig';

interface PracticeQuestion {
  id: number;
  section: string;
  text: string;
  options: string[];
}

const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 1,
    section: 'Practice Demo • Question 1 of 5',
    text: 'What is the primary benefit of completing this practice demo assessment prior to your real exam?',
    options: [
      'To verify your webcam, learn keyboard navigation, and see simulated warnings before they count.',
      'To receive your official certification score immediately.',
      'To disable all proctoring sentinels on real exam day.',
      'To test your high-frequency trading algorithm.',
    ],
  },
  {
    id: 2,
    section: 'Practice Demo • Question 2 of 5',
    text: 'In AssessIQ, what happens if an accidental focus loss occurs for less than 2 seconds (e.g. an OS notification)?',
    options: [
      'Your exam is immediately terminated without recourse.',
      'It is recorded as LOW severity (log-only), with zero disruptive warning to the candidate.',
      'An invigilator is dispatched to your physical location.',
      'The exam timer is accelerated by 10 minutes.',
    ],
  },
  {
    id: 3,
    section: 'Practice Demo • Question 3 of 5',
    text: 'How does point decay work in the AssessIQ integrity engine during clean behavior?',
    options: [
      'Points increase continuously over time.',
      '1 violation point decays automatically for every 5 minutes of clean, compliant behavior.',
      'Points can only be removed by submitting a paper petition.',
      'Points never decay under any circumstances.',
    ],
  },
  {
    id: 4,
    section: 'Practice Demo • Question 4 of 5',
    text: 'If your browser crashes or network momentarily drops, what should you do?',
    options: [
      'Panic and cancel your degree program.',
      'Reopen the browser and rejoin the exam; answers are cryptographically cached in local storage and the server clock remains authoritative.',
      'Delete your browser cache and start from scratch.',
      'Switch to a friend’s computer without notifying the system.',
    ],
  },
  {
    id: 5,
    section: 'Practice Demo • Question 5 of 5',
    text: 'What is the purpose of the 3-part violation explainer when a warning is triggered?',
    options: [
      'To provide cryptic error codes without context.',
      'To clearly state what happened, why it matters for fairness, and provide exact actionable steps to fix it.',
      'To distract candidates during difficult questions.',
      'To display advertisements for educational software.',
    ],
  },
];

export const StudentPracticeDemo: React.FC = () => {
  const navigate = useNavigate();

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Record<number, boolean>>({ 0: true });

  // Simulated violation states
  const [simulatedPoints, setSimulatedPoints] = useState<number>(0);
  const [simulatedWarning, setSimulatedWarning] = useState<{
    message: string;
    pointsAdded: number;
    ruleId: string;
  } | null>(null);

  const [simulatedOverlay, setSimulatedOverlay] = useState<{
    active: boolean;
    points: number;
    countdown: number;
    ruleId: string;
  } | null>(null);

  // Review & Receipt Dialogs
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [receiptToken, setReceiptToken] = useState<string | null>(null);

  // Trigger harmless simulated violation
  const triggerSimulatedViolation = (type: 'FULLSCREEN' | 'TAB_SWITCH' | 'PHONE' | 'OVERLAY') => {
    if (type === 'FULLSCREEN') {
      const added = 3;
      const nextPoints = simulatedPoints + added;
      setSimulatedPoints(nextPoints);
      setSimulatedWarning({
        message: 'SIMULATED: Exited Fullscreen Mode (>10s)',
        pointsAdded: added,
        ruleId: 'FULLSCREEN_EXIT_EXTENDED',
      });
      toast.info('Simulated Warning Fired: Fullscreen Exit (+3 pts)', {
        description: 'Notice the 3-part explainer below detailing what happened and how to fix it.',
      });
    } else if (type === 'TAB_SWITCH') {
      const added = 2;
      const nextPoints = simulatedPoints + added;
      setSimulatedPoints(nextPoints);
      setSimulatedWarning({
        message: 'SIMULATED: Browser Tab Switch Detected',
        pointsAdded: added,
        ruleId: 'TAB_SWITCH',
      });
      toast.info('Simulated Warning Fired: Tab Switch (+2 pts)');
    } else if (type === 'PHONE') {
      const added = 3;
      const nextPoints = simulatedPoints + added;
      setSimulatedPoints(nextPoints);
      setSimulatedWarning({
        message: 'SIMULATED: Mobile Phone Recognized in Camera Frame',
        pointsAdded: added,
        ruleId: 'PHONE_DETECTED',
      });
      toast.info('Simulated Warning Fired: Phone Detected (+3 pts)');
    } else if (type === 'OVERLAY') {
      const nextPoints = Math.max(4, simulatedPoints + 4);
      setSimulatedPoints(nextPoints);
      setSimulatedOverlay({
        active: true,
        points: nextPoints,
        countdown: 30,
        ruleId: 'FULLSCREEN_EXIT_EXTENDED',
      });
      toast.warning('Simulated Critical Alert Overlay (4+ Points)');
    }
  };

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
    setVisitedQuestions((prev) => ({ ...prev, [currentIdx]: true }));
  };

  const handleNext = () => {
    if (currentIdx < PRACTICE_QUESTIONS.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setVisitedQuestions((prev) => ({ ...prev, [next]: true }));
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleConfirmSubmit = () => {
    setShowReviewModal(false);
    const mockHash = '0x8f2d4e8b3a1c7209e5d614a8b7c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5';
    setReceiptToken(`DEMO-REC-${Date.now().toString(36).toUpperCase()}`);
    setShowReceiptModal(true);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = PRACTICE_QUESTIONS.length - answeredCount;

  const currentQ = PRACTICE_QUESTIONS[currentIdx];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#2B2350] font-sans flex flex-col justify-between">
      {/* Simulation Reassurance Banner */}
      <div className="bg-[#FFF3A3] border-b-2 border-[#2B2350] px-6 py-2.5 text-xs font-mono font-bold flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#6C4DFF]" />
          <span>
            PRACTICE SANDBOX MODE: All warnings and points are simulated. No violations are recorded against your academic record.
          </span>
        </div>

        <Badge className="bg-[#B8F0D2] text-[#065F46] border border-[#2B2350] text-[10px]">
          ZERO-PENALTY ENVIRONMENT
        </Badge>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#2B2350]/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BrandLogo size="md" variant="light" />
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <div className="font-bold text-sm text-[#2B2350]">AssessIQ Practice Exam Demo</div>
            <div className="text-[10px] text-[#6B6590] font-mono">5 Questions • Interactive Violation Simulator</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-50 border border-[#2B2350]/20 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-[#6C4DFF] flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Practice Clock: 45:00</span>
          </div>

          <Button
            onClick={() => setShowReviewModal(true)}
            className="bg-[#10B981] hover:bg-[#059669] text-white font-mono font-bold text-xs py-2 px-4 rounded-xl border border-[#2B2350]"
          >
            Review & Submit Demo
          </Button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-6xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto">
        {/* Left Column: Question Area */}
        <div className="lg:col-span-8 space-y-5">
          {/* Question Card */}
          <Card className="bg-white border-2 border-[#2B2350] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#2B2350] space-y-6">
            <div className="flex items-center justify-between border-b border-[#2B2350]/15 pb-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#6C4DFF]">
                {currentQ.section}
              </span>

              <button
                type="button"
                onClick={() => setFlaggedQuestions((prev) => ({ ...prev, [currentIdx]: !prev[currentIdx] }))}
                className={`flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-xl border transition-colors ${
                  flaggedQuestions[currentIdx]
                    ? 'bg-amber-100 text-amber-900 border-amber-400'
                    : 'bg-white text-[#6B6590] border-[#2B2350]/20 hover:text-[#2B2350]'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flaggedQuestions[currentIdx] ? 'Flagged' : 'Flag for Review'}</span>
              </button>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-[#2B2350] leading-snug">
              {currentQ.text}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentIdx] === optIdx;
                const optionLetter = String.fromCharCode(65 + optIdx);

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start space-x-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#6C4DFF]/10 border-[#6C4DFF] shadow-[2px_2px_0px_#6C4DFF]'
                        : 'bg-[#FAFAF7] border-[#2B2350]/20 hover:border-[#2B2350] hover:bg-white'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-[#6C4DFF] text-white border-[#6C4DFF]'
                          : 'bg-white text-[#2B2350] border-[#2B2350]/30'
                      }`}
                    >
                      {optionLetter}
                    </div>
                    <span className="text-xs sm:text-sm text-[#2B2350] font-medium leading-relaxed">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#2B2350]/15">
              <Button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                variant="outline"
                className="border-[#2B2350] text-[#2B2350] text-xs font-bold"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              <span className="text-xs font-mono text-[#6B6590]">
                Question {currentIdx + 1} of {PRACTICE_QUESTIONS.length}
              </span>

              <Button
                onClick={handleNext}
                disabled={currentIdx === PRACTICE_QUESTIONS.length - 1}
                className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white text-xs font-bold px-5"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Violation Simulator & Question Grid */}
        <div className="lg:col-span-4 space-y-5">
          {/* Harmless Violation Simulator Card */}
          <Card className="bg-[#FFF3A3]/40 border-2 border-[#2B2350] rounded-3xl p-5 shadow-[5px_5px_0px_#2B2350] space-y-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <h3 className="font-heading font-black text-sm text-[#2B2350]">
                Simulate Harmless Warning
              </h3>
            </div>

            <p className="text-xs text-[#4A4468] leading-relaxed">
              Test how AssessIQ displays warnings before your real test. Experience the 3-part explainer with zero penalty.
            </p>

            <div className="space-y-2">
              <Button
                onClick={() => triggerSimulatedViolation('FULLSCREEN')}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs font-bold bg-white border-[#2B2350] hover:bg-slate-50"
              >
                Simulate: Fullscreen Exit (+3 pts)
              </Button>

              <Button
                onClick={() => triggerSimulatedViolation('TAB_SWITCH')}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs font-bold bg-white border-[#2B2350] hover:bg-slate-50"
              >
                Simulate: Tab Switch (+2 pts)
              </Button>

              <Button
                onClick={() => triggerSimulatedViolation('PHONE')}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs font-bold bg-white border-[#2B2350] hover:bg-slate-50"
              >
                Simulate: Mobile Phone Detected (+3 pts)
              </Button>

              <Button
                onClick={() => triggerSimulatedViolation('OVERLAY')}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs font-bold bg-[#FFB5A7]/30 border-[#2B2350] hover:bg-[#FFB5A7]/50"
              >
                Simulate: Critical Overlay (4+ pts)
              </Button>
            </div>

            <div className="flex justify-between items-center text-xs font-mono pt-1 text-[#6B6590]">
              <span>Simulated Score:</span>
              <strong className="text-[#2B2350]">{simulatedPoints}/8 PTS</strong>
            </div>

            {simulatedPoints > 0 && (
              <Button
                onClick={() => {
                  setSimulatedPoints(0);
                  setSimulatedWarning(null);
                  toast.success('Simulated points cleared.');
                }}
                variant="ghost"
                size="sm"
                className="w-full text-xs text-[#6B6590] hover:text-[#2B2350]"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Simulated Score
              </Button>
            )}
          </Card>

          {/* Question Grid */}
          <Card className="bg-white border-2 border-[#2B2350] rounded-2xl p-4 shadow-[4px_4px_0px_#2B2350] space-y-3">
            <span className="font-mono text-xs font-bold text-[#6B6590] uppercase block">
              Question Navigator
            </span>

            <div className="grid grid-cols-5 gap-2">
              {PRACTICE_QUESTIONS.map((_, idx) => {
                const isCurrent = currentIdx === idx;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isFlagged = !!flaggedQuestions[idx];

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-xl font-mono text-xs font-bold border transition-colors flex items-center justify-center ${
                      isCurrent
                        ? 'bg-[#6C4DFF] text-white border-[#2B2350] ring-2 ring-[#6C4DFF]/30'
                        : isAnswered
                        ? 'bg-[#B8F0D2] text-[#065F46] border-[#2B2350]'
                        : isFlagged
                        ? 'bg-amber-100 text-amber-900 border-amber-400'
                        : 'bg-white text-[#2B2350] border-[#2B2350]/30 hover:border-[#2B2350]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </main>

      {/* Render Active Simulated Warning Toast */}
      {simulatedWarning && (
        <ViolationToast
          message={simulatedWarning.message}
          pointsAdded={simulatedWarning.pointsAdded}
          totalPoints={simulatedPoints}
          ruleId={simulatedWarning.ruleId}
          onDismiss={() => setSimulatedWarning(null)}
        />
      )}

      {/* Render Active Simulated Critical Overlay */}
      {simulatedOverlay?.active && (
        <CriticalAlertOverlay
          currentPoints={simulatedOverlay.points}
          countdownSeconds={simulatedOverlay.countdown}
          violationName="SIMULATED: Critical Integrity Escalation"
          onAcknowledge={() => setSimulatedOverlay(null)}
        />
      )}

      {/* Pre-Submit Final Review Dialog */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="sm:max-w-md bg-white text-[#2B2350] p-6 rounded-3xl border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350]">
          <DialogHeader className="border-b border-[#2B2350]/15 pb-3">
            <DialogTitle className="font-heading font-black text-xl text-[#2B2350]">
              Final Review & Submission Checklist
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6B6590]">
              Review your responses before confirming final submission.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[#6B6590]">Total Questions:</span>
              <strong className="text-[#2B2350]">{PRACTICE_QUESTIONS.length}</strong>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#065F46]">
              <span>Answered:</span>
              <strong>{answeredCount} / {PRACTICE_QUESTIONS.length}</strong>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <span>Flagged for Review:</span>
              <strong>{flaggedCount}</strong>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
              <span>Unanswered:</span>
              <strong>{unansweredCount}</strong>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-[#2B2350]/15">
            <Button
              variant="outline"
              onClick={() => setShowReviewModal(false)}
              className="text-xs font-bold border-[#2B2350]"
            >
              Return to Questions
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold px-5"
            >
              Confirm & Submit Demo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post-Submit Cryptographic Receipt Modal */}
      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className="sm:max-w-lg bg-[#FAFAF7] text-[#2B2350] p-6 rounded-3xl border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350]">
          <DialogHeader className="border-b border-[#2B2350]/15 pb-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#B8F0D2] border-2 border-[#2B2350] flex items-center justify-center mx-auto text-[#065F46] mb-2">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <DialogTitle className="font-heading font-black text-xl text-[#2B2350]">
              Official Submission Receipt
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6B6590]">
              Cryptographically verified exam completion transcript.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3 text-xs font-mono">
            <div className="bg-white p-3.5 rounded-2xl border border-[#2B2350] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6B6590]">SUBMISSION ID:</span>
                <span className="font-bold text-[#6C4DFF]">{receiptToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6590]">TIMESTAMP:</span>
                <span>{new Date().toISOString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6590]">ANSWERS RECORDED:</span>
                <span className="font-bold text-[#065F46]">{answeredCount} of 5</span>
              </div>
              <div className="border-t border-[#2B2350]/15 pt-2">
                <span className="text-[#6B6590] block text-[10px]">LEDGER TERMINAL HASH (SHA-256):</span>
                <span className="text-[10px] break-all text-[#2B2350]">
                  7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-[#2B2350]/15">
            <Button
              onClick={() => {
                setShowReceiptModal(false);
                navigate('/student/dashboard');
              }}
              className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3 rounded-xl border-2 border-[#2B2350]"
            >
              Back to Student Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPracticeDemo;
