import React from 'react';
import { BENTO_FEATURES } from '@/data/features';
import {
  Brain,
  Eye,
  FileCheck,
  Zap,
  Award,
  BarChart3,
  Database,
  Sparkles,
  Layers,
} from 'lucide-react';

export const FeaturesBentoSection: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'ai-authoring':
        return <Brain className="w-5 h-5 text-[#2563EB]" />;
      case 'smart-proctoring':
        return <Eye className="w-5 h-5 text-[#7C3AED]" />;
      case 'ai-essay-grading':
        return <FileCheck className="w-5 h-5 text-[#10B981]" />;
      case 'offline-autosave':
        return <Zap className="w-5 h-5 text-[#D97706]" />;
      case 'digital-badges':
        return <Award className="w-5 h-5 text-[#7C3AED]" />;
      case 'detailed-analytics':
        return <BarChart3 className="w-5 h-5 text-[#2563EB]" />;
      case 'multi-org-separation':
      default:
        return <Database className="w-5 h-5 text-[#10B981]" />;
    }
  };

  return (
    <section id="features" className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
            <Layers className="w-3.5 h-3.5" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            Engineered for Modern Examination Teams
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
            Everything you need to create, deliver, and evaluate assessments with high confidence.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BENTO_FEATURES.map((item) => {
            const isLarge = item.size === 'large';
            return (
              <div
                key={item.id}
                className={`${
                  isLarge ? 'md:col-span-2 p-8' : 'p-7'
                } rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all flex flex-col justify-between space-y-4 text-left`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                      {getIcon(item.id)}
                    </div>
                    {item.tag && (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#1E293B]">{item.title}</h3>
                    <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {item.metric && (
                  <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-mono text-[#1E40AF] flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{item.metric}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBentoSection;
