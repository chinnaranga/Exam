import express from 'express';
import authRoutes from './auth/routes/auth.routes';
import { StudentDashboardController } from './student/student_dashboard.controller';
import { studentProfileController } from './student/student_profile.controller';
import { HumanReviewAPI } from './integrity/HumanReviewAPI';
import { EnterpriseOperationsController } from './operations/controllers/EnterpriseOperationsController';
import { examSessionAuthority } from './integrity/ExamSessionAuthority';
import { violationEngine } from './integrity/ViolationEngine';
import { identityVerificationService } from './identity/IdentityVerificationService';
import { examRandomizationEngine } from './exam/ExamRandomizationEngine';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// API Namespaces
app.use('/api/v1/auth', authRoutes);

// Authoritative Exam Session, Server Clock & Security Event Authority APIs
app.use('/api/session', examSessionAuthority.router);
app.use('/api/v1/session', examSessionAuthority.router);
app.use('/api/session', violationEngine.router);
app.use('/api/v1/session', violationEngine.router);
app.use('/api/session', identityVerificationService.router);
app.use('/api/v1/session', identityVerificationService.router);
app.use('/api/session', examRandomizationEngine.router);
app.use('/api/v1/session', examRandomizationEngine.router);

// Phase 4 Enterprise Integrity Intelligence Platform APIs
const humanReviewAPI = new HumanReviewAPI();
app.use('/api/integrity', humanReviewAPI.router);

import pipelineRoutes from './confidence-pipeline/routes/pipelineRoutes';

// Phase 6 Enterprise Operations Platform APIs
const operationsController = new EnterpriseOperationsController();
app.use('/api/v1/operations', operationsController.router);

// Module 7 AI Confidence Engine & Event Pipeline APIs
app.use('/api/v1/proctoring', pipelineRoutes);

// Student Dashboard Operating System APIs
app.get('/api/v1/student/dashboard', StudentDashboardController.getSummary);
app.get('/api/v1/student/dashboard/summary', StudentDashboardController.getSummary);
app.get('/api/v1/student/dashboard/analytics', StudentDashboardController.getAnalytics);
app.get('/api/v1/student/dashboard/notifications', StudentDashboardController.getNotifications);

// Student Identity Platform APIs
app.get('/api/v1/student/profile', (req, res) => studentProfileController.getProfile(req, res));
app.patch('/api/v1/student/profile', (req, res) => studentProfileController.updateProfile(req, res));
app.get('/api/v1/student/profile/completion', (req, res) => studentProfileController.getCompletion(req, res));
app.get('/api/v1/student/profile/preferences', (req, res) => studentProfileController.getPreferences(req, res));
app.patch('/api/v1/student/profile/preferences', (req, res) => studentProfileController.updatePreferences(req, res));
app.get('/api/v1/student/profile/privacy', (req, res) => studentProfileController.getPrivacy(req, res));
app.patch('/api/v1/student/profile/privacy', (req, res) => studentProfileController.updatePrivacy(req, res));
app.post('/api/v1/student/profile/avatar', (req, res) => studentProfileController.uploadAvatar(req, res));
app.delete('/api/v1/student/profile/avatar', (req, res) => studentProfileController.deleteAvatar(req, res));

app.get('/health', (req, res) => {
  res.json({ status: 'HEALTHY', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[AssessIQ Enterprise OS Engine] Listening on http://localhost:${PORT}`);
  });
}

export default app;
