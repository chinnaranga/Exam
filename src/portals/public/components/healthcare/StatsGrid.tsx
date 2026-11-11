import React from 'react';

export const HealthcareStatsGrid: React.FC = () => {
  return (
    <section className="py-16 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
          <div className="p-4 bg-white rounded border border-slate-200 shadow-xs">
            <div className="text-3xl font-extrabold text-[#1E40AF] font-mono">99.99%</div>
            <span className="text-xs text-slate-600 font-semibold mt-1 block">Platform Availability</span>
          </div>

          <div className="p-4 bg-white rounded border border-slate-200 shadow-xs">
            <div className="text-3xl font-extrabold text-slate-900 font-mono">500+</div>
            <span className="text-xs text-slate-600 font-semibold mt-1 block">Organizations</span>
          </div>

          <div className="p-4 bg-white rounded border border-slate-200 shadow-xs">
            <div className="text-3xl font-extrabold text-slate-900 font-mono">3M+</div>
            <span className="text-xs text-slate-600 font-semibold mt-1 block">Assessments</span>
          </div>

          <div className="p-4 bg-white rounded border border-slate-200 shadow-xs">
            <div className="text-3xl font-extrabold text-slate-900 font-mono">15M+</div>
            <span className="text-xs text-slate-600 font-semibold mt-1 block">Candidates</span>
          </div>

          <div className="p-4 bg-white rounded border border-slate-200 shadow-xs">
            <div className="text-3xl font-extrabold text-[#15803D] font-mono">Real-Time</div>
            <span className="text-xs text-slate-600 font-semibold mt-1 block">AI Monitoring</span>
          </div>

          <div className="p-4 bg-white rounded border border-slate-200 shadow-xs">
            <div className="text-3xl font-extrabold text-[#1E40AF] font-mono">Enabled</div>
            <span className="text-xs text-slate-600 font-semibold mt-1 block">Enterprise Security</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthcareStatsGrid;
