import React, { useState } from 'react';
import CropMarks from '@/components/marks/CropMarks';
import StickerBadge from '@/components/marks/StickerBadge';
import MarginNote from '@/components/marks/MarginNote';
import { PRICING_TIERS } from '@/data/pricing';
import { FAQS } from '@/data/faqs';
import { Check, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Q7PricingFaq: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section
      id="q7-pricing"
      className="mx-3 sm:mx-6 my-4 sm:my-6 rounded-[40px] bg-white p-8 sm:p-14 lg:p-20 relative overflow-hidden border border-[#D4CEF0] shadow-[0_20px_50px_rgba(43,35,80,0.06)] text-left"
    >
      <CropMarks />

      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#2B2350] bg-[#EFF6FF] px-3.5 py-1.5 rounded-full border border-[#2B2350]/20 shadow-xs">
          Q7 / 08 · PLANS & ANSWERS
        </span>
        <StickerBadge color="lemon" rotate={3}>
          TEAR-OFF TICKETS
        </StickerBadge>
      </div>

      <div className="space-y-4 mb-10 text-center">
        <h2 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#2B2350] tracking-tight">
          Simple, transparent plans.
        </h2>
        <p className="font-body text-base text-[#6B6590] max-w-lg mx-auto font-medium">
          Start with a free pilot for your faculty, then scale when you're completely satisfied.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="pt-2 flex items-center justify-center space-x-3">
          <span className={`font-mono text-xs font-bold ${!isAnnual ? 'text-[#2B2350]' : 'text-[#6B6590]'}`}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle annual billing"
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
              isAnnual ? 'bg-[#6C4DFF]' : 'bg-[#CBD5E1]'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                isAnnual ? 'translate-x-6' : ''
              }`}
            />
          </button>
          <div className="flex items-center space-x-1.5">
            <span className={`font-mono text-xs font-bold ${isAnnual ? 'text-[#2B2350]' : 'text-[#6B6590]'}`}>
              Annual
            </span>
            <span className="text-[10px] font-mono font-bold text-[#2B2350] bg-[#FFF3A3] px-2 py-0.5 rounded-full border border-[#2B2350]">
              SAVES 20%
            </span>
          </div>
        </div>
      </div>

      {/* 3 Tear-Off Ticket Cards with Perforated Edges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
        {PRICING_TIERS.map((tier) => {
          const isGrowth = tier.isPopular;
          return (
            <div
              key={tier.id}
              className={`rounded-3xl p-7 border-2 border-[#2B2350] flex flex-col justify-between space-y-6 relative transition-all ${
                isGrowth
                  ? 'bg-[#C9CCFF] shadow-[8px_8px_0px_#2B2350]'
                  : 'bg-[#F8FAFC] shadow-[4px_4px_0px_#2B2350]'
              }`}
            >
              {/* Ticket Perforation Holes Styling */}
              <div className="absolute -left-3 top-1/3 w-5 h-5 rounded-full bg-white border-r-2 border-[#2B2350]" />
              <div className="absolute -right-3 top-1/3 w-5 h-5 rounded-full bg-white border-l-2 border-[#2B2350]" />

              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <StickerBadge color="lemon" rotate={-3}>
                    MOST POPULAR
                  </StickerBadge>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-heading text-2xl font-extrabold text-[#2B2350]">
                    {tier.name}
                  </h3>
                  <p className="font-body text-xs text-[#6B6590] mt-1">{tier.description}</p>
                </div>

                <div className="font-mono border-b-2 border-dashed border-[#2B2350]/20 pb-4">
                  <span className="text-3xl font-extrabold text-[#2B2350]">
                    {isAnnual ? tier.priceAnnual : tier.priceMonthly}
                  </span>
                  <span className="text-xs text-[#6B6590]"> {tier.billingPeriod}</span>
                </div>

                <ul className="text-xs font-body text-[#2B2350] space-y-2.5 pt-1">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#6C4DFF] shrink-0 mt-0.5 stroke-[3]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <a href="#q8-final">
                  <button
                    className={`w-full py-3 rounded-2xl font-mono font-bold text-xs transition-all shadow-xs flex items-center justify-center ${
                      isGrowth
                        ? 'bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white'
                        : 'bg-white hover:bg-[#F8FAFC] text-[#2B2350] border-2 border-[#2B2350]'
                    }`}
                  >
                    {tier.ctaLabel} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5-Question Accordion with Highlighter Pen Lemon Effect */}
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h3 className="font-heading text-3xl font-extrabold text-[#2B2350]">
            Frequently Asked Questions
          </h3>
          <p className="font-body text-xs text-[#6B6590]">
            Plain-English answers to questions from exam directors and university CIOs.
          </p>
        </div>

        <div className="space-y-3 font-body">
          {FAQS.slice(0, 5).map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border-2 border-[#2B2350] transition-all overflow-hidden ${
                  isOpen ? 'bg-[#FFF3A3] shadow-[4px_4px_0px_#2B2350]' : 'bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-heading font-bold text-base text-[#2B2350]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#2B2350] transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-xs text-[#2B2350] leading-relaxed border-t border-[#2B2350]/20 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Q7PricingFaq;
