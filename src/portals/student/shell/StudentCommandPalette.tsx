import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { Search, Home, BookOpen, CheckSquare, Award, Settings, User, LogOut } from 'lucide-react';
import { useAuthStore } from "@/shared/stores/authStore";

interface StudentCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentCommandPalette: React.FC<StudentCommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-24 px-4 font-sans text-xs">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden space-y-2 p-4">
        <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-3">
          <Search className="w-4 h-4 text-[#2563EB]" />
          <input
            autoFocus
            placeholder="Type a command or search student resources..."
            className="w-full text-xs outline-none bg-transparent text-[#0F172A]"
          />
          <button onClick={onClose} className="text-[10px] font-mono text-[#64748B] hover:text-[#0F172A]">ESC</button>
        </div>

        <div className="space-y-1 font-mono text-xs text-[#0F172A]">
          <p className="text-[10px] text-[#64748B] uppercase font-bold px-2 py-1">Quick Navigation</p>
          <div
            onClick={() => { navigate('/student/dashboard'); onClose(); }}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#F8FAFC] cursor-pointer font-sans"
          >
            <Home className="w-4 h-4 text-[#2563EB]" />
            <span>Go to Student Dashboard</span>
          </div>

          <div
            onClick={() => { navigate('/exams'); onClose(); }}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#F8FAFC] cursor-pointer font-sans"
          >
            <CheckSquare className="w-4 h-4 text-[#2563EB]" />
            <span>View Scheduled Examinations</span>
          </div>

          <div
            onClick={() => { navigate('/me/profile'); onClose(); }}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#F8FAFC] cursor-pointer font-sans"
          >
            <User className="w-4 h-4 text-[#2563EB]" />
            <span>Academic Profile & Preferences</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCommandPalette;
