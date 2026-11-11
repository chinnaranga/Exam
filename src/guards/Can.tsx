import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { PermissionToken, SystemRole } from '@/types/auth';
import { hasPermission, hasRole } from '@/utils/rbac';

interface CanProps {
  perform?: PermissionToken;
  role?: SystemRole | SystemRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({
  perform,
  role,
  children,
  fallback = null,
}) => {
  const { user } = useAuthStore();

  let isAllowed = true;

  if (perform && !hasPermission(user, perform)) {
    isAllowed = false;
  }

  if (role) {
    const rolesArray = Array.isArray(role) ? role : [role];
    if (!hasRole(user, rolesArray)) {
      isAllowed = false;
    }
  }

  return isAllowed ? <>{children}</> : <>{fallback}</>;
};

export default Can;
