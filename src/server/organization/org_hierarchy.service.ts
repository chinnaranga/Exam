export interface CampusItem {
  id: string;
  name: string;
  code: string;
  address: string;
  timezone: string;
  departmentsCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface DepartmentItem {
  id: string;
  campusId: string;
  campusName: string;
  name: string;
  code: string;
  headName: string;
  programsCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ProgramItem {
  id: string;
  departmentId: string;
  departmentName: string;
  name: string;
  code: string;
  durationMonths: number;
  coordinatorName: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  type: 'ACADEMIC' | 'CORPORATE' | 'CERTIFICATION' | 'GOVERNMENT';
  membersCount: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export class OrgHierarchyService {
  private static campuses: CampusItem[] = [
    { id: 'camp-01', name: 'Main Cambridge Campus', code: 'CAMB-01', address: '77 Massachusetts Ave, Cambridge, MA', timezone: 'America/New_York', departmentsCount: 14, status: 'ACTIVE' },
    { id: 'camp-02', name: 'Medical School Campus', code: 'MED-02', address: '25 Shattuck St, Boston, MA', timezone: 'America/New_York', departmentsCount: 8, status: 'ACTIVE' },
  ];

  private static departments: DepartmentItem[] = [
    { id: 'dept-01', campusId: 'camp-01', campusName: 'Main Cambridge Campus', name: 'Electrical Engineering & Computer Science (EECS)', code: 'EECS', headName: 'Prof. Arthur Vance', programsCount: 6, status: 'ACTIVE' },
    { id: 'dept-02', campusId: 'camp-02', campusName: 'Medical School Campus', name: 'Department of Clinical Pharmacology', code: 'MED-PHARM', headName: 'Dr. Sarah Jenkins', programsCount: 4, status: 'ACTIVE' },
  ];

  private static programs: ProgramItem[] = [
    { id: 'prog-01', departmentId: 'dept-01', departmentName: 'EECS', name: 'B.Sc Computer Science & Engineering', code: 'CS-BSC', durationMonths: 48, coordinatorName: 'Dr. Marcus Brody', status: 'ACTIVE' },
    { id: 'prog-02', departmentId: 'dept-01', departmentName: 'EECS', name: 'M.Sc Artificial Intelligence & Systems', code: 'AI-MSC', durationMonths: 24, coordinatorName: 'Prof. Eleanor Vance', status: 'ACTIVE' },
  ];

  private static workspaces: WorkspaceItem[] = [
    { id: 'ws-01', name: 'MIT Computer Science Testing Workspace', slug: 'mit-cs-workspace', type: 'ACADEMIC', membersCount: 482, status: 'ACTIVE' },
    { id: 'ws-02', name: 'Stanford Medicine Certification Workspace', slug: 'stanford-med-workspace', type: 'CERTIFICATION', membersCount: 310, status: 'ACTIVE' },
  ];

  public static getCampuses() { return this.campuses; }
  public static getDepartments() { return this.departments; }
  public static getPrograms() { return this.programs; }
  public static getWorkspaces() { return this.workspaces; }

  public static createCampus(item: Omit<CampusItem, 'id' | 'departmentsCount'>): CampusItem {
    const created: CampusItem = { ...item, id: `camp-${Date.now()}`, departmentsCount: 0 };
    this.campuses.push(created);
    return created;
  }

  public static createDepartment(item: Omit<DepartmentItem, 'id' | 'programsCount'>): DepartmentItem {
    const created: DepartmentItem = { ...item, id: `dept-${Date.now()}`, programsCount: 0 };
    this.departments.push(created);
    return created;
  }

  public static createProgram(item: Omit<ProgramItem, 'id'>): ProgramItem {
    const created: ProgramItem = { ...item, id: `prog-${Date.now()}` };
    this.programs.push(created);
    return created;
  }

  public static createWorkspace(item: Omit<WorkspaceItem, 'id' | 'membersCount'>): WorkspaceItem {
    const created: WorkspaceItem = { ...item, id: `ws-${Date.now()}`, membersCount: 1 };
    this.workspaces.push(created);
    return created;
  }
}
