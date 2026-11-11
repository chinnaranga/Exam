import React from 'react';
import { PortalAuthLayout } from "@/shared/components/layout/PortalAuthLayout";
import { Brain } from 'lucide-react';

export const FacultyLogin: React.FC = () => {
  return (
    <PortalAuthLayout
      portalTitle="Faculty Portal"
      portalSubtitle="AssessIQ item bank authoring, AI question generation, Bloom's taxonomy blueprinting, and IRT difficulty calibration."
      badgeLabel="FACULTY ACCESS"
      badgeColorClass="bg-purple-50 text-purple-700 border-purple-200"
      accentColor="#7C3AED"
      defaultEmail="faculty@mit.edu"
      role="FACULTY"
      redirectPath="/faculty/dashboard"
      features={[
        'AI Question Authoring & Generator Engine',
        'Bloom\'s Taxonomy Exam Blueprinting Studio',
        'IRT Item Difficulty Calibration & Scoring',
        'Manual Essay Grading & Rubric Assessment Builder',
      ]}
      icon={Brain}
    />
  );
};

export default FacultyLogin;
