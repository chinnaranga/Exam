import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '@/data/navigation';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export const LandingNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-6 lg:px-12 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shadow-xs group-hover:bg-[#1D4ED8] transition-colors">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1E293B]">
            Assess<span className="text-[#2563EB]">IQ</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-[#475569]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#2563EB] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            to="/auth"
            className="text-xs font-semibold text-[#475569] hover:text-[#2563EB] transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <a href="#demo">
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all">
              Book a Demo
            </Button>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#475569] hover:text-[#1E293B] focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Menu (White, Light Theme Only) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[61px] bg-white border-b border-[#E2E8F0] shadow-xl p-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-[#475569]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#2563EB] border-b border-[#F1F5F9]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 flex flex-col space-y-3">
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-semibold text-[#475569] hover:text-[#2563EB]"
            >
              Sign in
            </Link>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm py-2.5 rounded-xl shadow-md">
                Book a Demo
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
