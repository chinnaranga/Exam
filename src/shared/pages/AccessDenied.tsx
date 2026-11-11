import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from "@/shared/stores/authStore";
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] via-[#111827] to-[#1e1b4b] flex items-center justify-center p-4">
      <Card className="glass-card border-red-500/20 p-8 max-w-lg w-full text-center shadow-2xl backdrop-blur-xl bg-surface/30">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mb-4 animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-extrabold text-white tracking-tight">403 Forbidden Access</h1>
        <p className="text-sm text-gray-400 mt-2">
          Your current account role <span className="text-primary font-mono font-semibold">[{user?.roles[0]?.roleName || 'UNAUTHORIZED'}]</span> does not possess the required RBAC permissions to view this resource.
        </p>

        <div className="my-6 p-4 rounded-xl bg-surface-dark/80 border border-white/5 text-left text-xs space-y-2">
          <div className="flex items-center text-gray-300 font-semibold mb-1">
            <Lock className="w-3.5 h-3.5 mr-1 text-red-400" />
            <span>Security Isolation Active</span>
          </div>
          <p className="text-gray-400">
            Resource request logged. If you require access to this module, contact your Organization Admin to elevate your permission scope.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Go Back
          </Button>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary-dark text-white w-full sm:w-auto">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AccessDenied;
