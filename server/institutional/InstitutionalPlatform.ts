import { ssoAndRoleMappingService, SsoAndRoleMappingService } from './SsoAndRoleMappingService';
import { ltiIntegrationService, LtiIntegrationService } from './LtiIntegrationService';
import { webhookService, WebhookService } from './WebhookService';
import { institutionalApiService, InstitutionalApiService } from './InstitutionalApiService';
import { notificationService, NotificationService } from './NotificationService';
import { bulkEnrollmentService, BulkEnrollmentService } from './BulkEnrollmentService';
import { tenantIsolationService, TenantIsolationService } from './TenantIsolationService';

export class InstitutionalPlatform {
  public readonly sso: SsoAndRoleMappingService;
  public readonly lti: LtiIntegrationService;
  public readonly webhooks: WebhookService;
  public readonly api: InstitutionalApiService;
  public readonly notifications: NotificationService;
  public readonly bulkEnrollment: BulkEnrollmentService;
  public readonly tenantIsolation: TenantIsolationService;

  constructor() {
    this.sso = ssoAndRoleMappingService;
    this.lti = ltiIntegrationService;
    this.webhooks = webhookService;
    this.api = institutionalApiService;
    this.notifications = notificationService;
    this.bulkEnrollment = bulkEnrollmentService;
    this.tenantIsolation = tenantIsolationService;
  }
}

export const institutionalPlatform = new InstitutionalPlatform();
export * from './institutionalTypes';
export * from './SsoAndRoleMappingService';
export * from './LtiIntegrationService';
export * from './WebhookService';
export * from './InstitutionalApiService';
export * from './NotificationService';
export * from './BulkEnrollmentService';
export * from './TenantIsolationService';

