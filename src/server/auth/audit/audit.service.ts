export interface AuditLogInput {
  correlationId?: string;
  organizationId?: string;
  userId?: string;
  action: string;
  severity?: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  resourceType: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  changes?: Record<string, any>;
}

export class AuditService {
  /**
   * Write immutable audit entry to stdout / database log stream
   */
  public static async log(input: AuditLogInput) {
    const entry = {
      auditId: `aud_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      correlationId: input.correlationId || 'no-correlation-id',
      organizationId: input.organizationId || null,
      userId: input.userId || null,
      action: input.action,
      severity: input.severity || 'INFO',
      resourceType: input.resourceType,
      resourceId: input.resourceId || null,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      changes: input.changes || {},
    };

    console.log('[SECURITY AUDIT ENGINE]:', JSON.stringify(entry));
    return entry;
  }
}
