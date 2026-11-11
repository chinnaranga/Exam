import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { CandidateActivityEvent } from '@/portals/coding/types/codingDashboard';
import { Activity, CheckCircle2, AlertTriangle, Send, Terminal, Clock, Save, RefreshCw } from 'lucide-react';

interface Props {
  activities: CandidateActivityEvent[];
  isLoading?: boolean;
}

export const CandidateActivityStream: React.FC<Props> = ({ activities, isLoading = false }) => {
  return (
    <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#0F6CBD] animate-pulse" />
          <h3 className="font-extrabold text-sm text-[#0F172A] uppercase font-mono">
            Section 8: Candidate Live Activity Stream
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
          REAL-TIME WEBSOCKET FEED
        </span>
      </div>

      <div className="space-y-3 font-sans text-xs">
        {isLoading ? (
          <div className="p-4 text-center text-slate-400 font-mono">Streaming live telemetry...</div>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3 hover:bg-blue-50/50 transition-colors">
              <div className="flex items-start space-x-3">
                <span
                  className={`mt-0.5 p-1 rounded-md text-white ${
                    act.eventType === 'SUBMITTED' || act.eventType === 'EXAM_SUBMITTED'
                      ? 'bg-emerald-600'
                      : act.eventType === 'COMPILE_FAILED'
                      ? 'bg-rose-600'
                      : act.eventType === 'EXECUTED'
                      ? 'bg-blue-600'
                      : act.eventType === 'LANG_CHANGED'
                      ? 'bg-purple-600'
                      : 'bg-slate-600'
                  }`}
                >
                  {act.eventType === 'SUBMITTED' || act.eventType === 'EXAM_SUBMITTED' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : act.eventType === 'COMPILE_FAILED' ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : act.eventType === 'EXECUTED' ? (
                    <Terminal className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </span>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#0F172A]">{act.candidateName}</span>
                    <span className="text-[10px] font-mono text-[#0F6CBD] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      {act.candidateId}
                    </span>
                    {act.language && (
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                        {act.language}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mt-0.5 text-[11px]">{act.details}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-400 font-medium shrink-0">
                {act.timestamp}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default CandidateActivityStream;
