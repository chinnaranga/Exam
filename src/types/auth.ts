// ExamifyPro Enterprise - Core Auth & RBAC Type Definitions

export type SystemRole =
  | 'SUPER_ADMIN'
  | 'PLATFORM_ADMIN'
  | 'ORGANIZATION_ADMIN'
  | 'CAMPUS_ADMIN'
  | 'DEPARTMENT_ADMIN'
  | 'FACULTY'
  | 'TRAINER'
  | 'EXAM_CREATOR'
  | 'REVIEWER'
  | 'EVALUATOR'
  | 'INVIGILATOR'
  | 'STUDENT'
  | 'RECRUITER'
  | 'HR'
  | 'GUEST';

export type PermissionToken =
  | 'user.read'
  | 'user.create'
  | 'user.update'
  | 'user.delete'
  | 'role.manage'
  | 'tenant.manage'
  | 'exam.read'
  | 'exam.create'
  | 'exam.publish'
  | 'exam.delete'
  | 'question.read'
  | 'question.create'
  | 'question.review'
  | 'analytics.read'
  | 'settings.manage'
  | 'audit.read';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  mfaEnabled: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  roles: {
    roleName: SystemRole;
    organizationId: string;
    campusId?: string;
    departmentId?: string;
  }[];
  permissions: PermissionToken[];
}

export interface OrganizationContext {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logoUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_SETUP';
  activeCampus?: {
    id: string;
    name: string;
    code: string;
  };
  activeDepartment?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface AuthSession {
  accessToken: string;
  expiresAt: number;
  user: UserProfile;
  activeOrganization: OrganizationContext | null;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  otp?: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  organizationName: string;
  domainSlug: string;
  acceptTerms?: boolean;
}

export interface ActiveSessionRecord {
  id: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  device?: string;
  isCurrent: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface DeviceRecord {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  isTrusted: boolean;
  lastActiveAt: string;
}

export interface PermissionGroup {
  category: string;
  permissions: {
    token: PermissionToken;
    name: string;
    description: string;
  }[];
}
