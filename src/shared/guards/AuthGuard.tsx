import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from "@/shared/stores/authStore";
import { getPortalLoginPath } from "@/shared/utils/rbac";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, accessToken, user } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#6C4DFF] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-[#6B6590]">Verifying Session Security...</p>
      </div>
    );
  }

  if (!isAuthenticated || !accessToken || !user) {
    const loginTarget = getPortalLoginPath(location.pathname);
    return <Navigate to={loginTarget} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
