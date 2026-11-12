import {
  BiasMonitoringReport,
  BiasCohortMetric,
  DisparityAlert,
  BiasSegmentCategory,
} from './analyticsTypes';

export interface CandidateSessionBiasInput {
  sessionId: string;
  candidateId: string;
  cameraQuality: 'LOW_RES_480P' | 'HIGH_RES_720P_PLUS';
  lightingCondition: 'DIM_BACKLIT' | 'BALANCED';
  hasAccommodation: boolean;
  accommodationType?: string;
  wasFlagged: boolean;
  reviewerDecision?: 'CLEAR' | 'WARN' | 'INVALIDATE' | null;
  integrityConfidenceScore: number;
}

export class BiasMonitoringService {
  private static readonly DISPARITY_THRESHOLD = 1.25; // 25% disparity triggers alert

  /**
   * Evaluates fairness and sensor/accommodation disparity across candidate sessions.
   */
  public evaluateBiasMetrics(sessions: CandidateSessionBiasInput[]): BiasMonitoringReport {
    const totalSessions = sessions.length;
    if (totalSessions === 0) {
      return {
        evaluatedAt: Date.now(),
        totalSessionsAnalyzed: 0,
        cohorts: [],
        alerts: [],
      };
    }

    const cohorts: BiasCohortMetric[] = [];
    const alerts: DisparityAlert[] = [];

    // 1. Camera Quality Segmentation
    const lowResSessions = sessions.filter((s) => s.cameraQuality === 'LOW_RES_480P');
    const highResSessions = sessions.filter((s) => s.cameraQuality === 'HIGH_RES_720P_PLUS');

    const lowResCohort = this.buildCohortMetric(
      'CAMERA_QUALITY',
      'Low Resolution (<720p / Noisy Sensor)',
      lowResSessions
    );
    const highResCohort = this.buildCohortMetric(
      'CAMERA_QUALITY',
      'Standard/High Resolution (>=720p)',
      highResSessions
    );
    cohorts.push(lowResCohort, highResCohort);

    if (highResCohort.flagRate > 0 && lowResCohort.totalSessions >= 5) {
      const cameraRatio = lowResCohort.flagRate / highResCohort.flagRate;
      if (cameraRatio >= BiasMonitoringService.DISPARITY_THRESHOLD) {
        alerts.push({
          id: `alert_camera_${Date.now()}`,
          category: 'CAMERA_QUALITY',
          baselineSegment: highResCohort.segmentName,
          comparisonSegment: lowResCohort.segmentName,
          baselineRate: highResCohort.flagRate,
          comparisonRate: lowResCohort.flagRate,
          disparityRatio: Math.round(cameraRatio * 100) / 100,
          severity: cameraRatio >= 2.0 ? 'CRITICAL' : 'WARNING',
          message: `Disproportionate proctoring flag rate detected on low-resolution webcams (${(
            cameraRatio * 100 -
            100
          ).toFixed(0)}% higher than HD baseline).`,
          mitigationRecommendation:
            'Adjust Wasm facial landmark confidence thresholds on 480p streams and increase human review verification prior to applying violation points.',
        });
      }
    }

    // 2. Lighting Condition Segmentation
    const dimSessions = sessions.filter((s) => s.lightingCondition === 'DIM_BACKLIT');
    const balancedSessions = sessions.filter((s) => s.lightingCondition === 'BALANCED');

    const dimCohort = this.buildCohortMetric(
      'LIGHTING_CONDITION',
      'Suboptimal / Low Lighting & Backlit',
      dimSessions
    );
    const balancedCohort = this.buildCohortMetric(
      'LIGHTING_CONDITION',
      'Balanced & Uniform Lighting',
      balancedSessions
    );
    cohorts.push(dimCohort, balancedCohort);

    if (balancedCohort.flagRate > 0 && dimCohort.totalSessions >= 5) {
      const lightRatio = dimCohort.flagRate / balancedCohort.flagRate;
      if (lightRatio >= BiasMonitoringService.DISPARITY_THRESHOLD) {
        alerts.push({
          id: `alert_light_${Date.now()}`,
          category: 'LIGHTING_CONDITION',
          baselineSegment: balancedCohort.segmentName,
          comparisonSegment: dimCohort.segmentName,
          baselineRate: balancedCohort.flagRate,
          comparisonRate: dimCohort.flagRate,
          disparityRatio: Math.round(lightRatio * 100) / 100,
          severity: 'WARNING',
          message: `Candidates in low or backlit environments receive ${(lightRatio * 100 - 100).toFixed(
            0
          )}% more automated gaze/face flags.`,
          mitigationRecommendation:
            'Implement pre-exam environmental lighting calibration in System Check to guide candidates to reposition light sources.',
        });
      }
    }

    // 3. Accommodation Status Segmentation
    const accommodatedSessions = sessions.filter((s) => s.hasAccommodation);
    const standardSessions = sessions.filter((s) => !s.hasAccommodation);

    const accommodatedCohort = this.buildCohortMetric(
      'ACCOMMODATION_STATUS',
      'Approved Accommodations (Assistive Tech / Breaks / Relaxed Gaze)',
      accommodatedSessions
    );
    const standardCohort = this.buildCohortMetric(
      'ACCOMMODATION_STATUS',
      'Standard Test Takers (No Accommodation)',
      standardSessions
    );
    cohorts.push(accommodatedCohort, standardCohort);

    if (standardCohort.flagRate > 0 && accommodatedCohort.totalSessions >= 3) {
      const accomRatio = accommodatedCohort.flagRate / standardCohort.flagRate;
      if (accomRatio >= BiasMonitoringService.DISPARITY_THRESHOLD) {
        alerts.push({
          id: `alert_accom_${Date.now()}`,
          category: 'ACCOMMODATION_STATUS',
          baselineSegment: standardCohort.segmentName,
          comparisonSegment: accommodatedCohort.segmentName,
          baselineRate: standardCohort.flagRate,
          comparisonRate: accommodatedCohort.flagRate,
          disparityRatio: Math.round(accomRatio * 100) / 100,
          severity: 'CRITICAL',
          message: `Accommodated candidates are flagged at ${(accomRatio * 100 - 100).toFixed(
            0
          )}% above the standard candidate rate. Potential violation filter leak.`,
          mitigationRecommendation:
            'Verify that candidate accommodation profile is actively linked in ViolationEngine to automatically suppress focus loss and gaze drift penalties.',
        });
      }
    }

    return {
      evaluatedAt: Date.now(),
      totalSessionsAnalyzed: totalSessions,
      cohorts,
      alerts,
    };
  }

  private buildCohortMetric(
    category: BiasSegmentCategory,
    segmentName: string,
    sessions: CandidateSessionBiasInput[]
  ): BiasCohortMetric {
    const total = sessions.length;
    if (total === 0) {
      return {
        category,
        segmentName,
        totalSessions: 0,
        flaggedSessions: 0,
        flagRate: 0,
        clearedSessions: 0,
        falsePositiveRate: 0,
        averageIntegrityScore: 100,
      };
    }

    const flagged = sessions.filter((s) => s.wasFlagged).length;
    const cleared = sessions.filter((s) => s.reviewerDecision === 'CLEAR').length;
    const reviewed = sessions.filter((s) => s.reviewerDecision != null).length;
    const avgIntegrity =
      sessions.reduce((sum, s) => sum + s.integrityConfidenceScore, 0) / total;

    return {
      category,
      segmentName,
      totalSessions: total,
      flaggedSessions: flagged,
      flagRate: Math.round((flagged / total) * 1000) / 1000,
      clearedSessions: cleared,
      falsePositiveRate: reviewed > 0 ? Math.round((cleared / reviewed) * 1000) / 1000 : 0,
      averageIntegrityScore: Math.round(avgIntegrity * 10) / 10,
    };
  }
}

export const biasMonitoringService = new BiasMonitoringService();

