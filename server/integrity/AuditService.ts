export interface AuditLogEntry {
  id: string;
  timestamp: string;
  sessionId: string;
  action:
    | 'TELEMETRY_BATCH_RECEIVED'
    | 'RISK_ASSESSMENT_CALCULATED'
    | 'REVIEW_STATUS_UPDATED'
    | 'POLICY_UPDATED'
    | 'MANUAL_SCORE_OVERRIDDEN'
    | 'APPEAL_SUBMITTED'
    | 'RETENTION_PURGED';
  actorId: string;
  policyVersion: string;
  details: Record<string, any>;
  ipAddress: string;
}

/**
 * @class AuditService
 * @description Maintains an immutable audit trail of all ingestion events, risk calculations,
 * reviewer decisions, policy updates, manual score overrides, and candidate appeals.
 */
export class AuditService {
  private auditLogs: AuditLogEntry[] = [];

  /**
   * Log an immutable audit action.
   */
  public logAction(params: {
    sessionId: string;
    action: AuditLogEntry['action'];
    actorId: string;
    policyVersion?: string;
    details: Record<string, any>;
    ipAddress?: string;
  }): AuditLogEntry {
    const timestampMs = Date.now();
    const entry: AuditLogEntry = {
      id: `audit_${timestampMs}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date(timestampMs).toISOString(),
      sessionId: params.sessionId,
      action: params.action,
      actorId: params.actorId,
      policyVersion: params.policyVersion || '1.0.0',
      details: params.details,
      ipAddress: params.ipAddress || '127.0.0.1',
    };

    this.auditLogs.push(entry);
    return entry;
  }

  /**
   * Query audit logs for a specific session.
   */
  public getSessionAuditTrail(sessionId: string): AuditLogEntry[] {
    return this.auditLogs.filter((log) => log.sessionId === sessionId);
  }

  /**
   * Retrieve all recorded audit logs.
   */
  public getAllAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }
}
