import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { PermissionToken } from '@/types/auth';
import { hasPermission } from '@/utils/rbac';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: PermissionToken;
  fallbackPath?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  fallbackPath = '/auth/access-denied',
}) => {
  const { user } = useAuthStore();

  if (!hasPermission(user, requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default PermissionGuard;
