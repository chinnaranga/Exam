import { create } from 'zustand';
import { OrganizationContext } from '@/types/auth';
import { useAuthStore } from './authStore';

interface TenantState {
  organizations: OrganizationContext[];
  activeOrganization: OrganizationContext | null;
  isLoading: boolean;

  // Actions
  setOrganizations: (orgs: OrganizationContext[]) => void;
  selectOrganization: (orgId: string) => void;
  switchCampus: (campusId: string, campusName: string, code: string) => void;
  switchDepartment: (departmentId: string, departmentName: string, code: string) => void;
  clearTenantContext: () => void;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  organizations: [],
  activeOrganization: null,
  isLoading: false,

  setOrganizations: (orgs) => set({ organizations: orgs }),

  selectOrganization: (orgId) => {
    const org = get().organizations.find((o) => o.id === orgId) || null;
    if (org) {
      localStorage.setItem('assessiq_tenant_id', org.id);
      set({ activeOrganization: org });
      useAuthStore.getState().setActiveOrganization(org);
    }
  },

  switchCampus: (campusId, campusName, code) => {
    const currentOrg = get().activeOrganization;
    if (currentOrg) {
      const updatedOrg: OrganizationContext = {
        ...currentOrg,
        activeCampus: { id: campusId, name: campusName, code },
      };
      set({ activeOrganization: updatedOrg });
      useAuthStore.getState().setActiveOrganization(updatedOrg);
    }
  },

  switchDepartment: (departmentId, departmentName, code) => {
    const currentOrg = get().activeOrganization;
    if (currentOrg) {
      const updatedOrg: OrganizationContext = {
        ...currentOrg,
        activeDepartment: { id: departmentId, name: departmentName, code },
      };
      set({ activeOrganization: updatedOrg });
      useAuthStore.getState().setActiveOrganization(updatedOrg);
    }
  },

  clearTenantContext: () => {
    localStorage.removeItem('assessiq_tenant_id');
    set({ activeOrganization: null, organizations: [] });
  },
}));
