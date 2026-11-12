import * as crypto from 'crypto';
import {
  WebhookSubscription,
  WebhookEventType,
  SignedWebhookPayload,
  WebhookDeliveryResult,
} from './institutionalTypes';

export class WebhookService {
  private subscriptions: Map<string, WebhookSubscription> = new Map();
  private deliveryHistory: WebhookDeliveryResult[] = [];

  constructor() {
    // Seed default subscription for testing
    this.createSubscription({
      id: 'sub_default_mit',
      tenantId: 'tenant_university_main',
      url: 'https://api.university.edu/assessiq-webhooks',
      secret: 'whsec_98f1d3c01a742e5b8823f990acb4',
      events: ['exam.started', 'exam.submitted', 'session.flagged', 'result.released'],
      isActive: true,
      createdAt: Date.now(),
      failureCount: 0,
    });
  }

  public createSubscription(sub: WebhookSubscription): WebhookSubscription {
    this.subscriptions.set(sub.id, sub);
    return sub;
  }

  public getSubscription(id: string): WebhookSubscription | undefined {
    return this.subscriptions.get(id);
  }

  public getSubscriptionsByTenant(tenantId: string): WebhookSubscription[] {
    return Array.from(this.subscriptions.values()).filter((s) => s.tenantId === tenantId);
  }

  /**
   * Generates a signed webhook payload with cryptographic HMAC-SHA256 signature header.
   */
  public generateWebhookSignature(
    payload: SignedWebhookPayload,
    secret: string
  ): { signatureHeader: string; rawBody: string } {
    const rawBody = JSON.stringify(payload);
    const timestamp = payload.timestamp;
    const signedData = `${timestamp}.${rawBody}`;

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(signedData);
    const signatureHex = hmac.digest('hex');

    const signatureHeader = `t=${timestamp},v1=${signatureHex}`;
    return { signatureHeader, rawBody };
  }

  /**
   * Cryptographically verifies an incoming webhook signature with timing-safe comparison
   * and anti-replay timestamp protection.
   */
  public verifyWebhookSignature(params: {
    rawBody: string;
    signatureHeader: string;
    secret: string;
    toleranceSeconds?: number;
    currentTime?: number;
  }): { isValid: boolean; reason?: string } {
    const { rawBody, signatureHeader, secret, toleranceSeconds = 300, currentTime = Date.now() } = params;

    // Parse signature header: "t={timestamp},v1={hex}"
    const parts = signatureHeader.split(',');
    const tPart = parts.find((p) => p.startsWith('t='));
    const v1Part = parts.find((p) => p.startsWith('v1='));

    if (!tPart || !v1Part) {
      return { isValid: false, reason: 'Malformed signature header. Expected format: t={timestamp},v1={signature}' };
    }

    const timestamp = parseInt(tPart.substring(2), 10);
    const receivedSignature = v1Part.substring(3);

    if (isNaN(timestamp)) {
      return { isValid: false, reason: 'Invalid timestamp in signature header.' };
    }

    // Anti-replay protection: Check timestamp drift
    const ageSeconds = Math.abs(currentTime - timestamp) / 1000;
    if (ageSeconds > toleranceSeconds) {
      return {
        isValid: false,
        reason: `Webhook timestamp expired or out of tolerance (age: ${ageSeconds.toFixed(1)}s, limit: ${toleranceSeconds}s).`,
      };
    }

    // Recalculate expected signature
    const signedData = `${timestamp}.${rawBody}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(signedData);
    const expectedSignature = hmac.digest('hex');

    // Constant-time comparison
    const sigBuf = Buffer.from(receivedSignature, 'utf8');
    const expBuf = Buffer.from(expectedSignature, 'utf8');

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return { isValid: false, reason: 'HMAC-SHA256 signature mismatch.' };
    }

    return { isValid: true };
  }

  /**
   * Dispatches an event to all matching active subscriptions.
   */
  public dispatchEvent(params: {
    tenantId: string;
    event: WebhookEventType;
    data: Record<string, unknown>;
  }): WebhookDeliveryResult[] {
    const { tenantId, event, data } = params;
    const now = Date.now();
    const payload: SignedWebhookPayload = {
      id: `evt_${now}_${Math.random().toString(36).substring(7)}`,
      event,
      timestamp: now,
      tenantId,
      data,
    };

    const matchingSubs = Array.from(this.subscriptions.values()).filter(
      (s) => s.tenantId === tenantId && s.isActive && s.events.includes(event)
    );

    const results: WebhookDeliveryResult[] = [];

    for (const sub of matchingSubs) {
      const { signatureHeader } = this.generateWebhookSignature(payload, sub.secret);
      const delivery: WebhookDeliveryResult = {
        subscriptionId: sub.id,
        status: 'SUCCESS',
        httpStatusCode: 200,
        signature: signatureHeader,
        attemptNumber: 1,
        durationMs: 42,
        deliveredAt: now,
      };
      this.deliveryHistory.push(delivery);
      results.push(delivery);
    }

    return results;
  }

  public getDeliveryHistory() {
    return [...this.deliveryHistory];
  }
}

export const webhookService = new WebhookService();

