import React from 'react';
import { Route } from 'react-router-dom';
import AuthGuard from '@/shared/guards/AuthGuard';
import RoleGuard from '@/shared/guards/RoleGuard';

import OrgAdminLogin from './pages/auth/OrgAdminLogin';
import OrgAdminLayout from './layout/OrgAdminLayout';
import OrganizationDashboard from './pages/OrganizationDashboard';
import OrgAdminUsers from './pages/OrgAdminUsers';
import OrgAdminStructure from './pages/OrgAdminStructure';
import OrgAdminAssessments from './pages/OrgAdminAssessments';
import BrandingSettings from './pages/BrandingSettings';
import InvitationCenter from './pages/InvitationCenter';
import WorkspaceSettings from './pages/WorkspaceSettings';
import CampusManagement from './pages/CampusManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import ProgramManagement from './pages/ProgramManagement';
import WorkspaceManagement from './pages/WorkspaceManagement';
import Users from './pages/Users';

const ORG_ADMIN_ROLES = ['ORGANIZATION_ADMIN', 'SUPER_ADMIN'];
const USER_MGMT_ROLES = ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'CAMPUS_ADMIN', 'FACULTY', 'RECRUITER', 'HR'];

export const OrgAdminRoutes = (
  <>
    {/* Public Org Admin Login */}
    <Route path="/organization/login" element={<OrgAdminLogin />} />
    <Route path="/org-admin/login" element={<OrgAdminLogin />} />

    {/* Protected Workspace Layout */}
    <Route
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={ORG_ADMIN_ROLES}>
            <OrgAdminLayout />
          </RoleGuard>
        </AuthGuard>
      }
    >
      <Route path="/org-admin/dashboard" element={<OrganizationDashboard />} />
      <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
      <Route path="/organization" element={<OrganizationDashboard />} />
      <Route path="/org-admin/users" element={<OrgAdminUsers />} />
      <Route path="/org-admin/organization" element={<OrgAdminStructure />} />
      <Route path="/org-admin/assessments" element={<OrgAdminAssessments />} />
      <Route path="/organization/branding" element={<BrandingSettings />} />
      <Route path="/organization/invitations" element={<InvitationCenter />} />
      <Route path="/organization/workspace" element={<WorkspaceSettings />} />
      <Route path="/organization/campuses" element={<CampusManagement />} />
      <Route path="/organization/departments" element={<DepartmentManagement />} />
      <Route path="/organization/programs" element={<ProgramManagement />} />
      <Route path="/organization/workspaces" element={<WorkspaceManagement />} />
    </Route>

    {/* Protected Global Users Management */}
    <Route
      path="/users"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={USER_MGMT_ROLES}>
            <Users />
          </RoleGuard>
        </AuthGuard>
      }
    />
  </>
);

export default OrgAdminRoutes;
