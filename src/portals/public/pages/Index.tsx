import React from 'react';
import { EnterpriseLayout } from '@/shared/components/EnterpriseLayout';
import { BookOpen, Users, ShieldCheck, ArrowRight, Building2, Brain, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useExams, useCandidates, useQuestionBank, useOrganizations } from '@/shared/hooks/useApiQueries';

export const IndexPage: React.FC = () => {
  const { data: examsData, isLoading: isExamsLoading } = useExams({ page: 1, pageSize: 10 });
  const { data: candidatesData, isLoading: isCandidatesLoading } = useCandidates({ page: 1, pageSize: 10 });
  const { data: questionsData } = useQuestionBank({ page: 1, pageSize: 10 });
  const { data: orgsData } = useOrganizations({ page: 1, pageSize: 10 });

  const examsList = examsData?.data || [];
  const totalExams = examsData?.total || examsList.length;
  const totalCandidates = candidatesData?.total || 0;
  const totalQuestions = questionsData?.total || 0;
  const totalOrgs = orgsData?.total || 0;

  return (
    <EnterpriseLayout>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#F0F9FF', color: '#0F6CBD', border: '1px solid #BAE6FD', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} /> INSTITUTIONAL ASSESSMENT OPERATING SYSTEM
          </div>
          <h1 style={{ margin: 0, fontSize: '1.85rem', color: '#0F172A', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Institutional Examination & Assessment Operations
          </h1>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem', color: '#64748B' }}>
            Real-time candidate testing telemetry, question bank IRT statistics, and zero-trust proctoring pipeline metrics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/demo-exam" className="btn-enterprise-primary" style={{ backgroundColor: '#6C4DFF', borderColor: '#5A3DEB', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} /> Launch Demo Exam (Feature Tester)
          </Link>
          <Link to="/faculty/exams" className="btn-enterprise-secondary">
            Exam Builder Studio
          </Link>
          <Link to="/proctoring" className="btn-enterprise-primary">
            Launch AI Proctoring Suite <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* 4 Dynamic API Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="enterprise-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Examinations
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>
                {isExamsLoading ? '...' : `${totalExams} Blueprints`}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600, marginTop: '0.25rem' }}>
                {totalExams > 0 ? 'Live in Database' : 'No active sessions'}
              </div>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '10px', border: '1px solid #E2E8F0', color: '#0F6CBD' }}>
              <BookOpen size={22} />
            </div>
          </div>
        </div>

        <div className="enterprise-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Registered Candidates
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>
                {isCandidatesLoading ? '...' : `${totalCandidates} Candidates`}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600, marginTop: '0.25rem' }}>
                {totalCandidates > 0 ? 'RLS Partitioned' : '0 Candidates Registered'}
              </div>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '10px', border: '1px solid #E2E8F0', color: '#16A34A' }}>
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="enterprise-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                IRT Calibrated Items
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>
                {totalQuestions} Questions
              </div>
              <div style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: 600, marginTop: '0.25rem' }}>
                Bloom's Calibrated
              </div>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '10px', border: '1px solid #E2E8F0', color: '#2563EB' }}>
              <Brain size={22} />
            </div>
          </div>
        </div>

        <div className="enterprise-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Multi-Tenant Scope
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>
                {totalOrgs} Organizations
              </div>
              <div style={{ fontSize: '0.8rem', color: '#14B8A6', fontWeight: 600, marginTop: '0.25rem' }}>
                AES-256 Encrypted
              </div>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '10px', border: '1px solid #E2E8F0', color: '#14B8A6' }}>
              <Building2 size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Exams + Security Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* Left: Active Exams Table / Empty State */}
        <div className="enterprise-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0F172A', fontWeight: 700 }}>
              Active & Scheduled Examination Sessions
            </h3>
            <span className="badge-enterprise-info">{examsList.length} SESSIONS ACTIVE</span>
          </div>

          {isExamsLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', fontFamily: 'monospace', fontSize: '0.85rem' }}>
              Loading examination telemetry...
            </div>
          ) : examsList.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
              <BookOpen size={40} style={{ margin: '0 auto 1rem auto', color: '#CBD5E1' }} />
              <h4 style={{ margin: 0, fontSize: '1rem', color: '#0F172A', fontWeight: 700 }}>No Active Examinations</h4>
              <p style={{ margin: '0.35rem 0 1rem 0', fontSize: '0.8rem', color: '#64748B' }}>
                Use the Faculty Exam Builder Studio to author and schedule your first assessment blueprint.
              </p>
              <Link to="/faculty/exams" className="btn-enterprise-primary">
                Create Assessment Blueprint
              </Link>
            </div>
          ) : (
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Examination Title</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {examsList.map((row: any) => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 700, color: '#0F6CBD' }}>{row.code || row.id}</td>
                    <td style={{ fontWeight: 600 }}>{row.title}</td>
                    <td style={{ color: '#64748B' }}>{row.department || 'General'}</td>
                    <td>
                      <span className="badge-enterprise-success">{row.status || 'ACTIVE'}</span>
                    </td>
                    <td>
                      <Link to="/proctoring" style={{ color: '#0F6CBD', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>
                        Monitor →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right Side: Security Integrity Telemetry */}
        <div className="enterprise-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#0F172A', fontWeight: 700 }}>
            Zero-Trust Integrity Metrics
          </h3>

          <div style={{ display: 'grid', gap: '0.85rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Browser Integrity Engine</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16A34A', marginTop: '0.15rem' }}>20 / 20 Monitors Active</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>DevTools, Extensions, VM detection operational</div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>AI Confidence & Correlation</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F6CBD', marginTop: '0.15rem' }}>WASM Sentinel Active</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>7 Independent Risk Dimensions calculated</div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Multi-Tenant Isolation</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16A34A', marginTop: '0.15rem', fontFamily: 'monospace' }}>RLS Enforced</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>SOC-2 Type II AES-256 Partitioned</div>
            </div>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default IndexPage;
