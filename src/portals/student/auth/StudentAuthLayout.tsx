import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from "@/shared/components/BrandLogo";
import { Card } from '@/components/ui/card';
import { ShieldCheck, GraduationCap } from 'lucide-react';

interface StudentAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const StudentAuthLayout: React.FC<StudentAuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] flex flex-col justify-between p-6">
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4 border-b border-[#E2E8F0]">
        <Link to="/student" className="flex items-center space-x-3">
          <BrandLogo size="md" variant="light" />
        </Link>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-[#1E40AF] px-2.5 py-1 rounded-full border border-blue-200">
          Student Portal Authentication
        </span>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <Card className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">{title}</h1>
            <p className="text-xs text-[#475569]">{subtitle}</p>
          </div>
          {children}
        </Card>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-[#64748B] py-4 border-t border-[#E2E8F0]">
        © 2026 AssessIQ Inc. Student Identity & Access Management.
      </footer>
    </div>
  );
};

export default StudentAuthLayout;
