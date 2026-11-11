import React from 'react';
import { TESTIMONIALS, TESTIMONIALS_NOTE } from '@/data/testimonials';
import { Star, MessageSquare } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 px-6 sm:px-12 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Early Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            What Design Partners Are Saying
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
            {TESTIMONIALS_NOTE}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-5 hover:shadow-[0_8px_30px_rgba(37,99,235,0.06)] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-[#F59E0B]">
                  {[...Array(t.starRating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-xs text-[#475569] italic leading-relaxed">
                  {t.quote}
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-[#E2E8F0]">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0">
                  {t.avatarText}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-[#1E293B] truncate">{t.name}</h4>
                  <p className="text-[11px] text-[#64748B] truncate">{t.role}</p>
                  <p className="text-[10px] text-[#94A3B8] font-mono truncate">{t.institution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

