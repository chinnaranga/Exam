export interface UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  country: string;
  timezone: string;
  avatarUrl: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  tokenMasked: string;
  scopes: string[];
  createdAt: string;
  expiresAt: string;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  resource: string;
  ipAddress: string;
  timestamp: string;
}

export class UserCenterService {
  private static profile: UserProfileData = {
    id: 'user-01',
    firstName: 'Eleanor',
    lastName: 'Rousseau',
    email: 'admin@mit.edu',
    phone: '+1 (617) 253-1000',
    jobTitle: 'Principal Systems Architect',
    department: 'Electrical Engineering & Computer Science',
    country: 'United States',
    timezone: 'America/New_York',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  };

  private static apiKeys: ApiKeyItem[] = [
    { id: 'key-01', name: 'LMS Gradebook Integration Token', tokenMasked: 'ev_live_98a7...31b2', scopes: ['exams:read', 'results:write'], createdAt: '2026-07-01', expiresAt: '2027-07-01' },
    { id: 'key-02', name: 'CI/CD Deployment Webhook Key', tokenMasked: 'ev_live_42c1...99e0', scopes: ['webhooks:deploy'], createdAt: '2026-07-15', expiresAt: '2026-10-15' },
  ];

  private static activities: ActivityLogItem[] = [
    { id: 'act-01', action: 'AUTH_SUCCESS', resource: 'Identity Gateway', ipAddress: '192.168.1.100', timestamp: new Date().toISOString() },
    { id: 'act-02', action: 'API_KEY_CREATED', resource: 'LMS Token', ipAddress: '192.168.1.100', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'act-03', action: 'MFA_VERIFIED', resource: 'TOTP Authenticator', ipAddress: '192.168.1.100', timestamp: new Date(Date.now() - 86400000).toISOString() },
  ];

  public static getProfile() { return this.profile; }
  public static updateProfile(data: Partial<UserProfileData>) {
    this.profile = { ...this.profile, ...data };
    return this.profile;
  }

  public static getApiKeys() { return this.apiKeys; }
  public static createApiKey(name: string, scopes: string[]): ApiKeyItem {
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name,
      tokenMasked: `ev_live_${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      scopes,
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    };
    this.apiKeys.push(newKey);
    return newKey;
  }

  public static revokeApiKey(id: string) {
    this.apiKeys = this.apiKeys.filter((k) => k.id !== id);
  }

  public static getActivityLogs() { return this.activities; }
}
