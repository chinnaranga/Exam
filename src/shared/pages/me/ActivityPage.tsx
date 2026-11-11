import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { UserCenterService, ActivityLogItem } from '@/server/identity/user_center.service';
import { Clock, ShieldCheck, Key, Laptop, Globe } from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const [logs] = useState<ActivityLogItem[]>(() => UserCenterService.getActivityLogs());

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
          <Clock className="w-3.5 h-3.5" />
          <span>SHA-256 Impervious Security Audit Ledger</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Account Security Activity</h1>
        <p className="text-xs text-[#6B7280]">
          Timeline of authentication events, session creations, password updates, and API key usages.
        </p>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {logs.map((log) => (
          <Card key={log.id} className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between font-sans">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-[#FAFBFC] border border-[#E5E7EB] text-[#2563EB]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#111827] font-mono">{log.action}</h4>
                <p className="text-[11px] text-[#6B7280]">Resource: {log.resource}</p>
              </div>
            </div>

            <div className="text-right font-mono text-[11px] text-[#6B7280]">
              <p>IP: {log.ipAddress}</p>
              <p>{new Date(log.timestamp).toLocaleString()}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityPage;
