import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export const FinalCtaSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="demo" className="py-20 px-6 sm:px-12 bg-white">
      <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE]/40 to-[#F8FAFC] border border-[#BFDBFE] p-10 sm:p-16 text-center space-y-6 shadow-[0_16px_40px_rgba(37,99,235,0.06)]">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white text-[#2563EB] text-xs font-mono font-bold uppercase border border-[#BFDBFE] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Now Accepting 2027 Design Partners</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight">
          Ready to modernize your assessments?
        </h2>

        <p className="text-[#475569] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Join our design partner program and get free pilot access. We work closely with your faculty to launch your first exam in under 48 hours.
        </p>

        {/* Email Form */}
        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold max-w-md mx-auto flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Thank you! We will reach out to schedule your demo within one business day.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="Enter your institutional email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-[#CBD5E1] text-[#1E293B] text-xs rounded-xl px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] flex-1 shadow-xs"
            />
            <Button
              type="submit"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all shrink-0"
            >
              Book a Demo
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </form>
        )}

        <div className="pt-2 text-[11px] text-[#64748B] flex items-center justify-center space-x-4">
          <span>We reply within one business day</span>
          <span>•</span>
          <span>Free pilot for design partners</span>
          <span>•</span>
          <span>No credit card required</span>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;

