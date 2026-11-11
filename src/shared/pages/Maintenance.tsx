import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Clock, RefreshCw } from 'lucide-react';

export const Maintenance: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] via-[#111827] to-[#1e1b4b] flex items-center justify-center p-4">
      <Card className="glass-card border-amber-500/20 p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-xl bg-surface/30">
        <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
          <Wrench className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">Scheduled Platform Maintenance</h1>
        <p className="text-xs text-gray-400 mt-2">
          ExamifyPro core database clusters are currently undergoing scheduled maintenance upgrades.
        </p>

        <div className="my-4 p-3 rounded-xl bg-surface-dark/80 border border-white/5 text-xs text-left space-y-1">
          <div className="flex items-center text-amber-400 font-semibold">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            <span>Estimated Window: 30 minutes</span>
          </div>
          <p className="text-gray-400">All live candidate attempt state buffers are safely stored in persistent cache.</p>
        </div>

        <Button onClick={() => window.location.reload()} className="w-full bg-primary hover:bg-primary-dark text-white">
          <RefreshCw className="w-4 h-4 mr-2" />
          Check System Status
        </Button>
      </Card>
    </div>
  );
};

export default Maintenance;
