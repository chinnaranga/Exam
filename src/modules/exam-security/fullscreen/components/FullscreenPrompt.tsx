import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Maximize2, ShieldCheck, Lock } from 'lucide-react';

export interface FullscreenPromptProps {
  onEnterFullscreen: () => void;
  examName?: string;
}

export const FullscreenPrompt: React.FC<FullscreenPromptProps> = ({
  onEnterFullscreen,
  examName = 'AssessIQ Examination Session',
}) => {
  return (
    <div className="fixed inset-0 bg-[#0F172A] z-50 flex items-center justify-center p-6 font-sans text-white">
      <Card className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono uppercase font-bold px-3 py-1">
            PEARSON VUE LOCK-DOWN MODE
          </Badge>
          <h2 className="text-xl font-extrabold tracking-tight text-white">{examName}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter Fullscreen to Begin Exam. Mandatory secure window enforcement is required.
          </p>
        </div>

        <Button
          onClick={onEnterFullscreen}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg cursor-pointer"
        >
          <Maximize2 className="w-4 h-4 mr-2" /> Enter Fullscreen to Begin Exam
        </Button>
      </Card>
    </div>
  );
};
