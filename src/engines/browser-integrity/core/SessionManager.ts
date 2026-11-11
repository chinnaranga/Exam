export type SessionStatus = 'INITIALIZED' | 'ACTIVE' | 'PAUSED' | 'TERMINATED' | 'COMPLETED';

export interface SessionConfig {
  sessionId?: string;
  candidateId?: string;
  examId?: string;
  organizationId?: string;
}

export interface SessionState {
  sessionId: string;
  candidateId: string;
  examId: string;
  organizationId: string;
  startTimeMs: number;
  endTimeMs?: number;
  status: SessionStatus;
  userAgent: string;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * @class SessionManager
 * @description Manages candidate assessment session state, environment metadata, and telemetry correlation context.
 */
export class SessionManager {
  private state: SessionState;

  constructor(config?: SessionConfig) {
    const timestamp = Date.now();
    this.state = {
      sessionId: config?.sessionId || `sess_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
      candidateId: config?.candidateId || 'cand_demo_8841',
      examId: config?.examId || 'exam_cs402_consensus',
      organizationId: config?.organizationId || 'org_mit_01',
      startTimeMs: timestamp,
      status: 'INITIALIZED',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server/Headless',
      viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
      viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    };
  }

  public startSession(): void {
    this.state.status = 'ACTIVE';
    this.state.startTimeMs = Date.now();
  }

  public pauseSession(): void {
    if (this.state.status === 'ACTIVE') {
      this.state.status = 'PAUSED';
    }
  }

  public resumeSession(): void {
    if (this.state.status === 'PAUSED') {
      this.state.status = 'ACTIVE';
    }
  }

  public terminateSession(): void {
    this.state.status = 'TERMINATED';
    this.state.endTimeMs = Date.now();
  }

  public completeSession(): void {
    this.state.status = 'COMPLETED';
    this.state.endTimeMs = Date.now();
  }

  public getSessionState(): Readonly<SessionState> {
    return { ...this.state };
  }

  public getSessionDurationSeconds(): number {
    const endTime = this.state.endTimeMs || Date.now();
    return Math.round((endTime - this.state.startTimeMs) / 1000);
  }
}
