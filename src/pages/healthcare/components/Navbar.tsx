import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, ShieldCheck, ChevronDown, Menu, X, Lock } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export const HealthcareNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-xs py-3'
          : 'bg-white py-4 border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo - Healthcare Software Style */}
        <Link to="/healthcare" className="flex items-center space-x-3">
          <BrandLogo size="md" variant="light" />
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase border border-slate-200">
            Enterprise Health Tech
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold text-slate-700">
          <Link to="#modules" className="hover:text-[#1E40AF] transition-colors">Platform</Link>
          <Link to="#solutions" className="hover:text-[#1E40AF] transition-colors">Solutions</Link>
          <Link to="#command-center" className="hover:text-[#1E40AF] transition-colors">Operations Center</Link>
          <Link to="#ai-workflow" className="hover:text-[#1E40AF] transition-colors">AI Intelligence</Link>
          <Link to="#security" className="hover:text-[#1E40AF] transition-colors">Security & Compliance</Link>
          <Link to="#analytics" className="hover:text-[#1E40AF] transition-colors">Analytics</Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden lg:flex items-center space-x-3">
          <Link to="/auth/login">
            <Button variant="ghost" className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-4">
              Sign In
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button variant="outline" className="text-xs font-semibold border-slate-300 text-slate-800 hover:bg-slate-50 px-4">
              Contact Sales
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button className="bg-[#1E40AF] hover:bg-[#1d3999] text-white text-xs font-semibold px-5 shadow-xs">
              Request Demo
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-slate-600">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-6 space-y-4 text-xs font-semibold text-slate-800">
          <Link to="#modules" className="block">Platform Capabilities</Link>
          <Link to="#command-center" className="block">Operations Center</Link>
          <Link to="#security" className="block">Security & Governance</Link>
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <Link to="/auth/login"><Button variant="outline" className="w-full">Sign In</Button></Link>
            <Link to="/auth/register"><Button className="w-full bg-[#1E40AF] text-white">Request Demo</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default HealthcareNavbar;
