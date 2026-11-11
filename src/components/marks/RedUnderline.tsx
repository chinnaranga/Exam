import React from 'react';
import { motion } from 'framer-motion';

interface RedUnderlineProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const RedUnderline: React.FC<RedUnderlineProps> = ({ children, className = '', delay = 0.4 }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute -bottom-2.5 left-0 w-full h-4 pointer-events-none z-20 overflow-visible"
        viewBox="0 0 200 16"
        fill="none"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 2,10 Q 50,14 100,8 T 198,11 M 12,14 Q 70,16 130,12 T 188,14"
          stroke="#FF4D5E"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay, ease: 'easeInOut' }}
        />
      </svg>
    </span>
  );
};

export default RedUnderline;

