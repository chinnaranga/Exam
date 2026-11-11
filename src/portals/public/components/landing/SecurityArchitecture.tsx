import React from 'react';
import { ShieldCheck, Lock, FileText, Server, Key, Eye } from 'lucide-react';

export const SecurityArchitecture: React.FC = () => {
  return (
    <section id="security" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Government-Grade Compliance & Zero Trust Security</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Enterprise Security Built to Exceed Global Institutional Standards
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              ExamifyPro protects candidate privacy, assessment IP, and institutional data with AES-256 encryption at rest, TLS 1.3 in transit, and multi-tenant Row-Level Security (RLS).
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { title: 'SOC 2 Type II Certified', desc: 'Audited security control infrastructure' },
                { title: 'ISO 27001 Certified', desc: 'International ISMS security standard' },
                { title: 'FERPA & GDPR Compliant', desc: 'Strict student data privacy protection' },
                { title: 'Zero-Trust Architecture', desc: 'Granular RBAC & MFA enforcement' },
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Architecture Visual Card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <Lock className="w-6 h-6 text-emerald-400" />
                  <h3 className="font-bold text-lg text-white">Security & Access Control Layer</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400">STATUS: ACTIVE</span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="flex justify-between text-blue-400 font-bold">
                    <span>[IDENTITY] SSO & MFA Authentication</span>
                    <span>OK</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">SAML 2.0 / OIDC / Google / Microsoft Azure AD</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="flex justify-between text-blue-400 font-bold">
                    <span>[TENANT ISOLATION] Row-Level Security</span>
                    <span>ENFORCED</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">PostgreSQL RLS policies prevent cross-organization queries</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="flex justify-between text-blue-400 font-bold">
                    <span>[AUDIT LOG] Immutable Append-Only Ledger</span>
                    <span>LOGGING</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">SHA-256 hashed audit events with correlation tracing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityArchitecture;
