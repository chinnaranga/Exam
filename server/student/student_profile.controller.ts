import { Request, Response } from 'express';
import { studentProfileService } from './student_profile.service';

export class StudentProfileController {
  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'usr_student_01';
      const profile = await studentProfileService.getProfile(userId);
      res.json({ success: true, data: profile });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'usr_student_01';
      const updated = await studentProfileService.updateProfile(userId, req.body);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  public async getCompletion(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'usr_student_01';
      const completion = await studentProfileService.getCompletionEngine(userId);
      res.json({ success: true, data: completion });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async getPreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'usr_student_01';
      const prefs = await studentProfileService.getPreferences(userId);
      res.json({ success: true, data: prefs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'usr_student_01';
      const updated = await studentProfileService.updatePreferences(userId, req.body);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  public async getPrivacy(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'usr_student_01';
      const privacy = await studentProfileService.getPrivacy(userId);
      res.json({ success: true, data: privacy });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async updatePrivacy(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'usr_student_01';
      const updated = await studentProfileService.updatePrivacy(userId, req.body);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'usr_student_01';
      const avatarUrl = req.body.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop';
      const result = await studentProfileService.uploadAvatar(userId, avatarUrl);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  public async deleteAvatar(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'usr_student_01';
      const result = await studentProfileService.deleteAvatar(userId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const studentProfileController = new StudentProfileController();
