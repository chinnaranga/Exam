import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BrandLogo from "@/shared/components/BrandLogo";
import { ShieldCheck, Sparkles, Building2, UserCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between p-6 font-sans">
      {/* Header Bar */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 border-b border-[#E2E8F0]">
        <Link to="/" className="flex items-center space-x-3">
          <BrandLogo size="md" variant="light" />
        </Link>
        <div className="flex items-center space-x-3">
          <Link to="/auth/login">
            <Button variant="outline" className="border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9] text-xs font-semibold">
              Sign In
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-semibold shadow-xs">
              Provision Tenant
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-6xl w-full mx-auto my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1E40AF] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AssessIQ — Enterprise AI Assessment Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Intelligent Assessments. Trusted Outcomes.
          </h1>

          <p className="text-[#475569] text-base leading-relaxed max-w-2xl">
            AssessIQ is the mission-critical Enterprise AI Assessment Operating System engineered for Universities, Government Examination Boards, and Global Corporate Enterprise.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              'Multi-Tenant Domain Isolation',
              'Argon2id & Dual Token Rotation',
              '15 Granular Role Permission Matrix',
              'Real-Time Live Proctor Streaming',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-2.5 text-xs text-[#475569]">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/auth/register">
              <Button size="lg" className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold px-8 py-6 shadow-xs">
                Start Enterprise Onboarding
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button size="lg" variant="outline" className="border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9] px-8 py-6">
                Institutional SSO Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Feature Card */}
        <div className="lg:col-span-5">
          <Card className="border-[#E2E8F0] p-8 shadow-xs bg-white space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-[#1E40AF]" />
                <h2 className="text-lg font-bold text-[#0F172A]">Identity Gateway Security</h2>
              </div>
              <span className="text-xs text-[#15803D] font-mono flex items-center font-bold">
                <span className="w-2 h-2 rounded-full bg-[#15803D] mr-1.5 animate-pulse" />
                SOC2 / GDPR Ready
              </span>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Super & Platform Admins', desc: 'Global telemetry, tenant limits & LLM gateways' },
                { title: 'Organization & Campus Deans', desc: 'Departmental scoping, user rosters & reporting' },
                { title: 'Faculty & Item Authors', desc: 'Item bank creation, blueprints & manual essay grading' },
                { title: 'Invigilators & Proctors', desc: 'Live multi-candidate video grids & anomaly logs' },
                { title: 'Students & Candidates', desc: 'Secure test-runner engine with auto-save buffers' },
              ].map((roleItem, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-[#1E40AF] text-xs font-bold font-mono mt-0.5">
                    0{i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-[#0F172A]">{roleItem.title}</h3>
                    <p className="text-[11px] text-[#475569] mt-0.5">{roleItem.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs text-[#64748B] py-4 border-t border-[#E2E8F0]">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <div className="flex space-x-4">
          <Link to="/auth/login" className="hover:text-[#0F172A]">Privacy Policy</Link>
          <Link to="/auth/login" className="hover:text-[#0F172A]">Security SLA</Link>
          <Link to="/auth/login" className="hover:text-[#0F172A]">Compliance Docs</Link>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
