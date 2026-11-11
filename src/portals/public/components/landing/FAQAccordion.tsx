import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How does ExamifyPro maintain data privacy and compliance for universities?',
    a: 'ExamifyPro complies fully with FERPA, GDPR, and SOC 2 Type II standards. Student data is encrypted with AES-256 at rest and TLS 1.3 in transit. We maintain a zero-data-retention policy for AI model fine-tuning.',
  },
  {
    q: 'Can ExamifyPro integrate with our existing LMS (Canvas, Blackboard, Moodle)?',
    a: 'Yes. ExamifyPro provides LTI 1.3 compliance and out-of-the-box REST & GraphQL APIs to automatically sync candidate rosters, exam schedules, and final grade marks into Canvas, Blackboard, Moodle, or Workday.',
  },
  {
    q: 'How does the AI Proctoring engine detect academic integrity violations?',
    a: 'The proctoring engine runs locally via WebAssembly and computer vision algorithms to detect face absence, multi-person detection, secondary display usage, audio frequency anomalies, and tab focus loss without streaming raw video unless flagged.',
  },
  {
    q: 'What candidate volume can the assessment runtime handle concurrently?',
    a: 'Our cloud-native architecture is battle-tested to support 100,000+ simultaneous candidates during peak exam windows with sub-50ms latency and automatic local answer buffering.',
  },
];

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Enterprise Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base hover:text-blue-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === idx ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {openIndex === idx && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
