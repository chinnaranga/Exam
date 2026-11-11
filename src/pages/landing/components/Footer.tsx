import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from "@/shared/components/BrandLogo";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <BrandLogo size="md" variant="dark" />
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Enterprise AI-powered examination & assessment platform trusted by universities, certification providers, and government examination boards worldwide.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (99.99% Uptime)</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">Platform</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="#platform" className="hover:text-white">Question Bank Engine</Link></li>
              <li><Link to="#platform" className="hover:text-white">AI Item Authoring</Link></li>
              <li><Link to="#platform" className="hover:text-white">Remote Proctoring</Link></li>
              <li><Link to="#platform" className="hover:text-white">Psychometric Analytics</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">Security & SLA</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="#security" className="hover:text-white">SOC 2 Type II Audits</Link></li>
              <li><Link to="#security" className="hover:text-white">FERPA & GDPR Privacy</Link></li>
              <li><Link to="#security" className="hover:text-white">ISO 27001 ISMS</Link></li>
              <li><Link to="#security" className="hover:text-white">Row-Level Security</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/auth/login" className="hover:text-white">About examify-vanguard</Link></li>
              <li><Link to="/auth/login" className="hover:text-white">Enterprise SLA</Link></li>
              <li><Link to="/auth/login" className="hover:text-white">Developer API Documentation</Link></li>
              <li><Link to="/auth/login" className="hover:text-white">Contact Enterprise Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <span>© 2026 examify-vanguard Enterprise Inc. All rights reserved.</span>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="#" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="#" className="hover:text-slate-300">Terms of Service</Link>
            <Link to="#" className="hover:text-slate-300">Security SLA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
