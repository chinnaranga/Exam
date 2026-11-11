import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const BrowserSupportDialog: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex items-center justify-center p-6 font-sans text-white">
      <Card className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-lg text-white">Fullscreen API Unsupported</h3>
        <p className="text-xs text-slate-400">
          Your browser does not support full-screen mode required by AssessIQ Security policies. Please use Chrome, Edge, or Firefox.
        </p>
      </Card>
    </div>
  );
};
