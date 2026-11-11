import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Shield, Building2, User, LogOut, KeyRound, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import BrandLogo from "@/shared/components/BrandLogo";
import { useAuthStore } from "@/shared/stores/authStore";
import { MOCK_ORGANIZATIONS } from "@/shared/services/authService";
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeOrganization, logout, setActiveOrganization } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const handleSwitchTenant = (orgId: string) => {
    const org = MOCK_ORGANIZATIONS.find((o) => o.id === orgId);
    if (org) {
      localStorage.setItem('examifypro_tenant_id', org.id);
      setActiveOrganization(org);
      toast.success(`Active Tenant: ${org.name}`);
    }
  };

  return (
    <nav className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between font-sans text-[#111827]">
      <div className="flex items-center space-x-6">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <BrandLogo size="md" variant="light" />
        </Link>

        {/* Tenant Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-2 bg-[#FAFBFC] border-[#E5E7EB] text-xs text-[#111827] hover:bg-[#F5F7FA]">
              <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="font-semibold max-w-[180px] truncate">{activeOrganization?.name || 'Select Tenant'}</span>
              <ChevronDown className="w-3 h-3 text-[#6B7280]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 bg-white border-[#E5E7EB] text-[#111827]">
            <DropdownMenuLabel className="text-[10px] text-[#6B7280] uppercase font-mono">Switch Institutional Tenant</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E5E7EB]" />
            {MOCK_ORGANIZATIONS.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleSwitchTenant(org.id)}
                className="flex items-center justify-between text-xs cursor-pointer hover:bg-[#FAFBFC]"
              >
                <span>{org.name}</span>
                {activeOrganization?.id === org.id && <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="relative text-[#6B7280] hover:text-[#111827]" onClick={() => toast.info('3 Active System Alerts')}>
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-[#2563EB] rounded-full animate-pulse" />
        </Button>

        {/* User Account Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-xs text-[#111827] hover:bg-[#FAFBFC]">
              <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                {user?.firstName?.charAt(0) || 'E'}
              </div>
              <span className="font-semibold hidden sm:inline">{user?.firstName || 'Eleanor'} {user?.lastName || 'Rousseau'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-[#E5E7EB] text-[#111827]">
            <DropdownMenuLabel className="text-xs font-mono text-[#6B7280]">{user?.email || 'admin@mit.edu'}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E5E7EB]" />
            <DropdownMenuItem onClick={() => navigate('/settings')} className="text-xs cursor-pointer">
              <KeyRound className="w-3.5 h-3.5 mr-2 text-[#2563EB]" />
              Security Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/auth/select-tenant')} className="text-xs cursor-pointer">
              <Building2 className="w-3.5 h-3.5 mr-2 text-[#2563EB]" />
              Select Tenant Context
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#E5E7EB]" />
            <DropdownMenuItem onClick={handleLogout} className="text-xs text-red-600 hover:bg-red-50 cursor-pointer">
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
