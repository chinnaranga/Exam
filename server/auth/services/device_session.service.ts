import crypto from 'crypto';

export interface ActiveSession {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  deviceName: string;
  isCurrent: boolean;
  lastActiveAt: string;
  expiresAt: string;
}

export interface UserDevice {
  id: string;
  userId: string;
  fingerprintHash: string;
  deviceName: string;
  isTrusted: boolean;
  riskScore: number;
  lastUsedAt: string;
}

export class DeviceSessionService {
  private static sessions: ActiveSession[] = [
    {
      id: 'sess-01',
      userId: 'user-01',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      deviceName: 'MacBook Pro 16" (Chrome 126)',
      isCurrent: true,
      lastActiveAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sess-02',
      userId: 'user-01',
      ipAddress: '172.56.21.9',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)',
      deviceName: 'iPhone 15 Pro (Safari)',
      isCurrent: false,
      lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  private static devices: UserDevice[] = [
    {
      id: 'dev-01',
      userId: 'user-01',
      fingerprintHash: 'fp_a9812f801bc',
      deviceName: 'MacBook Pro 16" (macOS 14.5)',
      isTrusted: true,
      riskScore: 0.05,
      lastUsedAt: new Date().toISOString(),
    },
    {
      id: 'dev-02',
      userId: 'user-01',
      fingerprintHash: 'fp_c33910ab42e',
      deviceName: 'iPhone 15 Pro (iOS 17.5)',
      isTrusted: true,
      riskScore: 0.12,
      lastUsedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];

  public static getActiveSessions(userId: string): ActiveSession[] {
    return this.sessions.filter((s) => s.userId === userId);
  }

  public static revokeSession(sessionId: string): boolean {
    const initialLen = this.sessions.length;
    this.sessions = this.sessions.filter((s) => s.id !== sessionId);
    return this.sessions.length < initialLen;
  }

  public static revokeAllSessions(userId: string, keepCurrentId?: string): number {
    const initialLen = this.sessions.length;
    this.sessions = this.sessions.filter((s) => s.userId !== userId || (keepCurrentId && s.id === keepCurrentId));
    return initialLen - this.sessions.length;
  }

  public static getUserDevices(userId: string): UserDevice[] {
    return this.devices.filter((d) => d.userId === userId);
  }

  public static revokeDevice(deviceId: string): boolean {
    const initialLen = this.devices.length;
    this.devices = this.devices.filter((d) => d.id !== deviceId);
    return this.devices.length < initialLen;
  }

  public static toggleDeviceTrust(deviceId: string, isTrusted: boolean): UserDevice | null {
    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      device.isTrusted = isTrusted;
      return device;
    }
    return null;
  }
}
