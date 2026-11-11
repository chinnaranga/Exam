import React from 'react';
import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "ExamifyPro allowed our university system to deliver 50,000+ final examinations with zero-trust security and complete audit integrity.",
    author: "Dr. Arthur Vance",
    role: "Dean of Academic Operations, Global Medical University",
  },
  {
    quote: "The AI item authoring and difficulty calibration reduced our test development timeline by 70% while improving item discrimination scores.",
    author: "Sarah Jenkins",
    role: "Chief Learning Officer, Enterprise Healthcare Network",
  },
  {
    quote: "The PostgreSQL multi-tenant isolation and append-only audit logs satisfied our most stringent government examination security mandates.",
    author: "Marcus Brody",
    role: "Director of Examinations, National Civil Service Board",
  },
];

export const HealthcareExecutiveTestimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-mono font-bold text-[#1E40AF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded border border-blue-200">
            Institutional Endorsements
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Executive Endorsements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="p-6 rounded bg-[#F8FAFC] border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-[#1E40AF]/40" />
                <p className="text-xs text-slate-700 leading-relaxed font-medium">"{t.quote}"</p>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-bold text-xs text-slate-900">{t.author}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthcareExecutiveTestimonials;
