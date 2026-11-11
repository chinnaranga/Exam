import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Maximize2, Minimize2 } from 'lucide-react';
import { FullscreenState } from '../types/FullscreenState';

export interface FullscreenStatusBadgeProps {
  state: FullscreenState;
}

export const FullscreenStatusBadge: React.FC<FullscreenStatusBadgeProps> = ({ state }) => {
  const isActive = state === 'ACTIVE';
  return (
    <Badge
      className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center ${
        isActive ? 'bg-emerald-50 text-[#15803D] border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
      }`}
    >
      {isActive ? <Maximize2 className="w-3 h-3 mr-1" /> : <Minimize2 className="w-3 h-3 mr-1" />}
      <span>{isActive ? 'FULLSCREEN ACTIVE' : `STATE: ${state}`}</span>
    </Badge>
  );
};
