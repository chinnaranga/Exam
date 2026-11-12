import { itemAnalysisEngine, ItemAnalysisEngine } from './ItemAnalysisEngine';
import { examAnalyticsEngine, ExamAnalyticsEngine } from './ExamAnalyticsEngine';
import { integrityAnalyticsEngine, IntegrityAnalyticsEngine } from './IntegrityAnalyticsEngine';
import { candidateResultService, CandidateResultService } from './CandidateResultService';
import { analyticsExportService, AnalyticsExportService } from './AnalyticsExportService';
import { scheduledReportingService, ScheduledReportingService } from './ScheduledReportingService';
import { biasMonitoringService, BiasMonitoringService } from './BiasMonitoringService';

export class AnalyticsPlatform {
  public readonly itemAnalysis: ItemAnalysisEngine;
  public readonly examAnalytics: ExamAnalyticsEngine;
  public readonly integrityAnalytics: IntegrityAnalyticsEngine;
  public readonly candidateResults: CandidateResultService;
  public readonly exports: AnalyticsExportService;
  public readonly scheduledReporting: ScheduledReportingService;
  public readonly biasMonitoring: BiasMonitoringService;

  constructor() {
    this.itemAnalysis = itemAnalysisEngine;
    this.examAnalytics = examAnalyticsEngine;
    this.integrityAnalytics = integrityAnalyticsEngine;
    this.candidateResults = candidateResultService;
    this.exports = analyticsExportService;
    this.scheduledReporting = scheduledReportingService;
    this.biasMonitoring = biasMonitoringService;
  }
}

export const analyticsPlatform = new AnalyticsPlatform();
export * from './analyticsTypes';
export * from './ItemAnalysisEngine';
export * from './ExamAnalyticsEngine';
export * from './IntegrityAnalyticsEngine';
export * from './CandidateResultService';
export * from './AnalyticsExportService';
export * from './ScheduledReportingService';
export * from './BiasMonitoringService';

