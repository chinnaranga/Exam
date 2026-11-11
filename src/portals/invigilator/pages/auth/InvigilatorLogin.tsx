import React from 'react';
import { PortalAuthLayout } from "@/shared/components/layout/PortalAuthLayout";
import { Video } from 'lucide-react';

export const InvigilatorLogin: React.FC = () => {
  return (
    <PortalAuthLayout
      portalTitle="Invigilator Portal"
      portalSubtitle="Real-time multi-candidate proctoring, WASM computer vision gaze tracking, and automated anomaly flagging."
      badgeLabel="INVIGILATOR ACCESS"
      badgeColorClass="bg-amber-50 text-[#D97706] border-amber-200"
      accentColor="#D97706"
      defaultEmail="invigilator@mit.edu"
      role="INVIGILATOR"
      redirectPath="/invigilator/dashboard"
      features={[
        'Live Multi-Candidate Stream Grid Monitoring',
        'Client-Side WASM Eye Gaze Detection',
        'Instant Threat Anomaly & Browser Lock Alerts',
        'Proctor Incident Audit Trail Recording',
      ]}
      icon={Video}
    />
  );
};

export default InvigilatorLogin;
