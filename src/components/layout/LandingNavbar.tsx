import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-4 z-50 px-4 sm:px-6 max-w-6xl mx-auto transition-all duration-300">
      <nav
        className={`bg-white/95 backdrop-blur-md border border-[#D4CEF0] rounded-2xl shadow-[0_8px_30px_rgba(108,77,255,0.08)] px-5 py-3 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'py-2.5 shadow-[0_12px_35px_rgba(108,77,255,0.12)]' : 'py-3.5'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#6C4DFF] text-white flex items-center justify-center shadow-xs group-hover:bg-[#5A3DEB] transition-colors">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight text-[#2B2350]">
            Assess<span className="text-[#6C4DFF]">IQ</span>
          </span>
        </Link>

        {/* 4 Links */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-mono font-bold tracking-wider text-[#6B6590]">
          <a href="#q2-problem" className="hover:text-[#6C4DFF] transition-colors">
            THE PROBLEM
          </a>
          <a href="#q3-what-it-does" className="hover:text-[#6C4DFF] transition-colors">
            FEATURES
          </a>
          <a href="#q4-how-it-works" className="hover:text-[#6C4DFF] transition-colors">
            HOW IT WORKS
          </a>
          <a href="#q7-pricing" className="hover:text-[#6C4DFF] transition-colors">
            PRICING
          </a>
        </div>

        {/* Right side: Sign in + Book a Demo violet button */}
        <div className="hidden sm:flex items-center space-x-4">
          <Link
            to="/auth"
            className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors px-2 py-1"
          >
            SIGN IN
          </Link>
          <a href="#q8-final">
            <button className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] hover:shadow-[0_6px_20px_rgba(108,77,255,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0">
              BOOK A DEMO
            </button>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-[#2B2350] hover:text-[#6C4DFF]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Over (Light only) */}
      {mobileOpen && (
        <div className="md:hidden mt-2 bg-white border border-[#D4CEF0] rounded-2xl shadow-xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3 font-mono text-xs font-bold text-[#2B2350]">
            <a
              href="#q2-problem"
              onClick={() => setMobileOpen(false)}
              className="py-1.5 hover:text-[#6C4DFF]"
            >
              THE PROBLEM
            </a>
            <a
              href="#q3-what-it-does"
              onClick={() => setMobileOpen(false)}
              className="py-1.5 hover:text-[#6C4DFF]"
            >
              FEATURES
            </a>
            <a
              href="#q4-how-it-works"
              onClick={() => setMobileOpen(false)}
              className="py-1.5 hover:text-[#6C4DFF]"
            >
              HOW IT WORKS
            </a>
            <a
              href="#q7-pricing"
              onClick={() => setMobileOpen(false)}
              className="py-1.5 hover:text-[#6C4DFF]"
            >
              PRICING
            </a>
          </div>
          <div className="pt-2 border-t border-[#E2E8F0] flex flex-col space-y-2">
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="text-center py-2 text-xs font-mono font-bold text-[#6B6590]"
            >
              SIGN IN
            </Link>
            <a href="#q8-final" onClick={() => setMobileOpen(false)}>
              <button className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center">
                BOOK A DEMO <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingNavbar;
