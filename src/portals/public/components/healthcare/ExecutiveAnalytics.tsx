import React from 'react';
import { BarChart3, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export const HealthcareExecutiveAnalytics: React.FC = () => {
  return (
    <section id="analytics" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-mono font-bold text-[#1E40AF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded border border-blue-200">
            Psychometric & Operations Telemetry
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Executive Analytics & Cohort Performance
          </h2>
          <p className="text-sm text-slate-600">
            High-density operational charts, Cronbach's Alpha reliability metrics, and risk distribution.
          </p>
        </div>

        <div className="bg-[#F8FAFC] p-6 rounded border border-slate-200 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 bg-white rounded border border-slate-200">
              <span className="text-slate-500">Assessment Completion Rate</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">98.4%</div>
              <span className="text-[11px] text-emerald-600 font-semibold">1,458 / 1,482 Candidates</span>
            </div>

            <div className="p-4 bg-white rounded border border-slate-200">
              <span className="text-slate-500">Cohort Pass Rate</span>
              <div className="text-2xl font-bold text-[#1E40AF] mt-1">86.2%</div>
              <span className="text-[11px] text-slate-500">Target Score: &gt;= 70%</span>
            </div>

            <div className="p-4 bg-white rounded border border-slate-200">
              <span className="text-slate-500">Cronbach's Alpha Index</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">0.92</div>
              <span className="text-[11px] text-emerald-600 font-semibold">High Test Reliability</span>
            </div>

            <div className="p-4 bg-white rounded border border-slate-200">
              <span className="text-slate-500">AI Malpractice Flags</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">0.14%</div>
              <span className="text-[11px] text-slate-500">2 Verified Flags</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-white rounded border border-slate-200 space-y-3 text-xs font-mono">
              <h4 className="font-bold text-slate-900 text-sm">Department Performance Matrix</h4>
              <div className="space-y-3 pt-2">
                {[
                  { dept: 'School of Medicine & Health', score: 94 },
                  { dept: 'Department of Computer Science', score: 91 },
                  { dept: 'College of Engineering', score: 86 },
                  { dept: 'School of Business', score: 79 },
                ].map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>{d.dept}</span>
                      <span>{d.score}% Pass</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded overflow-hidden">
                      <div style={{ width: `${d.score}%` }} className="h-full bg-[#1E40AF]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-white rounded border border-slate-200 space-y-3 text-xs font-mono">
              <h4 className="font-bold text-slate-900 text-sm">AI Psychometric Recommendations</h4>
              <div className="p-4 bg-[#F8FAFC] rounded border border-slate-200 space-y-2">
                <div className="flex items-center text-[#1E40AF] font-bold">
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  <span>Item Discrimination Insight</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  "Question #Q-1042 (Clinical Pharmacology) exhibited low discrimination (r = 0.12). Recommended action: Revise distractor options B and C prior to the upcoming licensing exam."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthcareExecutiveAnalytics;
