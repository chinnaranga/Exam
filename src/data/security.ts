export interface SecurityBadgeItem {
  id: string;
  title: string;
  statusBadge: string;
  statusType: 'active' | 'in-progress' | 'roadmap';
  description: string;
}

export const SECURITY_ITEMS: SecurityBadgeItem[] = [
  {
    id: 'encryption',
    title: 'Encryption in Transit & at Rest',
    statusBadge: 'Active',
    statusType: 'active',
    description: 'All exam data, candidate responses, and question banks are protected with AES-256 at rest and TLS 1.3 in transit.',
  },
  {
    id: 'rbac',
    title: 'Strict Role-Based Access Control',
    statusBadge: 'Active',
    statusType: 'active',
    description: 'Fine-grained permissions ensure students, faculty, invigilators, and admins access only what their role permits.',
  },
  {
    id: 'audit-logs',
    title: 'Immutable Audit Logging',
    statusBadge: 'Active',
    statusType: 'active',
    description: 'Every question change, grade update, and proctoring flag is cryptographically signed and logged for full accountability.',
  },
  {
    id: 'data-separation',
    title: 'Multi-Organization Data Separation',
    statusBadge: 'Active',
    statusType: 'active',
    description: 'Database-level row isolation guarantees zero data leakage between different institutions, departments, or campuses.',
  },
  {
    id: 'gdpr',
    title: 'GDPR-Ready Privacy Practices',
    statusBadge: 'Active',
    statusType: 'active',
    description: 'On-device proctoring processes webcam signals locally. Student biometric information is never stored or transferred to cloud servers.',
  },
  {
    id: 'soc2',
    title: 'SOC 2 Type II Certification',
    statusBadge: 'SOC 2 (in progress)',
    statusType: 'in-progress',
    description: 'Independent audit underway covering security, availability, and confidential data processing policies.',
  },
  {
    id: 'iso27001',
    title: 'ISO/IEC 27001 ISMS Standards',
    statusBadge: 'ISO 27001 (roadmap)',
    statusType: 'roadmap',
    description: 'Formally aligning all policies, operational procedures, and infrastructure with international ISMS requirements.',
  },
];
