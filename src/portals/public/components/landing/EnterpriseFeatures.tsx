import React from 'react';
import {
  Brain,
  FileSpreadsheet,
  CheckCheck,
  BookOpen,
  Video,
  Activity,
  Award,
  ShieldCheck,
  Building2,
  FileText,
  Lock,
  Cpu,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Question Generator',
    description: "Generate multi-choice, coding, and essay questions aligned with Bloom's taxonomy.",
    badge: 'AI Core',
  },
  {
    icon: FileSpreadsheet,
    title: 'AI Exam Blueprint Builder',
    description: 'Construct balanced assessment structures matching strict institutional domain weightings.',
    badge: 'Automation',
  },
  {
    icon: CheckCheck,
    title: 'Automated Essay & Code Scoring',
    description: 'Instant AI grading for complex free-text essays, SQL queries, and Python code blocks.',
    badge: 'Evaluation',
  },
  {
    icon: BookOpen,
    title: 'Versioned Item Bank',
    description: 'Organize 100,000+ item banks with item response theory (IRT) difficulty tracking.',
    badge: 'Item Bank',
  },
  {
    icon: Video,
    title: 'Real-Time AI Proctoring',
    description: 'Multi-face detection, secondary display alerts, gaze tracking, and audio anomaly logging.',
    badge: 'Security',
  },
  {
    icon: Activity,
    title: 'Candidate Behavior Telemetry',
    description: 'Monitor keystroke dynamics, tab focus loss, and network bandwidth degradation in real time.',
    badge: 'Telemetry',
  },
  {
    icon: Award,
    title: 'Automated Certification',
    description: 'Issue cryptographic, tamper-proof PDF and digital badge credentials upon exam completion.',
    badge: 'Credentials',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access Control',
    description: '15 granular system roles for Super Admins, Deans, Faculty, Proctors, and Candidates.',
    badge: 'Governance',
  },
  {
    icon: Building2,
    title: 'Multi-Tenant Architecture',
    description: 'Isolate campuses, departments, programs, and courses under dedicated tenant boundaries.',
    badge: 'Enterprise',
  },
  {
    icon: FileText,
    title: 'Immutable Security Audit Trail',
    description: 'Capture every login, item modification, grade override, and security flag in an append-only log.',
    badge: 'Compliance',
  },
  {
    icon: Lock,
    title: 'Zero-Trust Lockdown Browser',
    description: 'Prevent copy-paste, screen recording, virtual machine execution, and external port usage.',
    badge: 'Proctoring',
  },
  {
    icon: Cpu,
    title: 'Developer REST & GraphQL API',
    description: 'Connect ExamifyPro to Canvas, Blackboard, Moodle, Workday, or custom Enterprise HRIS.',
    badge: 'Integrations',
  },
];

export const EnterpriseFeatures: React.FC = () => {
  return (
    <section id="platform" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Enterprise Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Mission-Critical Institutional Assessments
          </h2>
          <p className="text-base text-slate-600">
            Every capability is engineered to deliver high precision, tamper-proof security, and seamless candidate experiences.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <feat.icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {feat.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnterpriseFeatures;
