import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Users,
  Brain,
  CheckCircle2,
  Lock,
  BarChart2,
  FileSpreadsheet,
  Video,
  AlertTriangle,
  Play,
} from 'lucide-react';

export const LandingHero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'generator' | 'analytics'>('monitoring');

  return (
    <section className="relative pt-32 pb-20 bg-white overflow-hidden">
      {/* Background Subtle Mesh */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-50 to-white -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tag */}
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Enterprise Assessment Engine</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="mt-8 text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Enterprise AI Examination Platform for the <span className="text-blue-600">Modern Workforce</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
            Create, manage, secure, and analyze assessments using AI-powered workflows built for universities, enterprises, and certification providers.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]">
                Book a Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-base px-8 py-6 rounded-xl transition-all">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Micro Trust Points */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SOC 2 Type II & FERPA Certified</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>99.99% Guaranteed SLA</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero-Lag 100k Candidate Scale</span>
            </span>
          </div>
        </div>

        {/* Realistic Enterprise Dashboard Preview Mockup */}
        <div className="mt-16 relative mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
          {/* Mock Window Top Bar */}
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-4 font-mono text-xs text-slate-500">app.examifypro.com/organization/mit-main/monitoring</span>
            </div>

            {/* Interactive Tab Controller */}
            <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('monitoring')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'monitoring' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Live Proctor Grid
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'generator' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AI Item Generator
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Real-Time Telemetry
              </button>
            </div>
          </div>

          {/* Dashboard Canvas Area */}
          <div className="p-6 bg-slate-50 min-h-[480px]">
            {activeTab === 'monitoring' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Stats Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-medium">Active Candidates</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">1,482</div>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
                      <Activity className="w-3 h-3 mr-1 animate-pulse" /> 100% Concurrent Sync
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-medium">AI Integrity Score</span>
                    <div className="text-2xl font-extrabold text-emerald-600 mt-1">99.8%</div>
                    <span className="text-[11px] text-slate-500 mt-1">Zero Security Anomalies</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-medium">Active Proctors</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">18 Invigilators</div>
                    <span className="text-[11px] text-blue-600 mt-1 font-semibold">1:80 Candidate Ratio</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-medium">Avg Completion Time</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">42m 18s</div>
                    <span className="text-[11px] text-slate-500 mt-1">Target: 60m 00s</span>
                  </div>
                </div>

                {/* Candidate Video Stream Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Sarah Jenkins (ID #8942)', status: 'NORMAL', integrity: '99.9%', flag: false },
                    { name: 'David Chen (ID #3104)', status: 'FACE DETECTED', integrity: '100%', flag: false },
                    { name: 'Alex Rivera (ID #5209)', status: 'SECONDARY DISPLAY DETECTED', integrity: '84.2%', flag: true },
                  ].map((cand, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                      <div className="relative h-36 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
                        <Video className="w-8 h-8 text-slate-600" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white font-mono text-[10px]">
                          CAM_0{idx + 1} LIVE
                        </span>
                        {cand.flag && (
                          <span className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-amber-500/90 text-white font-semibold text-[10px] flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1 shrink-0" /> {cand.status}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">{cand.name}</span>
                        <span className={`font-mono font-bold ${cand.flag ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {cand.integrity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'generator' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">AI Item Authoring Studio — Bloom's Taxonomy Level 5</h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Model: GPT-4o Assessment Fine-Tuned
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs text-slate-800">
                  <p className="text-blue-600 font-bold">// Generated Item #Q-9481 (Computer Architecture)</p>
                  <p className="font-semibold text-slate-900">
                    "Analyze the memory hierarchy tradeoff between L1 cache latency and L3 cache capacity in modern multi-core RISC-V processors."
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600">
                    <div className="p-2 bg-white rounded border border-slate-200">A) L1 latency scales linearly with cache line size</div>
                    <div className="p-2 bg-emerald-50 rounded border border-emerald-300 font-bold text-emerald-900">B) L1 latency is optimized for single-cycle access via direct mapping [Correct]</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Psychometric Item Analysis & Difficulty Distribution</h3>
                  <span className="text-xs text-slate-500 font-mono">Sample Size: N = 15,480 candidates</span>
                </div>

                <div className="h-44 bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-end justify-between space-x-2">
                  {[35, 50, 75, 90, 100, 85, 60, 40, 20].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                      <div style={{ height: `${h}%` }} className="w-full bg-blue-600 rounded-t-md hover:bg-blue-700 transition-colors" />
                      <span className="text-[9px] font-mono text-slate-400">Bin {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
