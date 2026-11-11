import React from 'react';
import { Route } from 'react-router-dom';
import AuthGuard from '@/shared/guards/AuthGuard';
import RoleGuard from '@/shared/guards/RoleGuard';

import AdminLanding from './pages/AdminLanding';
import SuperAdminLogin from './pages/auth/SuperAdminLogin';
import SuperAdminLayout from './layout/SuperAdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminTenants from './pages/SuperAdminTenants';
import SuperAdminSecurity from './pages/SuperAdminSecurity';
import SuperAdminPlatform from './pages/SuperAdminPlatform';
import ProductionDashboard from './pages/ProductionDashboard';
import RolesPage from './pages/RolesPage';
import PermissionsPage from './pages/PermissionsPage';
import PoliciesPage from './pages/PoliciesPage';
import SecurityCenterPage from './pages/SecurityCenterPage';
import CompliancePage from './pages/CompliancePage';
import IntegrationsPage from './pages/IntegrationsPage';
import WebhooksPage from './pages/WebhooksPage';
import JobQueuePage from './pages/JobQueuePage';

const SUPER_ADMIN_ROLES = ['SUPER_ADMIN'];
const DEVELOPER_ROLES = ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'PLATFORM_ADMIN'];

export const SuperAdminRoutes = (
  <>
    {/* Public Landing & Login */}
    <Route path="/admin" element={<AdminLanding />} />
    <Route path="/admin/login" element={<SuperAdminLogin />} />
    <Route path="/super-admin/login" element={<SuperAdminLogin />} />

    {/* Protected Super Admin Studio */}
    <Route
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={SUPER_ADMIN_ROLES}>
            <SuperAdminLayout />
          </RoleGuard>
        </AuthGuard>
      }
    >
      <Route path="/super-admin/dashboard" element={<AdminDashboard />} />
      <Route path="/super-admin/organizations" element={<SuperAdminTenants />} />
      <Route path="/super-admin/security" element={<SuperAdminSecurity />} />
      <Route path="/super-admin/platform" element={<SuperAdminPlatform />} />
    </Route>

    {/* Dedicated Admin Dashboards & Governance */}
    <Route
      path="/admin/dashboard"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={SUPER_ADMIN_ROLES}>
            <AdminDashboard />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/admin/production-status"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={SUPER_ADMIN_ROLES}>
            <ProductionDashboard />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/admin/roles"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={SUPER_ADMIN_ROLES}>
            <RolesPage />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/admin/permissions"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={SUPER_ADMIN_ROLES}>
            <PermissionsPage />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/admin/policies"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={SUPER_ADMIN_ROLES}>
            <PoliciesPage />
          </RoleGuard>
        </AuthGuard>
      }
    />

    {/* Security & Compliance Suite */}
    <Route
      path="/security/center"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={SUPER_ADMIN_ROLES}>
            <SecurityCenterPage />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/security/compliance"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={SUPER_ADMIN_ROLES}>
            <CompliancePage />
          </RoleGuard>
        </AuthGuard>
      }
    />

    {/* Developer & Platform Engineering */}
    <Route
      path="/developer/integrations"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={DEVELOPER_ROLES}>
            <IntegrationsPage />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/developer/webhooks"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={DEVELOPER_ROLES}>
            <WebhooksPage />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/developer/queues"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={DEVELOPER_ROLES}>
            <JobQueuePage />
          </RoleGuard>
        </AuthGuard>
      }
    />
  </>
);

export default SuperAdminRoutes;
