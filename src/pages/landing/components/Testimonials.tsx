import React from 'react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "ExamifyPro allowed us to transition 45,000 university students to secure remote examinations without a single integrity breach.",
    author: "Dr. Margaret Holloway",
    role: "Dean of Academic Affairs, Global Science University",
  },
  {
    quote: "The AI item generator reduced our exam creation cycle from weeks to hours, while maintaining strict Bloom's taxonomy standards.",
    author: "Robert Sterling",
    role: "Chief Learning Officer, Enterprise Tech Systems",
  },
  {
    quote: "The psychometric item difficulty heatmaps gave our certification board unprecedented insights into candidate discrimination vectors.",
    author: "Elena Rostova",
    role: "Director of Assessment, International Certification Institute",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Executive Endorsements
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Academic & Corporate Leaders
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-blue-600/40" />
                <p className="text-sm text-slate-700 leading-relaxed font-medium">"{t.quote}"</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-sm text-slate-900">{t.author}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
