import React, { useState } from 'react';
import CropMarks from '@/components/marks/CropMarks';
import RedCheck from '@/components/marks/RedCheck';
import MarginNote from '@/components/marks/MarginNote';
import StickerBadge from '@/components/marks/StickerBadge';
import OmrBubble from '@/components/marks/OmrBubble';
import { ArrowRight, CheckCircle2, Sparkles, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Q8FinalCtaFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section
      id="q8-final"
      className="mx-3 sm:mx-6 my-4 sm:my-6 rounded-[40px] bg-[#FFF3A3] p-8 sm:p-14 lg:p-20 relative overflow-hidden border border-[#EBE085] shadow-[0_20px_50px_rgba(43,35,80,0.06)] text-left"
    >
      <CropMarks />

      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#2B2350] bg-white/70 px-3.5 py-1.5 rounded-full border border-[#2B2350]/20 shadow-xs">
          Q8 / 08 · FINAL EXAM
        </span>
        <StickerBadge color="violet" rotate={-3}>
          DESIGN PARTNERS 2027
        </StickerBadge>
      </div>

      <div className="max-w-4xl mx-auto space-y-10 text-center mb-16">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#2B2350] tracking-tight">
              Ready for a better exam day?
            </h2>
            <div className="hidden sm:block">
              <RedCheck size={36} />
            </div>
          </div>
          <p className="font-body text-base sm:text-lg text-[#6B6590] max-w-xl mx-auto font-medium">
            Join select university departments and certification boards for our free 2027 pilot program.
          </p>
        </div>

        {/* Paper Sheet Form: Name line + Email input */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350] max-w-2xl mx-auto text-left space-y-6">
          <div className="flex items-center justify-between border-b-2 border-dashed border-[#2B2350]/20 pb-3 font-mono text-xs font-bold text-[#6B6590]">
            <span>EXAM CANDIDATE REGISTRATION</span>
            <MarginNote rotate={-3} className="text-lg">
              free pilot access
            </MarginNote>
          </div>

          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 font-body text-sm font-semibold flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
              <span>Thank you! We will reach out within one business day to coordinate your pilot exam.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-[#2B2350]">
                  Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8FAFC] border-b-2 border-[#2B2350] border-t-0 border-x-0 rounded-none px-2 py-2 text-sm font-body text-[#2B2350] focus:ring-0 focus:border-[#6C4DFF] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-[#2B2350]">
                  Institutional Email:
                </label>
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <input
                    type="email"
                    required
                    placeholder="you@university.edu..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#F8FAFC] border-b-2 border-[#2B2350] border-t-0 border-x-0 rounded-none px-2 py-2 text-sm font-body text-[#2B2350] focus:ring-0 focus:border-[#6C4DFF] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-6 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(108,77,255,0.3)] transition-all flex items-center justify-center shrink-0"
                  >
                    Book a demo
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="flex items-center justify-between text-[11px] font-mono text-[#6B6590] pt-2">
            <span>No credit card required</span>
            <span>•</span>
            <span>Setup in under 24 hours</span>
            <span>•</span>
            <span>Human support</span>
          </div>
        </div>
      </div>

      {/* Light Footer on White Inside Lemon Card */}
      <footer className="border-t-2 border-[#2B2350]/20 pt-10 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-xs font-body">
          <div className="col-span-2 space-y-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#6C4DFF] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
              </div>
              <span className="font-heading text-lg font-extrabold text-[#2B2350]">
                Assess<span className="text-[#6C4DFF]">IQ</span>
              </span>
            </Link>
            <p className="text-xs text-[#6B6590] max-w-sm leading-relaxed">
              AI-powered assessments that feel like a freshly marked test paper: clear, fast, and fair.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-mono text-xs font-bold text-[#2B2350] uppercase">Product</div>
            <ul className="space-y-1.5 text-xs text-[#6B6590]">
              <li><a href="#q3-what-it-does" className="hover:text-[#6C4DFF]">AI Question Builder</a></li>
              <li><a href="#q3-what-it-does" className="hover:text-[#6C4DFF]">Smart Proctoring</a></li>
              <li><a href="#q3-what-it-does" className="hover:text-[#6C4DFF]">Essay Grading</a></li>
              <li><a href="#q6-trust" className="hover:text-[#6C4DFF]">Security & Trust</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-mono text-xs font-bold text-[#2B2350] uppercase">Connect</div>
            <div className="flex items-center space-x-3 pt-1 text-[#2B2350]">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white border border-[#2B2350] flex items-center justify-center hover:bg-[#C9CCFF]">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white border border-[#2B2350] flex items-center justify-center hover:bg-[#C9CCFF]">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white border border-[#2B2350] flex items-center justify-center hover:bg-[#C9CCFF]">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Tiny OMR-Bubble Row & Copyright */}
        <div className="border-t border-[#2B2350]/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6B6590]">
          <p>© 2026 AssessIQ Inc. All rights reserved.</p>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-[#2B2350]">ANSWER SHEET CONFIRMED:</span>
            <OmrBubble letter="A" size="sm" filled />
            <OmrBubble letter="B" size="sm" />
            <OmrBubble letter="C" size="sm" />
            <OmrBubble letter="D" size="sm" />
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Q8FinalCtaFooter;
