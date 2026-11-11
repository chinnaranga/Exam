import React from 'react';
import LandingNavbar from "@/shared/components/Navbar";
import LandingHero from '../components/landing/Hero';
import TrustStats from '../components/landing/TrustStats';
import EnterpriseFeatures from '../components/landing/EnterpriseFeatures';
import AIShowcase from '../components/landing/AIShowcase';
import SecurityArchitecture from '../components/landing/SecurityArchitecture';
import AnalyticsSection from '../components/landing/AnalyticsSection';
import IndustrySolutions from '../components/landing/IndustrySolutions';
import Testimonials from '../components/landing/Testimonials';
import PricingSection from '../components/landing/PricingSection';
import ResourcesSection from '../components/landing/ResourcesSection';
import FinalCTA from '../components/landing/FinalCTA';
import LandingFooter from '../components/landing/Footer';

export const EnterpriseLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <LandingNavbar />
      <main>
        {/* Section 1: Executive Hero */}
        <LandingHero />

        {/* Section 2: Enterprise Trust Bar */}
        <TrustStats />

        {/* Section 3: Enterprise Modular Features */}
        <EnterpriseFeatures />

        {/* Section 4: AI Intelligence Center */}
        <AIShowcase />

        {/* Section 5: Security Architecture & Compliance */}
        <SecurityArchitecture />

        {/* Section 6: Executive Analytics Command Center */}
        <AnalyticsSection />

        {/* Section 7: Sector Industry Solutions */}
        <IndustrySolutions />

        {/* Section 8: Customer Success Endorsements */}
        <Testimonials />

        {/* Section 9: Enterprise Tiered Pricing */}
        <PricingSection />

        {/* Section 10: Resources & Developer Documentation */}
        <ResourcesSection />

        {/* Section 11: Executive Final CTA */}
        <FinalCTA />
      </main>

      {/* Section 12: Enterprise 5-Column Footer */}
      <LandingFooter />
    </div>
  );
};

export default EnterpriseLanding;
