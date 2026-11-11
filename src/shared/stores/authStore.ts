import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthSession, UserProfile, OrganizationContext } from "@/shared/types/auth";

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  activeOrganization: OrganizationContext | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setSession: (session: AuthSession) => void;
  updateUser: (user: Partial<UserProfile>) => void;
  setActiveOrganization: (org: OrganizationContext | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      activeOrganization: null,
      isAuthenticated: false,
      isLoading: false,

      setSession: (session: AuthSession) =>
        set({
          user: session.user,
          accessToken: session.accessToken,
          activeOrganization: session.activeOrganization,
          isAuthenticated: true,
          isLoading: false,
        }),

      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),

      setActiveOrganization: (org) =>
        set({ activeOrganization: org }),

      logout: () => {
        localStorage.removeItem('examifypro_tenant_id');
        set({
          user: null,
          accessToken: null,
          activeOrganization: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'examifypro_auth_storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        activeOrganization: state.activeOrganization,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
