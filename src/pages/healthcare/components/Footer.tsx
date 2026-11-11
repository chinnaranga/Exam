import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export const HealthcareFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 font-mono text-xs py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-3 font-sans">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-[#1E40AF] text-white flex items-center justify-center font-bold text-xs">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">ExamifyPro</span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Mission-critical enterprise assessment management platform trusted by universities, healthcare systems, and government examination boards.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CLUSTER STATUS: HEALTHY (99.99% UPTIME)</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Capabilities</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="#modules" className="hover:text-white">Question Bank Engine</Link></li>
              <li><Link to="#modules" className="hover:text-white">AI Proctoring Sentinel</Link></li>
              <li><Link to="#modules" className="hover:text-white">Item Response Theory</Link></li>
              <li><Link to="#modules" className="hover:text-white">Psychometrics</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Compliance</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="#security" className="hover:text-white">SOC 2 Type II</Link></li>
              <li><Link to="#security" className="hover:text-white">ISO 27001 ISMS</Link></li>
              <li><Link to="#security" className="hover:text-white">FERPA & HIPAA</Link></li>
              <li><Link to="#security" className="hover:text-white">Row-Level Security</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/auth/login" className="hover:text-white">Enterprise SLA</Link></li>
              <li><Link to="/auth/login" className="hover:text-white">API Documentation</Link></li>
              <li><Link to="/auth/login" className="hover:text-white">Status Page</Link></li>
              <li><Link to="/auth/login" className="hover:text-white">Support Center</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <span>© 2026 ExamifyPro Health-Tech Systems Inc. All rights reserved.</span>
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

export default HealthcareFooter;
