export interface AuditEventInput {
  organizationId?: string;
  actorId?: string;
  actorRole?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  changes?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  riskScore?: number;
}

export const auditService = {
  async logEvent(event: AuditEventInput) {
    const auditRecord = {
      auditId: `aud_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      ...event,
      riskScore: event.riskScore || 0.0,
      outcome: 'SUCCESS',
    };

    console.log('[SECURITY AUDIT LOG]:', JSON.stringify(auditRecord, null, 2));
    return auditRecord;
  },
};
