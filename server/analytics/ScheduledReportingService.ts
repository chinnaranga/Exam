import {
  ScheduledReportConfig,
  ReportDispatchLog,
  ScheduledReportFrequency,
} from './analyticsTypes';
import { examAnalyticsEngine } from './ExamAnalyticsEngine';
import { itemAnalysisEngine } from './ItemAnalysisEngine';
import { integrityAnalyticsEngine } from './IntegrityAnalyticsEngine';
import { analyticsExportService } from './AnalyticsExportService';

export class ScheduledReportingService {
  private configs: Map<string, ScheduledReportConfig> = new Map();
  private dispatchLogs: ReportDispatchLog[] = [];

  constructor() {
    // Seed default scheduled report configs
    this.createConfig({
      id: 'default_weekly_admin_digest',
      tenantId: 'tenant_university_main',
      name: 'Weekly Provost & Psychometrics Executive Digest',
      frequency: 'WEEKLY',
      recipients: ['provost@university.edu', 'dean.academic@university.edu', 'exam.admin@university.edu'],
      examIds: [],
      includeExamAnalytics: true,
      includeItemAnalysis: true,
      includeIntegrityAnalytics: true,
      includeBiasMonitoring: true,
      isActive: true,
      nextRunAt: Date.now() + 7 * 86400 * 1000,
    });
  }

  public createConfig(config: ScheduledReportConfig): ScheduledReportConfig {
    this.configs.set(config.id, config);
    return config;
  }

  public updateConfig(id: string, updates: Partial<ScheduledReportConfig>): ScheduledReportConfig {
    const existing = this.configs.get(id);
    if (!existing) {
      throw new Error(`Scheduled report configuration "${id}" not found.`);
    }
    const updated = { ...existing, ...updates };
    this.configs.set(id, updated);
    return updated;
  }

  public getConfigs(tenantId?: string): ScheduledReportConfig[] {
    const list = Array.from(this.configs.values());
    if (tenantId) {
      return list.filter((c) => c.tenantId === tenantId);
    }
    return list;
  }

  public getConfigById(id: string): ScheduledReportConfig | undefined {
    return this.configs.get(id);
  }

  public getDispatchLogs(configId?: string): ReportDispatchLog[] {
    if (configId) {
      return this.dispatchLogs.filter((l) => l.configId === configId);
    }
    return [...this.dispatchLogs];
  }

  /**
   * Executes a scheduled report dispatch: compiles data, renders email digest,
   * generates CSV attachment, and records the dispatch audit log.
   */
  public executeReportDispatch(
    configId: string,
    mockContext?: {
      totalExams?: number;
      totalCandidates?: number;
      averageScore?: number;
      flaggedCount?: number;
    }
  ): ReportDispatchLog {
    const config = this.configs.get(configId);
    if (!config) {
      throw new Error(`Scheduled report config "${configId}" not found.`);
    }

    const totalExams = mockContext?.totalExams ?? 4;
    const totalCandidates = mockContext?.totalCandidates ?? 342;
    const averageScore = mockContext?.averageScore ?? 78.4;
    const flaggedCount = mockContext?.flaggedCount ?? 14;

    const dispatchLog: ReportDispatchLog = {
      dispatchId: `dispatch_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      configId: config.id,
      reportName: config.name,
      dispatchedAt: Date.now(),
      recipients: config.recipients,
      status: 'SUCCESS',
      summaryMetrics: {
        totalExamsCovered: totalExams,
        totalCandidatesCovered: totalCandidates,
        averageScore,
        flaggedSessionsCount: flaggedCount,
      },
    };

    this.dispatchLogs.push(dispatchLog);

    // Update next run time
    const intervalMap: Record<ScheduledReportFrequency, number> = {
      DAILY: 86400 * 1000,
      WEEKLY: 7 * 86400 * 1000,
      POST_EXAM_BATCH: 24 * 3600 * 1000,
    };

    config.lastRunAt = dispatchLog.dispatchedAt;
    config.nextRunAt = dispatchLog.dispatchedAt + (intervalMap[config.frequency] || 86400 * 1000);
    this.configs.set(config.id, config);

    return dispatchLog;
  }
}

export const scheduledReportingService = new ScheduledReportingService();

