import React from 'react';
import CropMarks from '@/components/marks/CropMarks';
import StickerBadge from '@/components/marks/StickerBadge';
import RedCheck from '@/components/marks/RedCheck';
import MarginNote from '@/components/marks/MarginNote';
import { ArrowRight } from 'lucide-react';

export const Q6TrustSecurity: React.FC = () => {
  const securityItems = [
    {
      title: 'Encryption in transit & at rest',
      detail: 'Protected with AES-256 for all stored data and TLS 1.3 for live tests.',
    },
    {
      title: 'Role-based access control',
      detail: 'Strict boundaries between student, faculty, invigilator, and admin tiers.',
    },
    {
      title: 'Immutable audit logs',
      detail: 'Every grade change and proctoring flag is cryptographically logged.',
    },
    {
      title: 'Separate data per organization',
      detail: 'Database row-level security ensures zero institutional cross-talk.',
    },
    {
      title: 'GDPR-ready practices',
      detail: 'On-device webcam signals stay local; zero student video is kept in cloud.',
    },
    {
      title: 'SOC 2 (in progress)',
      detail: 'Formal external compliance audit underway covering all operations.',
    },
  ];

  return (
    <section
      id="q6-trust"
      className="mx-3 sm:mx-6 my-4 sm:my-6 rounded-[40px] bg-[#BFE6FF] p-8 sm:p-14 lg:p-20 relative overflow-hidden border border-[#A7DAFF] shadow-[0_20px_50px_rgba(43,35,80,0.06)] text-left"
    >
      <CropMarks />

      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#2B2350] bg-white/70 px-3.5 py-1.5 rounded-full border border-[#2B2350]/20 shadow-xs">
          Q6 / 08 · TRUST & DATA SAFETY
        </span>
        <StickerBadge color="lemon" rotate={-2}>
          HONEST COMPLIANCE
        </StickerBadge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Short Paragraph & CTA */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2B2350] tracking-tight leading-[1.05]">
            Fair for students. Safe for your data.
          </h2>
          <p className="font-body text-base text-[#2B2350]/85 leading-relaxed font-medium">
            We don't believe in security theater or black-box surveillance. We process candidate behavioral checks right
            inside the browser and isolate your institution's records with strict database controls.
          </p>

          <div className="pt-2">
            <a href="#q8-final">
              <button className="bg-white hover:bg-[#F8FAFC] text-[#2B2350] border-2 border-[#2B2350] font-mono font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-all flex items-center">
                Request security overview
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </button>
            </a>
          </div>

          <div className="pt-4">
            <MarginNote rotate={-3} className="text-xl">
              no fake badges, no third-party video storage
            </MarginNote>
          </div>
        </div>

        {/* Right Column: Grid of Honest Items with Red Checks */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityItems.map((item, idx) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-5 border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-start space-x-2.5">
                <RedCheck size={20} delay={0.1 * idx} className="mt-0.5" />
                <div>
                  <h4 className="font-heading text-sm font-bold text-[#2B2350]">
                    {item.title}
                  </h4>
                  <p className="font-body text-xs text-[#6B6590] mt-1 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Q6TrustSecurity;
