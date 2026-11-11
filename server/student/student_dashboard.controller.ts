import { Request, Response } from 'express';
import { StudentDashboardService } from './student_dashboard.service';

export class StudentDashboardController {
  public static async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || 'usr_student_01';
      const summary = await StudentDashboardService.getStudentDashboardSummary(studentId);
      res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch student dashboard summary' });
    }
  }

  public static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: {
          attendanceTrend: [95, 96, 98, 97, 99, 98.4],
          scoreTrend: [88, 90, 93, 91, 96, 98.5],
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: [
          { id: 'notif_1', message: 'CS-402 Exam starts today at 17:00 EST', type: 'URGENT', timestamp: '10m ago' },
          { id: 'notif_2', message: 'Fall 2026 Diploma Transcript Available', type: 'INFO', timestamp: '1h ago' },
        ],
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
