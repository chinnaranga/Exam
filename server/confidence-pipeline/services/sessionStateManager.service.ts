import { PipelineAlert, RiskDimensionScore, SessionState, UnifiedIntegrityEvent } from '../types/pipeline.types';

/**
 * @class SessionStateManagerService
 * @description Maintains active proctoring session health, active alerts, risk dimension metrics,
 * and latest confidence status.
 */
export class SessionStateManagerService {
  private sessions = new Map<string, SessionState>();

  public getSessionState(sessionId: string): SessionState {
    let state = this.sessions.get(sessionId);
    if (!state) {
      state = {
        sessionId,
        candidateId: 'cand_student_2026',
        examId: 'exam_ai_proctoring_101',
        organizationId: 'org_univ_01',
        status: 'active',
        healthScore: 98,
        latestConfidence: 'High',
        riskDimensions: [
          { dimension: 'Camera Health', score: 100, trend: 'Stable', confidence: 'High', explanation: 'Optimal video stream.' },
          { dimension: 'Attention', score: 98, trend: 'Stable', confidence: 'High', explanation: 'Candidate gaze centered.' },
          { dimension: 'Environment', score: 100, trend: 'Stable', confidence: 'High', explanation: 'Quiet environment.' },
          { dimension: 'Objects', score: 100, trend: 'Stable', confidence: 'High', explanation: 'No blocked objects.' },
          { dimension: 'Audio', score: 98, trend: 'Stable', confidence: 'High', explanation: 'Low background noise.' },
          { dimension: 'Browser Integrity', score: 100, trend: 'Stable', confidence: 'High', explanation: 'Browser secure.' },
          { dimension: 'Network Stability', score: 100, trend: 'Stable', confidence: 'High', explanation: 'Low latency.' },
        ],
        activeAlerts: [],
        totalEventsProcessed: 0,
      };
      this.sessions.set(sessionId, state);
    }
    return state;
  }

  public updateSession(
    sessionId: string,
    event: UnifiedIntegrityEvent,
    riskDimensions: RiskDimensionScore[],
    newAlert?: PipelineAlert
  ): SessionState {
    const current = this.getSessionState(sessionId);
    const updated: SessionState = {
      ...current,
      latestConfidence: event.confidence,
      riskDimensions,
      activeAlerts: newAlert ? [newAlert, ...current.activeAlerts.slice(0, 19)] : current.activeAlerts,
      totalEventsProcessed: current.totalEventsProcessed + 1,
    };
    this.sessions.set(sessionId, updated);
    return updated;
  }
}

export const sessionStateManagerService = new SessionStateManagerService();
