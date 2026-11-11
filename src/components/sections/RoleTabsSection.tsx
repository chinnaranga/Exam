import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROLE_TABS } from '@/data/features';
import { Button } from '@/shared/components/ui/button';
import { Check, ArrowRight, Laptop, UserCheck, Brain, Video, Server } from 'lucide-react';

export const RoleTabsSection: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>('students');
  const activeTab = ROLE_TABS.find((t) => t.id === activeTabId) || ROLE_TABS[0];

  const getRoleIcon = (id: string) => {
    switch (id) {
      case 'students':
        return <UserCheck className="w-4 h-4" />;
      case 'educators':
        return <Brain className="w-4 h-4" />;
      case 'invigilators':
        return <Video className="w-4 h-4" />;
      case 'administrators':
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  return (
    <section id="roles" className="py-20 px-6 sm:px-12 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
            <Laptop className="w-3.5 h-3.5" />
            <span>Tailored Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            Built Specifically for Every Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
            Intuitive, role-specific tools designed for candidates, professors, proctors, and administrators.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center">
          <div className="p-1 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] inline-flex flex-wrap gap-1">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                  activeTabId === tab.id
                    ? 'bg-white text-[#2563EB] shadow-xs border border-[#E2E8F0]'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {getRoleIcon(tab.id)}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Box */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-left">
            {/* Left Content */}
            <div className="space-y-5">
              <span className="text-[10px] font-mono font-bold uppercase text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                {activeTab.label} Experience
              </span>
              <h3 className="text-2xl font-bold text-[#1E293B]">
                {activeTab.headline}
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                {activeTab.description}
              </p>

              {/* 3 Benefit Bullets */}
              <ul className="space-y-2.5 pt-2 text-xs text-[#475569]">
                {activeTab.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3">
                <Link to={activeTab.demoUrl}>
                  <Button
                    variant="outline"
                    className="bg-white border border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] font-semibold text-xs py-2.5 px-5 rounded-xl transition-all"
                  >
                    Explore demo →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Light UI Mockup */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 text-xs font-mono">
                <span className="font-bold text-[#1E293B]">{activeTab.label} Dashboard View</span>
                <span className="text-[10px] text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  Status: Active
                </span>
              </div>
              <div className="space-y-2 text-xs text-[#475569]">
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="font-semibold text-[#1E293B]">Live Assessment Session: CS-401</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    Autosave synced · On-device verification active
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="font-semibold text-[#1E293B]">Recent Completed Exams</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    54 submissions evaluated against faculty rubrics
                  </div>
                </div>
              </div>
              <div className="text-[11px] font-mono text-[#2563EB] text-right">
                AssessIQ Clean UI · Sample View
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleTabsSection;

