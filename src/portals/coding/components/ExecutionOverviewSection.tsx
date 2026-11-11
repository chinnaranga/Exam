import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Activity, Clock, Cpu, BarChart3, TrendingUp, Filter } from 'lucide-react';

export const ExecutionOverviewSection: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'custom'>('day');

  const hourlyData = [
    { hour: '00:00', count: 120, success: 110, fail: 10 },
    { hour: '04:00', count: 80, success: 75, fail: 5 },
    { hour: '08:00', count: 450, success: 410, fail: 40 },
    { hour: '12:00', count: 820, success: 740, fail: 80 },
    { hour: '16:00', count: 640, success: 580, fail: 60 },
    { hour: '20:00', count: 310, success: 285, fail: 25 },
  ];

  const maxCount = Math.max(...hourlyData.map(d => d.count));

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider font-mono flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-600 mr-2 inline-block" />
            Section 2: Execution Overview & Trends
          </h2>
        </div>

        {/* Time Filters */}
        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <span className="text-[10px] font-mono text-[#64748B] px-2 flex items-center">
            <Filter className="w-3 h-3 mr-1 text-slate-400" /> RANGE:
          </span>
          {(['day', 'week', 'month', 'custom'] as const).map((range) => (
            <Button
              key={range}
              onClick={() => setTimeRange(range)}
              variant="ghost"
              size="sm"
              className={`text-xs px-3 py-1 rounded-lg font-semibold capitalize cursor-pointer transition-all ${
                timeRange === range
                  ? 'bg-[#0F6CBD] text-white shadow-2xs font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
              }`}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Execution Trend Chart */}
        <Card className="lg:col-span-2 p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center">
                <BarChart3 className="w-4 h-4 mr-1.5 text-blue-600" />
                Submissions & Execution Volume ({timeRange.toUpperCase()})
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">Real-time candidate execution throughput across judge clusters</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              94.2% SUCCESS
            </span>
          </div>

          {/* Custom SVG / HTML Bar Visualizer */}
          <div className="pt-2 pb-4">
            <div className="h-44 flex items-end justify-between gap-4 px-2">
              {hourlyData.map((item, idx) => {
                const heightPercent = (item.count / maxCount) * 100;
                const successPercent = (item.success / item.count) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono text-slate-400 group-hover:text-blue-600 font-bold transition-colors">
                      {item.count}
                    </div>
                    <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end transition-all relative" style={{ height: `${heightPercent}%` }}>
                      <div
                        className="w-full bg-emerald-500 rounded-t-lg transition-all"
                        style={{ height: `${successPercent}%` }}
                      />
                      <div
                        className="w-full bg-rose-500"
                        style={{ height: `${100 - successPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#64748B] font-bold">
                      {item.hour}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center space-x-6 mt-4 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center space-x-1.5 font-medium text-[#64748B]">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Passed Executions</span>
              </div>
              <div className="flex items-center space-x-1.5 font-medium text-[#64748B]">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span>Runtime / Compile Errors</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Secondary Metrics & Latency Breakdown */}
        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center">
              <Activity className="w-4 h-4 mr-1.5 text-purple-600" />
              Runtime & Queue Health
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">Sandbox isolation performance metrics</p>
          </div>

          <div className="space-y-3.5 text-xs font-sans">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-blue-600" /> Avg Sandbox Startup</span>
                <span className="font-mono font-bold text-[#0F172A]">42 ms</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="flex items-center"><Cpu className="w-3.5 h-3.5 mr-1 text-purple-600" /> Container Memory Utilization</span>
                <span className="font-mono font-bold text-[#0F172A]">48.6%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '48.6%' }} />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Queue Drain Rate</span>
                <span className="font-mono font-bold text-emerald-700">120 submissions / sec</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExecutionOverviewSection;
