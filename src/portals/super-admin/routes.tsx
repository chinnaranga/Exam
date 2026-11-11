import React from 'react';
import { Route } from 'react-router-dom';
import SuperAdminComingSoon from './pages/SuperAdminComingSoon';

export const SuperAdminRoutes = (
  <>
    {/* Super Admin Portal - Coming Soon */}
    <Route path="/super-admin" element={<SuperAdminComingSoon />} />
    <Route path="/super-admin/coming-soon" element={<SuperAdminComingSoon />} />
    <Route path="/super-admin/login" element={<SuperAdminComingSoon />} />
    <Route path="/super-admin/dashboard" element={<SuperAdminComingSoon />} />
    <Route path="/super-admin/organizations" element={<SuperAdminComingSoon />} />
    <Route path="/super-admin/security" element={<SuperAdminComingSoon />} />
    <Route path="/super-admin/platform" element={<SuperAdminComingSoon />} />
    <Route path="/super-admin/*" element={<SuperAdminComingSoon />} />

    <Route path="/admin" element={<SuperAdminComingSoon />} />
    <Route path="/admin/coming-soon" element={<SuperAdminComingSoon />} />
    <Route path="/admin/login" element={<SuperAdminComingSoon />} />
    <Route path="/admin/dashboard" element={<SuperAdminComingSoon />} />
    <Route path="/admin/production-status" element={<SuperAdminComingSoon />} />
    <Route path="/admin/roles" element={<SuperAdminComingSoon />} />
    <Route path="/admin/permissions" element={<SuperAdminComingSoon />} />
    <Route path="/admin/policies" element={<SuperAdminComingSoon />} />
    <Route path="/admin/*" element={<SuperAdminComingSoon />} />

    <Route path="/security/center" element={<SuperAdminComingSoon />} />
    <Route path="/security/compliance" element={<SuperAdminComingSoon />} />
    <Route path="/developer/integrations" element={<SuperAdminComingSoon />} />
    <Route path="/developer/webhooks" element={<SuperAdminComingSoon />} />
    <Route path="/developer/queues" element={<SuperAdminComingSoon />} />
  </>
);

export default SuperAdminRoutes;
