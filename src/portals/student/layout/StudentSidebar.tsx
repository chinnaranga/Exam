import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  CheckSquare,
  Award,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
  Sparkles,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from "@/shared/stores/authStore";
import { OmrBubble } from '@/components/marks';
import { toast } from 'sonner';

export const StudentSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/student/dashboard', bubble: 'A' },
    { icon: BookOpen, label: 'My Learning & Courses', path: '/student/courses', bubble: 'B' },
    { icon: CheckSquare, label: 'Scheduled Exams', path: '/student/exams', bubble: 'C', badge: '1 LIVE' },
    { icon: Sparkles, label: 'Practice Tests', path: '/student/practice', bubble: 'D' },
    { icon: BarChart3, label: 'Results & Transcripts', path: '/student/results', bubble: 'E' },
    { icon: Award, label: 'Digital Certificates', path: '/student/certificates', bubble: 'F' },
    { icon: Briefcase, label: 'Placement Readiness', path: '/student/placement', bubble: 'G' },
    { icon: Settings, label: 'Account Settings', path: '/student/settings', bubble: 'H' },
  ];

  const studentName = user ? `${user.firstName} ${user.lastName}` : 'Jane Doe';

  return (
    <aside className="w-64 bg-white/85 border-r-2 border-dashed border-[#2B2350]/20 p-4 flex flex-col justify-between font-body text-[#2B2350]">
      <div className="space-y-4">
        {/* Candidate Identifier Badge */}
        <div className="p-3.5 rounded-2xl bg-[#FFF3A3]/45 border-2 border-[#2B2350] space-y-1.5 shadow-[3px_3px_0px_#2B2350]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B6590]">
              VERIFIED CANDIDATE
            </span>
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          </div>
          <div className="font-heading font-extrabold text-sm text-[#2B2350] truncate">
            {studentName}
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#6B6590]">
            <span>MIT CS & AI LAB</span>
            <span className="bg-white border border-[#2B2350] px-1.5 py-0.2 rounded font-bold text-[#2B2350]">
              TOP 4%
            </span>
          </div>
        </div>

        {/* Section Heading */}
        <p className="text-[10px] font-mono uppercase font-bold text-[#6B6590] px-3 tracking-wider">
          EXAM STATION NAVIGATION
        </p>

        {/* Menu Items */}
        <div className="space-y-1.5 font-mono text-xs">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-2xl border-2 transition-all ${
                  isActive
                    ? 'bg-[#6C4DFF] text-white border-[#2B2350] shadow-[2.5px_2.5px_0px_#2B2350] font-bold'
                    : 'text-[#2B2350] border-transparent hover:border-[#2B2350] hover:bg-[#FFF3A3]/50 font-medium'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#6C4DFF]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${isActive ? 'bg-white text-[#6C4DFF]' : 'bg-[#FF4D5E] text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Sign Out */}
      <div className="pt-4 border-t-2 border-dashed border-[#2B2350]/20 space-y-2">
        <button
          onClick={() => {
            logout();
            toast.success('Signed out of Student Portal');
            navigate('/student/login');
          }}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl border-2 border-[#2B2350] bg-white hover:bg-rose-50 hover:text-rose-700 text-[#2B2350] font-mono font-bold text-xs shadow-[2px_2px_0px_#2B2350] transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>SIGN OUT</span>
        </button>

        <div className="text-[10px] font-mono text-center text-[#6B6590]">
          AssessIQ Candidate OS v2.4
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;
