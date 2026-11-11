export interface IntegrationConnector {
  id: string;
  name: string;
  category: 'LMS' | 'IDENTITY' | 'COMMUNICATION' | 'ERP';
  status: 'CONNECTED' | 'DISCONNECTED';
  lastSyncAt: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'ACTIVE' | 'PAUSED';
  secret: string;
}

export interface JobQueueMetrics {
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  delayedJobs: number;
}

export class IntegrationPlatformService {
  private static connectors: IntegrationConnector[] = [
    { id: 'conn-01', name: 'Canvas LMS Grade Sync', category: 'LMS', status: 'CONNECTED', lastSyncAt: new Date().toISOString() },
    { id: 'conn-02', name: 'Microsoft 365 Directory Sync', category: 'IDENTITY', status: 'CONNECTED', lastSyncAt: new Date().toISOString() },
    { id: 'conn-03', name: 'Google Workspace Single Sign-On', category: 'IDENTITY', status: 'CONNECTED', lastSyncAt: new Date().toISOString() },
    { id: 'conn-04', name: 'Moodle Exam Import Connector', category: 'LMS', status: 'DISCONNECTED', lastSyncAt: '2026-07-01T00:00:00Z' },
    { id: 'conn-05', name: 'Slack Security Alerts Channel', category: 'COMMUNICATION', status: 'CONNECTED', lastSyncAt: new Date().toISOString() },
  ];

  private static webhooks: WebhookEndpoint[] = [
    { id: 'wh-01', url: 'https://api.mit.edu/hooks/exam-results', events: ['exam.completed', 'cert.issued'], status: 'ACTIVE', secret: 'whsec_98a7c...31b2' },
    { id: 'wh-02', url: 'https://security.stanford.edu/webhooks/risk-alert', events: ['security.threat'], status: 'ACTIVE', secret: 'whsec_42c1d...99e0' },
  ];

  public static getConnectors() { return this.connectors; }
  public static getWebhooks() { return this.webhooks; }

  public static toggleConnector(id: string) {
    const conn = this.connectors.find((c) => c.id === id);
    if (conn) {
      conn.status = conn.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED';
      conn.lastSyncAt = new Date().toISOString();
    }
    return conn;
  }

  public static registerWebhook(url: string, events: string[]): WebhookEndpoint {
    const created: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      url,
      events,
      status: 'ACTIVE',
      secret: `whsec_${Math.random().toString(36).substring(2, 8)}`,
    };
    this.webhooks.push(created);
    return created;
  }

  public static getJobQueueMetrics(): JobQueueMetrics {
    return {
      activeJobs: 14,
      completedJobs: 140892,
      failedJobs: 2,
      delayedJobs: 0,
    };
  }
}
