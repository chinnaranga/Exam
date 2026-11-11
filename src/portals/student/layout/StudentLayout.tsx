import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { StudentHeader } from './StudentHeader';
import { StudentSidebar } from './StudentSidebar';
import { StudentFooter } from './StudentFooter';
import { StudentCommandPalette } from '../components/StudentCommandPalette';

export const StudentLayout: React.FC = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] flex flex-col">
      <StudentHeader onOpenCommandPalette={() => setIsCommandOpen(true)} />
      <div className="flex flex-1">
        <StudentSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <StudentFooter />
      <StudentCommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </div>
  );
};

export default StudentLayout;
