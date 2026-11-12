import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/shared/components/ui/toaster';
import { Toaster as Sonner } from '@/shared/components/ui/sonner';
import { TooltipProvider } from '@/shared/components/ui/tooltip';

// Shared Layout & Pages
import Layout from '@/shared/components/Layout';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import RoleAwareDashboardRedirect from '@/shared/components/RoleAwareDashboardRedirect';
import Index from '@/portals/public/pages/Index';
import Exams from '@/shared/pages/Exams';
import SecuritySettings from '@/shared/pages/SecuritySettings';
import SessionsPage from '@/shared/pages/SessionsPage';
import DevicesPage from '@/shared/pages/DevicesPage';
import ProfilePage from '@/shared/pages/me/ProfilePage';
import ApiKeysPage from '@/shared/pages/me/ApiKeysPage';
import PrivacyPage from '@/shared/pages/me/PrivacyPage';
import ActivityPage from '@/shared/pages/me/ActivityPage';
import NotFound from '@/shared/pages/NotFound';
import AccessDenied from '@/shared/pages/AccessDenied';
import AccountLocked from '@/shared/pages/AccountLocked';
import SessionExpired from '@/shared/pages/SessionExpired';
import Maintenance from '@/shared/pages/Maintenance';
import NetworkError from '@/shared/pages/NetworkError';
import MFAVerification from '@/shared/pages/MFAVerification';
import MfaWizardPage from '@/shared/pages/MfaWizardPage';
import MobileCameraStreamer from '@/portals/student/pages/MobileCameraStreamer';
import StudentDemoExam from '@/portals/student/pages/StudentDemoExam';

// Self-Contained Role Portals
import { PublicRoutes } from '@/portals/public';
import { StudentRoutes } from '@/portals/student';
import { FacultyRoutes } from '@/portals/faculty';
import { InvigilatorRoutes } from '@/portals/invigilator';
import { OrgAdminRoutes } from '@/portals/org-admin';
import { SuperAdminRoutes } from '@/portals/super-admin';
import { CodingRoutes } from '@/portals/coding';
import { OperationsRoutes } from '@/portals/operations';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const PortalFallback: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm font-medium text-muted-foreground">Loading workspace...</p>
    </div>
  </div>
);

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<PortalFallback />}>
          <ErrorBoundary>
            <Routes>
              {/* 1. Public Portal Routes */}
            {PublicRoutes}
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/mobile-camera" element={<MobileCameraStreamer />} />
            <Route path="/demo-exam" element={<StudentDemoExam />} />
            <Route path="/demo" element={<StudentDemoExam />} />

            {/* 2. Student Portal Routes */}
            {StudentRoutes}

            {/* 3. Faculty Portal Routes */}
            {FacultyRoutes}

            {/* 4. Invigilator Portal Routes */}
            {InvigilatorRoutes}

            {/* 5. Org Admin Portal Routes */}
            {OrgAdminRoutes}

            {/* 6. Super Admin Portal Routes */}
            {SuperAdminRoutes}

            {/* 7. Coding Portal Routes */}
            {CodingRoutes}

            {/* 8. Operations Portal Routes */}
            {OperationsRoutes}

            {/* Shared Global Error & Account Recovery Routes */}
            <Route path="/auth/locked" element={<AccountLocked />} />
            <Route path="/auth/access-denied" element={<AccessDenied />} />
            <Route path="/auth/session-expired" element={<SessionExpired />} />
            <Route path="/auth/maintenance" element={<Maintenance />} />
            <Route path="/auth/network-error" element={<NetworkError />} />
            <Route path="/auth/mfa" element={<MFAVerification />} />
            <Route path="/security/mfa-wizard" element={<MfaWizardPage />} />

            {/* Shared Authenticated Layout Shell */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<RoleAwareDashboardRedirect />} />
              <Route path="/overview" element={<Index />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/settings" element={<SecuritySettings />} />
              <Route path="/auth/sessions" element={<SessionsPage />} />
              <Route path="/auth/devices" element={<DevicesPage />} />
              <Route path="/me/profile" element={<ProfilePage />} />
              <Route path="/me/apikeys" element={<ApiKeysPage />} />
              <Route path="/me/privacy" element={<PrivacyPage />} />
              <Route path="/me/activity" element={<ActivityPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
