import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BrandLogo from "@/shared/components/BrandLogo";
import { ShieldCheck, Video, Eye, Radio, ArrowRight, AlertTriangle } from 'lucide-react';

export const InvigilatorLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-amber-950 text-white font-sans selection:bg-amber-800 selection:text-white">
      <header className="border-b border-amber-800 py-4 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BrandLogo size="md" variant="dark" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-900 text-amber-200 px-2 py-0.5 rounded border border-amber-700">
            Live Proctoring & Invigilator Portal
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/invigilator/login">
            <Button className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs px-5">
              Invigilator Sign In
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-24 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-900 text-amber-200 text-xs font-mono font-bold uppercase border border-amber-700">
          <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Real-Time Wasm Computer Vision Proctor Telemetry</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Live Proctoring Command Center
        </h1>

        <p className="text-amber-200 text-base max-w-2xl mx-auto leading-relaxed">
          Monitor active examination rooms, inspect computer vision gaze vectors, review anomaly alerts, and verify student identities.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/invigilator/dashboard">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-8 py-5 rounded-xl shadow-lg shadow-amber-600/30">
              Open Invigilator Room
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default InvigilatorLanding;
