import React, { useState } from 'react';
import { Sparkles, Brain, CheckCircle2, Cpu, ShieldCheck, Zap, Layers, AlertCircle, ArrowRight } from 'lucide-react';

const AI_CAPABILITIES = [
  {
    id: 'question-gen',
    label: 'Question Generation',
    title: 'Instant Multi-Format Item Generation',
    description: "Generate validated multiple-choice, select-all-that-apply, and scenario-based items categorized by Bloom's Taxonomy cognitive level.",
    workflow: [
      { step: '01', title: 'Curriculum Upload', desc: 'Ingest PDF, EPUB, or Markdown course specs' },
      { step: '02', title: 'Cognitive Mapping', desc: 'Map items to Remembering, Analyzing, or Synthesizing' },
      { step: '03', title: 'Distractor Optimization', desc: 'AI verifies plausible distractors with psychometric quality control' },
    ],
  },
  {
    id: 'essay-scoring',
    label: 'Essay & Code Scoring',
    title: 'Automated Complex Grading',
    description: 'Grade free-text long essays against rubric matrices and execute Python, Java, SQL code blocks in sandboxed containers.',
    workflow: [
      { step: '01', title: 'Rubric Analysis', desc: 'Break down essay arguments into key thesis metrics' },
      { step: '02', title: 'Sandbox Execution', desc: 'Execute code submissions against secret unit test cases' },
      { step: '03', title: 'Detailed Feedback', desc: 'Provide immediate line-by-line feedback to candidates' },
    ],
  },
  {
    id: 'fraud-detection',
    label: 'AI Fraud Detection',
    title: 'Proactive Integrity Sentinel',
    description: 'Analyze real-time video, keystroke cadence, and ambient noise to flag potential academic integrity infractions.',
    workflow: [
      { step: '01', title: 'Computer Vision', desc: 'Real-time head pose & eye tracking gaze vectors' },
      { step: '02', title: 'Audio Isolation', desc: 'Filter background voices and speech frequency' },
      { step: '03', title: 'Proctor Alerting', desc: 'Instantly notify proctor dashboard with timestamped clip' },
    ],
  },
];

export const AIShowcase: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(AI_CAPABILITIES[0]);

  return (
    <section id="ai" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Artificial Intelligence Intelligence Center</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Artificial Intelligence Across Every Assessment
          </h2>
          <p className="text-base text-slate-400">
            From automated item creation to real-time proctoring and psychometric analytics.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mt-12 flex justify-center space-x-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 max-w-xl mx-auto">
          {AI_CAPABILITIES.map((cap) => (
            <button
              key={cap.id}
              onClick={() => setSelectedTab(cap)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
                selectedTab.id === cap.id
                  ? 'bg-[#7C3AED] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cap.label}
            </button>
          ))}
        </div>

        {/* Selected AI Showcase & AI Assistant Telemetry Panel */}
        <div className="mt-12 bg-slate-800/50 border border-slate-700/80 rounded-2xl p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <h3 className="text-2xl font-bold text-white">{selectedTab.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{selectedTab.description}</p>
            
            {/* AI Assistant Telemetry Metrics Box */}
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700/80 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-purple-400 font-bold border-b border-slate-800 pb-2">
                <span className="flex items-center"><Brain className="w-4 h-4 mr-1.5" /> AI COPILOT TELEMETRY</span>
                <span className="text-emerald-400">99.4% CONFIDENCE</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2 bg-slate-800/50 rounded border border-slate-700/50">
                  <span className="text-slate-400 block">Question Quality Score</span>
                  <span className="text-white font-bold text-sm">9.8 / 10</span>
                </div>
                <div className="p-2 bg-slate-800/50 rounded border border-slate-700/50">
                  <span className="text-slate-400 block">Bias Risk Detection</span>
                  <span className="text-emerald-400 font-bold text-sm">0.00% (Clean)</span>
                </div>
                <div className="p-2 bg-slate-800/50 rounded border border-slate-700/50">
                  <span className="text-slate-400 block">IRT Difficulty (b)</span>
                  <span className="text-blue-400 font-bold text-sm">0.82 (Calibrated)</span>
                </div>
                <div className="p-2 bg-slate-800/50 rounded border border-slate-700/50">
                  <span className="text-slate-400 block">Learning Recommendation</span>
                  <span className="text-purple-300 font-bold text-[10px]">Add Consensus Lab</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Diagram */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Automated AI Workflow Pipeline
            </span>
            <div className="space-y-3">
              {selectedTab.workflow.map((w, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 flex items-start space-x-4 hover:border-purple-500/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-purple-500/30">
                    {w.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{w.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIShowcase;
