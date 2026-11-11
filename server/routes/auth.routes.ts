import { Router, Response } from 'express';
import { authenticateToken, resolveTenantContext, requirePermission, AuthenticatedRequest } from '../middleware/auth.middleware';
import { auditService } from '../services/audit.service';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', async (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'Email and password required' });
  }

  await auditService.logEvent({
    actorId: 'usr_mock_01',
    actorRole: 'ORGANIZATION_ADMIN',
    action: 'AUTH_LOGIN_SUCCESS',
    resourceType: 'user_session',
    ipAddress: req.ip || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Unknown',
  });

  return res.json({
    accessToken: `jwt_mock_${Date.now()}`,
    expiresAt: Date.now() + 15 * 60 * 1000,
    user: {
      id: 'usr_mock_01',
      email,
      firstName: 'Eleanor',
      lastName: 'Rousseau',
      isEmailVerified: true,
      mfaEnabled: true,
      status: 'ACTIVE',
      roles: [{ roleName: 'ORGANIZATION_ADMIN', organizationId: 'org_mit_01' }],
      permissions: ['user.read', 'user.create', 'exam.read', 'exam.create', 'tenant.manage'],
    },
    activeOrganization: {
      id: 'org_mit_01',
      name: 'Massachusetts Institute of Technology',
      slug: 'mit-main',
      status: 'ACTIVE',
    },
  });
});

// POST /api/v1/auth/logout
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  await auditService.logEvent({
    actorId: req.user?.id,
    action: 'AUTH_LOGOUT',
    resourceType: 'user_session',
    ipAddress: req.ip || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Unknown',
  });

  return res.json({ message: 'Session revoked successfully' });
});

// GET /api/v1/auth/me
router.get('/me', authenticateToken, resolveTenantContext, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    user: req.user,
    tenantId: req.tenantId,
  });
});

// GET /api/v1/auth/audit-logs
router.get('/audit-logs', authenticateToken, resolveTenantContext, requirePermission('audit.read'), (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    logs: [
      {
        id: 'aud_1',
        action: 'AUTH_LOGIN_SUCCESS',
        actorEmail: req.user?.email,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.42',
      },
    ],
  });
});

export default router;
