import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Activity, Server } from 'lucide-react';

export const SuperAdminPlatform: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Production Cluster Health & Telemetry</h1>
        <p className="text-xs text-[#64748B] mt-1">Real-time Datadog and Cloudflare cluster metrics, API rates, and memory health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
        <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <span className="text-[#64748B] font-mono">Cluster API Requests / Sec</span>
          <div className="text-2xl font-extrabold text-[#1E40AF]">14,290 req/s</div>
          <span className="text-[10px] text-[#15803D] font-bold">LATENCY: 12ms</span>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminPlatform;
