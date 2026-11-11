import React from 'react';
import { Home, BookOpen, Users, Settings, Key, Laptop, Cpu, Building2, Code, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from "@/shared/stores/authStore";
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
    { icon: Key, label: 'RBAC Roles', path: '/admin/roles', adminOnly: true },
    { icon: Cpu, label: 'ABAC Policies', path: '/admin/policies', adminOnly: true },
    { icon: Settings, label: 'Security & Auth', path: '/settings' },
  ].filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="w-64 bg-white/80 border-r-2 border-dashed border-[#2B2350]/20 p-4 flex flex-col justify-between font-body text-[#2B2350]">
      <div className="space-y-5">
        {/* User Identity Info Box */}
        <div className="p-3.5 rounded-2xl bg-[#FFF3A3]/40 border-2 border-[#2B2350] space-y-1 shadow-[3px_3px_0px_#2B2350]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-[#6B6590]">AUTHENTICATED ID</span>
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          </div>
          <p className="text-xs font-heading font-extrabold text-[#2B2350] truncate">
            {user?.firstName || 'Admin'} {user?.lastName || 'Account'}
          </p>
          <div className="pt-1">
            <span className="inline-block px-2 py-0.5 rounded-full bg-white text-[#2B2350] text-[9px] font-bold font-mono border border-[#2B2350]">
              {user?.roles?.[0]?.roleName || 'SUPER_ADMIN'}
            </span>
          </div>
        </div>

        {/* Navigation Context */}
        <div className="space-y-1 font-mono text-xs">
          <p className="text-[10px] font-mono uppercase font-bold text-[#6B6590] px-3 tracking-wider mb-2">
            WORKSPACE NAVIGATION
          </p>
          {menuItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  isActive
                    ? 'bg-[#6C4DFF] text-white shadow-xs'
                    : 'text-[#2B2350] hover:bg-[#FFF3A3]/40 hover:text-[#2B2350]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6C4DFF]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t-2 border-dashed border-[#2B2350]/20 font-mono text-[11px] text-[#6B6590] space-y-2">
        <div className="flex items-center justify-between">
          <span>PORTAL: ONLINE</span>
          <span className="text-[#10B981] font-bold">100% HEALTH</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center space-x-2 text-[#FF4D5E] font-bold hover:underline pt-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Workspace</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
