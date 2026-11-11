import React from 'react';
import { ANNOUNCEMENT } from '@/data/navigation';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#EFF6FF] border-b border-[#DBEAFE] px-4 py-2 text-center text-xs font-medium text-[#1E40AF] transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
        <span>{ANNOUNCEMENT.text}</span>
        <a
          href={ANNOUNCEMENT.href}
          className="font-semibold underline hover:text-[#1D4ED8] transition-colors inline-flex items-center ml-1"
        >
          {ANNOUNCEMENT.linkText}
        </a>
      </div>
    </div>
  );
};

export default AnnouncementBar;

