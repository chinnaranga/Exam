import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center text-[#1E293B]">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
        <HelpCircle className="w-6 h-6" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight">404 — Page Not Found</h1>
      <p className="text-sm text-[#475569] mt-2 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AssessIQ Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
