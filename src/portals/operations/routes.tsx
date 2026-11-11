import React from 'react';
import { Route } from 'react-router-dom';
import AuthGuard from '@/shared/guards/AuthGuard';
import RoleGuard from '@/shared/guards/RoleGuard';

import { EnterpriseCommandCenter } from './pages/EnterpriseCommandCenter';
import ProctoringSuitePage from '@/engines/proctoring/pages/ProctoringSuitePage';

const OPERATIONS_ALLOWED_ROLES = ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'PLATFORM_ADMIN'];
const PROCTORING_ALLOWED_ROLES = ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'INVIGILATOR', 'FACULTY'];

export const OperationsRoutes = (
  <>
    {/* Enterprise Operations Center */}
    <Route
      path="/operations"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={OPERATIONS_ALLOWED_ROLES}>
            <EnterpriseCommandCenter />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/admin/operations"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={['SUPER_ADMIN']}>
            <EnterpriseCommandCenter />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/super-admin/operations"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={['SUPER_ADMIN']}>
            <EnterpriseCommandCenter />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/org-admin/operations"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={['ORGANIZATION_ADMIN', 'SUPER_ADMIN']}>
            <EnterpriseCommandCenter />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/proctoring/operations"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={OPERATIONS_ALLOWED_ROLES}>
            <EnterpriseCommandCenter />
          </RoleGuard>
        </AuthGuard>
      }
    />

    {/* Proctoring Diagnostic Suite */}
    <Route
      path="/proctoring/suite"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={PROCTORING_ALLOWED_ROLES}>
            <ProctoringSuitePage />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/proctoring"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={PROCTORING_ALLOWED_ROLES}>
            <ProctoringSuitePage />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/proctoring/consent"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={PROCTORING_ALLOWED_ROLES}>
            <ProctoringSuitePage />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/proctoring/camera"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={PROCTORING_ALLOWED_ROLES}>
            <ProctoringSuitePage />
          </RoleGuard>
        </AuthGuard>
      }
    />
  </>
);

export default OperationsRoutes;
