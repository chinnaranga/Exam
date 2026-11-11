import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BrandLogo from "@/shared/components/BrandLogo";
import { ShieldCheck, Server, Lock, ArrowRight, Activity, Cpu } from 'lucide-react';

export const AdminLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-slate-700 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-slate-800 py-4 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BrandLogo size="md" variant="dark" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
            Super Admin Control Plane
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/super-admin/login">
            <Button className="bg-slate-100 text-slate-900 hover:bg-white font-bold text-xs px-5">
              Admin Gateway Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-24 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold uppercase border border-slate-700">
          <Cpu className="w-4 h-4 text-slate-400" />
          <span>Global Infrastructure Control Plane</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Super Admin Global Operating System
        </h1>

        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
          Manage multi-tenant infrastructure, row-level security policy evaluation, system audit logs, and global cluster health.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/admin/dashboard">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-8 py-5 rounded-xl">
              Access Admin Console
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminLanding;
