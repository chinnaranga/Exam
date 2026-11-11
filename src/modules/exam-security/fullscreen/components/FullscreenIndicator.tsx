import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export interface FullscreenIndicatorProps {
  isFullscreen: boolean;
}

export const FullscreenIndicator: React.FC<FullscreenIndicatorProps> = ({ isFullscreen }) => {
  return (
    <div className={`flex items-center space-x-1.5 px-2 py-1 rounded text-[11px] font-mono font-bold ${isFullscreen ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
      {isFullscreen ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
      <span>{isFullscreen ? 'FULLSCREEN' : 'WINDOWED'}</span>
    </div>
  );
};
