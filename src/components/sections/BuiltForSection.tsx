import React from 'react';
import { BUILT_FOR_CHIPS, LOGO_PLACEHOLDERS } from '@/data/stats';
import {
  GraduationCap,
  Award,
  Activity,
  Building2,
  Users,
  ArrowRight,
} from 'lucide-react';

export const BuiltForSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-[#2563EB]" />;
      case 'Award':
        return <Award className="w-4 h-4 text-[#7C3AED]" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-[#10B981]" />;
      case 'Building2':
        return <Building2 className="w-4 h-4 text-[#D97706]" />;
      case 'Users':
      default:
        return <Users className="w-4 h-4 text-[#2563EB]" />;
    }
  };

  return (
    <section className="py-14 px-6 border-b border-[#E2E8F0] bg-white text-center">
      <div className="max-w-6xl mx-auto space-y-6">
        <p className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
          Built for teams that run high-stakes exams
        </p>

        {/* Chips with icons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {BUILT_FOR_CHIPS.map((chip) => (
            <div
              key={chip.label}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] shadow-xs"
            >
              {getIcon(chip.icon)}
              <span>{chip.label}</span>
            </div>
          ))}
        </div>

        {/* Dashed placeholder row {{CUSTOMER_LOGO}} x5 */}
        <div className="pt-4 border-t border-[#F1F5F9]">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {LOGO_PLACEHOLDERS.map((placeholder, idx) => (
              <div
                key={idx}
                className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-3 text-center text-[11px] font-mono text-[#64748B] bg-[#F8FAFC] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
              >
                {placeholder}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#64748B] mt-3">
            <a
              href="#demo"
              className="text-[#2563EB] font-semibold hover:underline inline-flex items-center"
            >
              Your logo here. Join our design partner program
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default BuiltForSection;
