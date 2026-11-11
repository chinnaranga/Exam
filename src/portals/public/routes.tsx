import React from 'react';
import { Route } from 'react-router-dom';
import AuthGuard from '@/shared/guards/AuthGuard';

import LightLanding from './pages/LightLanding';
import PortalSelection from './pages/auth/PortalSelection';
import Welcome from './pages/auth/Welcome';
import OrgDiscovery from './pages/auth/OrgDiscovery';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOTP from './pages/auth/VerifyOTP';
import VerifyEmail from './pages/auth/VerifyEmail';
import InvitationAccept from './pages/auth/InvitationAccept';
import SelectTenant from './pages/auth/SelectTenant';
import FirstLoginWizard from './pages/auth/FirstLoginWizard';

export const PublicRoutes = (
  <>
    <Route index element={<LightLanding />} />
    <Route path="/auth" element={<PortalSelection />} />
    <Route path="/auth/login" element={<PortalSelection />} />
    <Route path="/auth/welcome" element={<Welcome />} />
    <Route path="/auth/discovery" element={<OrgDiscovery />} />
    <Route path="/auth/register" element={<Register />} />
    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
    <Route path="/auth/reset-password" element={<ResetPassword />} />
    <Route path="/auth/otp" element={<VerifyOTP />} />
    <Route path="/auth/verify-email" element={<VerifyEmail />} />
    <Route path="/auth/invitation-accept" element={<InvitationAccept />} />
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
  </>
);

export default PublicRoutes;
