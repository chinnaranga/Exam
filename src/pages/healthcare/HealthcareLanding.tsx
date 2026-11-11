import React from 'react';
import HealthcareNavbar from "@/shared/components/Navbar";
import HealthcareHero from './components/Hero';
import HealthcareStatsGrid from './components/StatsGrid';
import HealthcarePlatformCapabilities from './components/PlatformCapabilities';
import HealthcareCommandCenterPreview from './components/CommandCenterPreview';
import HealthcareSecurityCompliance from './components/SecurityCompliance';
import HealthcareAIWorkflow from './components/AIWorkflow';
import HealthcareExecutiveAnalytics from './components/ExecutiveAnalytics';
import HealthcareIndustrySolutions from './components/IndustrySolutions';
import HealthcareExecutiveTestimonials from './components/ExecutiveTestimonials';
import HealthcareFinalCTA from './components/FinalCTA';
import HealthcareFooter from './components/Footer';

export const HealthcareLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <HealthcareNavbar />
      <main>
        <HealthcareHero />
        <HealthcareStatsGrid />
        <HealthcarePlatformCapabilities />
        <HealthcareCommandCenterPreview />
        <HealthcareSecurityCompliance />
        <HealthcareAIWorkflow />
        <HealthcareExecutiveAnalytics />
        <HealthcareIndustrySolutions />
        <HealthcareExecutiveTestimonials />
        <HealthcareFinalCTA />
      </main>
      <HealthcareFooter />
    </div>
  );
};

export default HealthcareLanding;
