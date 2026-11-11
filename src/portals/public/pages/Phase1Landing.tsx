import React from 'react';
import AzureNavbar from '../components/phase1/AzureNavbar';
import HeroExecutive from '../components/phase1/HeroExecutive';
import EnterpriseTrustBar from '../components/phase1/EnterpriseTrustBar';
import EnterpriseValueCards from '../components/phase1/EnterpriseValueCards';
import LandingFooter from '../landing/components/Footer';

export const Phase1Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <AzureNavbar />
      <main>
        <HeroExecutive />
        <EnterpriseTrustBar />
        <EnterpriseValueCards />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Phase1Landing;
