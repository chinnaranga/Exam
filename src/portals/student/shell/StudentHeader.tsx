import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import {
  Bell,
  Search,
  Calendar,
  User,
  LogOut,
  Settings,
  KeyRound,
  ChevronDown,
  Sparkles,
  Command,
  Building2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface StudentHeaderProps {
  onOpenCommandPalette: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ onOpenCommandPalette }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Signed out of Student Portal');
    navigate('/student/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] px-6 py-3 flex items-center justify-between font-sans text-[#0F172A]">
      <div className="flex items-center space-x-6">
        <Link to="/student/dashboard" className="flex items-center space-x-3">
          <BrandLogo size="md" variant="light" />
        </Link>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-[#1E40AF] px-2.5 py-1 rounded-full border border-blue-200">
          STUDENT WORKSPACE
        </span>

        {/* Global Search Bar Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center space-x-3 bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-1.5 rounded-xl text-xs text-[#64748B] hover:border-blue-300 transition-all w-64 justify-between"
        >
          <span className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Search exams, certs, courses...</span>
          </span>
          <kbd className="font-mono text-[10px] bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded text-[#0F172A] font-bold">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="relative text-[#64748B] hover:text-[#0F172A]" onClick={() => toast.info('2 Pending Academic Notifications')}>
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#2563EB] rounded-full animate-pulse" />
        </Button>

        {/* Student Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-xs text-[#0F172A] hover:bg-[#F8FAFC]">
              <div className="w-7 h-7 rounded-full bg-[#1E40AF] text-white flex items-center justify-center font-bold text-xs font-mono">
                {user?.firstName?.charAt(0) || 'E'}
              </div>
              <span className="font-bold hidden sm:inline">{user?.firstName || 'Eleanor'} {user?.lastName || 'Vance'}</span>
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-[#E2E8F0] text-[#0F172A]">
            <DropdownMenuLabel className="text-xs font-mono text-[#64748B]">{user?.email || 'student@mit.edu'}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E2E8F0]" />
            <DropdownMenuItem onClick={() => navigate('/student/profile')} className="text-xs cursor-pointer">
              <User className="w-3.5 h-3.5 mr-2 text-[#2563EB]" />
              Academic Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/student/settings')} className="text-xs cursor-pointer">
              <Settings className="w-3.5 h-3.5 mr-2 text-[#2563EB]" />
              Portal Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#E2E8F0]" />
            <DropdownMenuItem onClick={handleLogout} className="text-xs text-red-600 hover:bg-red-50 cursor-pointer">
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default StudentHeader;
