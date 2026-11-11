import React from 'react';
import { GraduationCap, Building2, ShieldCheck, Award, Stethoscope, Landmark, Cpu, Factory } from 'lucide-react';

const INDUSTRIES = [
  { icon: GraduationCap, title: 'Universities & Colleges', desc: 'Secure midterms, finals, and entrance examinations at 50,000+ student scale.' },
  { icon: Building2, title: 'Corporate Learning', desc: 'Employee onboarding certifications, compliance checks, and technical skill benchmarks.' },
  { icon: ShieldCheck, title: 'Government Exam Boards', desc: 'High-stakes civil service tests with tamper-proof audit trails and zero-trust security.' },
  { icon: Award, title: 'Certification Providers', desc: 'Automate global professional certification pipelines with digital badge issuance.' },
  { icon: Stethoscope, title: 'Healthcare & Medical Boards', desc: 'Clinical scenario evaluations with strict FERPA & HIPAA compliance.' },
  { icon: Landmark, title: 'Banking & Financial Services', desc: 'Regulatory compliance exams with SOC 2 Type II certified data isolation.' },
];

export const IndustrySolutions: React.FC = () => {
  return (
    <section id="solutions" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Tailored Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Every High-Stakes Assessment Industry
          </h2>
          <p className="text-base text-slate-600">
            Custom workflows optimized for academic rigor, corporate compliance, and government security standards.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INDUSTRIES.map((ind, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all group"
            >
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ind.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{ind.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{ind.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustrySolutions;
