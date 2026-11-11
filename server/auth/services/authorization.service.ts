export interface RoleDefinition {
  id: string;
  name: string;
  scope: 'SYSTEM' | 'TENANT' | 'ORGANIZATION' | 'DEPARTMENT';
  description: string;
  permissionsCount: number;
  isCustom: boolean;
}

export interface PermissionItem {
  id: string;
  code: string;
  module: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'PUBLISH' | 'EXPORT';
  scope: 'GLOBAL' | 'TENANT' | 'ORGANIZATION' | 'OWN';
  description: string;
}

export interface PolicyDefinition {
  id: string;
  name: string;
  effect: 'ALLOW' | 'DENY';
  allowedRoles: string[];
  maxRiskScore: number;
  description: string;
  isSystem: boolean;
}

export class AuthorizationService {
  private static roles: RoleDefinition[] = [
    { id: 'role-01', name: 'SUPER_ADMIN', scope: 'SYSTEM', description: 'Unrestricted global system administration across all tenants.', permissionsCount: 142, isCustom: false },
    { id: 'role-02', name: 'ORGANIZATION_ADMIN', scope: 'ORGANIZATION', description: 'Institutional administrative management for campus rosters and branding.', permissionsCount: 84, isCustom: false },
    { id: 'role-03', name: 'FACULTY_PROFESSOR', scope: 'DEPARTMENT', description: 'Question item authoring, test blueprinting, and peer grading.', permissionsCount: 36, isCustom: false },
    { id: 'role-04', name: 'PROCTOR_INVIGILATOR', scope: 'ORGANIZATION', description: 'Live candidate video proctoring and event anomaly reporting.', permissionsCount: 18, isCustom: false },
    { id: 'role-05', name: 'CANDIDATE_STUDENT', scope: 'DEPARTMENT', description: 'Assessment test taker access with locked sandbox runner.', permissionsCount: 6, isCustom: false },
  ];

  private static permissions: PermissionItem[] = [
    { id: 'p-01', code: 'questions:create', module: 'Question Bank', action: 'CREATE', scope: 'TENANT', description: 'Author new question items' },
    { id: 'p-02', code: 'questions:approve', module: 'Question Bank', action: 'APPROVE', scope: 'TENANT', description: 'Peer review and publish questions' },
    { id: 'p-03', code: 'exams:deliver', module: 'Assessment Engine', action: 'PUBLISH', scope: 'ORGANIZATION', description: 'Deploy live examination sessions' },
    { id: 'p-04', code: 'proctoring:monitor', module: 'Proctor Sentinel', action: 'READ', scope: 'ORGANIZATION', description: 'View live candidate video feeds' },
    { id: 'p-05', code: 'analytics:export', module: 'Analytics', action: 'EXPORT', scope: 'ORGANIZATION', description: 'Export score distribution CSVs' },
  ];

  private static policies: PolicyDefinition[] = [
    { id: 'pol-01', name: 'Super Admin Override Policy', effect: 'ALLOW', allowedRoles: ['SUPER_ADMIN'], maxRiskScore: 1.0, description: 'Bypasses ABAC restrictions for platform admins.', isSystem: true },
    { id: 'pol-02', name: 'High Device Risk Lockout', effect: 'DENY', allowedRoles: [], maxRiskScore: 0.85, description: 'Denies token access if device risk score exceeds 0.85.', isSystem: true },
    { id: 'pol-03', name: 'Exam Delivery Time Gate', effect: 'ALLOW', allowedRoles: ['CANDIDATE_STUDENT'], maxRiskScore: 0.50, description: 'Allows candidate login only during scheduled exam windows.', isSystem: false },
  ];

  public static getRoles(): RoleDefinition[] { return this.roles; }
  public static getPermissions(): PermissionItem[] { return this.permissions; }
  public static getPolicies(): PolicyDefinition[] { return this.policies; }

  public static createRole(role: Omit<RoleDefinition, 'id' | 'permissionsCount' | 'isCustom'>): RoleDefinition {
    const newRole: RoleDefinition = {
      ...role,
      id: `role-${Date.now()}`,
      permissionsCount: 0,
      isCustom: true,
    };
    this.roles.push(newRole);
    return newRole;
  }

  public static deleteRole(id: string): boolean {
    const initial = this.roles.length;
    this.roles = this.roles.filter((r) => r.id !== id || !r.isCustom);
    return this.roles.length < initial;
  }
}
