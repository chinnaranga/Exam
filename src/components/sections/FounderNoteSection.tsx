import React from 'react';
import { FOUNDER_NOTE } from '@/data/founder';
import { HeartHandshake } from 'lucide-react';

export const FounderNoteSection: React.FC = () => {
  return (
    <section id="founder" className="py-20 px-6 sm:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-[#E2E8F0] p-8 sm:p-12 shadow-xs space-y-8 text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-200">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>{FOUNDER_NOTE.eyebrow}</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
          {FOUNDER_NOTE.title}
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-[#475569] leading-relaxed">
          {FOUNDER_NOTE.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Founder Signature Area */}
        <div className="pt-4 border-t border-[#E2E8F0] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563EB] border border-blue-200 flex items-center justify-center font-bold text-sm shrink-0">
            {FOUNDER_NOTE.avatarPlaceholder}
          </div>
          <div>
            <div className="font-bold text-sm text-[#1E293B]">{FOUNDER_NOTE.authorName}</div>
            <div className="text-xs text-[#2563EB] font-medium">{FOUNDER_NOTE.authorRole}</div>
            <div className="text-[11px] text-[#64748B] font-mono mt-0.5">
              {FOUNDER_NOTE.authorCredentials}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderNoteSection;

