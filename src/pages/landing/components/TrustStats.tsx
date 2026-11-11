import React from 'react';
import { Building2, GraduationCap, ShieldCheck, Award } from 'lucide-react';

export const TrustStats: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-8">
          Trusted by Premier Universities, Fortune 500 Enterprises & Government Examination Boards
        </p>

        {/* Institution Brand Logotypes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="flex items-center space-x-2 font-bold text-slate-700 text-lg">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span>Stanford University</span>
          </div>
          <div className="flex items-center space-x-2 font-bold text-slate-700 text-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>MIT Extension</span>
          </div>
          <div className="flex items-center space-x-2 font-bold text-slate-700 text-lg">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span>National Certification Board</span>
          </div>
          <div className="flex items-center space-x-2 font-bold text-slate-700 text-lg">
            <Award className="w-6 h-6 text-blue-600" />
            <span>Global Tech Institute</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center pt-12 border-t border-slate-200">
          <div>
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">500+</div>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-2">Enterprise & Academic Partners</p>
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-600 tracking-tight">2M+</div>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-2">Proctored Assessments Conducted</p>
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">15M+</div>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-2">Evaluated Candidates Worldwide</p>
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-extrabold text-emerald-600 tracking-tight">99.99%</div>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-2">Guaranteed Uptime Availability</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustStats;
