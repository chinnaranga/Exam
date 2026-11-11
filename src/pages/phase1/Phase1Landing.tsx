import React from 'react';
import AzureNavbar from './components/AzureNavbar';
import HeroExecutive from './components/HeroExecutive';
import EnterpriseTrustBar from './components/EnterpriseTrustBar';
import EnterpriseValueCards from './components/EnterpriseValueCards';
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
