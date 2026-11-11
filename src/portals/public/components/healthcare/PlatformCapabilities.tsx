import React from 'react';
import {
  BookOpen,
  FileSpreadsheet,
  Calendar,
  Activity,
  User,
  GraduationCap,
  CheckSquare,
  Brain,
  CheckCircle2,
  Video,
  Award,
  FileText,
  ShieldAlert,
  BarChart3,
  Building2,
} from 'lucide-react';

const MODULES = [
  { icon: BookOpen, name: 'Question Bank Engine', desc: 'Item Response Theory (IRT) calibrated item bank with version control.' },
  { icon: FileSpreadsheet, name: 'Assessment Builder', desc: 'Construct blueprint-matched assessment blueprints with weighted domains.' },
  { icon: Calendar, name: 'Assessment Scheduling', desc: 'Automate candidate slot distribution across multi-center locations.' },
  { icon: Activity, name: 'Live Monitoring Center', desc: 'Real-time telemetry dashboard tracking candidate focus loss & latency.' },
  { icon: User, name: 'Candidate Portal', desc: 'Zero-distraction test runner engine with local IndexedDB autosave.' },
  { icon: GraduationCap, name: 'Faculty Portal', desc: 'Academic authoring, peer item review, and manual grade overrides.' },
  { icon: CheckSquare, name: 'Evaluator Workspace', desc: 'Rubric-driven essay scoring and coding submission sandboxes.' },
  { icon: Brain, name: 'AI Question Generation', desc: 'Generate difficulty-balanced items matching Bloom\'s Taxonomy level 1-6.' },
  { icon: CheckCircle2, name: 'AI Automated Evaluation', desc: 'Instant grading for free-form responses, SQL queries, and code blocks.' },
  { icon: Video, name: 'AI Remote Proctoring', desc: 'Computer vision face verification, audio spectrum & eye-gaze tracking.' },
  { icon: Award, name: 'Credential Certificates', desc: 'Issue cryptographically signed PDF diplomas and open digital badges.' },
  { icon: FileText, name: 'Compliance Reports', desc: 'Automated accreditation compliance exports for FERPA, ABET & SOC 2.' },
  { icon: ShieldAlert, name: 'Security Audit Center', desc: 'Append-only audit trail logging all authorization & item edit events.' },
  { icon: BarChart3, name: 'Psychometric Analytics', desc: 'Point-biserial discrimination, Cronbach\'s Alpha & distractor heatmaps.' },
  { icon: Building2, name: 'Organization Management', desc: 'Multi-tenant scoping for campuses, departments, and course rosters.' },
];

export const HealthcarePlatformCapabilities: React.FC = () => {
  return (
    <section id="modules" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-[#1E40AF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded border border-blue-200">
            Modular Application Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Enterprise Application Modules
          </h2>
          <p className="text-sm text-slate-600">
            Fully integrated operational modules built for mission-critical institutional deployment.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded bg-white border border-slate-200 shadow-xs hover:border-[#1E40AF] transition-all space-y-3"
            >
              <div className="p-2.5 rounded bg-slate-50 text-[#1E40AF] w-fit border border-slate-200">
                <m.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{m.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthcarePlatformCapabilities;
