import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { ShieldCheck } from 'lucide-react';

export const CookieNotice: React.FC = () => {
  const [acknowledged, setAcknowledged] = useState(true);

  useEffect(() => {
    const hasSeen = localStorage.getItem('assessiq_cookie_consent');
    if (!hasSeen) {
      setAcknowledged(false);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('assessiq_cookie_consent', 'true');
    setAcknowledged(true);
  };

  if (acknowledged) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm rounded-2xl bg-white border border-[#E2E8F0] p-4 shadow-[0_10px_30px_rgba(37,99,235,0.12)] text-xs text-[#475569] space-y-3">
      <div className="flex items-center space-x-2 text-[#1E293B] font-semibold">
        <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
        <span>Privacy & Cookie Preferences</span>
      </div>
      <p className="text-[11px] leading-relaxed">
        AssessIQ uses essential cookies to ensure secure exam sessions and session telemetry. We never sell personal or biometric data.
      </p>
      <div className="flex items-center space-x-2 pt-1">
        <Button
          onClick={accept}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs"
        >
          Accept
        </Button>
        <button
          onClick={accept}
          className="text-xs text-[#64748B] hover:text-[#1E293B] px-2 py-1"
        >
          Essential only
        </button>
      </div>
    </div>
  );
};

export default CookieNotice;

