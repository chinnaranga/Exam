import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '@/components/BrandLogo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UserCheck,
  Brain,
  Video,
  Building2,
  Server,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Code,
} from 'lucide-react';

export const PortalSelection: React.FC = () => {
  const portals = [
    {
      id: 'student',
      title: 'Student Portal',
      subtitle: 'Zero-distraction examination runner, offline autosave & verified digital credentials.',
      path: '/student/login',
      icon: UserCheck,
      color: 'border-blue-200 hover:border-blue-400 bg-white',
      badgeBg: 'bg-blue-50 text-[#1E40AF]',
      badge: 'STUDENT ACCESS',
      features: ['Zero-Distraction Test Runner', 'Offline Autosave Engine', 'Instant AI Score Transcripts'],
    },
    {
      id: 'coding',
      title: 'Coding Platform',
      subtitle: 'Polyglot coding assessments, 14 execution runtimes, judge cluster telemetry & sandbox.',
      path: '/coding/login',
      icon: Code,
      color: 'border-indigo-200 hover:border-indigo-400 bg-white',
      badgeBg: 'bg-indigo-50 text-indigo-700',
      badge: 'CODING PLATFORM ACCESS',
      features: ['14 Polyglot Runtimes', '16 Online Judge Nodes', 'Live Execution Telemetry'],
    },
    {
      id: 'faculty',
      title: 'Faculty Portal',
      subtitle: 'AI item bank authoring, IRT calibration, essay rubric grading & exam blueprints.',
      path: '/faculty/login',
      icon: Brain,
      color: 'border-purple-200 hover:border-purple-400 bg-white',
      badgeBg: 'bg-purple-50 text-purple-700',
      badge: 'FACULTY ACCESS',
      features: ['AI Question Generator', 'Bloom\'s Taxonomy Blueprinting', 'IRT Difficulty Calibration'],
    },
    {
      id: 'invigilator',
      title: 'Invigilator Portal',
      subtitle: 'Real-time multi-candidate video grids, WASM computer vision gaze tracking & alerts.',
      path: '/invigilator/login',
      icon: Video,
      color: 'border-amber-200 hover:border-amber-400 bg-white',
      badgeBg: 'bg-amber-50 text-[#D97706]',
      badge: 'INVIGILATOR ACCESS',
      features: ['Live Candidate Grid', 'WASM Eye Gaze Detection', 'Instant Flag Incident Logs'],
    },
    {
      id: 'org-admin',
      title: 'Organization Admin',
      subtitle: 'Campus, department, program management, custom branding & role provisioning.',
      path: '/org-admin/login',
      icon: Building2,
      color: 'border-emerald-200 hover:border-emerald-400 bg-white',
      badgeBg: 'bg-emerald-50 text-[#15803D]',
      badge: 'ORG ADMIN ACCESS',
      features: ['Campus & Department Scoping', 'Roster Invitations', 'Organization Analytics'],
    },
    {
      id: 'super-admin',
      title: 'Super Admin Portal',
      subtitle: 'Global multi-tenant infrastructure control plane, RLS isolation & AI risk engine.',
      path: '/super-admin/login',
      icon: Server,
      color: 'border-slate-300 hover:border-slate-500 bg-white',
      badgeBg: 'bg-slate-100 text-[#0F172A]',
      badge: 'SUPER ADMIN ACCESS',
      features: ['Multi-Tenant Control Plane', 'RLS Row Level Security', 'Global AI Threat Radar'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFC] font-sans text-[#0F172A] flex flex-col justify-between p-6">
      {/* Navigation Header */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 border-b border-[#E2E8F0]">
        <Link to="/" className="flex items-center space-x-3">
          <BrandLogo size="md" variant="light" />
        </Link>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-[#1E40AF] px-3 py-1 rounded-full border border-blue-200">
          ENTERPRISE PORTAL GATEWAY
        </span>
      </header>

      {/* Hero Header */}
      <main className="max-w-6xl w-full mx-auto my-auto py-12 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-xs text-xs font-mono font-bold uppercase text-[#1E40AF]">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Select Your Dedicated Access Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            AssessIQ Enterprise Gateway
          </h1>

          <p className="text-xs sm:text-sm text-[#475569] max-w-2xl mx-auto">
            Choose your role to log into your specialized application environment. Sharing the same zero-trust identity backend.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <Card
                key={portal.id}
                className={`p-6 rounded-2xl border shadow-xs flex flex-col justify-between space-y-4 hover:shadow-lg transition-all ${portal.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${portal.badgeBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${portal.badgeBg}`}>
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#0F172A]">{portal.title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{portal.subtitle}</p>

                  <div className="pt-2 space-y-1.5 border-t border-[#E2E8F0]">
                    {portal.features.map((feat, idx) => (
                      <div key={idx} className="text-[11px] text-[#0F172A] font-medium flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF] mr-1.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link to={portal.path}>
                  <Button className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs">
                    Access Portal
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs text-[#64748B] py-4 border-t border-[#E2E8F0]">
        <span>© 2026 AssessIQ Inc. All rights reserved. SOC2 & ISO 27001 Certified Enterprise Platform.</span>
        <span>Oracle Health & Epic Systems Architecture Grade</span>
      </footer>
    </div>
  );
};

export default PortalSelection;
