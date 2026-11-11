import React from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_COLUMNS } from '@/data/navigation';
import { Sparkles, Linkedin, Twitter, Youtube } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0] py-16 px-6 sm:px-12 text-xs text-[#64748B] font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo + One-Line Description (Spans 2 cols) */}
          <div className="col-span-2 space-y-3.5">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1E293B]">
                Assess<span className="text-[#2563EB]">IQ</span>
              </span>
            </Link>
            <p className="text-xs text-[#475569] leading-relaxed max-w-sm">
              AI-powered online assessment platform helping universities, certification bodies, and training teams build,
              proctor, and grade exams in minutes.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-[#64748B]">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center hover:text-[#2563EB] hover:border-[#2563EB] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center hover:text-[#2563EB] hover:border-[#2563EB] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center hover:text-[#2563EB] hover:border-[#2563EB] transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 4 Link Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="space-y-3">
              <h5 className="font-mono text-xs font-bold uppercase text-[#1E293B] tracking-wider">
                {col.title}
              </h5>
              <ul className="space-y-2 text-xs text-[#475569]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-[#2563EB] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="border-t border-[#E2E8F0] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#64748B]">
          <p>© 2026 AssessIQ Inc. All rights reserved.</p>
          <div className="flex space-x-6 text-[#64748B]">
            <a href="#security" className="hover:text-[#2563EB]">
              Security
            </a>
            <span className="hover:text-[#2563EB] cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-[#2563EB] cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
