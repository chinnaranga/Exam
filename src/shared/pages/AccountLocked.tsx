import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Lock, ShieldAlert, Mail } from 'lucide-react';

export const AccountLocked: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] via-[#111827] to-[#1e1b4b] flex items-center justify-center p-4">
      <Card className="glass-card border-red-500/20 p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-xl bg-surface/30">
        <div className="mx-auto w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">Account Temporarily Locked</h1>
        <p className="text-xs text-gray-400 mt-2">
          Too many invalid login attempts were detected on your identity. For enterprise security, access is throttled for 15 minutes.
        </p>

        <div className="my-4 p-3 rounded-xl bg-surface-dark/80 border border-white/5 text-xs text-left text-gray-300">
          <p className="font-semibold text-white mb-1 flex items-center">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400 mr-1.5" />
            Security Throttling Rule
          </p>
          <p className="text-gray-400">Lockout Duration: 15 minutes • Risk Score: High • IP Logged</p>
        </div>

        <div className="space-y-3 pt-2">
          <Link to="/auth/forgot-password">
            <Button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
              Unlock via Password Reset
            </Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="outline" className="w-full">
              Return to Login Screen
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AccountLocked;
