import {
  TenantSsoConfig,
  RoleMappingRule,
  SsoUserIdentity,
  SsoProtocol,
  IdpProvider,
} from './institutionalTypes';

export class SsoAndRoleMappingService {
  private tenantConfigs: Map<string, TenantSsoConfig> = new Map();

  constructor() {
    // Seed default institutional configurations
    this.configureTenantSso({
      tenantId: 'tenant_university_main',
      isEnabled: true,
      protocol: 'OIDC',
      provider: 'GOOGLE_WORKSPACE',
      oidcConfig: {
        issuer: 'https://accounts.google.com',
        clientId: 'assessiq-univ-main.apps.googleusercontent.com',
        clientSecret: 'sec_mock_oidc_secret',
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        userinfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
        jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
      },
      roleMappingRules: [
        {
          id: 'rule_faculty',
          claimKey: 'groups',
          matchType: 'CONTAINS',
          claimValue: 'Faculty_Staff',
          assignedRole: 'FACULTY',
        },
        {
          id: 'rule_proctors',
          claimKey: 'roles',
          matchType: 'CONTAINS',
          claimValue: 'Certified_Proctor',
          assignedRole: 'INVIGILATOR',
        },
        {
          id: 'rule_admin',
          claimKey: 'email',
          matchType: 'REGEX',
          claimValue: '.*admin@university\\.edu$',
          assignedRole: 'ORG_ADMIN',
        },
      ],
      defaultRole: 'STUDENT',
    });
  }

  public configureTenantSso(config: TenantSsoConfig): void {
    this.tenantConfigs.set(config.tenantId, config);
  }

  public getTenantSsoConfig(tenantId: string): TenantSsoConfig | undefined {
    return this.tenantConfigs.get(tenantId);
  }

  /**
   * Generates SAML 2.0 Service Provider Metadata XML for an institution.
   */
  public generateSpMetadataXml(tenantId: string, host: string = 'https://assessiq.edu'): string {
    const entityId = `${host}/saml/${tenantId}/metadata`;
    const acsUrl = `${host}/saml/${tenantId}/acs`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${entityId}">
  <md:SPSSODescriptor AuthnRequestsSigned="true" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${acsUrl}" index="1" isDefault="true"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`;
  }

  /**
   * Processes a SAML 2.0 Assertion response and resolves identity + role.
   */
  public processSamlResponse(params: {
    tenantId: string;
    samlAttributes: Record<string, unknown>;
  }): SsoUserIdentity {
    const { tenantId, samlAttributes } = params;
    const config = this.tenantConfigs.get(tenantId);
    if (!config || !config.isEnabled) {
      throw new Error(`SSO is not enabled or configured for tenant "${tenantId}".`);
    }

    const email = String(
      samlAttributes.email ||
      samlAttributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      ''
    );
    if (!email) {
      throw new Error('SAML Assertion missing mandatory email attribute.');
    }

    const firstName = String(
      samlAttributes.firstName ||
      samlAttributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] ||
      'Candidate'
    );
    const lastName = String(
      samlAttributes.lastName ||
      samlAttributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] ||
      ''
    );
    const idpUserId = String(samlAttributes.nameId || samlAttributes.uid || email);

    // Evaluate Role Mapping Rules
    const mappedRole = this.evaluateRoleMapping(
      config.roleMappingRules,
      samlAttributes,
      config.defaultRole
    );

    return {
      idpUserId,
      email,
      firstName,
      lastName,
      mappedRole,
      tenantId,
      rawClaims: samlAttributes,
    };
  }

  /**
   * Processes OpenID Connect (OIDC) ID token claims.
   */
  public processOidcCallback(params: {
    tenantId: string;
    claims: Record<string, unknown>;
  }): SsoUserIdentity {
    const { tenantId, claims } = params;
    const config = this.tenantConfigs.get(tenantId);
    if (!config || !config.isEnabled) {
      throw new Error(`OIDC is not enabled or configured for tenant "${tenantId}".`);
    }

    const email = String(claims.email || '');
    if (!email) {
      throw new Error('OIDC claims missing verified email.');
    }

    const firstName = String(claims.given_name || claims.name?.toString().split(' ')[0] || 'User');
    const lastName = String(
      claims.family_name || claims.name?.toString().split(' ').slice(1).join(' ') || ''
    );
    const idpUserId = String(claims.sub || email);

    const mappedRole = this.evaluateRoleMapping(
      config.roleMappingRules,
      claims,
      config.defaultRole
    );

    return {
      idpUserId,
      email,
      firstName,
      lastName,
      mappedRole,
      tenantId,
      rawClaims: claims,
    };
  }

  /**
   * Evaluates tenant role mapping rules against IdP attributes.
   */
  public evaluateRoleMapping(
    rules: RoleMappingRule[],
    claims: Record<string, unknown>,
    defaultRole: 'STUDENT' | 'FACULTY' | 'INVIGILATOR'
  ): 'STUDENT' | 'FACULTY' | 'INVIGILATOR' | 'ORG_ADMIN' {
    for (const rule of rules) {
      const claimVal = claims[rule.claimKey];
      if (claimVal === undefined || claimVal === null) continue;

      let matches = false;

      if (Array.isArray(claimVal)) {
        if (rule.matchType === 'CONTAINS') {
          matches = claimVal.some((item) =>
            String(item).toLowerCase().includes(rule.claimValue.toLowerCase())
          );
        } else if (rule.matchType === 'EXACT') {
          matches = claimVal.includes(rule.claimValue);
        }
      } else {
        const strVal = String(claimVal);
        if (rule.matchType === 'EXACT') {
          matches = strVal.toLowerCase() === rule.claimValue.toLowerCase();
        } else if (rule.matchType === 'CONTAINS') {
          matches = strVal.toLowerCase().includes(rule.claimValue.toLowerCase());
        } else if (rule.matchType === 'REGEX') {
          try {
            const re = new RegExp(rule.claimValue, 'i');
            matches = re.test(strVal);
          } catch {
            matches = false;
          }
        }
      }

      if (matches) {
        return rule.assignedRole;
      }
    }

    return defaultRole;
  }
}

export const ssoAndRoleMappingService = new SsoAndRoleMappingService();

