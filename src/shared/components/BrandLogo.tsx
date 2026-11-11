import React from 'react';
import { Sparkles, Brain, CheckSquare } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showText = true,
}) => {
  const boxSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      {/* Enterprise AI Assessment Icon Box */}
      <div className={`${boxSize} bg-[#1E40AF] text-white rounded-lg flex items-center justify-center shadow-xs shrink-0 font-sans border border-blue-400/30`}>
        <Sparkles className={`${iconSize} text-white fill-white`} />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={`${textSize} font-extrabold tracking-tight font-sans ${
              variant === 'dark' ? 'text-white' : 'text-[#0F172A]'
            }`}
          >
            Assess<span className="text-[#2563EB]">IQ</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
