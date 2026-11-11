import React from 'react';
import { Home, BookOpen, Users, Settings, LogOut, ShieldCheck, Key, Laptop, Cpu, Building2, Code } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Signed out of session');
    navigate('/auth');
  };

  const userRole = user?.roles?.[0]?.roleName;
  const isAdmin = !userRole || userRole === 'SUPER_ADMIN' || userRole === 'ORGANIZATION_ADMIN' || userRole === 'CAMPUS_ADMIN';

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Code, label: 'Coding Platform', path: '/coding/dashboard' },
    { icon: Building2, label: 'Organization Admin', path: '/organization', adminOnly: true },
    { icon: BookOpen, label: 'Exams Engine', path: '/exams' },
    { icon: Users, label: 'User Directory', path: '/users', adminOnly: true },
    { icon: Laptop, label: 'Active Sessions', path: '/auth/sessions' },
    { icon: ShieldCheck, label: 'Recognized Devices', path: '/auth/devices' },
    { icon: Key, label: 'RBAC Roles', path: '/admin/roles', adminOnly: true },
    { icon: Cpu, label: 'ABAC Policies', path: '/admin/policies', adminOnly: true },
    { icon: Settings, label: 'Security & Auth', path: '/settings' },
  ].filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="w-64 bg-[#FAFBFC] border-r border-[#E5E7EB] p-4 flex flex-col justify-between font-sans text-[#111827]">
      <div className="space-y-5">
        {/* User Identity Info Box */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-[#6B7280]">Authenticated User</span>
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          </div>
          <p className="text-xs font-bold text-[#111827] truncate">{user?.firstName || 'admin'} {user?.lastName || 'Account'}</p>
          <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] text-[10px] font-bold font-mono border border-blue-200">
            {user?.roles?.[0]?.roleName || 'SUPER_ADMIN'}
          </span>
        </div>

        {/* Navigation Context */}
        <div className="space-y-1">
          <p className="text-[10px] font-mono uppercase font-bold text-[#9CA3AF] px-3 tracking-wider mb-2">
            ORGANIZATION WORKSPACE
          </p>
          {menuItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-2xs font-bold'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-white'
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
        onClick={handleLogout}
        className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#6B7280] hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-200 cursor-pointer"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
