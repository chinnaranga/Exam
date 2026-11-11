import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Brain } from 'lucide-react';

export const FacultyAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">IRT Calibration & Item Analytics</h1>
        <p className="text-xs text-[#64748B] mt-1">Item discrimination index, Bloom taxonomy distribution, and score curve analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <span className="text-[#64748B] font-mono">Mean Item Discrimination (a)</span>
          <div className="text-2xl font-extrabold text-purple-700">1.84</div>
          <span className="text-[10px] text-[#15803D] font-bold">EXCELLENT SEPARATION</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <span className="text-[#64748B] font-mono">Difficulty Parameter (b)</span>
          <div className="text-2xl font-extrabold text-[#0F172A]">+0.42</div>
          <span className="text-[10px] text-[#2563EB] font-bold">BALANCED COHORT</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <span className="text-[#64748B] font-mono">Pseudo-Guessing (c)</span>
          <div className="text-2xl font-extrabold text-[#15803D]">0.12</div>
          <span className="text-[10px] text-[#15803D] font-bold">LOW GUESSING RISK</span>
        </Card>
      </div>
    </div>
  );
};

export default FacultyAnalytics;
