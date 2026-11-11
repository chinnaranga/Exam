import { Response } from 'express';
import { TenantScopedRequest } from '../../tenant/middleware/tenant.middleware';
import { OrganizationService } from '../services/organization.service';
import { InvitationService } from '../services/invitation.service';

export class OrganizationController {
  public static async listOrganizations(req: TenantScopedRequest, res: Response) {
    const orgs = await OrganizationService.listOrganizations();
    return res.json({ organizations: orgs });
  }

  public static async getOrganization(req: TenantScopedRequest, res: Response) {
    const id = req.params.id || req.tenantId;
    if (!id) return res.status(400).json({ error: 'ORGANIZATION_ID_REQUIRED' });

    const org = await OrganizationService.getOrganizationById(id);
    if (!org) return res.status(404).json({ error: 'ORGANIZATION_NOT_FOUND' });

    return res.json({ organization: org });
  }

  public static async createOrganization(req: TenantScopedRequest, res: Response) {
    const { name, slug, type, primaryDomain } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'NAME_AND_SLUG_REQUIRED' });
    }

    const created = await OrganizationService.createOrganization({ name, slug, type, primaryDomain });
    return res.status(201).json({ organization: created });
  }

  public static async updateOrganization(req: TenantScopedRequest, res: Response) {
    const id = req.params.id;
    const updated = await OrganizationService.updateOrganization(id, req.body);
    if (!updated) return res.status(404).json({ error: 'ORGANIZATION_NOT_FOUND' });

    return res.json({ organization: updated });
  }

  public static async deleteOrganization(req: TenantScopedRequest, res: Response) {
    const id = req.params.id;
    const deleted = await OrganizationService.softDeleteOrganization(id);
    return res.json({ success: deleted });
  }

  // Invitation Endpoints
  public static async createInvitation(req: TenantScopedRequest, res: Response) {
    const { email, roleName } = req.body;
    const tenantId = req.tenantId || 'org_mit_01';

    const inv = await InvitationService.createInvitation({
      organizationId: tenantId,
      invitedByUserId: (req as any).userTokenPayload?.sub || 'usr_mock_admin',
      email,
      roleName: roleName || 'FACULTY',
    });

    return res.status(201).json({ invitation: inv });
  }

  public static async listInvitations(req: TenantScopedRequest, res: Response) {
    const tenantId = req.tenantId || 'org_mit_01';
    const invitations = await InvitationService.listTenantInvitations(tenantId);
    return res.json({ invitations });
  }

  public static async revokeInvitation(req: TenantScopedRequest, res: Response) {
    const id = req.params.id;
    const revoked = await InvitationService.revokeInvitation(id);
    return res.json({ success: revoked });
  }
}
