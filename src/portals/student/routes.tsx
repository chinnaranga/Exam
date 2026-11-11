import React from 'react';
import { Route } from 'react-router-dom';
import AuthGuard from '@/shared/guards/AuthGuard';
import RoleGuard from '@/shared/guards/RoleGuard';

import StudentLanding from './pages/StudentLanding';
import StudentLogin from './pages/auth/StudentLogin';
import StudentRegister from './pages/auth/StudentRegister';
import StudentVerifyEmail from './pages/auth/StudentVerifyEmail';
import StudentForgotPassword from './pages/auth/StudentForgotPassword';
import StudentResetPassword from './pages/auth/StudentResetPassword';
import StudentMFA from './pages/auth/StudentMFA';
import StudentAccountRecovery from './pages/auth/StudentAccountRecovery';

import StudentLayout from './layout/StudentLayout';
import StudentDashboard from './pages/StudentDashboard';
import StudentCourses from './pages/StudentCourses';
import StudentScheduledExams from './pages/StudentScheduledExams';
import StudentPractice from './pages/StudentPractice';
import StudentResults from './pages/StudentResults';
import StudentCertificates from './pages/StudentCertificates';
import StudentPlacement from './pages/StudentPlacement';
import StudentSettings from './pages/StudentSettings';
import StudentExamRunner from './pages/StudentExamRunner';

import StudentProfileOverview from './pages/profile/StudentProfileOverview';
import StudentProfileEdit from './pages/profile/StudentProfileEdit';
import StudentProfilePersonal from './pages/profile/StudentProfilePersonal';
import StudentProfileAcademic from './pages/profile/StudentProfileAcademic';
import StudentProfileContact from './pages/profile/StudentProfileContact';
import StudentProfileGuardian from './pages/profile/StudentProfileGuardian';
import StudentProfileEmergency from './pages/profile/StudentProfileEmergency';
import StudentProfilePreferences from './pages/profile/StudentProfilePreferences';
import StudentProfilePrivacy from './pages/profile/StudentProfilePrivacy';

const STUDENT_ALLOWED_ROLES = ['STUDENT', 'CANDIDATE', 'ORGANIZATION_ADMIN', 'SUPER_ADMIN'];
const EXAM_RUNNER_ALLOWED_ROLES = [
  'STUDENT',
  'CANDIDATE',
  'INVIGILATOR',
  'PROCTOR',
  'CHIEF_PROCTOR',
  'FACULTY',
  'ORGANIZATION_ADMIN',
  'SUPER_ADMIN',
];

export const StudentRoutes = (
  <>
    {/* Public Student Auth */}
    <Route path="/student" element={<StudentLanding />} />
    <Route path="/student/login" element={<StudentLogin />} />
    <Route path="/student/register" element={<StudentRegister />} />
    <Route path="/student/verify-email" element={<StudentVerifyEmail />} />
    <Route path="/student/forgot-password" element={<StudentForgotPassword />} />
    <Route path="/student/reset-password" element={<StudentResetPassword />} />
    <Route path="/student/mfa" element={<StudentMFA />} />
    <Route path="/student/account-recovery" element={<StudentAccountRecovery />} />

    {/* Protected Exam Runner */}
    <Route
      path="/student/exams/runner"
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={EXAM_RUNNER_ALLOWED_ROLES}>
            <StudentExamRunner />
          </RoleGuard>
        </AuthGuard>
      }
    />

    {/* Protected Student Portal Layout */}
    <Route
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={STUDENT_ALLOWED_ROLES}>
            <StudentLayout />
          </RoleGuard>
        </AuthGuard>
      }
    >
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/courses" element={<StudentCourses />} />
      <Route path="/student/exams" element={<StudentScheduledExams />} />
      <Route path="/student/practice" element={<StudentPractice />} />
      <Route path="/student/results" element={<StudentResults />} />
      <Route path="/student/certificates" element={<StudentCertificates />} />
      <Route path="/student/placement" element={<StudentPlacement />} />
      <Route path="/student/settings" element={<StudentSettings />} />

      {/* Profile Suite */}
      <Route path="/student/profile" element={<StudentProfileOverview />} />
      <Route path="/student/profile/edit" element={<StudentProfileEdit />} />
      <Route path="/student/profile/personal" element={<StudentProfilePersonal />} />
      <Route path="/student/profile/academic" element={<StudentProfileAcademic />} />
      <Route path="/student/profile/contact" element={<StudentProfileContact />} />
      <Route path="/student/profile/guardian" element={<StudentProfileGuardian />} />
      <Route path="/student/profile/emergency" element={<StudentProfileEmergency />} />
      <Route path="/student/profile/preferences" element={<StudentProfilePreferences />} />
      <Route path="/student/profile/privacy" element={<StudentProfilePrivacy />} />
    </Route>
  </>
);

export default StudentRoutes;
