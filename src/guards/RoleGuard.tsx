import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { SystemRole } from '@/types/auth';
import { hasRole } from '@/utils/rbac';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: SystemRole[];
  fallbackPath?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackPath = '/auth/access-denied',
}) => {
  const { user, isAuthenticated, accessToken, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Verifying Role Security...</p>
      </div>
    );
  }

  if (!isAuthenticated || !accessToken || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasRole(user, allowedRoles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
