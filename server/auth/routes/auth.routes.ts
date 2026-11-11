import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {
  correlationIdMiddleware,
  loginRateLimiter,
  authenticateJwt,
} from '../middleware/security.middleware';

const router = Router();

// Apply correlation ID middleware to all auth endpoints
router.use(correlationIdMiddleware);

// Public Auth Endpoints
router.post('/register', AuthController.register);
router.post('/login', loginRateLimiter, AuthController.login);
router.post('/refresh', AuthController.refresh);

// Protected Auth & Session Endpoints
router.post('/logout', authenticateJwt, AuthController.logout);
router.post('/logout-all', authenticateJwt, AuthController.logoutAll);
router.get('/me', authenticateJwt, AuthController.me);

// Active Sessions Endpoints
router.get('/sessions', authenticateJwt, AuthController.getSessions);
router.delete('/sessions/:id', authenticateJwt, AuthController.revokeSession);

// Registered Devices Endpoints
router.get('/devices', authenticateJwt, AuthController.getDevices);
router.delete('/devices/:id', authenticateJwt, AuthController.removeDevice);

export default router;
