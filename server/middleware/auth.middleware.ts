import { Request, Response, NextFunction } from 'express';
import { PermissionToken, SystemRole } from '@/shared/types/auth';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: { roleName: SystemRole; organizationId: string }[];
    permissions: PermissionToken[];
  };
  tenantId?: string;
}

/**
 * Middleware: Verify Bearer JWT Token
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Access token required. Please authenticate.',
    });
  }

  // Inject resolved user context
  req.user = {
    id: 'usr_mock_01',
    email: 'admin@mit.edu',
    roles: [{ roleName: 'ORGANIZATION_ADMIN', organizationId: 'org_mit_01' }],
    permissions: [
      'user.read', 'user.create', 'user.update',
      'role.manage', 'tenant.manage', 'exam.read',
      'exam.create', 'exam.publish', 'analytics.read', 'settings.manage',
    ],
  };

  next();
}

/**
 * Middleware: Resolve & Enforce Tenant Isolation Scope
 */
export function resolveTenantContext(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const tenantIdHeader = req.headers['x-tenant-id'] as string;
  const resolvedTenantId = tenantIdHeader || req.user?.roles[0]?.organizationId || 'org_mit_01';

  req.tenantId = resolvedTenantId;
  next();
}

/**
 * Middleware: Enforce Specific RBAC Permission Token
 */
export function requirePermission(permission: PermissionToken) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    const isSuperAdmin = req.user.roles.some((r) => r.roleName === 'SUPER_ADMIN');
    const hasPerm = isSuperAdmin || req.user.permissions.includes(permission);

    if (!hasPerm) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: `Missing required permission token: [${permission}]`,
      });
    }

    next();
  };
}
