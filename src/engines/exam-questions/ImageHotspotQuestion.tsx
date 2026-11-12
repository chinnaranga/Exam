import React, { useRef } from 'react';
import { Target, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export interface ImageHotspotQuestionProps {
  imageUrl: string;
  imageAltText?: string;
  value?: { x: number; y: number } | null;
  onChange: (value: { x: number; y: number } | null) => void;
  disabled?: boolean;
}

export const ImageHotspotQuestion: React.FC<ImageHotspotQuestionProps> = ({
  imageUrl,
  imageAltText = 'Hotspot Target Image',
  value,
  onChange,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert to percentage coordinates (0-100)
    const xPct = Math.round((clickX / rect.width) * 1000) / 10;
    const yPct = Math.round((clickY / rect.height) * 1000) / 10;

    onChange({ x: xPct, y: yPct });
  };

  const handleClear = () => {
    if (disabled) return;
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-2 border-b border-slate-100">
        <span>Click on the diagram image to place your target pin on the requested feature.</span>
        <div className="flex items-center space-x-2">
          {value && (
            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Pin: ({value.x}%, {value.y}%)
            </span>
          )}
          {value && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 px-2 text-xs text-red-600 hover:bg-red-50"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Reset Pin
            </Button>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-label={`Hotspot image: ${imageAltText}. Click to place pin.`}
        className={`relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 shadow-sm cursor-crosshair select-none transition-all ${
          disabled ? 'pointer-events-none opacity-80' : 'hover:border-indigo-400'
        }`}
      >
        <img
          src={imageUrl}
          alt={imageAltText}
          className="w-full h-auto max-h-[500px] object-contain mx-auto block pointer-events-none"
        />

        {/* Selected Hotspot Crosshair Marker */}
        {value && (
          <div
            style={{
              left: `${value.x}%`,
              top: `${value.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
          >
            {/* Pulsing beacon ring */}
            <span className="absolute w-8 h-8 rounded-full bg-red-500/30 animate-ping" />
            {/* Solid crosshair icon */}
            <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {!value && (
          <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[11px] font-mono px-3 py-1.5 rounded-lg backdrop-blur-xs pointer-events-none">
            Click anywhere on image to place target pin
          </div>
        )}
      </div>
    </div>
  );
};
