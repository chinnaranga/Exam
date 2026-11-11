import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertTriangle,
  Users,
  Server,
  Radio,
  FileCheck,
  Clock,
} from 'lucide-react';

export const HealthcareHero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ops' | 'queue' | 'alerts'>('ops');

  return (
    <section className="relative pt-32 pb-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-semibold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-[#1E40AF]" />
            <span>Mission-Critical Institutional Assessment Software</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="mt-8 text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Enterprise Examination Platform Built for <span className="text-[#1E40AF]">Critical Assessments</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
            Deliver secure, AI-powered examinations with enterprise governance, compliance, real-time monitoring, and advanced analytics.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/register">
              <Button size="lg" className="bg-[#1E40AF] hover:bg-[#1d3999] text-white font-bold text-xs px-7 py-5 rounded shadow-xs">
                Request Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="#modules">
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-800 hover:bg-slate-50 font-bold text-xs px-7 py-5 rounded">
                Explore Platform
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-semibold font-mono">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>SOC 2 TYPE II / ISO 27001</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span>FERPA & HIPAA COMPLIANT</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-[#15803D]" />
              <span>ROW-LEVEL SECURITY (RLS)</span>
            </span>
          </div>
        </div>

        {/* Healthcare Operations Command Center Mockup */}
        <div className="mt-14 max-w-6xl mx-auto rounded bg-slate-900 border border-slate-800 shadow-2xl text-white overflow-hidden">
          {/* Top Command Center Status Bar */}
          <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>EXAM OPERATIONS CENTER — LIVE</span>
              </div>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Node: us-east-primary-cluster</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('ops')}
                className={`px-3 py-1 rounded text-[11px] font-bold ${
                  activeTab === 'ops' ? 'bg-[#1E40AF] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Live Metrics
              </button>
              <button
                onClick={() => setActiveTab('queue')}
                className={`px-3 py-1 rounded text-[11px] font-bold ${
                  activeTab === 'queue' ? 'bg-[#1E40AF] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Exam Queue
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`px-3 py-1 rounded text-[11px] font-bold ${
                  activeTab === 'alerts' ? 'bg-[#1E40AF] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                AI Risk Detection
              </button>
            </div>
          </div>

          {/* Operational Metrics Screen */}
          <div className="p-6 space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Live Exam Sessions</span>
                <div className="text-2xl font-bold text-white font-mono">14 Active</div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center">
                  <Activity className="w-3 h-3 mr-1" /> 1,482 Candidates
                </span>
              </div>

              <div className="p-4 rounded bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">AI Integrity Sentinel</span>
                <div className="text-2xl font-bold text-emerald-400 font-mono">99.86%</div>
                <span className="text-[10px] font-mono text-slate-400">0.14% Anomaly Flag Rate</span>
              </div>

              <div className="p-4 rounded bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Verified Question Bank</span>
                <div className="text-2xl font-bold text-white font-mono">140,290</div>
                <span className="text-[10px] font-mono text-blue-400">IRT Difficulty Calibrated</span>
              </div>

              <div className="p-4 rounded bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Cluster Uptime SLA</span>
                <div className="text-2xl font-bold text-emerald-400 font-mono">99.99%</div>
                <span className="text-[10px] font-mono text-slate-400">Latency: 14ms</span>
              </div>
            </div>

            {/* Live Activity & Risk Table */}
            <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800 uppercase">
                <span>Session ID</span>
                <span>Institution</span>
                <span>Exam Name</span>
                <span>Candidates</span>
                <span>Integrity Status</span>
              </div>

              {[
                { id: 'SESS-8902', org: 'MIT Dept of CS', exam: 'CS-401 Algorithms Final', count: '482', status: 'HEALTHY', color: 'text-emerald-400' },
                { id: 'SESS-8903', org: 'Stanford Medical School', exam: 'Clinical Diagnostic Exam', count: '310', status: 'HEALTHY', color: 'text-emerald-400' },
                { id: 'SESS-8904', org: 'National Nursing Board', exam: 'NCLEX Licensing Attempt', count: '690', status: 'FLAGGED (1)', color: 'text-amber-400' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-900 text-[11px]">
                  <span className="text-blue-400">{row.id}</span>
                  <span className="text-slate-300">{row.org}</span>
                  <span className="text-slate-300">{row.exam}</span>
                  <span className="text-slate-400">{row.count}</span>
                  <span className={`font-bold ${row.color}`}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthcareHero;
