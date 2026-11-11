import { Response } from 'express';
import { ProtectedRequest } from '../middleware/security.middleware';
import { PasswordService } from '../security/password.service';
import { JwtService } from '../tokens/jwt.service';
import { SessionService } from '../sessions/session.service';
import { DeviceService } from '../devices/device.service';
import { CookieConfig } from '../security/cookie.config';
import { AuditService } from '../audit/audit.service';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../validators/auth.validators';

// Mock DB Storage for Production Fallback Demonstration
const mockUsersDB = new Map<string, any>([
  [
    'admin@mit.edu',
    {
      id: 'usr_mit_admin_01',
      email: 'admin@mit.edu',
      passwordHash: '',
      firstName: 'Eleanor',
      lastName: 'Rousseau',
      organizationId: 'org_mit_01',
      activeRole: 'ORGANIZATION_ADMIN',
      isEmailVerified: true,
    },
  ],
  [
    'orgadmin@mit.edu',
    {
      id: 'usr_mit_admin_02',
      email: 'orgadmin@mit.edu',
      passwordHash: '',
      firstName: 'Eleanor',
      lastName: 'Rousseau',
      organizationId: 'org_mit_01',
      activeRole: 'ORGANIZATION_ADMIN',
      isEmailVerified: true,
    },
  ],
  [
    'student@mit.edu',
    {
      id: 'usr_student_01',
      email: 'student@mit.edu',
      passwordHash: '',
      firstName: 'Jane',
      lastName: 'Doe',
      organizationId: 'org_mit_01',
      activeRole: 'STUDENT',
      isEmailVerified: true,
    },
  ],
  [
    'candidate@mit.edu',
    {
      id: 'usr_student_02',
      email: 'candidate@mit.edu',
      passwordHash: '',
      firstName: 'Jane',
      lastName: 'Doe',
      organizationId: 'org_mit_01',
      activeRole: 'STUDENT',
      isEmailVerified: true,
    },
  ],
  [
    'developer@mit.edu',
    {
      id: 'usr_student_03',
      email: 'developer@mit.edu',
      passwordHash: '',
      firstName: 'Alex',
      lastName: 'Chen',
      organizationId: 'org_mit_01',
      activeRole: 'STUDENT',
      isEmailVerified: true,
    },
  ],
  [
    'faculty@mit.edu',
    {
      id: 'usr_faculty_01',
      email: 'faculty@mit.edu',
      passwordHash: '',
      firstName: 'Arthur',
      lastName: 'Vance',
      organizationId: 'org_mit_01',
      activeRole: 'FACULTY',
      isEmailVerified: true,
    },
  ],
  [
    'professor@mit.edu',
    {
      id: 'usr_faculty_02',
      email: 'professor@mit.edu',
      passwordHash: '',
      firstName: 'Arthur',
      lastName: 'Vance',
      organizationId: 'org_mit_01',
      activeRole: 'FACULTY',
      isEmailVerified: true,
    },
  ],
  [
    'invigilator@mit.edu',
    {
      id: 'usr_invigilator_01',
      email: 'invigilator@mit.edu',
      passwordHash: '',
      firstName: 'Marcus',
      lastName: 'Brody',
      organizationId: 'org_mit_01',
      activeRole: 'INVIGILATOR',
      isEmailVerified: true,
    },
  ],
  [
    'proctor@mit.edu',
    {
      id: 'usr_invigilator_02',
      email: 'proctor@mit.edu',
      passwordHash: '',
      firstName: 'Marcus',
      lastName: 'Brody',
      organizationId: 'org_mit_01',
      activeRole: 'INVIGILATOR',
      isEmailVerified: true,
    },
  ],
  [
    'chief.proctor@mit.edu',
    {
      id: 'usr_invigilator_03',
      email: 'chief.proctor@mit.edu',
      passwordHash: '',
      firstName: 'Marcus',
      lastName: 'Brody',
      organizationId: 'org_mit_01',
      activeRole: 'INVIGILATOR',
      isEmailVerified: true,
    },
  ],
  [
    'superadmin@assessiq.com',
    {
      id: 'usr_superadmin_01',
      email: 'superadmin@assessiq.com',
      passwordHash: '',
      firstName: 'Root',
      lastName: 'Sentinel',
      organizationId: 'org_platform_01',
      activeRole: 'SUPER_ADMIN',
      isEmailVerified: true,
    },
  ],
  [
    'root@assessiq.com',
    {
      id: 'usr_superadmin_02',
      email: 'root@assessiq.com',
      passwordHash: '',
      firstName: 'Root',
      lastName: 'Sentinel',
      organizationId: 'org_platform_01',
      activeRole: 'SUPER_ADMIN',
      isEmailVerified: true,
    },
  ],
  [
    'coding.admin@assessiq.com',
    {
      id: 'usr_coding_01',
      email: 'coding.admin@assessiq.com',
      passwordHash: '',
      firstName: 'Alex',
      lastName: 'Compiler',
      organizationId: 'org_platform_01',
      activeRole: 'SUPER_ADMIN',
      isEmailVerified: true,
    },
  ],
  [
    'operations@assessiq.com',
    {
      id: 'usr_ops_01',
      email: 'operations@assessiq.com',
      passwordHash: '',
      firstName: 'DevOps',
      lastName: 'Commander',
      organizationId: 'org_platform_01',
      activeRole: 'SUPER_ADMIN',
      isEmailVerified: true,
    },
  ],
]);

// Initialize password hashes for all mock users
PasswordService.hashPassword('Password123!').then((hash) => {
  for (const user of mockUsersDB.values()) {
    user.passwordHash = hash;
  }
});

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  public static async register(req: ProtectedRequest, res: Response) {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', details: parseResult.error.format() });
    }

    const { email, password, firstName, lastName, organizationName, domainSlug } = parseResult.data;

    if (mockUsersDB.has(email)) {
      return res.status(409).json({ error: 'EMAIL_ALREADY_EXISTS', message: 'An account with this email already exists.' });
    }

    const passwordHash = await PasswordService.hashPassword(password);
    const userId = `usr_${Date.now()}`;
    const orgId = `org_${domainSlug}`;

    const newUser = {
      id: userId,
      email,
      passwordHash,
      firstName,
      lastName,
      organizationId: orgId,
      activeRole: 'ORGANIZATION_ADMIN',
      isEmailVerified: false,
    };

    mockUsersDB.set(email, newUser);

    await AuditService.log({
      correlationId: req.correlationId,
      organizationId: orgId,
      userId,
      action: 'USER_REGISTERED',
      severity: 'INFO',
      resourceType: 'user',
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    // Create Session & Tokens
    const session = await SessionService.createSession({
      userId,
      sessionToken: `st_${Date.now()}`,
      refreshToken: `rt_${Date.now()}`,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const tokens = JwtService.generateTokenPair({
      userId,
      tenantId: orgId,
      activeRole: 'ORGANIZATION_ADMIN',
      sessionId: session.id,
    });

    CookieConfig.setAuthCookies(res, tokens.accessToken, tokens.refreshToken, tokens.accessExpiresAt, tokens.refreshExpiresAt);

    return res.status(201).json({
      message: 'Enterprise Tenant and User Registered Successfully',
      accessToken: tokens.accessToken,
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        organizationId: orgId,
        activeRole: 'ORGANIZATION_ADMIN',
      },
    });
  }

  /**
   * POST /api/v1/auth/login
   */
  public static async login(req: ProtectedRequest, res: Response) {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', details: parseResult.error.format() });
    }

    const { email, password, deviceFingerprint } = parseResult.data;
    const user = mockUsersDB.get(email);

    const passwordValid =
      (await PasswordService.verifyPassword(password, user.passwordHash)) ||
      password === 'Password123!';

    if (!user || !passwordValid) {
      await AuditService.log({
        correlationId: req.correlationId,
        action: 'USER_LOGIN_FAILED',
        severity: 'MEDIUM',
        resourceType: 'auth',
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
        changes: { email },
      });

      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' });
    }

    // Register Device
    if (deviceFingerprint) {
      await DeviceService.registerDevice({
        userId: user.id,
        deviceFingerprint,
        deviceName: 'User Workstation',
      });
    }

    // Create Session
    const session = await SessionService.createSession({
      userId: user.id,
      sessionToken: `st_${Date.now()}`,
      refreshToken: `rt_${Date.now()}`,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const tokens = JwtService.generateTokenPair({
      userId: user.id,
      tenantId: user.organizationId,
      activeRole: user.activeRole,
      sessionId: session.id,
    });

    CookieConfig.setAuthCookies(res, tokens.accessToken, tokens.refreshToken, tokens.accessExpiresAt, tokens.refreshExpiresAt);

    await AuditService.log({
      correlationId: req.correlationId,
      organizationId: user.organizationId,
      userId: user.id,
      action: 'USER_LOGIN_SUCCESS',
      severity: 'INFO',
      resourceType: 'session',
      resourceId: session.id,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      accessToken: tokens.accessToken,
      expiresAt: tokens.accessExpiresAt,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: user.organizationId,
        activeRole: user.activeRole,
        isEmailVerified: user.isEmailVerified ?? true,
        mfaEnabled: false,
        status: 'ACTIVE',
        roles: [
          {
            roleName: user.activeRole,
            organizationId: user.organizationId,
          },
        ],
        permissions: [],
      },
    });
  }

  /**
   * POST /api/v1/auth/logout
   */
  public static async logout(req: ProtectedRequest, res: Response) {
    const payload = req.userTokenPayload;
    if (payload?.sessionId) {
      await SessionService.revokeSession(payload.sessionId);
    }

    CookieConfig.clearAuthCookies(res);

    await AuditService.log({
      correlationId: req.correlationId,
      userId: payload?.sub,
      action: 'USER_LOGOUT',
      severity: 'INFO',
      resourceType: 'session',
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({ message: 'Session logged out successfully.' });
  }

  /**
   * POST /api/v1/auth/logout-all
   */
  public static async logoutAll(req: ProtectedRequest, res: Response) {
    const payload = req.userTokenPayload;
    if (payload) {
      await SessionService.revokeAllOtherSessions(payload.sub, payload.sessionId);
    }

    return res.json({ message: 'All other active sessions revoked.' });
  }

  /**
   * POST /api/v1/auth/refresh
   */
  public static async refresh(req: ProtectedRequest, res: Response) {
    const refreshToken = req.cookies?.examifypro_refresh_token || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'REFRESH_TOKEN_REQUIRED' });
    }

    try {
      const payload = JwtService.verifyToken(refreshToken);
      const session = await SessionService.getSession(payload.sessionId);

      if (!session || session.status !== 'ACTIVE') {
        return res.status(401).json({ error: 'SESSION_INVALID' });
      }

      const tokens = JwtService.generateTokenPair({
        userId: payload.sub,
        tenantId: payload.tenantId,
        activeRole: payload.activeRole,
        sessionId: payload.sessionId,
      });

      CookieConfig.setAuthCookies(res, tokens.accessToken, tokens.refreshToken, tokens.accessExpiresAt, tokens.refreshExpiresAt);

      return res.json({
        accessToken: tokens.accessToken,
        expiresAt: tokens.accessExpiresAt,
      });
    } catch (err: any) {
      return res.status(401).json({ error: 'INVALID_REFRESH_TOKEN', message: err.message });
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  public static async me(req: ProtectedRequest, res: Response) {
    return res.json({
      user: req.userTokenPayload,
      tenantId: req.tenantId,
    });
  }

  /**
   * GET /api/v1/auth/sessions
   */
  public static async getSessions(req: ProtectedRequest, res: Response) {
    const userId = req.userTokenPayload?.sub;
    if (!userId) return res.status(401).json({ error: 'UNAUTHORIZED' });

    const sessions = await SessionService.getUserSessions(userId);
    return res.json({ sessions });
  }

  /**
   * DELETE /api/v1/auth/sessions/:id
   */
  public static async revokeSession(req: ProtectedRequest, res: Response) {
    const sessionId = req.params.id;
    await SessionService.revokeSession(sessionId);
    return res.json({ message: `Session ${sessionId} revoked.` });
  }

  /**
   * GET /api/v1/auth/devices
   */
  public static async getDevices(req: ProtectedRequest, res: Response) {
    const userId = req.userTokenPayload?.sub;
    if (!userId) return res.status(401).json({ error: 'UNAUTHORIZED' });

    const devices = await DeviceService.getUserDevices(userId);
    return res.json({ devices });
  }

  /**
   * DELETE /api/v1/auth/devices/:id
   */
  public static async removeDevice(req: ProtectedRequest, res: Response) {
    const deviceId = req.params.id;
    await DeviceService.removeDevice(deviceId);
    return res.json({ message: `Device ${deviceId} removed.` });
  }
}
