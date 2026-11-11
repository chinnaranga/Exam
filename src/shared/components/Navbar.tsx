import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Building2, KeyRound, ChevronDown, CheckCircle2, Sparkles, LogOut } from 'lucide-react';
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
    toast.success('Signed out of session');
    navigate('/auth');
  };

  const handleSwitchTenant = (orgId: string) => {
    const org = MOCK_ORGANIZATIONS.find((o) => o.id === orgId);
    if (org) {
      localStorage.setItem('assessiq_tenant_id', org.id);
      setActiveOrganization(org);
      toast.success(`Active Tenant: ${org.name}`);
    }
  };

  return (
    <nav className="bg-white border-b-2 border-dashed border-[#2B2350]/20 px-6 py-3.5 flex items-center justify-between font-body text-[#2B2350]">
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#6C4DFF] text-white flex items-center justify-center shadow-xs group-hover:bg-[#5A3DEB] transition-colors">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight text-[#2B2350]">
            Assess<span className="text-[#6C4DFF]">IQ</span>
          </span>
        </Link>

        {/* Tenant Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden md:flex items-center space-x-2 bg-[#FFF3A3]/30 border-2 border-[#2B2350]/30 hover:border-[#2B2350] px-3 py-1.5 rounded-xl font-mono text-xs text-[#2B2350] transition-colors shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-[#6C4DFF]" />
              <span className="font-bold max-w-[180px] truncate">{activeOrganization?.name || 'Select Campus'}</span>
              <ChevronDown className="w-3 h-3 text-[#6B6590]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 bg-white border-2 border-[#2B2350] rounded-2xl shadow-[4px_4px_0px_#2B2350] text-[#2B2350]">
            <DropdownMenuLabel className="text-[10px] text-[#6B6590] uppercase font-mono tracking-wider">
              Switch Institutional Campus
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2B2350]/15" />
            {MOCK_ORGANIZATIONS.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleSwitchTenant(org.id)}
                className="flex items-center justify-between text-xs cursor-pointer hover:bg-[#FFF3A3]/50 font-mono py-2"
              >
                <span className="font-bold text-[#2B2350]">{org.name}</span>
                {activeOrganization?.id === org.id && <span className="text-xs text-[#10B981] font-bold">✓ ACTIVE</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => toast.info('Integrity Sentinel Active: 0 violations logged.')}
          className="relative p-2 rounded-xl border border-[#2B2350]/20 hover:bg-[#FFF3A3]/30 text-[#2B2350] transition-colors"
          title="System Alerts"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#10B981] rounded-full animate-pulse" />
        </button>

        {/* User Account Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 text-xs text-[#2B2350] p-1.5 rounded-xl border border-[#2B2350]/20 hover:bg-[#FFF3A3]/30 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-[#6C4DFF] text-white flex items-center justify-center font-bold text-xs font-mono shadow-xs">
                {user?.firstName?.charAt(0) || 'A'}
              </div>
              <span className="font-bold hidden sm:inline font-mono">{user?.firstName || 'Arthur'} {user?.lastName || 'Vance'}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-2 border-[#2B2350] rounded-2xl shadow-[4px_4px_0px_#2B2350] text-[#2B2350]">
            <DropdownMenuLabel className="text-xs font-mono text-[#6B6590] truncate">{user?.email || 'admin@assessiq.com'}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2B2350]/15" />
            <DropdownMenuItem onClick={() => navigate('/settings')} className="text-xs cursor-pointer font-mono hover:bg-[#FFF3A3]/50">
              <KeyRound className="w-3.5 h-3.5 mr-2 text-[#6C4DFF]" />
              Security Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/auth')} className="text-xs cursor-pointer font-mono hover:bg-[#FFF3A3]/50">
              <Building2 className="w-3.5 h-3.5 mr-2 text-[#6C4DFF]" />
              Role Gateway Selector
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2B2350]/15" />
            <DropdownMenuItem onClick={handleLogout} className="text-xs text-[#FF4D5E] hover:bg-[#FFB5A7]/30 cursor-pointer font-mono font-bold">
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Sign Out Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
