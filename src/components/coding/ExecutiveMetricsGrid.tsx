import React from 'react';
import { Card } from '@/components/ui/card';
import { MetricCardData } from '@/types/codingDashboard';
import {
  BookOpen,
  FileText,
  CheckCircle,
  PlayCircle,
  Award,
  Code,
  Users,
  Send,
  Check,
  AlertTriangle,
  Clock,
  Cpu,
  TrendingUp,
  Terminal,
  Server,
  Layers,
} from 'lucide-react';

interface Props {
  metrics: MetricCardData[];
  isLoading?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  FileText,
  CheckCircle,
  PlayCircle,
  Award,
  Code,
  Users,
  Send,
  Check,
  AlertTriangle,
  Clock,
  Cpu,
  TrendingUp,
  Terminal,
  Server,
  Layers,
};

// Mini SVG Sparkline Component
const Sparkline: React.FC<{ data: number[]; isPositive: boolean }> = ({ data, isPositive }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const height = 24;
  const width = 64;
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / (max - min || 1)) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = isPositive ? '#16A34A' : '#DC2626';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const ExecutiveMetricsGrid: React.FC<Props> = ({ metrics, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
        {Array.from({ length: 16 }).map((_, i) => (
          <Card key={i} className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
            <div className="h-6 bg-slate-200 rounded w-1/2 mb-1" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider font-mono flex items-center">
          <span className="w-2 h-2 rounded-full bg-[#0F6CBD] mr-2 inline-block" />
          Section 1: Executive Operations Metrics
        </h2>
        <span className="text-[11px] text-[#64748B] font-mono">16 Core Telemetry Indicators</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3.5">
        {metrics.map((m) => {
          const IconComp = ICON_MAP[m.iconName] || Code;
          return (
            <Card
              key={m.id}
              className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-md transition-all space-y-2 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-tight leading-tight line-clamp-1">
                  {m.title}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[#0F6CBD] group-hover:bg-blue-50 transition-colors">
                  <IconComp className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="text-lg font-black text-[#0F172A] tracking-tight truncate">
                  {m.value}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`text-[10px] font-bold font-mono ${
                      m.isPositive ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {m.change}
                  </span>
                  <Sparkline data={m.sparkline} isPositive={m.isPositive} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExecutiveMetricsGrid;
