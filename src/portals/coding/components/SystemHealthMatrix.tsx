import React from 'react';
import { Card } from '@/components/ui/card';
import { SystemServiceHealth } from '@/portals/coding/types/codingDashboard';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Activity, Server, Cpu, Database, HardDrive, Zap } from 'lucide-react';

interface Props {
  services: SystemServiceHealth[];
  isLoading?: boolean;
}

export const SystemHealthMatrix: React.FC<Props> = ({ services, isLoading = false }) => {
  return (
    <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="font-extrabold text-sm text-[#0F172A] uppercase font-mono">
            Section 9: Core System Health & Service Matrix
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
          100% PLATFORM OPERATIONAL
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {isLoading ? (
          <div className="col-span-5 p-4 text-center text-slate-400 font-mono">Checking cluster health...</div>
        ) : (
          services.map((srv) => (
            <div key={srv.serviceId} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0F172A] truncate">{srv.name}</span>
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    srv.status === 'HEALTHY'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : srv.status === 'WARNING'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {srv.status}
                </span>
              </div>

              <div className="space-y-0.5 text-[10px] font-mono text-[#64748B]">
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="font-bold text-emerald-700">{srv.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="font-bold text-[#0F172A]">{srv.latencyMs} ms</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default SystemHealthMatrix;
