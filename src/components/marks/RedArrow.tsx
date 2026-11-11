import React from 'react';
import { motion } from 'framer-motion';

interface RedArrowProps {
  className?: string;
  delay?: number;
}

export const RedArrow: React.FC<RedArrowProps> = ({ className = '', delay = 0.2 }) => {
  return (
    <svg
      viewBox="0 0 60 30"
      fill="none"
      className={`overflow-visible pointer-events-none ${className}`}
    >
      <motion.path
        d="M 4,18 C 22,8 38,24 52,14"
        stroke="#FF4D5E"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
      />
      <motion.path
        d="M 42,9 L 53,14 L 46,23"
        stroke="#FF4D5E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: delay + 0.4 }}
      />
    </svg>
  );
};

export default RedArrow;

