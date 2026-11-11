import React from 'react';
import { Activity, Server, ShieldAlert, CheckCircle2, Clock, Users, FileCheck, RefreshCw } from 'lucide-react';

export const HealthcareCommandCenterPreview: React.FC = () => {
  return (
    <section id="command-center" className="py-24 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-mono font-bold text-[#1E40AF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded border border-blue-200">
            Healthcare Command Center Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Institutional Examination Operations Center
          </h2>
          <p className="text-sm text-slate-600">
            Real-time telemetry and command center interface designed for zero-latency monitoring.
          </p>
        </div>

        {/* Full-width Operations Dashboard Box */}
        <div className="bg-slate-900 rounded border border-slate-800 shadow-2xl p-6 text-white space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 font-mono text-xs">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span className="font-bold text-white">GLOBAL OPS CONTROL TOWER — REGION: US-EAST-1</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <span>Cluster Health: <strong className="text-emerald-400">OPTIMAL</strong></span>
              <span>Active Proctors: <strong className="text-blue-400">24 On Duty</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Widget 1: Today's Examinations */}
            <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3 font-mono text-xs">
              <h4 className="text-slate-400 uppercase font-bold text-[11px]">Today's Scheduled Examinations</h4>
              <div className="space-y-2">
                {[
                  { title: 'CS-401 Algorithms Final', time: '09:00 - 11:00 EST', status: 'COMPLETED (482/482)', color: 'text-slate-400' },
                  { title: 'Clinical Diagnostic Licensing', time: '13:00 - 16:00 EST', status: 'IN PROGRESS (310)', color: 'text-emerald-400' },
                  { title: 'Civil Service Tier 1 Test', time: '17:00 - 19:00 EST', status: 'SCHEDULED (1,200)', color: 'text-blue-400' },
                ].map((item, i) => (
                  <div key={i} className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{item.title}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">{item.time}</span>
                      <span className={item.color}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2: Pending Reviews & Question Approvals */}
            <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3 font-mono text-xs">
              <h4 className="text-slate-400 uppercase font-bold text-[11px]">Item Authoring & Approval Queue</h4>
              <div className="space-y-2">
                {[
                  { code: 'Q-9481', dept: 'Medical Science', author: 'Dr. Vance', status: 'AI APPROVED' },
                  { code: 'Q-9482', dept: 'Computer Science', author: 'Prof. Miller', status: 'PENDING REVIEW' },
                  { code: 'Q-9483', dept: 'Electrical Eng', author: 'Dr. Zhang', status: 'APPROVED' },
                ].map((item, i) => (
                  <div key={i} className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center text-[11px]">
                    <div>
                      <span className="text-blue-400 font-bold">{item.code}</span>
                      <span className="text-slate-400 ml-2">({item.dept})</span>
                    </div>
                    <span className="text-slate-300 font-semibold">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Proctor Alerts & AI Violations */}
            <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3 font-mono text-xs">
              <h4 className="text-slate-400 uppercase font-bold text-[11px]">AI Proctor Anomaly Feeds</h4>
              <div className="space-y-2">
                {[
                  { time: '13:42:10', type: 'GAZE DISPLACEMENT', severity: 'LOW (0.12)', user: 'Candidate #8902' },
                  { time: '13:44:55', type: 'SECONDARY DISPLAY', severity: 'HIGH (0.89)', user: 'Candidate #3104' },
                  { time: '13:46:12', type: 'AUDIO FREQUENCY', severity: 'MEDIUM (0.45)', user: 'Candidate #5209' },
                ].map((alert, i) => (
                  <div key={i} className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                    <div className="flex justify-between font-bold text-amber-400">
                      <span>{alert.type}</span>
                      <span className="text-slate-400">{alert.time}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{alert.user}</span>
                      <span className="font-semibold text-slate-300">Score: {alert.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthcareCommandCenterPreview;
