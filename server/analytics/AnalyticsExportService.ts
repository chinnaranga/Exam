import {
  CandidateScorecard,
  ItemAnalysisSummary,
  IntegrityAnalyticsReport,
  ExamAnalyticsReport,
} from './analyticsTypes';

export class AnalyticsExportService {
  /**
   * Generates a CSV of candidate results.
   */
  public exportResultsCSV(scorecards: CandidateScorecard[]): string {
    const headers = [
      'Candidate ID',
      'Candidate Name',
      'Email',
      'Exam ID',
      'Exam Title',
      'Total Score',
      'Max Score',
      'Percentage (%)',
      'Grade',
      'Percentile Rank',
      'Passed',
      'Result Status',
      'Integrity Status',
      'Submitted At',
    ];

    const rows = scorecards.map((sc) => [
      this.escapeCSV(sc.candidateId),
      this.escapeCSV(sc.candidateName),
      this.escapeCSV(sc.candidateEmail || ''),
      this.escapeCSV(sc.examId),
      this.escapeCSV(sc.examTitle),
      sc.isWithheld ? 'WITHHELD' : sc.totalScore.toString(),
      sc.maxScore.toString(),
      sc.isWithheld ? 'WITHHELD' : sc.percentage.toString(),
      sc.isWithheld ? 'PENDING' : sc.gradeLetter,
      sc.isWithheld ? 'N/A' : sc.percentileRank.toString(),
      sc.isWithheld ? 'N/A' : sc.passed ? 'YES' : 'NO',
      sc.status,
      sc.integrityStatus,
      new Date(sc.submittedAt).toISOString(),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Generates a CSV of psychometric item analysis.
   */
  public exportItemAnalysisCSV(summary: ItemAnalysisSummary): string {
    const headers = [
      'Question ID',
      'Prompt',
      'Type',
      'Max Points',
      'Total Attempts',
      'Correct Count',
      'Difficulty Index (p)',
      'Discrimination Index (D)',
      'Point-Biserial (r)',
      'Quality Flags',
      'Distractor Breakdown',
      'Psychometric Recommendation',
    ];

    const rows = summary.items.map((item) => {
      const distractorStr = item.distractors
        .map((d) => `[${d.text}: ${d.totalSelected} (${(d.selectedPercentage * 100).toFixed(0)}%)]`)
        .join('; ');

      return [
        this.escapeCSV(item.questionId),
        this.escapeCSV(item.prompt),
        this.escapeCSV(item.type),
        item.maxPoints.toString(),
        item.totalAttempts.toString(),
        item.correctCount.toString(),
        item.difficultyIndex.toFixed(3),
        item.discriminationIndex.toFixed(3),
        item.pointBiserial.toFixed(3),
        this.escapeCSV(item.flags.join('; ') || 'NONE'),
        this.escapeCSV(distractorStr || 'N/A'),
        this.escapeCSV(item.recommendation),
      ];
    });

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Generates a CSV of integrity analytics & proctoring signal effectiveness.
   */
  public exportIntegritySummaryCSV(report: IntegrityAnalyticsReport): string {
    const headers = [
      'Signal Type',
      'Current Severity',
      'Points',
      'Total Triggered',
      'Upheld Count',
      'Cleared Count (FP)',
      'Upheld Rate (Precision)',
      'False Positive Rate',
      'Reliability Grade',
    ];

    const rows = report.signalEffectiveness.map((sig) => [
      this.escapeCSV(sig.signalType),
      sig.currentSeverity,
      sig.currentPoints.toString(),
      sig.totalTriggered.toString(),
      sig.upheldCount.toString(),
      sig.clearedCount.toString(),
      (sig.upheldRate * 100).toFixed(1) + '%',
      (sig.falsePositiveRate * 100).toFixed(1) + '%',
      sig.reliabilityGrade,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Generates a print-ready formatted HTML/PDF document template.
   */
  public generatePrintablePDFSummary(params: {
    examAnalytics: ExamAnalyticsReport;
    itemSummary: ItemAnalysisSummary;
    integrityReport: IntegrityAnalyticsReport;
  }): string {
    const { examAnalytics, itemSummary, integrityReport } = params;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AssessIQ Official Examination & Psychometrics Report - ${examAnalytics.examId}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-size: 11pt; }
      .page-break { page-break-before: always; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      margin: 40px;
      line-height: 1.5;
    }
    .header {
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    h1 { margin: 0; font-size: 20pt; color: #1e1b4b; }
    .subtitle { color: #64748b; font-size: 10pt; margin-top: 4px; }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .kpi-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      background: #f8fafc;
    }
    .kpi-val { font-size: 18pt; font-weight: bold; color: #4f46e5; }
    .kpi-label { font-size: 8pt; color: #64748b; text-transform: uppercase; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 9.5pt; }
    th { background: #f1f5f9; text-align: left; padding: 8px 10px; border: 1px solid #cbd5e1; }
    td { padding: 8px 10px; border: 1px solid #cbd5e1; }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    .badge-pass { background: #dcfce7; color: #166534; }
    .badge-flag { background: #fee2e2; color: #991b1b; }
    .badge-warn { background: #fef3c7; color: #92400e; }
    .footer { font-size: 8pt; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>AssessIQ Analytics & Integrity Summary</h1>
      <div class="subtitle">${examAnalytics.examTitle} (Exam ID: ${examAnalytics.examId}) • Generated: ${new Date().toUTCString()}</div>
    </div>
    <div style="text-align: right; font-size: 9pt; color: #475569;">
      <strong>Institutional Audit Copy</strong><br/>
      Cryptographically Anchored Ledger
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Total Candidates</div>
      <div class="kpi-val">${examAnalytics.totalEnrollments}</div>
      <div style="font-size: 8pt; color: #16a34a;">${examAnalytics.completionRate}% Completion Rate</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Cohort Mean Score</div>
      <div class="kpi-val">${examAnalytics.scoreDistribution.meanScore}%</div>
      <div style="font-size: 8pt; color: #64748b;">StdDev: ±${examAnalytics.scoreDistribution.standardDeviation}%</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Mean Discrimination (D)</div>
      <div class="kpi-val">${itemSummary.averageDiscrimination}</div>
      <div style="font-size: 8pt; color: #4f46e5;">Avg Difficulty: ${itemSummary.averageDifficulty}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Proctoring Confidence</div>
      <div class="kpi-val">${integrityReport.averageIntegrityScore}%</div>
      <div style="font-size: 8pt; color: #dc2626;">${integrityReport.totalFlaggedSessions} Flagged Sessions</div>
    </div>
  </div>

  <h2>Item Psychometrics & Distractor Quality</h2>
  <table>
    <thead>
      <tr>
        <th>Question Prompt</th>
        <th>Type</th>
        <th>Difficulty (p)</th>
        <th>Discrimination (D)</th>
        <th>Quality Flags</th>
        <th>Recommendation</th>
      </tr>
    </thead>
    <tbody>
      ${itemSummary.items
        .map(
          (it) => `
        <tr>
          <td><strong>${it.prompt.substring(0, 45)}...</strong></td>
          <td>${it.type}</td>
          <td>${it.difficultyIndex.toFixed(2)}</td>
          <td>${it.discriminationIndex.toFixed(2)}</td>
          <td>${
            it.flags.length > 0
              ? it.flags
                  .map((f) => `<span class="badge ${f.includes('MISKEYED') ? 'badge-flag' : 'badge-warn'}">${f}</span>`)
                  .join(' ')
              : '<span class="badge badge-pass">SOUND</span>'
          }</td>
          <td>${it.recommendation}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h2>Integrity Signals & Reliability Ranking</h2>
  <table>
    <thead>
      <tr>
        <th>Signal</th>
        <th>Severity</th>
        <th>Total Flags</th>
        <th>Upheld (True Pos)</th>
        <th>Cleared (False Pos)</th>
        <th>Precision</th>
        <th>Reliability Grade</th>
      </tr>
    </thead>
    <tbody>
      ${integrityReport.signalEffectiveness
        .map(
          (sig) => `
        <tr>
          <td><strong>${sig.signalType}</strong></td>
          <td>${sig.currentSeverity} (${sig.currentPoints} pts)</td>
          <td>${sig.totalTriggered}</td>
          <td>${sig.upheldCount}</td>
          <td>${sig.clearedCount}</td>
          <td>${(sig.upheldRate * 100).toFixed(1)}%</td>
          <td><span class="badge ${sig.reliabilityGrade === 'EXCELLENT' ? 'badge-pass' : 'badge-warn'}">${sig.reliabilityGrade}</span></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    AssessIQ Cryptographic Proctoring & Psychometrics Suite • Confidential Educational Record • Protected under FERPA & GDPR
  </div>
</body>
</html>`;
  }

  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}

export const analyticsExportService = new AnalyticsExportService();

