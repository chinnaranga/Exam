import React, { useState, useEffect } from 'react';
import {
  LiveOpsMetrics,
  CandidateSessionMonitorItem,
  ReviewCase,
  CandidateAppeal,
  AIEvidenceSummary,
  ComplianceRecord,
  AnalyticsSummary,
  OrgPolicy,
  OperationsAlertItem,
  IncidentItem,
  SystemHealthMetrics,
  DisasterRecoveryStatus,
} from '../../server/operations/types/OperationsTypes';

export const EnterpriseCommandCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('live_ops');
  const [selectedOrg, setSelectedOrg] = useState<string>('org_mit_01');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Module States
  const [liveMetrics, setLiveMetrics] = useState<LiveOpsMetrics | null>(null);
  const [sessions, setSessions] = useState<CandidateSessionMonitorItem[]>([]);
  const [cases, setCases] = useState<ReviewCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<ReviewCase | null>(null);
  const [aiSummary, setAiSummary] = useState<AIEvidenceSummary | null>(null);
  const [policy, setPolicy] = useState<OrgPolicy | null>(null);
  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealthMetrics | null>(null);
  const [drStatus, setDrStatus] = useState<DisasterRecoveryStatus | null>(null);
  const [alerts, setAlerts] = useState<OperationsAlertItem[]>([]);
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [appeals, setAppeals] = useState<CandidateAppeal[]>([]);

  // Simulation loading effect
  useEffect(() => {
    fetchData();
  }, [selectedOrg, activeTab]);

  const fetchData = () => {
    // Live Metrics mock load
    setLiveMetrics({
      activeExamsCount: 14,
      activeOrganizationsCount: 8,
      candidatesOnlineCount: 1420,
      candidatesOfflineCount: 3,
      examsPausedCount: 1,
      networkIncidentsCount: 0,
      highRiskSessionsCount: 2,
      aiInferenceHealthPercent: 99.8,
      queueLength: 12,
      infrastructureHealthPercent: 99.9,
      lastUpdated: new Date().toLocaleTimeString(),
    });

    setSessions([
      {
        sessionId: 'session_live_101',
        candidateId: 'cand_alice_202',
        candidateName: 'Alice Vance',
        organizationId: selectedOrg,
        organizationName: 'MIT CS',
        examId: 'exam_cs101',
        examTitle: 'CS101 Algorithms Midterm',
        timeRemainingSeconds: 3420,
        integrityDimensions: { focusRisk: 15, typingRisk: 10, clipboardRisk: 0, browserRisk: 5, deviceRisk: 0, environmentRisk: 0, networkRisk: 0, overlayRisk: 0, fullscreenRisk: 0 },
        cameraHealth: 'HEALTHY',
        browserHealth: 'HEALTHY',
        connectionQuality: 'EXCELLENT',
        status: 'ACTIVE',
      },
      {
        sessionId: 'session_live_102',
        candidateId: 'cand_bob_303',
        candidateName: 'Bob Smith',
        organizationId: selectedOrg,
        organizationName: 'MIT CS',
        examId: 'exam_cs101',
        examTitle: 'CS101 Algorithms Midterm',
        timeRemainingSeconds: 2100,
        integrityDimensions: { focusRisk: 75, typingRisk: 40, clipboardRisk: 60, browserRisk: 30, deviceRisk: 0, environmentRisk: 0, networkRisk: 10, overlayRisk: 45, fullscreenRisk: 30 },
        cameraHealth: 'HEALTHY',
        browserHealth: 'DEVTOOLS_SUSPECTED',
        connectionQuality: 'GOOD',
        status: 'FLAGGED',
      },
    ]);

    setCases([
      {
        caseId: 'case_707',
        sessionId: 'session_live_102',
        candidateId: 'cand_bob_303',
        candidateName: 'Bob Smith',
        examId: 'exam_cs101',
        organizationId: selectedOrg,
        status: 'UNDER_REVIEW',
        riskScore: 68,
        evidenceSummary: { focusLossCount: 4, rapidPasteCount: 2 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    setPolicy({
      organizationId: selectedOrg,
      allowCopy: false,
      allowCalculator: true,
      requireFullscreen: true,
      enableAIProctoring: true,
      enableMicrophone: true,
      enableCamera: true,
      reviewScoreThreshold: 60,
      retentionDays: 90,
    });

    setSystemHealth({
      apiHealthPercent: 99.98,
      queueHealthPercent: 100.0,
      databaseHealthPercent: 99.95,
      aiInferenceHealthPercent: 99.8,
      workersActiveCount: 24,
      storageUsagePercent: 34.2,
      avgLatencyMs: 24,
      lastChecked: new Date().toLocaleTimeString(),
    });

    setDrStatus({
      backupStatus: 'HEALTHY',
      lastBackupTimestamp: '15 mins ago',
      replicationLagMs: 14,
      failoverReady: true,
      serviceRestorationStatus: 'OPERATIONAL',
    });
  };

  const handleGenerateAISummary = (caseId: string) => {
    setAiSummary({
      caseId,
      eventSummary: 'Recorded 4 window focus loss events and 2 rapid paste attempts.',
      timelineSummary: 'Focus lost at T+12m for 120s. Rapid Ctrl+V paste detected at T+24m.',
      riskExplanation: 'Overall risk score: 68/100 (Medium-High Risk). Multiple tab switches combined with clipboard insertion.',
      suggestedQuestions: [
        'Did candidate seek external solutions on forbidden secondary window?',
        'Inspect clipboard source text timestamp vs answer insertion timestamp.',
      ],
      generatedAt: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '1.5rem' }}>
      {/* Top Header & Multi-Tenant Organization Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#38bdf8' }}>AssessIQ Enterprise Operations Command Center</h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>Administrative Command Center • Multi-Tenant Governance & Operational Visibility</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>Organization:</label>
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            style={{ backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '0.4rem 0.8rem', borderRadius: '6px' }}
          >
            <option value="org_mit_01">MIT Dept of Computer Science</option>
            <option value="org_harvard_med">Harvard Medical School</option>
            <option value="org_oxford_biz">Oxford Said Business School</option>
            <option value="org_stanford_eng">Stanford School of Engineering</option>
          </select>

          <span style={{ backgroundColor: '#166534', color: '#4ade80', padding: '0.3rem 0.7rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
            SYSTEM OPERATIONAL
          </span>
        </div>
      </div>

      {/* Module Navigation Tabs (20 Modules) */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b' }}>
        {[
          { id: 'live_ops', label: '1. Live Operations' },
          { id: 'session_monitoring', label: '2. Session Monitoring' },
          { id: 'proctor_workspace', label: '3. Proctor Workspace' },
          { id: 'review_center', label: '4. Integrity Review' },
          { id: 'appeals_manager', label: '5. Appeals Manager' },
          { id: 'ai_assistant', label: '6. AI Evidence Assistant' },
          { id: 'compliance', label: '7. Compliance Center' },
          { id: 'audit_center', label: '8. Audit Center' },
          { id: 'analytics', label: '9. Analytics Platform' },
          { id: 'policy_engine', label: '10. Policy Engine' },
          { id: 'alert_center', label: '11. Alert Center' },
          { id: 'notifications', label: '12. Notifications' },
          { id: 'incidents', label: '13. Incident Manager' },
          { id: 'risk_dashboard', label: '14. Risk Dashboard' },
          { id: 'reporting', label: '15. Reporting Center' },
          { id: 'retention', label: '16. Retention Manager' },
          { id: 'multi_tenant', label: '17. Multi-Tenant Admin' },
          { id: 'billing', label: '18. Billing & Usage' },
          { id: 'system_health', label: '19. System Health' },
          { id: 'disaster_recovery', label: '20. Disaster Recovery' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.85rem',
              fontWeight: 500,
              backgroundColor: activeTab === tab.id ? '#0284c7' : '#1e293b',
              color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT RENDERERS */}
      {/* 1. Live Operations Center */}
      {activeTab === 'live_ops' && liveMetrics && (
        <div>
          <h2>1. Live Operations Center</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <MetricCard title="Candidates Online" value={liveMetrics.candidatesOnlineCount} color="#38bdf8" />
            <MetricCard title="Active Exams" value={liveMetrics.activeExamsCount} color="#818cf8" />
            <MetricCard title="High-Risk Sessions" value={liveMetrics.highRiskSessionsCount} color="#f87171" />
            <MetricCard title="Exams Paused" value={liveMetrics.examsPausedCount} color="#fbbf24" />
            <MetricCard title="AI Inference Health" value={`${liveMetrics.aiInferenceHealthPercent}%`} color="#4ade80" />
            <MetricCard title="Infra Health" value={`${liveMetrics.infrastructureHealthPercent}%`} color="#34d399" />
          </div>
        </div>
      )}

      {/* 2. Session Monitoring */}
      {activeTab === 'session_monitoring' && (
        <div>
          <h2>2. Live Session Monitoring Grid</h2>
          <input
            type="text"
            placeholder="Search candidate name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.5rem 1rem', width: '300px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#fff', marginBottom: '1rem' }}
          />

          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', textTransform: 'uppercase', fontSize: '0.75rem', color: '#94a3b8' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Candidate</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Exam</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Time Left</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Focus Risk</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Browser</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.sessionId} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '1rem' }}><strong>{s.candidateName}</strong><br/><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.candidateId}</span></td>
                  <td style={{ padding: '1rem' }}>{s.examTitle}</td>
                  <td style={{ padding: '1rem' }}>{Math.floor(s.timeRemainingSeconds / 60)}m</td>
                  <td style={{ padding: '1rem', color: s.integrityDimensions.focusRisk > 50 ? '#f87171' : '#4ade80' }}>{s.integrityDimensions.focusRisk} / 100</td>
                  <td style={{ padding: '1rem' }}>{s.browserHealth}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ backgroundColor: s.status === 'FLAGGED' ? '#991b1b' : '#166534', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' }}>{s.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button style={{ backgroundColor: '#eab308', color: '#000', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', marginRight: '0.5rem', cursor: 'pointer' }}>Pause</button>
                    <button style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Flag</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Integrity Review Center */}
      {activeTab === 'review_center' && (
        <div>
          <h2>4. Integrity Review Center (Case Management)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px' }}>
              <h3>Review Cases</h3>
              {cases.map((c) => (
                <div key={c.caseId} onClick={() => { setSelectedCase(c); handleGenerateAISummary(c.caseId); }} style={{ padding: '1rem', backgroundColor: selectedCase?.caseId === c.caseId ? '#334155' : '#0f172a', borderRadius: '6px', marginBottom: '0.75rem', cursor: 'pointer' }}>
                  <strong>{c.candidateName}</strong> ({c.candidateId})<br />
                  <span style={{ fontSize: '0.8rem', color: '#f87171' }}>Risk Score: {c.riskScore}/100</span> | Status: {c.status}
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
              {selectedCase ? (
                <div>
                  <h3>Case File: {selectedCase.caseId}</h3>
                  <p><strong>Candidate:</strong> {selectedCase.candidateName} ({selectedCase.candidateId})</p>
                  <p><strong>Exam:</strong> {selectedCase.examId}</p>
                  <p><strong>Status:</strong> {selectedCase.status}</p>

                  {aiSummary && (
                    <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #38bdf8', margin: '1rem 0' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#38bdf8' }}>AI Evidence Assistant Summary</h4>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{aiSummary.eventSummary}</p>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#cbd5e1' }}><strong>Explanation:</strong> {aiSummary.riskExplanation}</p>
                    </div>
                  )}

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button style={{ backgroundColor: '#166534', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Clear Case</button>
                    <button style={{ backgroundColor: '#991b1b', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Confirm Violation</button>
                    <button style={{ backgroundColor: '#1e40af', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Request Evidence</button>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#94a3b8' }}>Select a case file from the left panel to review telemetry evidence.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 10. Organization Policy Engine */}
      {activeTab === 'policy_engine' && policy && (
        <div>
          <h2>10. Organization Policy Engine</h2>
          <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px', maxWidth: '600px' }}>
            <h3>Policy Configuration for {selectedOrg}</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <label><input type="checkbox" checked={policy.requireFullscreen} onChange={(e) => setPolicy({ ...policy, requireFullscreen: e.target.checked })} /> Require Fullscreen Lockdown</label>
              <label><input type="checkbox" checked={policy.allowCopy} onChange={(e) => setPolicy({ ...policy, allowCopy: e.target.checked })} /> Allow Copy/Paste</label>
              <label><input type="checkbox" checked={policy.enableAIProctoring} onChange={(e) => setPolicy({ ...policy, enableAIProctoring: e.target.checked })} /> Enable AI Remote Proctoring</label>
              <label><input type="checkbox" checked={policy.enableCamera} onChange={(e) => setPolicy({ ...policy, enableCamera: e.target.checked })} /> Enable Candidate Camera Feed</label>
              <label>Review Flagging Score Threshold (0-100): <input type="number" value={policy.reviewScoreThreshold} onChange={(e) => setPolicy({ ...policy, reviewScoreThreshold: parseInt(e.target.value) })} style={{ backgroundColor: '#0f172a', color: '#fff', border: '1px solid #475569', padding: '0.3rem', width: '80px' }} /></label>
              <button style={{ backgroundColor: '#0284c7', color: '#fff', padding: '0.6rem', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '1rem' }}>Save Organization Policy</button>
            </div>
          </div>
        </div>
      )}

      {/* 19. System Health Center */}
      {activeTab === 'system_health' && systemHealth && (
        <div>
          <h2>19. System Health Center</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <MetricCard title="API Health" value={`${systemHealth.apiHealthPercent}%`} color="#4ade80" />
            <MetricCard title="Queue Health" value={`${systemHealth.queueHealthPercent}%`} color="#34d399" />
            <MetricCard title="Database Health" value={`${systemHealth.databaseHealthPercent}%`} color="#38bdf8" />
            <MetricCard title="Active Workers" value={systemHealth.workersActiveCount} color="#818cf8" />
            <MetricCard title="Avg API Latency" value={`${systemHealth.avgLatencyMs} ms`} color="#a78bfa" />
          </div>
        </div>
      )}

      {/* Generic Placeholder for other modules */}
      {!['live_ops', 'session_monitoring', 'review_center', 'policy_engine', 'system_health'].includes(activeTab) && (
        <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Module Active: {activeTab.replace('_', ' ').toUpperCase()}</h3>
          <p style={{ color: '#94a3b8' }}>Enterprise Operations API endpoint active under <code>/api/v1/operations/{activeTab}</code></p>
        </div>
      )}
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
  <div style={{ backgroundColor: '#1e293b', border: `1px solid ${color}44`, borderRadius: '8px', padding: '1.25rem' }}>
    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{title}</span>
    <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.75rem', color }}>{value}</h3>
  </div>
);
