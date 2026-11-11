import React from 'react';
import { PortalAuthLayout } from '@/pages/auth/PortalAuthLayout';
import { Server } from 'lucide-react';

export const SuperAdminLogin: React.FC = () => {
  return (
    <PortalAuthLayout
      portalTitle="Super Admin Portal"
      portalSubtitle="AssessIQ multi-tenant infrastructure control plane, RLS isolation policies, global threat radar, and platform telemetry."
      badgeLabel="SUPER ADMIN ACCESS"
      badgeColorClass="bg-slate-100 text-[#0F172A] border-slate-300"
      accentColor="#0F172A"
      defaultEmail="superadmin@assessiq.com"
      role="SUPER_ADMIN"
      redirectPath="/admin/dashboard"
      features={[
        'Global Multi-Tenant Infrastructure Control Plane',
        'PostgreSQL Row Level Security (RLS) Policies',
        'Real-Time Security & AI Risk Engine Telemetry',
        'Cluster Health & Production Environment Status',
      ]}
      icon={Server}
    />
  );
};

export default SuperAdminLogin;
