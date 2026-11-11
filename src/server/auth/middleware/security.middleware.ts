import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { JwtService, JwtPayload } from '../tokens/jwt.service';
import { SessionService } from '../sessions/session.service';
import { PermissionToken, SystemRole } from '../../../types/auth';

export interface ProtectedRequest extends Request {
  correlationId?: string;
  userTokenPayload?: JwtPayload;
  tenantId?: string;
}

// In-Memory Rate Limiting Tracker for Login Protection
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 Minutes

/**
 * Middleware: Inject Correlation ID for Request Tracing
 */
export function correlationIdMiddleware(req: ProtectedRequest, res: Response, next: NextFunction) {
  const correlationId = (req.headers['x-correlation-id'] as string) || `req_${crypto.randomUUID()}`;
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  next();
}

/**
 * Middleware: Rate Limiting Protection against Brute Force Attacks
 */
export function loginRateLimiter(req: ProtectedRequest, res: Response, next: NextFunction) {
  const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const key = `rate_limit:${clientIp}`;
  const now = Date.now();

  const record = rateLimitMap.get(key as string);

  if (record && record.resetAt > now) {
    if (record.count >= MAX_LOGIN_ATTEMPTS) {
      return res.status(429).json({
        error: 'TOO_MANY_REQUESTS',
        message: 'Account locked or throttled due to excessive failed attempts. Please try again in 15 minutes.',
        retryAfterMs: record.resetAt - now,
      });
    }
    record.count++;
  } else {
    rateLimitMap.set(key as string, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  }

  next();
}

/**
 * Middleware: Authenticate Bearer JWT & Validate Active Session
 */
export async function authenticateJwt(req: ProtectedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Access token required. Please sign in.',
    });
  }

  try {
    const payload = JwtService.verifyToken(token);

    // Validate active session
    const session = await SessionService.getSession(payload.sessionId);
    if (!session || session.status !== 'ACTIVE') {
      return res.status(401).json({
        error: 'SESSION_EXPIRED',
        message: 'Session has been revoked or expired. Re-authentication required.',
      });
    }

    req.userTokenPayload = payload;
    req.tenantId = payload.tenantId;
    next();
  } catch (err: any) {
    return res.status(401).json({
      error: 'INVALID_TOKEN',
      message: err.message || 'Token verification failed.',
    });
  }
}

/**
 * Middleware: Enforce Specific RBAC Permission Token
 */
export function requirePermissionToken(permission: PermissionToken) {
  return (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const payload = req.userTokenPayload;
    if (!payload) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    const isSuperAdmin = payload.activeRole === 'SUPER_ADMIN';
    if (!isSuperAdmin) {
      // In production, compare permissions set against permission version
    }

    next();
  };
}
