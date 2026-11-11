import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import Layout from './components/Layout';
import Index from './pages/Index';
import CodingDashboard from './pages/coding/CodingDashboard';
import Exams from './pages/Exams';
import Users from './pages/Users';
import SecuritySettings from './pages/auth/SecuritySettings';
import NotFound from './pages/NotFound';

// Unified Enterprise Light Landing Page
import LightLanding from './pages/light/LightLanding';

// Multi-Portal Gateway & Specialized Login Suite
import PortalSelection from './pages/auth/PortalSelection';
import FacultyLogin from './portals/faculty/auth/FacultyLogin';
import InvigilatorLogin from './portals/invigilator/auth/InvigilatorLogin';
import OrgAdminLogin from './portals/org-admin/auth/OrgAdminLogin';
import SuperAdminLogin from './portals/super-admin/auth/SuperAdminLogin';
import CodingLogin from './portals/coding/auth/CodingLogin';

// Dedicated Enterprise Portals & Workspaces
import AdminLanding from './portals/admin/AdminLanding';
import AdminDashboard from './portals/admin/AdminDashboard';
import ProductionDashboard from './pages/admin/ProductionDashboard';

import FacultyLanding from './portals/faculty/FacultyLanding';
import FacultyDashboard from './portals/faculty/FacultyDashboard';
import FacultyLayout from './portals/faculty/shell/FacultyLayout';
import FacultyQuestionBank from './portals/faculty/FacultyQuestionBank';
import FacultyExamBuilder from './portals/faculty/FacultyExamBuilder';
import FacultyAnalytics from './portals/faculty/FacultyAnalytics';

import InvigilatorLanding from './portals/invigilator/InvigilatorLanding';
import InvigilatorDashboard from './portals/invigilator/InvigilatorDashboard';
import InvigilatorLayout from './portals/invigilator/shell/InvigilatorLayout';
import InvigilatorLiveGrid from './portals/invigilator/InvigilatorLiveGrid';
import InvigilatorIncidents from './portals/invigilator/InvigilatorIncidents';

import StudentLanding from './portals/student/StudentLanding';
import StudentDashboard from './portals/student/StudentDashboard';
import StudentLayout from './portals/student/shell/StudentLayout';
import StudentExamRunner from './portals/student/StudentExamRunner';
import StudentScheduledExams from './portals/student/StudentScheduledExams';
import StudentResults from './portals/student/StudentResults';
import StudentCertificates from './portals/student/StudentCertificates';
import StudentCourses from './portals/student/StudentCourses';
import StudentPractice from './portals/student/StudentPractice';
import StudentPlacement from './portals/student/StudentPlacement';
import StudentSettings from './portals/student/StudentSettings';
import StudentProfileOverview from './portals/student/profile/StudentProfileOverview';
import StudentProfileEdit from './portals/student/profile/StudentProfileEdit';
import StudentProfilePersonal from './portals/student/profile/StudentProfilePersonal';
import StudentProfileAcademic from './portals/student/profile/StudentProfileAcademic';
import StudentProfileContact from './portals/student/profile/StudentProfileContact';
import StudentProfileGuardian from './portals/student/profile/StudentProfileGuardian';
import StudentProfileEmergency from './portals/student/profile/StudentProfileEmergency';
import StudentProfilePreferences from './portals/student/profile/StudentProfilePreferences';
import StudentProfilePrivacy from './portals/student/profile/StudentProfilePrivacy';

import OrgAdminLayout from './portals/org-admin/shell/OrgAdminLayout';
import OrgAdminUsers from './portals/org-admin/OrgAdminUsers';
import OrgAdminStructure from './portals/org-admin/OrgAdminStructure';
import OrgAdminAssessments from './portals/org-admin/OrgAdminAssessments';

import SuperAdminLayout from './portals/super-admin/shell/SuperAdminLayout';
import SuperAdminTenants from './portals/super-admin/SuperAdminTenants';
import SuperAdminSecurity from './portals/super-admin/SuperAdminSecurity';
import SuperAdminPlatform from './portals/super-admin/SuperAdminPlatform';

// Phase 6 Enterprise Operations Command Center
import { EnterpriseCommandCenter } from './modules/enterprise-operations/EnterpriseCommandCenter';

// Student Auth Suite
import StudentLogin from './portals/student/auth/StudentLogin';
import StudentRegister from './portals/student/auth/StudentRegister';
import StudentVerifyEmail from './portals/student/auth/StudentVerifyEmail';
import StudentForgotPassword from './portals/student/auth/StudentForgotPassword';
import StudentResetPassword from './portals/student/auth/StudentResetPassword';
import StudentMFA from './portals/student/auth/StudentMFA';
import StudentAccountRecovery from './portals/student/auth/StudentAccountRecovery';

// Organization Admin Pages
import OrganizationDashboard from './pages/organization/OrganizationDashboard';
import BrandingSettings from './pages/organization/BrandingSettings';
import InvitationCenter from './pages/organization/InvitationCenter';
import WorkspaceSettings from './pages/organization/WorkspaceSettings';
import CampusManagement from './pages/organization/CampusManagement';
import DepartmentManagement from './pages/organization/DepartmentManagement';
import ProgramManagement from './pages/organization/ProgramManagement';
import WorkspaceManagement from './pages/organization/WorkspaceManagement';

// User Identity Center Pages
import ProfilePage from './pages/me/ProfilePage';
import ApiKeysPage from './pages/me/ApiKeysPage';
import PrivacyPage from './pages/me/PrivacyPage';
import ActivityPage from './pages/me/ActivityPage';

// Enterprise Security Center Pages
import SecurityCenterPage from './pages/security/SecurityCenterPage';
import MfaWizardPage from './pages/security/MfaWizardPage';
import CompliancePage from './pages/security/CompliancePage';

// Enterprise Integration & Developer Platform Pages
import IntegrationsPage from './pages/developer/IntegrationsPage';
import WebhooksPage from './pages/developer/WebhooksPage';
import JobQueuePage from './pages/developer/JobQueuePage';

// Phase 1 Enterprise Auth & Security Screens
import Welcome from './pages/auth/Welcome';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import SelectTenant from './pages/auth/SelectTenant';
import AccessDenied from './pages/auth/AccessDenied';
import SessionExpired from './pages/auth/SessionExpired';
import VerifyOTP from './pages/auth/VerifyOTP';
import MFAVerification from './pages/auth/MFAVerification';
import AccountLocked from './pages/auth/AccountLocked';
import Maintenance from './pages/auth/Maintenance';
import NetworkError from './pages/auth/NetworkError';
import VerifyEmail from './pages/auth/VerifyEmail';
import InvitationAccept from './pages/auth/InvitationAccept';
import OrgDiscovery from './pages/auth/OrgDiscovery';
import SessionsPage from './pages/auth/SessionsPage';
import DevicesPage from './pages/auth/DevicesPage';
import FirstLoginWizard from './pages/onboarding/FirstLoginWizard';

// Admin Authorization Pages
import RolesPage from './pages/admin/RolesPage';
import PermissionsPage from './pages/admin/PermissionsPage';
import PoliciesPage from './pages/admin/PoliciesPage';

// Guards
import AuthGuard from './guards/AuthGuard';
import TenantGuard from './guards/TenantGuard';
import RoleGuard from './guards/RoleGuard';

const queryClient = new QueryClient();

import { useEffect } from 'react';

const GlobalTabPresence = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let tabId = sessionStorage.getItem('assessiq_tab_id');
    if (!tabId) {
      tabId = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem('assessiq_tab_id', tabId);
    }
    const currentTabId = tabId;
    const updateTab = () => {
      localStorage.setItem(`assessiq_tab_${currentTabId}`, Date.now().toString());
    };
    updateTab();
    const timer = setInterval(updateTab, 1000);

    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('assessiq_global_presence') : null;
    if (channel) {
      channel.onmessage = (msg) => {
        if (msg.data?.type === 'PING_PRESENCE') {
          channel.postMessage({ type: 'PONG_PRESENCE', sender: currentTabId });
        }
      };
    }

    return () => {
      clearInterval(timer);
      localStorage.removeItem(`assessiq_tab_${currentTabId}`);
      if (channel) channel.close();
    };
  }, []);

  return null;
};

import ProctoringSuitePage from '@/engines/proctoring/pages/ProctoringSuitePage';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GlobalTabPresence />
      <Toaster />
      <Sonner position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* Global Enterprise Landing Page */}
          <Route path="/" element={<LightLanding />} />

          {/* AI Proctoring Suite & Operations Center Routes */}
          <Route
            path="/proctoring"
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'INVIGILATOR']}>
                  <StudentExamRunner />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/proctoring/consent"
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'INVIGILATOR']}>
                  <StudentExamRunner />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/proctoring/camera"
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'INVIGILATOR']}>
                  <StudentExamRunner />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/proctoring/operations"
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'INVIGILATOR']}>
                  <EnterpriseCommandCenter />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/operations"
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'INVIGILATOR']}>
                  <EnterpriseCommandCenter />
                </RoleGuard>
              </AuthGuard>
            }
          />

          {/* Enterprise Portal Gateway Selection */}
          <Route path="/auth" element={<PortalSelection />} />

          {/* Dedicated Fullscreen Student Lock-Down Exam Runner */}
          <Route
            path="/student/exams/runner"
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
                  <StudentExamRunner />
                </RoleGuard>
              </AuthGuard>
            }
          />

          {/* 1. Super Admin Dedicated Portal Suite */}
          <Route path="/admin" element={<AdminLanding />} />
          <Route path="/admin/login" element={<SuperAdminLogin />} />
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/coding/login" element={<CodingLogin />} />
          <Route
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                  <SuperAdminLayout />
                </RoleGuard>
              </AuthGuard>
            }
          >
            <Route path="/super-admin/dashboard" element={<AdminDashboard />} />
            <Route path="/super-admin/operations" element={<EnterpriseCommandCenter />} />
            <Route path="/super-admin/organizations" element={<SuperAdminTenants />} />
            <Route path="/super-admin/security" element={<SuperAdminSecurity />} />
            <Route path="/super-admin/platform" element={<SuperAdminPlatform />} />
          </Route>

          {/* 2. Organization Admin Dedicated Portal Suite */}
          <Route path="/organization/login" element={<OrgAdminLogin />} />
          <Route path="/org-admin/login" element={<OrgAdminLogin />} />
          <Route path="/organization/register" element={<Register />} />
          <Route
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={['ORGANIZATION_ADMIN', 'SUPER_ADMIN']}>
                  <OrgAdminLayout />
                </RoleGuard>
              </AuthGuard>
            }
          >
            <Route path="/organization" element={<OrganizationDashboard />} />
            <Route path="/org-admin/dashboard" element={<OrganizationDashboard />} />
            <Route path="/org-admin/operations" element={<EnterpriseCommandCenter />} />
            <Route path="/org-admin/users" element={<OrgAdminUsers />} />
            <Route path="/org-admin/organization" element={<OrgAdminStructure />} />
            <Route path="/org-admin/assessments" element={<OrgAdminAssessments />} />
          </Route>

          {/* 3. Faculty Dedicated Portal Suite */}
          <Route path="/faculty" element={<FacultyLanding />} />
          <Route path="/faculty/login" element={<FacultyLogin />} />
          <Route
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={['FACULTY', 'SUPER_ADMIN']}>
                  <FacultyLayout />
                </RoleGuard>
              </AuthGuard>
            }
          >
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/faculty/question-bank" element={<FacultyQuestionBank />} />
            <Route path="/faculty/exams" element={<FacultyExamBuilder />} />
            <Route path="/faculty/analytics" element={<FacultyAnalytics />} />
          </Route>

          {/* 4. Invigilator Dedicated Portal Suite */}
          <Route path="/invigilator" element={<InvigilatorLanding />} />
          <Route path="/invigilator/login" element={<InvigilatorLogin />} />
          <Route
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={['INVIGILATOR', 'SUPER_ADMIN']}>
                  <InvigilatorLayout />
                </RoleGuard>
              </AuthGuard>
            }
          >
            <Route path="/invigilator/dashboard" element={<InvigilatorDashboard />} />
            <Route path="/invigilator/live" element={<InvigilatorLiveGrid />} />
            <Route path="/invigilator/incidents" element={<InvigilatorIncidents />} />
          </Route>

          {/* 5. Student Dedicated Portal Suite */}
          <Route path="/student" element={<StudentLanding />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/verify-email" element={<StudentVerifyEmail />} />
          <Route path="/student/forgot-password" element={<StudentForgotPassword />} />
          <Route path="/student/reset-password" element={<StudentResetPassword />} />
          <Route path="/student/mfa" element={<StudentMFA />} />
          <Route path="/student/account-recovery" element={<StudentAccountRecovery />} />
          <Route
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
                  <StudentLayout />
                </RoleGuard>
              </AuthGuard>
            }
          >
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/exams" element={<StudentScheduledExams />} />
            <Route path="/student/practice" element={<StudentPractice />} />
            <Route path="/student/results" element={<StudentResults />} />
            <Route path="/student/certificates" element={<StudentCertificates />} />
            <Route path="/student/placement" element={<StudentPlacement />} />
            <Route path="/student/settings" element={<StudentSettings />} />
            <Route path="/student/profile" element={<StudentProfileOverview />} />
            <Route path="/student/profile/edit" element={<StudentProfileEdit />} />
            <Route path="/student/profile/personal" element={<StudentProfilePersonal />} />
            <Route path="/student/profile/academic" element={<StudentProfileAcademic />} />
            <Route path="/student/profile/contact" element={<StudentProfileContact />} />
            <Route path="/student/profile/guardian" element={<StudentProfileGuardian />} />
            <Route path="/student/profile/emergency" element={<StudentProfileEmergency />} />
            <Route path="/student/profile/preferences" element={<StudentProfilePreferences />} />
            <Route path="/student/profile/privacy" element={<StudentProfilePrivacy />} />
          </Route>

          {/* Public Enterprise Auth Routes */}
          <Route path="/auth/welcome" element={<Welcome />} />
          <Route path="/auth/discovery" element={<OrgDiscovery />} />
          <Route path="/auth/login" element={<PortalSelection />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/otp" element={<VerifyOTP />} />
          <Route path="/auth/mfa" element={<MFAVerification />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/invitation-accept" element={<InvitationAccept />} />
          <Route path="/auth/locked" element={<AccountLocked />} />
          <Route path="/auth/access-denied" element={<AccessDenied />} />
          <Route path="/auth/session-expired" element={<SessionExpired />} />
          <Route path="/auth/maintenance" element={<Maintenance />} />
          <Route path="/auth/network-error" element={<NetworkError />} />

          {/* Authenticated Onboarding & Tenant Selection */}
          <Route
            path="/auth/select-tenant"
            element={
              <AuthGuard>
                <SelectTenant />
              </AuthGuard>
            }
          />
          <Route
            path="/auth/onboarding"
            element={
              <AuthGuard>
                <FirstLoginWizard />
              </AuthGuard>
            }
          />

          {/* Authenticated & Tenant Protected Enterprise Workspace */}
          <Route
            element={
              <AuthGuard>
                <TenantGuard>
                  <Layout />
                </TenantGuard>
              </AuthGuard>
            }
          >
            <Route path="/dashboard" element={<Index />} />
            <Route
              path="/coding/dashboard"
              element={
                <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'FACULTY', 'EXAM_CREATOR', 'EVALUATOR']}>
                  <CodingDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/coding"
              element={
                <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'FACULTY', 'EXAM_CREATOR', 'EVALUATOR']}>
                  <CodingDashboard />
                </RoleGuard>
              }
            />

            {/* User Identity Center Routes */}
            <Route path="/me/profile" element={<ProfilePage />} />
            <Route path="/me/apikeys" element={<ApiKeysPage />} />
            <Route path="/me/privacy" element={<PrivacyPage />} />
            <Route path="/me/activity" element={<ActivityPage />} />

            {/* Enterprise Security Center Routes */}
            <Route path="/security/center" element={<SecurityCenterPage />} />
            <Route path="/security/mfa-wizard" element={<MfaWizardPage />} />
            <Route path="/security/compliance" element={<CompliancePage />} />

            {/* Enterprise Integration & Developer Platform Routes */}
            <Route
              path="/developer/integrations"
              element={
                <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'PLATFORM_ADMIN']}>
                  <IntegrationsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/developer/webhooks"
              element={
                <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'PLATFORM_ADMIN']}>
                  <WebhooksPage />
                </RoleGuard>
              }
            />
            <Route
              path="/developer/queues"
              element={
                <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'PLATFORM_ADMIN']}>
                  <JobQueuePage />
                </RoleGuard>
              }
            />

            {/* Admin Organization Management */}
            <Route
              path="/admin/dashboard"
              element={
                <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                  <AdminDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/operations"
              element={
                <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                  <EnterpriseCommandCenter />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/production-status"
              element={
                <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                  <ProductionDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/organization/dashboard"
              element={
                <RoleGuard allowedRoles={['ORGANIZATION_ADMIN', 'SUPER_ADMIN']}>
                  <OrganizationDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/organization/branding"
              element={
                <RoleGuard allowedRoles={['ORGANIZATION_ADMIN', 'SUPER_ADMIN']}>
                  <BrandingSettings />
                </RoleGuard>
              }
            />
            <Route
              path="/organization/invitations"
              element={
                <RoleGuard allowedRoles={['ORGANIZATION_ADMIN', 'SUPER_ADMIN']}>
                  <InvitationCenter />
                </RoleGuard>
              }
            />
            <Route
              path="/organization/workspace"
              element={
                <RoleGuard allowedRoles={['ORGANIZATION_ADMIN', 'SUPER_ADMIN']}>
                  <WorkspaceSettings />
                </RoleGuard>
              }
            />
            <Route
              path="/organization/campuses"
              element={
                <RoleGuard allowedRoles={['ORGANIZATION_ADMIN', 'SUPER_ADMIN']}>
                  <CampusManagement />
                </RoleGuard>
              }
            />
            <Route
              path="/organization/departments"
              element={
                <RoleGuard allowedRoles={['ORGANIZATION_ADMIN', 'SUPER_ADMIN']}>
                  <DepartmentManagement />
                </RoleGuard>
              }
            />
            <Route
              path="/organization/programs"
              element={
                <RoleGuard allowedRoles={['ORGANIZATION_ADMIN', 'SUPER_ADMIN']}>
                  <ProgramManagement />
                </RoleGuard>
              }
            />
            <Route
              path="/organization/workspaces"
              element={
                <RoleGuard allowedRoles={['ORGANIZATION_ADMIN', 'SUPER_ADMIN']}>
                  <WorkspaceManagement />
                </RoleGuard>
              }
            />

            <Route path="/auth/sessions" element={<SessionsPage />} />
            <Route path="/auth/devices" element={<DevicesPage />} />

            {/* Enterprise Authorization Engine Studio */}
            <Route
              path="/admin/roles"
              element={
                <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                  <RolesPage />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/permissions"
              element={
                <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                  <PermissionsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/policies"
              element={
                <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                  <PoliciesPage />
                </RoleGuard>
              }
            />

            <Route path="/exams" element={<Exams />} />
            <Route
              path="/users"
              element={
                <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'CAMPUS_ADMIN', 'FACULTY', 'RECRUITER', 'HR']}>
                  <Users />
                </RoleGuard>
              }
            />
            <Route path="/settings" element={<SecuritySettings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
