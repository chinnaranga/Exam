export interface IntegrationItem {
  name: string;
  category: 'LMS' | 'SSO' | 'Video';
  status: 'Available' | 'Coming soon';
  description: string;
}

export const INTEGRATIONS: IntegrationItem[] = [
  {
    name: 'Canvas LMS',
    category: 'LMS',
    status: 'Available',
    description: 'LTI 1.3 sync for courses, rosters, and automatic gradebook writeback.',
  },
  {
    name: 'Moodle',
    category: 'LMS',
    status: 'Available',
    description: 'Native plugin connection for exams, course cohorts, and quiz exports.',
  },
  {
    name: 'Blackboard',
    category: 'LMS',
    status: 'Coming soon',
    description: 'Seamless grade sync and single-click assessment launching.',
  },
  {
    name: 'Google Workspace',
    category: 'SSO',
    status: 'Available',
    description: 'Single sign-on via Google accounts with student domain restrictions.',
  },
  {
    name: 'Microsoft Entra ID',
    category: 'SSO',
    status: 'Available',
    description: 'Enterprise SAML/OIDC authentication with institutional tenant controls.',
  },
  {
    name: 'Zoom',
    category: 'Video',
    status: 'Coming soon',
    description: 'Direct proctor-candidate escalation bridge for live oral verification.',
  },
];

