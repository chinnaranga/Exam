import React from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import LandingNavbar from '@/components/layout/LandingNavbar';
import StickyMobileCTA from '@/components/layout/StickyMobileCTA';
import BackToTop from '@/components/layout/BackToTop';
import CookieNotice from '@/components/layout/CookieNotice';

import Q1Hero from '@/components/sections/Q1Hero';
import Q2Problem from '@/components/sections/Q2Problem';
import Q3WhatItDoes from '@/components/sections/Q3WhatItDoes';
import Q4HowItWorks from '@/components/sections/Q4HowItWorks';
import Q5WhoItsFor from '@/components/sections/Q5WhoItsFor';
import Q6TrustSecurity from '@/components/sections/Q6TrustSecurity';
import Q7PricingFaq from '@/components/sections/Q7PricingFaq';
import Q8FinalCtaFooter from '@/components/sections/Q8FinalCtaFooter';

export const LightLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent font-body text-[#2B2350] selection:bg-[#FFF3A3] selection:text-[#2B2350] antialiased pencil-cursor pb-12">
      {/* 0. Top Announcement Bar */}
      <AnnouncementBar />

      {/* Floating Condensed Navbar */}
      <LandingNavbar />

      <main className="max-w-[1300px] mx-auto pt-2 space-y-2">
        {/* Q1. Hero (Periwinkle Sheet #C9CCFF) */}
        <Q1Hero />

        {/* Perforated Divider */}
        <div className="mx-8 border-b-2 border-dashed border-[#2B2350]/15 my-2" />

        {/* Q2. The Problem (Lemon Sheet #FFF3A3) */}
        <Q2Problem />

        {/* Perforated Divider */}
        <div className="mx-8 border-b-2 border-dashed border-[#2B2350]/15 my-2" />

        {/* Q3. What It Does (White Sheet with Pastel Bento Tiles) */}
        <Q3WhatItDoes />

        {/* Perforated Divider */}
        <div className="mx-8 border-b-2 border-dashed border-[#2B2350]/15 my-2" />

        {/* Q4. How It Works (Mint Sheet #B8F0D2) */}
        <Q4HowItWorks />

        {/* Perforated Divider */}
        <div className="mx-8 border-b-2 border-dashed border-[#2B2350]/15 my-2" />

        {/* Q5. Who It's For (Coral Sheet #FFB5A7) */}
        <Q5WhoItsFor />

        {/* Perforated Divider */}
        <div className="mx-8 border-b-2 border-dashed border-[#2B2350]/15 my-2" />

        {/* Q6. Trust and Security (Sky Sheet #BFE6FF) */}
        <Q6TrustSecurity />

        {/* Perforated Divider */}
        <div className="mx-8 border-b-2 border-dashed border-[#2B2350]/15 my-2" />

        {/* Q7. Pricing and FAQ (White Sheet #FFFFFF) */}
        <Q7PricingFaq />

        {/* Perforated Divider */}
        <div className="mx-8 border-b-2 border-dashed border-[#2B2350]/15 my-2" />

        {/* Q8. Final CTA + Footer (Lemon Sheet #FFF3A3) */}
        <Q8FinalCtaFooter />
      </main>

      {/* Extras: Sticky Mobile CTA, Back to Top, Cookie Notice */}
      <StickyMobileCTA />
      <BackToTop />
      <CookieNotice />
    </div>
  );
};

export default LightLanding;
