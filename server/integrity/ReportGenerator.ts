import { BehaviorReport, EvidencePackage, IntegrityAssessmentResult } from './types/IntegrityTypes';

export interface ComprehensiveIntegrityReport {
  reportId: string;
  generatedAt: string;
  candidate: {
    candidateId: string;
    sessionId: string;
    examId: string;
    organizationId: string;
  };
  environment: Record<string, any>;
  timeline: any[];
  behaviorSummary: {
    typingCadenceShift: boolean;
    focusLossFrequency: number;
    rapidPasteCount: number;
    unexpectedOverlayCount: number;
    networkDisconnectCount: number;
  };
  riskBreakdown: {
    overallRiskScore: number;
    policyVersion: string;
    dimensions: Record<string, any>;
  };
  evidenceSummary: {
    totalEvents: number;
    focusEventsCount: number;
    clipboardEventsCount: number;
    browserEventsCount: number;
    networkEventsCount: number;
  };
  recommendations: string[];
  reviewerNotes: string;
  decision: string;
}

/**
 * @class ReportGenerator
 * @description Generates production-ready, human-readable Integrity Reports in JSON and HTML/PDF-exportable format.
 */
export class ReportGenerator {
  public generateReport(
    assessment: IntegrityAssessmentResult,
    behaviorReport: BehaviorReport,
    evidencePackage: EvidencePackage,
    reviewerNotes?: string,
    decision?: string
  ): ComprehensiveIntegrityReport {
    const reportId = `report_${assessment.sessionId}_${Date.now()}`;

    // Generate Human Recommendations based on risk dimensions
    const recommendations: string[] = [];
    if (assessment.overallRiskScore >= 70) {
      recommendations.push('HIGH RISK: Human proctor manual session replay review strongly advised before result validation.');
    } else if (assessment.overallRiskScore >= 40) {
      recommendations.push('MEDIUM RISK: Review flagged focus loss and clipboard paste evidence timestamps.');
    } else {
      recommendations.push('LOW RISK: Telemetry signals indicate normal candidate examination behavior.');
    }

    if (assessment.dimensions['Focus Risk']?.score > 50) {
      recommendations.push('Check focus loss timestamps against permitted reference materials policy.');
    }
    if (assessment.dimensions['Clipboard Risk']?.score > 50) {
      recommendations.push('Inspect paste attempt counts and question response timeline deltas.');
    }

    return {
      reportId,
      generatedAt: new Date().toISOString(),
      candidate: {
        candidateId: assessment.candidateId,
        sessionId: assessment.sessionId,
        examId: assessment.examId,
        organizationId: assessment.organizationId,
      },
      environment: evidencePackage.environmentHistory[0]?.details?.metadata || {},
      timeline: behaviorReport.timeline,
      behaviorSummary: behaviorReport.deviationSummaries,
      riskBreakdown: {
        overallRiskScore: assessment.overallRiskScore,
        policyVersion: assessment.policyVersion,
        dimensions: assessment.dimensions,
      },
      evidenceSummary: {
        totalEvents: evidencePackage.eventsCount,
        focusEventsCount: evidencePackage.focusHistory.length,
        clipboardEventsCount: evidencePackage.clipboardHistory.length,
        browserEventsCount: evidencePackage.browserHistory.length,
        networkEventsCount: evidencePackage.networkHistory.length,
      },
      recommendations,
      reviewerNotes: reviewerNotes || 'No reviewer notes attached.',
      decision: decision || assessment.reviewStatus,
    };
  }

  /**
   * Export report as clean HTML string suitable for PDF conversion or browser rendering.
   */
  public generateHTMLReport(report: ComprehensiveIntegrityReport): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AssessIQ Integrity Report - ${report.candidate.candidateId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #1e293b; padding: 2rem; max-width: 900px; margin: 0 auto; }
    h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 600; font-size: 0.875rem; }
    .badge-high { background: #fee2e2; color: #991b1b; }
    .badge-medium { background: #fef3c7; color: #92400e; }
    .badge-low { background: #dcfce7; color: #166534; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #e2e8f0; }
    th { background: #f1f5f9; }
  </style>
</head>
<body>
  <h1>AssessIQ Enterprise Integrity Report</h1>
  <div class="card">
    <p><strong>Candidate ID:</strong> ${report.candidate.candidateId}</p>
    <p><strong>Exam ID:</strong> ${report.candidate.examId}</p>
    <p><strong>Session ID:</strong> ${report.candidate.sessionId}</p>
    <p><strong>Overall Risk Score:</strong> <span class="badge ${report.riskBreakdown.overallRiskScore > 60 ? 'badge-high' : report.riskBreakdown.overallRiskScore > 30 ? 'badge-medium' : 'badge-low'}">${report.riskBreakdown.overallRiskScore} / 100</span></p>
    <p><strong>Decision:</strong> ${report.decision}</p>
  </div>

  <h2>Risk Dimension Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th>Dimension</th>
        <th>Score</th>
        <th>Severity</th>
        <th>Explanation</th>
      </tr>
    </thead>
    <tbody>
      ${Object.values(report.riskBreakdown.dimensions)
        .map(
          (dim: any) => `
        <tr>
          <td><strong>${dim.dimension}</strong></td>
          <td>${dim.score}</td>
          <td><span class="badge ${dim.severity === 'HIGH' ? 'badge-high' : dim.severity === 'MEDIUM' ? 'badge-medium' : 'badge-low'}">${dim.severity}</span></td>
          <td>${dim.explanation}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h2>Recommendations</h2>
  <ul>
    ${report.recommendations.map((rec) => `<li>${rec}</li>`).join('')}
  </ul>
</body>
</html>
    `.trim();
  }
}
