import React from 'react';
import HealthcareNavbar from "@/shared/components/Navbar";
import HealthcareHero from '../components/healthcare/Hero';
import HealthcareStatsGrid from '../components/healthcare/StatsGrid';
import HealthcarePlatformCapabilities from '../components/healthcare/PlatformCapabilities';
import HealthcareCommandCenterPreview from '../components/healthcare/CommandCenterPreview';
import HealthcareSecurityCompliance from '../components/healthcare/SecurityCompliance';
import HealthcareAIWorkflow from '../components/healthcare/AIWorkflow';
import HealthcareExecutiveAnalytics from '../components/healthcare/ExecutiveAnalytics';
import HealthcareIndustrySolutions from '../components/healthcare/IndustrySolutions';
import HealthcareExecutiveTestimonials from '../components/healthcare/ExecutiveTestimonials';
import HealthcareFinalCTA from '../components/healthcare/FinalCTA';
import HealthcareFooter from '../components/healthcare/Footer';

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
