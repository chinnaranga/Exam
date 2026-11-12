import {
  TenantInstitutionalProfile,
  TenantBranding,
} from './institutionalTypes';

export class TenantIsolationService {
  private tenantProfiles: Map<string, TenantInstitutionalProfile> = new Map();

  constructor() {
    // Seed default tenants: MIT, Stanford, Harvard, and Generic University
    this.registerTenant({
      tenantId: 'tenant_university_main',
      branding: {
        institutionName: 'Apex Institute of Technology',
        logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=200&h=80&q=80',
        primaryColor: '#6C4DFF',
        secondaryColor: '#2B2350',
        subdomain: 'apex-tech',
        customDomain: 'exams.apex.edu',
        bannerMessage: 'Welcome to the Apex Institute Cryptographic Examination Portal',
      },
      defaultSecurityProfile: 'HIGH_STAKES',
      retentionPolicyId: 'ret_univ_standard',
      allowedEmailDomains: ['apex.edu', 'student.apex.edu', 'faculty.apex.edu'],
      ssoEnforced: true,
      activeLmsPlatforms: ['CANVAS', 'MOODLE'],
    });

    this.registerTenant({
      tenantId: 'tenant_stanford_demo',
      branding: {
        institutionName: 'Stanford Academic Assessment Center',
        logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&h=80&q=80',
        primaryColor: '#8C1515',
        secondaryColor: '#2E2D29',
        subdomain: 'stanford-exams',
        customDomain: 'proctor.stanford.edu',
        bannerMessage: 'Stanford Honor Code Strictly Enforced for all Proctored Exams',
      },
      defaultSecurityProfile: 'HIGH_STAKES',
      retentionPolicyId: 'ret_stanford_audit',
      allowedEmailDomains: ['stanford.edu'],
      ssoEnforced: true,
      activeLmsPlatforms: ['CANVAS'],
    });
  }

  public registerTenant(profile: TenantInstitutionalProfile): TenantInstitutionalProfile {
    this.tenantProfiles.set(profile.tenantId, profile);
    return profile;
  }

  public getTenantProfile(tenantId: string): TenantInstitutionalProfile | undefined {
    return this.tenantProfiles.get(tenantId);
  }

  public getAllTenants(): TenantInstitutionalProfile[] {
    return Array.from(this.tenantProfiles.values());
  }

  public updateBranding(tenantId: string, branding: Partial<TenantBranding>): TenantInstitutionalProfile {
    const profile = this.tenantProfiles.get(tenantId);
    if (!profile) throw new Error(`Tenant "${tenantId}" not found.`);

    profile.branding = { ...profile.branding, ...branding };
    this.tenantProfiles.set(tenantId, profile);
    return profile;
  }

  /**
   * Verifies whether an email belongs to the tenant's permitted email domains.
   */
  public isEmailAllowed(tenantId: string, email: string): boolean {
    const profile = this.tenantProfiles.get(tenantId);
    if (!profile || profile.allowedEmailDomains.length === 0) return true;

    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;

    return profile.allowedEmailDomains.some(
      (d) => d.toLowerCase() === domain || domain.endsWith(`.${d.toLowerCase()}`)
    );
  }
}

export const tenantIsolationService = new TenantIsolationService();

