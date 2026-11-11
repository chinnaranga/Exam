import React from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import LandingNavbar from '@/components/layout/LandingNavbar';
import LandingFooter from '@/components/layout/LandingFooter';
import StickyMobileCTA from '@/components/layout/StickyMobileCTA';
import BackToTop from '@/components/layout/BackToTop';
import CookieNotice from '@/components/layout/CookieNotice';

import HeroSection from '@/components/sections/HeroSection';
import BuiltForSection from '@/components/sections/BuiltForSection';
import ProblemSolutionSection from '@/components/sections/ProblemSolutionSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import FeaturesBentoSection from '@/components/sections/FeaturesBentoSection';
import RoleTabsSection from '@/components/sections/RoleTabsSection';
import UseCasesSection from '@/components/sections/UseCasesSection';
import ResultsRoiSection from '@/components/sections/ResultsRoiSection';
import ComparisonTableSection from '@/components/sections/ComparisonTableSection';
import IntegrationsSection from '@/components/sections/IntegrationsSection';
import SecurityTrustSection from '@/components/sections/SecurityTrustSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FounderNoteSection from '@/components/sections/FounderNoteSection';
import PricingSection from '@/components/sections/PricingSection';
import FaqSection from '@/components/sections/FaqSection';
import FinalCtaSection from '@/components/sections/FinalCtaSection';

export const LightLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1E293B] selection:bg-[#EFF6FF] selection:text-[#2563EB] antialiased">
      {/* 0. Announcement Bar */}
      <AnnouncementBar />

      {/* 1. Sticky Navbar */}
      <LandingNavbar />

      <main>
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Built For Strip */}
        <BuiltForSection />

        {/* 4. Problem -> Solution (3 Before/After Cards) */}
        <ProblemSolutionSection />

        {/* 5. How It Works (4 Steps) */}
        <HowItWorksSection />

        {/* 6. Product Features Bento Grid */}
        <FeaturesBentoSection />

        {/* 7. Role-Based Experience Tabs */}
        <RoleTabsSection />

        {/* 8. Use Cases (4 Cards) */}
        <UseCasesSection />

        {/* 9. Results & ROI (Count-ups + Interactive Calculator) */}
        <ResultsRoiSection />

        {/* 10. Comparison Table */}
        <ComparisonTableSection />

        {/* 11. Integrations Stack */}
        <IntegrationsSection />

        {/* 12. Security & Trust Badges */}
        <SecurityTrustSection />

        {/* 13. Testimonials */}
        <TestimonialsSection />

        {/* 14. Founder Note */}
        <FounderNoteSection />

        {/* 15. Pricing (Monthly/Annual Toggle, 3 Tiers) */}
        <PricingSection />

        {/* 16. FAQ Accordion (6 Items) */}
        <FaqSection />

        {/* 17. Final CTA */}
        <FinalCtaSection />
      </main>

      {/* 18. Light Footer */}
      <LandingFooter />

      {/* Extras: Sticky Mobile CTA, Back to Top, Cookie Notice */}
      <StickyMobileCTA />
      <BackToTop />
      <CookieNotice />
    </div>
  );
};

export default LightLanding;
