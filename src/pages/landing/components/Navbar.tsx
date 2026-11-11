import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BrandLogo from "@/shared/components/BrandLogo";
import {
  ChevronDown,
  Shield,
  Sparkles,
  Cpu,
  BookOpen,
  Users,
  Building2,
  BarChart3,
  Lock,
  Globe,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-3'
          : 'bg-white py-5 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/landing" className="flex items-center space-x-3">
          <BrandLogo size="md" variant="light" />
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase border border-slate-200 font-mono">
            Enterprise AI
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('platform')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center space-x-1 hover:text-slate-900 py-2">
              <span>Platform</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {activeDropdown === 'platform' && (
              <div className="absolute top-full left-0 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Question Bank & Blueprint</h4>
                    <p className="text-[11px] text-slate-500">Multi-version items with Bloom's taxonomy</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <Cpu className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Assessment Engine</h4>
                    <p className="text-[11px] text-slate-500">High-throughput 100k candidate runtime</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Psychometric Analytics</h4>
                    <p className="text-[11px] text-slate-500">Item difficulty & point-biserial telemetry</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to="#ai" className="hover:text-slate-900 transition-colors flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Core</span>
          </Link>

          <Link to="#security" className="hover:text-slate-900 transition-colors flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <span>Security & Compliance</span>
          </Link>

          <Link to="#solutions" className="hover:text-slate-900 transition-colors">
            Solutions
          </Link>

          <Link to="#pricing" className="hover:text-slate-900 transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          <Link to="/auth/login">
            <Button variant="ghost" className="text-slate-700 hover:text-slate-900 text-xs font-semibold px-4">
              Sign In
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button variant="outline" className="border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-semibold px-4">
              Book Demo
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 shadow-sm shadow-blue-500/20">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4">
          <Link to="#platform" className="block text-sm font-semibold text-slate-800">Platform Overview</Link>
          <Link to="#ai" className="block text-sm font-semibold text-slate-800">AI Assessment Engine</Link>
          <Link to="#security" className="block text-sm font-semibold text-slate-800">Security & Compliance</Link>
          <Link to="#pricing" className="block text-sm font-semibold text-slate-800">Enterprise Pricing</Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            <Link to="/auth/login">
              <Button variant="outline" className="w-full justify-center">Sign In</Button>
            </Link>
            <Link to="/auth/register">
              <Button className="w-full bg-blue-600 text-white justify-center">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
