import React from 'react';
import { motion } from 'framer-motion';

interface OmrBubbleProps {
  letter: string;
  filled?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animateFill?: boolean;
}

export const OmrBubble: React.FC<OmrBubbleProps> = ({
  letter,
  filled = false,
  onClick,
  size = 'md',
  className = '',
  animateFill = false,
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'w-6 h-6 text-[10px]'
      : size === 'lg'
      ? 'w-10 h-10 text-sm'
      : 'w-8 h-8 text-xs';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 border-[#2B2350] flex items-center justify-center font-mono font-bold transition-all relative overflow-hidden shrink-0 ${sizeClasses} ${
        filled
          ? 'bg-[#6C4DFF] text-white border-[#6C4DFF] shadow-xs'
          : 'bg-white text-[#2B2350] hover:border-[#6C4DFF] hover:text-[#6C4DFF]'
      } ${className}`}
    >
      {animateFill && filled ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute inset-0 bg-[#6C4DFF] rounded-full"
        />
      ) : null}
      <span className="relative z-10">{letter}</span>
    </button>
  );
};

export default OmrBubble;

