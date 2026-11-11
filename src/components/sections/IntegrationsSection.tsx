import React from 'react';
import { INTEGRATIONS } from '@/data/integrations';
import { Layers } from 'lucide-react';

export const IntegrationsSection: React.FC = () => {
  return (
    <section className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
            <Layers className="w-3.5 h-3.5" />
            <span>Ecosystem Connectivity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            Fits into Your Existing Stack
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
            Connect seamlessly with your institution's Learning Management System, single sign-on directory, and video tools.
          </p>
        </div>

        {/* Integration Chips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTEGRATIONS.map((tool) => (
            <div
              key={tool.name}
              className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-2 hover:border-[#2563EB] transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1E293B]">{tool.name}</span>
                {tool.status === 'Available' ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200">
                    Available
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#64748B] border border-[#CBD5E1]">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;

