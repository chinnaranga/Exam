import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Globe, Moon, Sun, Shield, Layers, ChevronDown, Menu, X, Cpu } from 'lucide-react';
import BrandLogo from "@/shared/components/BrandLogo";

export const AzureNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

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
          ? 'bg-[#0B1020]/95 backdrop-blur-md border-b border-slate-800 shadow-md py-2.5'
          : 'bg-[#0B1020] py-3.5 border-b border-slate-800/80'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo & Azure Portal Style Identifier */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <BrandLogo size="md" variant="dark" />
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
              Azure Enterprise OS
            </span>
          </Link>

          {/* Search Box - Azure Portal Style */}
          <div className="hidden xl:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded px-3 py-1.5 w-64 text-xs text-slate-400 focus-within:border-blue-500 focus-within:text-white">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search platform, APIs, resources..."
              className="bg-transparent border-0 focus:outline-none w-full text-slate-200 placeholder-slate-500 text-xs font-mono"
            />
            <span className="text-[10px] font-mono text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">⌘K</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-300">
          <Link to="#platform" className="hover:text-white transition-colors">Platform</Link>
          <Link to="#solutions" className="hover:text-white transition-colors">Solutions</Link>
          <Link to="#ai" className="hover:text-white transition-colors flex items-center">
            <span>AI Intelligence</span>
            <span className="ml-1 text-[9px] font-mono font-bold text-[#7C3AED] bg-[#7C3AED]/10 px-1.5 py-0.5 rounded border border-[#7C3AED]/30 uppercase">v4.0</span>
          </Link>
          <Link to="#security" className="hover:text-white transition-colors">Security & Governance</Link>
          <Link to="#compliance" className="hover:text-white transition-colors">Compliance</Link>
          <Link to="#developers" className="hover:text-white transition-colors">Developers</Link>
          <Link to="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </nav>

        {/* Right: Actions, Theme & Utilities */}
        <div className="hidden lg:flex items-center space-x-3 font-mono text-xs">
          {/* Language Selector */}
          <button className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 flex items-center space-x-1" title="Language: English (US)">
            <Globe className="w-4 h-4" />
            <span className="text-[11px]">EN</span>
          </button>

          {/* Theme Toggle */}
          <button onClick={() => setIsDark(!isDark)} className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800" title="Toggle Theme">
            {isDark ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <Link to="/auth/login">
            <Button variant="ghost" className="text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 px-3">
              Sign In
            </Button>
          </Link>

          <Link to="/auth/register">
            <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 font-semibold text-xs px-3.5">
              Book Demo
            </Button>
          </Link>

          <Link to="/auth/register">
            <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-xs px-4 shadow-sm shadow-blue-500/20">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-300">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1020] border-b border-slate-800 p-6 space-y-4 text-xs font-semibold text-slate-300">
          <Link to="#platform" className="block py-1">Platform</Link>
          <Link to="#solutions" className="block py-1">Solutions</Link>
          <Link to="#ai" className="block py-1">AI Intelligence</Link>
          <Link to="#security" className="block py-1">Security</Link>
          <Link to="#pricing" className="block py-1">Pricing</Link>
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <Link to="/auth/login"><Button variant="outline" className="w-full text-slate-200">Sign In</Button></Link>
            <Link to="/auth/register"><Button className="w-full bg-[#2563EB] text-white">Get Started</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default AzureNavbar;
