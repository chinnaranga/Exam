import React from 'react';
import { motion } from 'framer-motion';

interface RedCheckProps {
  className?: string;
  size?: number;
  delay?: number;
}

export const RedCheck: React.FC<RedCheckProps> = ({ className = '', size = 24, delay = 0.2 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={`shrink-0 overflow-visible ${className}`}
    >
      <motion.path
        d="M 5,17 C 8,20 12,24 13,27 C 15,22 21,11 28,5"
        stroke="#FF4D5E"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      />
    </svg>
  );
};

export default RedCheck;

