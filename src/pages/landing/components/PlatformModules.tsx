import React from 'react';
import { BookOpen, FileSpreadsheet, Cpu, Users, GraduationCap, Building2, BarChart3, Award, Bot, Shield, Code } from 'lucide-react';

const MODULES = [
  { icon: BookOpen, name: 'Question Bank Engine', tag: 'Core Item Bank', desc: 'Item Response Theory (IRT) difficulty tracking & versioning.' },
  { icon: FileSpreadsheet, name: 'Exam Blueprint Builder', tag: 'Authoring', desc: 'Construct multi-section tests matching accreditation standards.' },
  { icon: Cpu, name: 'Assessment Runtime', tag: 'Execution', desc: '100k candidate zero-latency exam delivery engine.' },
  { icon: Users, name: 'Candidate Portal', tag: 'Candidate UX', desc: 'Distraction-free candidate test runner with autosave.' },
  { icon: GraduationCap, name: 'Faculty & Author Portal', tag: 'Academic', desc: 'Collaborative item authoring and manual essay review.' },
  { icon: Building2, name: 'Organization Portal', tag: 'Multi-Tenant', desc: 'Manage campuses, departments, programs, and rosters.' },
  { icon: BarChart3, name: 'Psychometric Analytics', tag: 'Analytics', desc: 'Item point-biserial correlations and score distributions.' },
  { icon: Award, name: 'Credential Automation', tag: 'Certificates', desc: 'Cryptographically signed certificates and PDF transcripts.' },
  { icon: Bot, name: 'AI Co-Pilot Assistant', tag: 'AI Engine', desc: 'Real-time assistant for item creation and grading.' },
  { icon: Shield, name: 'Security Center', tag: 'Compliance', desc: 'Audit logging, RBAC matrix, and MFA settings.' },
  { icon: Code, name: 'Developer API Portal', tag: 'Integrations', desc: 'REST & GraphQL APIs for Canvas, Moodle, and Workday.' },
];

export const PlatformModules: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Comprehensive Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Integrated Enterprise Platform Modules
          </h2>
          <p className="text-base text-slate-600">
            Modular enterprise services designed to operate cohesively or integrate with existing ecosystem tools.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((mod, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-slate-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <mod.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                  {mod.tag}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">{mod.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformModules;
