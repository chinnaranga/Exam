export interface ActiveSession {
  id: string;
  userId: string;
  sessionToken: string;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
  deviceType: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  expiresAt: Date;
  createdAt: Date;
}

const sessionsMemoryStore = new Map<string, ActiveSession>();
const MAX_CONCURRENT_SESSIONS_PER_USER = 5;

export class SessionService {
  /**
   * Register a new active session & enforce concurrent session limits
   */
  public static async createSession(input: {
    userId: string;
    sessionToken: string;
    refreshToken: string;
    ipAddress: string;
    userAgent: string;
    deviceType?: string;
    expiresAt: Date;
  }): Promise<ActiveSession> {
    const id = `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Enforce concurrent session limit
    const userSessions = Array.from(sessionsMemoryStore.values()).filter(
      (s) => s.userId === input.userId && s.status === 'ACTIVE'
    );

    if (userSessions.length >= MAX_CONCURRENT_SESSIONS_PER_USER) {
      // Revoke oldest session
      userSessions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      if (userSessions[0]) {
        userSessions[0].status = 'REVOKED';
      }
    }

    const newSession: ActiveSession = {
      id,
      userId: input.userId,
      sessionToken: input.sessionToken,
      refreshToken: input.refreshToken,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      deviceType: input.deviceType || 'DESKTOP_MAC',
      status: 'ACTIVE',
      expiresAt: input.expiresAt,
      createdAt: new Date(),
    };

    sessionsMemoryStore.set(id, newSession);
    return newSession;
  }

  /**
   * Find session by ID or token
   */
  public static async getSession(sessionId: string): Promise<ActiveSession | null> {
    return sessionsMemoryStore.get(sessionId) || null;
  }

  /**
   * List all active sessions for a user
   */
  public static async getUserSessions(userId: string): Promise<ActiveSession[]> {
    return Array.from(sessionsMemoryStore.values()).filter(
      (s) => s.userId === userId && s.status === 'ACTIVE'
    );
  }

  /**
   * Revoke individual session by ID
   */
  public static async revokeSession(sessionId: string): Promise<boolean> {
    const session = sessionsMemoryStore.get(sessionId);
    if (session) {
      session.status = 'REVOKED';
      return true;
    }
    return false;
  }

  /**
   * Revoke all user sessions except current session
   */
  public static async revokeAllOtherSessions(userId: string, currentSessionId: string): Promise<number> {
    let count = 0;
    sessionsMemoryStore.forEach((sess) => {
      if (sess.userId === userId && sess.id !== currentSessionId && sess.status === 'ACTIVE') {
        sess.status = 'REVOKED';
        count++;
      }
    });
    return count;
  }
}
