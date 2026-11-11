// AssessIQ Enterprise - Student Identity Platform Service
// Workday Student & Canvas LMS Grade Identity Engine

export interface StudentProfileDTO {
  id: string;
  studentIdNumber: string;
  registrationNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  bloodGroup?: string;
  languagesSpoken: string[];
  biography?: string;
  avatarUrl?: string;

  // Contact
  universityEmail: string;
  personalEmail?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  currentAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  permanentAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  // Academic
  universityName: string;
  campusName: string;
  departmentName: string;
  programName: string;
  specialization?: string;
  batch: string;
  currentSemester: number;
  academicSection: string;
  currentCgpa: number;
  academicStatus: string;
  enrollmentType: string;
  academicAdvisor?: string;
  admissionYear: number;
  expectedGraduationYear: number;

  // Guardians
  guardians: Array<{
    fullName: string;
    relationship: string;
    occupation?: string;
    contactNumber: string;
    email?: string;
    address?: string;
  }>;

  // Emergency Contact
  emergencyContact?: {
    contactName: string;
    relationship: string;
    phoneNumber: string;
    alternateNumber?: string;
    address?: string;
  };

  // Preferences & Privacy
  preferences: {
    preferredLanguage: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    themePreference: string;
    accessibilityMode: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  privacy: {
    profileVisibility: string;
    contactVisibility: string;
    documentVisibility: string;
    portfolioVisibility: string;
    resumeVisibility: string;
  };

  // Documents
  linkedDocuments: Array<{
    id: string;
    name: string;
    type: string;
    issuedDate: string;
    verified: boolean;
  }>;
}

const MOCK_PROFILE: StudentProfileDTO = {
  id: 'sp_mit_8841',
  studentIdNumber: 'STU-2026-8841',
  registrationNumber: 'REG-MIT-2023-4190',
  firstName: 'Eleanor',
  middleName: 'Claire',
  lastName: 'Vance',
  preferredName: 'Ellie',
  dateOfBirth: '2003-09-14',
  gender: 'Female',
  nationality: 'United States',
  bloodGroup: 'O+',
  languagesSpoken: ['English', 'Spanish', 'Mandarin'],
  biography: 'Computer Science undergraduate concentrating in Distributed Systems, Consensus Algorithms, and LLM Inference Acceleration. President of MIT ACM Student Chapter.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop',

  universityEmail: 'student@mit.edu',
  personalEmail: 'eleanor.vance@gmail.com',
  primaryPhone: '+1 (617) 555-0199',
  secondaryPhone: '+1 (617) 555-0211',
  currentAddress: {
    street: '77 Massachusetts Avenue, Random Hall 410',
    city: 'Cambridge',
    state: 'MA',
    country: 'United States',
    postalCode: '02139',
  },
  permanentAddress: {
    street: '450 Beacon Street, Apt 3B',
    city: 'Boston',
    state: 'MA',
    country: 'United States',
    postalCode: '02115',
  },

  universityName: 'Massachusetts Institute of Technology',
  campusName: 'Cambridge Main Campus',
  departmentName: 'Department of Electrical Engineering & Computer Science',
  programName: 'B.S. Computer Science & Artificial Intelligence',
  specialization: 'Distributed Systems & ML Acceleration',
  batch: '2026',
  currentSemester: 7,
  academicSection: 'Section A',
  currentCgpa: 3.94,
  academicStatus: 'GOOD_STANDING',
  enrollmentType: 'FULL_TIME',
  academicAdvisor: 'Dr. Robert Chen',
  admissionYear: 2023,
  expectedGraduationYear: 2026,

  guardians: [
    {
      fullName: 'Arthur Vance',
      relationship: 'FATHER',
      occupation: 'Principal Systems Architect',
      contactNumber: '+1 (617) 555-0344',
      email: 'arthur.vance@enterprise.com',
      address: '450 Beacon Street, Boston, MA 02115',
    },
    {
      fullName: 'Dr. Margaret Vance',
      relationship: 'MOTHER',
      occupation: 'Chief Medical Officer',
      contactNumber: '+1 (617) 555-0345',
      email: 'margaret.vance@massgeneral.org',
      address: '450 Beacon Street, Boston, MA 02115',
    },
  ],

  emergencyContact: {
    contactName: 'Arthur Vance',
    relationship: 'Father',
    phoneNumber: '+1 (617) 555-0344',
    alternateNumber: '+1 (617) 555-0345',
    address: '450 Beacon Street, Boston, MA 02115',
  },

  preferences: {
    preferredLanguage: 'en-US',
    timezone: 'America/New_York',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24H',
    themePreference: 'LIGHT',
    accessibilityMode: false,
    emailNotifications: true,
    smsNotifications: true,
  },

  privacy: {
    profileVisibility: 'INSTITUTIONAL',
    contactVisibility: 'PRIVATE',
    documentVisibility: 'PRIVATE',
    portfolioVisibility: 'INSTITUTIONAL',
    resumeVisibility: 'RECRUITERS_ONLY',
  },

  linkedDocuments: [
    { id: 'doc_1', name: 'MIT Official Student ID Card', type: 'STUDENT_ID', issuedDate: '2023-08-25', verified: true },
    { id: 'doc_2', name: 'MIT Official Admission Letter', type: 'ADMISSION_LETTER', issuedDate: '2023-04-10', verified: true },
    { id: 'doc_3', name: 'Government Passport ID Proof', type: 'GOVT_ID', issuedDate: '2022-01-15', verified: true },
    { id: 'doc_4', name: 'Proof of Permanent Address', type: 'ADDRESS_PROOF', issuedDate: '2023-08-01', verified: true },
  ],
};

let currentStudentProfileState = { ...MOCK_PROFILE };

export class StudentProfileService {
  public async getProfile(userId: string): Promise<StudentProfileDTO> {
    return currentStudentProfileState;
  }

  public async updateProfile(userId: string, updates: Partial<StudentProfileDTO>): Promise<StudentProfileDTO> {
    currentStudentProfileState = {
      ...currentStudentProfileState,
      ...updates,
    };
    return currentStudentProfileState;
  }

  public async getCompletionEngine(userId: string) {
    const fields = [
      { name: 'Preferred Name', filled: !!currentStudentProfileState.preferredName },
      { name: 'Biography', filled: !!currentStudentProfileState.biography },
      { name: 'Personal Email', filled: !!currentStudentProfileState.personalEmail },
      { name: 'Primary Phone', filled: !!currentStudentProfileState.primaryPhone },
      { name: 'Current Address', filled: !!currentStudentProfileState.currentAddress?.street },
      { name: 'Emergency Contact', filled: !!currentStudentProfileState.emergencyContact?.phoneNumber },
      { name: 'Languages Spoken', filled: currentStudentProfileState.languagesSpoken.length > 0 },
      { name: 'Profile Avatar', filled: !!currentStudentProfileState.avatarUrl },
    ];

    const filledCount = fields.filter((f) => f.filled).length;
    const percentage = Math.round((filledCount / fields.length) * 100);
    const missing = fields.filter((f) => !f.filled).map((f) => f.name);

    return {
      completionPercentage: percentage,
      missingFields: missing,
      recommendations: missing.map((m) => `Complete your ${m} to unlock 100% verified student status.`),
    };
  }

  public async getPreferences(userId: string) {
    return currentStudentProfileState.preferences;
  }

  public async updatePreferences(userId: string, prefs: Partial<StudentProfileDTO['preferences']>) {
    currentStudentProfileState.preferences = {
      ...currentStudentProfileState.preferences,
      ...prefs,
    };
    return currentStudentProfileState.preferences;
  }

  public async getPrivacy(userId: string) {
    return currentStudentProfileState.privacy;
  }

  public async updatePrivacy(userId: string, privacy: Partial<StudentProfileDTO['privacy']>) {
    currentStudentProfileState.privacy = {
      ...currentStudentProfileState.privacy,
      ...privacy,
    };
    return currentStudentProfileState.privacy;
  }

  public async uploadAvatar(userId: string, avatarUrl: string) {
    currentStudentProfileState.avatarUrl = avatarUrl;
    return { avatarUrl };
  }

  public async deleteAvatar(userId: string) {
    currentStudentProfileState.avatarUrl = undefined;
    return { success: true };
  }
}

export const studentProfileService = new StudentProfileService();
