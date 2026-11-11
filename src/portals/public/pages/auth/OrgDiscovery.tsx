import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BrandLogo from "@/shared/components/BrandLogo";
import { Search, Building2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  RedCheck,
  RedCircle,
  CropMarks,
  MarginNote,
} from '@/components/marks';

export const OrgDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const [domain, setDomain] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [matchedOrg, setMatchedOrg] = useState<{ name: string; domain: string; ssoProvider: string } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) {
      toast.error('Enter an institutional email domain');
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      if (domain.toLowerCase().includes('mit') || domain.toLowerCase().includes('edu')) {
        setMatchedOrg({
          name: 'Massachusetts Institute of Technology',
          domain: domain,
          ssoProvider: 'Microsoft Azure AD (SAML 2.0)',
        });
        toast.success('Organization Discovered', {
          description: 'SAML 2.0 Identity Provider active.',
        });
      } else {
        setMatchedOrg({
          name: 'Global Assessment Institute',
          domain: domain,
          ssoProvider: 'Okta Enterprise (OIDC)',
        });
        toast.success('Enterprise Tenant Discovered');
      }
    }, 600);
  };

  const handleProceedSSO = () => {
    toast.info('Redirecting to Single Sign-On gateway...');
    setTimeout(() => {
      navigate('/auth/login');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white font-body text-[#2B2350] selection:bg-[#FFF3A3] selection:text-[#2B2350] antialiased pencil-cursor flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header Bar */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 border-b-2 border-dashed border-[#2B2350]/20">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#6C4DFF] text-white flex items-center justify-center shadow-xs group-hover:bg-[#5A3DEB] transition-colors">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight text-[#2B2350]">
            Assess<span className="text-[#6C4DFF]">IQ</span>
          </span>
        </Link>
        <Link
          to="/auth/login"
          className="text-xs font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] transition-colors"
        >
          ← BACK TO SIGN IN
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-md w-full mx-auto my-auto py-10">
        <div className="relative p-8 rounded-3xl bg-white border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] space-y-6">
          <CropMarks />

          <div className="border-b-2 border-dashed border-[#2B2350]/20 pb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFF3A3] text-[#2B2350] px-3 py-1 rounded-full border border-[#2B2350]">
              FORM 07 // DOMAIN DISCOVERY
            </span>
            <h1 className="font-heading text-2xl font-extrabold text-[#2B2350] mt-2">
              Find Your <span className="relative inline-block px-1">Campus<RedCircle className="scale-110" /></span>
            </h1>
            <p className="text-xs text-[#6B6590] font-body mt-1">
              Enter your institutional domain or email to locate your dedicated SSO portal.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="uppercase text-[#2B2350] text-[10px] font-bold tracking-wider">
                Institutional Domain
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#6B6590] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. harvard.edu or mit.edu"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-[#FFF3A3]/20 border-2 border-[#2B2350]/30 focus:border-[#6C4DFF] focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#2B2350] font-body outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-white border-2 border-[#2B2350] hover:bg-[#FFF3A3]/30 text-[#2B2350] font-mono font-bold text-xs py-3 rounded-2xl shadow-[3px_3px_0px_#2B2350] flex items-center justify-center space-x-2 transition-all"
            >
              <span>{isSearching ? 'SEARCHING DIRECTORY...' : 'LOOK UP INSTITUTION'}</span>
            </button>
          </form>

          {matchedOrg && (
            <div className="p-4 rounded-2xl bg-[#B8F0D2]/40 border-2 border-[#2B2350] space-y-3 font-mono text-xs">
              <div className="flex items-center space-x-2 text-[#2B2350]">
                <Building2 className="w-4 h-4 text-[#6C4DFF]" />
                <span className="font-heading font-extrabold text-sm">{matchedOrg.name}</span>
              </div>
              <p className="text-[11px] text-[#6B6590] font-body">
                Configured with: {matchedOrg.ssoProvider}
              </p>
              <button
                onClick={handleProceedSSO}
                className="w-full bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-2.5 rounded-xl shadow-[0_4px_12px_rgba(108,77,255,0.25)] flex items-center justify-center space-x-2 transition-all"
              >
                <span>PROCEED TO SSO GATEWAY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex justify-center">
            <MarginNote className="-rotate-2">instant lookup</MarginNote>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#6B6590] py-4 border-t-2 border-dashed border-[#2B2350]/20">
        <span>© 2026 AssessIQ Inc. All rights reserved.</span>
        <span>FORM 07 VERIFIED</span>
      </footer>
    </div>
  );
};

export default OrgDiscovery;
