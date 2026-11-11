import React from 'react';
import { BarChart2, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

export const AnalyticsSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Psychometric Telemetry
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Datadog-Grade Assessment Analytics & Heatmaps
          </h2>
          <p className="text-base text-slate-600">
            Real-time candidate score distributions, item point-biserial discrimination, and skill gap predictions.
          </p>
        </div>

        {/* High Density Analytics Dashboard Container */}
        <div className="mt-16 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Overall Pass Rate</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">87.4%</div>
              <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">↑ +3.2% vs previous cohort</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Cronbach's Alpha Reliability</span>
              <div className="text-3xl font-extrabold text-blue-600 mt-1">0.91</div>
              <span className="text-xs text-slate-500 mt-1 inline-block">Excellent Internal Consistency</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Avg Item Discrimination</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">0.42</div>
              <span className="text-xs text-emerald-600 mt-1 inline-block">High Discrimination Index</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">AI Malpractice Flag Rate</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">0.14%</div>
              <span className="text-xs text-slate-500 mt-1 inline-block">2 Flagged Incidents</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Department Performance Breakdown</h4>
              <div className="space-y-3 text-xs">
                {[
                  { dept: 'Computer Science & AI', score: 92 },
                  { dept: 'Electrical Engineering', score: 85 },
                  { dept: 'Business Administration', score: 78 },
                  { dept: 'Medical & Bio-Health', score: 95 },
                ].map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>{d.dept}</span>
                      <span>{d.score}% Avg</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div style={{ width: `${d.score}%` }} className="h-full bg-blue-600 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">AI Skill Gap Recommendation Matrix</h4>
              <div className="p-4 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="flex items-center text-blue-600 font-bold">
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  <span>AI Cohort Insights</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  "Candidates exhibited a 14% performance drop on Question #Q-402 (Distributed Consensus Protocols). Recommended action: Add supplementary lab modules prior to final certification."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
