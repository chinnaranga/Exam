import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Enterprise Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent Scaling for Institutions of Any Size
          </h2>
          <p className="text-base text-slate-600">
            Includes multi-tenant isolation, AI item authoring, and real-time proctoring engine.
          </p>

          {/* Annual Toggle */}
          <div className="pt-4 flex items-center justify-center space-x-3">
            <span className={`text-xs font-semibold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly Billing</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 bg-blue-600 rounded-full p-1 transition-colors relative"
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-semibold ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Annual Billing <span className="text-emerald-600 font-bold">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              name: 'Starter',
              price: isAnnual ? '$499' : '$599',
              desc: 'Ideal for small departments & single campus programs.',
              features: ['Up to 1,000 Candidates', 'AI Question Generator', 'Basic Remote Proctoring', 'Standard Analytics'],
              highlight: false,
            },
            {
              name: 'Professional',
              price: isAnnual ? '$1,499' : '$1,799',
              desc: 'For universities & growing certification providers.',
              features: ['Up to 10,000 Candidates', 'Full AI Proctoring Suite', 'Automated Essay & Code Scoring', 'Canvas / Moodle LMS Integration'],
              highlight: true,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              desc: 'For multi-campus universities & Fortune 500 firms.',
              features: ['Unlimited Candidates', 'Dedicated Multi-Tenant Isolation', 'Custom AI Fine-Tuning', '24/7 Dedicated SLA & Support'],
              highlight: false,
            },
            {
              name: 'Government',
              price: 'Custom',
              desc: 'High-security civil service examination boards.',
              features: ['Air-Gapped On-Premises Option', 'FedRAMP & SOC 2 Type II', 'Zero-Trust Lockout Engine', 'Cryptographic Audit Trail'],
              highlight: false,
            },
          ].map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl border flex flex-col justify-between transition-all ${
                plan.highlight
                  ? 'bg-white border-blue-600 shadow-xl ring-2 ring-blue-600/20'
                  : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              <div>
                {plan.highlight && (
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 inline-block mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{plan.desc}</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-xs text-slate-500 font-medium"> / month</span>}
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link to="/auth/register">
                  <Button
                    className={`w-full font-semibold text-xs py-2.5 ${
                      plan.highlight
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {plan.price === 'Custom' ? 'Contact Enterprise Sales' : 'Get Started'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
