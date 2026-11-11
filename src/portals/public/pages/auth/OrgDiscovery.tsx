import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BrandLogo from "@/shared/components/BrandLogo";
import { Search, Building2, ShieldCheck, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';

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
        toast.success('Organization Tenant Validated', {
          description: 'SAML 2.0 Identity Provider discovered.',
        });
      } else {
        setMatchedOrg({
          name: 'Enterprise Certified Tenant',
          domain: domain,
          ssoProvider: 'Okta Enterprise (OIDC)',
        });
        toast.success('Enterprise Tenant Discovered');
      }
    }, 600);
  };

  const handleProceedSSO = () => {
    toast.info('Redirecting to Single Sign-On IdP gateway...');
    setTimeout(() => {
      navigate('/auth/login');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] font-sans text-[#111827] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-6">
        <div className="flex justify-center">
          <BrandLogo size="lg" variant="light" />
        </div>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100">
            <Building2 className="w-3.5 h-3.5" />
            <span>Entra ID Domain Discovery</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Organization Discovery</h1>
          <p className="text-xs text-[#6B7280]">
            Enter your institutional email domain (e.g. <code>mit.edu</code>) to locate your Single Sign-On (SSO) gateway.
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-[#111827] uppercase font-medium">Institutional Domain or Email</Label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-3" />
              <Input
                type="text"
                placeholder="vance@mit.edu"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setMatchedOrg(null);
                }}
                className="bg-[#FAFBFC] border-[#E5E7EB] text-[#111827] text-xs pl-9"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-2.5 rounded-xl shadow-xs" disabled={isSearching}>
            {isSearching ? 'Discovering Tenant...' : 'Validate Organization'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {matchedOrg && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#111827] font-sans">{matchedOrg.name}</span>
              <span className="text-[10px] text-[#16A34A] font-bold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> VALIDATED
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280]">IdP Provider: {matchedOrg.ssoProvider}</p>
            <Button onClick={handleProceedSSO} className="w-full bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-lg">
              Sign In with Enterprise SSO
            </Button>
          </div>
        )}

        <div className="pt-4 border-t border-[#F1F5F9] text-center text-[11px] font-mono text-[#9CA3AF]">
          Protected by examify-vanguard Identity Platform
        </div>
      </Card>
    </div>
  );
};

export default OrgDiscovery;
