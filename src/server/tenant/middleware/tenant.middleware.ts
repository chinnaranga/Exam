import { Request, Response, NextFunction } from 'express';

export interface TenantScopedRequest extends Request {
  tenantId?: string;
  organizationSlug?: string;
}

/**
 * Middleware: Enforce Multi-Tenant Isolation Boundaries
 */
export function enforceTenantIsolation(req: TenantScopedRequest, res: Response, next: NextFunction) {
  const tenantHeader = req.headers['x-tenant-id'] as string;
  const authTenant = (req as any).userTokenPayload?.tenantId;

  // Resolved tenant ID from header or authenticated JWT payload
  const resolvedTenantId = tenantHeader || authTenant || 'org_mit_01';

  // Prevent cross-tenant boundary breach if user tries to query another org
  if (authTenant && tenantHeader && authTenant !== tenantHeader) {
    const isSuperAdmin = (req as any).userTokenPayload?.activeRole === 'SUPER_ADMIN';
    if (!isSuperAdmin) {
      return res.status(403).json({
        error: 'TENANT_ACCESS_DENIED',
        message: 'Security Violation: Attempted cross-tenant boundary breach.',
      });
    }
  }

  req.tenantId = resolvedTenantId;
  next();
}
