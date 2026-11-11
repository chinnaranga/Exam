import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const InvigilatorIncidents: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Proctor Anomaly & Incident Violation Audit Logs</h1>
        <p className="text-xs text-[#64748B] mt-1">Timestamped WASM telemetry log of browser window switches, gaze deviations, and external displays.</p>
      </div>

      <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3 font-sans text-xs">
        <div className="flex items-center space-x-2 text-amber-800 font-bold">
          <AlertTriangle className="w-4 h-4" />
          <span>INC-9914: Gaze Deviation Exceeding Threshold</span>
        </div>
        <p className="text-[#64748B] font-mono">Candidate: Marcus Wright (STU-9012) • CS-402 Exam • Anomaly: Gaze 18° Left (4.2 seconds)</p>
      </Card>
    </div>
  );
};

export default InvigilatorIncidents;
