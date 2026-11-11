import React from 'react';
import { SECURITY_ITEMS } from '@/data/security';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export const SecurityTrustSection: React.FC = () => {
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'active':
        return 'bg-emerald-50 text-[#10B981] border-emerald-200';
      case 'in-progress':
        return 'bg-blue-50 text-[#2563EB] border-blue-200';
      case 'roadmap':
      default:
        return 'bg-amber-50 text-[#D97706] border-amber-200';
    }
  };

  return (
    <section id="security" className="py-20 px-6 sm:px-12 bg-[#EFF6FF] border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white text-[#2563EB] text-xs font-mono font-bold uppercase border border-[#BFDBFE]">
            <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Honest Security & Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            Enterprise-Grade Protection for High-Stakes Tests
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
            We are transparent about our current certifications, roadmap milestones, and daily security practices.
          </p>
        </div>

        {/* Badge Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {SECURITY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                      item.statusType
                    )}`}
                  >
                    {item.statusBadge}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#1E293B]">{item.title}</h3>
                <p className="text-xs text-[#475569] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA: Request Security Overview */}
        <div className="pt-2 text-center">
          <a href="#demo">
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all">
              Request Security Overview
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SecurityTrustSection;
