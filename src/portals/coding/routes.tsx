import React from 'react';
import { Route } from 'react-router-dom';
import AuthGuard from '@/shared/guards/AuthGuard';
import RoleGuard from '@/shared/guards/RoleGuard';

import CodingLogin from './pages/auth/CodingLogin';
import CodingDashboard from './pages/CodingDashboard';

const CODING_ALLOWED_ROLES = [
  'SUPER_ADMIN',
  'ORGANIZATION_ADMIN',
  'FACULTY',
  'STUDENT',
];

export const CodingRoutes = (
  <>
    <Route path="/coding/login" element={<CodingLogin />} />
    <Route
      path="/coding/dashboard"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={CODING_ALLOWED_ROLES}>
            <CodingDashboard />
          </RoleGuard>
        </AuthGuard>
      }
    />
    <Route
      path="/coding"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={CODING_ALLOWED_ROLES}>
            <CodingDashboard />
          </RoleGuard>
        </AuthGuard>
      }
    />
  </>
);

export default CodingRoutes;
