import React from 'react';
import { Route } from 'react-router-dom';
import OrgAdminComingSoon from './pages/OrgAdminComingSoon';

export const OrgAdminRoutes = (
  <>
    {/* Organization Admin Portal - Coming Soon */}
    <Route path="/org-admin" element={<OrgAdminComingSoon />} />
    <Route path="/org-admin/coming-soon" element={<OrgAdminComingSoon />} />
    <Route path="/org-admin/login" element={<OrgAdminComingSoon />} />
    <Route path="/org-admin/dashboard" element={<OrgAdminComingSoon />} />
    <Route path="/org-admin/users" element={<OrgAdminComingSoon />} />
    <Route path="/org-admin/organization" element={<OrgAdminComingSoon />} />
    <Route path="/org-admin/assessments" element={<OrgAdminComingSoon />} />
    <Route path="/org-admin/*" element={<OrgAdminComingSoon />} />

    <Route path="/organization" element={<OrgAdminComingSoon />} />
    <Route path="/organization/coming-soon" element={<OrgAdminComingSoon />} />
    <Route path="/organization/login" element={<OrgAdminComingSoon />} />
    <Route path="/organization/dashboard" element={<OrgAdminComingSoon />} />
    <Route path="/organization/branding" element={<OrgAdminComingSoon />} />
    <Route path="/organization/invitations" element={<OrgAdminComingSoon />} />
    <Route path="/organization/workspace" element={<OrgAdminComingSoon />} />
    <Route path="/organization/campuses" element={<OrgAdminComingSoon />} />
    <Route path="/organization/departments" element={<OrgAdminComingSoon />} />
    <Route path="/organization/programs" element={<OrgAdminComingSoon />} />
    <Route path="/organization/workspaces" element={<OrgAdminComingSoon />} />
    <Route path="/organization/*" element={<OrgAdminComingSoon />} />
    <Route path="/users" element={<OrgAdminComingSoon />} />
  </>
);

export default OrgAdminRoutes;
