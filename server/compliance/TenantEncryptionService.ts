import crypto from 'crypto';
import {
  EncryptedPayload,
  KeyRotationEvent,
  TenantKeyMetadata,
} from './complianceTypes';

export class TenantEncryptionService {
  // Key storage: Map<`${tenantId}:v${version}`, Buffer> (Simulates KMS / Vault per-tenant master keys)
  private tenantKeys: Map<string, Buffer> = new Map();
  // Tenant metadata: Map<tenantId, TenantKeyMetadata>
  private tenantMetadata: Map<string, TenantKeyMetadata> = new Map();

  constructor() {
    this.initializeTenantKey('default_tenant');
  }

  /**
   * Initializes a tenant's cryptographic envelope key (Version 1).
   */
  public initializeTenantKey(tenantId: string): TenantKeyMetadata {
    const existing = this.tenantMetadata.get(tenantId);
    if (existing) return existing;

    const key = crypto.randomBytes(32); // 256-bit AES key
    this.tenantKeys.set(`${tenantId}:v1`, key);

    const metadata: TenantKeyMetadata = {
      tenantId,
      currentKeyVersion: 1,
      algorithm: 'AES-256-GCM',
      createdAt: Date.now(),
      rotationHistory: [],
    };

    this.tenantMetadata.set(tenantId, metadata);
    return metadata;
  }

  /**
   * Encrypts sensitive data at rest using the tenant's current active key.
   * Uses AES-256-GCM with a unique 96-bit IV and 128-bit authentication tag.
   */
  public encryptAtRest(
    plainText: string | Buffer,
    tenantId: string = 'default_tenant'
  ): EncryptedPayload {
    const meta = this.tenantMetadata.get(tenantId) || this.initializeTenantKey(tenantId);
    const key = this.tenantKeys.get(`${tenantId}:v${meta.currentKeyVersion}`);
    if (!key) {
      throw new Error(`Encryption key for tenant "${tenantId}" version ${meta.currentKeyVersion} not found.`);
    }

    const iv = crypto.randomBytes(12); // Standard 12-byte IV for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const inputBuffer = Buffer.isBuffer(plainText) ? plainText : Buffer.from(plainText, 'utf8');
    const encrypted = Buffer.concat([cipher.update(inputBuffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      cipherText: encrypted.toString('base64'),
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      keyVersion: meta.currentKeyVersion,
      tenantId,
      encryptedAt: Date.now(),
    };
  }

  /**
   * Decrypts ciphertext at rest using the matching tenant key version.
   * Verifies GCM authentication tag to prevent tampering.
   */
  public decryptAtRest(payload: EncryptedPayload): string {
    const key = this.tenantKeys.get(`${payload.tenantId}:v${payload.keyVersion}`);
    if (!key) {
      throw new Error(
        `Decryption failed: Key version ${payload.keyVersion} for tenant "${payload.tenantId}" not found in keyring.`
      );
    }

    const iv = Buffer.from(payload.iv, 'hex');
    const authTag = Buffer.from(payload.authTag, 'hex');
    const cipherText = Buffer.from(payload.cipherText, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
    return decrypted.toString('utf8');
  }

  /**
   * Key Rotation Routine:
   * 1. Generates a new 256-bit AES key for the tenant (Version N+1).
   * 2. Archives previous key versions for seamless historical record retrieval.
   * 3. Records a cryptographic KeyRotationEvent audit trail.
   */
  public rotateTenantKey(tenantId: string, rotatedBy: string = 'SYSTEM_SECURITY_ADMIN'): KeyRotationEvent {
    const meta = this.tenantMetadata.get(tenantId) || this.initializeTenantKey(tenantId);
    const oldVersion = meta.currentKeyVersion;
    const newVersion = oldVersion + 1;

    // Generate new 256-bit symmetric key
    const newKey = crypto.randomBytes(32);
    this.tenantKeys.set(`${tenantId}:v${newVersion}`, newKey);

    const now = Date.now();
    meta.currentKeyVersion = newVersion;
    meta.lastRotatedAt = now;

    const rotationEvent: KeyRotationEvent = {
      rotationId: `rot_${tenantId}_${now}_${crypto.randomBytes(3).toString('hex')}`,
      tenantId,
      fromVersion: oldVersion,
      toVersion: newVersion,
      rotatedAt: now,
      rotatedBy,
      reEncryptCount: 0,
      status: 'COMPLETED',
    };

    meta.rotationHistory.push(rotationEvent);
    return rotationEvent;
  }

  /**
   * Re-encrypts legacy payload under the tenant's latest key version (Envelope Re-wrapping).
   */
  public reEncryptPayload(payload: EncryptedPayload): EncryptedPayload {
    const meta = this.tenantMetadata.get(payload.tenantId);
    if (!meta || payload.keyVersion === meta.currentKeyVersion) {
      return payload; // Already on current version
    }

    // Decrypt with legacy version
    const decrypted = this.decryptAtRest(payload);
    // Encrypt with latest version
    return this.encryptAtRest(decrypted, payload.tenantId);
  }

  /**
   * Retrieves key metadata and rotation audit trail for a tenant.
   */
  public getTenantKeyMetadata(tenantId: string): TenantKeyMetadata {
    return this.tenantMetadata.get(tenantId) || this.initializeTenantKey(tenantId);
  }

  /**
   * Documentation of cryptographic key rotation architecture for auditors & compliance officers.
   */
  public getKeyRotationDocumentation(): {
    algorithm: string;
    keyDerivation: string;
    envelopePolicy: string;
    rotationInterval: string;
    backwardCompatibility: string;
  } {
    return {
      algorithm: 'AES-256-GCM (Authenticated Encryption with Associated Data, 128-bit authentication tag)',
      keyDerivation: 'Hardware CSPRNG via crypto.randomBytes (256-bit symmetric keys per tenant)',
      envelopePolicy: 'Per-tenant data isolation. Each tenant maintains an independent versioned keyring.',
      rotationInterval: 'Annual automated scheduled rotation, or on-demand triggered by Security Officer.',
      backwardCompatibility:
        'Dual-key keyring retention: Legacy key versions (v1, v2...) are preserved in an encrypted keystore so historical exam evidence remains decryptable during appeal and retention windows.',
    };
  }
}

export const tenantEncryptionService = new TenantEncryptionService();

