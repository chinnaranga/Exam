import React from 'react';

export const StudentFooter: React.FC = () => {
  return (
    <footer className="bg-white/80 border-t-2 border-dashed border-[#2B2350]/20 py-3.5 px-8 text-xs font-mono text-[#6B6590] flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center space-x-2">
        <span className="font-bold text-[#2B2350]">AssessIQ Student Portal</span>
        <span>•</span>
        <span>Candidate Station Form A-01</span>
      </div>
      <div className="flex items-center space-x-4">
        <span>Zero-Trust Client Wasm</span>
        <span>•</span>
        <span className="text-[#10B981] font-bold flex items-center">
          <span className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5 animate-pulse" />
          ONLINE CONSENSUS
        </span>
      </div>
    </footer>
  );
};

export default StudentFooter;
