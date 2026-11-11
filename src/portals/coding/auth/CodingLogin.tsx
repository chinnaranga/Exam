import React from 'react';
import { PortalAuthLayout } from "@/shared/components/layout/PortalAuthLayout";
import { Code } from 'lucide-react';

export const CodingLogin: React.FC = () => {
  return (
    <PortalAuthLayout
      portalTitle="Coding Platform Portal"
      portalSubtitle="Polyglot coding examinations, 14 execution runtimes, judge cluster telemetry, and interactive sandbox."
      badgeLabel="CODING PLATFORM ACCESS"
      badgeColorClass="bg-indigo-50 text-indigo-700 border-indigo-200"
      accentColor="#4F46E5"
      defaultEmail="coding.admin@assessiq.com"
      role="SUPER_ADMIN"
      redirectPath="/coding/dashboard"
      features={[
        '14 Polyglot Execution Runtimes',
        '16 Online Judge Worker Nodes',
        'Real-time Submissions & Telemetry Stream',
        'Interactive Polyglot Sandbox Execution IDE',
      ]}
      icon={Code}
    />
  );
};

export default CodingLogin;
