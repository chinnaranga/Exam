import { Request, Response } from 'express';
import { eventGatewayService } from '../services/eventGateway.service';
import { policyEngineService } from '../services/policyEngine.service';
import { sessionStateManagerService } from '../services/sessionStateManager.service';

export class PipelineController {
  public async getSessionState(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = (req.params.id || 'sess_default_2026') as string;
      const state = sessionStateManagerService.getSessionState(sessionId);
      res.status(200).json({ success: true, state });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = eventGatewayService.getTimeline();
      res.status(200).json({ success: true, count: events.length, events });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async getTimeline(req: Request, res: Response): Promise<void> {
    try {
      const timeline = eventGatewayService.getTimeline();
      res.status(200).json({ success: true, timeline });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async getRiskDimensions(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = (req.query.sessionId || 'sess_default_2026') as string;
      const state = sessionStateManagerService.getSessionState(sessionId);
      res.status(200).json({ success: true, riskDimensions: state.riskDimensions });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async getAlerts(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = (req.query.sessionId || 'sess_default_2026') as string;
      const state = sessionStateManagerService.getSessionState(sessionId);
      res.status(200).json({ success: true, alerts: state.activeAlerts });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async ingestEvent(req: Request, res: Response): Promise<void> {
    try {
      const result = eventGatewayService.processIngestedEvent(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  public async updatePolicy(req: Request, res: Response): Promise<void> {
    try {
      const policy = policyEngineService.updatePolicy(req.body);
      res.status(200).json({ success: true, policy });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}

export const pipelineController = new PipelineController();
