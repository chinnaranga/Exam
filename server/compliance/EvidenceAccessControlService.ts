import crypto from 'crypto';
import {
  ComplianceRole,
  EvidenceAccessGrant,
  EvidenceViewLog,
} from './complianceTypes';

export class EvidenceAccessControlService {
  private userGrants: Map<string, EvidenceAccessGrant> = new Map();
  private accessAuditLogs: EvidenceViewLog[] = [];

  constructor() {
    this.seedDefaultRoles();
  }

  /**
   * Registers or updates a user's compliance role and assigned cases.
   */
  public setUserGrant(params: {
    userId: string;
    role: ComplianceRole;
    tenantId: string;
    assignedCaseIds?: string[];
  }): EvidenceAccessGrant {
    const grant: EvidenceAccessGrant = {
      userId: params.userId,
      role: params.role,
      tenantId: params.tenantId,
      assignedCaseIds: params.assignedCaseIds || [],
    };

    this.userGrants.set(params.userId, grant);
    return grant;
  }

  /**
   * Assigns a specific case to a reviewer.
   */
  public assignCaseToReviewer(reviewerId: string, caseId: string): void {
    const grant = this.userGrants.get(reviewerId);
    if (!grant) {
      this.setUserGrant({
        userId: reviewerId,
        role: 'REVIEWER',
        tenantId: 'default_tenant',
        assignedCaseIds: [caseId],
      });
      return;
    }

    if (!grant.assignedCaseIds.includes(caseId)) {
      grant.assignedCaseIds.push(caseId);
    }
  }

  /**
   * Role-Based Access Check:
   * - ADMIN & CHIEF_PROCTOR: Full evidence inspection rights.
   * - INVIGILATOR: Can view active live proctoring telemetry for active sessions.
   * - REVIEWER: STRICTLY limited to cases assigned to them.
   * - CANDIDATE: Denied access to raw proctoring evidence/clips of others.
   */
  public evaluateAccess(
    userId: string,
    caseId: string,
    sessionCandidateId?: string
  ): { granted: boolean; role: ComplianceRole; denialReason?: string } {
    const grant = this.userGrants.get(userId);

    if (!grant) {
      return {
        granted: false,
        role: 'CANDIDATE',
        denialReason: 'No compliance role or credentials found for user.',
      };
    }

    switch (grant.role) {
      case 'ADMIN':
      case 'CHIEF_PROCTOR':
        return { granted: true, role: grant.role };

      case 'INVIGILATOR':
        return { granted: true, role: grant.role };

      case 'REVIEWER': {
        const isAssigned = grant.assignedCaseIds.includes(caseId);
        if (!isAssigned) {
          return {
            granted: false,
            role: grant.role,
            denialReason: `Case "${caseId}" is not assigned to reviewer "${userId}". Reviewers may only inspect assigned cases.`,
          };
        }
        return { granted: true, role: grant.role };
      }

      case 'CANDIDATE': {
        // Candidates can only view their own transparent report, never raw evidence of another
        if (sessionCandidateId && userId === sessionCandidateId) {
          return { granted: true, role: grant.role };
        }
        return {
          granted: false,
          role: grant.role,
          denialReason: 'Candidates are restricted from viewing raw proctoring evidence files.',
        };
      }

      default:
        return {
          granted: false,
          role: grant.role,
          denialReason: 'Unauthorized role.',
        };
    }
  }

  /**
   * Logs every single evidence inspection attempt (authorized or blocked).
   * Ensures complete GDPR/FERPA auditability.
   */
  public logAndVerifyEvidenceView(params: {
    viewerId: string;
    caseId: string;
    sessionId: string;
    reason: string;
    sessionCandidateId?: string;
    ipAddress?: string;
    userAgent?: string;
    nowMs?: number;
  }): { allowed: boolean; log: EvidenceViewLog } {
    const now = params.nowMs || Date.now();
    const evalResult = this.evaluateAccess(params.viewerId, params.caseId, params.sessionCandidateId);

    const logId = `view_${now}_${crypto.randomBytes(3).toString('hex')}`;
    const log: EvidenceViewLog = {
      logId,
      viewerId: params.viewerId,
      role: evalResult.role,
      caseId: params.caseId,
      sessionId: params.sessionId,
      accessedAt: now,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      reason: params.reason,
      accessGranted: evalResult.granted,
      denialReason: evalResult.denialReason,
    };

    this.accessAuditLogs.push(log);

    if (!evalResult.granted) {
      throw new Error(`Access Denied (403 Forbidden): ${evalResult.denialReason}`);
    }

    return { allowed: true, log };
  }

  /**
   * Retrieves access audit trail for a case or viewer.
   */
  public getAccessLogs(params?: { caseId?: string; viewerId?: string }): EvidenceViewLog[] {
    return this.accessAuditLogs.filter((l) => {
      if (params?.caseId && l.caseId !== params.caseId) return false;
      if (params?.viewerId && l.viewerId !== params.viewerId) return false;
      return true;
    });
  }

  private seedDefaultRoles() {
    this.setUserGrant({
      userId: 'admin_security_lead',
      role: 'ADMIN',
      tenantId: 'default_tenant',
    });

    this.setUserGrant({
      userId: 'chief_proctor_dr_adams',
      role: 'CHIEF_PROCTOR',
      tenantId: 'default_tenant',
    });

    this.setUserGrant({
      userId: 'reviewer_sarah_connor',
      role: 'REVIEWER',
      tenantId: 'default_tenant',
      assignedCaseIds: ['case_cs402_101', 'case_cs402_102'],
    });

    this.setUserGrant({
      userId: 'invigilator_live_dan',
      role: 'INVIGILATOR',
      tenantId: 'default_tenant',
    });
  }
}

export const evidenceAccessControlService = new EvidenceAccessControlService();

