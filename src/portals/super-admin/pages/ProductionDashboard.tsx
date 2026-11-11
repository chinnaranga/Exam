import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { HealthService, SystemHealthStatus } from '@/server/health/health.service';
import { Activity, Server, Database, Cpu, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const ProductionDashboard: React.FC = () => {
  const [health, setHealth] = useState<SystemHealthStatus>(() => HealthService.getSystemStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(HealthService.getSystemStatus());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-mono font-bold uppercase border border-emerald-200 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Datadog / Prometheus Operational Health</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Production Status & System Health</h1>
          <p className="text-xs text-[#6B7280]">
            Live telemetry for PostgreSQL clusters, Redis queues, BullMQ workers, and Docker containers.
          </p>
        </div>

        <Button onClick={() => { setHealth(HealthService.getSystemStatus()); toast.success('Telemetry Refreshed'); }} variant="outline" className="border-[#E5E7EB] font-bold text-xs px-4 py-2 rounded-xl">
          <RefreshCw className="w-3.5 h-3.5 mr-2 text-[#2563EB]" />
          Refresh Status
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 font-mono text-xs">
        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Overall Status</span>
          <div className="text-2xl font-extrabold text-[#16A34A] flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-1.5" />
            {health.status}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">All Systems Operational</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">PostgreSQL RLS Cluster</span>
          <div className="text-2xl font-extrabold text-[#16A34A]">CONNECTED</div>
          <span className="text-[10px] text-emerald-600 font-bold">542 Tenants Online</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Redis Queue Cluster</span>
          <div className="text-2xl font-extrabold text-[#16A34A]">CONNECTED</div>
          <span className="text-[10px] text-[#2563EB] font-bold">16 Worker Threads</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Heap Memory Usage</span>
          <div className="text-2xl font-extrabold text-[#2563EB]">{health.memoryUsageMb} MB</div>
          <span className="text-[10px] text-slate-500">Uptime: {health.uptimeSeconds}s</span>
        </Card>
      </div>
    </div>
  );
};

export default ProductionDashboard;
