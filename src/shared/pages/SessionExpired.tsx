import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Clock, LogIn } from 'lucide-react';

export const SessionExpired: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] via-[#111827] to-[#1e1b4b] flex items-center justify-center p-4">
      <Card className="glass-card border-amber-500/20 p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-xl bg-surface/30">
        <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
          <Clock className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">401 Session Timeout</h1>
        <p className="text-sm text-gray-400 mt-2">
          Your authentication token has expired due to inactivity. Please sign in again to restore your active workspace.
        </p>

        <div className="mt-6">
          <Link to="/auth/login">
            <Button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 shadow-lg shadow-primary/25">
              <LogIn className="w-4 h-4 mr-2" />
              Re-authenticate Session
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SessionExpired;
