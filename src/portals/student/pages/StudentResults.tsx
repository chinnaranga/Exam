import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import {
  Award,
  BarChart3,
  Download,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  Lock,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface SectionScore {
  sectionId: string;
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpentMinutes: number;
}

interface StudentScorecard {
  sessionId: string;
  examId: string;
  examCode: string;
  examTitle: string;
  term: string;
  status: 'RELEASED' | 'WITHHELD_REVIEW' | 'WITHHELD_SCHEDULED';
  releaseRule: 'IMMEDIATE' | 'AFTER_REVIEW' | 'SCHEDULED';
  scheduledReleaseAt?: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  gradeLetter: string;
  percentileRank: number;
  passed: boolean;
  submittedAt: string;
  sectionBreakdown: SectionScore[];
  feedback: string[];
  withholdReason?: string;
}

export const StudentResults: React.FC = () => {
  const [selectedScorecardId, setSelectedScorecardId] = useState<string>('sess_cs101_alice');
  const [expandedSections, setExpandedSections] = useState<boolean>(true);

  // Sample student scorecards demonstrating released, withheld under integrity review, and withheld scheduled
  const scorecards: StudentScorecard[] = [
    {
      sessionId: 'sess_cs101_alice',
      examId: 'exam_cs101',
      examCode: 'CS-101',
      examTitle: 'Data Structures & Algorithms Final Examination',
      term: 'Fall 2026',
      status: 'RELEASED',
      releaseRule: 'IMMEDIATE',
      totalScore: 88,
      maxScore: 100,
      percentage: 88.0,
      gradeLetter: 'A-',
      percentileRank: 84.5,
      passed: true,
      submittedAt: 'Nov 11, 2026, 04:42 PM',
      sectionBreakdown: [
        { sectionId: 's1', title: 'Part A: Algorithmic Complexity & Big-O', score: 28, maxScore: 30, percentage: 93.3, timeSpentMinutes: 18 },
        { sectionId: 's2', title: 'Part B: Self-Balancing Trees & Graphs', score: 32, maxScore: 35, percentage: 91.4, timeSpentMinutes: 24 },
        { sectionId: 's3', title: 'Part C: Dynamic Programming & Greedy', score: 28, maxScore: 35, percentage: 80.0, timeSpentMinutes: 22 },
      ],
      feedback: [
        'Exemplary graph traversal and Dijkstra proof of correctness.',
        'Slight deduction in DP memoization space complexity bounds (Part C, Q4).',
        'Demonstrated strong fluency with O(1) amortized hash probing.',
      ],
    },
    {
      sessionId: 'sess_bio204_flagged',
      examId: 'exam_bio204',
      examCode: 'BIO-204',
      examTitle: 'Molecular Genetics & CRISPR Midterm',
      term: 'Fall 2026',
      status: 'WITHHELD_REVIEW',
      releaseRule: 'AFTER_REVIEW',
      totalScore: 0,
      maxScore: 100,
      percentage: 0,
      gradeLetter: 'PENDING',
      percentileRank: 0,
      passed: false,
      submittedAt: 'Nov 12, 2026, 10:15 AM',
      sectionBreakdown: [],
      feedback: [],
      withholdReason:
        'Your examination answers have been securely recorded on the hash-chained audit ledger. Our proctoring review committee is completing standard quality assurance checks. Scores and itemized breakdowns are held until this review concludes.',
    },
    {
      sessionId: 'sess_phys301_scheduled',
      examId: 'exam_phys301',
      examCode: 'PHYS-301',
      examTitle: 'Quantum Mechanics & Statistical Thermodynamics',
      term: 'Fall 2026',
      status: 'WITHHELD_SCHEDULED',
      releaseRule: 'SCHEDULED',
      scheduledReleaseAt: 'Nov 16, 2026, 09:00 AM EST',
      totalScore: 0,
      maxScore: 100,
      percentage: 0,
      gradeLetter: 'SCHEDULED',
      percentileRank: 0,
      passed: false,
      submittedAt: 'Nov 11, 2026, 02:00 PM',
      sectionBreakdown: [],
      feedback: [],
      withholdReason:
        'Official scores for Quantum Mechanics are scheduled for cohort-wide release on Nov 16, 2026, at 09:00 AM EST per Physics Department policy.',
    },
  ];

  const currentScorecard =
    scorecards.find((s) => s.sessionId === selectedScorecardId) || scorecards[0];

  const handleDownloadTranscript = (sc: StudentScorecard) => {
    toast.success('Transcript PDF Generated', {
      description: `Official sealed transcript for ${sc.examCode} is ready for download.`,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A] p-4">
      {/* Top Header */}
      <div className="border-b border-[#E2E8F0] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6C4DFF] bg-[#EDE9FE] px-2 py-0.5 rounded">
              STUDENT PORTAL
            </span>
            <Badge variant="outline" className="text-[10px] font-mono border-emerald-300 text-emerald-700 bg-emerald-50">
              OFFICIAL EVALUATIONS
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight mt-1">My Examination Scorecards</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Verified performance evaluations, section-by-section breakdowns, and official academic transcripts.
          </p>
        </div>

        {currentScorecard.status === 'RELEASED' && (
          <Button
            onClick={() => handleDownloadTranscript(currentScorecard)}
            className="text-xs font-bold bg-[#6C4DFF] hover:bg-[#5835E5] text-white shadow-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Download Official Transcript PDF
          </Button>
        )}
      </div>

      {/* Exam Selection Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scorecards.map((sc) => {
          const isSelected = sc.sessionId === selectedScorecardId;
          return (
            <Card
              key={sc.sessionId}
              onClick={() => setSelectedScorecardId(sc.sessionId)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#6C4DFF] ring-2 ring-[#6C4DFF]/20 bg-white shadow-sm'
                  : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-black text-[#6C4DFF]">{sc.examCode}</span>
                {sc.status === 'RELEASED' ? (
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                    {sc.gradeLetter} ({sc.percentage}%)
                  </Badge>
                ) : sc.status === 'WITHHELD_REVIEW' ? (
                  <Badge className="bg-amber-100 text-amber-800 text-[10px] font-bold font-mono">
                    UNDER REVIEW
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800 text-[10px] font-bold font-mono">
                    SCHEDULED
                  </Badge>
                )}
              </div>
              <h3 className="font-extrabold text-sm text-[#0F172A] mt-2 line-clamp-1">{sc.examTitle}</h3>
              <p className="text-[11px] text-[#64748B] mt-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> {sc.submittedAt}
              </p>
            </Card>
          );
        })}
      </div>

      {/* DETAIL VIEW: CASE 1 - WITHHELD UNDER INTEGRITY REVIEW */}
      {currentScorecard.status === 'WITHHELD_REVIEW' && (
        <Card className="p-8 rounded-2xl border-2 border-amber-300 bg-amber-50/40 space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge className="bg-amber-600 text-white text-[10px] font-mono uppercase">
                  QUALITY & INTEGRITY VERIFICATION ACTIVE
                </Badge>
                <span className="font-mono text-xs text-[#64748B]">Case Ref: {currentScorecard.sessionId}</span>
              </div>
              <h2 className="text-xl font-black text-[#0F172A]">Results Held for Standard Academic Review</h2>
              <p className="text-xs text-[#475569] leading-relaxed max-w-2xl pt-1">
                {currentScorecard.withholdReason}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
              <span className="text-[10px] font-mono text-[#64748B] uppercase">Verification SLA</span>
              <div className="text-sm font-black text-[#0F172A]">24 to 48 Hours</div>
              <span className="text-[11px] text-[#64748B]">Automated email upon release</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
              <span className="text-[10px] font-mono text-[#64748B] uppercase">Integrity Ledger</span>
              <div className="text-sm font-black text-emerald-700 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified & Sealed
              </div>
              <span className="text-[11px] text-[#64748B]">SHA-256 hash-chain anchored</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
              <span className="text-[10px] font-mono text-[#64748B] uppercase">Appeal Rights</span>
              <div className="text-sm font-black text-[#6C4DFF]">14-Day Window</div>
              <span className="text-[11px] text-[#64748B]">Eligible upon final notice</span>
            </div>
          </div>
        </Card>
      )}

      {/* DETAIL VIEW: CASE 2 - WITHHELD SCHEDULED */}
      {currentScorecard.status === 'WITHHELD_SCHEDULED' && (
        <Card className="p-8 rounded-2xl border-2 border-blue-200 bg-blue-50/40 space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-600 text-white text-[10px] font-mono uppercase">
                  SCHEDULED RELEASE RULE
                </Badge>
                <span className="font-mono text-xs text-[#64748B]">Department Embargo</span>
              </div>
              <h2 className="text-xl font-black text-[#0F172A]">Scores Scheduled for Cohort Publication</h2>
              <p className="text-xs text-[#475569] leading-relaxed max-w-2xl pt-1">
                {currentScorecard.withholdReason}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-blue-200 flex items-center justify-between text-xs font-mono">
            <span className="text-[#64748B]">Official Release Timestamp:</span>
            <strong className="text-blue-700 font-bold">{currentScorecard.scheduledReleaseAt}</strong>
          </div>
        </Card>
      )}

      {/* DETAIL VIEW: CASE 3 - RELEASED SCORECARD */}
      {currentScorecard.status === 'RELEASED' && (
        <div className="space-y-6">
          {/* Main KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Total Score</span>
              <div className="text-3xl font-black text-[#6C4DFF] mt-1">
                {currentScorecard.totalScore}
                <span className="text-base text-[#64748B] font-normal"> / {currentScorecard.maxScore}</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                {currentScorecard.percentage}% Cumulative Score
              </span>
            </Card>

            <Card className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Assigned Grade</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">{currentScorecard.gradeLetter}</div>
              <span className="text-[11px] text-emerald-700 font-bold mt-1 block">PASSED (Above 60% Cut Score)</span>
            </Card>

            <Card className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Percentile Rank</span>
              <div className="text-3xl font-black text-[#0F172A] mt-1">{currentScorecard.percentileRank}th</div>
              <span className="text-[11px] text-[#64748B] mt-1 block">Scored higher than 84% of cohort</span>
            </Card>

            <Card className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Integrity Ledger</span>
              <div className="text-sm font-black text-emerald-700 mt-2 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-1.5" /> Full Cleared
              </div>
              <span className="text-[10px] text-[#64748B] font-mono mt-1 block">Anchored on ledger</span>
            </Card>
          </div>

          {/* Section Breakdown Card */}
          <Card className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
            <div
              className="flex justify-between items-center cursor-pointer select-none"
              onClick={() => setExpandedSections(!expandedSections)}
            >
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A]">Section Breakdown & Mastery</h3>
                <p className="text-xs text-[#64748B]">Performance breakdown by syllabus competency modules.</p>
              </div>
              <Button variant="ghost" size="sm">
                {expandedSections ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>

            {expandedSections && (
              <div className="space-y-4 pt-2">
                {currentScorecard.sectionBreakdown.map((sec) => (
                  <div key={sec.sectionId} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#0F172A]">{sec.title}</span>
                      <div className="font-mono text-right">
                        <strong className="text-[#6C4DFF] text-sm">
                          {sec.score} / {sec.maxScore}
                        </strong>
                        <span className="text-[#64748B] ml-2 font-bold">({sec.percentage}%)</span>
                      </div>
                    </div>
                    <Progress value={sec.percentage} className="h-2 bg-[#E2E8F0]" />
                    <div className="flex justify-between text-[11px] font-mono text-[#64748B] pt-1">
                      <span>Time Spent: {sec.timeSpentMinutes} mins</span>
                      <span className="text-emerald-700 font-bold">Module Mastery Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Qualitative Instructor Feedback */}
          {currentScorecard.feedback.length > 0 && (
            <Card className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-3">
              <h3 className="font-extrabold text-base text-[#0F172A] flex items-center">
                <FileText className="w-4 h-4 mr-2 text-[#6C4DFF]" /> Faculty Evaluator Feedback & Notes
              </h3>
              <ul className="space-y-2 text-xs text-[#475569]">
                {currentScorecard.feedback.map((fb, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-[#6C4DFF] font-bold">•</span>
                    <span>{fb}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentResults;
