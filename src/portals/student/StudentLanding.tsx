import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BrandLogo from '@/components/BrandLogo';
import {
  UserCheck,
  BookOpen,
  Award,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Play,
  FileCheck,
  Briefcase,
  HelpCircle,
  ChevronDown,
  Lock,
  Globe,
  Star,
  GraduationCap,
  Brain,
  Laptop,
} from 'lucide-react';

export const StudentLanding: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does AssessIQ ensure secure exam delivery on student laptops?',
      a: 'AssessIQ utilizes client-side WebAssembly computer vision and lock-down browser policies that prevent screen switching, external display connections, and copy-pasting during live examinations.',
    },
    {
      q: 'What happens if my internet connection drops during an examination?',
      a: 'Our zero-distraction test runner includes built-in offline autosaving. All response vectors are encrypted and saved locally in IndexedDB, automatically syncing with server consensus as soon as connectivity restores.',
    },
    {
      q: 'How do digital certificates and transcript verification work?',
      a: 'Certificates issued by AssessIQ are cryptographically signed with SHA-256 hashes and stored on an immutable ledger, allowing employers and universities to instantly verify credentials.',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A] selection:bg-blue-100 selection:text-blue-900">
      {/* ================= 1. ENTERPRISE NAVIGATION ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3">
            <BrandLogo size="md" variant="light" />
          </Link>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-[#1E40AF] px-2.5 py-1 rounded-full border border-blue-200">
            Student & Candidate Portal
          </span>
        </div>

        <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-[#475569]">
          <a href="#features" className="hover:text-[#2563EB] transition-colors">Features</a>
          <a href="#journey" className="hover:text-[#2563EB] transition-colors">Student Journey</a>
          <a href="#modules" className="hover:text-[#2563EB] transition-colors">Modules</a>
          <a href="#security" className="hover:text-[#2563EB] transition-colors">Security</a>
          <a href="#faq" className="hover:text-[#2563EB] transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center space-x-3">
          <Link to="/student/login">
            <Button variant="outline" className="border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] font-bold text-xs px-4 py-2 rounded-xl">
              Student Sign In
            </Button>
          </Link>
          <Link to="/student/dashboard">
            <Button className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs">
              Open Student Portal
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* ================= 2. HERO & REALISTIC DASHBOARD PREVIEW ================= */}
        <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-20 px-6 sm:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#1E40AF] text-xs font-mono font-bold uppercase border border-blue-200">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span>Microsoft Education & Canvas LMS Enterprise Grade</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Student Examination & Assessment Platform
              </h1>

              <p className="text-[#475569] text-base leading-relaxed">
                Take high-stakes university examinations, industry certification tests, and placement assessments with offline autosave security and instant AI feedback.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/student/login">
                  <Button size="lg" className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs px-8 py-6 rounded-xl shadow-xs">
                    Student Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F1F5F9] font-bold text-xs px-8 py-6 rounded-xl">
                    Explore Platform Features
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Dashboard Mockup */}
            <div className="lg:col-span-6">
              <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl space-y-4 font-sans text-xs">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 font-mono">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[#1E40AF] text-white flex items-center justify-center font-bold text-xs">
                      E
                    </div>
                    <span className="font-bold text-[#0F172A] font-sans">Eleanor Vance</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    VERIFIED STUDENT
                  </span>
                </div>

                <div className="space-y-3 font-mono">
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex justify-between items-center font-sans">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#1E40AF]">CS-402 • COMPUTER SCIENCE</span>
                      <h4 className="font-bold text-sm text-[#0F172A]">Distributed Consensus Protocols</h4>
                      <p className="text-xs text-[#64748B] font-mono mt-0.5">Today 17:00 • 60 Mins • Offline Autosave Active</p>
                    </div>
                    <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-3 py-1.5 rounded-lg shrink-0">
                      <Play className="w-3.5 h-3.5 mr-1" />
                      Start Test
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex justify-between items-center font-sans">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#15803D]">COMPLETED • SCORE: 98.5%</span>
                      <h4 className="font-bold text-sm text-[#0F172A]">Advanced Algorithms & Data Structures</h4>
                    </div>
                    <span className="text-xs font-bold text-[#15803D] font-mono">PASSED (A+)</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ================= 3. PLATFORM STATISTICS ================= */}
        <section className="py-12 px-6 border-b border-[#E2E8F0] bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-center">
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-[#1E40AF]">2.4M+</div>
              <p className="text-xs text-[#64748B] font-sans font-semibold">Active Students</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-[#1E40AF]">540+</div>
              <p className="text-xs text-[#64748B] font-sans font-semibold">Global Universities</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-[#15803D]">18.9M</div>
              <p className="text-xs text-[#64748B] font-sans font-semibold">Assessments Completed</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-[#15803D]">99.8%</div>
              <p className="text-xs text-[#64748B] font-sans font-semibold">Student Satisfaction</p>
            </div>
          </div>
        </section>

        {/* ================= 4. STUDENT FEATURES ================= */}
        <section id="features" className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">Engineered for Student Academic Excellence</h2>
              <p className="text-xs text-[#475569] max-w-2xl mx-auto">
                Everything you need to prepare, execute, and verify your examination credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
              <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E40AF] flex items-center justify-center">
                  <Laptop className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">Offline Answer Autosave</h3>
                <p className="text-[#475569] leading-relaxed">
                  Never lose a test answer. Responses are stored locally in encrypted storage and auto-synced upon reconnecting.
                </p>
              </Card>

              <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803D] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">Verifiable Digital Badges</h3>
                <p className="text-[#475569] leading-relaxed">
                  Cryptographically signed transcripts and diplomas shareable directly on LinkedIn or with corporate recruiters.
                </p>
              </Card>

              <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">Instant AI Score Breakdown</h3>
                <p className="text-[#475569] leading-relaxed">
                  Receive detailed question-by-question explanations, IRT percentile ranks, and topic mastery recommendations.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* ================= 5. STUDENT JOURNEY ================= */}
        <section id="journey" className="py-20 px-6 sm:px-12 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">Student Academic Journey</h2>
              <p className="text-xs text-[#475569]">Seamless progression from registration to placement readiness.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#1E40AF]">01 • REGISTER</span>
                <p className="font-bold text-[#0F172A] font-sans">Single Sign-On</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#1E40AF]">02 • PRACTICE</span>
                <p className="font-bold text-[#0F172A] font-sans">AI Mock Exams</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#1E40AF]">03 • TEST</span>
                <p className="font-bold text-[#0F172A] font-sans">Secure Execution</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#15803D]">04 • CERTIFY</span>
                <p className="font-bold text-[#0F172A] font-sans">Career Placement</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 9. FAQ SECTION ================= */}
        <section id="faq" className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">Student Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3 text-xs">
              {faqs.map((faq, i) => (
                <Card key={i} className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="flex justify-between items-center font-bold text-sm text-[#0F172A]">
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === i ? 'rotate-180 text-[#1E40AF]' : 'text-[#64748B]'}`} />
                  </div>
                  {openFaq === i && (
                    <p className="text-[#475569] mt-3 leading-relaxed border-t border-[#E2E8F0] pt-3">
                      {faq.a}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ================= 10. ENTERPRISE FOOTER ================= */}
      <footer className="bg-white border-t border-[#E2E8F0] py-12 px-8 text-xs text-[#64748B] font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <BrandLogo size="md" variant="light" />
          <p>© 2026 AssessIQ Inc. All rights reserved. Microsoft Education & Canvas LMS Compatible.</p>
        </div>
      </footer>
    </div>
  );
};

export default StudentLanding;
