import React from 'react';
import { motion } from 'framer-motion';

interface RedStrikeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const RedStrike: React.FC<RedStrikeProps> = ({ children, className = '', delay = 0.3 }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="opacity-70 line-through decoration-transparent">{children}</span>
      <svg
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-[105%] h-5 -left-[2.5%] pointer-events-none z-20 overflow-visible"
        viewBox="0 0 250 14"
        fill="none"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 2,7 C 60,3 140,11 248,6"
          stroke="#FF4D5E"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        />
      </svg>
    </span>
  );
};

export default RedStrike;
