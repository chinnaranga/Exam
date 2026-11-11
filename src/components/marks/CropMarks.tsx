import React from 'react';

export const CropMarks: React.FC = () => {
  return (
    <>
      {/* Top Left */}
      <div className="absolute top-4 left-4 pointer-events-none opacity-40 select-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M 0,8 L 16,8 M 8,0 L 8,16" stroke="#2B2350" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Top Right */}
      <div className="absolute top-4 right-4 pointer-events-none opacity-40 select-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M 8,8 L 24,8 M 16,0 L 16,16" stroke="#2B2350" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-4 left-4 pointer-events-none opacity-40 select-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M 0,16 L 16,16 M 8,8 L 8,24" stroke="#2B2350" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-4 right-4 pointer-events-none opacity-40 select-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M 8,16 L 24,16 M 16,8 L 16,24" stroke="#2B2350" strokeWidth="1.5" />
        </svg>
      </div>
    </>
  );
};

export default CropMarks;

