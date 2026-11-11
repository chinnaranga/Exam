import {
  AuthSession,
  LoginCredentials,
  RegisterCredentials,
  SystemRole,
  PermissionToken,
  UserProfile,
} from '../types/auth';

export const MOCK_ORGANIZATIONS = [
  { id: 'org_mit_01', name: 'Massachusetts Institute of Technology', slug: 'mit' },
  { id: 'org_stanford_02', name: 'Stanford University School of Medicine', slug: 'stanford' },
  { id: 'org_pearson_03', name: 'Pearson Vue Global Testing Systems', slug: 'pearson' },
];

export const DEFAULT_ROLE_PERMISSIONS: Record<SystemRole, PermissionToken[]> = {
  SUPER_ADMIN: [
    'user.read', 'user.create', 'user.update', 'user.delete',
    'role.manage', 'tenant.manage',
    'exam.read', 'exam.create', 'exam.publish', 'exam.delete',
    'question.read', 'question.create', 'question.review',
    'analytics.read', 'settings.manage', 'audit.read',
  ],
  PLATFORM_ADMIN: [
    'user.read', 'user.create', 'user.update',
    'tenant.manage',
    'exam.read', 'exam.create', 'exam.publish',
    'question.read', 'question.create',
    'analytics.read', 'settings.manage', 'audit.read',
  ],
  ORGANIZATION_ADMIN: [
    'user.read', 'user.create', 'user.update',
    'role.manage',
    'exam.read', 'exam.create', 'exam.publish',
    'question.read', 'question.create',
    'analytics.read', 'settings.manage', 'audit.read',
  ],
  CAMPUS_ADMIN: [
    'user.read', 'user.create', 'user.update',
    'exam.read', 'exam.create', 'exam.publish',
    'question.read', 'question.create',
    'analytics.read',
  ],
  DEPARTMENT_ADMIN: [
    'user.read', 'exam.read', 'exam.create', 'exam.publish',
    'question.read', 'question.create', 'analytics.read',
  ],
  FACULTY: [
    'exam.read', 'exam.create', 'exam.publish',
    'question.read', 'question.create', 'question.review',
    'analytics.read',
  ],
  TRAINER: [
    'exam.read', 'exam.create', 'question.read', 'question.create', 'analytics.read',
  ],
  EXAM_CREATOR: [
    'exam.read', 'exam.create', 'question.read', 'question.create',
  ],
  REVIEWER: [
    'question.read', 'question.review',
  ],
  EVALUATOR: [
    'exam.read', 'question.read', 'analytics.read',
  ],
  INVIGILATOR: [
    'exam.read', 'user.read',
  ],
  STUDENT: [
    'exam.read',
  ],
  RECRUITER: [
    'user.read', 'exam.read', 'analytics.read',
  ],
  HR: [
    'user.read', 'analytics.read',
  ],
  GUEST: [],
};

const DEMO_INSTITUTIONAL_ACCOUNTS: Record<
  string,
  { role: SystemRole; firstName: string; lastName: string; orgId: string }
> = {
  'student@mit.edu': {
    role: 'STUDENT',
    firstName: 'Jane',
    lastName: 'Doe',
    orgId: 'org_mit_01',
  },
  'developer@mit.edu': {
    role: 'STUDENT',
    firstName: 'Alex',
    lastName: 'Chen',
    orgId: 'org_mit_01',
  },
  'faculty@mit.edu': {
    role: 'FACULTY',
    firstName: 'Arthur',
    lastName: 'Vance',
    orgId: 'org_mit_01',
  },
  'proctor@mit.edu': {
    role: 'INVIGILATOR',
    firstName: 'Marcus',
    lastName: 'Brody',
    orgId: 'org_mit_01',
  },
  'admin@mit.edu': {
    role: 'ORGANIZATION_ADMIN',
    firstName: 'Eleanor',
    lastName: 'Rousseau',
    orgId: 'org_mit_01',
  },
  'root@assessiq.com': {
    role: 'SUPER_ADMIN',
    firstName: 'Root',
    lastName: 'Sentinel',
    orgId: 'org_platform_01',
  },
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const authService = {
  // Login via Production API or Verified Institutional Demo Credentials
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    // 1. Attempt connection to backend API
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }

      if (!res.ok && contentType.includes('application/json')) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || 'Invalid credentials or login failed.');
      }
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message &&
        !err.message.includes('fetch') &&
        !err.message.includes('NetworkError') &&
        !err.message.includes('JSON')
      ) {
        throw err;
      }
      // Backend not running or served HTML SPA fallback: evaluate demo credentials below
    }

    // 2. Validate against verified institutional demo accounts
    const emailKey = credentials.email.trim().toLowerCase();
    const demo = DEMO_INSTITUTIONAL_ACCOUNTS[emailKey];

    if (demo && credentials.password === 'Password123!') {
      return {
        accessToken: `session_${demo.role.toLowerCase()}_${Date.now()}`,
        user: {
          id: `usr_${demo.role.toLowerCase()}_01`,
          email: credentials.email,
          firstName: demo.firstName,
          lastName: demo.lastName,
          isEmailVerified: true,
          mfaEnabled: false,
          status: 'ACTIVE',
          roles: [
            {
              roleName: demo.role,
              organizationId: demo.orgId,
            },
          ],
          permissions: DEFAULT_ROLE_PERMISSIONS[demo.role] || [],
        },
      };
    }

    throw new Error('Invalid institutional credentials. Please check your email and password.');
  },

  // Register User
  async register(data: RegisterCredentials): Promise<AuthSession> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch {
      // Backend offline fallback for demo tenant creation
    }

    return {
      accessToken: `session_orgadmin_${Date.now()}`,
      user: {
        id: `usr_new_${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        isEmailVerified: true,
        mfaEnabled: false,
        status: 'ACTIVE',
        roles: [
          {
            roleName: 'ORGANIZATION_ADMIN',
            organizationId: `org_${data.domainSlug}`,
          },
        ],
        permissions: DEFAULT_ROLE_PERMISSIONS.ORGANIZATION_ADMIN,
      },
    };
  },

  // Forgot Password
  async forgotPassword(email: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Reset Password
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
      });
    } catch {
      // Local clean
    }
  },
};

export default authService;
