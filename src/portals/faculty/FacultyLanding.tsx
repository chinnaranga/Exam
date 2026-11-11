import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/BrandLogo';
import { GraduationCap, BookOpen, Brain, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const FacultyLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-purple-950 text-white font-sans selection:bg-purple-800 selection:text-white">
      <header className="border-b border-purple-800 py-4 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BrandLogo size="md" variant="dark" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-900 text-purple-200 px-2 py-0.5 rounded border border-purple-700">
            Faculty & Academic Authoring Portal
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/faculty/login">
            <Button className="bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs px-5">
              Faculty Sign In
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-24 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-900 text-purple-200 text-xs font-mono font-bold uppercase border border-purple-700">
          <Brain className="w-4 h-4 text-purple-400" />
          <span>Generative AI Item Authoring & IRT Calibration</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Academic Faculty Assessment Studio
        </h1>

        <p className="text-purple-200 text-base max-w-2xl mx-auto leading-relaxed">
          Create blueprint-matched exam blueprints, generate Bloom's taxonomy items using AI, review peer submissions, and grade student responses.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/faculty/dashboard">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-8 py-5 rounded-xl shadow-lg shadow-purple-600/30">
              Open Faculty Studio
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default FacultyLanding;
