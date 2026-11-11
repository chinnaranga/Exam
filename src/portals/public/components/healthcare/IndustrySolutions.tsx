import React from 'react';
import { GraduationCap, Building2, ShieldCheck, Award, Stethoscope, Landmark, Cpu, Factory, Public } from 'lucide-react';

const SOLUTIONS = [
  { title: 'Higher Education', desc: 'Secure midterms, finals, and departmental examinations at 50,000+ student scale.' },
  { title: 'Corporate Learning', desc: 'Employee onboarding, compliance verification, and technical skill benchmark testing.' },
  { title: 'Recruitment Organizations', desc: 'Pre-employment technical coding, aptitude, and cognitive assessment pipelines.' },
  { title: 'Government Examination Boards', desc: 'High-stakes civil service tests with tamper-proof audit trails and zero-trust security.' },
  { title: 'Certification Providers', desc: 'Automate global professional certification pipelines with digital badge issuance.' },
  { title: 'Healthcare Training', desc: 'Clinical scenario evaluations with strict FERPA & HIPAA compliance rules.' },
  { title: 'Banking & Finance', desc: 'Regulatory compliance exams with SOC 2 Type II certified data isolation.' },
  { title: 'Technology Enterprises', desc: 'Automated sandboxed coding evaluations in Python, Java, SQL, and C++.' },
  { title: 'Public Sector Boards', desc: 'On-premises and cloud hybrid deployments for public sector accreditation.' },
];

export const HealthcareIndustrySolutions: React.FC = () => {
  return (
    <section id="solutions" className="py-24 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-mono font-bold text-[#1E40AF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded border border-blue-200">
            Sector-Specific Deployment
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Enterprise Industry Solutions
          </h2>
          <p className="text-sm text-slate-600">
            Operational workflows engineered specifically for institutional requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SOLUTIONS.map((s, idx) => (
            <div key={idx} className="p-5 rounded bg-white border border-slate-200 shadow-xs space-y-2 hover:border-[#1E40AF] transition-all">
              <h4 className="font-bold text-slate-900 text-base">{s.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthcareIndustrySolutions;
