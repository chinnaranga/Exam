import express from 'express';
import path from 'path';
import fs from 'fs';

// Auto-load environment variables from .env file if available in Node 20.12+ / 22+
if (typeof (process as any).loadEnvFile === 'function' && fs.existsSync('.env')) {
  try {
    (process as any).loadEnvFile();
  } catch {
    // Ignore if already loaded or unreadable
  }
}

import authRoutes from './auth/routes/auth.routes';
import { StudentDashboardController } from './student/student_dashboard.controller';
import { studentProfileController } from './student/student_profile.controller';
import { HumanReviewAPI } from './integrity/HumanReviewAPI';
import { EnterpriseOperationsController } from './operations/controllers/EnterpriseOperationsController';
import { examSessionAuthority } from './integrity/ExamSessionAuthority';
import { violationEngine } from './integrity/ViolationEngine';
import { identityVerificationService } from './identity/IdentityVerificationService';
import { examRandomizationEngine } from './exam/ExamRandomizationEngine';
import { invigilatorActionController } from './integrity/InvigilatorActionController';
import { examConfigRouter } from './exam/ExamConfigController';
import { accommodationService } from './accessibility/AccommodationService';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Strict Enterprise Exam Security Headers, CORS & CSP Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Session-Id');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob:; connect-src 'self' https: ws: wss: stun:; font-src 'self' data: https://fonts.gstatic.com; object-src 'none'; media-src 'self' blob:; frame-ancestors 'none';"
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

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

// Layer 5 Invigilator Platform & Incident Management APIs
app.use('/api/v1/invigilator', invigilatorActionController.router);
app.use('/api/invigilator', invigilatorActionController.router);

// Configurable Security Profiles & Versioned Exam Blueprints
app.use('/api/v1/exam-config', examConfigRouter);
app.use('/api/exam-config', examConfigRouter);

// Accessibility Accommodations & Timed Rest Breaks APIs
app.use('/api/v1/accommodations', accommodationService.router);
app.use('/api/accommodations', accommodationService.router);
app.use('/api/session', accommodationService.router);
app.use('/api/v1/session', accommodationService.router);

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

// Serve production client build from dist/ if available
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[AssessIQ Enterprise OS Engine] Listening on http://localhost:${PORT}`);
  });
}

export default app;
