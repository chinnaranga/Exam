import crypto from 'crypto';
import {
  DeletionAuditRecord,
  RetentionDataType,
  RetentionPolicyConfig,
  RetentionPurgeJobResult,
} from './complianceTypes';

export interface StoredEvidenceItem {
  id: string;
  sessionId: string;
  candidateId: string;
  tenantId: string;
  dataType: RetentionDataType;
  createdAt: number;
  payload: unknown;
  isDeleted: boolean;
  deletedAt?: number;
  deletionRecordId?: string;
}

export class RetentionPolicyService {
  private tenantConfigs: Map<string, RetentionPolicyConfig> = new Map();
  private storedData: Map<string, StoredEvidenceItem> = new Map();
  private deletionAuditLog: DeletionAuditRecord[] = [];

  constructor() {
    this.seedDefaultTenantConfig('default_tenant');
  }

  /**
   * Sets or updates the retention policy for a specific tenant.
   */
  public updateRetentionPolicy(config: Partial<RetentionPolicyConfig> & { tenantId: string }): RetentionPolicyConfig {
    const existing = this.getRetentionPolicy(config.tenantId);
    const updated: RetentionPolicyConfig = {
      tenantId: config.tenantId,
      updatedAt: Date.now(),
      autoPurgeEnabled: config.autoPurgeEnabled ?? existing.autoPurgeEnabled,
      retentionDays: {
        ...existing.retentionDays,
        ...(config.retentionDays || {}),
      },
    };

    this.tenantConfigs.set(config.tenantId, updated);
    return updated;
  }

  /**
   * Retrieves the current retention policy for a tenant.
   */
  public getRetentionPolicy(tenantId: string): RetentionPolicyConfig {
    let cfg = this.tenantConfigs.get(tenantId);
    if (!cfg) {
      cfg = this.seedDefaultTenantConfig(tenantId);
    }
    return cfg;
  }

  /**
   * Stores an evidence item subject to retention lifecycle rules.
   */
  public storeEvidenceItem(params: {
    sessionId: string;
    candidateId: string;
    tenantId: string;
    dataType: RetentionDataType;
    payload: unknown;
    createdAt?: number;
  }): StoredEvidenceItem {
    const id = `ev_${params.dataType.toLowerCase()}_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const item: StoredEvidenceItem = {
      id,
      sessionId: params.sessionId,
      candidateId: params.candidateId,
      tenantId: params.tenantId,
      dataType: params.dataType,
      createdAt: params.createdAt || Date.now(),
      payload: params.payload,
      isDeleted: false,
    };

    this.storedData.set(id, item);
    return item;
  }

  /**
   * Retrieves non-deleted stored evidence item.
   */
  public getEvidenceItem(id: string): StoredEvidenceItem | undefined {
    const item = this.storedData.get(id);
    if (!item || item.isDeleted) return undefined;
    return item;
  }

  /**
   * Retrieves all non-deleted evidence items for a session.
   */
  public getSessionEvidenceItems(sessionId: string): StoredEvidenceItem[] {
    const items: StoredEvidenceItem[] = [];
    for (const item of this.storedData.values()) {
      if (item.sessionId === sessionId && !item.isDeleted) {
        items.push(item);
      }
    }
    return items;
  }

  /**
   * Scheduled Retention Purge Routine:
   * Inspects all data items across all data types against tenant retention policies,
   * permanently deletes expired data payloads, and commits an immutable cryptographic deletion record.
   */
  public executeScheduledRetentionPurge(nowMs?: number, targetTenantId?: string): RetentionPurgeJobResult {
    const now = nowMs || Date.now();
    const jobId = `purge_job_${now}_${crypto.randomBytes(3).toString('hex')}`;
    const auditRecords: DeletionAuditRecord[] = [];
    const deletionsByDataType: Record<RetentionDataType, number> = {
      EVIDENCE_CLIPS: 0,
      SNAPSHOTS: 0,
      ID_IMAGES: 0,
      KEYSTROKE_TEMPLATES: 0,
      AUDIT_LEDGERS: 0,
    };

    // Group active evidence by tenant and data type
    const candidateItems = Array.from(this.storedData.values()).filter((item) => {
      if (item.isDeleted) return false;
      if (targetTenantId && item.tenantId !== targetTenantId) return false;
      return true;
    });

    // Group by tenantId + dataType
    const grouped = new Map<string, StoredEvidenceItem[]>();
    for (const item of candidateItems) {
      const key = `${item.tenantId}::${item.dataType}`;
      const list = grouped.get(key) || [];
      list.push(item);
      grouped.set(key, list);
    }

    let totalPurged = 0;

    for (const [key, items] of grouped.entries()) {
      const [tenantId, dataTypeStr] = key.split('::');
      const dataType = dataTypeStr as RetentionDataType;
      const policy = this.getRetentionPolicy(tenantId);
      const retentionDays = policy.retentionDays[dataType];
      const cutoffMs = now - retentionDays * 24 * 60 * 60 * 1000;

      const expired = items.filter((i) => i.createdAt < cutoffMs);
      if (expired.length === 0) continue;

      const affectedSessionIds = Array.from(new Set(expired.map((i) => i.sessionId)));
      const deletionId = `del_${dataType.toLowerCase()}_${now}_${crypto.randomBytes(4).toString('hex')}`;

      // 1. Permanently delete and sanitize payloads in memory
      for (const item of expired) {
        item.isDeleted = true;
        item.deletedAt = now;
        item.deletionRecordId = deletionId;
        item.payload = null; // Zero-out payload content
      }

      // 2. Generate cryptographic deletion digest
      const digestPayload = `${deletionId}:${tenantId}:${dataType}:${expired.length}:${affectedSessionIds.join(',')}:${cutoffMs}:${now}`;
      const deletionDigestHash = crypto.createHash('sha256').update(digestPayload).digest('hex');

      const auditRecord: DeletionAuditRecord = {
        deletionId,
        tenantId,
        dataType,
        recordsDeletedCount: expired.length,
        affectedSessionIds,
        executedAt: now,
        retentionLimitDays: retentionDays,
        cutoffTimestamp: cutoffMs,
        deletionDigestHash,
        executedBy: 'SYSTEM_CRON_RETENTION_JOB',
      };

      auditRecords.push(auditRecord);
      this.deletionAuditLog.push(auditRecord);

      deletionsByDataType[dataType] += expired.length;
      totalPurged += expired.length;
    }

    return {
      jobId,
      startedAt: now,
      completedAt: Date.now(),
      totalRecordsPurged: totalPurged,
      deletionsByDataType,
      auditRecords,
    };
  }

  /**
   * Returns immutable deletion audit trail.
   */
  public getDeletionAuditRecords(tenantId?: string): DeletionAuditRecord[] {
    if (!tenantId) return [...this.deletionAuditLog];
    return this.deletionAuditLog.filter((r) => r.tenantId === tenantId);
  }

  private seedDefaultTenantConfig(tenantId: string): RetentionPolicyConfig {
    const config: RetentionPolicyConfig = {
      tenantId,
      updatedAt: Date.now(),
      retentionDays: {
        EVIDENCE_CLIPS: 14, // 14 days for video/audio clips
        SNAPSHOTS: 30, // 30 days for low-res webcam snapshots
        ID_IMAGES: 7, // 7 days for government/student ID photos (deleted promptly after verification)
        KEYSTROKE_TEMPLATES: 90, // 90 days for typing rhythm cadence templates
        AUDIT_LEDGERS: 365, // 1 year for cryptographic audit trail ledger
      },
      autoPurgeEnabled: true,
    };

    this.tenantConfigs.set(tenantId, config);
    return config;
  }
}

export const retentionPolicyService = new RetentionPolicyService();

