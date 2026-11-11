import { PermissionToken, SystemRole, UserProfile } from '@/types/auth';

/**
 * Checks if the user holds a specific permission token
 */
export function hasPermission(user: UserProfile | null, requiredPermission: PermissionToken): boolean {
  if (!user) return false;
  // Super Admin overrides all permission checks
  if (user.roles.some((r) => r.roleName === 'SUPER_ADMIN')) return true;
  return user.permissions.includes(requiredPermission);
}

/**
 * Checks if the user has any of the specified roles
 */
export function hasRole(user: UserProfile | null, allowedRoles: SystemRole[]): boolean {
  if (!user) return false;
  if (user.roles.some((r) => r.roleName === 'SUPER_ADMIN')) return true;
  return user.roles.some((r) => allowedRoles.includes(r.roleName));
}

/**
 * Validates whether user has access to a specific organization tenant
 */
export function canAccessTenant(user: UserProfile | null, tenantId: string): boolean {
  if (!user) return false;
  if (user.roles.some((r) => r.roleName === 'SUPER_ADMIN')) return true;
  return user.roles.some((r) => r.organizationId === tenantId);
}

/**
 * Categorized Permission Groups for UI display
 */
export const PERMISSION_GROUPS = [
  {
    category: 'User Management',
    permissions: [
      { token: 'user.read' as PermissionToken, name: 'View Users', description: 'View user profile directories and lists' },
      { token: 'user.create' as PermissionToken, name: 'Create Users', description: 'Provision new faculty, student, or staff accounts' },
      { token: 'user.update' as PermissionToken, name: 'Edit Users', description: 'Modify account credentials, roles, and status' },
      { token: 'user.delete' as PermissionToken, name: 'Delete Users', description: 'Suspend or permanently delete user profiles' },
    ],
  },
  {
    category: 'Organization & Security',
    permissions: [
      { token: 'tenant.manage' as PermissionToken, name: 'Tenant Settings', description: 'Configure organization branding, domains, and campuses' },
      { token: 'role.manage' as PermissionToken, name: 'Manage Roles', description: 'Assign permissions and create custom roles' },
      { token: 'settings.manage' as PermissionToken, name: 'System Preferences', description: 'Configure system notifications and security policies' },
      { token: 'audit.read' as PermissionToken, name: 'View Audit Logs', description: 'Access immutable security and access audit trails' },
    ],
  },
  {
    category: 'Examination Engine',
    permissions: [
      { token: 'exam.read' as PermissionToken, name: 'View Exams', description: 'Access assigned or departmental exam schedules' },
      { token: 'exam.create' as PermissionToken, name: 'Build Exams', description: 'Assemble blueprints and schedule exam slots' },
      { token: 'exam.publish' as PermissionToken, name: 'Publish Exams', description: 'Release scheduled exams to registered candidates' },
      { token: 'exam.delete' as PermissionToken, name: 'Archive Exams', description: 'Remove or archive historical exam records' },
      { token: 'question.read' as PermissionToken, name: 'View Item Bank', description: 'Search and inspect question repository' },
      { token: 'question.create' as PermissionToken, name: 'Author Questions', description: 'Create MCQ, essay, and coding questions' },
      { token: 'question.review' as PermissionToken, name: 'Peer Review', description: 'Approve or reject authored questions' },
    ],
  },
  {
    category: 'Analytics & Reporting',
    permissions: [
      { token: 'analytics.read' as PermissionToken, name: 'View Analytics', description: 'Access institutional score distributions and item psychometrics' },
    ],
  },
];
