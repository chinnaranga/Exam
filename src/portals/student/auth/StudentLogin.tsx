import React from 'react';
import { PortalAuthLayout } from '@/pages/auth/PortalAuthLayout';
import { UserCheck } from 'lucide-react';

export const StudentLogin: React.FC = () => {
  return (
    <PortalAuthLayout
      portalTitle="Student Portal"
      portalSubtitle="AssessIQ zero-distraction examination test runner, offline answer autosave, and verifiable digital badges."
      badgeLabel="STUDENT ACCESS"
      badgeColorClass="bg-blue-50 text-[#1E40AF] border-blue-200"
      accentColor="#1E40AF"
      defaultEmail="student@mit.edu"
      role="STUDENT"
      redirectPath="/student/dashboard"
      features={[
        'Zero-Distraction Secure Test Runner Window',
        'Offline Answer Autosave & Recovery Sync',
        'Instant AI Evaluation & Score Breakdown',
        'SHA-256 Cryptographically Signed Badges',
      ]}
      icon={UserCheck}
    />
  );
};

export default StudentLogin;
