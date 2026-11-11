import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw } from 'lucide-react';

export const NetworkError: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] via-[#111827] to-[#1e1b4b] flex items-center justify-center p-4">
      <Card className="glass-card border-red-500/20 p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-xl bg-surface/30">
        <div className="mx-auto w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mb-4">
          <WifiOff className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">Network Connection Disconnected</h1>
        <p className="text-xs text-gray-400 mt-2">
          Unable to establish websocket connection with the primary API gateway. Please check your internet connectivity.
        </p>

        <div className="my-4 p-3 rounded-xl bg-surface-dark/80 border border-white/5 text-xs text-left text-gray-300">
          <p className="font-semibold text-white mb-1">IndexedDB Buffer Active</p>
          <p className="text-gray-400">Exam progress and answer selections are buffered locally until connectivity is restored.</p>
        </div>

        <Button onClick={() => window.location.reload()} className="w-full bg-primary hover:bg-primary-dark text-white">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Connection
        </Button>
      </Card>
    </div>
  );
};

export default NetworkError;
