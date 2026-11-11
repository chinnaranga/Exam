import React from 'react';
import { Route } from 'react-router-dom';
import AuthGuard from '@/shared/guards/AuthGuard';
import RoleGuard from '@/shared/guards/RoleGuard';

import FacultyLanding from './pages/FacultyLanding';
import FacultyLogin from './pages/auth/FacultyLogin';
import FacultyLayout from './layout/FacultyLayout';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyQuestionBank from './pages/FacultyQuestionBank';
import FacultyExamBuilder from './pages/FacultyExamBuilder';
import FacultyAnalytics from './pages/FacultyAnalytics';

const FACULTY_ALLOWED_ROLES = [
  'FACULTY',
  'PROFESSOR',
  'INSTRUCTOR',
  'TEACHING_ASSISTANT',
  'EXAM_CREATOR',
  'SUPER_ADMIN',
];

export const FacultyRoutes = (
  <>
    <Route path="/faculty" element={<FacultyLanding />} />
    <Route path="/faculty/login" element={<FacultyLogin />} />
    <Route
      element={
        <AuthGuard>
          <RoleGuard allowedRoles={FACULTY_ALLOWED_ROLES}>
            <FacultyLayout />
          </RoleGuard>
        </AuthGuard>
      }
    >
      <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
      <Route path="/faculty/question-bank" element={<FacultyQuestionBank />} />
      <Route path="/faculty/exams" element={<FacultyExamBuilder />} />
      <Route path="/faculty/analytics" element={<FacultyAnalytics />} />
    </Route>
  </>
);

export default FacultyRoutes;
