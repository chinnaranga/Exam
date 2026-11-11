import React from 'react';
import { PortalAuthLayout } from "@/shared/components/layout/PortalAuthLayout";
import { Building2 } from 'lucide-react';

export const OrgAdminLogin: React.FC = () => {
  return (
    <PortalAuthLayout
      portalTitle="Organization Admin Portal"
      portalSubtitle="AssessIQ institutional hierarchy management, campus/department scoping, user invitations, and custom branding."
      badgeLabel="ORG ADMIN ACCESS"
      badgeColorClass="bg-emerald-50 text-[#15803D] border-emerald-200"
      accentColor="#15803D"
      defaultEmail="admin@mit.edu"
      role="ORGANIZATION_ADMIN"
      redirectPath="/organization/dashboard"
      features={[
        'Campus, Department & Program Hierarchy Management',
        'Bulk Roster Invitation & User Access Lifecycle',
        'Custom Domain & Brand Theme Customization',
        'Institutional Assessment Compliance Analytics',
      ]}
      icon={Building2}
    />
  );
};

export default OrgAdminLogin;
