import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { RefreshCw } from 'lucide-react';

export interface RecoveryDialogProps {
  onRetry: () => void;
  attempts: number;
  maxAttempts: number;
}

export const RecoveryDialog: React.FC<RecoveryDialogProps> = ({ onRetry, attempts, maxAttempts }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3 font-sans text-xs text-white">
      <p className="font-bold text-amber-400">Recovery Prompt ({attempts}/{maxAttempts})</p>
      <Button onClick={onRetry} className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl">
        <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Re-enter Fullscreen
      </Button>
    </div>
  );
};
