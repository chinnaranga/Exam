import crypto from 'crypto';

export interface JwtPayload {
  sub: string;             // User ID
  tenantId?: string;        // Active Organization Tenant ID
  activeRole: string;       // Active System Role
  permissionVersion: number;// Role permission cache version
  sessionId: string;        // Active Session ID
  iat: number;              // Issued At timestamp
  exp: number;              // Expiration timestamp
  iss: string;              // Issuer
  aud: string;              // Audience
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing or shorter than 32 characters.');
}
const JWT_ISSUER = 'examifypro.auth';
const JWT_AUDIENCE = 'examifypro.api';
const ACCESS_TOKEN_EXPIRY_SEC = 15 * 60; // 15 Minutes
const REFRESH_TOKEN_EXPIRY_SEC = 7 * 24 * 60 * 60; // 7 Days

export class JwtService {
  /**
   * Helper: Generate HMAC SHA256 Signature
   */
  private static sign(header: string, payload: string): string {
    const data = `${header}.${payload}`;
    return crypto
      .createHmac('sha256', JWT_SECRET)
      .update(data)
      .digest('base64url');
  }

  /**
   * Issue dual JWT Token Pair (Access Token + Refresh Token)
   */
  public static generateTokenPair(params: {
    userId: string;
    tenantId?: string;
    activeRole: string;
    permissionVersion?: number;
    sessionId: string;
  }): TokenPair {
    const now = Math.floor(Date.now() / 1000);
    const accessExp = now + ACCESS_TOKEN_EXPIRY_SEC;
    const refreshExp = now + REFRESH_TOKEN_EXPIRY_SEC;

    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');

    const accessPayloadData: JwtPayload = {
      sub: params.userId,
      tenantId: params.tenantId,
      activeRole: params.activeRole,
      permissionVersion: params.permissionVersion || 1,
      sessionId: params.sessionId,
      iat: now,
      exp: accessExp,
      iss: JWT_ISSUER,
      aud: JWT_AUDIENCE,
    };

    const refreshPayloadData: JwtPayload = {
      ...accessPayloadData,
      exp: refreshExp,
    };

    const accessPayload = Buffer.from(JSON.stringify(accessPayloadData)).toString('base64url');
    const refreshPayload = Buffer.from(JSON.stringify(refreshPayloadData)).toString('base64url');

    const accessSig = this.sign(header, accessPayload);
    const refreshSig = this.sign(header, refreshPayload);

    return {
      accessToken: `${header}.${accessPayload}.${accessSig}`,
      refreshToken: `${header}.${refreshPayload}.${refreshSig}`,
      accessExpiresAt: accessExp * 1000,
      refreshExpiresAt: refreshExp * 1000,
    };
  }

  /**
   * Verify and Decode Access or Refresh JWT Token
   */
  public static verifyToken(token: string): JwtPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('INVALID_TOKEN_FORMAT');
    }

    const [header, payload, signature] = parts;
    const expectedSignature = this.sign(header, payload);

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      throw new Error('INVALID_TOKEN_SIGNATURE');
    }

    const decoded: JwtPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp < now) {
      throw new Error('TOKEN_EXPIRED');
    }

    if (decoded.iss !== JWT_ISSUER || decoded.aud !== JWT_AUDIENCE) {
      throw new Error('INVALID_TOKEN_CLAIMS');
    }

    return decoded;
  }
}
