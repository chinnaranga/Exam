import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export interface FullscreenOverlayProps {
  onReturnToFullscreen: () => void;
  recoveryAttempts: number;
  maxAttempts: number;
}

export const FullscreenOverlay: React.FC<FullscreenOverlayProps> = ({
  onReturnToFullscreen,
  recoveryAttempts,
  maxAttempts,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6 font-sans text-white">
      <Card className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white">Exam Session Paused</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Return to Fullscreen to Continue Exam. Screen exit has been logged.
          </p>
          <p className="text-[11px] font-mono text-amber-400">
            Recovery Attempt: {recoveryAttempts} / {maxAttempts}
          </p>
        </div>

        <Button
          onClick={onReturnToFullscreen}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Return to Fullscreen to Continue
        </Button>
      </Card>
    </div>
  );
};
