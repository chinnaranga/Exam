import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from "@/shared/components/BrandLogo";
import { Button } from '@/components/ui/button';
import { useAuthStore } from "@/shared/stores/authStore";
import {
  Brain,
  BookOpen,
  FileCode,
  BarChart3,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export const FacultyLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: Brain, label: 'Faculty Dashboard', path: '/faculty/dashboard' },
    { icon: BookOpen, label: 'Question Bank & AI', path: '/faculty/question-bank' },
    { icon: FileCode, label: 'Exam Builder & Blueprints', path: '/faculty/exams' },
    { icon: BarChart3, label: 'IRT & Bloom Analytics', path: '/faculty/analytics' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/faculty/dashboard" className="flex items-center space-x-3">
            <BrandLogo size="md" variant="light" />
          </Link>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
            FACULTY AUTHORING PORTAL
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs font-sans">
          <span className="font-bold text-[#0F172A]">Dr. Robert Chen (Faculty)</span>
          <Button onClick={() => { logout(); navigate('/faculty/login'); }} variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 text-xs">
            <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      {/* Body Shell */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[#E2E8F0] p-4 space-y-4">
          <p className="text-[10px] font-mono uppercase font-bold text-[#64748B] px-3 tracking-wider">
            FACULTY WORKSPACE
          </p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-700 text-white font-bold shadow-2xs'
                      : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main Workspace View */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;
