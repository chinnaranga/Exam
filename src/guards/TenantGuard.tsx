import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface TenantGuardProps {
  children: React.ReactNode;
}

export const TenantGuard: React.FC<TenantGuardProps> = ({ children }) => {
  const { activeOrganization, user } = useAuthStore();

  // Super Admin can bypass organization selection if needed, but standard users must have active organization context
  const isSuperAdmin = user?.roles.some((r) => r.roleName === 'SUPER_ADMIN');

  if (!activeOrganization && !isSuperAdmin) {
    return <Navigate to="/auth/select-tenant" replace />;
  }

  return <>{children}</>;
};

export default TenantGuard;
