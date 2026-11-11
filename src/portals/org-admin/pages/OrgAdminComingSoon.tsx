import React from 'react';
import { PortalComingSoon, ArchitectureModule, RoadmapMilestone } from '@/shared/components/PortalComingSoon';
import { Building2, Users, Layers, BookOpen, ShieldCheck, Globe, CheckCircle2 } from 'lucide-react';

export const OrgAdminComingSoon: React.FC = () => {
  const modules: ArchitectureModule[] = [
    {
      title: 'Multi-Campus & Department Scoping',
      badge: 'ARCHITECTED',
      statusColor: 'mint',
      description: 'Structured academic hierarchy trees across campuses, faculties, departments, and specific graduating cohorts with isolated role assignments.',
      specs: [
        'Infinite-depth campus & department hierarchy trees',
        'Scoped proctor and faculty assignments per faculty',
        'Cohort-level curriculum mapping and term archives',
      ],
      icon: Building2,
      sheetTint: 'bg-[#C9CCFF]/35',
    },
    {
      title: 'Automated SCIM & SAML 2.0 Directory Sync',
      badge: 'IN PROGRESS',
      statusColor: 'lemon',
      description: 'Zero-touch roster management with live synchronizations from Okta, Microsoft Entra ID, Google Workspace, and Canvas / Blackboard LMS.',
      specs: [
        'Real-time automated candidate roster provisioning',
        'Single Sign-On (SSO) with university identity providers',
        'Instant role de-provisioning upon graduation or transfer',
      ],
      icon: Users,
      sheetTint: 'bg-[#FFF3A3]/35',
    },
    {
      title: 'White-Label Campus Branding & Subdomains',
      badge: 'IN PROGRESS',
      statusColor: 'coral',
      description: 'Deliver examinations under your institution’s own domain, complete with custom university seals, colors, and official certificate templates.',
      specs: [
        'Custom domain routing (e.g. exams.mit.edu)',
        'Institution seal & crest watermarking on test sheets',
        'Custom verifiable PDF certificate generators',
      ],
      icon: Globe,
      sheetTint: 'bg-[#B8F0D2]/40',
    },
    {
      title: 'Institutional Compliance & Dean Rollups',
      badge: 'ROADMAP',
      statusColor: 'violet',
      description: 'High-level academic integrity intelligence, historical grade inflation detection, item discrimination indices, and accreditation exports.',
      specs: [
        'ABET, AACSB, and regional accreditation export packs',
        'Cross-department proctoring anomaly heatmaps',
        'Automated grade curve calibration reports',
      ],
      icon: BookOpen,
      sheetTint: 'bg-[#FFB5A7]/35',
    },
  ];

  const milestones: RoadmapMilestone[] = [
    {
      phase: 'PHASE 01',
      quarter: 'Q1 2027',
      title: 'Multi-Campus Hierarchy & Scoping',
      description: 'Schema modeling for campus trees, faculty permissions, and cohort rosters.',
      progressPercent: 100,
      status: 'COMPLETED',
    },
    {
      phase: 'PHASE 02',
      quarter: 'Q2 2027',
      title: 'Enterprise SCIM & SSO Integration',
      description: 'Okta / Canvas LMS directory sync and closed beta with 40 partner universities.',
      progressPercent: 65,
      status: 'IN PROGRESS',
    },
    {
      phase: 'PHASE 03',
      quarter: 'Q3 2027',
      title: 'Global General Availability',
      description: 'White-label custom domains, self-service billing, and accreditation packs.',
      progressPercent: 15,
      status: 'UPCOMING',
    },
  ];

  const defaultRoleOptions = [
    'University Provost / Dean',
    'Department Chair / Faculty Head',
    'Certification Board Director',
    'Enterprise IT / Systems Architect',
    'Registrar / Academic Operations',
  ];

  return (
    <PortalComingSoon
      portalId="org-admin"
      stationLetter="E"
      portalName="Organization Admin Portal"
      portalSubtitle="Institutional campus hierarchy, bulk SCIM roster invitations, and custom university branding."
      badgeLabel="STATION E // CAMPUS & ORG ARCHITECTURE"
      tagBg="bg-[#BFE6FF] text-[#2B2350]"
      heroHeadline="Organization Admin is under active construction."
      heroHeadlineHighlight="under active construction"
      heroDescription="We are building the enterprise control plane for multi-campus scoping, automated Okta & Canvas LMS roster sync, white-label institutional subdomains, and accreditation compliance reporting."
      heroSheetColor="bg-[#BFE6FF]/40"
      targetQuarter="Q2 2027"
      roleClearance="ORGANIZATION ADMIN"
      modules={modules}
      milestones={milestones}
      defaultRoleOptions={defaultRoleOptions}
      defaultInstitutionPlaceholder="Massachusetts Institute of Technology"
    />
  );
};

export default OrgAdminComingSoon;
