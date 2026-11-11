import React from 'react';
import BrandLogo from '@/components/BrandLogo';

export const StudentFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] py-4 px-6 text-xs text-[#64748B] flex items-center justify-between font-sans">
      <div className="flex items-center space-x-2">
        <span className="font-bold text-[#0F172A]">AssessIQ Student Portal</span>
        <span>v2.4.0 • Production Cluster</span>
      </div>
      <div className="flex space-x-4">
        <span>Privacy SLA</span>
        <span>Support Ticket</span>
        <span className="text-[#15803D] font-bold">100% ONLINE</span>
      </div>
    </footer>
  );
};

export default StudentFooter;
