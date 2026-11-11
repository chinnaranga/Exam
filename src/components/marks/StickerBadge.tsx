import React from 'react';
import { motion } from 'framer-motion';

interface StickerBadgeProps {
  children: React.ReactNode;
  color?: 'lemon' | 'coral' | 'mint' | 'violet' | 'white';
  rotate?: number;
  className?: string;
}

export const StickerBadge: React.FC<StickerBadgeProps> = ({
  children,
  color = 'lemon',
  rotate = -3,
  className = '',
}) => {
  const bgStyles = {
    lemon: 'bg-[#FFF3A3] text-[#2B2350] border-[#2B2350]',
    coral: 'bg-[#FFB5A7] text-[#2B2350] border-[#2B2350]',
    mint: 'bg-[#B8F0D2] text-[#2B2350] border-[#2B2350]',
    violet: 'bg-[#6C4DFF] text-white border-[#2B2350]',
    white: 'bg-white text-[#2B2350] border-[#2B2350]',
  }[color];

  return (
    <motion.div
      whileHover={{ rotate: [rotate, rotate + 4, rotate - 4, rotate], scale: 1.05 }}
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-flex items-center px-3 py-1 rounded-full border-2 font-mono text-[11px] font-bold tracking-wider uppercase shadow-[2px_2px_0px_#2B2350] select-none cursor-default ${bgStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default StickerBadge;
