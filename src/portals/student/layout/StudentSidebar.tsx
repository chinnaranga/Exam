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
  HelpCircle,
  LogOut,
  Sparkles,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from "@/shared/stores/authStore";
import { toast } from 'sonner';

export const StudentSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { logout } = useAuthStore();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/student/dashboard' },
    { icon: BookOpen, label: 'My Learning & Courses', path: '/student/courses' },
    { icon: CheckSquare, label: 'Scheduled Exams', path: '/student/exams' },
    { icon: Sparkles, label: 'Practice Tests', path: '/student/practice' },
    { icon: BarChart3, label: 'Results & Transcripts', path: '/student/results' },
    { icon: Award, label: 'Digital Certificates', path: '/student/certificates' },
    { icon: Briefcase, label: 'Placement Readiness', path: '/student/placement' },
    { icon: Settings, label: 'Account Settings', path: '/student/settings' },
  ];

  return (
    <aside className="w-64 bg-[#F8FAFC] border-r border-[#E2E8F0] p-4 flex flex-col justify-between font-sans text-[#0F172A]">
      <div className="space-y-4">
        {/* Navigation Section Label */}
        <p className="text-[10px] font-mono uppercase font-bold text-[#64748B] px-3 tracking-wider mb-2">
          STUDENT NAVIGATION
        </p>

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1E40AF] text-white shadow-2xs font-bold'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-white'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => {
          logout();
          toast.success('Signed out');
          navigate('/student/login');
        }}
        className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-200 cursor-pointer"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default StudentSidebar;
