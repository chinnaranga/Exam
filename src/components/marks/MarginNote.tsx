import React from 'react';

interface MarginNoteProps {
  children: React.ReactNode;
  rotate?: number;
  className?: string;
}

export const MarginNote: React.FC<MarginNoteProps> = ({
  children,
  rotate = -3,
  className = '',
}) => {
  return (
    <span
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`font-handwriting text-xl sm:text-2xl text-[#FF4D5E] font-bold inline-block select-none pointer-events-none drop-shadow-xs ${className}`}
    >
      {children}
    </span>
  );
};

export default MarginNote;

