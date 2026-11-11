import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { MOCK_ORGANIZATIONS } from "@/shared/services/authService";
import { useAuthStore } from "@/shared/stores/authStore";
import { useTenantStore } from "@/shared/stores/tenantStore";
import { toast } from 'sonner';
import { Building2, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export const SelectTenant: React.FC = () => {
  const navigate = useNavigate();
  const setActiveOrganization = useAuthStore((state) => state.setActiveOrganization);
  const activeOrganization = useAuthStore((state) => state.activeOrganization);
  const user = useAuthStore((state) => state.user);

  const handleSelectOrg = (org: typeof MOCK_ORGANIZATIONS[0]) => {
    localStorage.setItem('assessiq_tenant_id', org.id);
    setActiveOrganization(org);
    useTenantStore.getState().selectOrganization(org.id);
    toast.success(`Active Tenant Set: ${org.name}`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] via-[#111827] to-[#1e1b4b] flex items-center justify-center p-4">
      <Card className="glass-card border-white/10 p-8 max-w-3xl w-full shadow-2xl backdrop-blur-xl bg-surface/30">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Select Active Tenant Organization</h2>
          <p className="text-sm text-gray-400 mt-1">
            Logged in as <span className="text-white font-medium">{user?.email}</span>. Choose an organization context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {MOCK_ORGANIZATIONS.map((org) => {
            const isSelected = activeOrganization?.id === org.id;

            return (
              <div
                key={org.id}
                onClick={() => handleSelectOrg(org)}
                className={`card-hover p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-primary/15 border-primary text-white shadow-lg shadow-primary/10'
                    : 'bg-surface-dark/60 border-white/10 hover:border-white/20 text-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center font-bold text-primary">
                      {org.name.substring(0, 2).toUpperCase()}
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </div>
                  <h3 className="font-semibold text-lg text-white">{org.name}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-1">{org.slug}.examifypro.com</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-primary font-medium">
                  <span>Switch Scope Context</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-xs text-gray-400">
          <span>Need access to a different enterprise campus? Contact your System Administrator.</span>
        </div>
      </Card>
    </div>
  );
};

export default SelectTenant;
