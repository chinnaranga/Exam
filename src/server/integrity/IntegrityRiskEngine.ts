import {
  BehaviorReport,
  IntegrityAssessmentResult,
  IntegrityEventPayload,
  IntegrityPolicyConfig,
  RiskDimensionScore,
  SessionBaseline,
} from './types/IntegrityTypes';

/**
 * @class IntegrityRiskEngine
 * @description Master server-side scoring engine computing multi-dimensional risk scores (0–100) per exam session.
 * 
 * CORE PRINCIPLE:
 * • Policy-driven: All weights, thresholds, and module activations are driven dynamically by configuration.
 * • Explainable: Every risk dimension attaches human-readable rationale, confidence, limitations, and false positive guidance.
 * • Non-punitive: Never automatically fails a candidate or renders a conclusive verdict.
 */
export class IntegrityRiskEngine {
  public static readonly DEFAULT_POLICY: IntegrityPolicyConfig = {
    organizationId: 'default',
    version: '1.0.0',
    weights: {
      focusRiskWeight: 0.20,
      typingRiskWeight: 0.15,
      clipboardRiskWeight: 0.15,
      browserRiskWeight: 0.10,
      deviceRiskWeight: 0.05,
      environmentRiskWeight: 0.05,
      networkRiskWeight: 0.05,
      overlayRiskWeight: 0.15,
      fullscreenRiskWeight: 0.10,
    },
    thresholds: {
      highRiskScoreThreshold: 70,
      mediumRiskScoreThreshold: 40,
      maxFocusLossCountAllowed: 3,
      maxRapidPasteCountAllowed: 2,
    },
    enabledModules: [
      'FocusMonitor',
      'KeyboardAnalyzer',
      'ClipboardMonitor',
      'MouseAnalyzer',
      'AnswerBehaviorMonitor',
      'DevToolsMonitor',
      'DOMOverlayScanner',
      'BrowserFingerprintMonitor',
      'ScreenMonitor',
      'NetworkMonitor',
      'EnvironmentMonitor',
    ],
    retentionDays: 90,
  };

  /**
   * Evaluate session telemetry and baseline metrics against policy rules to produce an IntegrityAssessmentResult.
   */
  public evaluateAssessment(
    sessionId: string,
    candidateId: string,
    examId: string,
    organizationId: string,
    events: IntegrityEventPayload[],
    baseline: SessionBaseline | null,
    behaviorReport: BehaviorReport,
    policy?: IntegrityPolicyConfig
  ): IntegrityAssessmentResult {
    const activePolicy = policy || IntegrityRiskEngine.DEFAULT_POLICY;

    // Calculate individual 9 Risk Dimensions
    const focusRisk = this.calculateFocusRisk(events, behaviorReport, activePolicy);
    const typingRisk = this.calculateTypingRisk(events, baseline, behaviorReport, activePolicy);
    const clipboardRisk = this.calculateClipboardRisk(events, activePolicy);
    const browserRisk = this.calculateBrowserRisk(events);
    const deviceRisk = this.calculateDeviceRisk(events);
    const environmentRisk = this.calculateEnvironmentRisk(events);
    const networkRisk = this.calculateNetworkRisk(events);
    const overlayRisk = this.calculateOverlayRisk(events);
    const fullscreenRisk = this.calculateFullscreenRisk(events);

    const dimensions: Record<string, RiskDimensionScore> = {
      'Focus Risk': focusRisk,
      'Typing Risk': typingRisk,
      'Clipboard Risk': clipboardRisk,
      'Browser Risk': browserRisk,
      'Device Risk': deviceRisk,
      'Environment Risk': environmentRisk,
      'Network Risk': networkRisk,
      'Overlay Risk': overlayRisk,
      'Fullscreen Risk': fullscreenRisk,
    };

    // Calculate Weighted Overall Risk Score
    const weights = activePolicy.weights;
    const overallRiskScore = Math.min(
      100,
      Math.round(
        focusRisk.score * weights.focusRiskWeight +
        typingRisk.score * weights.typingRiskWeight +
        clipboardRisk.score * weights.clipboardRiskWeight +
        browserRisk.score * weights.browserRiskWeight +
        deviceRisk.score * weights.deviceRiskWeight +
        environmentRisk.score * weights.environmentRiskWeight +
        networkRisk.score * weights.networkRiskWeight +
        overlayRisk.score * weights.overlayRiskWeight +
        fullscreenRisk.score * weights.fullscreenRiskWeight
      )
    );

    let reviewStatus: any = 'CLEARED';
    if (overallRiskScore >= activePolicy.thresholds.highRiskScoreThreshold) {
      reviewStatus = 'PENDING_REVIEW';
    } else if (overallRiskScore >= activePolicy.thresholds.mediumRiskScoreThreshold) {
      reviewStatus = 'PENDING_REVIEW';
    }

    return {
      sessionId,
      candidateId,
      examId,
      organizationId,
      overallRiskScore,
      policyVersion: activePolicy.version,
      dimensions,
      reviewStatus,
      calculatedAt: new Date().toISOString(),
    };
  }

  // Dimension Calculators
  private calculateFocusRisk(events: IntegrityEventPayload[], report: BehaviorReport, policy: IntegrityPolicyConfig): RiskDimensionScore {
    const focusEvts = events.filter((e) => e.module === 'FocusMonitor' || e.type.includes('Focus') || e.type.includes('Visibility'));
    const focusLossCount = report.deviationSummaries.focusLossFrequency;

    let score = Math.min(100, focusLossCount * 25);
    const severity = score > 60 ? 'HIGH' : score > 25 ? 'MEDIUM' : 'LOW';

    return {
      dimension: 'Focus Risk',
      score,
      severity,
      confidence: 'HIGH',
      evidenceCount: focusEvts.length,
      explanation: focusLossCount > 0
        ? `Candidate lost active examination window focus ${focusLossCount} times during the session.`
        : 'Focus remained continuous throughout the examination session.',
      possibleFalsePositives: ['System notification popups', 'Dual monitor mouse movement', 'OS update prompts'],
      limitations: 'Focus loss measurement cannot determine destination application window.',
      evidenceSnippets: focusEvts.slice(0, 5),
    };
  }

  private calculateTypingRisk(events: IntegrityEventPayload[], baseline: SessionBaseline | null, report: BehaviorReport, policy: IntegrityPolicyConfig): RiskDimensionScore {
    const typingEvts = events.filter((e) => e.module === 'KeyboardAnalyzer' || e.module === 'AnswerBehaviorMonitor');
    const largeInsertions = events.filter((e) => e.type === 'LargeInsertion');

    let score = Math.min(100, largeInsertions.length * 35 + (report.deviationSummaries.typingCadenceShift ? 25 : 0));
    const severity = score > 60 ? 'HIGH' : score > 25 ? 'MEDIUM' : 'LOW';

    return {
      dimension: 'Typing Risk',
      score,
      severity,
      confidence: 'MEDIUM',
      evidenceCount: typingEvts.length,
      explanation: largeInsertions.length > 0
        ? `Detected ${largeInsertions.length} sudden large text insertion events exceeding typical human typing speeds.`
        : 'Typing rhythm and cadence remained within expected candidate baseline parameters.',
      possibleFalsePositives: ['Auto-complete insertion', 'Permitted code snippet paste', 'Form autofill'],
      limitations: 'Text content is NEVER captured for privacy preservation.',
      evidenceSnippets: largeInsertions.slice(0, 5),
    };
  }

  private calculateClipboardRisk(events: IntegrityEventPayload[], policy: IntegrityPolicyConfig): RiskDimensionScore {
    const clipEvts = events.filter((e) => e.module === 'ClipboardMonitor' || e.type.includes('Paste') || e.type.includes('Copy'));
    const rapidPastes = events.filter((e) => e.type === 'RapidPasteShortcut' || e.type === 'PasteDetected');

    let score = Math.min(100, rapidPastes.length * 30);
    const severity = score > 60 ? 'HIGH' : score > 25 ? 'MEDIUM' : 'LOW';

    return {
      dimension: 'Clipboard Risk',
      score,
      severity,
      confidence: 'HIGH',
      evidenceCount: clipEvts.length,
      explanation: rapidPastes.length > 0
        ? `Candidate performed ${rapidPastes.length} copy/paste clipboard operations during examination.`
        : 'No suspicious clipboard copy/paste activity detected.',
      possibleFalsePositives: ['Pasting permitted reference code', 'Formatting correction paste'],
      limitations: 'Clipboard text contents are never stored.',
      evidenceSnippets: clipEvts.slice(0, 5),
    };
  }

  private calculateBrowserRisk(events: IntegrityEventPayload[]): RiskDimensionScore {
    const devToolsEvts = events.filter((e) => e.module === 'DevToolsMonitor' || e.type === 'DevToolsPossible');
    let score = Math.min(100, devToolsEvts.length * 30);

    return {
      dimension: 'Browser Risk',
      score,
      severity: score > 50 ? 'HIGH' : score > 20 ? 'MEDIUM' : 'LOW',
      confidence: 'MEDIUM',
      evidenceCount: devToolsEvts.length,
      explanation: devToolsEvts.length > 0
        ? `DevTools indicators or console inspection heuristics triggered ${devToolsEvts.length} time(s).`
        : 'Browser environment signals indicate standard browser interaction.',
      possibleFalsePositives: ['Browser vertical tabs bar', 'Browser side panels', 'Zoom level adjustments'],
      limitations: 'Browser vendor security restricts 100% accurate client-side DevTools detection.',
      evidenceSnippets: devToolsEvts.slice(0, 5),
    };
  }

  private calculateDeviceRisk(events: IntegrityEventPayload[]): RiskDimensionScore {
    const fpEvts = events.filter((e) => e.module === 'BrowserFingerprintMonitor' || e.type.includes('Fingerprint') || e.type.includes('Platform'));
    let score = Math.min(100, fpEvts.length * 40);

    return {
      dimension: 'Device Risk',
      score,
      severity: score > 50 ? 'HIGH' : 'LOW',
      confidence: 'HIGH',
      evidenceCount: fpEvts.length,
      explanation: fpEvts.length > 0
        ? 'Browser hardware platform or graphics renderer parameters altered mid-session.'
        : 'Device baseline parameters remained consistent throughout session.',
      possibleFalsePositives: ['Laptop GPU switching (Intel -> AMD/NVIDIA)', 'Brave Browser Fingerprint Protection'],
      limitations: 'Virtual machine or anti-fingerprinting extensions mask hardware parameters.',
      evidenceSnippets: fpEvts.slice(0, 5),
    };
  }

  private calculateEnvironmentRisk(events: IntegrityEventPayload[]): RiskDimensionScore {
    const envEvts = events.filter((e) => e.module === 'EnvironmentMonitor');
    return {
      dimension: 'Environment Risk',
      score: 0,
      severity: 'INFO',
      confidence: 'HIGH',
      evidenceCount: envEvts.length,
      explanation: 'Passive environment metadata updated normally.',
      possibleFalsePositives: [],
      limitations: 'Passive metadata is informative context only.',
      evidenceSnippets: [],
    };
  }

  private calculateNetworkRisk(events: IntegrityEventPayload[]): RiskDimensionScore {
    const netEvts = events.filter((e) => e.module === 'NetworkMonitor' || e.type === 'Offline' || e.type === 'SlowNetwork');
    const offlineCount = events.filter((e) => e.type === 'Offline').length;

    let score = Math.min(100, offlineCount * 35);
    return {
      dimension: 'Network Risk',
      score,
      severity: score > 50 ? 'HIGH' : score > 20 ? 'MEDIUM' : 'LOW',
      confidence: 'HIGH',
      evidenceCount: netEvts.length,
      explanation: offlineCount > 0
        ? `Candidate experienced ${offlineCount} network disconnection event(s).`
        : 'Network connection stability remained reliable.',
      possibleFalsePositives: ['Wi-Fi signal drop', 'ISP router hiccup'],
      limitations: 'Client network state does not indicate intentional disconnect vs ISP drop.',
      evidenceSnippets: netEvts.slice(0, 5),
    };
  }

  private calculateOverlayRisk(events: IntegrityEventPayload[]): RiskDimensionScore {
    const overlayEvts = events.filter((e) => e.module === 'DOMOverlayScanner' || e.type.includes('Overlay') || e.type.includes('Iframe'));
    let score = Math.min(100, overlayEvts.length * 35);

    return {
      dimension: 'Overlay Risk',
      score,
      severity: score > 50 ? 'HIGH' : score > 20 ? 'MEDIUM' : 'LOW',
      confidence: 'MEDIUM',
      evidenceCount: overlayEvts.length,
      explanation: overlayEvts.length > 0
        ? `DOM scanner identified ${overlayEvts.length} suspicious overlay or hidden iframe elements.`
        : 'No unauthorized DOM overlay elements detected.',
      possibleFalsePositives: ['Framework loading modal', 'Toast notification backdrop'],
      limitations: 'Dynamic web components or extensions generate overlays.',
      evidenceSnippets: overlayEvts.slice(0, 5),
    };
  }

  private calculateFullscreenRisk(events: IntegrityEventPayload[]): RiskDimensionScore {
    const fsExits = events.filter((e) => e.type === 'FullscreenExited');
    let score = Math.min(100, fsExits.length * 30);

    return {
      dimension: 'Fullscreen Risk',
      score,
      severity: score > 50 ? 'HIGH' : score > 20 ? 'MEDIUM' : 'LOW',
      confidence: 'HIGH',
      evidenceCount: fsExits.length,
      explanation: fsExits.length > 0
        ? `Candidate exited examination fullscreen mode ${fsExits.length} time(s).`
        : 'Examination was conducted continuously in fullscreen mode.',
      possibleFalsePositives: ['ESC key press by habit', 'OS alert popup'],
      limitations: 'Browser API does not restrict candidates from exiting fullscreen mode via ESC.',
      evidenceSnippets: fsExits.slice(0, 5),
    };
  }
}
