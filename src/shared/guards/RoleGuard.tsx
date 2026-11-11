import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from "@/shared/stores/authStore";
import { SystemRole } from "@/shared/types/auth";
import { hasRole, getPortalLoginPath } from "@/shared/utils/rbac";
import { toast } from 'sonner';

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
  const location = useLocation();

  const userRole = user?.roles?.[0]?.roleName;
  const userHasRole = user ? hasRole(user, allowedRoles) : false;

  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !userHasRole) {
      toast.warning('Role Boundary Enforced', {
        description: `Your active persona is [${userRole || 'UNKNOWN'}]. Please authenticate with an authorized account.`,
      });
    }
  }, [isLoading, isAuthenticated, user, userHasRole, userRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#6C4DFF] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-[#6B6590]">Verifying Role Security...</p>
      </div>
    );
  }

  if (!isAuthenticated || !accessToken || !user) {
    const loginTarget = getPortalLoginPath(location.pathname);
    return <Navigate to={loginTarget} state={{ from: location }} replace />;
  }

  if (!userHasRole) {
    // If a custom fallback was explicitly provided, use it
    if (fallbackPath && fallbackPath !== '/auth/access-denied') {
      return <Navigate to={fallbackPath} replace />;
    }

    // Direct the user to the login page of the portal they are attempting to enter
    const portalLogin = getPortalLoginPath(location.pathname);
    if (portalLogin && portalLogin !== location.pathname) {
      return <Navigate to={portalLogin} state={{ from: location }} replace />;
    }

    return <Navigate to="/auth/access-denied" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
