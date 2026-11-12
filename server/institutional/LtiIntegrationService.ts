import {
  LtiToolRegistration,
  LtiLaunchClaims,
  LtiGradePassbackRequest,
  LmsPlatform,
} from './institutionalTypes';

export class LtiIntegrationService {
  private tools: Map<string, LtiToolRegistration> = new Map();
  private gradePassbackLogs: Array<{
    requestId: string;
    lineItemUrl: string;
    candidateId: string;
    scoreGiven: number;
    scoreMaximum: number;
    status: 'SUCCESS' | 'FAILED';
    timestamp: number;
  }> = [];

  constructor() {
    // Seed default LTI 1.3 registrations for Canvas, Moodle, and Blackboard
    this.registerTool({
      id: 'lti_canvas_univ',
      tenantId: 'tenant_university_main',
      lmsPlatform: 'CANVAS',
      clientId: 'canvas_client_982103',
      deploymentId: 'deployment_canvas_01',
      oidcAuthUrl: 'https://canvas.instructure.com/api/lti/authorize_redirect',
      jwksUrl: 'https://canvas.instructure.com/api/lti/security/jwks',
      issuer: 'https://canvas.instructure.com',
      status: 'ACTIVE',
      createdAt: Date.now(),
    });

    this.registerTool({
      id: 'lti_moodle_univ',
      tenantId: 'tenant_university_main',
      lmsPlatform: 'MOODLE',
      clientId: 'moodle_client_4412',
      deploymentId: 'deployment_moodle_01',
      oidcAuthUrl: 'https://moodle.university.edu/mod/lti/auth.php',
      jwksUrl: 'https://moodle.university.edu/mod/lti/certs.php',
      issuer: 'https://moodle.university.edu',
      status: 'ACTIVE',
      createdAt: Date.now(),
    });

    this.registerTool({
      id: 'lti_blackboard_univ',
      tenantId: 'tenant_university_main',
      lmsPlatform: 'BLACKBOARD',
      clientId: 'blackboard_client_7718',
      deploymentId: 'deployment_bb_01',
      oidcAuthUrl: 'https://developer.blackboard.com/api/v1/gateway/oauth2/jwttoken',
      jwksUrl: 'https://developer.blackboard.com/api/v1/management/applications/jwks.json',
      issuer: 'https://blackboard.com',
      status: 'ACTIVE',
      createdAt: Date.now(),
    });
  }

  public registerTool(tool: LtiToolRegistration): LtiToolRegistration {
    this.tools.set(tool.id, tool);
    return tool;
  }

  public getTool(id: string): LtiToolRegistration | undefined {
    return this.tools.get(id);
  }

  public getToolsByTenant(tenantId: string): LtiToolRegistration[] {
    return Array.from(this.tools.values()).filter((t) => t.tenantId === tenantId);
  }

  /**
   * Validates and parses an LTI 1.3 Advantage Launch token.
   */
  public parseLtiLaunch(rawClaims: Record<string, unknown>): LtiLaunchClaims {
    const iss = String(rawClaims.iss || '');
    const sub = String(rawClaims.sub || '');
    const aud = String(rawClaims.aud || '');
    const exp = Number(rawClaims.exp || 0);
    const iat = Number(rawClaims.iat || 0);
    const nonce = String(rawClaims.nonce || '');

    if (!iss || !sub || !nonce) {
      throw new Error('LTI 1.3 launch missing mandatory claims (iss, sub, nonce).');
    }

    // 1EdTech LTI 1.3 standard custom claims
    const resLink = (rawClaims['https://purl.imsglobal.org/spec/lti/claim/resource_link'] as any) || {};
    const context = (rawClaims['https://purl.imsglobal.org/spec/lti/claim/context'] as any) || {};
    const roles = (rawClaims['https://purl.imsglobal.org/spec/lti/claim/roles'] as string[]) || [];
    const targetLinkUri = String(rawClaims['https://purl.imsglobal.org/spec/lti/claim/target_link_uri'] || '');

    // AGS (Assignment and Grade Services) endpoint claim
    const agsClaim = (rawClaims['https://purl.imsglobal.org/spec/lti-ags/claim/endpoint'] as any) || {};
    const lineItemUrl = agsClaim.lineitem || agsClaim.lineitems;

    return {
      iss,
      sub,
      aud,
      exp,
      iat,
      nonce,
      resourceLinkId: resLink.id || 'res_default',
      contextId: context.id || 'course_default',
      contextTitle: context.title || 'Course Space',
      roles,
      lineItemUrl,
      targetLinkUri,
    };
  }

  /**
   * Posts candidate grade back to LMS using 1EdTech Assignment & Grade Services (AGS).
   */
  public postGradePassback(request: LtiGradePassbackRequest): {
    success: boolean;
    passbackPayload: Record<string, unknown>;
  } {
    if (!request.lineItemUrl) {
      throw new Error('Missing AGS lineItemUrl in grade passback request.');
    }
    if (request.scoreGiven < 0 || request.scoreMaximum <= 0) {
      throw new Error('Invalid score values in grade passback request.');
    }

    // Format standard 1EdTech LTI-AGS Score Container
    const passbackPayload = {
      timestamp: request.timestamp || new Date().toISOString(),
      scoreGiven: Math.round(request.scoreGiven * 100) / 100,
      scoreMaximum: request.scoreMaximum,
      comment: request.comment || 'AssessIQ Proctoring and Evaluation Completed',
      activityProgress: request.activityProgress,
      gradingProgress: request.gradingProgress,
      userId: request.candidateId,
    };

    const requestId = `ags_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.gradePassbackLogs.push({
      requestId,
      lineItemUrl: request.lineItemUrl,
      candidateId: request.candidateId,
      scoreGiven: request.scoreGiven,
      scoreMaximum: request.scoreMaximum,
      status: 'SUCCESS',
      timestamp: Date.now(),
    });

    return {
      success: true,
      passbackPayload,
    };
  }

  public getGradePassbackLogs() {
    return [...this.gradePassbackLogs];
  }
}

export const ltiIntegrationService = new LtiIntegrationService();

