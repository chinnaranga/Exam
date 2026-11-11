import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transform Institutional Testing Today</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Ready to Modernize Enterprise Assessments?
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Join 500+ premier universities, certification bodies, and enterprise organizations delivering secure AI-powered examinations at global scale.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-6 rounded-xl shadow-xl shadow-blue-500/30">
              Schedule Enterprise Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/auth/login">
            <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800 font-bold text-base px-8 py-6 rounded-xl">
              Talk to Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
