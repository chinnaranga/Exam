import React from 'react';
import { ShieldCheck, Lock, Key, Server, FileText, Eye } from 'lucide-react';

export const HealthcareSecurityCompliance: React.FC = () => {
  return (
    <section id="security" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
              Government & Health-Tech Security Standard
            </span>

            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Enterprise Governance, Zero-Trust Access & Regulatory Compliance
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              ExamifyPro protects institutional IP and candidate privacy with AES-256 data encryption, SAML 2.0 / OAuth2 SSO integration, and PostgreSQL Row-Level Security (RLS).
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded border border-slate-200">
                <h4 className="font-bold text-slate-900">SOC 2 Type II Certified</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">Audited operational security</p>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded border border-slate-200">
                <h4 className="font-bold text-slate-900">ISO 27001 Certified</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">Information security management</p>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded border border-slate-200">
                <h4 className="font-bold text-slate-900">FERPA & HIPAA Compliant</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">Student & health data privacy</p>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded border border-slate-200">
                <h4 className="font-bold text-slate-900">GDPR Compliant</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">EU data processing rules</p>
              </div>
            </div>
          </div>

          {/* Security Architecture Diagram Mock */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 text-white p-6 rounded border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white">SECURITY ARCHITECTURE PIPELINE</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">ZERO-TRUST ENFORCED</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-blue-400 font-bold">1. AUTHENTICATION LAYER</span>
                    <p className="text-[11px] text-slate-400">SAML 2.0 / Okta / Azure AD / TOTP MFA</p>
                  </div>
                  <span className="text-emerald-400 font-bold text-[11px]">VERIFIED</span>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-blue-400 font-bold">2. TENANT BOUNDARY LAYER</span>
                    <p className="text-[11px] text-slate-400">Row-Level Security (RLS) & Subdomain Discriminators</p>
                  </div>
                  <span className="text-emerald-400 font-bold text-[11px]">ISOLATED</span>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-blue-400 font-bold">3. AUDIT ENGINE</span>
                    <p className="text-[11px] text-slate-400">Append-Only SHA-256 Hashed Log Ledger</p>
                  </div>
                  <span className="text-emerald-400 font-bold text-[11px]">LOGGING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthcareSecurityCompliance;
