import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-16 lg:bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-white border border-[#CBD5E1] text-[#2563EB] shadow-[0_4px_14px_rgba(37,99,235,0.15)] flex items-center justify-center hover:bg-[#EFF6FF] hover:border-[#2563EB] transition-all transform hover:scale-105"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};

export default BackToTop;

