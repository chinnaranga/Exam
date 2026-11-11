export interface PolicyContext {
  userId: string;
  tenantId: string;
  userRoles: string[];
  clientIp: string;
  deviceRiskScore: number;
  timeOfDayMinutes: number; // 0 to 1439
}

export interface PolicyRule {
  id: string;
  name: string;
  effect: 'ALLOW' | 'DENY';
  allowedRoles?: string[];
  ipRangeWhitelist?: string[];
  maxRiskScore?: number;
}

export class ABACPolicyEngine {
  private static DEFAULT_RULES: PolicyRule[] = [
    {
      id: 'rule-01',
      name: 'Super Admin Unrestricted Access',
      effect: 'ALLOW',
      allowedRoles: ['SUPER_ADMIN'],
    },
    {
      id: 'rule-02',
      name: 'Block High Risk Devices',
      effect: 'DENY',
      maxRiskScore: 0.85,
    },
  ];

  public static evaluate(context: PolicyContext, rules: PolicyRule[] = this.DEFAULT_RULES): { allowed: boolean; reason: string } {
    // 1. High Risk Check
    if (context.deviceRiskScore > 0.85) {
      return { allowed: false, reason: 'Denied: Device risk score exceeds maximum security threshold (0.85).' };
    }

    // 2. Role Check
    const hasRole = context.userRoles.some((r) => r === 'SUPER_ADMIN' || r === 'ORGANIZATION_ADMIN' || r === 'FACULTY');
    if (!hasRole) {
      return { allowed: false, reason: 'Denied: Insufficient RBAC/ABAC role permissions.' };
    }

    return { allowed: true, reason: 'Access Granted by Enterprise Policy Engine.' };
  }
}
