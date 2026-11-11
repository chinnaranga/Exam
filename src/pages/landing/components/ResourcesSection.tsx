import React from 'react';
import { BookOpen, Code, FileText, ShieldCheck, Activity, Terminal, HelpCircle, Sparkles, ArrowRight } from 'lucide-react';

const RESOURCES = [
  { icon: BookOpen, title: 'Platform Documentation', desc: 'Complete operational guides, administration manuals, and candidate test runner specs.' },
  { icon: Code, title: 'Developer Portal', desc: 'REST & GraphQL API references, Webhook events, and SDK quickstart guides.' },
  { icon: Terminal, title: 'LTI 1.3 Integration Guide', desc: 'Step-by-step Canvas, Blackboard, and Moodle LMS roster and gradebook sync.' },
  { icon: FileText, title: 'Enterprise Whitepapers', desc: 'Deep-dives into IRT 3PL psychometric item calibration and AI bias detection.' },
  { icon: ShieldCheck, title: 'Security & Compliance Center', desc: 'Download SOC 2 Type II audit reports, ISO 27001 certificates, and FERPA packages.' },
  { icon: Activity, title: 'Live Systems Status', desc: 'Real-time uptime status, API latency benchmarks, and scheduled maintenance windows.' },
];

export const ResourcesSection: React.FC = () => {
  return (
    <section id="resources" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded border border-blue-200">
            Developer & Institutional Resources
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Documentation, API References & Compliance Knowledgebase
          </h2>
          <p className="text-sm text-slate-600">
            Everything your engineering, compliance, and academic administration teams need to deploy at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESOURCES.map((r, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-500 transition-all space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <r.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{r.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-blue-600">
                <span>VIEW DOCUMENTATION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
