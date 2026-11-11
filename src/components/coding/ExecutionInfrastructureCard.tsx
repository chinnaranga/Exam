import React from 'react';
import { Card } from '@/components/ui/card';
import { InfrastructureStatus } from '@/types/codingDashboard';
import { Server, Cpu, Database, Wifi, CheckCircle2, AlertTriangle, Layers, Clock, ShieldCheck } from 'lucide-react';

interface Props {
  infra: InfrastructureStatus;
  isLoading?: boolean;
}

export const ExecutionInfrastructureCard: React.FC<Props> = ({ infra, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-8 bg-white border border-[#E2E8F0] rounded-2xl animate-pulse text-center">
        Loading judge infrastructure telemetry...
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider font-mono flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2 inline-block" />
          Section 5: Execution Infrastructure & Cluster Telemetry
        </h2>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          ALL 16 JUDGE NODES ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase">Judge Worker Cluster</span>
            <Server className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#0F172A]">
              {infra.judgeWorkersOnline} / {infra.totalJudgeWorkers} Workers
            </div>
            <div className="text-xs text-emerald-600 font-bold font-mono mt-0.5">
              100% Health Status
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-full" />
          </div>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase">Queue & Container Load</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#0F172A]">
              {infra.queueLength} Pending ({infra.runningContainers} Containers)
            </div>
            <div className="text-xs text-purple-600 font-bold font-mono mt-0.5">
              Avg Queue Latency: {infra.avgQueueTimeMs} ms
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${infra.executionCapacityPercentage}%` }} />
          </div>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase">CPU & Memory Utilization</span>
            <Cpu className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#0F172A]">
              {infra.cpuUsagePercentage}% CPU / {infra.memoryUsagePercentage}% RAM
            </div>
            <div className="text-xs text-amber-600 font-bold font-mono mt-0.5">
              Optimal Thermal Thresholds
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${infra.memoryUsagePercentage}%` }} />
          </div>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase">Persistence & WebSockets</span>
            <Wifi className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-[#64748B]">PostgreSQL Primary:</span>
              <span className="font-bold text-emerald-600">HEALTHY (5ms)</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#64748B]">Redis Queue:</span>
              <span className="font-bold text-emerald-600">HEALTHY (2ms)</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#64748B]">WebSocket Stream:</span>
              <span className="font-bold text-emerald-600">CONNECTED</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExecutionInfrastructureCard;
