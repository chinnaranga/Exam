import React from 'react';
import { Route } from 'react-router-dom';
import AuthGuard from '@/shared/guards/AuthGuard';
import RoleGuard from '@/shared/guards/RoleGuard';

import InvigilatorLanding from './pages/InvigilatorLanding';
import InvigilatorLogin from './pages/auth/InvigilatorLogin';
import InvigilatorLayout from './layout/InvigilatorLayout';
import InvigilatorDashboard from './pages/InvigilatorDashboard';
import InvigilatorLiveGrid from './pages/InvigilatorLiveGrid';
import InvigilatorIncidents from './pages/InvigilatorIncidents';

const INVIGILATOR_ALLOWED_ROLES = [
  'INVIGILATOR',
  'PROCTOR',
  'CHIEF_PROCTOR',
  'SUPER_ADMIN',
];

export const InvigilatorRoutes = (
  <>
    <Route path="/invigilator" element={<InvigilatorLanding />} />
    <Route path="/invigilator/login" element={<InvigilatorLogin />} />
    <Route
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={INVIGILATOR_ALLOWED_ROLES}>
            <InvigilatorLayout />
          </RoleGuard>
        </AuthGuard>
      }
    >
      <Route path="/invigilator/dashboard" element={<InvigilatorDashboard />} />
      <Route path="/invigilator/live" element={<InvigilatorLiveGrid />} />
      <Route path="/invigilator/incidents" element={<InvigilatorIncidents />} />
    </Route>
  </>
);

export default InvigilatorRoutes;
