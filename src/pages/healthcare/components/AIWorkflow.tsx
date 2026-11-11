import React from 'react';
import { Brain, ArrowRight, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

const WORKFLOW_STEPS = [
  { step: '01', title: 'Question Generation', desc: 'AI generates item drafts matching syllabus specs' },
  { step: '02', title: 'Quality Review', desc: 'Distractor validation & bias detection algorithms' },
  { step: '03', title: 'Difficulty Analysis', desc: 'IRT item parameter calibration & scoring' },
  { step: '04', title: 'Bloom\'s Taxonomy', desc: 'Categorize cognitive levels (Remember to Synthesize)' },
  { step: '05', title: 'Exam Assembly', desc: 'Construct domain-balanced assessment blueprints' },
  { step: '06', title: 'Candidate Monitoring', desc: 'Real-time computer vision proctoring & telemetry' },
  { step: '07', title: 'Automated Evaluation', desc: 'Instant grading for free-form essays and code' },
  { step: '08', title: 'Performance Analytics', desc: 'Cohort mastery & discrimination index heatmaps' },
  { step: '09', title: 'Recommendations', desc: 'Curriculum skill gap remediation suggestions' },
];

export const HealthcareAIWorkflow: React.FC = () => {
  return (
    <section id="ai-workflow" className="py-24 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold text-[#1E40AF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded border border-blue-200">
            End-to-End Intelligence Pipeline
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Intelligence Lifecycle Workflow
          </h2>
          <p className="text-sm text-slate-600">
            Automated intelligence built into every phase of the assessment lifecycle.
          </p>
        </div>

        {/* 9-Step Linear Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WORKFLOW_STEPS.map((w, idx) => (
            <div key={idx} className="p-5 rounded bg-white border border-slate-200 shadow-xs space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#1E40AF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  STEP {w.step}
                </span>
                <Brain className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-2">{w.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthcareAIWorkflow;
