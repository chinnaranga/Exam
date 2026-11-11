import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export const StickyMobileCTA: React.FC = () => {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] p-3 shadow-lg">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="text-left leading-tight">
          <div className="text-xs font-bold text-[#1E293B]">AssessIQ Free Pilot</div>
          <div className="text-[10px] text-[#64748B]">Free pilot for design partners</div>
        </div>
        <a href="#demo" className="shrink-0">
          <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm">
            Book a Demo
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </a>
      </div>
    </div>
  );
};

export default StickyMobileCTA;

