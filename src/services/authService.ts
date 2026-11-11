import {
  AuthSession,
  LoginCredentials,
  RegisterCredentials,
  UserProfile,
  OrganizationContext,
  PermissionToken,
  SystemRole,
  ActiveSessionRecord,
  DeviceRecord,
} from '@/types/auth';

// Registered Organizations Context List
export const ORGANIZATIONS_LIST: OrganizationContext[] = [
  {
    id: 'org_mit_01',
    name: 'Massachusetts Institute of Technology',
    slug: 'mit-main',
    domain: 'mit.edu',
    status: 'ACTIVE',
  },
  {
    id: 'org_stanford_02',
    name: 'Stanford University',
    slug: 'stanford-edu',
    domain: 'stanford.edu',
    status: 'ACTIVE',
  },
  {
    id: 'org_corp_03',
    name: 'Global Tech Enterprises',
    slug: 'globaltech-corp',
    domain: 'globaltech.com',
    status: 'ACTIVE',
  },
];
export const MOCK_ORGANIZATIONS = ORGANIZATIONS_LIST;

// Production Permission map by Role
export const ROLE_PERMISSIONS: Record<SystemRole, PermissionToken[]> = {
  SUPER_ADMIN: [
    'user.read', 'user.create', 'user.update', 'user.delete',
    'role.manage', 'tenant.manage', 'exam.read', 'exam.create',
    'exam.publish', 'exam.delete', 'question.read', 'question.create',
    'question.review', 'analytics.read', 'settings.manage', 'audit.read',
  ],
  PLATFORM_ADMIN: [
    'user.read', 'user.create', 'user.update', 'user.delete',
    'role.manage', 'tenant.manage', 'exam.read', 'exam.create',
    'analytics.read', 'settings.manage', 'audit.read',
  ],
  ORGANIZATION_ADMIN: [
    'user.read', 'user.create', 'user.update',
    'role.manage', 'exam.read', 'exam.create', 'exam.publish',
    'exam.delete', 'question.read', 'question.create', 'question.review',
    'analytics.read', 'settings.manage',
  ],
  CAMPUS_ADMIN: [
    'user.read', 'exam.read', 'exam.create', 'question.read',
    'question.create', 'analytics.read',
  ],
  DEPARTMENT_ADMIN: [
    'user.read', 'exam.read', 'exam.create', 'question.read',
    'question.create', 'question.review', 'analytics.read',
  ],
  FACULTY: [
    'exam.read', 'exam.create', 'question.read', 'question.create',
    'question.review',
  ],
  TRAINER: [
    'exam.read', 'exam.create', 'question.read', 'question.create',
  ],
  EXAM_CREATOR: [
    'question.read', 'question.create',
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

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const authService = {
  // Login via Production API / Database controller
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || 'Invalid credentials or login failed.');
      }

      return await res.json();
    } catch (error: any) {
      if (error instanceof Error && error.message && error.message !== 'Failed to fetch' && !error.message.includes('NetworkError') && !error.message.includes('Load failed')) {
        throw error;
      }
      throw new Error('Unable to sign in. Please check your details or try again later.');
    }
  },

  // Register User
  async register(data: RegisterCredentials): Promise<AuthSession> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || 'Registration failed.');
      }

      return await res.json();
    } catch (error: any) {
      if (error instanceof Error && error.message && error.message !== 'Failed to fetch' && !error.message.includes('NetworkError') && !error.message.includes('Load failed')) {
        throw error;
      }
      throw new Error('Unable to register. Please check your details or try again later.');
    }
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
  async resetPassword(tokenOrPassword: string, newPassword?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenOrPassword, newPassword }),
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Verify OTP
  async verifyOTP(otp: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Get Active Sessions
  async getActiveSessions(): Promise<ActiveSessionRecord[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/sessions`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  // Get Registered Devices
  async getDevices(): Promise<DeviceRecord[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/devices`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  // Revoke Session
  async revokeSession(sessionId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Switch Role
  switchRoleDemo(email: string, roleName: SystemRole): UserProfile {
    return {
      id: `usr_role_${Date.now()}`,
      email,
      firstName: email.split('@')[0] || 'User',
      lastName: 'Account',
      isEmailVerified: true,
      mfaEnabled: false,
      status: 'ACTIVE',
      roles: [{ roleName }],
      permissions: ROLE_PERMISSIONS[roleName] || [],
    };
  },
};
