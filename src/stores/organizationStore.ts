import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CampusRecord {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  city?: string;
  country?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface DepartmentRecord {
  id: string;
  organizationId: string;
  campusId: string;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ProgramRecord {
  id: string;
  organizationId: string;
  departmentId: string;
  name: string;
  code: string;
  degreeLevel?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CourseRecord {
  id: string;
  organizationId: string;
  departmentId: string;
  programId?: string;
  name: string;
  code: string;
  credits: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface BrandingConfig {
  organizationId: string;
  logoUrl: string;
  darkLogoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
}

export interface WorkspaceConfig {
  organizationId: string;
  workspaceName: string;
  defaultLanguage: string;
  dateFormat: string;
  timeFormat: string;
  timezone: string;
  mfaPolicyRequired: boolean;
}

interface OrganizationState {
  campuses: CampusRecord[];
  departments: DepartmentRecord[];
  programs: ProgramRecord[];
  courses: CourseRecord[];
  activeCampusId: string | null;
  activeDepartmentId: string | null;
  branding: BrandingConfig | null;
  workspace: WorkspaceConfig | null;

  // Actions
  setCampuses: (campuses: CampusRecord[]) => void;
  setDepartments: (departments: DepartmentRecord[]) => void;
  setPrograms: (programs: ProgramRecord[]) => void;
  setCourses: (courses: CourseRecord[]) => void;
  setActiveCampus: (id: string | null) => void;
  setActiveDepartment: (id: string | null) => void;
  updateBranding: (branding: Partial<BrandingConfig>) => void;
  updateWorkspace: (workspace: Partial<WorkspaceConfig>) => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      campuses: [
        { id: 'camp_mit_01', organizationId: 'org_mit_01', name: 'Cambridge Main Campus', code: 'CAMB-01', city: 'Cambridge', country: 'US', status: 'ACTIVE' },
        { id: 'camp_mit_02', organizationId: 'org_mit_01', name: 'Innovation Hub Branch', code: 'HUB-02', city: 'Boston', country: 'US', status: 'ACTIVE' },
      ],
      departments: [
        { id: 'dept_eecs_01', organizationId: 'org_mit_01', campusId: 'camp_mit_01', name: 'Electrical Engineering & Computer Science', code: 'EECS', status: 'ACTIVE' },
        { id: 'dept_math_01', organizationId: 'org_mit_01', campusId: 'camp_mit_01', name: 'Department of Mathematics', code: 'MATH', status: 'ACTIVE' },
      ],
      programs: [
        { id: 'prog_bscs_01', organizationId: 'org_mit_01', departmentId: 'dept_eecs_01', name: 'Bachelor of Science in Computer Science', code: 'BS-CS', degreeLevel: 'Bachelor', status: 'ACTIVE' },
        { id: 'prog_mscs_01', organizationId: 'org_mit_01', departmentId: 'dept_eecs_01', name: 'Master of Science in Artificial Intelligence', code: 'MS-AI', degreeLevel: 'Master', status: 'ACTIVE' },
      ],
      courses: [
        { id: 'crs_alg_01', organizationId: 'org_mit_01', departmentId: 'dept_eecs_01', programId: 'prog_bscs_01', name: 'CS-101: Introduction to Algorithms', code: 'CS101', credits: 4.0, status: 'ACTIVE' },
        { id: 'crs_ai_01', organizationId: 'org_mit_01', departmentId: 'dept_eecs_01', programId: 'prog_mscs_01', name: 'AI-502: Advanced Neural Networks', code: 'AI502', credits: 4.0, status: 'ACTIVE' },
      ],
      activeCampusId: 'camp_mit_01',
      activeDepartmentId: 'dept_eecs_01',
      branding: {
        organizationId: 'org_mit_01',
        logoUrl: '/logo.png',
        primaryColor: '#1E40AF',
        secondaryColor: '#2563EB',
        accentColor: '#16A34A',
        fontFamily: 'Inter',
      },
      workspace: {
        organizationId: 'org_mit_01',
        workspaceName: 'MIT Enterprise Assessment Hub',
        defaultLanguage: 'en-US',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: '24h',
        timezone: 'America/New_York',
        mfaPolicyRequired: true,
      },

      setCampuses: (campuses) => set({ campuses }),
      setDepartments: (departments) => set({ departments }),
      setPrograms: (programs) => set({ programs }),
      setCourses: (courses) => set({ courses }),
      setActiveCampus: (id) => set({ activeCampusId: id }),
      setActiveDepartment: (id) => set({ activeDepartmentId: id }),
      updateBranding: (branding) =>
        set((state) => ({
          branding: state.branding ? { ...state.branding, ...branding } : null,
        })),
      updateWorkspace: (workspace) =>
        set((state) => ({
          workspace: state.workspace ? { ...state.workspace, ...workspace } : null,
        })),
    }),
    {
      name: 'examifypro_organization_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
