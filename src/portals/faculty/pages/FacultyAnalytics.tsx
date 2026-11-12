import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';
import { Progress } from '@/shared/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  Brain,
  ShieldCheck,
  AlertTriangle,
  Download,
  Calendar,
  Clock,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Camera,
  Sun,
  Accessibility,
  Mail,
  Send,
  Sliders,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

export const FacultyAnalytics: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState('exam_cs101');
  const [activeTab, setActiveTab] = useState('exam-analytics');
  const [itemFilter, setItemFilter] = useState<'ALL' | 'FLAGGED' | 'MISKEYED' | 'SOUND'>('ALL');
  const [selectedItemForModal, setSelectedItemForModal] = useState<any | null>(null);

  // Sample Mock Data mirroring our backend ItemAnalysisEngine, ExamAnalyticsEngine, IntegrityAnalyticsEngine, and BiasMonitoringService
  const examMetadata = {
    id: 'exam_cs101',
    title: 'CS 101: Data Structures & Algorithms Final Examination',
    term: 'Fall 2026',
    totalEnrollments: 342,
    completionRate: 96.5,
    averageScore: 78.4,
    medianScore: 81.0,
    standardDeviation: 11.2,
    averageDurationMinutes: 52.4,
    passRate: 88.6,
  };

  const scoreBuckets = [
    { label: '0-10%', count: 2, pct: 0.6 },
    { label: '11-20%', count: 4, pct: 1.2 },
    { label: '21-30%', count: 6, pct: 1.8 },
    { label: '31-40%', count: 11, pct: 3.3 },
    { label: '41-50%', count: 18, pct: 5.5 },
    { label: '51-60%', count: 32, pct: 9.7 },
    { label: '61-70%', count: 54, pct: 16.4 },
    { label: '71-80%', count: 88, pct: 26.7 },
    { label: '81-90%', count: 74, pct: 22.4 },
    { label: '91-100%', count: 41, pct: 12.4 },
  ];

  const questionTimeMetrics = [
    { id: 'q1', prompt: 'Array memory indexing time complexity', avgSec: 28, attempts: 330, difficulty: 0.88 },
    { id: 'q2', prompt: 'Red-Black tree rebalancing rotation', avgSec: 142, attempts: 326, difficulty: 0.42 },
    { id: 'q3', prompt: 'Dijkstra shortest path with Fibonacci heap', avgSec: 215, attempts: 318, difficulty: 0.29 },
    { id: 'q4', prompt: 'Hash collision resolution quadratic probing', avgSec: 74, attempts: 324, difficulty: 0.66 },
    { id: 'q5', prompt: 'Dynamic programming memoization knapsack', avgSec: 188, attempts: 312, difficulty: 0.38 },
  ];

  const dropOffFunnel = [
    { step: 'Started Exam', count: 342, pct: 100 },
    { step: 'Section 1 (Core Concepts)', count: 338, pct: 98.8 },
    { step: 'Section 2 (Trees & Graphs)', count: 332, pct: 97.1 },
    { step: 'Section 3 (Dynamic Prog)', count: 324, pct: 94.7 },
    { step: 'Completed & Submitted', count: 330, pct: 96.5 },
  ];

  const violationHeatmap = [
    { time: '0-5 min', type: 'FULLSCREEN_EXIT', count: 14, severity: 'HIGH' },
    { time: '0-5 min', type: 'GAZE_AWAY', count: 22, severity: 'MEDIUM' },
    { time: '5-10 min', type: 'VOICE_DETECTED', count: 8, severity: 'MEDIUM' },
    { time: '10-20 min', type: 'DEVTOOLS_OPEN', count: 3, severity: 'HIGH' },
    { time: '20-30 min', type: 'PHONE_DETECTED', count: 2, severity: 'HIGH' },
    { time: '30+ min', type: 'GAZE_AWAY', count: 38, severity: 'MEDIUM' },
  ];

  const itemAnalysisData = [
    {
      id: 'q1',
      prompt: 'What is the worst-case lookup complexity in an unbalanced binary search tree?',
      type: 'MULTIPLE_CHOICE',
      maxPoints: 2,
      attempts: 330,
      p: 0.94,
      D: 0.12,
      r_pbis: 0.18,
      flags: ['TOO_EASY', 'POOR_DISCRIMINATION'],
      recommendation: 'Item is too easy (p=0.94). Minimal discrimination power. Retain for confidence or increase rigor.',
      distractors: [
        { text: 'O(n) [Correct]', selectedPct: 94, upper: 98, lower: 88, isCorrect: true },
        { text: 'O(log n)', selectedPct: 4, upper: 2, lower: 8, isCorrect: false },
        { text: 'O(1)', selectedPct: 1, upper: 0, lower: 2, isCorrect: false },
        { text: 'O(n^2)', selectedPct: 1, upper: 0, lower: 2, isCorrect: false },
      ],
    },
    {
      id: 'q2',
      prompt: 'Which hash collision method exhibits secondary clustering?',
      type: 'MULTIPLE_CHOICE',
      maxPoints: 3,
      attempts: 324,
      p: 0.62,
      D: 0.54,
      r_pbis: 0.48,
      flags: [],
      recommendation: 'Sound psychometrics (D=0.54). Excellent separation between high and low ability cohorts.',
      distractors: [
        { text: 'Quadratic Probing [Correct]', selectedPct: 62, upper: 89, lower: 35, isCorrect: true },
        { text: 'Linear Probing', selectedPct: 24, upper: 8, lower: 42, isCorrect: false },
        { text: 'Double Hashing', selectedPct: 12, upper: 3, lower: 19, isCorrect: false },
        { text: 'Separate Chaining', selectedPct: 2, upper: 0, lower: 4, isCorrect: false },
      ],
    },
    {
      id: 'q3',
      prompt: 'Select the optimal space complexity for Floyd-Warshall all-pairs shortest paths:',
      type: 'MULTIPLE_CHOICE',
      maxPoints: 3,
      attempts: 318,
      p: 0.38,
      D: -0.22,
      r_pbis: -0.19,
      flags: ['POSSIBLY_MISKEYED'],
      recommendation: 'CRITICAL ALERT: Negative discrimination (D=-0.22). Top performers selected distractor Option B. Check answer key!',
      distractors: [
        { text: 'O(V^2) [Keyed Answer]', selectedPct: 38, upper: 22, lower: 44, isCorrect: true },
        { text: 'O(V^3) [Distractor B]', selectedPct: 46, upper: 68, lower: 24, isCorrect: false },
        { text: 'O(E + V log V)', selectedPct: 14, upper: 8, lower: 28, isCorrect: false },
        { text: 'O(1)', selectedPct: 2, upper: 2, lower: 4, isCorrect: false },
      ],
    },
    {
      id: 'q4',
      prompt: 'Construct the topological sort order for the given DAG dependency matrix:',
      type: 'ORDERING',
      maxPoints: 4,
      attempts: 312,
      p: 0.18,
      D: 0.28,
      r_pbis: 0.31,
      flags: ['TOO_HARD'],
      recommendation: 'Item is excessively difficult (p=0.18). Good discrimination, but high cognitive load.',
      distractors: [],
    },
    {
      id: 'q5',
      prompt: 'Identify the pivot element in Lomuto partition scheme:',
      type: 'MULTIPLE_CHOICE',
      maxPoints: 2,
      attempts: 328,
      p: 0.74,
      D: 0.42,
      r_pbis: 0.39,
      flags: ['NON_FUNCTIONING_DISTRACTOR'],
      recommendation: 'Option D selected by <1% of candidates. Replace dead distractor with a plausible alternative.',
      distractors: [
        { text: 'Last element [Correct]', selectedPct: 74, upper: 92, lower: 50, isCorrect: true },
        { text: 'First element', selectedPct: 21, upper: 7, lower: 38, isCorrect: false },
        { text: 'Median of three', selectedPct: 4, upper: 1, lower: 10, isCorrect: false },
        { text: 'Random index', selectedPct: 1, upper: 0, lower: 2, isCorrect: false },
      ],
    },
  ];

  const integritySignals = [
    { signal: 'PHONE_DETECTED', points: 3, severity: 'HIGH', count: 18, upheld: 17, cleared: 1, precision: 94.4, grade: 'EXCELLENT' },
    { signal: 'DEVTOOLS_OPEN', points: 3, severity: 'HIGH', count: 12, upheld: 11, cleared: 1, precision: 91.7, grade: 'EXCELLENT' },
    { signal: 'MULTIPLE_MONITORS', points: 3, severity: 'HIGH', count: 15, upheld: 13, cleared: 2, precision: 86.7, grade: 'EXCELLENT' },
    { signal: 'FULLSCREEN_EXIT', points: 3, severity: 'HIGH', count: 48, upheld: 32, cleared: 16, precision: 66.7, grade: 'FAIR' },
    { signal: 'VOICE_DETECTED', points: 2, severity: 'MEDIUM', count: 42, upheld: 24, cleared: 18, precision: 57.1, grade: 'FAIR' },
    { signal: 'GAZE_AWAY', points: 2, severity: 'MEDIUM', count: 76, upheld: 28, cleared: 48, precision: 36.8, grade: 'POOR' },
  ];

  const weightTuningRecommendations = [
    {
      signal: 'GAZE_AWAY',
      current: 'MEDIUM (2 pts)',
      recommended: 'LOW (1 pt)',
      action: 'DECREASE',
      reason: 'High false-positive rate (63.2%). Reviewers cleared eye drift caused by secondary scratchpad reading.',
    },
    {
      signal: 'FULLSCREEN_EXIT',
      current: 'HIGH (3 pts)',
      recommended: 'MEDIUM (2 pts) with 10s grace',
      action: 'DECREASE',
      reason: 'OS notifications and trackpad swipe gestures trigger unintentional exits. Grace period reduces false flags.',
    },
  ];

  const biasCohorts = [
    {
      category: 'Camera Hardware',
      cohortA: { name: 'Standard/HD Webcams (>=720p)', total: 284, flagged: 18, rate: 6.3, avgScore: 92.4 },
      cohortB: { name: 'Low Resolution / Noisy Sensor (<720p)', total: 58, flagged: 14, rate: 24.1, avgScore: 78.1 },
      disparityRatio: 3.82,
      isAlert: true,
      alertMessage: 'Low-resolution webcams trigger 3.8x more automated face/gaze flags due to sensor noise at low Lux.',
      mitigation: 'Adjust FaceMesh landmark confidence threshold for 480p streams and route borderline cases to manual review before applying points.',
    },
    {
      category: 'Lighting Environment',
      cohortA: { name: 'Balanced & Uniform Lighting', total: 298, flagged: 22, rate: 7.4, avgScore: 91.2 },
      cohortB: { name: 'Dim / Backlit Workspace', total: 44, flagged: 10, rate: 22.7, avgScore: 82.5 },
      disparityRatio: 3.06,
      isAlert: true,
      alertMessage: 'Backlit candidates suffer shadow occlusion, resulting in false "face missing" triggers.',
      mitigation: 'Add pre-exam camera Lux luminance check to guide candidates to face a desk lamp before launch.',
    },
    {
      category: 'Accommodation Status',
      cohortA: { name: 'Standard Candidates', total: 312, flagged: 28, rate: 8.9, avgScore: 90.1 },
      cohortB: { name: 'Approved Accommodations', total: 30, flagged: 4, rate: 13.3, avgScore: 88.4 },
      disparityRatio: 1.49,
      isAlert: false,
      alertMessage: 'Accommodation rate is within acceptable variance range (1.49x baseline). Gaze suppression active.',
      mitigation: 'Continue automatic suppression of focus loss penalties during approved rest break countdowns.',
    },
  ];

  const filteredItems = itemAnalysisData.filter((item) => {
    if (itemFilter === 'ALL') return true;
    if (itemFilter === 'FLAGGED') return item.flags.length > 0;
    if (itemFilter === 'MISKEYED') return item.flags.includes('POSSIBLY_MISKEYED');
    if (itemFilter === 'SOUND') return item.flags.length === 0;
    return true;
  });

  const handleExportCSV = (type: string) => {
    toast.success(`Exporting ${type} CSV...`, {
      description: 'The CSV report has been generated and downloaded.',
    });
  };

  const handlePrintPDF = () => {
    toast.info('Generating Official PDF Report...', {
      description: 'Preparing high-resolution psychometrics print preview.',
    });
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleTriggerReportDispatch = () => {
    toast.success('Scheduled Report Dispatched', {
      description: 'Digest emailed to provost@university.edu and 2 exam administrators.',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#0F172A] p-4">
      {/* Top Header & Exam Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6C4DFF] bg-[#EDE9FE] px-2 py-0.5 rounded">
              ASSESSIQ ANALYTICS & PSYCHOMETRICS
            </span>
            <Badge variant="outline" className="text-[10px] font-mono border-emerald-300 text-emerald-700 bg-emerald-50">
              AUDITED COHORT
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight mt-1">{examMetadata.title}</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Psychometric item difficulty (p), Kelly 27% discrimination (D), proctoring signal tuning, and algorithmic bias monitoring.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={() => handleExportCSV('Psychometrics & Results')} variant="outline" size="sm" className="text-xs font-bold border-[#CBD5E1]">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Export CSV
          </Button>
          <Button onClick={handlePrintPDF} variant="outline" size="sm" className="text-xs font-bold border-[#CBD5E1]">
            <Printer className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Print / PDF
          </Button>
          <Button onClick={handleTriggerReportDispatch} size="sm" className="text-xs font-bold bg-[#6C4DFF] hover:bg-[#5835E5] text-white">
            <Mail className="w-3.5 h-3.5 mr-1.5" /> Email Digest
          </Button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#F1F5F9] p-1 border border-[#E2E8F0] rounded-xl grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="exam-analytics" className="text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#6C4DFF] data-[state=active]:shadow-xs">
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Exam Analytics
          </TabsTrigger>
          <TabsTrigger value="item-analysis" className="text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#6C4DFF] data-[state=active]:shadow-xs">
            <Brain className="w-3.5 h-3.5 mr-1.5" /> Item Analysis ({itemAnalysisData.length})
          </TabsTrigger>
          <TabsTrigger value="integrity-analytics" className="text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#6C4DFF] data-[state=active]:shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Integrity & Tuning
          </TabsTrigger>
          <TabsTrigger value="bias-monitoring" className="text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#6C4DFF] data-[state=active]:shadow-xs">
            <Accessibility className="w-3.5 h-3.5 mr-1.5" /> Bias & Fairness
          </TabsTrigger>
          <TabsTrigger value="scheduled-reports" className="text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#6C4DFF] data-[state=active]:shadow-xs">
            <Calendar className="w-3.5 h-3.5 mr-1.5" /> Reports & Exports
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: EXAM ANALYTICS */}
        <TabsContent value="exam-analytics" className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Total Enrollments</span>
              <div className="text-2xl font-black text-[#0F172A] mt-1">{examMetadata.totalEnrollments}</div>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center mt-1">
                <CheckCircle2 className="w-3 h-3 mr-1" /> {examMetadata.completionRate}% Completion Rate
              </span>
            </Card>

            <Card className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Mean Cohort Score</span>
              <div className="text-2xl font-black text-[#6C4DFF] mt-1">{examMetadata.averageScore}%</div>
              <span className="text-[11px] text-[#64748B] mt-1">
                Median: {examMetadata.medianScore}% • StdDev: ±{examMetadata.standardDeviation}%
              </span>
            </Card>

            <Card className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Pass Rate (≥60%)</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{examMetadata.passRate}%</div>
              <span className="text-[11px] text-[#64748B] mt-1">303 of 342 passed cut score</span>
            </Card>

            <Card className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Average Duration</span>
              <div className="text-2xl font-black text-[#0F172A] mt-1">{examMetadata.averageDurationMinutes}m</div>
              <span className="text-[11px] text-[#64748B] mt-1">Allocated window: 90 mins</span>
            </Card>
          </div>

          {/* Score Distribution Deciles Chart */}
          <Card className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A]">Decile Score Distribution</h3>
                <p className="text-xs text-[#64748B]">Bimodal distribution curve across 10 scoring deciles.</p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#64748B]">
                <span className="w-3 h-3 bg-[#6C4DFF] rounded-xs inline-block" /> Pass Cohort
                <span className="w-3 h-3 bg-[#CBD5E1] rounded-xs inline-block ml-2" /> Below Cut-Score
              </div>
            </div>

            <div className="grid grid-cols-10 gap-2 items-end h-44 pt-6 pb-2 border-b border-[#E2E8F0]">
              {scoreBuckets.map((b, idx) => {
                const isPassing = idx >= 6;
                const heightPct = Math.max(8, (b.pct / 30) * 100);
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-bold text-[#64748B] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {b.count}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-md transition-all ${
                        isPassing ? 'bg-[#6C4DFF] group-hover:bg-[#5835E5]' : 'bg-[#CBD5E1] group-hover:bg-[#94A3B8]'
                      }`}
                    />
                    <span className="text-[9px] font-mono text-[#64748B] mt-2 text-center truncate w-full">{b.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 text-xs font-mono text-[#475569] pt-2">
              <div>Q1 (25th Percentile): <strong>68.0%</strong></div>
              <div className="text-center">Median (Q2): <strong>81.0%</strong></div>
              <div className="text-right">Q3 (75th Percentile): <strong>89.0%</strong></div>
            </div>
          </Card>

          {/* Time Per Question & Drop-off Funnel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center">
                <Clock className="w-4 h-4 mr-2 text-[#6C4DFF]" /> Average Time Spent Per Question
              </h3>
              <div className="space-y-3">
                {questionTimeMetrics.map((qm) => (
                  <div key={qm.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="font-bold text-[#334155]">{qm.prompt}</span>
                      <span className="font-mono text-[#64748B] font-bold">{qm.avgSec}s</span>
                    </div>
                    <Progress value={Math.min(100, (qm.avgSec / 240) * 100)} className="h-2 bg-[#F1F5F9]" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center">
                <Users className="w-4 h-4 mr-2 text-emerald-600" /> Completion Funnel & Drop-Off Points
              </h3>
              <div className="space-y-3">
                {dropOffFunnel.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="font-bold text-[#334155]">{step.step}</span>
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-[#64748B]">{step.count} active</span>
                      <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                        {step.pct}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Violation Heatmap */}
          <Card className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Violation Heatmap by Exam Timeline
            </h3>
            <p className="text-xs text-[#64748B]">Proctoring events grouped into 5-minute intervals from candidate launch.</p>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
              {violationHeatmap.map((cell, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-[#E2E8F0] bg-[#FFFBEB] space-y-1">
                  <span className="text-[10px] font-mono text-[#B45309] font-bold block">{cell.time}</span>
                  <div className="text-xs font-black text-[#92400E] truncate">{cell.type}</div>
                  <div className="text-lg font-black text-[#B45309]">{cell.count} flags</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: ITEM ANALYSIS & PSYCHOMETRICS */}
        <TabsContent value="item-analysis" className="space-y-6">
          {/* Psychometrics Top Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Mean Difficulty (p)</span>
              <div className="text-2xl font-black text-[#0F172A] mt-1">0.68</div>
              <span className="text-[11px] text-emerald-600 font-bold">Optimal CTT Range (0.50-0.75)</span>
            </Card>

            <Card className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Mean Discrimination (D)</span>
              <div className="text-2xl font-black text-[#6C4DFF] mt-1">0.44</div>
              <span className="text-[11px] text-[#6C4DFF] font-bold">Excellent Separation (D &gt; 0.40)</span>
            </Card>

            <Card className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Flagged Questions</span>
              <div className="text-2xl font-black text-amber-600 mt-1">3 of 5</div>
              <span className="text-[11px] text-[#64748B]">Requires instructional review</span>
            </Card>

            <Card className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Mis-Keyed Alerts</span>
              <div className="text-2xl font-black text-rose-600 mt-1">1 Item</div>
              <span className="text-[11px] text-rose-600 font-bold">Q3 exhibits negative D</span>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#64748B]" />
              <span className="text-xs font-bold text-[#64748B]">Filter Questions:</span>
              {(['ALL', 'FLAGGED', 'MISKEYED', 'SOUND'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={itemFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setItemFilter(filter)}
                  className={`text-xs font-bold h-7 px-3 rounded-lg ${
                    itemFilter === filter
                      ? 'bg-[#6C4DFF] text-white'
                      : 'border-[#CBD5E1] text-[#475569]'
                  }`}
                >
                  {filter}
                </Button>
              ))}
            </div>
            <span className="text-xs text-[#64748B] font-mono">Showing {filteredItems.length} of {itemAnalysisData.length} items</span>
          </div>

          {/* Item Table */}
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const isMiskeyed = item.flags.includes('POSSIBLY_MISKEYED');
              return (
                <Card
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isMiskeyed ? 'border-rose-300 bg-rose-50/20' : 'border-[#E2E8F0] bg-white'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-black text-[#6C4DFF] bg-[#EDE9FE] px-2 py-0.5 rounded">
                          {item.id.toUpperCase()}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {item.type}
                        </Badge>
                        {item.flags.map((flag, idx) => (
                          <Badge
                            key={idx}
                            className={`text-[10px] font-bold font-mono ${
                              flag === 'POSSIBLY_MISKEYED'
                                ? 'bg-rose-600 text-white'
                                : flag === 'TOO_HARD' || flag === 'TOO_EASY'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {flag}
                          </Badge>
                        ))}
                      </div>
                      <h4 className="font-extrabold text-sm text-[#0F172A] mt-1">{item.prompt}</h4>
                    </div>

                    <div className="flex items-center space-x-6 text-xs font-mono shrink-0">
                      <div>
                        <span className="text-[#64748B] block text-[10px]">DIFFICULTY (p)</span>
                        <strong className="text-sm font-black text-[#0F172A]">{item.p.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span className="text-[#64748B] block text-[10px]">DISCRIMINATION (D)</span>
                        <strong
                          className={`text-sm font-black ${
                            item.D < 0 ? 'text-rose-600' : item.D >= 0.4 ? 'text-emerald-600' : 'text-[#6C4DFF]'
                          }`}
                        >
                          {item.D.toFixed(2)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#64748B] block text-[10px]">POINT-BISERIAL</span>
                        <strong className="text-sm font-black text-[#475569]">{item.r_pbis.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Callout */}
                  <div
                    className={`mt-3 p-2.5 rounded-lg text-xs flex items-center space-x-2 ${
                      isMiskeyed ? 'bg-rose-100 text-rose-900 border border-rose-200' : 'bg-[#F8FAFC] text-[#475569]'
                    }`}
                  >
                    <Info className="w-4 h-4 shrink-0" />
                    <span><strong>Recommendation:</strong> {item.recommendation}</span>
                  </div>

                  {/* Distractor Breakdown if available */}
                  {item.distractors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E2E8F0]/70 grid grid-cols-1 sm:grid-cols-4 gap-2">
                      {item.distractors.map((dist, dIdx) => (
                        <div
                          key={dIdx}
                          className={`p-2 rounded-lg text-xs border ${
                            dist.isCorrect
                              ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                              : 'bg-white border-[#E2E8F0] text-[#475569]'
                          }`}
                        >
                          <div className="font-bold truncate">{dist.text}</div>
                          <div className="text-[10px] font-mono mt-1 flex justify-between">
                            <span>Selected: {dist.selectedPct}%</span>
                            <span className="text-[#64748B]">Top 27%: {dist.upper}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 3: INTEGRITY ANALYTICS & TUNING */}
        <TabsContent value="integrity-analytics" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Proctoring Confidence</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">88.4%</div>
              <span className="text-[11px] text-[#64748B]">Cohort average confidence</span>
            </Card>

            <Card className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Reviewed Cases</span>
              <div className="text-2xl font-black text-[#0F172A] mt-1">28 Cases</div>
              <span className="text-[11px] text-[#64748B]">Human reviewer decisions</span>
            </Card>

            <Card className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">False Positive Rate</span>
              <div className="text-2xl font-black text-amber-600 mt-1">39.3%</div>
              <span className="text-[11px] text-amber-700 font-bold">11 cleared by reviewers</span>
            </Card>

            <Card className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Confirmed Infractions</span>
              <div className="text-2xl font-black text-rose-600 mt-1">17 Upheld</div>
              <span className="text-[11px] text-rose-600 font-bold">60.7% Upheld Precision</span>
            </Card>
          </div>

          {/* Signal Effectiveness Ranking Table */}
          <Card className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A]">Proctoring Signal Reliability Ranking</h3>
                <p className="text-xs text-[#64748B]">
                  Signals ranked by human reviewer verification rate. High false-positive signals warrant weight tuning.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] font-mono text-[10px] uppercase">
                    <th className="pb-3">Proctoring Signal</th>
                    <th className="pb-3">Severity / Points</th>
                    <th className="pb-3">Total Flagged</th>
                    <th className="pb-3">Upheld (True Pos)</th>
                    <th className="pb-3">Cleared (False Pos)</th>
                    <th className="pb-3">Precision (Upheld %)</th>
                    <th className="pb-3">Reliability Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {integritySignals.map((sig, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 font-bold text-[#0F172A]">{sig.signal}</td>
                      <td className="py-3 font-mono">
                        <Badge variant="outline" className="text-[10px]">
                          {sig.severity} ({sig.points} pts)
                        </Badge>
                      </td>
                      <td className="py-3 font-mono font-bold">{sig.count}</td>
                      <td className="py-3 font-mono text-emerald-600 font-bold">{sig.upheld}</td>
                      <td className="py-3 font-mono text-rose-600 font-bold">{sig.cleared}</td>
                      <td className="py-3 font-mono font-bold">{sig.precision}%</td>
                      <td className="py-3">
                        <Badge
                          className={`text-[10px] font-bold font-mono ${
                            sig.grade === 'EXCELLENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sig.grade === 'GOOD'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {sig.grade}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Severity Weight Tuning Recommendations */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center">
              <Sliders className="w-4 h-4 mr-2 text-[#6C4DFF]" /> Automated Severity Weight Tuning Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weightTuningRecommendations.map((rec, idx) => (
                <Card key={idx} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-black text-amber-900">{rec.signal}</span>
                    <Badge className="bg-amber-600 text-white text-[10px] font-mono uppercase">{rec.action}</Badge>
                  </div>
                  <p className="text-xs text-[#475569]">{rec.reason}</p>
                  <div className="pt-2 border-t border-amber-200 flex justify-between items-center text-xs font-mono">
                    <span>
                      Current: <strong>{rec.current}</strong> &rarr; Rec: <strong>{rec.recommended}</strong>
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success(`Applied weight update for ${rec.signal}`)}
                      className="text-[11px] h-7 bg-white border-amber-300 font-bold text-amber-900"
                    >
                      Apply Tuning
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: BIAS MONITORING VIEW */}
        <TabsContent value="bias-monitoring" className="space-y-6">
          <div className="bg-[#EDE9FE]/50 border border-[#6C4DFF]/30 p-4 rounded-xl flex items-start space-x-3 text-xs text-[#2E1065]">
            <Info className="w-5 h-5 text-[#6C4DFF] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Privacy-Preserving Algorithmic Bias Auditing</strong>
              AssessIQ strictly analyzes model performance against operational and hardware variables (webcam resolution, Lux levels, accommodation status) rather than protected personal demographics, ensuring fair, non-discriminatory proctoring.
            </div>
          </div>

          <div className="space-y-4">
            {biasCohorts.map((bc, idx) => (
              <Card key={idx} className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-[#0F172A] flex items-center">
                    {bc.category === 'Camera Hardware' && <Camera className="w-4 h-4 mr-2 text-[#6C4DFF]" />}
                    {bc.category === 'Lighting Environment' && <Sun className="w-4 h-4 mr-2 text-amber-500" />}
                    {bc.category === 'Accommodation Status' && <Accessibility className="w-4 h-4 mr-2 text-emerald-600" />}
                    {bc.category}
                  </h4>
                  <Badge
                    className={`text-[10px] font-mono font-bold ${
                      bc.isAlert ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Disparity Ratio: {bc.disparityRatio}x {bc.isAlert ? '(DISPARITY ALERT)' : '(NOMINAL)'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="font-bold text-[#334155]">{bc.cohortA.name}</span>
                    <div className="flex justify-between font-mono text-[#64748B]">
                      <span>{bc.cohortA.total} Sessions</span>
                      <strong className="text-emerald-700">{bc.cohortA.rate}% Flag Rate</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FFFBEB] border border-amber-200 space-y-1">
                    <span className="font-bold text-[#92400E]">{bc.cohortB.name}</span>
                    <div className="flex justify-between font-mono text-[#64748B]">
                      <span>{bc.cohortB.total} Sessions</span>
                      <strong className="text-rose-700">{bc.cohortB.rate}% Flag Rate</strong>
                    </div>
                  </div>
                </div>

                {bc.isAlert && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                    <div className="font-bold flex items-center">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-rose-600" /> {bc.alertMessage}
                    </div>
                    <div className="text-[11px] text-rose-800">
                      <strong>Mitigation:</strong> {bc.mitigation}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 5: SCHEDULED REPORTS & EXPORTS */}
        <TabsContent value="scheduled-reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center">
                <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" /> Export CSV Data
              </h3>
              <p className="text-xs text-[#64748B]">Instant raw CSV dumps for institutional SIS, Canvas, or LMS ingestion.</p>
              <div className="space-y-2 pt-2">
                <Button onClick={() => handleExportCSV('Candidate Scorecards')} variant="outline" className="w-full text-xs font-bold border-[#CBD5E1] justify-between">
                  Candidate Scorecards CSV <Download className="w-3.5 h-3.5" />
                </Button>
                <Button onClick={() => handleExportCSV('Item Psychometrics')} variant="outline" className="w-full text-xs font-bold border-[#CBD5E1] justify-between">
                  Item Psychometrics (p & D) CSV <Download className="w-3.5 h-3.5" />
                </Button>
                <Button onClick={() => handleExportCSV('Integrity & Signal Auditing')} variant="outline" className="w-full text-xs font-bold border-[#CBD5E1] justify-between">
                  Integrity Audit Ledger CSV <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-3 md:col-span-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-[#6C4DFF]" /> Scheduled Email Reports
                  </h3>
                  <p className="text-xs text-[#64748B]">Automated executive reports dispatched to academic administrators.</p>
                </div>
                <Button onClick={handleTriggerReportDispatch} size="sm" className="text-xs bg-[#6C4DFF] text-white font-bold">
                  <Send className="w-3 h-3 mr-1" /> Send Test Digest
                </Button>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#0F172A]">Weekly Provost & Psychometrics Executive Digest</span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-mono">ACTIVE (WEEKLY)</Badge>
                </div>
                <div className="text-[11px] text-[#64748B] font-mono">
                  Recipients: provost@university.edu, dean.academic@university.edu, exam.admin@university.edu
                </div>
                <div className="text-[11px] text-[#475569] pt-1">
                  Includes: Score distribution, psychometric item flags, proctoring false-positive rate, and hardware bias disparity alerts.
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyAnalytics;
