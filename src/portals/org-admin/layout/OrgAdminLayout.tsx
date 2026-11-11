import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from "@/shared/components/BrandLogo";
import { Button } from '@/components/ui/button';
import { useAuthStore } from "@/shared/stores/authStore";
import {
  Building2,
  Users,
  Layers,
  BookOpen,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export const OrgAdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: Building2, label: 'Org Admin Dashboard', path: '/org-admin/dashboard' },
    { icon: ShieldCheck, label: 'Enterprise Operations Command Center', path: '/org-admin/operations' },
    { icon: Users, label: 'User Directory & Invites', path: '/org-admin/users' },
    { icon: Layers, label: 'Campus & Academic Structure', path: '/org-admin/organization' },
    { icon: BookOpen, label: 'Institutional Assessments', path: '/org-admin/assessments' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/org-admin/dashboard" className="flex items-center space-x-3">
            <BrandLogo size="md" variant="light" />
          </Link>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-[#15803D] px-2.5 py-1 rounded-full border border-emerald-200">
            ORGANIZATION ADMIN WORKSPACE
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs font-sans">
          <span className="font-bold text-[#0F172A]">Eleanor Rousseau (Org Admin)</span>
          <Button onClick={() => { logout(); navigate('/org-admin/login'); }} variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 text-xs">
            <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      {/* Body Shell */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[#E2E8F0] p-4 space-y-4">
          <p className="text-[10px] font-mono uppercase font-bold text-[#64748B] px-3 tracking-wider">
            ADMINISTRATION NAVIGATION
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
                      ? 'bg-[#1E40AF] text-white font-bold shadow-xs'
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

export default OrgAdminLayout;
