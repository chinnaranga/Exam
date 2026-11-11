export interface OrganizationDTO {
  id: string;
  name: string;
  slug: string;
  type: string;
  primaryDomain?: string;
  logoUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  createdAt: Date;
}

const mockOrganizationsStore = new Map<string, OrganizationDTO>([
  [
    'org_mit_01',
    {
      id: 'org_mit_01',
      name: 'Massachusetts Institute of Technology',
      slug: 'mit-main',
      type: 'UNIVERSITY',
      primaryDomain: 'mit.edu',
      logoUrl: '/logo.png',
      status: 'ACTIVE',
      createdAt: new Date(),
    },
  ],
  [
    'org_stanford_02',
    {
      id: 'org_stanford_02',
      name: 'Stanford University',
      slug: 'stanford-main',
      type: 'UNIVERSITY',
      primaryDomain: 'stanford.edu',
      logoUrl: '/logo-stanford.png',
      status: 'ACTIVE',
      createdAt: new Date(),
    },
  ],
]);

export class OrganizationService {
  public static async listOrganizations(): Promise<OrganizationDTO[]> {
    return Array.from(mockOrganizationsStore.values());
  }

  public static async getOrganizationById(id: string): Promise<OrganizationDTO | null> {
    return mockOrganizationsStore.get(id) || null;
  }

  public static async createOrganization(input: {
    name: string;
    slug: string;
    type?: string;
    primaryDomain?: string;
  }): Promise<OrganizationDTO> {
    const id = `org_${Date.now()}`;
    const newOrg: OrganizationDTO = {
      id,
      name: input.name,
      slug: input.slug,
      type: input.type || 'UNIVERSITY',
      primaryDomain: input.primaryDomain,
      status: 'ACTIVE',
      createdAt: new Date(),
    };
    mockOrganizationsStore.set(id, newOrg);
    return newOrg;
  }

  public static async updateOrganization(id: string, update: Partial<OrganizationDTO>): Promise<OrganizationDTO | null> {
    const existing = mockOrganizationsStore.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...update };
    mockOrganizationsStore.set(id, updated);
    return updated;
  }

  public static async softDeleteOrganization(id: string): Promise<boolean> {
    const existing = mockOrganizationsStore.get(id);
    if (existing) {
      existing.status = 'ARCHIVED';
      return true;
    }
    return false;
  }
}
