export interface SecurityMetricScore {
  score: number; // e.g. 94 / 100
  grade: 'A+' | 'A' | 'B' | 'C';
  mfaEnforced: boolean;
  adaptiveAuthActive: boolean;
  riskScore: number; // 0 - 100
}

export interface SecurityAlertItem {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  timestamp: string;
}

export interface ComplianceFramework {
  name: 'SOC2 Type II' | 'ISO/IEC 27001:2022' | 'FERPA' | 'GDPR';
  status: 'COMPLIANT' | 'AUDIT_READY';
  passingControls: number;
  totalControls: number;
}

export class SecurityCenterService {
  private static metrics: SecurityMetricScore = {
    score: 94,
    grade: 'A+',
    mfaEnforced: true,
    adaptiveAuthActive: true,
    riskScore: 2,
  };

  private static alerts: SecurityAlertItem[] = [
    { id: 'alt-01', severity: 'MEDIUM', title: 'New Device Registration', description: 'User registered macOS Apple M3 Max Chrome 126 from 192.168.1.100', timestamp: new Date().toISOString() },
    { id: 'alt-02', severity: 'LOW', title: 'Successful TOTP MFA Verification', description: 'Primary authenticator token verified for admin@mit.edu', timestamp: new Date(Date.now() - 3600000).toISOString() },
  ];

  private static compliance: ComplianceFramework[] = [
    { name: 'SOC2 Type II', status: 'COMPLIANT', passingControls: 64, totalControls: 64 },
    { name: 'ISO/IEC 27001:2022', status: 'COMPLIANT', passingControls: 114, totalControls: 114 },
    { name: 'FERPA', status: 'COMPLIANT', passingControls: 32, totalControls: 32 },
    { name: 'GDPR', status: 'AUDIT_READY', passingControls: 48, totalControls: 50 },
  ];

  public static getMetrics() { return this.metrics; }
  public static getAlerts() { return this.alerts; }
  public static getCompliance() { return this.compliance; }

  public static generateBackupCodes(): string[] {
    return Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase());
  }
}
