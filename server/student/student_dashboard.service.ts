export interface StudentDashboardSummary {
  studentInfo: {
    id: string;
    studentId: string;
    fullName: string;
    email: string;
    university: string;
    campus: string;
    department: string;
    program: string;
    enrollmentStatus: string;
    academicStanding: string;
    currentSemester: string;
    academicYear: string;
    cgpa: number;
    creditsEarned: number;
    creditsTotal: number;
    attendanceRate: number;
  };
  examinationOverview: {
    upcomingExamsCount: number;
    completedExamsCount: number;
    averageScore: number;
    bestScore: number;
    pendingEvaluationsCount: number;
  };
  placementReadiness: {
    overallScore: number;
    resumeScore: number;
    portfolioScore: number;
    interviewReadiness: number;
    jobMatchesCount: number;
  };
  aiRecommendations: Array<{
    id: string;
    topic: string;
    masteryPercent: number;
    action: string;
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    timestamp: string;
    type: 'EXAM_SUBMISSION' | 'CERTIFICATE_ISSUED' | 'GRADE_POSTED' | 'ATTENDANCE_LOG';
  }>;
}

export class StudentDashboardService {
  public static async getStudentDashboardSummary(studentId: string): Promise<StudentDashboardSummary> {
    return {
      studentInfo: {
        id: studentId || 'usr_student_01',
        studentId: 'STU-2026-8841',
        fullName: 'Eleanor Vance',
        email: 'student@mit.edu',
        university: 'Massachusetts Institute of Technology',
        campus: 'Cambridge Main Campus',
        department: 'Department of Computer Science',
        program: 'B.S. Computer Science & Artificial Intelligence',
        enrollmentStatus: 'ENROLLED • FULL TIME',
        academicStanding: 'HONORS • TOP 5%',
        currentSemester: 'Semester 7',
        academicYear: '2026-2027',
        cgpa: 3.94,
        creditsEarned: 112,
        creditsTotal: 120,
        attendanceRate: 98.4,
      },
      examinationOverview: {
        upcomingExamsCount: 2,
        completedExamsCount: 14,
        averageScore: 92.4,
        bestScore: 98.5,
        pendingEvaluationsCount: 1,
      },
      placementReadiness: {
        overallScore: 94,
        resumeScore: 92,
        portfolioScore: 96,
        interviewReadiness: 91,
        jobMatchesCount: 18,
      },
      aiRecommendations: [
        { id: 'rec_1', topic: 'Distributed Consensus & Raft Protocols', masteryPercent: 95, action: 'Take Practice Set' },
        { id: 'rec_2', topic: 'Graph Neural Networks & Attention Mechanisms', masteryPercent: 88, action: 'Review Lecture Notes' },
        { id: 'rec_3', topic: 'B-Tree Indexing & Database Lock Escalation', masteryPercent: 92, action: 'Self Assessment' },
      ],
      recentActivity: [
        { id: 'act_1', title: 'Submitted Exam: CS-402 Distributed Systems', timestamp: '2 hours ago', type: 'EXAM_SUBMISSION' },
        { id: 'act_2', title: 'Issued Certificate: Advanced Algorithms & Graph Theory', timestamp: '1 day ago', type: 'CERTIFICATE_ISSUED' },
        { id: 'act_3', title: 'Grade Posted: CS-301 Operating Systems (A+)', timestamp: '3 days ago', type: 'GRADE_POSTED' },
      ],
    };
  }
}
