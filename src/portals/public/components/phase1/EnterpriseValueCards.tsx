import React from 'react';
import { Brain, ShieldCheck, Activity, CheckCircle2, Sparkles, Lock, Radio, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const EnterpriseValueCards: React.FC = () => {
  return (
    <section id="value-cards" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded border border-blue-200">
            Core Enterprise Pillars
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for High-Consequence Institutional Assessment
          </h2>
          <p className="text-sm text-slate-600">
            Built from the ground up for zero-trust compliance, AI item generation, and real-time operations.
          </p>
        </div>

        {/* 3-Column Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: AI Assessment Intelligence */}
          <div className="p-8 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#7C3AED] transition-all space-y-6 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] w-fit group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                <Brain className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded bg-purple-50 text-[#7C3AED] font-mono text-[11px] font-bold border border-purple-200 uppercase">
                AI Intelligence Core
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#7C3AED] transition-colors">
                AI Assessment Intelligence
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Construct rigorous, domain-balanced examinations using generative AI fine-tuned on Bloom's taxonomy and psychometric item response models.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <span>Generative AI Item Drafts & Distractor Validation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <span>IRT 3PL Model Difficulty & Discrimination Calibration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <span>Bloom's Taxonomy Cognitive Level 1-6 Alignment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <span>Automated Free-Form Essay & Sandboxed Code Scoring</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-[#7C3AED]">
              <span>LEARN MORE ABOUT AI</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Enterprise Governance */}
          <div className="p-8 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#2563EB] transition-all space-y-6 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-blue-50 text-[#2563EB] w-fit group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-[#2563EB] font-mono text-[11px] font-bold border border-blue-200 uppercase">
                Zero-Trust Security
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                Enterprise Governance & Security
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enforce multi-tenant Row-Level Security (RLS), granular RBAC/ABAC role permissions, and immutable SHA-256 audit trails.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span>PostgreSQL Row-Level Security (RLS) Tenant Boundaries</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span>Role-Based (RBAC) & Attribute-Based (ABAC) Policies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span>Peer Approval Workflows & Item Version Control</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span>Append-Only SHA-256 Audit Trail Ledger</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-[#2563EB]">
              <span>EXPLORE GOVERNANCE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Real-Time Operations */}
          <div className="p-8 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#06B6D4] transition-all space-y-6 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-cyan-50 text-[#06B6D4] w-fit group-hover:bg-[#06B6D4] group-hover:text-white transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded bg-cyan-50 text-[#06B6D4] font-mono text-[11px] font-bold border border-cyan-200 uppercase">
                Operations Tower
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#06B6D4] transition-colors">
                Real-Time Operations & Monitoring
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monitor thousands of concurrent candidates across multiple campuses with sub-50ms latency and Wasm computer vision proctoring.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06B6D4] shrink-0" />
                  <span>Live Candidate Status & Latency Monitoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06B6D4] shrink-0" />
                  <span>Wasm Computer Vision Proctor Anomaly Alerts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06B6D4] shrink-0" />
                  <span>IndexedDB Local Autosave & Offline Answer Buffering</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06B6D4] shrink-0" />
                  <span>Incident Response & Remote Proctor Interventions</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-[#06B6D4]">
              <span>VIEW OPS TOWER</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseValueCards;
