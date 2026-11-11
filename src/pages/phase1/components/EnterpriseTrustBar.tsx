import React from 'react';
import { ShieldCheck, Cpu, Globe2, Award, Building2, CheckCircle2 } from 'lucide-react';

export const EnterpriseTrustBar: React.FC = () => {
  return (
    <section className="py-16 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="text-3xl font-extrabold text-[#2563EB] font-mono">500+</div>
            <span className="text-xs text-slate-600 font-semibold mt-1 block">Organizations</span>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="text-3xl font-extrabold text-slate-900 font-mono">3M+</div>
            <span className="text-xs text-slate-600 font-semibold mt-1 block">Assessments</span>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="text-3xl font-extrabold text-slate-900 font-mono">18M+</div>
            <span className="text-xs text-slate-600 font-semibold mt-1 block">Candidates</span>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="text-3xl font-extrabold text-[#22C55E] font-mono">99.99%</div>
            <span className="text-xs text-slate-600 font-semibold mt-1 block">Availability</span>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="text-3xl font-extrabold text-slate-900 font-mono">150+</div>
            <span className="text-xs text-slate-600 font-semibold mt-1 block">Countries</span>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="text-3xl font-extrabold text-[#7C3AED] font-mono">AI Powered</div>
            <span className="text-xs text-slate-600 font-semibold mt-1 block">Across Every Module</span>
          </div>
        </div>

        {/* Grayscale Enterprise Customer Logos */}
        <div className="pt-4 border-t border-slate-200/80">
          <p className="text-center text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-8">
            Trusted by Premier Universities, Certification Providers, and Government Examination Boards
          </p>

          <div className="flex flex-wrap items-center justify-center gap-10 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            {[
              'Massachusetts Institute of Technology',
              'Stanford University System',
              'University of Oxford',
              'Cambridge Assessment Board',
              'National Licensing Board',
              'Global Cloud Certification',
            ].map((brand, i) => (
              <div key={i} className="flex items-center space-x-2 text-slate-700 font-extrabold text-sm tracking-tight">
                <Building2 className="w-5 h-5 text-slate-500" />
                <span>{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseTrustBar;
