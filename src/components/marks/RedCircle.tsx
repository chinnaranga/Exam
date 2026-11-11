import React from 'react';
import { motion } from 'framer-motion';

interface RedCircleProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const RedCircle: React.FC<RedCircleProps> = ({ children, className = '', delay = 0.2 }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute -inset-x-3 -inset-y-2 w-[calc(100%+24px)] h-[calc(100%+16px)] pointer-events-none z-20 overflow-visible"
        viewBox="0 0 140 60"
        fill="none"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 12,30 C 14,10 50,5 95,8 C 130,11 138,24 135,38 C 131,52 90,56 40,54 C 15,53 5,42 8,26 C 10,14 42,8 85,9"
          stroke="#FF4D5E"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay, ease: 'easeInOut' }}
        />
      </svg>
    </span>
  );
};

export default RedCircle;
