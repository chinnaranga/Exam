import React, { useState } from 'react';
import { FAQS } from '@/data/faqs';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#475569]">
            Everything you need to know about AI authoring, privacy-first proctoring, and onboarding.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm text-[#1E293B] hover:text-[#2563EB] transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 shrink-0 ml-4 ${
                    openIndex === idx ? 'rotate-180 text-[#2563EB]' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-xs text-[#475569] leading-relaxed border-t border-[#F1F5F9] pt-3 text-left">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
