import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from "@/shared/stores/authStore";
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { OmrBubble } from '@/components/marks';
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

  const studentName = user ? `${user.firstName} ${user.lastName}` : 'Jane Doe';
  const studentEmail = user?.email || 'student@mit.edu';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-dashed border-[#2B2350]/20 px-6 py-3 flex items-center justify-between font-body text-[#2B2350]">
      <div className="flex items-center space-x-5">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#6C4DFF] text-white flex items-center justify-center shadow-xs group-hover:bg-[#5A3DEB] transition-colors border border-[#2B2350]">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight text-[#2B2350]">
            Assess<span className="text-[#6C4DFF]">IQ</span>
          </span>
        </Link>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 bg-[#FFF3A3] text-[#2B2350] border border-[#2B2350] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
            <OmrBubble letter="A" selected size="sm" />
            <span>CANDIDATE WORKSPACE</span>
          </span>
          <span className="hidden sm:inline-flex text-[10px] font-mono text-[#6B6590] bg-[#C9CCFF]/40 border border-[#2B2350]/30 px-2 py-0.5 rounded-full font-bold">
            MIT LABS
          </span>
        </div>

        {/* Global Search Bar */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center space-x-3 bg-[#FFF3A3]/20 border-2 border-[#2B2350]/25 px-3.5 py-1.5 rounded-xl text-xs text-[#6B6590] hover:border-[#6C4DFF] hover:bg-white transition-all w-64 justify-between cursor-pointer"
        >
          <span className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-[#6C4DFF]" />
            <span className="font-mono text-[11px]">Search tests, certs, drills...</span>
          </span>
          <kbd className="font-mono text-[10px] bg-white border border-[#2B2350] px-1.5 py-0.5 rounded text-[#2B2350] font-bold shadow-[1px_1px_0px_#2B2350]">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <Link to="/auth" className="hidden sm:inline-block">
          <button className="text-[11px] font-mono font-bold text-[#6B6590] hover:text-[#6C4DFF] px-2 py-1 transition-colors">
            ← SWITCH ROLE
          </button>
        </Link>

        {/* Notification Bell */}
        <button
          onClick={() => toast.info('Academic Notice: CS-402 Exam opens in 45 minutes!')}
          className="relative p-2 rounded-xl border-2 border-[#2B2350]/30 hover:border-[#2B2350] hover:bg-[#FFF3A3]/40 text-[#2B2350] transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF4D5E] rounded-full border border-white" />
        </button>

        {/* Student Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 p-1.5 rounded-2xl border-2 border-[#2B2350] bg-white hover:bg-[#FFF3A3]/30 transition-all shadow-[2px_2px_0px_#2B2350] cursor-pointer">
              <div className="w-7 h-7 rounded-xl bg-[#6C4DFF] text-white flex items-center justify-center font-heading font-extrabold text-xs shadow-xs">
                {studentName.charAt(0)}
              </div>
              <span className="font-heading font-bold text-xs text-[#2B2350] hidden sm:inline max-w-[120px] truncate">
                {studentName}
              </span>
              <ChevronDown className="w-3 h-3 text-[#6B6590]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] rounded-2xl p-1.5 text-[#2B2350] font-mono text-xs">
            <DropdownMenuLabel className="px-3 py-2">
              <div className="font-bold text-[#2B2350] font-heading">{studentName}</div>
              <div className="text-[10px] text-[#6B6590] truncate">{studentEmail}</div>
              <div className="mt-1">
                <span className="text-[9px] bg-[#C9CCFF] text-[#2B2350] px-2 py-0.5 rounded-full font-bold">
                  STUDENT ID: MIT-2026
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2B2350]/15" />
            <DropdownMenuItem onClick={() => navigate('/student/dashboard')} className="rounded-xl cursor-pointer hover:bg-[#FFF3A3]/50">
              <BookOpen className="w-3.5 h-3.5 mr-2 text-[#6C4DFF]" />
              Candidate Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/student/profile')} className="rounded-xl cursor-pointer hover:bg-[#FFF3A3]/50">
              <User className="w-3.5 h-3.5 mr-2 text-[#6C4DFF]" />
              Academic Dossier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/student/certificates')} className="rounded-xl cursor-pointer hover:bg-[#FFF3A3]/50">
              <Award className="w-3.5 h-3.5 mr-2 text-[#6C4DFF]" />
              Digital Credentials
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/student/settings')} className="rounded-xl cursor-pointer hover:bg-[#FFF3A3]/50">
              <Settings className="w-3.5 h-3.5 mr-2 text-[#6C4DFF]" />
              Portal Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2B2350]/15" />
            <DropdownMenuItem onClick={handleLogout} className="text-[#FF4D5E] hover:bg-rose-50 rounded-xl cursor-pointer font-bold">
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Sign Out of Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default StudentHeader;
