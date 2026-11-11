import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';
import { getRoleHomeDashboard } from '@/shared/utils/rbac';

export const RoleAwareDashboardRedirect: React.FC = () => {
  const { isAuthenticated, accessToken, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FAFAF7]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6C4DFF] border-t-transparent" />
          <p className="text-sm font-mono font-medium text-[#6B6590]">Verifying clearance & routing to portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !accessToken || !user) {
    return <Navigate to="/auth" replace />;
  }

  const primaryRole = user.roles?.[0]?.roleName;
  const target = getRoleHomeDashboard(primaryRole);

  return <Navigate to={target} replace />;
};

export default RoleAwareDashboardRedirect;

