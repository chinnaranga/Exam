import crypto from 'crypto';

export interface InvitationRecord {
  id: string;
  organizationId: string;
  invitedByUserId: string;
  email: string;
  roleName: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  expiresAt: Date;
  createdAt: Date;
}

const invitationsStore = new Map<string, InvitationRecord>();

export class InvitationService {
  /**
   * Dispatch single email invitation
   */
  public static async createInvitation(input: {
    organizationId: string;
    invitedByUserId: string;
    email: string;
    roleName: string;
  }): Promise<InvitationRecord> {
    const id = `inv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days

    const inv: InvitationRecord = {
      id,
      organizationId: input.organizationId,
      invitedByUserId: input.invitedByUserId,
      email: input.email,
      roleName: input.roleName,
      token,
      status: 'PENDING',
      expiresAt,
      createdAt: new Date(),
    };

    invitationsStore.set(id, inv);
    return inv;
  }

  /**
   * Dispatch bulk CSV invitations
   */
  public static async bulkInviteUsers(input: {
    organizationId: string;
    invitedByUserId: string;
    invitations: { email: string; roleName: string }[];
  }): Promise<InvitationRecord[]> {
    const results: InvitationRecord[] = [];
    for (const item of input.invitations) {
      const inv = await this.createInvitation({
        organizationId: input.organizationId,
        invitedByUserId: input.invitedByUserId,
        email: item.email,
        roleName: item.roleName,
      });
      results.push(inv);
    }
    return results;
  }

  /**
   * List pending invitations for tenant
   */
  public static async listTenantInvitations(organizationId: string): Promise<InvitationRecord[]> {
    return Array.from(invitationsStore.values()).filter(
      (inv) => inv.organizationId === organizationId
    );
  }

  /**
   * Revoke invitation
   */
  public static async revokeInvitation(id: string): Promise<boolean> {
    const inv = invitationsStore.get(id);
    if (inv) {
      inv.status = 'REVOKED';
      return true;
    }
    return false;
  }
}
