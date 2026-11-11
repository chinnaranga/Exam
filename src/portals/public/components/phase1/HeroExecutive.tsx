import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Activity,
  Brain,
  AlertTriangle,
  Users,
  Radio,
  FileCheck,
  BarChart2,
  Server,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroExecutive: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'generator' | 'proctor' | 'audit'>('live');

  return (
    <section className="relative min-h-screen pt-28 pb-20 bg-[#0B1020] text-white overflow-hidden border-b border-slate-800">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-140px)]">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Next-Gen Enterprise Assessment Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Enterprise AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Examination Platform
              </span>
            </h1>

            <h2 className="text-lg sm:text-xl font-medium text-slate-300 leading-relaxed">
              Deliver secure, scalable, AI-powered assessments for universities, enterprises, certification providers, and government organizations.
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              ExamifyPro replaces legacy testing software with a unified, high-consequence assessment engine featuring AI-assisted question generation, Item Response Theory (IRT) difficulty calibration, real-time proctoring telemetry, automated essay scoring, and zero-trust data isolation.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link to="/auth/register">
                <Button size="lg" className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-xs px-8 py-6 rounded shadow-lg shadow-blue-500/20">
                  Request Enterprise Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="#value-cards">
                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 font-bold text-xs px-8 py-6 rounded">
                  Explore Platform
                </Button>
              </Link>
            </div>

            {/* Below CTAs Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-6">
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>SOC 2 Ready</span>
              </span>
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>ISO 27001 Ready</span>
              </span>
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>FERPA</span>
              </span>
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>GDPR</span>
              </span>
              <span className="flex items-center space-x-1.5 text-blue-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>99.99% SLA Uptime</span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN — REALISTIC EXECUTIVE OPERATIONS DASHBOARD PREVIEW */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs text-white">
              {/* Dashboard Window Header */}
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-slate-400 text-[11px] font-bold">OPS CONTROL CENTER — LIVE SESSION MONITOR</span>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab('live')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      activeTab === 'live' ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Live Ops
                  </button>
                  <button
                    onClick={() => setActiveTab('generator')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      activeTab === 'generator' ? 'bg-[#7C3AED] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AI Generator
                  </button>
                  <button
                    onClick={() => setActiveTab('proctor')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      activeTab === 'proctor' ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Proctor Feed
                  </button>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      activeTab === 'audit' ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Audit Ledger
                  </button>
                </div>
              </div>

              {/* Dashboard Content Container */}
              <div className="p-5 space-y-4 bg-slate-900/90">
                {/* Metric Cards Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Active Candidates</span>
                    <div className="text-xl font-extrabold text-white">1,482</div>
                    <span className="text-[9px] text-emerald-400 flex items-center">
                      <Radio className="w-2.5 h-2.5 mr-1 animate-pulse" /> 14 Active Exams
                    </span>
                  </div>

                  <div className="p-3 rounded bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">AI Risk Anomaly</span>
                    <div className="text-xl font-extrabold text-emerald-400">0.14%</div>
                    <span className="text-[9px] text-slate-400">2 Incident Flags</span>
                  </div>

                  <div className="p-3 rounded bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">IRT Calibrated Items</span>
                    <div className="text-xl font-extrabold text-blue-400">140,290</div>
                    <span className="text-[9px] text-slate-400">Cronbach's α = 0.92</span>
                  </div>
                </div>

                {/* Tab Render: Live Ops */}
                {activeTab === 'live' && (
                  <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-2">
                    <div className="flex justify-between text-slate-400 text-[10px] border-b border-slate-800 pb-1.5 font-bold uppercase">
                      <span>SESSION ID</span>
                      <span>ORGANIZATION</span>
                      <span>EXAM</span>
                      <span>STATUS</span>
                    </div>

                    {[
                      { id: 'SESS-8901', org: 'MIT CS Dept', exam: 'CS101 Intro to Algorithms', status: 'LIVE (482/482)', color: 'text-emerald-400' },
                      { id: 'SESS-8902', org: 'Stanford Medicine', exam: 'Clinical Pharmacology', status: 'LIVE (310/310)', color: 'text-emerald-400' },
                      { id: 'SESS-8903', org: 'Civil Service Board', exam: 'Tier 1 Examination', status: 'FLAGGED (1)', color: 'text-amber-400' },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between text-[11px] py-1 border-b border-slate-900">
                        <span className="text-blue-400 font-bold">{row.id}</span>
                        <span className="text-slate-300">{row.org}</span>
                        <span className="text-slate-300">{row.exam}</span>
                        <span className={`font-bold ${row.color}`}>{row.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab Render: AI Question Generator */}
                {activeTab === 'generator' && (
                  <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-purple-400 text-[11px] font-bold">
                      <span className="flex items-center"><Brain className="w-3.5 h-3.5 mr-1" /> AI Bloom's Taxonomy Item Authoring</span>
                      <span className="text-slate-500">GPT-4o Assessment Fine-Tune</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                      <p className="text-blue-300 font-bold">Prompt: Generate Level-5 (Evaluate) Question for CS-401 Consensus Protocols</p>
                      <p className="text-slate-400 italic">"Compare Paxos vs Raft in network partitions with high latency..."</p>
                      <div className="flex justify-between text-[10px] text-emerald-400 font-mono pt-1">
                        <span>IRT Difficulty: 0.84</span>
                        <span>Discrimination (a): 1.42</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Render: Proctor Sentinel */}
                {activeTab === 'proctor' && (
                  <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-blue-400 text-[11px] font-bold">
                      <span>Wasm Computer Vision Proctor Telemetry</span>
                      <span className="text-emerald-400 font-bold">ACTIVE</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="p-2 rounded bg-slate-900 flex justify-between">
                        <span className="text-slate-300">Candidate #8901 Gaze Vector</span>
                        <span className="text-emerald-400 font-bold">NORMAL (0.02)</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 flex justify-between">
                        <span className="text-slate-300">Candidate #3104 Display Switch</span>
                        <span className="text-amber-400 font-bold">ALT-TAB DETECTED</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Render: Audit Ledger */}
                {activeTab === 'audit' && (
                  <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-1 text-[11px] font-mono">
                    <div className="text-slate-400 font-bold border-b border-slate-800 pb-1">SHA-256 IMPERVIOUS AUDIT LEDGER</div>
                    <p className="text-blue-400">[14:02:11 UTC] ITEM_CREATED: Q-9812 by Prof. Vance (MIT)</p>
                    <p className="text-emerald-400">[14:03:40 UTC] RLS_ENFORCED: Query isolated to Org: org_mit_01</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroExecutive;
