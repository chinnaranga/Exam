import { Router } from 'express';
import { pipelineController } from '../controllers/pipelineController';

const router = Router();

router.get('/session/:id', (req, res) => pipelineController.getSessionState(req, res));
router.get('/events', (req, res) => pipelineController.getEvents(req, res));
router.get('/timeline', (req, res) => pipelineController.getTimeline(req, res));
router.get('/risk-dimensions', (req, res) => pipelineController.getRiskDimensions(req, res));
router.get('/alerts', (req, res) => pipelineController.getAlerts(req, res));
router.post('/events', (req, res) => pipelineController.ingestEvent(req, res));
router.post('/policies', (req, res) => pipelineController.updatePolicy(req, res));

export default router;
