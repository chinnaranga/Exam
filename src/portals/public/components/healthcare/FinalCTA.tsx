import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const HealthcareFinalCTA: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Enterprise Operations Ready</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Transform Mission-Critical Assessments with Enterprise AI
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Schedule an institutional demonstration with our principal solutions architects to evaluate our security, AI proctoring, and multi-tenant capabilities.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth/register">
            <Button size="lg" className="bg-[#1E40AF] hover:bg-[#1d3999] text-white font-bold text-xs px-8 py-5 rounded shadow-xs">
              Schedule Enterprise Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/auth/login">
            <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800 font-bold text-xs px-8 py-5 rounded">
              Talk to Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HealthcareFinalCTA;
