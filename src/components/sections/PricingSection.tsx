import React, { useState } from 'react';
import { PRICING_TIERS, PRICING_ANNUAL_DISCOUNT_TEXT } from '@/data/pricing';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-20 px-6 sm:px-12 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
            <span>Simple, Honest Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            Transparent Plans for Every Stage
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-lg mx-auto">
            Choose a plan that fits your testing volume. Switch between monthly or annual billing anytime.
          </p>

          {/* Toggle */}
          <div className="pt-2 flex items-center justify-center space-x-3">
            <span className={`text-xs font-semibold ${!isAnnual ? 'text-[#1E293B]' : 'text-[#64748B]'}`}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle annual billing"
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                isAnnual ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  isAnnual ? 'translate-x-6' : ''
                }`}
              />
            </button>
            <div className="flex items-center space-x-1.5">
              <span className={`text-xs font-semibold ${isAnnual ? 'text-[#1E293B]' : 'text-[#64748B]'}`}>
                Annual
              </span>
              <span className="text-[10px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                SAVE 20%
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#64748B] font-mono">
            {PRICING_ANNUAL_DISCOUNT_TEXT}
          </div>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch text-left">
          {PRICING_TIERS.map((tier) => {
            const isGrowth = tier.isPopular;
            return (
              <div
                key={tier.id}
                className={`bg-white rounded-2xl p-7 flex flex-col justify-between space-y-6 relative transition-all ${
                  isGrowth
                    ? 'border-2 border-[#2563EB] shadow-[0_12px_35px_rgba(37,99,235,0.12)]'
                    : 'border border-[#E2E8F0] shadow-xs hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)]'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full shadow-xs">
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-[#1E293B]">{tier.name}</h3>
                    <p className="text-xs text-[#64748B] mt-1">{tier.description}</p>
                  </div>

                  <div className="font-mono">
                    <span className="text-3xl font-extrabold text-[#1E293B]">
                      {isAnnual ? tier.priceAnnual : tier.priceMonthly}
                    </span>
                    <span className="text-xs text-[#64748B]"> {tier.billingPeriod}</span>
                  </div>

                  <ul className="text-xs text-[#475569] space-y-2.5 pt-2 border-t border-[#E2E8F0]">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a href={tier.ctaHref} className="pt-2">
                  <Button
                    variant={isGrowth ? 'default' : 'outline'}
                    className={`w-full text-xs font-semibold py-2.5 rounded-xl transition-all ${
                      isGrowth
                        ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-[0_4px_14px_rgba(37,99,235,0.25)]'
                        : 'bg-white border border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF]'
                    }`}
                  >
                    {tier.ctaLabel}
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
