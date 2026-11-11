import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import {
  Server,
  Building2,
  ShieldCheck,
  Activity,
  LogOut,
  Cpu,
} from 'lucide-react';

export const SuperAdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: Server, label: 'Control Plane Dashboard', path: '/super-admin/dashboard' },
    { icon: Cpu, label: 'Enterprise Operations Command Center', path: '/super-admin/operations' },
    { icon: Building2, label: 'Multi-Tenant Organizations', path: '/super-admin/organizations' },
    { icon: ShieldCheck, label: 'RLS Security & Threat Engine', path: '/super-admin/security' },
    { icon: Activity, label: 'Cluster Telemetry & Health', path: '/super-admin/platform' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0F172A] text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <Link to="/super-admin/dashboard" className="flex items-center space-x-3">
            <BrandLogo size="md" variant="dark" />
          </Link>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
            SUPER ADMIN CONTROL PLANE
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs font-sans">
          <span className="font-bold text-slate-200">Alex Vance (Super Admin)</span>
          <Button onClick={() => { logout(); navigate('/super-admin/login'); }} variant="ghost" size="sm" className="text-red-400 hover:bg-slate-800 text-xs">
            <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      {/* Body Shell */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-slate-300 p-4 space-y-4 border-r border-slate-800">
          <p className="text-[10px] font-mono uppercase font-bold text-slate-400 px-3 tracking-wider">
            PLATFORM OPERATIONS
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
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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

export default SuperAdminLayout;
