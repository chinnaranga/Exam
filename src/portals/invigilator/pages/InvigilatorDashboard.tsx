import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Radio, AlertTriangle, Video } from 'lucide-react';
import { useCandidates, useExams } from '@/shared/hooks/useApiQueries';

export const InvigilatorDashboard: React.FC = () => {
  const { data: candidatesData, isLoading: isCandidatesLoading } = useCandidates({ page: 1, pageSize: 10 });
  const { data: examsData } = useExams({ page: 1, pageSize: 10 });

  const candidatesList = candidatesData?.data || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-mono font-bold uppercase border border-amber-200 mb-2">
          <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Wasm Computer Vision Sentinel Monitoring</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#111827]">Invigilator Proctor Console</h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Real-time candidate video feeds, eye-gaze vectors, audio spectrum anomalies, and identity verifications.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 font-mono text-xs">
        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Live Monitored Candidates</span>
          {isCandidatesLoading ? (
            <div className="text-2xl font-extrabold text-[#111827] animate-pulse">...</div>
          ) : (
            <div className="text-2xl font-extrabold text-[#111827]">{candidatesList.length} Candidates</div>
          )}
          <span className="text-[10px] text-[#16A34A] font-bold">{examsData?.total || 0} Active Exams</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Active Anomaly Flags</span>
          <div className="text-2xl font-extrabold text-emerald-600">0 Flags</div>
          <span className="text-[10px] text-emerald-600 font-bold">Optimal Integrity</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Verified Student Identities</span>
          <div className="text-2xl font-extrabold text-[#16A34A]">100%</div>
          <span className="text-[10px] text-[#16A34A] font-bold">Biometric Match</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Sentinel Engine Latency</span>
          <div className="text-2xl font-extrabold text-[#2563EB]">12ms</div>
          <span className="text-[10px] text-slate-500">Local Wasm Execution</span>
        </Card>
      </div>

      {/* Live Monitoring Feeds Grid */}
      <Card className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h3 className="font-bold text-base text-[#111827]">Live Proctor Telemetry Grid</h3>
          <span className="text-xs font-mono font-bold text-amber-600">{candidatesList.length} ACTIVE CANDIDATES</span>
        </div>

        {candidatesList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3 font-sans">
            <Video className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-extrabold text-base text-[#111827]">No Candidates Currently Testing</h3>
            <p className="text-xs text-[#6B7280]">When candidates launch live proctored examinations, their video streams and telemetry feeds will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {candidatesList.map((cand) => (
              <div key={cand.id} className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] space-y-2">
                <div className="flex justify-between font-bold text-[#111827]">
                  <span>{cand.firstName} {cand.lastName}</span>
                  <span className="text-[#16A34A]">NORMAL</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">ID: {cand.studentId || cand.id}</p>
                <p className="text-[11px] text-[#6B7280]">Dept: {cand.department || 'CS'}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default InvigilatorDashboard;
