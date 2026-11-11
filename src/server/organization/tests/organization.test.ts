import { describe, it, expect } from 'vitest';
import { OrganizationService } from '../services/organization.service';
import { InvitationService } from '../services/invitation.service';

describe('Organization & Multi-Tenant Management Engine', () => {
  it('should list pre-seeded tenant organizations', async () => {
    const orgs = await OrganizationService.listOrganizations();
    expect(orgs.length).toBeGreaterThan(0);
    expect(orgs[0]).toHaveProperty('slug');
  });

  it('should create a new organization tenant', async () => {
    const newOrg = await OrganizationService.createOrganization({
      name: 'Harvard University',
      slug: 'harvard-main',
      primaryDomain: 'harvard.edu',
    });

    expect(newOrg.id).toContain('org_');
    expect(newOrg.status).toBe('ACTIVE');
  });

  it('should dispatch single user invitation token', async () => {
    const inv = await InvitationService.createInvitation({
      organizationId: 'org_mit_01',
      invitedByUserId: 'usr_admin',
      email: 'test.prof@mit.edu',
      roleName: 'FACULTY',
    });

    expect(inv.token).toBeDefined();
    expect(inv.token.length).toBe(64); // 32-byte hex token
    expect(inv.status).toBe('PENDING');
  });

  it('should process bulk CSV user invitations', async () => {
    const invs = await InvitationService.bulkInviteUsers({
      organizationId: 'org_mit_01',
      invitedByUserId: 'usr_admin',
      invitations: [
        { email: 'user1@mit.edu', roleName: 'STUDENT' },
        { email: 'user2@mit.edu', roleName: 'INVIGILATOR' },
      ],
    });

    expect(invs.length).toBe(2);
    expect(invs[0].email).toBe('user1@mit.edu');
  });
});
